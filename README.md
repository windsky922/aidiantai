# AI 电台复现项目

这是一个复现 `Claudio x mmguo FM` 想法的本地 AI 电台项目。目标不是只做一个音乐播放器，而是做一个能够读取个人歌单、作息、天气、日程和历史反馈的私人 AI DJ。

参考页面：

- 原页面：https://mmguo.dev/claudio-fm/
- 抖音视频：https://www.douyin.com/video/7631240906314063537

## 项目目标

第一阶段先复现作者公开页面的体验：

- AI DJ 播放器界面
- 主播音频 + 背景音乐
- 同步字幕
- 波形动画
- PWA / localhost 访问

第二阶段实现真正的本地 AI 电台：

- 导入个人歌单
- 读取个人偏好和作息上下文
- 使用 Codex 生成节目策划、推荐理由和 DJ 串场
- 使用 TTS 生成 AI 主播语音
- 接入音乐 API、天气、日程、历史记忆

## 当前仓库约定

- 每个阶段先在 `docs/TASK_LOG.md` 记录目标和操作。
- 每次实现一个明确任务后提交 Git。
- 每次提交后推送到 GitHub 仓库。
- 功能实现优先小步推进，先可运行，再逐步接入外部 API。
- 每次开发前先判断最小可行改动、重复代码、职责边界和是否需要重构。
- 如果输出、源码或日志上下文过长，优先使用 context-mode MCP 做索引、搜索和摘要，避免直接塞入大段上下文。

## 文档

- [复现方案](docs/REPLICATION_PLAN.md)
- [任务日志](docs/TASK_LOG.md)

## 本地运行

当前已完成阶段 2.2：本地 Node.js API 已能读取用户上下文文件，Profile 页会展示 context 摘要。

```bash
npm install
npm run dev
```

然后打开：

```txt
http://127.0.0.1:5173/
```

构建验证：

```bash
npm run build
```

单独启动 API：

```bash
npm run dev:api
```

API 地址：

```txt
http://127.0.0.1:8787/api/health
http://127.0.0.1:8787/api/episodes/pilot
http://127.0.0.1:8787/api/context
http://127.0.0.1:8787/api/context/summary
http://127.0.0.1:8787/api/codex/prompt
http://127.0.0.1:8787/api/codex/prompt/summary
http://127.0.0.1:8787/api/codex/schema
http://127.0.0.1:8787/api/codex/sample-output
http://127.0.0.1:8787/api/codex/episode-preview
```

## 当前数据入口

节目数据位于：

```txt
src/data/pilotEpisode.json
```

本地 API 会读取这个 JSON 并通过 `/api/episodes/pilot` 返回给前端。后续 Codex 只要生成同样结构的数据，就可以替换当前静态节目。数据进入播放器前会先经过基础校验，避免坏数据直接破坏页面。

## PWA 支持

当前已加入：

- `public/manifest.webmanifest`
- `public/icons/claudio.svg`
- `public/sw.js`
- `src/registerServiceWorker.ts`

service worker 使用 network-first 策略，优先拿最新资源，离线时回退到缓存。

## 用户上下文

Codex 后续生成节目时会优先读取这些本地上下文文件：

- `data/taste.md`
- `data/routines.md`
- `data/mood-rules.md`
- `data/playlists.json`

这些文件会由本地 API 组装为 `/api/context`，再作为 Codex 生成节目策划、推荐理由和 DJ 串场的输入。
