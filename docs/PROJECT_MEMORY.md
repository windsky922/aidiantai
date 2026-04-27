# Project Memory

Long-term notes for continuing this AI radio project. Keep this file focused on reusable project knowledge, not task-by-task history.

## Product Direction

- The final AI processor is Codex/OpenAI, not Claude. Do not introduce Claude-specific naming, APIs, or copy unless documenting the original reference project.
- The app should evolve from a static AI radio player into a local personal AI radio system driven by playlist, taste, routine, mood, weather, schedule, and feedback context.
- Do not let AI generation directly overwrite the active player episode yet. New generation work should first produce a draft, validate it, and show a preview.

## Architecture

- Frontend: Vite + React + TypeScript.
- Backend: local Node.js HTTP server using built-in modules, currently no server framework.
- Main data flow:
  - `data/*` holds local user context.
  - `server/codexPrompt.js` builds the structured Codex prompt.
  - `server/codexProvider.js` chooses the draft source.
  - `server/codexDraft.js` assembles the draft response.
  - `server/episodeContract.js` validates generated output and converts it to frontend `Episode`.
  - The frontend Settings tab triggers draft generation through `POST /api/codex/draft`.
- Keep the provider layer separate from UI and route handlers. The UI should not know whether the draft came from sample data or OpenAI.

## Provider Rules

- Default provider must remain `sample` so the project runs without external credentials.
- `CODEX_DRAFT_PROVIDER=openai` should only run when `OPENAI_API_KEY` is explicitly configured.
- When OpenAI provider is enabled, local taste, routine, mood-rule, and playlist context is sent to the OpenAI Responses API. Surface this privacy boundary in docs when relevant.
- Generated model output must pass through JSON schema and then `buildEpisodePreview` before any player-facing use.

## Maintenance Rules

- Before each implementation step, inspect existing code shape and choose the smallest clean change that preserves current behavior.
- Prefer refactoring duplicated logic when it is already causing maintenance overhead. Examples already applied: `useApiResource`, shared episode contract, provider adapter.
- Keep task log entries chronological. Expected order is stage 0, 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.2.1, 2.3, 2.4, 2.5, 2.6, then future stages.
- Update `docs/TASK_LOG.md` for each stage with: goal, implementation judgment, operations, verification, conclusion, GitHub status.
- Push each completed implementation stage to `https://github.com/windsky922/aidiantai.git`.

## Environment Notes

- The local repository path is `C:\Users\Administrator\Documents\New project 2`.
- Git network access uses the local proxy configured at `127.0.0.1:7890`.
- `rg` may be blocked by Windows permissions in this environment. Use PowerShell or Node scripts as fallback.
- Default sandbox often fails Vite/esbuild with `spawn EPERM`. `node_modules\\.bin\\tsc.cmd -b` works in the sandbox; full `npm run build` may need escalated execution.
- Old dev servers can remain on ports `5173` or `8787`. If the browser shows stale API fields, check/kill old Node processes and restart `npm run dev`.
- Use context-mode MCP when source/log output is long; index and query instead of dumping large files into context.
