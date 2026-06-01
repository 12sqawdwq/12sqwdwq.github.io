# Distributed Module Study Document

## Module Goal

Build a closed learning loop for Distributed: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Consensus, Kafka, Kubernetes.

## Recommended Resource

[Raft visualization](https://raft.github.io/) / [Kubernetes docs](https://kubernetes.io/docs/concepts/)

## Foundational Source

[Lamport, 1978, Time, Clocks, and the Ordering of Events](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)

## Core Formula / Model

Majority quorum: `quorum=floor(N/2)+1`. Overlapping majorities prevent split state.

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
| Day 196 | Consensus | How do machines agree? | Raft visualization |
| Day 197 | Kafka | Why are logs foundational? | Message queue demo |
| Day 198 | Kubernetes | Why orchestrate containers? | Deploy local cluster |
| Day 221 | Consensus | How do machines agree? | Raft visualization |
| Day 222 | Kafka | Why are logs foundational? | Message queue demo |
| Day 223 | Kubernetes | Why orchestrate containers? | Deploy local cluster |
| Day 241 | Consensus | How do machines agree? | Raft visualization |
| Day 242 | Kafka | Why are logs foundational? | Message queue demo |
| Day 243 | Kubernetes | Why orchestrate containers? | Deploy local cluster |
| Day 261 | Consensus | How do machines agree? | Raft visualization |
| Day 262 | Kafka | Why are logs foundational? | Message queue demo |
| Day 263 | Kubernetes | Why orchestrate containers? | Deploy local cluster |
