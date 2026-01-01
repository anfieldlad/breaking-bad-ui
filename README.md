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

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> For production, point to your deployed backend URL.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/ingest` | Upload & process PDF documents |
| `/chat` | AI chat interface with streaming responses |

## Features

### 🧪 The Lab (Ingest Page)
- Drag-and-drop PDF upload
- Real-time processing feedback
- Document management

### 💎 The Product (Chat Page)
- **"Cooking the data..."** — Live reasoning stream with glassmorphic UI
- **"The pure product."** — Crystal-blue final answers
- Typewriter effect for immersive responses
- Markdown rendering with syntax highlighting

## Backend

This UI connects to the [Breaking B.A.D. Backend](https://github.com/anfieldlad/breaking-bad-backend) — a FastAPI service with MongoDB Atlas vector storage and Google Gemini AI.

### API Integration

```javascript
// Ingest PDF
const formData = new FormData();
formData.append('file', file);
await fetch(`${API_URL}/api/ingest`, { method: 'POST', body: formData });

// Stream Chat
const response = await fetch(`${API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: "Your question here" })
});
// Handle SSE stream...
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
