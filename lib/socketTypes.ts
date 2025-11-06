// Types for Socket.io events and data structures

export interface Participant {
  id: string;
  name: string;
  socketId: string;
  score: number;
  attempted: number;
  progress: number; // percentage 0-100
  lastUpdate: number;
}

export interface SessionUpdate {
  participants: Participant[];
  totalParticipants: number;
}

export interface JoinSessionData {
  sessionId: string;
  userId: string;
  userName: string;
}

export interface UpdateProgressData {
  sessionId: string;
  userId: string;
  score: number;
  attempted: number;
  progress: number;
}

export interface LeaveSessionData {
  sessionId: string;
  userId: string;
}

// Socket event names
export const SOCKET_EVENTS = {
  JOIN_SESSION: 'join-session',
  LEAVE_SESSION: 'leave-session',
  UPDATE_PROGRESS: 'update-progress',
  SESSION_UPDATE: 'session-update',
} as const;
