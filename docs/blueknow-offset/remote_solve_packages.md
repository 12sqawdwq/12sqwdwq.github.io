# Remote Solve Packages

This folder contains Windows-to-Linux MAPDL solve packages.

Default SSH target:

- `5090`

Default remote root:

- `~/ziyuworkspace/blueknow_offset_remote`

The current configured package is:

- `09_fine_offset1p0_press0p6_0p2s`

Because this machine's non-interactive SSH key login currently fails for `ssh 5090`, run these scripts in PowerShell yourself so you can type the SSH password when prompted.

To make later automation non-interactive, install the local SSH key once:

```powershell
cd D:\PROJECT\blueknow\simulation\offset\REMOTE_SOLVE_PACKAGES
.\setup_ssh_key.ps1
```

This appends `~/.ssh/id_ed25519.pub` to the remote user's `~/.ssh/authorized_keys`.

## One-Time Environment Overrides

Optional PowerShell environment variables:

```powershell
$env:REMOTE_SSH = "5090"
$env:REMOTE_ROOT = "~/ziyuworkspace/blueknow_offset_remote"
$env:REMOTE_CONDA_ENV = "base"
$env:REMOTE_NP = "16"
$env:REMOTE_ANSYS_CMD = "/path/to/ansys252"
```

If `ansys252` is already on the remote `PATH`, you do not need `REMOTE_ANSYS_CMD`.

## Workflow

```powershell
cd D:\PROJECT\blueknow\simulation\offset\REMOTE_SOLVE_PACKAGES\09_fine_offset1p0_press0p6_0p2s
.\upload.ps1
.\start_remote_solve.ps1
.\monitor_remote.ps1
.\fetch_results.ps1
```

Fetched results are written to:

```text
D:\PROJECT\blueknow\simulation\offset\MECHANICAL_RESULTS_ARCHIVE\10_linux_fine_offset1p0_press0p6_0p2s
```

Open `file.rst` from that folder in Mechanical.
