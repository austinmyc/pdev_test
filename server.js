const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// In-memory storage for quiz sessions
const quizSessions = new Map();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a quiz session
    socket.on('join-session', (data) => {
      const { sessionId, userId, userName } = data;

      socket.join(sessionId);

      // Initialize session if it doesn't exist
      if (!quizSessions.has(sessionId)) {
        quizSessions.set(sessionId, {
          participants: new Map(),
          startTime: Date.now()
        });
      }

      const session = quizSessions.get(sessionId);

      // Add or update participant
      session.participants.set(userId, {
        id: userId,
        name: userName || `User ${userId.substring(0, 6)}`,
        socketId: socket.id,
        score: 0,
        attempted: 0,
        progress: 0,
        lastUpdate: Date.now()
      });

      console.log(`User ${userName} joined session ${sessionId}`);

      // Broadcast updated participant list to all in session
      io.to(sessionId).emit('session-update', {
        participants: Array.from(session.participants.values()),
        totalParticipants: session.participants.size
      });
    });

    // Update user progress
    socket.on('update-progress', (data) => {
      const { sessionId, userId, score, attempted, progress } = data;

      if (quizSessions.has(sessionId)) {
        const session = quizSessions.get(sessionId);

        if (session.participants.has(userId)) {
          const participant = session.participants.get(userId);
          participant.score = score;
          participant.attempted = attempted;
          participant.progress = progress;
          participant.lastUpdate = Date.now();

          // Broadcast updated stats to all participants
          io.to(sessionId).emit('session-update', {
            participants: Array.from(session.participants.values()),
            totalParticipants: session.participants.size
          });
        }
      }
    });

    // Leave session
    socket.on('leave-session', (data) => {
      const { sessionId, userId } = data;

      if (quizSessions.has(sessionId)) {
        const session = quizSessions.get(sessionId);
        session.participants.delete(userId);

        socket.leave(sessionId);

        // Broadcast updated participant list
        io.to(sessionId).emit('session-update', {
          participants: Array.from(session.participants.values()),
          totalParticipants: session.participants.size
        });

        // Clean up empty sessions
        if (session.participants.size === 0) {
          quizSessions.delete(sessionId);
          console.log(`Session ${sessionId} cleaned up (no participants)`);
        }
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);

      // Remove participant from all sessions
      quizSessions.forEach((session, sessionId) => {
        let participantToRemove = null;

        session.participants.forEach((participant, userId) => {
          if (participant.socketId === socket.id) {
            participantToRemove = userId;
          }
        });

        if (participantToRemove) {
          session.participants.delete(participantToRemove);

          // Broadcast updated participant list
          io.to(sessionId).emit('session-update', {
            participants: Array.from(session.participants.values()),
            totalParticipants: session.participants.size
          });

          // Clean up empty sessions
          if (session.participants.size === 0) {
            quizSessions.delete(sessionId);
            console.log(`Session ${sessionId} cleaned up (no participants)`);
          }
        }
      });
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
