# 后端联调说明

## 你需要知道的基础
- 前端所有接口走 `/api/*`，Axios 已写好（`src/lib/axios.ts`）。
- 每个请求头都会带 `X-Session-Id`，值保存在 `localStorage`。后端可用它串联同一会话。
- 本地开发默认用 MSW Mock。要接后端，注释/移除 `src/main.tsx` 里 `worker.start()` 相关代码或保持 `mockServiceWorker.js` 可用。
- 看图说话的上传是 `multipart/form-data`，需要 HTTPS 或 localhost 才能启用摄像头。

## 接口契约与行为

### 1) 量表测评
- `GET /api/scale` → `{ questions: Question[] }`
  - `Question = { id: string; title: string; options: string[]; type: 'single' }`
- `POST /api/scale` → `{ success: true }`
  - Body: `{ answers: Record<string,string>, dwellTimes: { questionId, value, dwellTimeMs }[] }`
- 备注：前端会在客户端做 300ms 过渡与上一题回显，后端只需收/存数据。

### 2) 看图说话（多模态上传）
- `GET /api/narrative/materials` → `{ materials: [{ id, imageUrl, instruction }] }`
- `POST /api/narrative/upload` → `{ success: true, videoId: string }`
  - FormData:
    - `file`: video/webm
    - `sessionId`: string
    - `duration`: number (ms)
  - 前端约束：录制 <5s 不会发请求；录制满 180s 自动停止并提交；上传失败时会“重试上传”复用同一 Blob。
  - 请确保能接受较大表单，超时或 5xx 返回 `message` 便于前端提示。

### 3) 智能诊疗对话
- `POST /api/chat` → `{ messages: ChatMessage[] }`
  - Body: `{ messages: ChatMessage[], editCount: number, sessionId?: string }`
  - `ChatMessage`:
    - 文本：`{ id, role: 'user'|'ai'|'system', type: 'text', content }`
    - 选项：`{ id, role: 'ai', type: 'options', content, options: string[] }`
  - 前端行为：点击 options 后会把选项文本作为 User 消息再调接口，并禁用该 options 组；AI 生成时输入框会禁用。

### 4) 报告
- `GET /api/report` → `{ anxietyScore: number, authenticityScore: number, radar: { dimension, value }[], insights: string[] }`
  - 前端：`authenticityScore < 60` 时会显示黄色警示标签。

## 错误与状态
- 正常返回 2xx；错误（含 5xx/超时）请返回 `{ message: string }`，前端会用来提示。
- 上传接口请允许较大体积，支持失败后重试。

## 联调建议步骤
1) 在前端关闭 Mock：注释 `src/main.tsx` 的 MSW 启动，`npm run dev`。
2) 按路由顺序测：
   - `/scale`：问卷加载 + 提交。
   - `/visual-narrative`：图片获取、权限拒绝提示、录制时长边界、上传成功/失败重试。
   - `/diagnosis`：options 点击禁用、editCount 透传。
   - `/report`：分数、authenticity 警示。
3) 确认 `X-Session-Id` 在日志中贯穿全链路；必要时配置 CORS 允许 5173 端口和该自定义头。
