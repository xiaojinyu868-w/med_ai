# MindMVP 前端

基于 React 18 + TypeScript + Vite + MUI 的“学生心理健康多模态诊断”MVP 前端。覆盖量表测评、看图说话录制、智能诊疗对话、报告展示和干预占位。

## 快速开始

```bash
cd app
npm install
npm run dev        # 本地开发（默认 5173）
npm run build      # 产物在 dist
npm run preview    # 预览构建包
npm run lint       # ESLint + Prettier
npm run format     # Prettier 格式化
```

## 主要技术

- React 18 + TS + Vite
- MUI 组件库，自定义主题（浅色，医疗蓝/绿色系）
- Redux Toolkit 管理 scale/narrative/chat/report/ui
- Axios 封装 `/api` 调用，自动附带 `X-Session-Id`
- MSW 本地 Mock（默认开启，`src/mocks`）

## 路由 & 功能

- `/scale` 量表测评：进度条、选项点击 300ms 过渡、停留时间上报、最后一题提交跳转
- `/visual-narrative` 看图说话：素材获取、权限/设备检测、录制 5s 下限/180s 上限、上传重试
- `/diagnosis` 智能诊疗对话：User/AI 气泡、Options 自动发送并禁用、editCount 采集
- `/report` 综合报告：焦虑仪表盘、雷达图、多条洞见，真实性<60 黄色警示
- `/intervention` 干预占位：订阅按钮 Mock

## Mock 与联调

- 本地开发默认启用 MSW。要联调后端，可注释 `src/main.tsx` 中的 `worker.start()` 或保持 `public/mockServiceWorker.js` 可用。
- 详见 `BACKEND_INTEGRATION.md` 获取接口契约与联调步骤。

## 项目结构（简）

- `src/pages`：各业务页面
- `src/components`：通用 UI（题卡、录制容器、图表等）
- `src/hooks`：复用逻辑（`useDwellTime`, `useMediaRecorder`）
- `src/store`：RTK 切片与 store
- `src/mocks`：MSW handlers
- `src/lib/axios.ts`：Axios 实例
- `src/theme.ts`：MUI 主题

## 注意事项

- 媒体权限需 HTTPS 或 localhost；上传接口需支持 multipart/form-data。
- 自定义请求头：`X-Session-Id`。配置 CORS 时记得放行。
