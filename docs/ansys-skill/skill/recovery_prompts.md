# Recovery Prompts

Use these prompts verbatim or adapt them minimally when recovering a Mechanical MVP workflow.

## Result Exists But Min/Max Is Empty

```text
Do not recreate the model.
Select the existing result object.
If Solution is not solved, click Solve.
Then click Evaluate All Results.
Confirm that the selected result shows a colored contour, a legend, and populated Minimum/Maximum values.
Save the Workbench project after the evaluated result is visible.
```

## Workbench Project Exists But `_files` Is Missing

```text
Do not treat the .wbpj alone as deliverable.
Open the project from its original Workbench location.
Save the project again.
Confirm that the matching project_files directory exists beside the .wbpj.
Deliver or validate the .wbpj and project_files directory together.
```

## Mechanical Database Is Missing

```text
The Mechanical handoff is incomplete.
Open the Workbench project.
Open the Model cell in Mechanical.
Save the project after Mechanical opens successfully.
Rerun the delivery checker and require a Mechanical database before calling the delivery ready.
```

## Solver Input Exists But No Contour Appears

```text
Do not assume ds.dat proves a solved result.
Open Mechanical Solution Information and confirm the solve completed.
If the solve failed, fix the reported setup issue.
If the solve completed, select Solution and run Evaluate All Results.
Then select each result object and verify contour, legend, and Min/Max.
```

## Codex Stopped After Geometry

```text
Report the current state as Geometry ready only.
Create a Workbench Static Structural system.
Attach the geometry to the Geometry cell.
Open Model in Mechanical.
Continue with material assignment, mesh generation, boundary conditions, load, solve, evaluate, and save.
```

## GUI And Filesystem Disagree

```text
Treat Mechanical GUI acceptance as the higher-priority signal.
If the checker passes but Mechanical has no contour or Min/Max, report the delivery as not evaluated.
Solve and Evaluate All Results in Mechanical.
Save the project and rerun the checker.
```

## Export Evidence Is Suspicious

```text
Do not accept stale or tiny exports as solved evidence.
Open Mechanical.
Select the evaluated result object.
Verify colored contour, legend, and non-empty Minimum/Maximum values.
Export evidence again from that visible state.
Rerun the delivery checker with the export directory.
```
