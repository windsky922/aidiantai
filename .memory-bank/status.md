# 项目状态

最后更新：2026-04-30

## 项目概览

- 项目：复现 mmguo 的 Claudio FM 思路，构建本地个人 AI 电台。
- 仓库：`https://github.com/windsky922/aidiantai.git`。
- 本地路径：`C:\Users\Administrator\Documents\New project 2`。
- 当前重点：以 Codex/OpenAI 作为最终 AI 处理核心，继续完善本地个人 AI 电台系统。

## 当前状态

- 已实现静态播放器、本地上下文 API、Codex prompt 预览、节目契约校验、草稿生成和 provider 适配层。
- 草稿生成默认使用 `sample` provider，因此没有外部凭据也能运行。
- OpenAI Responses provider 已搭好骨架，但只有显式配置 `CODEX_DRAFT_PROVIDER=openai` 和 `OPENAI_API_KEY` 后才应运行。
- Settings 页面可以生成草稿、校验草稿、应用前确认、恢复上一期内存节目、显示当前 Codex provider 状态，并在浏览器本地保存最近 5 条草稿历史。
- 项目文档和记忆文件的说明性文字必须使用中文；技术标识、命令、路径和 API 名称可以保留原文。

## 下一步

- 在用户显式配置凭据后，增加受保护的真实 OpenAI dry-run 流程。
- 后续可将草稿历史从浏览器 `localStorage` 升级为本地服务端存储。
- 后续接入 TTS、音乐 API、天气、日程和反馈记忆。
