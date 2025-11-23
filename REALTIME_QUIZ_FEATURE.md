# Real-Time Collaborative Quiz Feature

## Overview
The quiz application now supports real-time collaborative features similar to Mentimeter, powered by Redis instead of WebSockets. Sessions stream their progress into Redis via lightweight API calls, which enables serverless-friendly deployments while still giving every participant an up-to-date leaderboard and answer breakdown.

## Features

### 1. Session-Based Collaboration
- Each quiz submission is recorded through a serverless API call
- Redis stores per-session participant stats, answer selections, and recent activity
- Automatic session management with unique session IDs and short TTLs to keep Redis clean

### 2. Real-Time Performance Tracking
- **Live Leaderboard**: See how you rank against other participants
- **Score Distribution**: View how many users are in each performance bracket (0-25%, 26-50%, 51-75%, 76-100%)
- **Question Breakdown**: Mentimeter-style bars showing how many people picked each option
- **Recent Answers Feed**: Scrollable list showing who picked what and whether it was correct
- **Average Statistics**: Track average progress and scores across all participants
- **Active Users Count**: See how many people are currently taking the quiz

### 3. User Experience
- **Display Name Card**: Users can edit their leaderboard name inline on the Practice page
- **Live Updates**: Client polls Redis-backed API every few seconds (no persistent sockets)
- **Connection Status**: Visual indicator mirrors the polling status
- **Personal Highlighting**: Your own entry is highlighted in the leaderboard

## Technical Implementation

### Architecture
- **Backend**: Serverless API route (`app/api/live/route.ts`) that reads/writes Redis
- **Data store**: Managed Redis (hosted Redislabs/Upstash/etc.). All session data lives in Redis hashes/lists with 1-hour TTLs.
- **Frontend**: `useLeaderboard` hook polls `/api/live` and feeds the enhanced `RealtimePerformance` component
- **Data flow**:
  1. When a participant submits an answer, the Practice page posts their stats to `/api/live`
  2. The API stores participant summaries, question-level counts, and a recent answer feed in Redis
  3. Every client polls `/api/live?sessionId=...` to refresh the leaderboard and Mentimeter-style charts

### Files Added/Modified

#### New Files
- `app/api/live/route.ts` - REST API for recording answers and fetching leaderboard data
- `lib/redisClient.ts` - Shared Redis singleton for serverless environments
- `hooks/useLeaderboard.ts` - Polling hook that replaces the old WebSocket hook
- `components/RealtimePerformance.tsx` - Updated to show leaderboard, question breakdown, and recent answers

#### Modified Files
- `app/practice/page.tsx` - Integrated Redis-powered live updates, name controls, and the updated dashboard
- `lib/socketTypes.ts` - Replaced socket event types with Redis-friendly payloads
- `package.json`/`package-lock.json` - Added the official `redis` client dependency
- `REALTIME_QUIZ_FEATURE.md` - Documented the new architecture

### Dependencies Added
- `redis` – Official Node.js client used by the API route

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
2. Set your display name in the "Display Name" card (optional, defaults to "Guest Analyst")
3. Start answering questions
4. The page will automatically push your progress to Redis and poll for everyone else's updates

## Data Tracked
- **Score**: Number of correct answers / total attempts
- **Progress**: Percentage of quiz completed
- **Attempted**: Number of questions attempted
- **Participants**: Live participant list pulled from Redis hashes
- **Question stats**: Per-option counts for multiple-choice problems
- **Recent answers**: Rolling feed capped at the latest 50 submissions

## Privacy & Data
- All session data is stored in Redis with a 1-hour TTL per session
- No personal data is permanently stored; user names are editable and optional
- User IDs are generated locally and persisted in `localStorage`
- Redis keys are namespaced per session to avoid collisions

## Environment Variables

Provide either a single `REDIS_URL` (`redis://user:pass@host:port`) or the host-based configuration. Supported keys:

- `REDIS_URL` *(preferred)*
- `REDIS_HOST`, `REDIS_PORT`
- `REDIS_USERNAME`, `REDIS_PASSWORD`
- `REDIS_USE_TLS` (set to `"true"` if your provider requires TLS)

## Future Enhancements
- Persistent sessions with database storage
- Session history and analytics
- Private vs. public session modes
- Instructor/host controls
- Chat functionality
- Custom session codes for easier joining
