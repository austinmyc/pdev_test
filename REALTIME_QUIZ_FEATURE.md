# Real-Time Collaborative Quiz Feature

## Overview
The quiz application now supports real-time collaborative features similar to Mentimeter, allowing users to see other participants' performance in real-time during quiz sessions.

## Features

### 1. Session-Based Collaboration
- Each quiz session establishes a WebSocket connection to the server
- Users join a shared session and can see other participants in real-time
- Automatic session management with unique session IDs

### 2. Real-Time Performance Tracking
- **Live Leaderboard**: See how you rank against other participants
- **Score Distribution**: View how many users are in each performance bracket (0-25%, 26-50%, 51-75%, 76-100%)
- **Average Statistics**: Track average progress and scores across all participants
- **Active Users Count**: See how many people are currently taking the quiz

### 3. User Experience
- **Welcome Modal**: Users enter their name before joining a session
- **Live Updates**: All statistics update in real-time as users answer questions
- **Connection Status**: Visual indicator showing WebSocket connection status
- **Personal Highlighting**: Your own entry is highlighted in the leaderboard

## Technical Implementation

### Architecture
- **Backend**: Custom Node.js server with Socket.io integration
- **Frontend**: React hooks for WebSocket management
- **Real-time Events**:
  - `join-session`: User joins a quiz session
  - `update-progress`: User submits an answer
  - `session-update`: Broadcast to all participants with updated stats
  - `leave-session`: User exits the session

### Files Added/Modified

#### New Files
- `server.js` - Custom Next.js server with Socket.io
- `lib/socketTypes.ts` - TypeScript types for Socket.io events
- `hooks/useQuizSocket.ts` - React hook for WebSocket management
- `components/RealtimePerformance.tsx` - Real-time dashboard component

#### Modified Files
- `app/practice/page.tsx` - Integrated WebSocket functionality
- `package.json` - Updated scripts to use custom server

### Dependencies Added
- `socket.io` (^4.8.1)
- `socket.io-client` (^4.8.1)

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## Usage

1. Navigate to the Practice Quiz page
2. Enter your name in the welcome modal
3. Click "Start Quiz Session"
4. Answer quiz questions as normal
5. Watch the real-time leaderboard update as you and others progress

## Data Tracked
- **Score**: Number of correct answers / total attempts
- **Progress**: Percentage of quiz completed
- **Attempted**: Number of questions attempted
- **Participants**: List of all active users in the session

## Privacy & Data
- All session data is stored in-memory on the server
- No personal data is permanently stored
- Sessions are automatically cleaned up when all participants leave
- User IDs are randomly generated and stored locally

## Future Enhancements
- Persistent sessions with database storage
- Session history and analytics
- Private vs. public session modes
- Instructor/host controls
- Chat functionality
- Custom session codes for easier joining
