# EDA Module Study Document

## Module Goal

Build a closed learning loop for EDA: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: RTL to GDS, Static timing, Place and route, FPGA.

## Recommended Resource

[Nand2Tetris tools/projects](https://www.nand2tetris.org/)

## Foundational Source

[Kernighan and Lin, 1970, Graph Partitioning](https://doi.org/10.1002/j.1538-7305.1970.tb01770.x)

## Core Formula / Model

Timing constraint: `T_clk >= t_CQ + t_logic + t_setup + t_skew`. This bounds the maximum clock frequency.

How to study the formula:

- Identify every variable and decide whether it is physical, geometric, statistical, or computational.
- Write the assumptions that make the formula valid.
- Verify one minimal example using numbers, a plot, or code.

## Daily Prompt Template

| Field | Content |
|---|---|
| Theory Name | Today's theory or model name |
| Real-world Problem | What real engineering problem it solves |
| Core Equation | The central equation or invariant |
| Derivation Starting Point | Which definition, conservation law, or assumption starts the derivation |
| Physical/Geometric Meaning | Physical, geometric, or system-level meaning |
| Failure Conditions | When the model breaks |
| Cross-domain Connections | Links to other modules |
| Engineering Applications | Practical engineering use cases |
| Simulation / Verification | How you verified it today |
| What I Truly Understood Today | The one thing you genuinely understood |

## Module Daily Index

| Day | Topic | Key Question | Practice |
|---:|---|---|---|
| Day 110 | RTL to GDS | How are chips built? | Map design flow |
| Day 111 | Static timing | Why are setup/hold critical? | Timing analysis |
| Day 112 | Place and route | Why does layout affect speed? | Simple floorplan |
| Day 113 | FPGA | Why use reconfigurable logic? | FPGA blink design |
| Day 135 | RTL to GDS | How are chips built? | Map design flow |
| Day 155 | RTL to GDS | How are chips built? | Map design flow |
| Day 175 | RTL to GDS | How are chips built? | Map design flow |
