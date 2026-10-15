# Breaking B.A.D. UI 🧪

**Bot Answering Dialogue** — *"Breaking down files. Building up answers."*

The frontend interface for the Breaking B.A.D. RAG chatbot — a sleek, Breaking Bad-themed UI for document ingestion and AI-powered Q&A.

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Markdown:** react-markdown + remark-gfm
- **Runtime:** React 19

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/anfieldlad/breaking-bad-ui.git
cd breaking-bad-ui
npm install
```

### 2. Configure Environment

Create a `.env.local` file (see [.env.example](./.env.example)):

```env
BACKEND_URL=http://localhost:8000
BACKEND_API_KEY=your_secret_api_key
```

These are **server-side only**. The browser talks to this app's own `/api/*`
route handlers, which forward allowlisted requests to the backend and attach
the API key on the server, so the key never appears in the client bundle.
Never expose it through a `NEXT_PUBLIC_*` variable.

> In production these come from the Worker's config, see **Deployment** below.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/                # Server-side proxy to the backend (holds the API key)
│   ├── chat/page.tsx       # Chat page (composition only)
│   └── ingest/page.tsx     # Ingestion page (composition only)
├── components/
│   ├── chat/               # MessageBubble, StreamingReply, ReasoningPanel, ...
│   ├── ingest/             # FileDropZone, PurgePanel
│   ├── layout/             # Navbar, BackendStatus
│   └── ui/                 # Button, Card, Markdown, Spinner
├── hooks/                  # useChat, useSmoothText, useDocumentCount, useAutoScroll
└── lib/                    # api client, SSE reader, chat/file helpers (+ tests)
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/ingest` | Upload & process PDF documents |
| `/chat` | AI chat interface with streaming responses |

## Features

### 📱 Responsive Design
- **Mobile-first approach** — Fully optimized for all screen sizes
- **Adaptive navigation** — Hamburger menu with smooth animations on mobile
- **Responsive typography** — Scalable fonts that adjust to viewport
- **Touch-friendly UI** — Larger tap targets and optimized spacing for mobile

### 🧪 The Lab (Ingest Page)
- Drag-and-drop or keyboard-accessible PDF upload
- Client-side type/size checks (max 10 MB), server errors shown verbatim
- Real-time processing feedback
- Document management
- Mobile-optimized upload area

### 💎 The Product (Chat Page)
- **"Cooking the data..."** — Live reasoning stream with glassmorphic UI
- **"The pure product."** — Crystal-blue final answers
- **Backend Warm-up** — Automatic health check handles Render free tier "cold starts" with themed notifications
- Typewriter effect (frame-throttled) for immersive responses
- Failed or empty answers are shown inline and excluded from model history
- Markdown rendering with syntax highlighting
- Responsive message bubbles optimized for mobile

## Backend

This UI connects to the [Breaking B.A.D. Backend](https://github.com/anfieldlad/breaking-bad-backend) — a FastAPI service with MongoDB Atlas vector storage and a pluggable LLM backend (Gemini or any OpenAI-compatible endpoint).

### API Integration

```
Browser ──► /api/* (Next.js route handlers, src/app/api) ──► BACKEND_URL/api/*
                       adds X-API-Key server-side
```

- `src/lib/api.ts` — typed browser client (`streamChat`, `ingestPdf`, …).
- `src/lib/sse.ts` — buffered SSE reader for the chat stream.
- `src/app/api/[...path]/route.ts` — allowlisted proxy to the backend.

The API contract (endpoints, SSE events including `error`) is documented in
the backend's [UI_INTEGRATION.md](https://github.com/anfieldlad/breaking-bad-backend/blob/master/UI_INTEGRATION.md).

## Deployment (Cloudflare Workers)

The app runs on Cloudflare Workers via the [OpenNext adapter](https://opennext.js.org/cloudflare)
(`open-next.config.ts`, `wrangler.jsonc`). Pages are static and served from
Workers static assets; only the `/api/*` proxy runs as code.

**Configuration**

| Name | Where | Notes |
|------|-------|-------|
| `BACKEND_URL` | `vars` in `wrangler.jsonc` | Public URL of the backend |
| `BACKEND_API_KEY` | Worker **secret** | `npx wrangler secret put BACKEND_API_KEY` |

**Deploy from your machine**

```bash
npx wrangler login
npx wrangler secret put BACKEND_API_KEY   # once
npm run deploy
```

**Or deploy on every push (Workers Builds)**: in the Cloudflare dashboard,
*Workers & Pages → Create → Import a repository*, then set
build command `npx opennextjs-cloudflare build` and deploy command
`npx opennextjs-cloudflare deploy`. Add `BACKEND_API_KEY` as a secret under
the Worker's *Settings → Variables and Secrets*.

**Local preview in the Workers runtime**: copy `.dev.vars.example` to
`.dev.vars`, then `npm run preview`. (`npm run dev` still uses `.env.local`.)

> The backend must be reachable on a public hostname: the Worker cannot call
> private IPs (`global_fetch_strictly_public`).

## Security

- The backend API key is only read by server route handlers (`BACKEND_API_KEY`).
- Strict security headers (CSP, `X-Frame-Options`, `nosniff`, …) are set in `next.config.ts`; all assets are self-hosted.
- The UI itself has no user authentication: anyone who can reach it can chat and ingest. Put it behind auth (or at least rate limiting) before exposing it publicly.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Next.js production build |
| `npm run preview` | Build for Cloudflare and run locally in Wrangler |
| `npm run deploy` | Build for Cloudflare and deploy the Worker |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with `tsc` |
| `npm test` | Run unit tests (Vitest) |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, build and a production dependency audit.

## License

MIT
