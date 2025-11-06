"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  Participant,
  SessionUpdate,
  JoinSessionData,
  UpdateProgressData,
  SOCKET_EVENTS,
} from "@/lib/socketTypes";

const SOCKET_EVENTS_NAMES = {
  JOIN_SESSION: 'join-session',
  LEAVE_SESSION: 'leave-session',
  UPDATE_PROGRESS: 'update-progress',
  SESSION_UPDATE: 'session-update',
} as const;

export function useQuizSocket(sessionId: string, userId: string, userName: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      path: '/socket.io',
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);

      // Join the session
      const joinData: JoinSessionData = {
        sessionId,
        userId,
        userName,
      };
      socket.emit(SOCKET_EVENTS_NAMES.JOIN_SESSION, joinData);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    // Listen for session updates
    socket.on(SOCKET_EVENTS_NAMES.SESSION_UPDATE, (data: SessionUpdate) => {
      setParticipants(data.participants);
      setTotalParticipants(data.totalParticipants);
    });

    // Cleanup on unmount
    return () => {
      if (socket.connected) {
        socket.emit(SOCKET_EVENTS_NAMES.LEAVE_SESSION, { sessionId, userId });
      }
      socket.disconnect();
    };
  }, [sessionId, userId, userName]);

  // Function to update progress
  const updateProgress = (score: number, attempted: number, progress: number) => {
    if (socketRef.current?.connected) {
      const updateData: UpdateProgressData = {
        sessionId,
        userId,
        score,
        attempted,
        progress,
      };
      socketRef.current.emit(SOCKET_EVENTS_NAMES.UPDATE_PROGRESS, updateData);
    }
  };

  return {
    isConnected,
    participants,
    totalParticipants,
    updateProgress,
  };
}
