# Optimization Module Study Document

## Module Goal

Build a closed learning loop for Optimization: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Least squares, Gradient descent, Kalman filter, LQR.

## Recommended Resource

[Convex Optimization book](https://web.stanford.edu/~boyd/cvxbook/)

## Foundational Source

[Kalman, 1960, A New Approach to Linear Filtering and Prediction Problems](https://doi.org/10.1115/1.3662552)

## Core Formula / Model

Gradient descent: `theta_next=theta-eta*grad J(theta)`. Move parameters along the local steepest decrease.

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
| Day 49 | Least squares | How do we fit noisy data? | Linear regression |
| Day 50 | Gradient descent | How do systems optimize? | Implement GD |
| Day 51 | Kalman filter | How do we estimate hidden states? | 1D tracking |
| Day 52 | LQR | How does optimal control work? | Control unstable system |
| Day 71 | Least squares | How do we fit noisy data? | Linear regression |
| Day 72 | Gradient descent | How do systems optimize? | Implement GD |
| Day 73 | Kalman filter | How do we estimate hidden states? | 1D tracking |
| Day 74 | LQR | How does optimal control work? | Control unstable system |
