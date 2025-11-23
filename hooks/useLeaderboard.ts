"use client";

import { useEffect, useState } from "react";
import type {
  Participant,
  QuestionStat,
  RecentAnswer,
  LeaderboardResponse,
} from "@/lib/socketTypes";

const DEFAULT_POLL_INTERVAL = 1000;

export function useLeaderboard(
  sessionId: string,
  questionId?: string,
  pollInterval = DEFAULT_POLL_INTERVAL,
  userId?: string,
) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [recentAnswers, setRecentAnswers] = useState<RecentAnswer[]>([]);
  const [questionBreakdown, setQuestionBreakdown] = useState<QuestionStat | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setParticipants([]);
      setTotalParticipants(0);
      setRecentAnswers([]);
      setQuestionBreakdown(null);
      setIsConnected(false);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let aborted = false;

    const fetchLeaderboard = async () => {
      if (!sessionId) return;
      try {
        const url = new URL("/api/live", window.location.origin);
        url.searchParams.set("sessionId", sessionId);
        if (userId) {
          url.searchParams.set("userId", userId);
        }
        
        const response = await fetch(url.toString(), {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard (${response.status})`);
        }

        const data = (await response.json()) as LeaderboardResponse;
        if (aborted) return;

        setParticipants(Array.isArray(data.participants) ? data.participants : []);
        setTotalParticipants(typeof data.totalParticipants === "number" ? data.totalParticipants : 0);
        setRecentAnswers(Array.isArray(data.recentAnswers) ? data.recentAnswers : []);
        setQuestionBreakdown(
          questionId && data.questionStats ? data.questionStats[questionId] ?? null : null,
        );
        setIsConnected(true);
        setError(null);
      } catch (err) {
        if (aborted) return;
        setIsConnected(false);
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        if (!aborted) {
          timeoutId = setTimeout(fetchLeaderboard, pollInterval);
        }
      }
    };

    fetchLeaderboard();

    return () => {
      aborted = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sessionId, questionId, pollInterval, userId]);

  return {
    participants,
    totalParticipants,
    recentAnswers,
    questionBreakdown,
    isConnected,
    error,
  };
}
