# Ziyu Zhao

Email: ziyuzhao2027@163.com | Tel: +86-18439471396 | GitHub: https://github.com/12sqawdwq

## Education

**Xi'an Jiaotong-Liverpool University** | Sep 2023 - Present  
BEng in Microelectronics Science and Technology | Average Grade: 82.5

## Internship Experience

**Shenzhen InnoX Academy** | Jul 2025 - Present  
Embedded / Algorithm Development Intern

- Developed embedded modules for a medical intraocular-pressure measurement device in the LanZhi Medical team, covering Bluetooth communication and closed-loop motor control.
- Transitioned into algorithm development for probe-driven ocular biomechanical response measurement; built finite-element models in ANSYS to analyze non-ideal measurement conditions, including eccentric probe advancement, subject-specific biomechanical variance, and operational errors.
- Developed control, error-compensation, and sampling strategies for probe-offset advancement, biomechanical variance, and measurement-operation disturbances.

**ByteDance Volcano Engine Data Department** | Dec 2025 - May 2026  
Technical Operations Intern

- Handled technical operations for community-facing AI products, including user Q&A, issue triage, and feedback consolidation for product and technical teams.
- Conducted horizontal benchmark comparisons of large-model capabilities across representative tasks; recorded performance differences, limitations, and task-specific operating conditions.
- Analyzed competing LLM agent products and vibe-coding workflows, covering product positioning, tool-chain structure, developer interaction flow, and feature coverage.

**DeepBlue Technology (Shanghai)** | Apr 2024 - Jun 2025  
Embedded Software Engineer

- Implemented gait-control algorithms and motor-control hardware interfaces for a wheeled biped robot.
- Used Raspberry Pi 5 for path planning, SLAM-based mapping, and real-time obstacle avoidance with a depth camera; designed CAN-based communication with embedded controllers.
- Applied IMU-based sensor fusion for localization and motion-state estimation.
- Delivered technical presentations on DeepBlue AI and robotics products in technology forums and campus lectures.

**Sanyi 3D Technology (Qingdao)** | Jan 2024 - Mar 2024  
Embedded Full-Stack Engineer

- Designed and assembled large-scale FDM 3D printers to support product iteration.
- Used SolidWorks to design and simulate delta-printer motion systems, focusing on stepper-motor actuation and belt-drive transmission.
- Deployed Marlin firmware for sensor and actuator control; implemented PID-based motor control and sensor integration.

## Publication

- Z. Zhao, H. S. Gan, Y. Cao, Z. A. Ocal, and I. O. Koska, "PAD-Former: A Two-Stage PI-RADS Classification Framework with Multi-Modal Anomaly Diffusion and Cross-Attention," in *Proc. 2025 IEEE International Conference on Bioinformatics and Biomedicine (BIBM)*, 2025, pp. 6162-6169, doi: [10.1109/BIBM66473.2025.11356522](https://doi.org/10.1109/BIBM66473.2025.11356522). (BIBM conference paper; CCF-B)

## Project Experience

### AI & Engineering Tools

**ForgeSpec Studio: AI-assisted Parametric CAD Generator** | GitHub: [ForgeSpec-Studio](https://github.com/12sqawdwq/ForgeSpec-Studio) | 2026

- Built an AI-assisted engineering tool that turns natural-language requirements into source-first parametric CAD packages with browser preview and STEP / STL / Python / metadata export.
- Designed a FastAPI backend with a deterministic AssemblySpec pipeline, CadQuery-based CAD generation, provider support for Zhipu / BigModel and Gemini, and fallback templates for standard parts.
- Added bilingual UI, progress logs, JSON highlighting, one-click downloads, and standards-backed expansion for common fasteners and mechanical components.

**Sky Monitor API & Interactive Star-Map Wiki** | GitHub: [sky_monitor_api](https://github.com/12sqawdwq/sky_monitor_api) | 2026

- Built a FastAPI backend for a location-aware stargazing assistant, returning structured JSON for visible stars, planets, and deep-sky objects based on GPS coordinates and observation time.
- Integrated HYG star catalog data, Skyfield / JPL DE421 ephemerides, SQLite catalog queries, and Messier / NGC object metadata to support astronomy calculations and target filtering.
- Developed an interactive Wiki demo with polar star-chart rendering, city lookup, zoom / rotation controls, file upload, and LLM-ready reasoning context for observation recommendations.

### Embedded Systems & Robotics

**ROS2-based Autonomous Vehicle Control System** | Fudan University Intelligent Perception & Autonomous System Lab | Jun 2024 - Aug 2024

- Developed a LiDAR-based perception-fusion module for environment sensing and obstacle avoidance on NVIDIA Jetson NX.
- Implemented SLAM for localization and mapping, A* path planning in ROS2, and PID-based speed and steering control.
- Designed ROS2 navigation and control pipeline modules integrating perception, planning, and low-level actuation.

**OpenMV-based High-Speed Target Detection System** | GitHub: [openmv_green_tracking](https://github.com/12sqawdwq/openmv_green_tracking) | Jun 2025 - Aug 2025

- Implemented a real-time multi-color target detection system using OpenMV and STM32H7, achieving 120-200 FPS in dynamic conditions.
- Developed vision-based distance estimation through camera calibration and designed a high-speed SPI communication interface for embedded data transfer.

**STM32 20x4 LCD Graphics Engine** | GitHub: [mes204_plus](https://github.com/12sqawdwq/mes204_plus) | 2025

- Built a graphics engine on STM32F446xx for an HD44780-compatible 20x4 character LCD, using an optimized 8-bit parallel LCD driver and CMake / ARM GCC build workflow.
- Implemented graphics primitives, mathematical visual effects, a wireframe 3D renderer, particle effects, and character-video playback under highly constrained display resources.
- Structured the repository with bilingual documentation, firmware architecture notes, build instructions, and visual demonstration materials.

**STM32 LCD1602 Real-Time Game System** | GitHub: [MES204_lcd](https://github.com/12sqawdwq/MES204_lcd) | 2025

- Built an embedded real-time T-Rex runner game on STM32F446xx using C, LCD1602 character display rendering, timer interrupts, and EXTI-based low-latency button input.
- Designed a constrained rendering pipeline using LCD1602 CGRAM resources and a non-blocking state machine to support responsive animation under limited display memory.
- Packaged the project with hardware documentation, firmware architecture notes, and reproducible STM32 development setup.

### Digital Design & Chip-Level Systems

**AXI-Stream Header Insertion RTL Module** | GitHub: [verilog_code_test](https://github.com/12sqawdwq/verilog_code_test) | 2025

- Designed a Verilog AXI-Stream module for packet-header insertion with valid / ready handshaking, keep / last byte-valid signals, and configurable data width.
- Implemented byte-count tracking, data buffering, and insertion-state control to align inserted header data with streaming payload transfer.
- Documented module parameters, ports, internal registers, and output-transfer logic for digital-design review and reuse.

### Computer Systems & Developer Tools

**STM32 CLI Toolkit for Remote Embedded Development** | GitHub: [stm32-cli-toolkit](https://github.com/12sqawdwq/stm32-cli-toolkit) | 2025

- Developed a lightweight Bash / Zsh toolkit wrapping OpenOCD, CMake, and ARM GCC workflows for STM32 development on Linux and headless environments.
- Implemented commands for automatic build-artifact detection, multi-series flashing, parallel compilation, and USB reset recovery in STM32 bring-up workflows.

### Mathematical Modeling & Biomedical Systems

**CAE Simulation Validation Platform** | GitHub: [ANSYS_skill](https://github.com/12sqawdwq/ANSYS_skill) | 2026

- Built a simulation-validation workflow around Discovery / SpaceClaim geometry handoff, Workbench project setup, Mechanical meshing, load definition, solving, and result evaluation.
- Defined FEM/CFD validation checks covering solved-state evidence, contour and legend inspection, and non-empty Min / Max result verification.

**STM32-based Smart Pressure-Sensing Cushion System** | East China Normal University Intelligent Ultrasound Research Center | Feb 2024 - May 2024

- Designed a high-resolution pressure-sensor array system for real-time sitting-posture monitoring.
- Used KNN regression to identify abnormal postures, including slouching and pelvic tilt, and estimate spinal pathological features.
- Visualized real-time pressure distributions and posture analytics in MATLAB through heatmaps and monitoring dashboards.

**Multi-channel Electrical Stimulation Control System** | East China Normal University Intelligent Ultrasound Research Center | Nov 2023 - Feb 2024

- Developed a cross-platform Flutter mobile control system and aligned communication between the hardware layer and back-end protocol processing.
- Designed system architecture, including front-end UI/UX, communication protocol handling, device-control logic, and integration of I2C, CAN, and Bluetooth modules.
- Developed embedded firmware for STM32F103/F407 and ESP32 prototypes for synchronized multi-channel stimulation output.
- Implemented closed-loop stimulation control based on bio-impedance feedback.

**Wearable ECG & Oxygen Saturation (SpO2) Monitoring Device** | Shanghai Key Lab of Multi-Dimensional Information Processing | Nov 2023 - Feb 2024

- Created a portable biomedical sensing device using MAX30102 / GH3220 for ECG and SpO2 monitoring.
- Filtered biomedical signals, extracted physiological parameters, and developed Bluetooth / serial data transmission.
- Built a user-facing real-time monitoring interface for physiological-data visualization.

## Campus Activities

- President, XJTLU Science Innovation Association.
- Campus Ambassador: JetBrains, MATLAB, and ZhipuAI.

## Skills

- Programming & HDL: C/C++, Python, MATLAB, Verilog, JavaScript, HTML/CSS
- Embedded & Robotics: STM32, ESP32, Raspberry Pi, OpenMV, ROS2, CAN, I2C, SPI, Bluetooth, PID control, sensor fusion, SLAM
- AI / Vision / Agents: PyTorch, TensorFlow, OpenCV, large-model benchmarking, LLM agent analysis, prompt and workflow evaluation
- AI Coding Tools: Claude Code, Codex, Cursor, GitHub Copilot, Windsurf
- Engineering Tools: ANSYS, SolidWorks, CadQuery, GNU Toolchain, OpenOCD, CMake, Git
