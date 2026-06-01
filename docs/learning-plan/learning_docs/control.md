# Control Module Study Document

## Module Goal

Build a closed learning loop for Control: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Negative feedback, Closed-loop gain, Distortion suppression, Noise suppression, Laplace transform, Transfer function, Poles, Zeros, First-order systems, Second-order systems, Stability, Bode plot, Phase margin, Nyquist, PID, State-space.

## Recommended Resource

[MIT 6.003 feedback/control materials](https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/)

## Foundational Source

[Bode, 1945, Network Analysis and Feedback Amplifier Design](https://archive.org/details/networkanalysisf00bode)

## Core Formula / Model

Closed-loop transfer: `T(s)=G(s)/(1+G(s)H(s))`. The denominator drives stability and oscillation.

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
| Day 21 | Negative feedback | Why does feedback improve systems? | Draw feedback block diagram |
| Day 22 | Closed-loop gain | Why does gain stop depending on A? | Compute closed-loop gains |
| Day 23 | Distortion suppression | Why does feedback reduce distortion? | Derive nonlinear suppression |
| Day 24 | Noise suppression | Why does feedback suppress noise? | Simulate noisy amplifier |
| Day 25 | Laplace transform | Why do ODEs become algebraic? | Transform RC equations |
| Day 26 | Transfer function | How do systems map input to output? | Derive RLC transfer |
| Day 27 | Poles | Why do poles determine stability? | Plot pole responses |
| Day 28 | Zeros | How do zeros shape dynamics? | Compare systems with zeros |
| Day 29 | First-order systems | What is a time constant? | Fit RC charging curves |
| Day 30 | Second-order systems | Why do oscillations happen? | Simulate damping ratios |
| Day 31 | Stability | Why do systems diverge? | Check pole stability |
| Day 32 | Bode plot | How do gain and phase vary? | Plot Bode diagrams |
| Day 33 | Phase margin | Why do systems oscillate? | Estimate margins |
| Day 34 | Nyquist | Why does encirclement matter? | Plot Nyquist curves |
| Day 35 | PID | Why does PID dominate industry? | Tune PID loop |
| Day 36 | State-space | How do modern systems model states? | Write state equations |
| Day 53 | Stability | Why do systems diverge? | Check pole stability |
| Day 54 | Bode plot | How do gain and phase vary? | Plot Bode diagrams |
| Day 55 | Phase margin | Why do systems oscillate? | Estimate margins |
| Day 56 | Nyquist | Why does encirclement matter? | Plot Nyquist curves |
| Day 57 | PID | Why does PID dominate industry? | Tune PID loop |
| Day 58 | State-space | How do modern systems model states? | Write state equations |
| Day 75 | Stability | Why do systems diverge? | Check pole stability |
| Day 76 | Bode plot | How do gain and phase vary? | Plot Bode diagrams |
| Day 77 | Phase margin | Why do systems oscillate? | Estimate margins |
| Day 78 | Nyquist | Why does encirclement matter? | Plot Nyquist curves |
| Day 79 | PID | Why does PID dominate industry? | Tune PID loop |
| Day 80 | State-space | How do modern systems model states? | Write state equations |
