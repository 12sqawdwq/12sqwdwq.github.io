# OS Module Study Document

## Module Goal

Build a closed learning loop for OS: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Processes, Threads, Virtual memory, Locks, Coroutines.

## Recommended Resource

[OSTEP book](https://pages.cs.wisc.edu/~remzi/OSTEP/)

## Foundational Source

[Dijkstra, 1965, Cooperating Sequential Processes](https://www.cs.utexas.edu/users/EWD/ewd01xx/EWD123.PDF)

## Core Formula / Model

Amdahl law: `S=1/((1-p)+p/N)`. Parallel speedup is limited by the serial fraction.

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
| Day 187 | Processes | Why isolate programs? | Fork processes |
| Day 188 | Threads | Why do we need concurrency? | Multithreaded counter |
| Day 189 | Virtual memory | Why does memory feel infinite? | Page-table visualization |
| Day 190 | Locks | Why does concurrency break? | Mutex demo |
| Day 191 | Coroutines | Why does async scale? | Async web server |
| Day 212 | Processes | Why isolate programs? | Fork processes |
| Day 213 | Threads | Why do we need concurrency? | Multithreaded counter |
| Day 214 | Virtual memory | Why does memory feel infinite? | Page-table visualization |
| Day 215 | Locks | Why does concurrency break? | Mutex demo |
| Day 216 | Coroutines | Why does async scale? | Async web server |
| Day 232 | Processes | Why isolate programs? | Fork processes |
| Day 233 | Threads | Why do we need concurrency? | Multithreaded counter |
| Day 234 | Virtual memory | Why does memory feel infinite? | Page-table visualization |
| Day 235 | Locks | Why does concurrency break? | Mutex demo |
| Day 236 | Coroutines | Why does async scale? | Async web server |
| Day 252 | Processes | Why isolate programs? | Fork processes |
| Day 253 | Threads | Why do we need concurrency? | Multithreaded counter |
| Day 254 | Virtual memory | Why does memory feel infinite? | Page-table visualization |
| Day 255 | Locks | Why does concurrency break? | Mutex demo |
| Day 256 | Coroutines | Why does async scale? | Async web server |
