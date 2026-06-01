# Frequency Module Study Document

## Module Goal

Build a closed learning loop for Frequency: concepts, formulas, engineering applications, and verifiable artifacts. This module covers: Fourier series, Fourier transform, Frequency spectrum, Frequency response, Filters, Resonance, Bandwidth, Sampling theorem, Aliasing, DFT, FFT, FIR filters.

## Recommended Resource

[MIT 6.003 lecture videos](https://www.ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/resources/lecture-videos/)

## Foundational Source

[Cooley and Tukey, 1965, FFT](https://doi.org/10.1090/S0025-5718-1965-0178586-1)

## Core Formula / Model

Fourier transform: `X(f)=integral x(t)e^(-j2*pi*f*t)dt`. The spectrum tells which frequencies build the signal.

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
| Day 8 | Fourier series | Why can periodic signals decompose? | Approximate square waves |
| Day 9 | Fourier transform | Why does frequency domain exist? | Plot pulse spectrum |
| Day 10 | Frequency spectrum | What do amplitude and phase mean? | Compare spectra |
| Day 11 | Frequency response | How do systems shape frequencies? | Plot RC response |
| Day 12 | Filters | Why is filtering multiplication in frequency? | Build low-pass filter |
| Day 13 | Resonance | Why do systems resonate? | Simulate RLC resonance |
| Day 14 | Bandwidth | Why does bandwidth limit information? | Measure -3dB point |
| Day 15 | Sampling theorem | Why can digital approximate analog? | Sample and reconstruct signals |
| Day 16 | Aliasing | Why does undersampling fail? | Simulate aliasing |
| Day 17 | DFT | How do computers compute spectra? | Implement DFT |
| Day 18 | FFT | Why is FFT fast? | Audio FFT analysis |
| Day 19 | FIR filters | How does digital filtering work? | Moving-average filter |
