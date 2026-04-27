# Lessons

Use this file for durable lessons Codex should reuse later.

## Format

```text
YYYY-MM-DD - Lesson title
- Context:
- Lesson:
- Apply next time:
```

## Entries

2026-04-27 - Keep task log chronological
- Context: Stage entries were once inserted before earlier stages.
- Lesson: Always verify `docs/TASK_LOG.md` heading order after appending a new stage.
- Apply next time: Keep order as stage 0, 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.2.1, 2.3, 2.4, 2.5, 2.6, then future stages.

2026-04-27 - Restart stale dev servers before UI validation
- Context: Browser showed stale draft fields because old processes were still serving ports `5173` and `8787`.
- Lesson: If UI/API output misses newly added fields, check listening Node processes and restart `npm run dev`.
- Apply next time: Validate `POST /api/codex/draft` directly before assuming frontend state is wrong.

2026-04-27 - Use safe sample defaults for external providers
- Context: Draft provider now supports OpenAI but should not send context unless configured.
- Lesson: Default to local sample behavior and require explicit provider/key configuration for external calls.
- Apply next time: New integrations should preserve offline/local demo behavior first.

2026-04-27 - Prefer context-mode for long source review
- Context: Large source/log reads can overload conversation context.
- Lesson: Use context-mode indexing and targeted search for long outputs.
- Apply next time: Use `ctx_batch_execute` for multi-file source review and search summaries.
