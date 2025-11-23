export interface Participant {
  id: string;
  name: string;
  score: number;
  attempted: number;
  progress: number; // percentage 0-100
  lastUpdate: number;
  lastQuestionId?: string;
  lastAnswerLabel?: string;
  lastAnswerIsCorrect?: boolean;
}

export interface QuestionChoiceStat {
  optionId: string;
  label: string;
  count: number;
}

export interface QuestionStat {
  questionId: string;
  questionText: string;
  totalResponses: number;
  choices: QuestionChoiceStat[];
}

export interface RecentAnswer {
  userId: string;
  userName: string;
  questionId: string;
  questionText: string;
  answerLabel: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface LeaderboardResponse {
  participants: Participant[];
  totalParticipants: number;
  questionStats: Record<string, QuestionStat>;
  recentAnswers: RecentAnswer[];
}

export interface RecordAnswerPayload {
  sessionId: string;
  userId: string;
  userName: string;
  score: number;
  attempted: number;
  progress: number;
  questionId: string;
  questionText: string;
  answerType: "multiple-choice" | "calculation";
  answerOptionId?: string;
  answerLabel?: string;
  isCorrect: boolean;
}
