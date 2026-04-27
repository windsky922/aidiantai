# 任务日志

本文件记录每次阶段任务、操作内容和 GitHub 同步情况。后续新增任务必须按阶段时间线从旧到新追加。

## 2026-04-26：阶段 0 - 项目复现方案与仓库初始化

目标：

- 分析作者原页面和视频截图。
- 明确公开静态页面与完整本地 AI 电台系统的区别。
- 建立复现路线、优化方向和任务推进规范。

操作：

- 创建 `README.md`。
- 创建 `docs/REPLICATION_PLAN.md`。
- 创建 `docs/TASK_LOG.md`。
- 创建 `.gitignore`。

结论：

- 第一阶段优先复现静态播放器 Demo。
- 第二阶段改造成数据驱动节目。
- 第三阶段接入本地 Node.js 服务。
- 后续再接 Codex、TTS、音乐 API、天气、日程和长期记忆。

GitHub：

- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 1.1 - 前端项目骨架和静态播放器界面

目标：

- 搭建 Vite + React + TypeScript 前端项目。
- 先复现 Claudio 公开页面的核心播放器体验。
- 不接后端、不接 Codex、不接 TTS API，先获得可运行的视觉和交互基线。

操作：

- 创建 `package.json`、`index.html`、`vite.config.ts` 和 TypeScript 配置。
- 创建 `src/main.tsx`、`src/App.tsx`、`src/styles.css`。
- 实现移动端电台卡片 UI。
- 实现 `Player / Profile / Settings` 三个视图。
- 实现播放 / 暂停、节目进度、字幕时间轴、自动滚动。
- 使用浏览器 `SpeechSynthesis` 模拟 Claudio DJ 开场。
- 使用 Apple/iTunes 30 秒 preview 作为音乐床。
- 使用 Web Audio API + Canvas 实现波形动画。

验证：

- `npm install` 成功。
- `npm run build` 成功。
- 本地开发服务器已启动。
- `http://127.0.0.1:5173/` 返回 200。

结论：

- 阶段 1.1 已经具备可访问的静态播放器 Demo。
- 下一步适合做阶段 1.2：把节目数据从组件内部抽离为 JSON，形成可替换的 episode 数据模型。

GitHub：

- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 1.2 - 抽离节目 JSON 数据模型

目标：

- 将写在 `src/App.tsx` 里的节目内容抽离成可替换 JSON。
- 为后续 Codex 生成节目数据、本地服务返回节目数据打基础。

操作：

- 新增 `src/data/pilotEpisode.json`。
- 新增 `src/types.ts`，定义 `Episode`、`Turn`、`Speaker`。
- 修改 `src/App.tsx`，改为读取 JSON 数据。
- 添加轻量 `normalizeEpisode`，把 JSON 里的 speaker 字符串收敛为受控类型。

验证：

- `npm run build` 成功。
- `http://127.0.0.1:5173/` 返回 200。

结论：

- 播放器已经从写死组件内容升级为数据驱动。
- 下一步适合做阶段 1.3：把播放器拆成组件，并为 episode 数据增加基础校验与错误态。

GitHub：

- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 1.3 - 组件拆分、数据校验和 Codex 目标修正

目标：

- 将播放器从单文件组件拆分为更清晰的 UI 组件。
- 为 episode JSON 增加基础校验和错误态。
- 修正项目目标：最终 AI 处理核心使用 Codex，而不是 Claude。

操作：

- 新增 `src/components/AppStage.tsx`。
- 新增 `src/components/Tabs.tsx`。
- 新增 `src/components/PlayerHeader.tsx`。
- 新增 `src/components/PlayerPanel.tsx`。
- 新增 `src/components/InfoPanel.tsx`。
- 新增 `src/components/ErrorPanel.tsx`。
- 新增 `src/lib/time.ts`，集中处理时间格式化和字幕结束时间。
- 新增 `src/lib/episode.ts`，解析并校验 episode 数据。
- 修改 `src/App.tsx`，只负责组装应用状态和各组件。
- 修改 `README.md`、`docs/REPLICATION_PLAN.md`、`docs/TASK_LOG.md` 和前端文案，将目标 AI 核心改为 Codex。
- 修改 `src/data/pilotEpisode.json`，将示例文案里的 Claude Code 改为 Codex。

验证：

- `npm run build` 成功。
- `http://127.0.0.1:5173/` 返回 200。

结论：

- 播放器结构更适合继续扩展。
- episode 数据已有基础防护，后续接本地服务或 Codex 输出时更稳。
- 项目目标已统一为 Codex 驱动的个人 AI 电台。

GitHub：

- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 1.4 - PWA 外壳和离线 shell 缓存

目标：

- 补齐作者原项目中提到的 PWA 形态。
- 为播放器加入可安装应用的基础元信息。
- 添加 service worker，为后续离线可用和本地优先体验做准备。

操作：

- 新增 `public/manifest.webmanifest`。
- 新增 `public/icons/claudio.svg`。
- 新增 `public/sw.js`。
- 新增 `src/registerServiceWorker.ts`。
- 修改 `src/main.tsx`，注册 service worker。
- 修改 `index.html`，加入 manifest、图标、描述和新的页面标题。
- 修改 `README.md`，记录 PWA 文件和缓存策略。
- service worker 使用 network-first 策略，避免开发迭代时优先命中旧缓存。

验证：

- `npm run build` 成功。
- `http://127.0.0.1:5173/` 返回 200。
- `http://127.0.0.1:5173/manifest.webmanifest` 返回 200。
- `http://127.0.0.1:5173/sw.js` 返回 200。
- `http://127.0.0.1:5173/icons/claudio.svg` 返回 200。

结论：

- 静态播放器已具备 PWA 基础外壳。
- 下一步适合做阶段 2.1：建立本地 Node.js 服务骨架，由前端从 `/api/episodes/pilot` 读取节目数据。

GitHub：

- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 2.1 - 本地 Node.js API 服务骨架

目标：

- 建立本地 Node.js 服务骨架。
- 让前端不再直接 import episode JSON，而是通过 API 获取节目数据。
- 为后续 Codex 生成 episode、TTS 合成和音乐 API 编排建立后端入口。

操作：

- 新增 `server/index.js`，使用 Node 内置 `http` 模块实现轻量 API。
- 新增 `scripts/dev.js`，让 `npm run dev` 同时启动 API 服务和 Vite 前端。
- 修改 `package.json`，新增 `dev:api`、`dev:web`，并调整 `dev`。
- 修改 `vite.config.ts`，将 `/api` 代理到 `http://127.0.0.1:8787`。
- 修改 `src/App.tsx`，启动时从 `/api/episodes/pilot` 拉取 episode 数据。
- 新增 `src/components/LoadingPanel.tsx`，显示 API 加载状态。
- 修改 `.gitignore`，忽略本地开发日志。
- 修改 `README.md`，记录 API 运行方式和接口地址。

验证：

- `npm run build` 成功。
- `http://127.0.0.1:8787/api/health` 返回 200。
- `http://127.0.0.1:8787/api/episodes/pilot` 返回 200。
- `http://127.0.0.1:5173/api/episodes/pilot` 经 Vite 代理返回 200。
- `http://127.0.0.1:5173/` 返回 200。

结论：

- 前端已经切换为 API 数据源。
- 本地服务已具备后续接入 Codex 的最小接口位置。
- 下一步适合做阶段 2.2：建立 `data/` 用户上下文文件和后端 context 读取接口。

GitHub：

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 2.2 - 用户上下文文件和 context API

目标：

- 建立 Codex 后续需要读取的用户上下文文件。
- 为本地 API 增加 context 读取能力。
- 让前端 Profile 页面展示真实 context 摘要，而不是静态说明。

操作：

- 新增 `data/taste.md`。
- 新增 `data/routines.md`。
- 新增 `data/mood-rules.md`。
- 新增 `data/playlists.json`。
- 新增 `server/context.js`，读取上下文文件并生成摘要。
- 修改 `server/index.js`，新增 `/api/context` 和 `/api/context/summary`。
- 修改 `src/types.ts`，新增 `RadioContext` 和 `ContextSummary` 类型。
- 修改 `src/App.tsx`，启动时读取 `/api/context`。
- 修改 `src/components/InfoPanel.tsx`，Profile 页展示 context 摘要。
- 修改 `README.md`，记录用户上下文文件和 API 地址。

验证：

- `npm run build` 成功。
- 新版 API 在临时端口 `8788` 验证 `/api/context` 返回 200。
- 当前 `8787` 被旧 API 进程占用；重启 `npm run dev` 后会加载新版 `/api/context/summary`。

结论：

- 项目已经具备最小用户上下文层。
- Codex 后续可以基于 `taste.md`、`routines.md`、`mood-rules.md` 和 `playlists.json` 生成节目。
- 下一步适合做阶段 2.3：创建 Codex prompt 组装接口，先返回结构化 prompt，不直接调用 Codex。

GitHub：

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 2.2.1 - 代码结构复查与简化重构

目标：

- 检查前面代码是否出现职责堆叠、重复逻辑和不必要复杂度。
- 在不改变功能的前提下简化前端和后端结构。

操作：

- 新增 `src/config.ts`，集中管理 API endpoint。
- 新增 `src/lib/api.ts`，集中处理 JSON 请求和错误消息。
- 新增 `src/hooks/useAsyncResource.ts`，复用异步加载、取消和错误状态逻辑。
- 新增 `src/hooks/useEpisode.ts`。
- 新增 `src/hooks/useRadioContext.ts`。
- 新增 `src/hooks/useClock.ts`。
- 新增 `src/hooks/useTranscriptScroll.ts`。
- 新增 `src/hooks/usePlayerController.ts`，集中播放器音频、进度、波形和语音控制。
- 简化 `src/App.tsx`，保留应用状态编排和页面组合。
- 简化 `server/index.js`，将连续路由判断改为路由表。
- 集中后端 JSON/CORS header，减少重复响应代码。

验证：

- `npm run build` 成功。
- 重构后的 API 在临时端口 `8789` 验证通过：
  - `/api/health` 返回 200。
  - `/api/episodes/pilot` 返回 200。
  - `/api/context` 返回 200。
  - `/api/context/summary` 返回 200。

结论：

- `App.tsx` 不再堆叠 fetch、音频、波形、时钟和字幕滚动逻辑。
- 后端新增接口时只需要扩展路由表。
- 当前重构没有改变用户可见功能。

GitHub：

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 2.3 - Codex prompt 组装接口

目标：

- 先建立发给 Codex 的 prompt 结构，不直接调用 Codex。
- 让输入质量可检查，避免过早接入真实 AI 调用导致复杂度上升。
- 将“每次任务先判断维护方式、必要时重构、长上下文用 context-mode”写入项目约定。

实现前判断：

- 当前已有 `context` API 和 episode API，缺少的是把这些原料组装成 Codex 可消费的任务输入。
- 最小实现是新增 prompt builder 和只读 API，不引入 SDK、不加真实调用、不增加状态写入。
- Settings 页只显示摘要，避免把大段 prompt 塞进 UI。

操作：

- 新增 `server/codexPrompt.js`。
- 新增 `/api/codex/prompt`，返回完整结构化 prompt。
- 新增 `/api/codex/prompt/summary`，返回 prompt 摘要。
- 新增 `src/hooks/useCodexPromptSummary.ts`。
- 修改 `src/config.ts`，增加 prompt summary endpoint。
- 修改 `src/types.ts`，新增 `CodexPromptSummary`。
- 修改 `src/components/InfoPanel.tsx`，Settings 页展示 Codex prompt 准备情况。
- 修改 `src/App.tsx`，加载 prompt summary。
- 修改 `README.md`，补充维护规则和 prompt API 地址。

验证：

- `npm run build` 成功。
- 新接口在临时端口 `8790` 验证通过：
  - `/api/codex/prompt/summary` 返回 200。
  - `/api/codex/prompt` 返回 200。
- prompt summary 确认：
  - `target=Codex`。
  - `candidateSongCount=3`。
  - `outputKeys=episodeTitle,host,djSay,songCandidates,turns`。

结论：

- Codex 调用前的输入组装层已经建立。
- 下一步适合做阶段 2.4：把 prompt 输出 schema 与前端 `Episode` 类型进一步对齐，增加生成结果校验入口。

GitHub：

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-27：阶段 2.4 - Codex 输出 schema 对齐和 Episode 预览校验

目标：

- 定义 Codex 未来返回的 episode plan 结构。
- 建立 Codex 输出到播放器 `Episode` 的校验和转换入口。
- 继续避免过早接入真实 Codex 调用，先保证接口契约稳定。

实现前判断：

- 当前已有 `/api/codex/prompt`，但缺少“Codex 返回值是否能被播放器消费”的验证层。
- 最小实现是增加 sample output、schema 和 preview API，不引入新依赖、不增加持久化写入。
- 前端 Settings 只展示校验摘要，避免把大段输出堆到界面里。

操作：

- 新增 `data/codex-sample-output.json`。
- 新增 `server/episodeContract.js`。
- 修改 `server/codexPrompt.js`，让 prompt 的 output schema 复用 episode contract。
- 修改 `server/index.js`，新增：
  - `/api/codex/schema`
  - `/api/codex/sample-output`
  - `/api/codex/episode-preview`
- 新增 `src/hooks/useCodexEpisodePreview.ts`。
- 修改 `src/config.ts`，增加 episode preview endpoint。
- 修改 `src/types.ts`，新增 `CodexEpisodePreview`。
- 修改 `src/components/InfoPanel.tsx` 和 `src/App.tsx`，Settings 页展示 sample output 校验结果。
- 修改 `README.md`，补充新增 API 地址。

验证：

- `node_modules\\.bin\\tsc.cmd -b` 成功。
- 服务端模块验证成功：
  - `target=Codex`
  - `candidateSongCount=3`
  - `previewOk=true`
  - `title=Late Night Pilot`
  - `errors=[]`
- `npm run build` 在默认沙箱仍失败于 esbuild `spawn EPERM`。
- 已请求提升权限运行 `npm run build`，但本次审批超时，未完成 Vite build 验证。

结论：

- Codex 输出契约和播放器 Episode 契约之间已有明确转换层。
- 下一步接真实 Codex 调用时，应先把返回值送入 `buildEpisodePreview`，再进入播放器。
- 后续可补跑 `npm run build` 做完整 Vite 打包验证。

GitHub：

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。
