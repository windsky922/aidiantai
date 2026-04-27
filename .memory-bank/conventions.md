# Conventions

## Communication

- Use Chinese for user-facing discussion unless the user requests otherwise.
- Keep reports concise and practical.
- State assumptions and validation limits directly.

## Development

- Before each implementation step, inspect current code shape and choose the smallest clean change that preserves behavior.
- Refactor duplicated logic when it is already increasing maintenance cost.
- Keep UI, provider selection, validation, and route handling separated.
- Use Codex/OpenAI as the final AI processor; do not introduce Claude-specific naming, APIs, or copy except when discussing the original reference project.

## Memory

- Use `.memory-bank/` for durable project memory.
- Do not store secrets, API keys, private tokens, credentials, or unnecessary raw sensitive data.
- Store reusable facts, decisions, lessons, and next steps, not raw chat logs or command output.

## Verification

- Run `node_modules\\.bin\\tsc.cmd -b` for TypeScript validation.
- Full `npm run build` may need escalated execution because Vite/esbuild can fail with `spawn EPERM` in the default sandbox.
- After frontend changes, verify the interface in the in-app browser when practical.
