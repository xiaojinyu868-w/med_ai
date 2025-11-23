# 技术方案设计

## 总体架构
- **技术栈**：React 18 + TypeScript + Vite 开发，MUI 作为 UI 组件库，Redux Toolkit 维护全局状态，Axios 负责 HTTP 请求。
- **多媒体能力**：使用原生 `MediaStream Recording API` 实现音视频流捕获与录制。
- **路由结构**：
  1. `/scale` (量表测评)
  2. `/visual-narrative` (看图说话/多模态采集) - **[新增]**
  3. `/diagnosis` (智能诊疗对话)
  4. `/report` (综合报告)
  5. `/intervention` (干预占位)
  公共布局包含顶部导航和渐变背景。
- **Mock 能力**：MSW (Mock Service Worker) 拦截 Axios 请求，模拟量表、多媒体上传、对话与报告接口。

## 页面与组件
- **量表测评页** (`ScalePage`)：渲染题目列表、进度条。`QuestionCard` 负责记录停留时间（`useEffect` + `performance.now`）。
- **看图说话页** (`VisualNarrativePage`) - **[新增]**：
  - `StimulusViewer`：图片展示组件，支持单张或轮播展示刺激材料。
  - `MediaRecorderContainer`：核心录制区，包含权限引导遮罩、`LivePreview` (用户摄像头回显 `<video>`)、录制控制栏 (开始/停止/重录)。
  - 状态机逻辑：`IDLE` (等待) -> `REQUESTING_PERM` (请求权限) -> `READY` (就绪) -> `RECORDING` (录制中) -> `UPLOADING` (上传中) -> `COMPLETED` (完成跳转)。
- **智能诊疗对话窗口** (`ChatPage`)：包含 `MessageList`, `ChatInput`。基于消息类型渲染 UI。使用 `useInputMetrics` hook 记录输入修改行为。
- **综合报告页** (`ReportPage`)：使用 `recharts` 渲染 `GaugeChart` (焦虑分数) 与 `RadarChart` (多维指标)。
- **干预占位页** (`InterventionPage`)：复用 Chat UI 的只读/限制状态。

## 状态与数据流
- **Redux Store 拆分**：
  - `scale`: 题目数据、答案、停留时间。
  - `narrative` (**新增**): 
    - `status`: `idle` | `recording` | `uploading` | `success` | `error`
    - `permissionGranted`: boolean
    - *注意：二进制 Video Blob 不存入 Redux，由组件本地 State 持有或直接传给 AsyncThunk 避免序列化问题。*
  - `chat`: 消息列表、输入修改元数据。
  - `report`: 诊断结果数据。
  - `ui`: 全局 Loading、Toast 状态。

- **数据流向**：
  - 录制结束 -> 获取 Blob -> 调用 `uploadNarrative` Thunk -> 后端返回 videoId -> 存入 Redux -> 路由跳转至 `/diagnosis`。

## API 设计
```plaintext
GET /api/scale
  -> { questions: [] }
POST /api/scale
  -> { success: true }

GET /api/narrative/materials  // [新增] 获取刺激图片
  -> { materials: [{ id, imageUrl, instruction }] }

POST /api/narrative/upload    // [新增] 上传音视频
  Header: Content-Type: multipart/form-data
  Payload:
    - file: (Binary Blob)
    - sessionId: string
    - duration: number
  -> { success: true, videoId: "vid_123" }

POST /api/chat
  -> { messages: [] }

GET /api/report
  -> { anxietyScore, authenticityScore, radar: [], insights: [] }
```

## 测试策略
- **组件测试**：Vitest + RTL 测试 `QuestionCard` 交互。针对 `VisualNarrativePage`，Mock `navigator.mediaDevices` 接口以测试权限拒绝、允许及录制状态变化的 UI 响应。
- **逻辑测试**：测试 `useMediaRecorder` hook 的状态流转（Start -> Stop -> Blob生成）。
- **集成测试**：MSW 模拟大文件上传的延迟与失败场景，验证 Loading 遮罩与重试机制。

## 安全与体验
- **权限管理**：在进入 `/visual-narrative` 时请求权限，若被拒绝，展示友好的“去设置开启”引导页。
- **资源释放**：组件卸载（`Unmount`）时必须调用 `track.stop()` 关闭摄像头与麦克风指示灯，保护用户隐私。
- **HTTPS**：开发环境使用 localhost，生产环境强制 HTTPS 以启用 `getUserMedia`。