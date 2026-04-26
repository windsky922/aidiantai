# 任务日志

本文件记录每次阶段任务、操作内容和 GitHub 同步情况。

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
- 后续再接 Claude、TTS、音乐 API、天气、日程和长期记忆。

GitHub：

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 1.2 - 抽离节目 JSON 数据模型

目标：

- 将写在 `src/App.tsx` 里的节目内容抽离成可替换 JSON。
- 为后续 Claude 生成节目数据、本地服务返回节目数据打基础。

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

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。

## 2026-04-26：阶段 1.1 - 前端项目骨架和静态播放器界面

目标：

- 搭建 Vite + React + TypeScript 前端项目。
- 先复现 Claudio 公开页面的核心播放器体验。
- 不接后端、不接 Claude、不接 TTS API，先获得可运行的视觉和交互基线。

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

- 待提交并推送到 `https://github.com/windsky922/aidiantai.git`。
