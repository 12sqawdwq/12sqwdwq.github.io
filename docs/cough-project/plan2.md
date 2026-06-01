# COUGHKD Long-Horizon Coding Iteration Plan

> Purpose: guide Codex to work autonomously in the current repository for long-context, long-duration coding iterations.
> Source direction: COUGHKD research protocol - distill audio foundation-model teachers into compact cough screening students, with rigorous subject-disjoint evaluation, cross-dataset validation, calibration, ablations, and deployment metrics.

## 0. Operating Rules for Codex

You are an autonomous software-engineering agent working in this repository. Do not treat this as a one-shot coding request. Treat this file as the persistent task ledger and update it after every meaningful step.

Core loop:

1. Read this plan and inspect the current repository state.
2. Select the next unchecked task whose dependencies are satisfied.
3. Make the smallest coherent implementation change.
4. Run the most relevant verification command available.
5. Record results, failures, commands, and next actions in this file.
6. Continue to the next task without waiting for user input unless blocked by missing credentials, unavailable datasets, destructive operations, or irreversible changes.

Do not claim completion unless a task's verification criteria are satisfied. If a command fails, diagnose it, repair the cause, rerun it, and document the loop. If a task is too large, split it into smaller tasks inside this file.

Default permissions: you may read, create, and modify project files; create scripts and configs; run local tests, linting, formatting, build commands, and non-destructive data-inspection commands. Avoid deleting user data, downloading restricted datasets without explicit credentials, committing to remote repositories, or making medical/clinical claims.

## 1. Research Objective

Implement a reproducible COUGHKD experimental pipeline:

- Fine-tune high-capacity audio foundation-model teachers for cough/respiratory screening.
- Train compact student models using CE-only and multi-level KD objectives.
- Evaluate in-domain, cross-dataset, calibration, subgroup, and deployment efficiency metrics.
- Replace target tables with measured results generated under controlled protocols.

Primary success criteria:

- Distilled student retains at least 95% of teacher AUROC in-domain.
- Distilled student has smaller external AUROC drop than its CE-only counterpart.
- Student has at least 10x parameter reduction versus teacher.
- Student has at least 5x CPU latency reduction under identical preprocessing.

## 2. Repository Discovery Checklist

- [ ] Inspect repository tree and identify language/framework.
- [ ] Read README, existing docs, configs, and any prior progress files.
- [ ] Identify current training/evaluation entrypoints.
- [ ] Identify dataset paths, expected manifests, and environment variables.
- [ ] Identify existing model, preprocessing, metrics, and logging code.
- [ ] Create or update a concise `STATUS.md` if no status file exists.

Verification:

- Record repository structure summary here.
- Record available commands such as test, lint, train, eval, and benchmark.

Progress notes:

- Pending.

## 3. Environment and Reproducibility

- [ ] Add or verify dependency specification: `requirements.txt`, `environment.yml`, `pyproject.toml`, or equivalent.
- [ ] Add deterministic seed handling for Python, NumPy, PyTorch, CUDA, and dataloader workers.
- [ ] Add config-driven experiment control, preferably YAML or TOML.
- [ ] Add output directory convention: `runs/{experiment_name}/{timestamp_or_seed}/`.
- [ ] Add structured logging for metrics, configs, git hash if available, and command line.
- [ ] Add smoke-test mode using tiny synthetic or fixture data.

Verification:

- Environment installs or current dependency check passes.
- Smoke command runs without requiring private datasets.
- Config is saved with every run.

Progress notes:

- Pending.

## 4. Data Protocol and Leakage Control

Implement dataset handling before model optimization. The paper's main validity risk is dataset confounding and leakage, so this stage has priority over accuracy work.

Tasks:

- [ ] Implement a dataset manifest schema with at least: `recording_id`, `subject_id`, `dataset`, `path`, `label`, `split`, optional `age`, `sex`, `country`, `device`, `symptoms`, `quality_score`.
- [ ] Implement manifest validation: missing files, duplicate recordings, duplicate subject leakage across splits, label distribution, duration stats.
- [ ] Implement subject-disjoint splitting where subject IDs exist.
- [ ] If subject IDs are missing, mark dataset as pretraining-only or external aggregate evaluation only.
- [ ] Implement train/val/test split generation using training-domain validation only for hyperparameter selection.
- [ ] Add external-dataset evaluation guard: external test data must not be used for checkpoint selection.

Target datasets:

- Primary training/in-domain: Coswara and COUGHVID, subject-disjoint where possible.
- External/auxiliary: Cambridge COVID-19 Sounds, DiCOVA, Virufy, ICBHI 2017 depending on access/license.

Verification:

- `validate_manifest` command exits nonzero on leakage.
- Split report is written to disk with subject counts, class counts, and dataset counts.
- Unit test or smoke test verifies that one subject cannot appear in multiple splits.

Progress notes:

- Pending.

## 5. Audio Preprocessing Pipeline

Tasks:

- [ ] Convert all audio to mono 16 kHz waveform.
- [ ] Implement invalid-recording filters: duration, clipping, energy, unreadable files.
- [ ] Implement cough-confidence or candidate-segment interface; if detector is absent, provide a documented fallback segmenter.
- [ ] Implement long-audio segmentation with overlap and hysteresis merge if detector output exists.
- [ ] Implement log-mel spectrogram frontend with shared default settings for teacher and student.
- [ ] Add SpecAugment and waveform augmentation toggles.
- [ ] Cache preprocessed features only with config hash to avoid stale-feature leakage.

Verification:

- Preprocessing smoke test on short fixture audio.
- Shape and duration assertions for waveform, segments, and log-mel tensors.
- Preprocessing config recorded in run outputs.

Progress notes:

- Pending.

## 6. Teacher Models

Default teacher: BEATs-base. Independent teacher baselines: AST-base and PANNs CNN14. Optional additional teachers: PaSST and HTS-AT if already supported or easy to integrate.

Tasks:

- [ ] Implement teacher abstraction with common `forward`, `extract_features`, and optional `extract_attention` interface.
- [ ] Implement BEATs-base fine-tuning path.
- [ ] Implement AST-base baseline path.
- [ ] Implement PANNs CNN14 baseline path.
- [ ] Add class-balanced sampling or weighted loss.
- [ ] Add optional calibration regularizer.
- [ ] Select teacher checkpoints using validation AUROC and ECE, not accuracy alone.

Verification:

- Teacher forward pass works on smoke batch.
- Teacher training command can run one epoch in smoke mode.
- Validation metrics include AUROC, AUPRC, macro-F1, sensitivity, specificity, and ECE.
- Checkpoint metadata includes config, seed, validation metrics, and selected criterion.

Progress notes:

- Pending.

## 7. Student Models

Student families:

- MobileNetV3 spectrogram classifier.
- EfficientNet-B0/B2 spectrogram classifier.
- BC-ResNet tiny audio CNN.
- ECAPA-small temporal embedding model.

Tasks:

- [ ] Implement common student interface with logits, intermediate features, embeddings, and attention/saliency proxy where available.
- [ ] Implement CE-only training for each student.
- [ ] Add fixed-input model summary: parameters, FLOPs or MACs, exported model size.
- [ ] Ensure identical splits and preprocessing between CE-only and KD students.

Verification:

- Each student has a smoke forward test.
- CE-only smoke training runs.
- Parameter count is logged for each model.

Progress notes:

- Pending.

## 8. Multi-Level Knowledge Distillation

Implement the student objective:

`L = CE + response_KD + feature_KD + attention_KD + relation_KD`

Tasks:

- [ ] Response KD: temperature-scaled KL divergence from teacher logits to student logits.
- [ ] Feature KD: align teacher hidden representation to projected student feature representation.
- [ ] Attention KD: align normalized time-frequency attention or activation maps; provide fallback for models without native attention.
- [ ] Relation KD: preserve pairwise embedding similarity within batch.
- [ ] Configurable weights: alpha, beta, delta, eta, temperature.
- [ ] Add loss-component logging for every training step or epoch.
- [ ] Support teacher-logit caching to accelerate repeated student experiments, with cache invalidation by teacher checkpoint/config hash.

Verification:

- KD loss unit tests on synthetic tensors.
- Full KD smoke training runs without NaNs.
- Loss components are visible in logs.
- Teacher is in eval mode during KD unless explicitly fine-tuning jointly.

Progress notes:

- Pending.

## 9. Recording-Level Aggregation

Required aggregation ablation:

- mean pooling
- max pooling
- top-k pooling
- quality-weighted top-k pooling

Tasks:

- [ ] Implement segment-level inference.
- [ ] Implement quality score interface.
- [ ] Implement quality-weighted top-k pooling.
- [ ] Add fallback top-k by confidence when quality scores are unavailable, clearly marked in logs.
- [ ] Ensure recording-level labels and metrics are computed only after aggregation.

Verification:

- Unit test for aggregation math.
- Recording-level smoke inference produces one prediction per recording.
- Aggregation method is logged in metrics output.

Progress notes:

- Pending.

## 10. Metrics and Statistical Reporting

Classification metrics:

- AUROC as primary metric.
- AUPRC, macro-F1, sensitivity, specificity.
- Threshold-specific operating points.
- Expected calibration error.

Robustness and reporting:

- External AUROC drop = in-domain AUROC - external AUROC.
- Mean and 95% confidence interval over five subject-disjoint folds or five seeds.
- Paired bootstrap intervals for AUROC comparisons.
- McNemar or approximate randomization tests for thresholded F1 where feasible.

Tasks:

- [ ] Implement metric module with binary and multiclass handling.
- [ ] Implement calibration/ECE and optional reliability diagram output.
- [ ] Implement bootstrap CI for AUROC.
- [ ] Implement summary table writer: CSV/JSON/Markdown.
- [ ] Implement external drop report.

Verification:

- Metric unit tests on small deterministic arrays.
- Metrics match sklearn for AUROC/AUPRC/F1 on fixtures.
- Reports contain confidence intervals when multiple seeds/folds exist.

Progress notes:

- Pending.

## 11. Ablation Matrix

Required ablations:

- [ ] Teacher choice: PANNs vs AST vs BEATs.
- [ ] Student choice: MobileNetV3 vs EfficientNet vs BC-ResNet vs ECAPA-small.
- [ ] Distillation loss: CE only, response KD, feature KD, attention KD, relation KD, full COUGHKD.
- [ ] Data robustness: no augmentation, waveform augmentation, SpecAugment, combined augmentation.
- [ ] Aggregation: mean, max, top-k, quality-weighted top-k.
- [ ] Deployment: FP32, FP16, INT8 post-training quantization.

Implementation tasks:

- [ ] Add experiment-grid config generator.
- [ ] Add resume-safe runner that skips completed runs with valid metrics files.
- [ ] Add failure log for runs that crash.
- [ ] Add aggregate-results command.

Verification:

- Dry-run prints the full ablation matrix without launching jobs.
- Smoke grid runs at least two tiny experiments end-to-end.
- Completed runs are not repeated unless `--force` is passed.

Progress notes:

- Pending.

## 12. Deployment and Efficiency Evaluation

Efficiency targets to measure, not assume:

- Parameters.
- FLOPs/MACs.
- Exported model size.
- CPU latency under fixed hardware and fixed input duration.
- Optional mobile latency.
- FP32, FP16, INT8 export/benchmark.

Tasks:

- [ ] Implement export path: TorchScript, ONNX, TFLite, or project-appropriate format.
- [ ] Implement CPU latency benchmark with warmup, repeated trials, batch size 1, fixed input duration.
- [ ] Implement model-size measurement after export.
- [ ] Implement quantization path for FP16 and INT8 if framework supports it.
- [ ] Add benchmark report comparing teacher and students.

Verification:

- Benchmark command writes hardware/software metadata.
- Latency report includes mean, median, p95, warmup count, number of repeats.
- Exported model produces numerically plausible outputs on fixture input.

Progress notes:

- Pending.

## 13. Subgroup, Calibration, and Clinical-Caution Reporting

Tasks:

- [ ] Implement subgroup metrics for available metadata: age group, sex, geography, device, symptom group, dataset source.
- [ ] Add safeguards for small subgroup counts: suppress or mark unstable estimates below minimum N.
- [ ] Add calibration by subgroup where enough samples exist.
- [ ] Ensure generated reports describe the system as screening research, not diagnosis.

Verification:

- Subgroup report generated on synthetic metadata.
- Small subgroup warnings appear where appropriate.
- No generated report uses unsupported diagnostic claims.

Progress notes:

- Pending.

## 14. Paper Table Replacement Pipeline

The manuscript contains target tables that must be replaced by measured results before submission. Build a reproducible pipeline that emits paper-ready tables.

Required tables:

- Dataset roles and exact post-filter sample counts.
- Model comparison: classical, sequence, CNN, teacher, CE-only student, distilled student.
- Ablation results.
- Efficiency results.
- External validation and AUROC drop.
- Calibration and subgroup results.

Tasks:

- [ ] Add script to aggregate experiment outputs into table CSV/Markdown/LaTeX.
- [ ] Mark all target values as non-empirical until measured.
- [ ] Add validation that table rows are linked to completed run IDs.
- [ ] Add `RESULTS_AUDIT.md` listing run IDs, configs, seeds/folds, and data manifests.

Verification:

- Table generation fails if a required run is missing.
- Every reported metric traces to a run output and config.
- No target placeholder remains in measured-result tables.

Progress notes:

- Pending.

## 15. Classical and Sanity Baselines

Tasks:

- [ ] Implement MFCC + SVM.
- [ ] Implement MFCC + Random Forest.
- [ ] Implement log-mel BiLSTM.
- [ ] Implement ResNet18 spectrogram CNN if absent.
- [ ] Ensure baselines use same splits and evaluation scripts.

Verification:

- Classical baselines run on smoke manifest.
- Metrics emitted in same schema as neural models.

Progress notes:

- Pending.

## 16. Failure Modes to Actively Check

- [ ] Subject leakage across splits.
- [ ] External dataset accidentally used for tuning.
- [ ] Label encoding mismatch across datasets.
- [ ] Overclaiming accuracy without AUROC/AUPRC/calibration.
- [ ] Teacher shortcut transfer into student.
- [ ] Segment-level metrics incorrectly reported as recording-level metrics.
- [ ] Cached features produced with stale preprocessing config.
- [ ] Quantized model benchmarked with different frontend than FP32 model.
- [ ] Small subgroup estimates reported without uncertainty.

When any failure mode is detected:

1. Stop optimizing accuracy.
2. Fix protocol or reporting first.
3. Add regression test or validation check.
4. Record the incident in progress notes.

## 17. Suggested Execution Order

Phase A - Foundation and safety:

- Repository discovery.
- Environment and smoke mode.
- Manifest schema and leakage validation.
- Preprocessing pipeline.
- Metric module.

Phase B - First end-to-end baseline:

- One teacher smoke path.
- One student CE-only path.
- One KD path with response KD only.
- End-to-end train/eval on tiny fixture or subset.

Phase C - Full COUGHKD implementation:

- Feature, attention, relation KD.
- Recording-level aggregation.
- Logging and checkpointing.

Phase D - Experimental breadth:

- Add remaining teachers and students.
- Add ablation matrix.
- Add external evaluation.

Phase E - Deployment:

- Export and benchmark.
- Quantization.
- Efficiency table.

Phase F - Paper support:

- Aggregate tables.
- Audit file.
- Replace target values with measured values only.

## 18. Current Session Log

Use this section as an append-only log. Each entry should include date/time if available, task, files changed, commands run, outcome, and next action.

Template:

```text
Entry:
- Task:
- Files changed:
- Commands run:
- Result:
- Failure analysis, if any:
- Next action:
```

## 19. Stop Conditions

Codex may stop only when one of the following is true:

- A critical blocker requires user-provided dataset access, credentials, or policy decision.
- All tasks in this plan are complete and verification criteria pass.
- The current execution environment prevents required commands from running, and the limitation is documented.
- Continuing would require destructive operations or unsupported clinical claims.

Otherwise, continue the Plan -> Execute -> Verify -> Iterate -> Persist loop.
