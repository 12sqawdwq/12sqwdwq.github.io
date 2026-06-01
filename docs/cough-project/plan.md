# Autonomous Execution Plan

## Current State Summary

- Repository is initialized as a git repository.
- Project is currently a research/documentation repository, not yet an executable ML training codebase.
- Main artifacts:
  - `README.md`: high-level research framing for cough audio recognition and compression/distillation.
  - `reference/literature_and_open_source.md`: literature and open-source resource index.
  - `paper/`: LaTeX manuscript scaffold for `CoughKD: Distilling Audio Foundation Models into Compact Cough Screening Networks`.
  - `paper/notes/`: experimental protocol, research review log, and claim ledger.
- Verified previously:
  - `make -C paper` can compile `paper/main.pdf`.
- Known gaps:
  - No automated validation script exists.
  - LaTeX build warnings are not summarized by an explicit project check.
  - No experiment/training implementation exists yet; current completion target is a verifiable paper/protocol build, not ML results.
  - All target result numbers are correctly marked as non-empirical planning values.

## Task Breakdown

### 1. Repository Inventory

Status: Completed

Steps:
- Scan directory structure.
- Read `README.md`, `paper/README.md`, `.gitignore`, and `paper/notes/*`.
- Confirm project type and current verification path.

Completion criteria:
- Current state summary is written into this file.

### 2. Add Project Validation Script

Status: Completed

Steps:
- Add a script that checks required files exist.
- Compile the paper through `make -C paper`.
- Inspect the LaTeX log for unresolved references/citations and hard errors.
- Verify target-result language remains present around planned numerical claims.

Completion criteria:
- A validation command exists and can be run locally.
- The command exits non-zero on missing files or unresolved LaTeX references.

Result:
- Added `scripts/validate_project.sh`.

### 3. Run Validation and Fix Failures

Status: Completed

Steps:
- Run the validation script.
- If it fails, inspect the reason and patch the project.
- Repeat until validation passes.

Completion criteria:
- Validation exits successfully.
- Any remaining warnings are documented as non-blocking.

Result:
- Initial validation exposed a reference-counting bug in the script.
- Fixed the counting logic.
- `scripts/validate_project.sh` now passes.

### 4. Update Documentation With Validation Instructions

Status: Completed

Steps:
- Add root-level instructions for validating the project.
- Ensure `paper/README.md` and root `README.md` point to the same verification flow.

Completion criteria:
- A new contributor can run one documented command to verify the current repository.

Result:
- Added validation instructions to `README.md` and `paper/README.md`.

### 5. Final Plan Review

Status: Completed

Steps:
- Update this file with completed statuses.
- Record the final validation command and result.

Completion criteria:
- All tasks in this plan are marked Completed.
- The repository has a passing, reproducible validation path.

Result:
- Final validation command: `scripts/validate_project.sh`
- Final validation status: Passed
- Validation output summary:
  - Paper references: 22
  - Project references/resources: 88
  - Generated artifact: `paper/main.pdf`

## Final Status

All tasks in this plan are completed. The repository is currently verifiable through `scripts/validate_project.sh`.
