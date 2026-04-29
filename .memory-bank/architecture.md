# Architecture And Workspace Map

## Stack

- Frontend: Vite + React + TypeScript.
- Backend: local Node.js HTTP server using built-in modules.
- PWA assets live under `public/`.
- Local user context lives under `data/`.

## Key Flow

- `data/*` holds taste, routine, mood-rule, and playlist context.
- `server/context.js` reads local context and builds summaries.
- `server/codexPrompt.js` builds the structured Codex prompt.
- `server/codexProvider.js` chooses the draft provider and reports provider readiness without exposing secrets.
- `server/codexDraft.js` assembles the draft response.
- `server/episodeContract.js` validates generated output and converts it to frontend `Episode`.
- `src/components/InfoPanel.tsx` exposes draft generation, apply confirmation, and restore controls in Settings.
- `src/App.tsx` owns `activeEpisode`, `previousEpisode`, and draft apply confirmation state; confirming a validated draft replaces only the in-memory player episode and enables one-step restore.

## API Surface

- `GET /api/episodes/pilot`
- `GET /api/context`
- `GET /api/context/summary`
- `GET /api/codex/prompt`
- `GET /api/codex/prompt/summary`
- `GET /api/codex/schema`
- `GET /api/codex/json-schema`
- `GET /api/codex/sample-output`
- `GET /api/codex/episode-preview`
- `GET /api/codex/provider-status`
- `POST /api/codex/draft`

## Boundaries

- Provider logic must stay out of UI and route handlers.
- UI can display provider status, but environment-variable interpretation belongs in `server/codexProvider.js`.
- AI output must pass through JSON schema and `buildEpisodePreview` before player-facing use.
- Do not let draft generation directly overwrite the active player episode; keep the explicit apply flow.
