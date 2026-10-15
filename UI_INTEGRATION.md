# UI Integration Guide

The API contract (endpoints, request/response shapes and SSE events) is
maintained in one place, alongside the backend:
[breaking-bad-backend/UI_INTEGRATION.md](https://github.com/anfieldlad/breaking-bad-backend/blob/master/UI_INTEGRATION.md).

In this app, the contract is implemented by:

- `src/lib/api.ts` — typed browser client.
- `src/lib/sse.ts` — buffered SSE reader.
- `src/app/api/` — server-side proxy that attaches the backend API key.
