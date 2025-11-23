"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ClientMessage,
  Participant,
  ServerMessage,
} from "@/lib/socketTypes";
import { SOCKET_EVENTS } from "@/lib/socketTypes";

const SOCKET_PATH = "/api/realtime";

const getSocketUrl = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const configuredUrl = process.env.NEXT_PUBLIC_REALTIME_URL;
  if (configuredUrl) {
    return configuredUrl;
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${window.location.host}${SOCKET_PATH}`;
};

export function useQuizSocket(
  sessionId: string,
  userId: string,
  userName: string
) {
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId || !userId || !userName) {
      return;
    }

    const socketUrl = getSocketUrl();
    if (!socketUrl) {
      return;
    }

    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    const send = (message: ClientMessage) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    };

    socket.addEventListener("open", () => {
      console.log("[Realtime] WebSocket connected");
      setIsConnected(true);
      send({
        type: SOCKET_EVENTS.JOIN_SESSION,
        payload: {
          sessionId,
          userId,
          userName,
        },
      });
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data) as ServerMessage;
        console.log("[Realtime] Received message:", data.type, data);
        if (data.type === SOCKET_EVENTS.SESSION_UPDATE) {
          console.log("[Realtime] Updating participants:", data.payload.participants.length);
          setParticipants(data.payload.participants);
          setTotalParticipants(data.payload.totalParticipants);
        }
      } catch (error) {
        console.error("[Realtime] Failed to parse message", error);
      }
    });

    socket.addEventListener("close", (event) => {
      console.log("[Realtime] WebSocket closed", event.code, event.reason);
      setIsConnected(false);
    });

    socket.addEventListener("error", (event: Event) => {
      console.error("[Realtime] Socket error", event);
      setIsConnected(false);
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: SOCKET_EVENTS.LEAVE_SESSION,
            payload: { sessionId, userId },
          })
        );
      }

      socket.close();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [sessionId, userId, userName]);

  const updateProgress = useCallback(
    (score: number, attempted: number, progress: number) => {
      const socket = socketRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.log("[Realtime] Cannot update progress - socket not ready", {
          hasSocket: !!socket,
          readyState: socket?.readyState,
        });
        return;
      }

      console.log("[Realtime] Sending progress update", { score, attempted, progress });
      socket.send(
        JSON.stringify({
          type: SOCKET_EVENTS.UPDATE_PROGRESS,
          payload: {
            sessionId,
            userId,
            score,
            attempted,
            progress,
          },
        })
      );
    },
    [sessionId, userId]
  );

  return {
    isConnected,
    participants,
    totalParticipants,
    updateProgress,
  };
}
