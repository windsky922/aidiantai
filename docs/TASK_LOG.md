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

## 2026-04-27：阶段 2.5 - Codex 草稿生成入口和 Settings 操作界面

目标：
- 再次复查前端和后端是否存在冗余、重复和职责堆叠。
- 在不直接覆盖播放器主节目的前提下，新增 Codex 草稿生成入口。
- 让 Settings 页面可以手动触发草稿生成，并展示校验后的 episode 摘要。

实现前判断：
- `InfoPanel` 中残留的静态 profile/settings items 已经不再参与真实渲染，应删除，避免维护假入口。
- 多个只做 GET JSON 的 hook 存在重复 fetch 包装，应抽成 `useApiResource`。
- 真实 Codex 调用仍不宜直接接管播放器，应先走 `/api/codex/draft` dry-run，并复用 2.4 的 `buildEpisodePreview` 校验层。

操作：
- 新增 `src/hooks/useApiResource.ts`，复用只读 API 加载逻辑。
- 简化 `useRadioContext`、`useCodexPromptSummary`、`useCodexEpisodePreview`。
- 新增 `server/codexDraft.js`。
- 修改 `server/index.js`，支持 `POST /api/codex/draft`。
- 新增 `src/hooks/useCodexDraft.ts`。
- 修改 `src/App.tsx` 和 `src/components/InfoPanel.tsx`，Settings 页面加入 `Generate draft` 操作。
- 修改 `src/styles.css`，补充草稿生成按钮样式。
- 修改 `README.md`，补充 `/api/codex/draft`。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- `buildCodexDraft()` 模块校验成功：
  - `source=sample-output`
  - `ok=true`
  - `title=Late Night Pilot`
  - `turns=4`
- 临时 HTTP 校验成功：`POST /api/codex/draft` 返回 200，并返回已校验 episode preview。
- 本地开发服务启动成功：
  - `http://127.0.0.1:5173/` 返回 200。
  - `http://127.0.0.1:8787/api/health` 返回 200。
- 内置浏览器检查成功：Settings 页面可以点击 `Generate draft`，并展示 `Draft source` 和 `Draft episode`。

结论：
- 阶段 2.5 已建立 Codex 草稿生成的前后端闭环。
- 当前仍使用 sample output 作为 dry-run 来源，真实 Codex 接入时只需要替换 `server/codexDraft.js` 的输出来源，校验和前端展示可以继续复用。
- Settings 面板已加入滚动保护，避免草稿信息变长后按钮或内容被截断。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-27：阶段 2.6 - Codex provider 适配层和 OpenAI Responses dry-run

目标：
- 将阶段 2.5 的 sample draft 来源抽象为可切换 provider。
- 默认继续使用 sample，保证无 API key 时项目仍可运行。
- 预留 OpenAI Responses API 调用路径，并继续复用 Episode 校验层。

实现前判断：
- 不应把真实 API 调用写进 UI 或路由处理函数里，避免后续 provider 增加时重复改前端。
- 当前 `codexDraft.js` 同时负责 prompt、sample 输出和 draft 组装，适合拆出 `codexProvider.js`。
- OpenAI 调用需要使用 JSON schema 约束输出，避免模型返回不可消费的自然语言。

操作：
- 新增 `server/codexProvider.js`，支持 `sample` 和 `openai` provider。
- 新增 `codexEpisodeJsonSchema`，用于 OpenAI Responses API structured output。
- 修改 `server/codexDraft.js`，只负责编排 prompt、provider 输出和 preview 校验。
- 修改 `server/index.js`，新增 `/api/codex/json-schema`。
- 修改 `src/types.ts` 和 `InfoPanel`，显示 draft provider 和 model。
- 新增 `.env.example`，记录 `CODEX_DRAFT_PROVIDER`、`OPENAI_API_KEY`、`OPENAI_MODEL` 等配置。
- 修改 `README.md`，记录 provider 配置和隐私边界。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- sample provider 模块校验成功：
  - `provider=sample`
  - `source=sample-output`
  - `model=null`
  - `ok=true`
  - `title=Late Night Pilot`
- 临时 HTTP 校验成功：
  - `POST /api/codex/draft` 返回 200。
  - `/api/codex/json-schema` 返回 `type=object`。
- `CODEX_DRAFT_PROVIDER=openai` 且未配置 `OPENAI_API_KEY` 时，会返回明确配置错误，未发生外部请求。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- 重启本地开发服务后，`POST /api/codex/draft` 返回 `provider=sample`。
- 内置浏览器检查成功：Settings 页面点击 `Generate draft` 后展示 `Draft provider: sample.`。

结论：
- provider 适配层已建立，默认 sample 路径保持稳定。
- OpenAI Responses 路径已预留，但只有显式配置 API key 和 provider 后才会发送本地上下文。
- 真实 OpenAI 调用的输出会先经过 JSON schema 约束，再经过 `buildEpisodePreview` 校验。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-29：阶段 2.7 - 已校验 draft 应用到播放器

目标：
- 给阶段 2.6 的已校验 draft 增加显式应用入口。
- 保持“不自动覆盖当前播放器”的安全边界。
- 修复 episode 切换时旧音频、进度、语音和播放状态残留的问题。

实现前判断：
- 当前 Settings 已能生成 draft，但只能展示摘要，无法进入播放器体验。
- 最小可行改动是在前端维护 `activeEpisode`，只在用户点击 `Apply to player` 后替换播放器数据。
- `usePlayerController` 之前会复用旧 `audioRef`，episode 变更时必须主动重置。

操作：
- 修改 `src/App.tsx`，新增 `activeEpisode`，播放器改为读取当前 active episode。
- 修改 `src/components/InfoPanel.tsx`，Settings 中新增 `Apply to player` 按钮。
- 修改 `src/hooks/usePlayerController.ts`，episode songPreview 变更时重置音频、语音、进度和播放状态。
- 修改 `src/styles.css`，加入 draft 操作区和次级按钮样式。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- 本地开发服务启动成功：
  - `http://127.0.0.1:5173/` 返回 200。
  - `http://127.0.0.1:8787/api/health` 返回 200。
- 内置浏览器检查成功：Settings 点击 `Generate draft` 后，`Apply to player` 会切回 Player，并显示 `Late Night Pilot`。

结论：
- draft 已具备从“校验预览”进入“播放器体验”的受控路径。
- 仍然没有自动覆盖当前节目，后续可继续加确认、撤回或保存草稿历史。

GitHub：
- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-29：阶段 2.8 - 应用 draft 后恢复 previous episode

目标：
- 给阶段 2.7 的 `Apply to player` 增加内存级回滚能力。
- 继续保持显式操作边界，避免自动覆盖和不可撤回。
- 不引入持久化历史，先验证最小可用的恢复路径。

实现前判断：
- 当前播放器已经有 `activeEpisode`，最小扩展是增加 `previousEpisode`。
- 回滚应该只恢复上一版播放器节目，并清空 previous，避免形成隐式多级历史。
- 当前阶段不需要后端接口，因为这是纯前端会话状态。

操作：
- 修改 `src/App.tsx`，新增 `previousEpisode` 状态。
- `Apply to player` 前保存当前 `activeEpisode`。
- 新增 `restorePreviousEpisode`，恢复 previous 并切回 Player。
- 修改 `src/components/InfoPanel.tsx`，Settings 增加 `Restore previous` 按钮，并显示当前 player episode。
- 修改 `src/styles.css`，区分 loading disabled 和普通 disabled 按钮状态。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- 本地开发服务启动成功：
  - `http://127.0.0.1:5173/` 返回 200。
  - `http://127.0.0.1:8787/api/health` 返回 200。
- 内置浏览器检查成功：`Generate draft` -> `Apply to player` -> `Restore previous` 后恢复 `Pilot Episode`。

结论：
- draft 应用流程现在具备一次性回滚能力。
- 后续如果需要多草稿、多版本或跨刷新保存，应单独设计 draft history，而不是继续堆在当前组件状态里。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-29：阶段 2.9 - Codex provider 状态展示

目标：
- 在 Settings 页面展示当前 draft provider 的真实状态。
- 明确区分本地 `sample` dry-run 和真实 OpenAI Responses 调用。
- 在不暴露密钥的前提下，让用户知道是否会发生外部请求。

实现前判断：
- provider 选择规则已经集中在 `server/codexProvider.js`，不应该让前端重复判断环境变量。
- 最小实现是新增只读状态接口，前端通过 hook 消费并展示。
- 当前阶段不触发真实 OpenAI 请求，只展示配置是否就绪。

操作：
- 修改 `server/codexProvider.js`，新增 `getCodexProviderStatus()`。
- 修改 `server/index.js`，新增 `GET /api/codex/provider-status`。
- 新增 `src/hooks/useCodexProviderStatus.ts`。
- 修改 `src/types.ts` 和 `src/config.ts`，补齐 provider status 类型和 endpoint。
- 修改 `src/App.tsx` 和 `src/components/InfoPanel.tsx`，Settings 展示 provider、model、状态说明和 external requests。
- 修改 `README.md`，补充 provider status API。
- 更新 `.memory-bank/` 项目记忆。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- 默认 provider 模块验证返回 `provider=sample`、`externalRequests=false`。
- `CODEX_DRAFT_PROVIDER=openai` 且未配置 `OPENAI_API_KEY` 时，状态返回 `ok=false` 且不会启用外部请求。
- 非法 provider 状态返回 `source=unsupported`。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- 本地开发服务验证成功：
  - `http://127.0.0.1:8787/api/codex/provider-status` 返回 200。
  - `http://127.0.0.1:5173/` 返回 200。
- 内置浏览器检查成功：Settings 页面显示 `Provider: sample.` 和 `External requests: disabled.`。

结论：
- 用户现在可以在生成 draft 前看见当前 provider 状态。
- OpenAI 真实调用仍保持显式配置边界，不会在默认状态发送本地上下文。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-29：阶段 2.10 - 应用 draft 前确认

目标：
- 给 `Apply to player` 增加二次确认。
- 保持 draft 替换播放器前的显式用户动作。
- 确认区必须在移动尺寸中可见、可点击，不遮挡已有内容。

实现前判断：
- 当前 `App.tsx` 已经管理 `activeEpisode` 和 `previousEpisode`，确认状态也应保留在这里。
- `InfoPanel` 只负责展示确认 UI 和触发回调，不负责改写播放器数据。
- 不需要新增后端接口或持久化，先完成会话内确认体验。

操作：
- 修改 `src/App.tsx`，新增 `isConfirmingDraftApply` 状态。
- 将原 `Apply to player` 拆分为 `requestDraftApply` 和 `confirmDraftApply`。
- 切换离开 Settings、重新生成 draft、恢复 previous 时会清理确认状态。
- 修改 `src/components/InfoPanel.tsx`，新增内嵌确认区、Cancel 和 Confirm 按钮。
- 确认区打开时自动 `scrollIntoView`，避免在紧凑视口中被截断。
- 修改 `src/styles.css`，增加确认区和紧凑按钮样式。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- 本地开发服务验证成功：
  - `http://127.0.0.1:5173/` 返回 200。
  - `http://127.0.0.1:8787/api/health` 返回 200。
- 内置浏览器检查成功：
  - `Generate draft` 后显示 draft 摘要。
  - 点击 `Apply to player` 后仍停留在 Settings，并显示 `confirm replace`。
  - 点击 `Confirm` 后才切回 Player，并显示 `Late Night Pilot`。

结论：
- draft 替换播放器现在具备“请求应用 -> 确认应用”的显式流程。
- 下一步更适合做 persistent draft history，而不是继续增加临时状态。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-29：阶段 2.11 - 文档统一中文化

目标：
- 将项目文档、记忆文件和项目技能说明的说明性文字统一改为中文。
- 把“后续文档必须使用中文”的规则写入项目约定。
- 保留技术标识、命令、路径、API、环境变量和代码片段的原文，避免破坏可执行内容。

实现前判断：
- `node_modules/` 和临时 `.tmp-skill-memory/` 不属于项目文档维护范围。
- 需要处理的是 Git 跟踪的 `README.md`、`AGENTS.md`、`.agents/skills/project-memory/SKILL.md`、`.memory-bank/*.md`、`docs/*.md` 和 `data/*.md`。
- `docs/TASK_LOG.md` 必须继续保持阶段顺序。

操作：
- 重写 `AGENTS.md` 和 `.agents/skills/project-memory/SKILL.md` 为中文。
- 重写 `.memory-bank/` 中的状态、架构、约定、决策、进展、经验和复盘模板。
- 更新 `README.md` 中仍为英文的 provider 说明。
- 调整 `docs/REPLICATION_PLAN.md` 中剩余英文表述。
- 在 `.memory-bank/conventions.md`、`.memory-bank/decisions.md` 和 `.memory-bank/lessons.md` 中记录文档语言约定。

验证：
- 已检查 Git 跟踪文档范围，排除依赖目录和临时目录。
- 已确认任务日志标题顺序保持为阶段 0 到阶段 2.11。

结论：
- 后续所有项目文档的说明性文字必须使用中文。
- 技术名称、命令、API 路径、环境变量和代码片段可以保留原文。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。
## 2026-04-30：阶段 2.12 - 浏览器本地草稿历史

目标：
- 让已校验草稿在刷新页面后仍可找回。
- 保留最近 5 条草稿历史，避免 Settings 页面无限增长。
- 不新增后端写文件接口，先验证最小持久化体验。

实现前判断：
- 当前 `useCodexDraft` 只保存当前草稿，需要让生成结果可返回，并允许历史草稿重新设为当前草稿。
- 当前阶段不做删除历史，避免引入本地删除确认和数据管理复杂度。
- 使用浏览器 `localStorage` 足以验证单浏览器持久化，后续再决定是否升级为服务端本地文件存储。

操作：
- 修改 `src/hooks/useCodexDraft.ts`，让 `generateDraft()` 返回生成结果，并新增 `selectDraft()`。
- 新增 `src/hooks/useDraftHistory.ts`，使用 `localStorage` 保存最近 5 条已校验草稿。
- 修改 `src/App.tsx`，生成草稿成功后写入历史，并支持从历史恢复为当前草稿。
- 修改 `src/components/InfoPanel.tsx`，Settings 页面展示 `draft history` 列表。
- 修改 `src/styles.css`，增加草稿历史条目的稳定布局样式。
- 更新 `README.md` 和 `.memory-bank/` 中文项目记忆。

验证：
- `node_modules\\.bin\\tsc.cmd -b` 成功。
- `npm run build` 在默认沙箱下仍因 esbuild `spawn EPERM` 失败；提升权限后完整构建成功。
- 本地开发服务验证成功：
  - `http://127.0.0.1:5173/` 返回 200。
  - `http://127.0.0.1:8787/api/health` 返回 200。
- 内置浏览器检查成功：
  - `Generate draft` 后显示 `draft history`。
  - 刷新页面后历史仍然存在。
  - 点击历史条目后，历史草稿会重新成为当前草稿，并显示 `Draft episode: Late Night Pilot`。

结论：
- 草稿现在具备单浏览器持久化历史能力。
- 下一步可以做受保护的 OpenAI dry-run，或将历史升级为服务端本地文件存储。

GitHub：
- 已提交并推送到 `https://github.com/windsky922/aidiantai.git`。
