# 需求文档 (v0.3)

## 1. 引言
本项目旨在交付一套“学生心理健康多模态诊断”MVP，核心流程为：心理量表测评 → 多模态叙述（看图说话）→ 智能诊疗对话 → 综合报告。目标是跑通全链路数据采集与基础诊断，确保体验和隐私安全。

## 2. 全局非功能性需求 (NFR)
1. **浏览器兼容性**：主要支持 Chrome (90+)、Edge、Safari (14+)。
2. **响应式设计**：桌面端 (1280px+) 与平板端适配，手机端保证核心功能可用。
3. **数据安全**：采集的视频/音频仅在内存中处理，不写入 LocalStorage；上传必须使用 HTTPS。
4. **加载体验**：所有异步请求需配合 Skeleton/Loading，避免空白僵死。

## 3. 功能需求

### 需求 1 - 心理量表测评 (GAD-7)
**优先级：P0**  
**用户故事：** 用户希望快速完成一组标准心理问卷，并在答题过程中获得流畅的交互体验。

#### 验收标准
1. While 首次进入 `/scale` 页面, when 系统调用 `GET /api/scale`, the 应用 shall 在失败时显示“加载失败，请刷新”按钮，在成功时渲染题目列表。  
2. While 用户答题进行中, when 题目索引发生变化, the 应用 shall 更新顶部进度条（例如 `3/7`）。  
3. While 用户点击单选项, when 非最后一题, the 应用 shall 记录答案并延迟约 300ms 进入下一题并触发平滑过渡动画。  
4. While 用户处于非首题, when 点击“上一题”, the 应用 shall 回显已选答案并允许修改后继续。  
5. While 用户停留在最后一题, when 点击选项, the 应用 shall 将按钮文案切换为“提交并进入下一环节”，再次点击 shall 触发提交并路由到多模态环节。  
6. While 题目可见, when 用户点击选项或切换题目, the 系统 shall 记录停留时间数据 `{ questionId, value, dwellTimeMs }` 并随提交一并发送。  
7. While 用户未完成所有题目直接离开, when 重新进入, the 系统 shall 从头开始问卷（不强制恢复历史进度）。

### 需求 2 - 多模态叙述（看图说话）
**优先级：P0**  
**用户故事：** 用户根据看到的图片进行口头描述，系统采集视频流用于非语言特征分析。

#### 验收标准
1. While 页面加载, when 请求 `getUserMedia`, the 系统 shall 在权限被拒绝时显示阻断页文案“需开启摄像头/麦克风权限”并提供“已开启，重试”按钮。  
2. While 页面加载, when 检测不到摄像头设备, the 系统 shall 提示“未检测到摄像头，无法进行本环节”，仅开发环境允许跳过，生产环境阻断流程。  
3. While 成功获取材料, when 用户查看刺激图片, the 系统 shall 显示从 `GET /api/narrative/materials` 获取的图片和提示“请用 1-2 分钟描述…”，并在角落呈现镜像实时预览。  
4. While 用户点击“开始录制”, when 录制启动, the 系统 shall 显示红点与计时器 `00:00`，并将按钮改为“停止并提交”。  
5. While 录制进行, when 用户点击停止且录制时长 < 5 秒, the 系统 shall 弹 Toast “请再多描述一点细节”并不提交。  
6. While 录制进行, when 录制达到 180 秒, the 系统 shall 自动停止并进入提交流程。  
7. While 录制结束, when 生成 Blob, the 系统 shall 以 `multipart/form-data` 上传 `{ file, sessionId, duration }` 到 `POST /api/narrative/upload` 并显示全屏“上传中”遮罩。  
8. While 上传失败 (5xx/超时), when 用户点击“重试上传”, the 系统 shall 复用内存中的 Blob 重新上传，无需重新录制。  
9. While 上传成功 (200), when 收到返回, the 系统 shall 路由到 `/diagnosis`。

### 需求 3 - 智能诊疗对话
**优先级：P0**  
**用户故事：** 用户与 AI 咨询师对话，补充量表未覆盖的信息。

#### 验收标准
1. While 页面初始化, when 系统发送隐藏 `system` 消息或携带 `sessionId`, the 系统 shall 拉取并展示开场白。  
2. While 用户/AI 消息渲染, when 消息角色为 User/AI, the 系统 shall 使用右侧绿色气泡与左侧灰色气泡分别展示。  
3. While 消息类型为 `Options`, when 用户点击其中一个按钮, the 系统 shall 将按钮组置为 Disabled 并将按钮文案作为 User 消息自动发送。  
4. While 用户在输入框编辑, when 触发 Backspace/Delete 或光标移动插入, the 系统 shall 将编辑计数器 +1 并在发送时附带该计数，发送完成后计数清零。  
5. While AI 回复生成中, when 等待接口返回, the 系统 shall 将输入框置为 Disabled，收到回复后恢复可编辑。

### 需求 4 - 综合诊断报告
**优先级：P1**  
**用户故事：** 用户查看基于所有数据生成的最终报告。

#### 验收标准
1. While 拉取报告数据, when 数据可用, the 系统 shall 使用半圆仪表盘展示 GAD-7 分数，按分数区间切换绿/黄/红配色。  
2. While 渲染多维指标, when 提供维度数据, the 系统 shall 使用雷达图展示“睡眠”“情绪”“真实性”“压力”等维度。  
3. While 显示结论, when 后端提供建议文本, the 系统 shall 展示“综合评估建议”文本块。  
4. While authenticityScore < 60, when 渲染报告, the 系统 shall 显示黄色警示 Tag：“评估结果可能存在偏差，建议人工复核”。  
5. While 用户点击“返回首页/退出”, when 操作触发, the 系统 shall 清理 Redux Session 数据。

### 需求 5 - 干预占位
**优先级：P2**  
**用户故事：** 提前告知用户干预功能即将上线。

#### 验收标准
1. While 用户访问 `/intervention`, when 页面加载, the 系统 shall 展示文案“AI 心理干预课程正在生成…”。  
2. While 用户点击“订阅通知”, when 触发交互, the 系统 shall 展示 Mock 成功提示。
