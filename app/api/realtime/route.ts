import { NextRequest } from "next/server";
import {
  ClientMessage,
  JoinSessionData,
  Participant,
  SOCKET_EVENTS,
  UpdateProgressData,
} from "@/lib/socketTypes";

export const runtime = "edge";

type WebSocketPairInstance = {
  0: WebSocket;
  1: WebSocket;
};

declare const WebSocketPair: {
  new (): WebSocketPairInstance;
};

type EdgeWebSocket = WebSocket & {
  accept?: () => void;
};

type SessionParticipant = Participant & { socket: WebSocket };

interface SessionState {
  participants: Map<string, SessionParticipant>;
}

type SessionsStore = Map<string, SessionState>;

const globalScope = globalThis as typeof globalThis & {
  __quizSessions?: SessionsStore;
};

if (!globalScope.__quizSessions) {
  globalScope.__quizSessions = new Map();
}

const sessions = globalScope.__quizSessions;

const createParticipant = (
  payload: JoinSessionData,
  socket: WebSocket
): SessionParticipant => ({
  id: payload.userId,
  name: payload.userName,
  socketId: crypto.randomUUID(),
  score: 0,
  attempted: 0,
  progress: 0,
  lastUpdate: Date.now(),
  socket,
});

const serializeParticipants = (session: SessionState) =>
  Array.from(session.participants.values()).map(({ socket, ...rest }) => rest);

const broadcastSessionUpdate = (sessionId: string) => {
  const session = sessions.get(sessionId);
  if (!session) return;

  const serialized = serializeParticipants(session);
  const payload = JSON.stringify({
    type: SOCKET_EVENTS.SESSION_UPDATE,
    payload: {
      participants: serialized,
      totalParticipants: serialized.length,
    },
  });

  session.participants.forEach(({ socket }) => {
    try {
      socket.send(payload);
    } catch (error) {
      console.error("[Realtime] Failed to broadcast update", error);
    }
  });
};

const ensureSession = (sessionId: string) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, { participants: new Map() });
  }
  return sessions.get(sessionId)!;
};

const handleJoin = (payload: JoinSessionData, socket: WebSocket) => {
  if (!payload.sessionId || !payload.userId || !payload.userName) {
    socket.send(
      JSON.stringify({
        type: "error",
        payload: { message: "Missing session information" },
      })
    );
    return;
  }

  const session = ensureSession(payload.sessionId);
  const nextParticipant = createParticipant(payload, socket);
  session.participants.set(payload.userId, nextParticipant);
  broadcastSessionUpdate(payload.sessionId);
};

const handleProgress = (payload: UpdateProgressData) => {
  const session = sessions.get(payload.sessionId);
  if (!session) return;

  const participant = session.participants.get(payload.userId);
  if (!participant) return;

  participant.score = payload.score;
  participant.attempted = payload.attempted;
  participant.progress = payload.progress;
  participant.lastUpdate = Date.now();

  broadcastSessionUpdate(payload.sessionId);
};

const removeParticipant = (sessionId: string, userId: string) => {
  const session = sessions.get(sessionId);
  if (!session) return;

  if (!session.participants.delete(userId)) {
    return;
  }

  if (session.participants.size === 0) {
    sessions.delete(sessionId);
  } else {
    broadcastSessionUpdate(sessionId);
  }
};

const cleanupConnection = (socket: WebSocket) => {
  sessions.forEach((session, sessionId) => {
    session.participants.forEach((participant, userId) => {
      if (participant.socket === socket) {
        session.participants.delete(userId);
        if (session.participants.size === 0) {
          sessions.delete(sessionId);
        } else {
          broadcastSessionUpdate(sessionId);
        }
      }
    });
  });
};

export async function GET(request: NextRequest) {
  if (request.headers.get("upgrade") !== "websocket") {
    return new Response("Expected a WebSocket request", { status: 426 });
  }

  const { 0: client, 1: server } = new WebSocketPair();
  const socket = server as EdgeWebSocket;

  socket.accept?.();

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data?.toString() ?? "{}") as ClientMessage;

      switch (data.type) {
        case SOCKET_EVENTS.JOIN_SESSION:
          handleJoin(data.payload, socket);
          break;
        case SOCKET_EVENTS.UPDATE_PROGRESS:
          handleProgress(data.payload);
          break;
        case SOCKET_EVENTS.LEAVE_SESSION:
          removeParticipant(data.payload.sessionId, data.payload.userId);
          break;
        default:
          socket.send(
            JSON.stringify({
              type: "error",
              payload: { message: "Unknown event type" },
            })
          );
      }
    } catch (error) {
      console.error("[Realtime] Failed to process message", error);
      socket.send(
        JSON.stringify({
          type: "error",
          payload: { message: "Invalid message payload" },
        })
      );
    }
  });

  socket.addEventListener("close", () => {
    cleanupConnection(socket);
  });

  socket.addEventListener("error", () => {
    cleanupConnection(socket);
  });

  return new Response(null, { status: 101, webSocket: client });
}
