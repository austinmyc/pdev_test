"use client";

import type {
  Participant,
  QuestionStat,
  RecentAnswer,
} from "@/lib/socketTypes";

interface RealtimePerformanceProps {
  participants: Participant[];
  totalParticipants: number;
  isConnected: boolean;
  currentUserId: string;
  questionBreakdown?: QuestionStat | null;
  recentAnswers: RecentAnswer[];
  error?: string | null;
}

export default function RealtimePerformance({
  participants,
  totalParticipants,
  isConnected,
  currentUserId,
  questionBreakdown,
  recentAnswers,
  error,
}: RealtimePerformanceProps) {
  const getPerformanceDistribution = () => {
    const distribution: { [key: string]: number } = {
      "0-25%": 0,
      "26-50%": 0,
      "51-75%": 0,
      "76-100%": 0,
    };

    participants.forEach((p) => {
      const scorePercent = p.attempted > 0 ? (p.score / p.attempted) * 100 : 0;
      if (scorePercent <= 25) distribution["0-25%"]++;
      else if (scorePercent <= 50) distribution["26-50%"]++;
      else if (scorePercent <= 75) distribution["51-75%"]++;
      else distribution["76-100%"]++;
    });

    return distribution;
  };

  const getAverageProgress = () => {
    if (participants.length === 0) return 0;
    const totalProgress = participants.reduce((sum, p) => sum + p.progress, 0);
    return (totalProgress / participants.length).toFixed(1);
  };

  const getAverageScore = () => {
    const withAttempts = participants.filter((p) => p.attempted > 0);
    if (withAttempts.length === 0) return 0;
    const totalScore = withAttempts.reduce(
      (sum, p) => sum + (p.score / p.attempted) * 100,
      0,
    );
    return (totalScore / withAttempts.length).toFixed(1);
  };

  const distribution = getPerformanceDistribution();
  const sortedParticipants = [...participants].sort((a, b) => {
    const scoreA = a.attempted > 0 ? (a.score / a.attempted) * 100 : 0;
    const scoreB = b.attempted > 0 ? (b.score / b.attempted) * 100 : 0;
    return scoreB - scoreA;
  });

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Live Session</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm text-gray-400">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400">
          Unable to refresh the leaderboard: {error}
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-blue-400">{totalParticipants}</p>
        </div>
        <div className="bg-gray-900/50 p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Avg Progress</p>
          <p className="text-3xl font-bold text-purple-400">
            {getAverageProgress()}%
          </p>
        </div>
        <div className="bg-gray-900/50 p-4 border border-gray-700">
          <p className="text-sm text-gray-400 mb-1">Avg Score</p>
          <p className="text-3xl font-bold text-green-400">
            {getAverageScore()}%
          </p>
        </div>
      </div>

      {questionBreakdown && questionBreakdown.choices.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-300">
              Question {questionBreakdown.questionId} Responses
            </h4>
            <span className="text-xs text-gray-400">
              {questionBreakdown.totalResponses} responses
            </span>
          </div>
          <div className="space-y-3">
            {questionBreakdown.choices.map((choice) => {
              const percentage =
                questionBreakdown.totalResponses > 0
                  ? (choice.count / questionBreakdown.totalResponses) * 100
                  : 0;
              return (
                <div key={choice.optionId}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{choice.label}</span>
                    <span>{choice.count} votes</span>
                  </div>
                  <div className="bg-gray-700 h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Score Distribution
        </h4>
        <div className="space-y-2">
          {Object.entries(distribution).map(([range, count]) => {
            const percentage =
              totalParticipants > 0 ? (count / totalParticipants) * 100 : 0;
            return (
              <div key={range} className="flex items-center gap-3">
                <span className="text-sm text-gray-400 w-20">{range}</span>
                <div className="flex-1 bg-gray-700 h-6 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                    {count} users
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Live Leaderboard
        </h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {sortedParticipants.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Waiting for participants...
            </p>
          ) : (
            sortedParticipants.map((participant, index) => {
              const scorePercent =
                participant.attempted > 0
                  ? ((participant.score / participant.attempted) * 100).toFixed(0)
                  : "0";
              const isCurrentUser = participant.id === currentUserId;

              return (
                <div
                  key={participant.id}
                  className={`flex items-center gap-3 p-3 ${
                    isCurrentUser
                      ? "bg-blue-900/30 border border-blue-700"
                      : "bg-gray-900/30"
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center font-bold text-lg">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">
                      {participant.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-400">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      {participant.attempted} attempted •{" "}
                      {participant.progress.toFixed(0)}% complete
                    </p>
                    {participant.lastAnswerLabel && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        Last answer: {participant.lastAnswerLabel}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">
                      {scorePercent}%
                    </p>
                    <p className="text-xs text-gray-400">
                      {participant.score}/{participant.attempted}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          Recent Answers
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {recentAnswers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">
              Waiting for responses...
            </p>
          ) : (
            recentAnswers.map((answer, index) => (
              <div
                key={`${answer.userId}-${answer.timestamp}-${index}`}
                className="flex items-center justify-between bg-gray-900/40 p-3 border border-gray-700/60"
              >
                <p className="text-sm text-white font-semibold">
                  {answer.userName}
                </p>
                <span
                  className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                    answer.isCorrect
                      ? "bg-green-900/40 text-green-400"
                      : "bg-red-900/40 text-red-400"
                  }`}
                >
                  {answer.isCorrect ? "✓" : "✗"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
