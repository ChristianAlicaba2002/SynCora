# SynCora

**Syncora** is a mobile-only task and activity manager built with React Native and Expo. Users organize work into activities and tasks, set priority and status, collaborate with others, and sign in with email/password or Google.

## Features

### Activities & tasks
- Create and manage **activities** (containers for related work)
- Add **tasks** under activities with title, description, and due dates
- **Priority**: `high` | `medium` | `low`
- **Status**: `pending` | `in_progress` | `done`

### Collaboration
- **Invite** other users to shared activities or tasks
- **Follow** users to see their public activity (where permitted)
- Real-time updates via Supabase (planned)

### Authentication
- **Email & password** — sign up, log in, log out
- **Google Sign-In** — OAuth via Supabase (mobile)
- Session handled on device; protected routes in the app

### Platform
- **Mobile only** — iOS and Android via Expo
- No web client target for v1

## Tech stack

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Client      | React Native, Expo SDK 54, Expo Router |
| Auth        | Supabase Authentication (email + Google) |
| Backend     | C# .NET, Supabase (Postgres, REST/Realtime) |
| Language    | TypeScript                          |

**Architecture (planned)**


## Data model (planned)

### Task fields
| Field      | Values                                      |
|-----------|---------------------------------------------|
| priority  | `high`, `medium`, `low`                   |
| status    | `pending`, `in_progress`, `done`            |

### Core entities
- **profiles** — linked to Supabase UID
- **activities** — owned or shared workspaces
- **tasks** — belong to an activity; priority + status
- **invitations** — pending/accepted invites to collaborate
- **follows** — follower → followee relationships

## Getting started

### 1. Clone and install
- Using HTTPS
```bash
git clone https://github.com/ChristianAlicaba2002/SynCora.git
cd Syncora
npm install
```
- Using SSH
```bash
git clone git@github.com:ChristianAlicaba2002/SynCora.git
cd Syncora
npm install
```
---
### 2. Run the app

```bash 
npx expo start
npm run ios      # shortcut
npm run android  # shortcut
```