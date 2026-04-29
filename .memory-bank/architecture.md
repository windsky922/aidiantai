# 架构与工作区地图

## 技术栈

- 前端：Vite + React + TypeScript。
- 后端：使用 Node.js 内置模块实现的本地 HTTP 服务。
- PWA 资源位于 `public/`。
- 本地用户上下文位于 `data/`。

## 关键流程

- `data/*` 保存音乐品味、作息、情绪规则和歌单上下文。
- `server/context.js` 读取本地上下文并生成摘要。
- `server/codexPrompt.js` 组装结构化 Codex prompt。
- `server/codexProvider.js` 选择草稿 provider，并在不暴露密钥的前提下报告 provider 就绪状态。
- `server/codexDraft.js` 编排草稿响应。
- `server/episodeContract.js` 校验生成结果，并转换为前端 `Episode`。
- `src/components/InfoPanel.tsx` 在 Settings 页面暴露草稿生成、应用确认和恢复控制。
- `src/App.tsx` 管理 `activeEpisode`、`previousEpisode` 和草稿应用确认状态；确认后的已校验草稿只替换内存中的播放器节目，并启用一步恢复。

## API 接口

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

## 边界

- Provider 逻辑不能散落到 UI 或路由处理函数中。
- UI 可以展示 provider 状态，但环境变量解释必须留在 `server/codexProvider.js`。
- AI 输出必须先经过 JSON schema 和 `buildEpisodePreview`，再进入播放器可消费的数据结构。
- 草稿生成不能直接覆盖当前播放器节目，必须保留显式应用流程。
