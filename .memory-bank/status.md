# Status

Last updated: 2026-04-29

## Project Snapshot

- Project: AI radio reproduction inspired by mmguo's Claudio FM.
- Repository: `https://github.com/windsky922/aidiantai.git`.
- Local path: `C:\Users\Administrator\Documents\New project 2`.
- Current focus: Build a local personal AI radio system with Codex/OpenAI as the final AI processor.

## Current State

- Static player, local context API, Codex prompt preview, episode contract validation, draft generation, and provider adapter are implemented.
- Draft generation defaults to `sample` provider so the app runs without external credentials.
- OpenAI Responses provider is scaffolded but should only run after `CODEX_DRAFT_PROVIDER=openai` and `OPENAI_API_KEY` are explicitly configured.
- Settings tab can generate, validate, explicitly apply a draft to the player, restore the previous in-memory episode, and show the resolved Codex provider status.

## Next Steps

- Add confirmation or persistent draft history for applied episodes.
- Add a guarded real OpenAI dry-run flow after the user explicitly configures credentials.
- Later: connect TTS, music API, weather, schedule, and feedback memory.
