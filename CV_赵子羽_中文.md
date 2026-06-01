# 赵子羽

邮箱：ziyuzhao2027@163.com | 电话：+86-18439471396 | GitHub: https://github.com/12sqawdwq

## 教育经历

**西交利物浦大学** | 2023.09 - 至今  
微电子科学与工程 本科 | 均分：82.5

## 实习经历

**深圳科创学院 InnoX Academy** | 2025.07 - 至今  
嵌入式 / 算法开发实习生

- 参与蓝知医疗团队眼压测量设备研发，负责蓝牙通信与电机闭环控制等嵌入式模块。
- 后续转向算法开发，围绕探头推进测量眼球力学响应建立 ANSYS 有限元模型，分析探头偏心推进、个体生物力学差异和误操作等非理想工况。
- 制定针对探头偏心推进、生物力学差异和测量误操作的控制、误差补偿与采样方案。

**字节跳动火山引擎 Data 部门** | 2025.12 - 2026.05  
技术运营实习生

- 负责面向社区的 AI 产品技术运营，包括用户答疑、问题分流、反馈整理与产品/技术侧同步。
- 进行大模型能力 benchmark 横向对比，整理不同模型在代表性任务中的表现、短板和适用场景。
- 分析 LLM Agent 与 vibe-coding 竞品，覆盖产品定位、工具链设计、开发者体验和潜在优化方向。

**深兰科技（上海）** | 2024.04 - 2025.06  
嵌入式软件工程师

- 参与轮足机器人研发，实现步态控制算法与电机控制硬件接口。
- 基于 Raspberry Pi 5 进行路径规划、SLAM 建图和深度相机实时避障，设计与下位机的 CAN 通信。
- 使用 IMU 传感器融合进行定位与运动状态估计，参与技术论坛和校园讲座中的 AI/机器人产品讲解。

**三易三维科技（青岛）** | 2024.01 - 2024.03  
嵌入式全栈工程师

- 设计并装配大型 FDM 3D 打印机，用于打印机结构与控制流程测试。
- 使用 SolidWorks 设计和仿真 Delta 3D 打印机运动系统，重点关注步进电机与同步带传动结构。
- 部署 Marlin 固件实现传感器与执行器控制，完成 PID 电机控制与传感器集成。

## 论文发表

- Z. Zhao, H. S. Gan, Y. Cao, Z. A. Ocal, and I. O. Koska, "PAD-Former: A Two-Stage PI-RADS Classification Framework with Multi-Modal Anomaly Diffusion and Cross-Attention," in *Proc. 2025 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)*, 2025, pp. 6162-6169, doi: [10.1109/BIBM66473.2025.11356522](https://doi.org/10.1109/BIBM66473.2025.11356522).（BIBM 会议论文；CCF-B）

## 项目经历

### AI 与工程工具

**ForgeSpec Studio：AI 辅助参数化 CAD 生成器** | GitHub: [ForgeSpec-Studio](https://github.com/12sqawdwq/ForgeSpec-Studio) | 2026

- 构建 AI 辅助工程设计工具，将自然语言需求转化为可追溯的参数化 CAD 包，支持浏览器预览与 STEP/STL/Python/metadata 导出。
- 设计 FastAPI 后端、确定性 AssemblySpec 流水线、CadQuery 建模模块，并接入智谱/BigModel、Gemini 与标准件 fallback 模板。
- 实现中英文界面、进度日志、JSON 高亮、一键下载，以及常见紧固件和机械标准件的确定性扩展。

**Sky Monitor API 与交互式星图 Wiki** | GitHub: [sky_monitor_api](https://github.com/12sqawdwq/sky_monitor_api) | 2026

- 构建面向位置感知观星助手的 FastAPI 后端，根据 GPS 坐标和观测时间返回可见恒星、行星和深空天体结构化 JSON。
- 集成 HYG 恒星星表、Skyfield/JPL DE421 星历、SQLite 星表查询与 Messier/NGC 深空天体元数据。
- 开发交互式 Wiki 演示，支持极坐标星图、城市解析、缩放/旋转、文件上传和面向 LLM 的观测建议上下文。

### 嵌入式系统与机器人

**ROS2 自动驾驶小车控制系统** | 复旦大学智能感知与自主系统实验室 | 2024.06 - 2024.08

- 在 NVIDIA Jetson NX 平台开发 LiDAR 感知融合模块，用于环境感知与避障。
- 实现 SLAM 定位建图、ROS2 框架下 A* 路径规划，以及 PID 速度与转向控制。
- 设计感知、规划和底层执行一体化的 ROS2 导航控制流程模块。

**OpenMV 高速目标检测系统** | GitHub: [openmv_green_tracking](https://github.com/12sqawdwq/openmv_green_tracking) | 2025.06 - 2025.08

- 基于 OpenMV 与 STM32H7 实现多颜色实时目标检测，在动态场景下达到 120-200 FPS。
- 通过相机标定实现视觉测距，并设计高速 SPI 通信接口用于嵌入式数据传输。

**STM32 20x4 LCD 图形引擎** | GitHub: [mes204_plus](https://github.com/12sqawdwq/mes204_plus) | 2025

- 基于 STM32F446xx 和 HD44780 兼容 20x4 字符 LCD 构建图形引擎，使用优化的 8 位并行 LCD 驱动与 CMake/ARM GCC 工作流。
- 在受限显示资源下实现图元绘制、数学视觉特效、线框 3D 渲染、粒子效果和字符视频播放。
- 编写中英文文档、固件架构说明、构建流程和可视化演示材料。

**STM32 LCD1602 实时游戏系统** | GitHub: [MES204_lcd](https://github.com/12sqawdwq/MES204_lcd) | 2025

- 使用 STM32F446xx、C 语言和 LCD1602 字符屏实现实时 T-Rex Runner 游戏。
- 利用定时器中断、EXTI 低延迟按键输入和非阻塞状态机，在有限 CGRAM 资源下完成流畅动画。

### 数字设计、系统工具与建模

**AXI-Stream Header Insertion RTL 模块** | GitHub: [verilog_code_test](https://github.com/12sqawdwq/verilog_code_test) | 2025

- 使用 Verilog 设计 AXI-Stream 数据包头插入模块，支持 valid/ready 握手、keep/last 字节有效信号和可配置数据宽度。
- 实现字节计数、数据缓存和插入状态控制，并编写端口、参数与内部寄存器文档。

**STM32 CLI 远程嵌入式开发工具** | GitHub: [stm32-cli-toolkit](https://github.com/12sqawdwq/stm32-cli-toolkit) | 2025

- 开发轻量级 Bash/Zsh 工具，封装 OpenOCD、CMake 与 ARM GCC 流程，支持 Linux/headless STM32 开发。
- 实现自动构建产物检测、多系列烧录、并行编译和 USB reset recovery，用于 STM32 板级 bring-up 流程。

**CAE 仿真验证平台** | GitHub: [ANSYS_skill](https://github.com/12sqawdwq/ANSYS_skill) | 2026

- 围绕 Discovery/SpaceClaim 几何交付、Workbench 项目、Mechanical 网格/载荷/求解/结果评估构建仿真验证流程。
- 定义 FEM/CFD 验证检查项，覆盖求解状态、云图/图例和 Min/Max 结果证据。

### 生物医学嵌入式系统

**STM32 智能压力感知坐垫系统** | 华东师范大学智能超声研究中心 | 2024.02 - 2024.05

- 设计高分辨率压力传感器阵列，用于实时坐姿监测。
- 使用 KNN 回归识别弯腰、骨盆倾斜等异常姿态，并支持脊柱病理特征预测。
- 基于 MATLAB 生成实时压力热力图和姿态分析结果。

**多通道电刺激控制系统** | 华东师范大学智能超声研究中心 | 2023.11 - 2024.02

- 开发 Flutter 跨平台移动端控制系统，打通硬件层与后端通信协议。
- 负责系统架构、UI/UX、协议处理和设备控制逻辑，集成 I2C、CAN 与 Bluetooth 通信。
- 开发 STM32F103/F407 与 ESP32 原型固件，实现多通道刺激同步输出和基于生物阻抗反馈的闭环控制。

**可穿戴 ECG 与血氧监测设备** | 上海市多维信息处理重点实验室 | 2023.11 - 2024.02

- 基于 MAX30102/GH3220 构建便携式生物医学传感系统，实现 ECG 与 SpO2 监测。
- 完成生理信号滤波、参数提取、蓝牙/串口数据传输和实时监测界面。

## 校园经历

- 西交利物浦大学科创协会主席。
- JetBrains、MATLAB、智谱 AI 校园大使。

## 技能

- 编程与硬件描述：C/C++、Python、MATLAB、Verilog、JavaScript、HTML/CSS
- 嵌入式与机器人：STM32、ESP32、Raspberry Pi、OpenMV、ROS2、CAN、I2C、SPI、Bluetooth、PID 控制、传感器融合、SLAM
- AI / 视觉 / Agent：PyTorch、TensorFlow、OpenCV、大模型 benchmark、LLM Agent 分析、prompt 与工作流评估
- AI 编程工具：Claude Code、Codex、Cursor、GitHub Copilot、Windsurf
- 工程工具：ANSYS、SolidWorks、CadQuery、GNU Toolchain、OpenOCD、CMake、Git
