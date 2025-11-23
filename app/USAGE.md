# 使用说明（前端）

## 环境要求
- Node.js 18+
- npm 9+（项目使用 npm scripts）

## 安装与启动
```bash
cd app
npm install
npm run dev        # 本地开发，默认端口 5173
npm run build      # 构建产物输出到 dist
npm run preview    # 预览构建产物
npm run lint       # 运行 ESLint（含 Prettier 规则）
npm run format     # 使用 Prettier 格式化
```

## Mock 与联调切换
- 开发默认启用 MSW（见 `src/mocks`）。启动 `npm run dev` 时会自动 `worker.start()`。
- 如需联调后端接口，移除或注释 `src/main.tsx` 中的 `enableMocking()` 调用即可；或在运行时修改为仅在特定环境变量下启用。

## 主要目录
- `src/pages`: 各业务页面（量表、看图说话、诊疗对话、报告、干预占位）。
- `src/components`: 通用组件（进度条、题卡、媒体录制容器、图表等）。
- `src/hooks`: 复用逻辑（`useDwellTime`, `useMediaRecorder`）。
- `src/store`: Redux Toolkit 切片与 store。
- `src/lib/axios.ts`: Axios 实例与拦截器。
- `src/mocks`: MSW handlers 定义。
- `src/theme.ts`: MUI 主题配置。

## 路由入口
- `/scale` 量表测评（默认跳转）
- `/visual-narrative` 看图说话
- `/diagnosis` 智能诊疗对话
- `/report` 综合报告
- `/intervention` 干预占位

## 开发提示
- 录制相关逻辑需 HTTPS 或本地 `localhost` 以获取媒体权限。
- 会话标识保存在 `localStorage` 的 `sessionId`。
- 提前在浏览器设置中允许麦克风/摄像头，方便调试看图说话环节。
