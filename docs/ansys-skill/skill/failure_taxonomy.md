# Codex Failure Taxonomy For Mechanical MVP

Use this taxonomy to avoid false completion when Codex drives Ansys Mechanical.

## F1: Object Exists But Result Is Not Evaluated

Symptom: Total Deformation, Equivalent Stress, or another result exists in the tree, but the body is gray or Min/Max values are blank/red.

Meaning: setup exists, evaluated result does not.

Detection: Mechanical viewport lacks contour or Details has empty result ranges.

Recovery: do not recreate the model. Solve and Evaluate All Results, then inspect contour, legend, and Min/Max.

## F2: Project Saved But `_files` Folder Is Incomplete

Symptom: `.wbpj` exists but Workbench opens with missing-file warnings or no Mechanical database.

Meaning: project container was saved without its full data directory.

Detection: missing `project_files/` or missing `.mechdb` below that directory.

Recovery: reopen the original project location, save again, and deliver `.wbpj` with its matching `_files` folder.

## F3: Mechanical Tree Has Result Object But No Contour

Symptom: result object can be selected, but viewport remains plain gray or no legend appears.

Meaning: result object is inserted but not displayable as evaluated postprocessing data.

Detection: no contour legend and no Min/Max markers.

Recovery: select Solution, run Solve if needed, run Evaluate All Results, then select the result again.

## F4: Solver Input Exists But No Solved State

Symptom: `ds.dat` exists, maybe even contains `solve`, but Mechanical still shows unresolved/update-required result status.

Meaning: solver input generation and solved/evaluated GUI state are different gates.

Detection: `ds.dat` exists but Mechanical has no contour or Solution Information has no completed solve.

Recovery: use Mechanical Solution Information to confirm the solve, fix errors, solve again, and evaluate results.

## F5: Codex Stops After Geometry Creation

Symptom: `.dsco`, `.scdocx`, or geometry screenshots exist, but no `.wbpj` Mechanical deliverable exists.

Meaning: the workflow ended before the solver stage.

Detection: no Workbench project and no Mechanical tree.

Recovery: create a Workbench Static Structural system, attach geometry, open Model in Mechanical, and continue the protocol from material assignment.

## F6: GUI State And Filesystem State Disagree

Symptom: files suggest a project exists, but GUI shows unsolved, unevaluated, or missing results.

Meaning: filesystem evidence is necessary but not sufficient.

Detection: checker passes file gates but Mechanical viewport lacks accepted result evidence.

Recovery: trust Mechanical acceptance state over filesystem heuristics. Solve/evaluate/save again, then rerun the checker.

## F7: Exported Evidence Exists But Is Not Trustworthy

Symptom: `.avz` or screenshots exist, but they are small, stale, gray, or do not show result values.

Meaning: export happened before or outside the accepted evaluated state.

Detection: suspiciously small exports, missing legend, or mismatch between export timestamp and latest solve.

Recovery: select evaluated result in Mechanical, verify contour and Min/Max, export evidence again, and save the project.
