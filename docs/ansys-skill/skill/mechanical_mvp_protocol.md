# Mechanical MVP Protocol

Use this as a strict operating checklist when Codex drives Ansys Workbench Mechanical.

## Step 1: Create Geometry

Goal: create the physical body to solve.

Required action: create or import geometry in Discovery or SpaceClaim using simple, inspectable dimensions.

Do not do: claim a simulation result from geometry color, viewport deformation, or a `.dsco` file.

Success signal: geometry opens and the body dimensions are visible or otherwise inspectable.

Failure recovery: if only a visual file exists, export or attach the geometry to Workbench before any solver claim.

## Step 2: Save Workbench Project

Goal: create a persistent Workbench container for Mechanical.

Required action: save a `.wbpj` and keep its matching `_files` folder beside it.

Do not do: move or send the `.wbpj` without `_files`.

Success signal: both `project.wbpj` and `project_files/` exist.

Failure recovery: reopen Workbench, save the project again, and verify the `_files` folder appears.

## Step 3: Enter Mechanical

Goal: move from project container to solver setup.

Required action: open the `Model` cell of a `Static Structural` system.

Do not do: stop at Workbench schematic or geometry editor if the task asks for Mechanical results.

Success signal: Mechanical Outline shows Model, Geometry, Mesh, Static Structural, and Solution branches.

Failure recovery: if Mechanical did not open, reattach geometry to the Static Structural system and open `Model`.

## Step 4: Assign Material

Goal: define solver material properties.

Required action: assign material with Young's modulus and Poisson ratio to the body.

Do not do: rely on unnamed defaults when the benchmark specifies material constants.

Success signal: material assignment is visible in Mechanical and solver input contains material data such as `MP,EX`.

Failure recovery: add or edit Engineering Data, update the model, and confirm the material is assigned to all bodies.

## Step 5: Generate Mesh

Goal: create finite elements for the body.

Required action: apply mesh controls if needed and run `Generate Mesh`.

Do not do: treat a mesh object in the tree as a generated mesh.

Success signal: mesh is visible and Mechanical reports nodes/elements or solver input contains element counts.

Failure recovery: regenerate mesh after geometry, material, or sizing changes.

## Step 6: Apply Fixed Support And Force

Goal: define boundary condition and load for a solvable structural model.

Required action: apply fixed support to the intended fixed face and force to the intended load face or remote point.

Do not do: leave the model underconstrained or apply load to an unintended edge/body selection.

Success signal: Mechanical tree contains support/load objects and solver input contains constraint and force commands.

Failure recovery: review scoping by face/body selection, then regenerate solver input or solve again.

## Step 7: Solve

Goal: run the backend solver.

Required action: click `Solve` on Solution or run the equivalent Mechanical solve command.

Do not do: stop after generating `ds.dat` if Mechanical has not completed solve.

Success signal: Mechanical Solution branch has a solved state and solver logs show a completed solve.

Failure recovery: open Solution Information, read the solver error, fix mesh/material/BC/load, and solve again.

## Step 8: Evaluate Result

Goal: populate result objects with numerical data.

Required action: insert expected result objects and run `Evaluate All Results`.

Do not do: assume inserted result objects are already evaluated.

Success signal: selected results show numeric Minimum and Maximum values.

Failure recovery: select Solution, run `Evaluate All Results`, and wait for result status icons to clear.

## Step 9: Verify Contour, Legend, And Min/Max

Goal: prove that the result is viewable and evaluated in Mechanical.

Required action: select each required result and inspect the viewport and Details panel.

Do not do: accept a gray body, blank red result rows, or missing legend.

Success signal: colored contour, legend, Min/Max markers, and non-empty Minimum/Maximum values are visible.

Failure recovery: solve and evaluate again. If still blank, check result scoping, unit system, suppressed objects, and failed solver state.

## Step 10: Export Evidence And Save Project

Goal: preserve a repeatable delivery state.

Required action: save the `.wbpj`, preserve `_files`, and export screenshots or result views as evidence.

Do not do: export evidence before solving/evaluating unless it is clearly labeled as a failure state.

Success signal: saved project reopens and evidence matches the evaluated Mechanical viewport.

Failure recovery: reopen the project, select result objects, verify contours again, re-export evidence, and rerun the delivery checker.
