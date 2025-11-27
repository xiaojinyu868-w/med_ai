# 技术方案设计

## 总体架构
- **技术栈**：React 18 + TypeScript + Vite；UI 使用 MUI；状态使用 Redux Toolkit；Axios 负责 HTTP；MSW 提供 Mock。
- **路由**：
  1. `/scale` 量表测评
  2. `/visual-narrative` 看图说话（多模态采集）
  3. `/diagnosis` 智能诊疗对话
  4. `/report` 综合报告
  5. `/intervention` 干预占位
- **布局**：`MainLayout` 顶部导航 + 主内容区，渐变背景，支持响应式。

## 页面与核心组件
- **量表测评 (`ScalePage`)**：渲染题目列表与进度条。`QuestionCard` 记录停留时间（`useEffect` + `performance.now`），支持上一题回显与 300ms 过渡。提交后跳转 `/visual-narrative`。
- **看图说话 (`VisualNarrativePage`)**：
  - `StimulusViewer`：展示从接口拉取的图片与描述提示。
  - `MediaRecorderContainer`：管理权限遮罩、实时预览 `<video>`、录制控制（开始/停止/重录）。
  - 状态机：`IDLE` → `REQUESTING_PERM` → `READY` → `RECORDING` → `UPLOADING` → `COMPLETED`。
  - 边界：检测无摄像头（开发可跳过，生产阻断）；录制 <5s 阻止提交并提示；录制 180s 自动停止并提交；上传失败可复用 Blob 重试。
- **智能诊疗对话 (`ChatPage`)**：`MessageList` + `ChatInput`，支持 `Text`/`Options`。选项点击后禁用并自动发送用户消息。`useInputMetrics` 统计 Backspace/Delete/光标移动次数。
- **综合报告 (`ReportPage`)**：`GaugeChart` 展示 GAD-7；`RadarChart` 展示多维指标；authenticityScore <60 显示黄色警示 Tag；加载态使用 Skeleton。
- **干预占位 (`InterventionPage`)**：静态文案 + “订阅通知”按钮（Mock 成功提示）。

## 状态管理与数据流
- **Store 切片**：
  - `scale`: questions, answers, currentQuestionIndex, dwellTimes。
  - `narrative`: `status` (`idle`|`recording`|`uploading`|`success`|`error`), `permissionGranted`, `materials`, `videoId`; 视频 Blob 保持在组件 state。
  - `chat`: messages[], inputMetrics（编辑计数）。
  - `report`: reportData, loading/error。
  - `ui`: 全局 loading/toast。
- **数据流**：
  - 量表提交：汇总 answers + dwellTimes -> `POST /api/scale` -> 成功跳转 `/visual-narrative`。
  - 录制：`MediaRecorder` 收集 chunks -> Blob -> `uploadNarrative` thunk 上传 -> 返回 videoId 存 store -> 跳转 `/diagnosis`。
  - 对话：发送消息（含 editCount）-> `POST /api/chat` -> 推送 AI 回复；选项消息点击后立即发出用户消息并禁用。
  - 报告：`GET /api/report` -> 渲染图表与警示标记。

## API 设计
```plaintext
GET  /api/scale
  -> { questions: [] }
POST /api/scale
  -> { success: true }

GET  /api/narrative/materials
  -> { materials: [{ id, imageUrl, instruction }] }
POST /api/narrative/upload
  Headers: multipart/form-data
  Payload: file (Blob), sessionId, duration
  -> { success: true, videoId: "vid_123" }

POST /api/chat
  Payload: { messages, editCount, sessionId }
  -> { messages: [] }

GET  /api/report
  -> { anxietyScore, authenticityScore, radar: [], insights: [] }
```

## 测试策略
- **组件测试**：`QuestionCard` 交互与停留时间；`VisualNarrativePage` 权限拒绝/允许/录制状态流；`ChatPage` 选项禁用与自动发送。
- **逻辑测试**：`useMediaRecorder` 状态机（start/stop/blob）、录制时长边界（<5s 拒绝、180s 自动停止）。
- **集成测试**：MSW 模拟上传超时/5xx，验证遮罩与重试；端到端路径：量表 → 权限拒绝 → 权限开启 → 录制 → 对话 → 报告。

## 安全与体验
- **权限与设备检测**：进入 `/visual-narrative` 即请求权限；无设备阻断（开发可跳过）；权限拒绝提供重试指引。
- **资源释放**：组件卸载时停止 `MediaStreamTrack`，关闭指示灯。
- **网络与隐私**：仅内存持有媒体数据，上传走 HTTPS。
- **加载与降级**：全局 Skeleton/Loading，错误态提供刷新/重试；报告缺数据时显示空态提示。
