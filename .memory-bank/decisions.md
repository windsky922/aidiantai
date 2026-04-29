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

2026-04-29 - Apply validated drafts explicitly
- Decision: A generated draft can enter the player only through an explicit `Apply to player` action.
- Reason: Draft output should be reviewed and validated before changing the listening experience.
- Consequence: Future save/history/rollback features should extend this apply flow instead of bypassing it.

2026-04-29 - Keep draft rollback in memory for now
- Decision: Restore support is currently one-step and in-memory only.
- Reason: It verifies the UX without introducing persistence or version-history complexity.
- Consequence: Persistent draft history should be designed separately if needed.

2026-04-29 - Keep provider readiness on the server
- Decision: Provider status and environment-variable checks live in `server/codexProvider.js`.
- Reason: The UI should not duplicate backend provider selection rules or risk exposing secrets.
- Consequence: New provider configuration checks should extend `/api/codex/provider-status`.

2026-04-29 - Confirm before replacing the player episode
- Decision: `Apply to player` opens an inline confirmation before changing `activeEpisode`.
- Reason: Drafts may come from generated output, so the replacement should be visible and reversible.
- Consequence: Future apply flows should keep the request and confirm steps separate.
