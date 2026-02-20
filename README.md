# ScopeGuard

AI-powered meeting analyzer that detects scope creep in real-time.

## Features

- **Contract Analysis**: Upload your SOW/contract and AI extracts the scope
- **Meeting Transcription**: Upload audio files (Whisper API) or paste transcripts
- **Scope Creep Detection**: GPT-4o analyzes meetings against your contract
- **Real-time Alerts**: Get notified when clients request out-of-scope work
- **Draft Responses**: Pre-written professional responses to handle scope changes

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI Whisper (transcription) + GPT-4o (analysis)
- **Deployment**: Vercel

## Setup

### 1. Clone and Install

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the schema from `supabase/schema.sql` in the SQL Editor
3. Get your project URL and anon key from Settings > API

### 3. Set up OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Ensure you have Whisper and GPT-4o access

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel

```bash
vercel --prod
```

Add environment variables in Vercel dashboard.

### Supabase

Already deployed - just use your project URL.

## Usage

1. **Sign up** at `/signup`
2. **Create a project** and paste your contract/SOW
3. **Upload a meeting** (audio file or transcript)
4. **Review alerts** for scope creep detection
5. **Mark as reviewed/billed** to track follow-up

## Database Schema

See `supabase/schema.sql` for full schema with RLS policies.

**Tables:**
- `projects` - Client projects with contracts
- `meetings` - Meeting transcripts
- `scope_alerts` - Detected scope violations

## API Routes

- `POST /api/projects` - Create project + extract scope
- `GET /api/projects` - List user's projects
- `POST /api/meetings` - Upload meeting + analyze
- `GET /api/alerts` - List scope alerts
- `PATCH /api/alerts` - Update alert status

## License

MIT
