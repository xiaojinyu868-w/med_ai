# 实施计划与工单拆解

## Phase 1: 基础设施与架构搭建 (Days 1-2)
- [ ] **Task 1.1: 项目初始化**
    - 使用 Vite 创建 React + TS 项目。
    - 配置 ESLint, Prettier, Husky (pre-commit hook) 确保代码规范。
    - 定义全局 Theme (MUI `createTheme`)，设置主色调（医疗蓝/温和绿）。
- [ ] **Task 1.2: 路由与布局开发**
    - 安装 `react-router-dom`。
    - 开发 `MainLayout`：包含顶部 AppBar (显示 Logo + 当前环节标题) 和主内容区容器。
    - 配置路由表：`/scale`, `/visual-narrative`, `/diagnosis`, `/report`, `/intervention`。
- [ ] **Task 1.3: 状态管理与网络层配置**
    - 安装 Redux Toolkit。创建 `store` 及基础切片 `uiSlice` (loading, error)。
    - 封装 Axios 实例：配置 BaseURL，全局拦截器（Request 添加 SessionID，Response 统一错误处理）。
    - 配置 MSW：建立 `src/mocks/handlers.ts`，跑通一个简单的 `/api/health` Mock 接口。

## Phase 2: 量表测评模块 (Days 3-4)
- [ ] **Task 2.1: 题目数据结构与 Store**
    - 创建 `scaleSlice`：包含 `questions[]`, `answersMap`, `currentQuestionIndex`。
    - 定义 `Question` 接口：`{ id, title, options, type }`。
- [ ] **Task 2.2: 量表 UI 组件开发**
    - 开发 `ProgressBar` 组件。
    - 开发 `QuestionCard` 组件：包含标题、选项列表。实现点击选项的高亮样式。
- [ ] **Task 2.3: 答题逻辑与计时器**
    - 实现 `useDwellTime` hook：在题目挂载/卸载时计算 `performance.now()` 差值。
    - 集成“上一题/下一题”逻辑，确保回退时回显已选答案。
    - 实现提交逻辑：构建 Payload，调用 Mock API，成功后跳转 `/visual-narrative`。

## Phase 3: 多模态叙述模块 (核心难点) (Days 5-7)
- [ ] **Task 3.1: 媒体权限与预览 Hook**
    - 开发 `useMediaRecorder` hook (核心)：
        - 方法：`startRecording`, `stopRecording`, `reset`.
        - 状态：`permissionState` (prompt/granted/denied), `recordingState` (idle/recording/paused).
        - 实现 `getStream` 逻辑，处理 `NotAllowedError`。
- [ ] **Task 3.2: 页面 UI 开发**
    - 开发 `VisualNarrativePage` 骨架。
    - 开发 `StimulusViewer`：展示图片。
    - 开发 `CameraPreview`：使用 `<video ref={videoRef} autoPlay muted playsInline />` 实现镜像回显。
    - 开发权限被拒的“空状态/错误页”。
- [ ] **Task 3.3: 录制与上传集成**
    - 实现录制计时器组件。
    - 集成 `MediaRecorder` API：监听 `ondataavailable` 收集 Blob chunks。
    - 实现上传逻辑：停止录制 -> 生成 Blob (video/webm) -> `FormData` 封装 -> Axios POST。
    - 添加上传时的全屏 Loading 遮罩。

## Phase 4: 智能对话模块 (Days 8-9)
- [ ] **Task 4.1: 对话 Store 与 UI**
    - 创建 `chatSlice`。
    - 开发 `MessageBubble` 组件：区分 User/AI 样式，支持 Markdown 渲染（可选）。
    - 开发 `QuickReply` 组件：渲染选项按钮。
- [ ] **Task 4.2: 输入框与元数据采集**
    - 开发 `ChatInput` 组件。
    - 实现 `useInputMetrics`：监听键盘事件，统计 Delete/Backspace 及光标移动导致的修改次数。
    - 发送逻辑：消息推入 List -> 异步请求 AI -> 收到回复推入 List。

## Phase 5: 报告与收尾 (Days 10-11)
- [ ] **Task 5.1: 可视化图表**
    - 安装 `recharts`。
    - 开发 `AnxietyGauge` (仪表盘) 和 `DimensionRadar` (雷达图) 组件。
    - 处理数据为空或加载中的 Skeleton 状态。
- [ ] **Task 5.2: 报告页集成**
    - 拉取 `/api/report` 数据。
    - 根据 `authenticityScore` 动态显示警告 Banner。
- [ ] **Task 5.3: 干预页与导航守卫**
    - 实现干预页的静态 UI。
    - (可选) 添加路由守卫：若未完成量表，访问报告页自动重定向至 `/scale`。

## Phase 6: 测试与 QA (Day 12)
- [ ] **Task 6.1: 单元测试**
    - 测试 `scaleSlice` 的答题 reducer 逻辑。
    - 测试 `useInputMetrics` 的计数逻辑是否准确。
- [ ] **Task 6.2: 流程验收**
    - 模拟完整用户路径：量表 -> 拒绝权限 -> 开启权限 -> 录制视频 -> 对话 -> 查看报告。
    - 验证 Mock API 的各种错误返回（500, 401）时前端表现是否优雅。