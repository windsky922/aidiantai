# Decisions

Record project-level decisions that should guide future work.

## Format

```text
YYYY-MM-DD - Decision title
- Decision:
- Reason:
- Consequence:
```

## Entries

2026-04-27 - Use Codex/OpenAI as final AI processor
- Decision: The final AI processor for this project is Codex/OpenAI, not Claude.
- Reason: The user explicitly corrected the project direction.
- Consequence: Code, docs, prompts, and UI should use Codex/OpenAI terminology except when referencing the original Claudio project.

2026-04-27 - Keep draft generation separate from active playback
- Decision: AI generation should create validated drafts first, not overwrite the active player episode.
- Reason: Model output may be invalid or undesirable until reviewed.
- Consequence: New generation features should use preview/promote flows.

2026-04-27 - Use provider adapter for draft source
- Decision: Keep draft source selection in `server/codexProvider.js`.
- Reason: The app needs to run without keys through `sample`, while allowing later OpenAI Responses calls.
- Consequence: UI and routes should consume `buildCodexDraft` and avoid provider-specific logic.

2026-04-27 - Use `.memory-bank/` project memory
- Decision: Store durable project memory in `.memory-bank/` and expose the workflow through `.agents/skills/project-memory/`.
- Reason: This matches the user's `skill-memory` project pattern.
- Consequence: `docs/PROJECT_MEMORY.md` is superseded by structured memory files.
