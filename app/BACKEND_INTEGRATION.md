# 后端联调说明

## 基础约定

- 前端所有接口走 `/api/*`，Axios 已封装（`src/lib/axios.ts`），自动附带 `X-Session-Id`；如有 token 将附带 `Authorization: Bearer <token>`。
- 本地开发默认启用 MSW Mock。若要联调后端，注释 `src/main.tsx` 中的 `worker.start()` 相关代码或确保 `public/mockServiceWorker.js` 可用。
- 返回错误时请使用 `{ message: string }`，前端会展示给用户。

## 接口契约

### 1) 认证

- `POST /api/auth/register` body `{ phone, password, name, schoolId?, className?, role }` -> `{ token, user }`
- `POST /api/auth/login` body `{ phone, password }` -> `{ token, user }`

### 2) PHQ-9 + 个人信息

- `GET /api/scale` -> `{ questions: Question[] }`
  - `Question = { id: string; title: string; options: string[]; type: 'single' }`
- `POST /api/scale` -> `{ success: true, score, severity }`
  - Body: `{ profile: { name, gender, ageRange, history, diagnosisTime, diagnosisId, note? }, answers: Record<string,string>, dwellTimes: { questionId, value, dwellTimeMs }[] }`

### 3) CAPS 看图文本（负/中/正各 1 张）

- `GET /api/pictures` -> `{ materials: [{ id, imageUrl, instruction, category }] }`
  - category: `negative|neutral|positive`
- `POST /api/pictures/text` -> `{ success: true }`
  - Body: `{ responses: [{ imageId, category, content }] }`

### 4) 阅读材料（6 选 2）

- `GET /api/readings` -> `{ pool: [{ id, title, content }] }`
- `POST /api/readings/record` -> `{ success: true }`
  - Body: `{ passageIds: number[] }`

### 5) 半结构访谈（A→B→C 各 1 题）

- `GET /api/interview/questions?category=A|B|C&count=1` -> `{ questions: [{ id, category, content }] }`
- `POST /api/interview/answers` -> `{ success: true }`
  - Body: `{ answers: [{ questionId, category, content }] }`

### 6) 本地二分类推理

- `POST /api/inference/local-binary` -> `{ label: string, summary: string, confidence?: number }`
  - Body: `{ phqScore: number, imageTexts: [{ imageId, content }], userProfile: { ageRange, gender, occupation? } }`

### 7) 智能诊疗对话

- `POST /api/chat` -> `{ messages: ChatMessage[] }`
  - Body: `{ messages: ChatMessage[], editCount: number, sessionId?: string }`
  - `ChatMessage`:
    - 文本：`{ id, role: 'user'|'ai'|'system', type: 'text', content }`
    - 选项：`{ id, role: 'ai', type: 'options', content, options: string[] }`

### 8) 综合报告

- `GET /api/report` -> `{ anxietyScore, authenticityScore, radar: { dimension, value }[], insights: string[] }`
  - 前端：`authenticityScore < 60` 时显示黄色警示标签。

## 联调建议

1. 关闭 MSW，`npm run dev` 启动。
2. 按路由顺序测：`/login` 注册/登录 -> `/scale` 提交 -> `/visual-narrative` 3 张文本 -> `/reading` 2 篇 -> `/interview` 3 题 -> `/report` 调用推理。
3. 确认日志中的 `X-Session-Id` 与 token 贯穿全链路；必要时放行 CORS 端口 5173 与自定义头。
