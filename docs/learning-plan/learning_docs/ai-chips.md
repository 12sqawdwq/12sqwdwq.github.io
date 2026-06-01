# AI Chips Module Study Document

## Module Goal

Build a closed learning loop for AI Chips: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Tensor cores, Memory wall.

## Recommended Resource

[MIT 6.374 Digital IC](https://ocw.mit.edu/courses/6-374-analysis-and-design-of-digital-integrated-circuits-fall-2003/)

## Foundational Source

[Dennard et al., 1974, Design of Ion-Implanted MOSFETs](https://doi.org/10.1109/JSSC.1974.1050511)

## Core Formula / Model

Switching energy: `E ~= alpha*C*V^2`. Lower voltage, capacitance, or activity reduces energy.

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
| Day 114 | Tensor cores | Why are AI accelerators special? | Matrix multiply benchmark |
| Day 115 | Memory wall | Why is bandwidth limiting AI? | Bandwidth estimation |
