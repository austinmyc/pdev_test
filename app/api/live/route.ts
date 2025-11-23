import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/redisClient";
import type {
  LeaderboardResponse,
  Participant,
  QuestionStat,
  RecentAnswer,
  RecordAnswerPayload,
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
  let payload: RecordAnswerPayload;
  try {
    payload = (await request.json()) as RecordAnswerPayload;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body", details: error instanceof Error ? error.message : String(error) },
      { status: 400 },
    );
  }

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

  const missingField = requiredFields.find((field) => payload[field] === undefined || payload[field] === null);
  if (missingField) {
    return NextResponse.json(
      { error: `Missing required field: ${missingField}` },
      { status: 400 },
    );
  }

  try {
    const client = await getRedisClient();
    const sessionId = payload.sessionId;

    const participant: Participant = {
      id: payload.userId,
      name: payload.userName || "Anonymous",
      score: payload.score,
      attempted: payload.attempted,
      progress: payload.progress,
      lastUpdate: Date.now(),
      lastQuestionId: payload.questionId,
      lastAnswerLabel: sanitizeAnswerLabel(payload.answerLabel),
      lastAnswerIsCorrect: payload.isCorrect,
    };

    await client.hSet(participantsKey(sessionId), participant.id, JSON.stringify(participant));
    await withSessionTtl(client, [participantsKey(sessionId)]);

    if (payload.answerType === "multiple-choice" && payload.answerOptionId) {
      const optionField = `option:${payload.answerOptionId}`;
      await Promise.all([
        client.hIncrBy(questionCountsKey(sessionId, payload.questionId), optionField, 1),
        client.hSet(questionMetaKey(sessionId, payload.questionId), {
          [optionField]: sanitizeAnswerLabel(payload.answerLabel),
          __questionText: payload.questionText,
        }),
        client.sAdd(questionRegistryKey(sessionId), payload.questionId),
      ]);

      await withSessionTtl(client, [
        questionCountsKey(sessionId, payload.questionId),
        questionMetaKey(sessionId, payload.questionId),
        questionRegistryKey(sessionId),
      ]);
    }

    const answerEntry: RecentAnswer = {
      userId: payload.userId,
      userName: payload.userName || "Anonymous",
      questionId: payload.questionId,
      questionText: payload.questionText,
      answerLabel: sanitizeAnswerLabel(payload.answerLabel),
      isCorrect: payload.isCorrect,
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

export async function GET(request: NextRequest) {
  try {
    const sessionId = ensureSessionId(request.nextUrl.searchParams.get("sessionId"));
    const client = await getRedisClient();

    const participantsRaw = await client.hGetAll(participantsKey(sessionId));
    const participants: Participant[] = Object.values(participantsRaw).map((value) => {
      try {
        return JSON.parse(value) as Participant;
      } catch {
        return null;
      }
    }).filter((participant): participant is Participant => Boolean(participant));

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
