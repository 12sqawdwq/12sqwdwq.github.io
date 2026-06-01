# Signals Module Study Document

## Module Goal

Build a closed learning loop for Signals: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Complex numbers and waves, Phase, Linear systems, Time invariance, Impulse response, Convolution, Convolution theorem.

## Recommended Resource

[MIT 6.003 Signals and Systems](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-003-signals-and-systems-fall-2011/)

## Foundational Source

[Fourier, 1822, The Analytical Theory of Heat](https://archive.org/details/analyticaltheory00fourrich)

## Core Formula / Model

Euler formula: `e^(jwt)=cos(wt)+j sin(wt)`. It packages amplitude and phase into one rotating vector.

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
| Day 1 | Complex numbers and waves | Why can complex numbers represent waves? | Plot rotating phasors |
| Day 2 | Phase | Why does phase matter? | Compare phase-shifted sinusoids |
| Day 3 | Linear systems | Why are linear systems special? | Verify superposition |
| Day 4 | Time invariance | Why can systems be shifted in time? | Test time-invariant systems |
| Day 5 | Impulse response | Why does delta define systems? | Simulate RC impulse response |
| Day 6 | Convolution | How do systems accumulate history? | Hand-calculate convolution |
| Day 7 | Convolution theorem | Why does convolution appear everywhere? | Implement convolution in Python |
