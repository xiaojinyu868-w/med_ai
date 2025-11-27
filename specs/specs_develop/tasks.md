# 实施计划

- [x] [1] 项目初始化与规范  
— 具体要做的事情：使用 Vite 创建 React+TS；配置 ESLint/Prettier/Husky；建立 MUI 主题、Axios 基础实例、MSW 健康检查 Mock。  
— 需求: NFR

- [x] [2] 路由与布局骨架  
— 具体要做的事情：搭建 `MainLayout`（AppBar + 内容区），配置 `/scale`, `/visual-narrative`, `/diagnosis`, `/report`, `/intervention` 路由。  
— 需求: NFR

- [x] [3] Redux Store 与切片框架  
— 具体要做的事情：创建 store；初始化 `uiSlice`、`scaleSlice`、`narrativeSlice`、`chatSlice`、`reportSlice` 基础结构。  
— 需求: 1,2,3,4

- [x] [4] 量表数据模型与加载  
— 具体要做的事情：定义 Question 接口；实现 `GET /api/scale` 加载与错误重试；渲染题目列表与进度条。  
— 需求: 1

- [x] [5] 量表交互与停留时间  
— 具体要做的事情：实现选项点击 300ms 过渡、上一题回显、最后一题提交跳转；`useDwellTime` 记录 `{questionId, value, dwellTimeMs}`。  
— 需求: 1

- [x] [6] 媒体权限与设备检测  
— 具体要做的事情：封装 `useMediaRecorder`；请求/处理 `getUserMedia` 权限；检测无摄像头时阻断（开发可跳过）；权限拒绝阻断页+重试。  
— 需求: 2

- [x] [7] 看图说话页面骨架  
— 具体要做的事情：实现 `StimulusViewer` 获取并展示材料、镜像实时预览、提示文案；录制控制栏 UI。  
— 需求: 2

- [x] [8] 录制时长与上传流程  
— 具体要做的事情：MediaRecorder 收集 Blob；<5s 停止时提示不提交；180s 自动停止；`multipart/form-data` 上传并显示全屏遮罩；失败重试复用 Blob；成功跳转诊疗。  
— 需求: 2

- [x] [9] 对话消息与选项交互  
— 具体要做的事情：消息列表支持 User/AI 两种气泡；Options 消息点击后禁用并自动发送用户消息；发送/等待状态控制输入框禁用。  
— 需求: 3

- [x] [10] 输入行为采集  
— 具体要做的事情：实现 `useInputMetrics`，监听 Backspace/Delete/光标移动计数，随消息发送并复位。  
— 需求: 3

- [x] [11] 报告图表与警示  
— 具体要做的事情：集成 `recharts`；实现半圆仪表盘与雷达图；authenticityScore<60 显示黄色警示 Tag；空态/Skeleton 处理。  
— 需求: 4

- [x] [12] 干预占位页  
— 具体要做的事情：展示“AI 心理干预课程正在生成…”文案；Mock “订阅通知”成功提示。  
— 需求: 5

- [ ] [13] 测试与验收  
— 具体要做的事情：编写组件/逻辑测试（QuestionCard、useMediaRecorder 边界、Chat 选项禁用）；MSW 集成模拟上传失败与全链路流程验收。  
— 需求: 1,2,3,4,5, NFR
