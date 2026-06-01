---
name: ansys-mechanical-mvp
description: Reliably drive Ansys Mechanical minimum viable simulations from Codex. Use when Codex must create, review, or recover a Discovery/SpaceClaim to Workbench Mechanical static structural workflow, verify evaluated contours, distinguish setup objects from solved results, or produce delivery evidence for .wbpj Mechanical MVP simulations.
---

# Ansys Mechanical MVP Skill

When driving Ansys Mechanical, the final goal is not object creation.

The final goal is evaluated visual evidence:

```text
contour visible, legend visible, non-empty Min/Max values, and saved Workbench project
```

Treat Discovery or SpaceClaim as geometry authoring. Treat Workbench Mechanical as the real solver and postprocessing acceptance surface.

## Non-Negotiable Rule

Do not report `done` just because a model, result object, screenshot, `.dsco`, `.wbpj`, `.avz`, or `ds.dat` exists.

Report `done` only after Mechanical shows evaluated result evidence or after you explicitly state which acceptance signal is still missing.

## Required Path

Follow this sequence for every Mechanical MVP delivery:

1. Create geometry.
2. Save Workbench project.
3. Enter Mechanical.
4. Assign material.
5. Generate mesh.
6. Apply fixed support and force.
7. Solve.
8. Evaluate result.
9. Verify contour, legend, and Min/Max.
10. Export evidence and save project.

Read `mechanical_mvp_protocol.md` when executing or reviewing a workflow. Each step has Goal, Required action, Do not do, Success signal, and Failure recovery.

## Verification Gate

Run the delivery checker when a `.wbpj` is produced:

```powershell
python .\ansys-mechanical-mvp\scripts\check_mechanical_delivery.py <project.wbpj> --exports <exports-dir>
```

Use the checker as a Codex workflow gate only:

- PASS means the delivery envelope exists.
- WARN means filesystem evidence is incomplete or cannot prove GUI state.
- FAIL means the Mechanical handoff is not complete.

The checker does not prove physics correctness and cannot confirm GUI contour state from files alone.

## Failure Recovery

If Mechanical has a result object but no contour or Min/Max:

```text
Do not recreate the model.
Select the result object.
Click Solve if the solution is not solved.
Click Evaluate All Results.
Confirm contour, legend, and populated Minimum/Maximum values.
Save the Workbench project.
```

Read `failure_taxonomy.md` to identify the failure and `recovery_prompts.md` for exact recovery prompts.

## Reporting Language

Use these states precisely:

- `Geometry ready`: geometry exists.
- `Project ready`: `.wbpj` and `_files` exist.
- `Setup ready`: Mechanical objects exist.
- `Solver input generated`: `ds.dat` or equivalent solver input exists.
- `Solved/evaluated`: contour, legend, and non-empty Min/Max are visible.

Never collapse these states into one `done`.
