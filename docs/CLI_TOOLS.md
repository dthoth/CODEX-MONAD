# 📜 CLI Tools & Scripts Reference

**Last Updated:** 2026-01-20

## Overview

CODEX-MONAD includes a comprehensive suite of command-line tools and scripts for automation, maintenance, and advanced operations.

---

## Quick Start Scripts

### Windows

#### Start CODEX-MONAD
```batch
scripts\START_WINDOWS.bat
```
Launches CODEX-MONAD with GPU acceleration (if available).

#### Start Without GPU
```batch
scripts\START_WINDOWS_NOGPU.bat
```
Launches CODEX-MONAD without GPU acceleration (for compatibility).

---

### macOS / Linux

#### Start CODEX-MONAD
```bash
./scripts/START_MAC_LINUX.sh
```
Launches CODEX-MONAD with GPU acceleration.

#### Start Without GPU
```bash
./scripts/START_MAC_LINUX_NOGPU.sh
```
Launches CODEX-MONAD without GPU acceleration.

---

## Core System Scripts

### System Health & Diagnostics

#### doctor.js
**Location:** `scripts/doctor.js`  
**Purpose:** System health check and diagnostics

```bash
node scripts/doctor.js
```

Checks:
- Node.js and npm versions
- Electron installation
- Required dependencies
- File permissions
- Registry integrity

---

#### smoke.js
**Location:** `scripts/smoke.js`  
**Purpose:** Quick smoke test of core functionality

```bash
node scripts/smoke.js
```

Tests:
- Registry loading
- App launching
- IPC communication
- Basic UI rendering

---

## CODEX_V3 Pipeline Scripts

### Full Pipeline Execution

#### RUN_ALL.ps1
**Location:** `apps/codex_monad/Tools/RUN_ALL.ps1`  
**Platform:** Windows (PowerShell)  
**Purpose:** Complete CODEX V3 pipeline execution

```powershell
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\RUN_ALL.ps1
```

**Workflow:**
1. Install core skeleton structure
2. Start AI webhook stub (if Python available)
3. Run PRE-RUN stage (clustering & enrichment)
4. Run BUILD stage (file organization)
5. Restore DryRun mode for safety

---

#### RUN_ALL_DRY.ps1
**Location:** `apps/codex_monad/Tools/RUN_ALL_DRY.ps1`  
**Platform:** Windows (PowerShell)  
**Purpose:** Dry run of entire pipeline (no file operations)

```powershell
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\RUN_ALL_DRY.ps1
```

Safe for testing configuration changes.

---

### Stage-Specific Scripts

#### pre_run.ps1
**Location:** `apps/codex_monad/Tools/CODEX_V3_Integrated/CODEX_V3_Integrated/scripts/pre-run/pre_run.ps1`  
**Purpose:** Stage 1 - Analysis and clustering

```powershell
cd apps\codex_monad\Tools\CODEX_V3_Integrated\CODEX_V3_Integrated
powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1
```

**Output:**
- `metadata/proposed_layout.json` - Clustering results
- Similarity analysis
- AI enrichment (if enabled)

---

#### run-codex.ps1
**Location:** `apps/codex_monad/Tools/CODEX_V3_Integrated/CODEX_V3_Integrated/scripts/run-codex.ps1`  
**Purpose:** Stage 2 - Build and deploy

```powershell
cd apps\codex_monad\Tools\CODEX_V3_Integrated\CODEX_V3_Integrated
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1
```

**Output:**
- `metadata/codex.manifest.json` - Complete manifest
- `metadata/INDEX.md` - Human-readable index
- `core-kernel/codex.modules.json` - Module manifest
- Organized file collection
- Timestamped backup ZIP

---

### Core Installation

#### install-core.ps1
**Location:** `apps/codex_monad/Tools/Core_Install/CODEX_Core_Install/scripts/install-core.ps1`  
**Purpose:** Install CODEX core skeleton

```powershell
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\Core_Install\CODEX_Core_Install\scripts\install-core.ps1
```

**Parameters:**
- `-Root "E:\CODEX_V3"` - Installation root (default: E:\CODEX_V3)
- `-CreateVenv` - Create Python virtual environment (default: true)
- `-Py "python"` - Python executable (default: py)

**Creates:**
- Directory skeleton
- Python venv (optional)
- Scheduled backup task (Windows)

---

#### backup-now.ps1
**Location:** `apps/codex_monad/Tools/Core_Install/CODEX_Core_Install/scripts/backup-now.ps1`  
**Purpose:** Create immediate backup

```powershell
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\Core_Install\CODEX_Core_Install\scripts\backup-now.ps1
```

Creates timestamped ZIP backup of CODEX collection.

---

## Application-Specific Scripts

### CODEX Capture

#### capture.py
**Location:** `apps/codex_capture/capture.py`  
**Platform:** Windows  
**Purpose:** Monitor keystrokes, clipboard, and window context

```bash
python apps\codex_capture\capture.py
```

**Features:**
- Keystroke logging
- Clipboard monitoring
- Active window tracking
- JSON output format

---

#### capture_mac.py
**Location:** `apps/codex_capture/capture_mac.py`  
**Platform:** macOS  
**Purpose:** macOS version of CODEX Capture

```bash
python apps/codex_capture/capture_mac.py
```

Uses macOS-specific APIs for system monitoring.

---

### CODEX Vault

#### vault-keyring-v3.sh
**Location:** `apps/vault/vault-keyring-v3.sh`  
**Platform:** Unix/Linux/macOS  
**Purpose:** Symmetric encryption with physical key support

```bash
bash apps/vault/vault-keyring-v3.sh [command] [options]
```

**Commands:**
- `init` - Initialize vault
- `add` - Add secret
- `get` - Retrieve secret
- `list` - List secrets
- `seal` - Lock vault
- `unseal` - Unlock vault

---

#### vault-envelopes.sh
**Location:** `apps/vault/vault-envelopes.sh`  
**Platform:** Unix/Linux/macOS  
**Purpose:** Envelope-based secret management

```bash
bash apps/vault/vault-envelopes.sh [command]
```

Advanced key management with envelope encryption.

---

### CODEX-ARK

#### ark-decode.sh
**Location:** `apps/codex-ark/ark-decode.sh`  
**Platform:** Unix/Linux/macOS  
**Purpose:** Decode ARK visual fingerprints

```bash
bash apps/codex-ark/ark-decode.sh [fingerprint_file]
```

Verifies document integrity using visual cryptographic fingerprints.

---

## Utility Scripts

### Registry Management

#### generate-codex-manifest.py
**Location:** `generate-codex-manifest.py` (root)  
**Purpose:** Generate and validate app registry

```bash
python generate-codex-manifest.py
```

**Features:**
- Validates codex-apps.json syntax
- Checks for duplicate IDs
- Verifies app paths exist
- Generates documentation

---

#### hub-scanner.py
**Location:** `hub-scanner.py` (root)  
**Purpose:** Scan and inventory hub applications

```bash
python hub-scanner.py
```

**Output:**
- `hub-inventory.json` - Complete app inventory
- Statistics and metrics
- Broken link detection

---

## Bootstrap Scripts

### Windows Bootstrap

#### install.ps1
**Location:** `bootstrap/windows/install.ps1`  
**Purpose:** Windows environment setup

```powershell
powershell -ExecutionPolicy Bypass -File bootstrap\windows\install.ps1
```

**Installs:**
- Node.js dependencies
- Python requirements
- PowerShell modules
- System integrations

---

#### profile.ps1
**Location:** `bootstrap/windows/profile.ps1`  
**Purpose:** PowerShell profile customization

Add to PowerShell profile for CODEX-specific functions and aliases.

---

### macOS Bootstrap

#### install.sh
**Location:** `bootstrap/macos/install.sh`  
**Purpose:** macOS environment setup

```bash
bash bootstrap/macos/install.sh
```

**Configures:**
- Homebrew dependencies
- Python environment
- Fish shell functions
- System permissions

---

#### bashrc_additions.sh
**Location:** `bootstrap/macos/bash/bashrc_additions.sh`  
**Purpose:** Bash profile additions

```bash
source bootstrap/macos/bash/bashrc_additions.sh
```

Adds CODEX-specific commands to bash environment.

---

### Linux Bootstrap

#### install.sh
**Location:** `bootstrap/linux/install.sh`  
**Purpose:** Linux environment setup

```bash
bash bootstrap/linux/install.sh
```

**Sets up:**
- System dependencies
- Python packages
- Shell integrations

---

## PowerShell Modules

### codex-tools.psm1
**Location:** `apps/codex_monad/Tools/CODEX_V3_Integrated/CODEX_V3_Integrated/scripts/codex-tools.psm1`

**Functions:**
- `Get-CodexCandidates` - File scanning
- `New-CodexManifest` - Manifest generation
- `Copy-CodexFiles` - File operations
- `New-CodexIndexMarkdown` - INDEX.md creation
- `New-CodexBackupZip` - Backup creation

**Import:**
```powershell
Import-Module .\scripts\codex-tools.psm1
```

---

### codex-router.psm1
**Location:** `apps/codex_monad/Tools/CODEX_V3_Integrated/CODEX_V3_Integrated/scripts/codex-router.psm1`

**Functions:**
- `Get-RouteForFile` - Determine file destination
- `Apply-ThemeRouting` - Theme-based routing
- `Apply-FractalPath` - Hierarchical routing
- `Detect-DINCode` - Pattern detection

---

### codex-meta.psm1
**Location:** `apps/codex_monad/Tools/CODEX_V3_Integrated/CODEX_V3_Integrated/scripts/codex-meta.psm1`

**Functions:**
- `Get-FileMetadata` - Extract metadata
- `Enrich-WithAI` - AI enrichment
- `Validate-Metadata` - Schema validation

---

## Advanced Tools

### Symbolic Drift Logger

#### symbolic_drift_logger.py
**Location:** `apps/codex_monad/Tools/symbolic_drift_logger.py`

```bash
python apps\codex_monad\Tools\symbolic_drift_logger.py
```

Tracks symbolic and semantic drift in documentation over time.

---

### Archive Worker

#### archive_worker.py
**Location:** `apps/codex_monad/Tools/archive_worker.py`

```bash
python apps\codex_monad\Tools\archive_worker.py
```

Automated archive processing and organization.

---

## Common Workflows

### Complete Setup (New Machine)

**Windows:**
```powershell
# 1. Bootstrap environment
powershell -ExecutionPolicy Bypass -File bootstrap\windows\install.ps1

# 2. Install dependencies
npm install

# 3. Install CODEX core
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\Core_Install\CODEX_Core_Install\scripts\install-core.ps1

# 4. Run system check
node scripts\doctor.js

# 5. Start CODEX
npm start
```

**macOS/Linux:**
```bash
# 1. Bootstrap environment
bash bootstrap/macos/install.sh  # or bootstrap/linux/install.sh

# 2. Install dependencies
npm install

# 3. Run system check
node scripts/doctor.js

# 4. Start CODEX
npm start
```

---

### Daily Maintenance

```powershell
# 1. Run health check
node scripts\doctor.js

# 2. Update registry
python hub-scanner.py

# 3. Backup collection
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\Core_Install\CODEX_Core_Install\scripts\backup-now.ps1
```

---

### Process New Files

```powershell
# 1. Configure sources in codex-config.json

# 2. Run dry-run first
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\RUN_ALL_DRY.ps1

# 3. Review proposed_layout.json

# 4. Execute for real
powershell -ExecutionPolicy Bypass -File apps\codex_monad\Tools\RUN_ALL.ps1
```

---

## Environment Variables

### CODEX-Specific

- `CODEX_ROOT` - Root directory (optional)
- `CODEX_CONFIG` - Config file path (optional)
- `CODEX_LOG_LEVEL` - Logging verbosity (optional)

---

## Troubleshooting

### Script Execution Errors

**Issue:** PowerShell execution policy  
**Solution:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**Issue:** Python not found  
**Solution:** Install Python 3.7+ and add to PATH

**Issue:** Permission denied (Unix)  
**Solution:**
```bash
chmod +x script_name.sh
```

---

## Related Documentation

- [CODEX_V3 Pipeline](CODEX_V3_PIPELINE.md)
- [Infrastructure](INFRASTRUCTURE.md)
- [Apps Catalog](APPS_CATALOG.md)

---

*CLI documentation generated by CODEX Documentation Mission*
