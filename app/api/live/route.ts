import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redisClient";
import type {
  LeaderboardResponse,
  Participant,
  QuestionStat,
  RecentAnswer,
  RecordAnswerPayload,
  JoinSessionPayload,
  LeaveSessionPayload,
} from "@/lib/socketTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_TTL_SECONDS = 60 * 60; // 1 hour

const participantsKey = (sessionId: string) => `quiz:${sessionId}:participants`;
const questionCountsKey = (sessionId: string, questionId: string) =>
  `quiz:${sessionId}:question:${questionId}:counts`;
const questionMetaKey = (sessionId: string, questionId: string) =>
  `quiz:${sessionId}:question:${questionId}:meta`;
const questionRegistryKey = (sessionId: string) => `quiz:${sessionId}:questions`;
const recentAnswersKey = (sessionId: string) => `quiz:${sessionId}:recentAnswers`;

const ensureSessionId = (value: string | null) => {
  if (!value) {
    throw new Error("sessionId is required");
  }
  return value;
};

const sanitizeAnswerLabel = (label?: string | null) => {
  if (!label) return "—";
  return label.slice(0, 256);
};

const withSessionTtl = async (client: Awaited<ReturnType<typeof getRedisClient>>, keys: string[]) => {
  await Promise.all(
    keys.map((key) =>
      client
        .expire(key, SESSION_TTL_SECONDS)
        .catch((error) => console.error("[Realtime] Failed to set TTL", key, error)),
    ),
  );
};

export async function POST(request: NextRequest) {
  let payload: RecordAnswerPayload | JoinSessionPayload | LeaveSessionPayload & { action?: string };
  try {
    payload = (await request.json()) as RecordAnswerPayload | JoinSessionPayload | (LeaveSessionPayload & { action?: string });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body", details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }

  // Check if this is a leave request
  if ("action" in payload && payload.action === "leave") {
    const leavePayload = payload as LeaveSessionPayload;
    if (!leavePayload.sessionId || !leavePayload.userId) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, userId" },
        { status: 400 },
      );
    }

    try {
      const client = await getRedisClient();
      await client.hDel(participantsKey(leavePayload.sessionId), leavePayload.userId);
      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[Realtime] Failed to leave session", error);
      return NextResponse.json(
        { error: "Failed to leave session", details: error instanceof Error ? error.message : String(error) },
        { status: 500 },
      );
    }
  }

  // Check if this is a join request or an answer submission
  const isJoinRequest = "sessionId" in payload && "userId" in payload && "userName" in payload && !("questionId" in payload);

  if (isJoinRequest) {
    // Handle join request
    const joinPayload = payload as JoinSessionPayload;
    
    if (!joinPayload.sessionId || !joinPayload.userId || !joinPayload.userName) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, userId, userName" },
        { status: 400 },
      );
    }

    try {
      const client = await getRedisClient();
      const sessionId = joinPayload.sessionId;

      // Check if participant already exists, if not create with default values
      const existingParticipant = await client.hGet(participantsKey(sessionId), joinPayload.userId);
      
      if (!existingParticipant) {
        // Create new participant entry
        const participant: Participant = {
          id: joinPayload.userId,
          name: joinPayload.userName || "Anonymous",
          score: 0,
          attempted: 0,
          progress: 0,
          lastUpdate: Date.now(),
        };

        await client.hSet(participantsKey(sessionId), participant.id, JSON.stringify(participant));
        await withSessionTtl(client, [participantsKey(sessionId)]);
      } else {
        // Update existing participant's name and lastUpdate if needed
        try {
          const existing = JSON.parse(existingParticipant) as Participant;
          existing.name = joinPayload.userName || "Anonymous";
          existing.lastUpdate = Date.now();
          await client.hSet(participantsKey(sessionId), existing.id, JSON.stringify(existing));
          await withSessionTtl(client, [participantsKey(sessionId)]);
        } catch {
          // If parse fails, create new entry
          const participant: Participant = {
            id: joinPayload.userId,
            name: joinPayload.userName || "Anonymous",
            score: 0,
            attempted: 0,
            progress: 0,
            lastUpdate: Date.now(),
          };
          await client.hSet(participantsKey(sessionId), participant.id, JSON.stringify(participant));
          await withSessionTtl(client, [participantsKey(sessionId)]);
        }
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[Realtime] Failed to join session", error);
      return NextResponse.json(
        { error: "Failed to join session", details: error instanceof Error ? error.message : String(error) },
        { status: 500 },
      );
    }
  }

  // Handle answer submission (existing logic)
  const answerPayload = payload as RecordAnswerPayload;
  const requiredFields: Array<keyof RecordAnswerPayload> = [
    "sessionId",
    "userId",
    "userName",
    "score",
    "attempted",
    "progress",
    "questionId",
    "questionText",
    "answerType",
    "isCorrect",
  ];

  const missingField = requiredFields.find((field) => answerPayload[field] === undefined || answerPayload[field] === null);
  if (missingField) {
    return NextResponse.json(
      { error: `Missing required field: ${missingField}` },
      { status: 400 },
    );
  }

  try {
    const client = await getRedisClient();
    const sessionId = answerPayload.sessionId;

    const participant: Participant = {
      id: answerPayload.userId,
      name: answerPayload.userName || "Anonymous",
      score: answerPayload.score,
      attempted: answerPayload.attempted,
      progress: answerPayload.progress,
      lastUpdate: Date.now(),
      lastQuestionId: answerPayload.questionId,
      lastAnswerLabel: sanitizeAnswerLabel(answerPayload.answerLabel),
      lastAnswerIsCorrect: answerPayload.isCorrect,
    };

    await client.hSet(participantsKey(sessionId), participant.id, JSON.stringify(participant));
    await withSessionTtl(client, [participantsKey(sessionId)]);

    if (answerPayload.answerType === "multiple-choice" && answerPayload.answerOptionId) {
      const optionField = `option:${answerPayload.answerOptionId}`;
      await Promise.all([
        client.hIncrBy(questionCountsKey(sessionId, answerPayload.questionId), optionField, 1),
        client.hSet(questionMetaKey(sessionId, answerPayload.questionId), {
          [optionField]: sanitizeAnswerLabel(answerPayload.answerLabel),
          __questionText: answerPayload.questionText,
        }),
        client.sAdd(questionRegistryKey(sessionId), answerPayload.questionId),
      ]);

      await withSessionTtl(client, [
        questionCountsKey(sessionId, answerPayload.questionId),
        questionMetaKey(sessionId, answerPayload.questionId),
        questionRegistryKey(sessionId),
      ]);
    }

    const answerEntry: RecentAnswer = {
      userId: answerPayload.userId,
      userName: answerPayload.userName || "Anonymous",
      questionId: answerPayload.questionId,
      questionText: answerPayload.questionText,
      answerLabel: sanitizeAnswerLabel(answerPayload.answerLabel),
      isCorrect: answerPayload.isCorrect,
      timestamp: Date.now(),
    };

    await client.lPush(recentAnswersKey(sessionId), JSON.stringify(answerEntry));
    await client.lTrim(recentAnswersKey(sessionId), 0, 49);
    await withSessionTtl(client, [recentAnswersKey(sessionId)]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Realtime] Failed to record answer", error);
    return NextResponse.json(
      { error: "Failed to record answer", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

const buildQuestionStats = (counts: Record<string, string>, meta: Record<string, string>, questionId: string): QuestionStat => {
  const choices = Object.entries(counts)
    .filter(([field]) => field.startsWith("option:"))
    .map(([field, value]) => {
      const optionId = field.replace("option:", "");
      const label = meta[field] || `Option ${optionId}`;
      return {
        optionId,
        label,
        count: Number(value) || 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  const totalResponses = choices.reduce((sum, choice) => sum + choice.count, 0);

  return {
    questionId,
    questionText: meta.__questionText || "Question",
    totalResponses,
    choices,
  };
};

const STALE_USER_THRESHOLD_MS = 30 * 1000; // 30 seconds

export async function DELETE(request: NextRequest) {
  let payload: LeaveSessionPayload;
  
  // Try to get payload from body first (for fetch requests)
  try {
    const bodyText = await request.text();
    if (bodyText) {
      payload = JSON.parse(bodyText) as LeaveSessionPayload;
    } else {
      // Fallback to query params if no body
      payload = {
        sessionId: request.nextUrl.searchParams.get("sessionId") || "",
        userId: request.nextUrl.searchParams.get("userId") || "",
      };
    }
  } catch (error) {
    // If body parsing fails, try query params
    payload = {
      sessionId: request.nextUrl.searchParams.get("sessionId") || "",
      userId: request.nextUrl.searchParams.get("userId") || "",
    };
  }

  if (!payload.sessionId || !payload.userId) {
    return NextResponse.json(
      { error: "Missing required fields: sessionId, userId" },
      { status: 400 },
    );
  }

  try {
    const client = await getRedisClient();
    const sessionId = payload.sessionId;
    const userId = payload.userId;

    // Remove participant from Redis
    await client.hDel(participantsKey(sessionId), userId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Realtime] Failed to leave session", error);
    return NextResponse.json(
      { error: "Failed to leave session", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = ensureSessionId(request.nextUrl.searchParams.get("sessionId"));
    const client = await getRedisClient();

    const participantsRaw = await client.hGetAll(participantsKey(sessionId));
    const now = Date.now();
    const participants: Participant[] = Object.values(participantsRaw)
      .map((value) => {
        try {
          return JSON.parse(value) as Participant;
        } catch {
          return null;
        }
      })
      .filter((participant): participant is Participant => Boolean(participant))
      .filter((participant) => {
        // Filter out stale users (haven't updated in 30 seconds)
        const timeSinceUpdate = now - participant.lastUpdate;
        if (timeSinceUpdate > STALE_USER_THRESHOLD_MS) {
          // Remove stale user from Redis
          client.hDel(participantsKey(sessionId), participant.id).catch((err) =>
            console.error("[Realtime] Failed to remove stale user", err)
          );
          return false;
        }
        return true;
      });

    const questionIds = await client.sMembers(questionRegistryKey(sessionId));
    const questionStatsEntries = await Promise.all(
      questionIds.map(async (questionId) => {
        const [counts, meta] = await Promise.all([
          client.hGetAll(questionCountsKey(sessionId, questionId)),
          client.hGetAll(questionMetaKey(sessionId, questionId)),
        ]);

        if (Object.keys(counts).length === 0) {
          return null;
        }

        return buildQuestionStats(counts, meta, questionId);
      }),
    );

    const questionStats: Record<string, QuestionStat> = {};
    questionStatsEntries
      .filter((entry): entry is QuestionStat => Boolean(entry))
      .forEach((entry) => {
        questionStats[entry.questionId] = entry;
      });

    const recentAnswersRaw = await client.lRange(recentAnswersKey(sessionId), 0, 19);
    const recentAnswers: RecentAnswer[] = recentAnswersRaw
      .map((value) => {
        try {
          return JSON.parse(value) as RecentAnswer;
        } catch {
          return null;
        }
      })
      .filter((entry): entry is RecentAnswer => Boolean(entry));

    const response: LeaderboardResponse = {
      participants,
      totalParticipants: participants.length,
      questionStats,
      recentAnswers,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }
}
