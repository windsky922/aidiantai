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

## 文档

- [复现方案](docs/REPLICATION_PLAN.md)
- [任务日志](docs/TASK_LOG.md)

## 本地运行

当前已完成阶段 1.3：静态播放器 Demo 已组件化，并加入 episode 数据校验与错误态。

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

## 当前数据入口

节目数据位于：

```txt
src/data/pilotEpisode.json
```

前端会读取这个 JSON 渲染主播、节目标题、歌曲 preview 和字幕时间轴。后续本地服务或 Codex 只要生成同样结构的数据，就可以替换当前静态节目。数据进入播放器前会先经过基础校验，避免坏数据直接破坏页面。
