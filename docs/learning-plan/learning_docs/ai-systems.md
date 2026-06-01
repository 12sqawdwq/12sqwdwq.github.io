# AI Systems Module Study Document

## Module Goal

Build a closed learning loop for AI Systems: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Neural networks, Backpropagation, Transformers, Embeddings, Vector DB, LLM inference, AI system co-design.

## Recommended Resource

[Deep Learning book](https://www.deeplearningbook.org/) / [PyTorch tutorials](https://pytorch.org/tutorials/)

## Foundational Source

[Rumelhart, Hinton, and Williams, 1986, Backpropagation](https://doi.org/10.1038/323533a0)

## Core Formula / Model

Backpropagation: `dL/dw=(dL/dy)(dy/dw)`. The chain rule assigns error responsibility efficiently.

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
| Day 199 | Neural networks | Why can networks approximate functions? | Train MLP |
| Day 200 | Backpropagation | Why can networks learn? | Manual gradients |
| Day 201 | Transformers | Why did attention dominate? | Tiny transformer |
| Day 202 | Embeddings | Why can meaning become vectors? | Embedding similarity |
| Day 203 | Vector DB | Why is semantic search possible? | Vector search demo |
| Day 204 | LLM inference | Why is inference expensive? | Token throughput profiling |
| Day 205 | AI system co-design | Why must hardware/software co-evolve? | Profile model on GPU |
| Day 224 | Neural networks | Why can networks approximate functions? | Train MLP |
| Day 225 | Backpropagation | Why can networks learn? | Manual gradients |
| Day 244 | Neural networks | Why can networks approximate functions? | Train MLP |
| Day 245 | Backpropagation | Why can networks learn? | Manual gradients |
| Day 264 | Neural networks | Why can networks approximate functions? | Train MLP |
| Day 265 | Backpropagation | Why can networks learn? | Manual gradients |
