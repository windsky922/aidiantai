# Progress Log

## 2026-04-27

- Built stages 0 through 2.6 of the AI radio project.
- Added static player, local API, context files, Codex prompt preview, episode contract validation, draft generation, and provider adapter.
- Added `.memory-bank/` project memory structure based on `windsky922/skill-memory`.
- Added a safe `Apply to player` flow from validated draft to active player episode.
- Added one-step in-memory `Restore previous` for applied drafts.
- Added `/api/codex/provider-status` and Settings provider status display.
- Added a confirmation step before applying a validated draft to the player.
- Next useful implementation step: add persistent draft history around applied episodes, then a guarded OpenAI dry-run.
