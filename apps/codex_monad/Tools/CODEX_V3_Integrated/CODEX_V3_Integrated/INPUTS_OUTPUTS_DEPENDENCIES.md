# 📊 CODEX_V3_Integrated - Complete Inputs, Outputs, and Dependencies

**Generated:** 2026-01-20 20:43:23

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Configuration Inputs](#configuration-inputs)
3. [Script Dependencies](#script-dependencies)
4. [Data Flow](#data-flow)
5. [File Inputs/Outputs by Script](#file-inputsoutputs-by-script)
6. [Module Dependencies](#module-dependencies)
7. [External Dependencies](#external-dependencies)
8. [Complete Dependency Graph](#complete-dependency-graph)

---

## System Overview

### High-Level I/O Flow

```
INPUTS                          PROCESS                         OUTPUTS
──────────────────────────────────────────────────────────────────────────

📁 Source Directories     →     Stage 1: PRE-RUN        →     📄 Signatures
📄 codex-config.json      →     ├─ Scan Sources        →     📄 Clusters
                                ├─ Build Signatures     →     📄 Proposed Layout
                                ├─ Cluster Files        →     📄 AI Enrichment
                                └─ AI Enrich (optional) →
                                        ↓
                                Stage 2: BUILD          →     📄 Manifest
                                ├─ Apply Routing        →     📄 INDEX.md
                                ├─ Copy Files          →     📁 Organized Files
                                ├─ Generate Indexes     →     📄 Module Manifest
                                └─ Create Backup        →     📦 Backup ZIP
```

---

## Configuration Inputs

### Primary Configuration File

**File:** `codex-config.json`  
**Size:** 8,173 bytes  
**Format:** JSON  
**Required:** Yes

#### Configuration Sections

```json
{
  "DryRun": boolean,
  "OutputRoot": string,
  "LogPath": string,
  "Sources": [
    {
      "id": string,
      "paths": [string],
      "extensions": [string]
    }
  ],
  "Enrichment": {
    "FileInfo": {},
    "Theme": {
      "Enable": boolean,
      "Patterns": object
    },
    "Snippet": {},
    "AI": {
      "Enable": boolean,
      "Mode": string,
      "Endpoint": string,
      "AuthHeader": string,
      "BatchSize": number,
      "Fields": [string]
    }
  },
  "PreRun": {
    "Enable": boolean,
    "MaxFiles": number,
    "MaxTextBytes": number,
    "Similarity": {
      "ShingleSize": number,
      "MinOverlapJaccard": number,
      "SimHashHamming": number
    },
    "Clustering": {
      "Enable": boolean,
      "MinClusterSize": number,
      "Linkage": string,
      "SimilarityMetric": string
    },
    "ProposedLayout": {
      "Enable": boolean,
      "ApplyAutoLayout": boolean,
      "BucketRules": string
    }
  },
  "Stages": {},
  "Routing": {
    "Enable": boolean,
    "Precedence": [string],
    "FractalPath": {},
    "DIN": {},
    "ThemeBuckets": object,
    "ProjectFallback": string,
    "LanguageFallback": string
  },
  "Migration": {
    "Enable": boolean,
    "Adapters": [object]
  }
}
```

#### Configuration Dependencies

| Component | Uses Config Section | Purpose |
|-----------|---------------------|---------|
| pre_run.ps1 | Sources, PreRun, Meta.AI | File scanning, clustering params |
| run-codex.ps1 | All sections | Complete pipeline execution |
| build_signatures.py | PreRun.Similarity, OutputRoot | Shingle size, output location |
| cluster_and_layout.py | PreRun.Clustering, Routing | Cluster params, bucket rules |
| ai_enrich.ps1 | Meta.AI | Endpoint, auth, batch size |

---

## Script Dependencies

### Dependency Matrix

| Script | Requires | Optional | Produces |
|--------|----------|----------|----------|
| **run-codex.ps1** | codex-config.json, codex-tools.psm1 | proposed_layout.json | manifest, INDEX.md, backup |
| **pre_run.ps1** | codex-config.json, codex-tools.psm1, codex-meta.psm1, Python 3.7+ | - | catalog, signatures, clusters, layout |
| **ai_enrich.ps1** | codex-config.json, catalog.jsonl | AI endpoint | ai_enrich_*.json |
| **build_signatures.py** | codex-config.json, catalog.jsonl | - | signatures.jsonl |
| **cluster_and_layout.py** | codex-config.json, signatures.jsonl, catalog.jsonl | - | clusters.json, proposed_layout.json |
| **ai_webhook_stub.py** | - | - | HTTP responses |
| **codex-tools.psm1** | - | - | Functions (exported) |
| **codex-router.psm1** | codex-tools.psm1 | AI enrichment files | Routing logic |
| **codex-meta.psm1** | codex-tools.psm1 | - | Metadata functions |

---

## Data Flow

### Stage 1: PRE-RUN

#### Flow Diagram

```
INPUT: Source Directories
  ↓
┌──────────────────────────────────────────────────────────┐
│ pre_run.ps1                                              │
├──────────────────────────────────────────────────────────┤
│ 1. Import modules                                        │
│ 2. Load config                                           │
│ 3. Scan sources → candidates                             │
│ 4. Build initial manifest                                │
│ 5. Write catalog.jsonl                                   │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ build_signatures.py                                      │
├──────────────────────────────────────────────────────────┤
│ 1. Read catalog.jsonl                                    │
│ 2. Extract text from files                               │
│ 3. Generate shingles                                     │
│ 4. Calculate SimHash                                     │
│ 5. Write signatures.jsonl                                │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ cluster_and_layout.py                                    │
├──────────────────────────────────────────────────────────┤
│ 1. Read signatures.jsonl                                 │
│ 2. Read catalog.jsonl                                    │
│ 3. Calculate similarity (Hamming, Jaccard)               │
│ 4. Union-Find clustering                                 │
│ 5. Determine targets per cluster                         │
│ 6. Write proposed_layout.json                            │
└──────────────────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────────────────┐
│ ai_enrich.ps1 (optional)                                 │
├──────────────────────────────────────────────────────────┤
│ 1. Read catalog.jsonl                                    │
│ 2. Batch files                                           │
│ 3. POST to AI endpoint                                   │
│ 4. Write ai_enrich_*.json                                │
└──────────────────────────────────────────────────────────┘
  ↓
OUTPUT: metadata/pre/*.json, proposed_layout.json
```

#### Inputs

| File/Resource | Type | Required | Source |
|---------------|------|----------|--------|
| codex-config.json | JSON | Yes | User-provided |
| Source directories | Filesystem | Yes | Configured in Sources |
| Python 3.7+ | Runtime | Yes | System |
| codex-tools.psm1 | Module | Yes | Pipeline |
| codex-meta.psm1 | Module | Yes | Pipeline |

#### Outputs

| File | Location | Format | Size | Purpose |
|------|----------|--------|------|---------|
| catalog.jsonl | metadata/pre/ | JSONL | Variable | File inventory |
| signatures.jsonl | metadata/pre/ | JSONL | Variable | SimHash signatures |
| clusters.json | metadata/pre/ | JSON | Variable | Cluster analysis |
| proposed_layout.json | metadata/ | JSON | Variable | Suggested organization |
| ai_enrich_*.json | metadata/pre/ | JSON | Variable | AI enrichment (optional) |

---

### Stage 2: BUILD

#### Flow Diagram

```
INPUT: Config, Candidates, Proposed Layout
  ↓
┌──────────────────────────────────────────────────────────┐
│ run-codex.ps1                                            │
├──────────────────────────────────────────────────────────┤
│ 1. Import modules                                        │
│ 2. Load config                                           │
│ 3. Create staging directories                            │
│ 4. Get candidates                                        │
│ 5. Load proposed_layout.json (if exists)                 │
│ 6. Build manifest with routing                           │
│ 7. Copy files                                            │
│ 8. Generate INDEX.md                                     │
│ 9. Create module manifest                                │
│ 10. Create backup ZIP                                    │
└──────────────────────────────────────────────────────────┘
  ↓
OUTPUT: Organized collection, manifests, indexes, backup
```

#### Inputs

| File/Resource | Type | Required | Source |
|---------------|------|----------|--------|
| codex-config.json | JSON | Yes | User-provided |
| proposed_layout.json | JSON | No | PRE-RUN stage |
| Source files | Filesystem | Yes | Source directories |
| codex-tools.psm1 | Module | Yes | Pipeline |
| codex-router.psm1 | Module | Yes | Pipeline |
| codex-meta.psm1 | Module | No | Pipeline |
| ai_enrich_*.json | JSON | No | PRE-RUN stage |

#### Outputs

| File | Location | Format | Size | Purpose |
|------|----------|--------|------|---------|
| codex.manifest.json | metadata/ | JSON | Variable | Complete manifest |
| INDEX.md | metadata/ | Markdown | Variable | Human-readable index |
| codex.modules.json | core-kernel/ | JSON | Variable | Module manifest |
| Organized files | collection/, notes/ | Various | Variable | Organized collection |
| CODEX_V3_*.zip | _backups/ | ZIP | Variable | Backup archive |
| codex.log | logs/ | Text | Variable | Operation log |

---

## File Inputs/Outputs by Script

### 1. run-codex.ps1

#### Inputs

```yaml
Configuration:
  - codex-config.json (required)

Optional Inputs:
  - metadata/proposed_layout.json (from PRE-RUN)
  - metadata/pre/ai_enrich_*.json (from ai_enrich.ps1)

Modules:
  - scripts/codex-tools.psm1 (required)
  - scripts/codex-router.psm1 (required via tools)

Source Data:
  - Files from configured source paths
```

#### Outputs

```yaml
Metadata:
  - metadata/codex.manifest.json (complete manifest)
  - metadata/INDEX.md (human-readable index)
  - core-kernel/codex.modules.json (module manifest)

Organized Files:
  - collection/[Language]/[Project]/* (code files)
  - notes/Document/[Theme]/* (themed documents)
  - notes/DIN_Forms/* (DIN-coded files)

Backup:
  - _backups/CODEX_V3_[timestamp].zip

Logs:
  - logs/codex.log
```

#### Dependencies

**PowerShell:**
- Version 5.1+
- ConvertFrom-Json cmdlet
- ConvertTo-Json cmdlet
- Get-Content cmdlet
- Set-Content cmdlet

**Modules:**
- codex-tools.psm1 (all functions)
- codex-router.psm1 (via tools)

**Filesystem:**
- Read access to source paths
- Write access to OutputRoot

---

### 2. pre_run.ps1

#### Inputs

```yaml
Configuration:
  - codex-config.json (required)

Modules:
  - scripts/codex-tools.psm1 (required)
  - scripts/codex-meta.psm1 (required)

Python Scripts:
  - scripts/pre-run/python_pre/build_signatures.py
  - scripts/pre-run/python_pre/cluster_and_layout.py

Source Data:
  - Files from configured source paths
```

#### Outputs

```yaml
Metadata:
  - metadata/pre/catalog.jsonl (file inventory)
  - metadata/pre/signatures.jsonl (from Python)
  - metadata/pre/clusters.json (from Python)
  - metadata/proposed_layout.json (from Python)
  - metadata/pre/ai_enrich_*.json (if AI enabled)

Logs:
  - logs/codex.log
```

#### Dependencies

**PowerShell:**
- Version 5.1+
- Standard cmdlets

**Python:**
- Python 3.7+
- Standard library only (no external packages)

**Modules:**
- codex-tools.psm1
- codex-meta.psm1

**External Processes:**
- python executable in PATH
- Optional: ai_enrich.ps1

---

### 3. ai_enrich.ps1

#### Inputs

```yaml
Configuration:
  - codex-config.json (Meta.AI section)

Data:
  - metadata/pre/catalog.jsonl (from pre_run.ps1)

Network:
  - AI endpoint (HTTP/HTTPS)
```

#### Outputs

```yaml
Metadata:
  - metadata/pre/ai_enrich_[batch].json (per batch)

Logs:
  - logs/codex.log (via Write-Log)
```

#### Dependencies

**PowerShell:**
- Version 5.1+
- Invoke-RestMethod cmdlet
- ConvertFrom-Json cmdlet
- ConvertTo-Json cmdlet

**Network:**
- HTTP/HTTPS access to AI endpoint
- Optional: Authorization header

---

### 4. build_signatures.py

#### Inputs

```yaml
Configuration:
  - codex-config.json
    - PreRun.Similarity.ShingleSize
    - PreRun.MaxTextBytes
    - OutputRoot

Data:
  - metadata/pre/catalog.jsonl

Files:
  - Source files (for text extraction)
```

#### Outputs

```yaml
Metadata:
  - metadata/pre/signatures.jsonl
    Format:
      {"id": "...", "path": "...", "simhash": "...", "tokens": [...]}

Console:
  - Progress messages
```

#### Dependencies

**Python:**
- Python 3.7+
- Standard library:
  - os
  - sys
  - json
  - argparse
  - hashlib
  - re
  - pathlib

**No external packages required**

---

### 5. cluster_and_layout.py

#### Inputs

```yaml
Configuration:
  - codex-config.json
    - PreRun.Similarity (Hamming, Jaccard thresholds)
    - PreRun.Clustering (MinClusterSize, Linkage)
    - PreRun.ProposedLayout.BucketRules
    - OutputRoot

Data:
  - metadata/pre/signatures.jsonl
  - metadata/pre/catalog.jsonl
```

#### Outputs

```yaml
Metadata:
  - metadata/pre/clusters.json (detailed clusters)
  - metadata/proposed_layout.json (for BUILD stage)
    Format:
      [
        {
          "clusterId": "...",
          "size": 15,
          "target": "collection/Python/Project",
          "members": ["path1", "path2", ...]
        }
      ]

Console:
  - Cluster statistics
```

#### Dependencies

**Python:**
- Python 3.7+
- Standard library:
  - os
  - json
  - argparse
  - pathlib

**Algorithms:**
- Union-Find (implemented in script)
- Hamming distance
- Jaccard similarity

---

### 6. ai_webhook_stub.py

#### Inputs

```yaml
Network:
  - HTTP POST requests to localhost:8765
  - Request body: JSON with "records" array

Request Format:
  {
    "records": [
      {"id": "...", "path": "..."}
    ],
    "want": ["title", "summary", "keywords", ...]
  }
```

#### Outputs

```yaml
Network:
  - HTTP 200 responses with JSON

Response Format:
  {
    "records": [
      {
        "path": "...",
        "title": "...",
        "summary": "...",
        "keywords": [...],
        "entities": [...],
        "priority": 1,
        "fractal_path": "..."
      }
    ]
  }

Console:
  - Server status messages
```

#### Dependencies

**Python:**
- Python 3.7+
- Standard library:
  - http.server
  - json
  - sys

**Network:**
- Port 8765 available

---

### 7. codex-tools.psm1

#### Inputs

**Function-Specific:**

| Function | Inputs | Returns |
|----------|--------|---------|
| Write-Log | Message, Level, LogPath | None (side effect: log file) |
| Get-LanguageFromExtension | PathOrExt | Language string |
| Get-EntryPointScore | Path | Score (0-10) |
| Get-FileTagsFromPath | FullPath | Array of tags |
| Should-ExcludePath | FullPath, ExcludeFolders | Boolean |
| Get-CodexCandidates | Config, LogPath | Array of file objects |
| Detect-ProjectRoot | FilePath | Project root path or null |
| New-CodexStaging | OutputRoot | None (creates directories) |
| New-CodexManifest | FileList, Config, LogPath | Manifest array |
| Resolve-DestinationPath | OutputRoot, ManifestItem | Destination path |
| Copy-CodexFiles | Manifest, Config, LogPath | None (copies files) |
| New-CodexIndexMarkdown | Manifest, OutputRoot | INDEX.md path |
| New-CodexBackupZip | OutputRoot, Config, LogPath | ZIP path |
| New-CoreKernelModuleManifest | Manifest, Config, LogPath | Manifest path |

#### Outputs

**Exported Functions:** All 14 functions available to importing scripts

**Side Effects:**
- Log files (via Write-Log)
- Directory creation (New-CodexStaging)
- File copying (Copy-CodexFiles)
- File generation (New-CodexIndexMarkdown, etc.)

#### Dependencies

**PowerShell:**
- Version 5.1+
- Standard cmdlets
- System.IO namespace

---

### 8. codex-router.psm1

#### Inputs

**Function-Specific:**

| Function | Inputs | Returns |
|----------|--------|---------|
| Get-FractalPath | Config, ManifestItem | Fractal path string or null |
| Test-DINCode | Path, Pattern | Boolean |
| Resolve-RoutedDestination | Config, ManifestItem | Routed path |

**External Files:**
- metadata/pre/ai_enrich_*.json (for fractal paths)

#### Outputs

**Exported Functions:**
- Get-FractalPath
- Test-DINCode
- Resolve-RoutedDestination

#### Dependencies

**PowerShell:**
- Version 5.1+
- System.IO namespace
- Text.RegularExpressions namespace

**Modules:**
- None (standalone)

---

### 9. codex-meta.psm1

#### Inputs

**Function-Specific:**

| Function | Inputs | Returns |
|----------|--------|---------|
| Get-Themes | Config, FilePath | Array of theme names |
| Find-Snippets | Manifest, Config | Filtered manifest |
| Consolidate-Snippets | Manifest, Config, LogPath | Array of created files |

**External Files:**
- metadata/codex.meta.index.json (if exists)

#### Outputs

**Exported Functions:**
- Get-Themes
- Find-Snippets
- Consolidate-Snippets

**Side Effects:**
- Snippet markdown files in configured output directory

#### Dependencies

**PowerShell:**
- Version 5.1+
- System.IO namespace
- System.Collections.ArrayList

---

## Module Dependencies

### Import Hierarchy

```
Level 1 (Base):
  codex-tools.psm1
    ├─ No dependencies
    └─ Exports: 14 core functions

Level 2 (Uses Base):
  codex-router.psm1
    ├─ Uses: codex-tools (indirectly via scripts)
    └─ Exports: 3 routing functions

  codex-meta.psm1
    ├─ Uses: codex-tools (Write-Log)
    └─ Exports: 3 metadata functions

Level 3 (Scripts):
  run-codex.ps1
    ├─ Imports: codex-tools.psm1
    └─ Uses: codex-router.psm1 (via tools)

  pre_run.ps1
    ├─ Imports: codex-tools.psm1
    ├─ Imports: codex-meta.psm1
    └─ Calls: Python scripts
```

### Module Import Statements

```powershell
# In run-codex.ps1
Import-Module "$PSScriptRoot\codex-tools.psm1" -Force

# In pre_run.ps1
Import-Module "$PSScriptRoot\..\codex-tools.psm1" -Force
Import-Module "$PSScriptRoot\..\codex-meta.psm1" -Force
```

---

## External Dependencies

### System Requirements

#### PowerShell

**Version:** 5.1 or higher

**Required Cmdlets:**
- Get-Content
- Set-Content
- ConvertFrom-Json
- ConvertTo-Json
- Test-Path
- New-Item
- Copy-Item
- Remove-Item
- Join-Path
- Add-Content
- Invoke-RestMethod
- Get-ChildItem
- Where-Object
- Select-Object
- Sort-Object
- ForEach-Object
- Measure-Object
- Group-Object

**Required Assemblies:**
- System.IO
- System.IO.Compression.FileSystem (for backup ZIP)
- System.Text.RegularExpressions

---

#### Python

**Version:** 3.7 or higher

**Required Modules (all standard library):**
- os
- sys
- json
- argparse
- hashlib
- re
- pathlib
- http.server

**No pip packages required!**

---

#### Filesystem

**Read Access Required:**
- Source directories (configured in Sources)
- codex-config.json
- All script files

**Write Access Required:**
- OutputRoot directory
- LogPath directory
- Backup target directory

---

#### Network (Optional)

**For AI Enrichment:**
- HTTP/HTTPS access to configured AI endpoint
- Port 8765 (for ai_webhook_stub.py)

**No other network access required**

---

## Complete Dependency Graph

### Visual Dependency Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         CONFIGURATION                           │
│                      codex-config.json                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ↓                           ↓
┌───────────────────────────┐   ┌───────────────────────────┐
│    STAGE 1: PRE-RUN       │   │    STAGE 2: BUILD         │
│    pre_run.ps1            │   │    run-codex.ps1          │
└───────────────────────────┘   └───────────────────────────┘
        │                               │
        ├→ codex-tools.psm1             ├→ codex-tools.psm1
        ├→ codex-meta.psm1              └→ codex-router.psm1
        │                                       ↓
        ├→ build_signatures.py          Uses proposed_layout.json
        │       ↓                               ↓
        │   signatures.jsonl            ┌──────────────────┐
        │       ↓                       │ OUTPUTS:         │
        ├→ cluster_and_layout.py        │ - manifest.json  │
        │       ↓                       │ - INDEX.md       │
        │   proposed_layout.json        │ - modules.json   │
        │       ↓                       │ - organized files│
        └→ ai_enrich.ps1 (optional)     │ - backup ZIP     │
                ↓                       └──────────────────┘
            ai_enrich_*.json
                ↓
        [Used by Stage 2]
```

### Dependency Chain

```
codex-config.json
    ↓
pre_run.ps1
    ├→ codex-tools.psm1
    ├→ codex-meta.psm1
    ├→ build_signatures.py
    │   ├→ Python 3.7+
    │   └→ catalog.jsonl → signatures.jsonl
    ├→ cluster_and_layout.py
    │   ├→ Python 3.7+
    │   ├→ signatures.jsonl
    │   └→ catalog.jsonl → proposed_layout.json
    └→ ai_enrich.ps1 (optional)
        ├→ AI endpoint
        └→ catalog.jsonl → ai_enrich_*.json
            ↓
run-codex.ps1
    ├→ codex-tools.psm1
    ├→ codex-router.psm1
    ├→ proposed_layout.json (from pre_run)
    └→ ai_enrich_*.json (optional)
        ↓
    OUTPUTS:
    ├→ codex.manifest.json
    ├→ INDEX.md
    ├→ codex.modules.json
    ├→ organized files (collection/, notes/)
    └→ CODEX_V3_*.zip
```

---

## Runtime Dependencies

### Execution Requirements

#### Minimum System

```yaml
Operating System:
  - Windows 10+ (with PowerShell 5.1)
  - macOS 10.14+ (with PowerShell Core 7+)
  - Linux (with PowerShell Core 7+)

PowerShell:
  - Version: 5.1+ (Windows) or 7+ (cross-platform)
  - Execution Policy: Bypass or RemoteSigned

Python:
  - Version: 3.7+
  - Installation: python command in PATH
  - Packages: None (standard library only)

Disk Space:
  - Pipeline: ~100 KB
  - Outputs: Variable (depends on source files)

Memory:
  - Minimum: 512 MB
  - Recommended: 2+ GB for large file sets

Permissions:
  - Read: Source directories
  - Write: OutputRoot
  - Execute: PowerShell and Python scripts
```

---

## Dependency Installation

### PowerShell

**Windows:**
```powershell
# Check version
$PSVersionTable.PSVersion
# Should be 5.1 or higher

# Set execution policy (if needed)
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

**macOS/Linux:**
```bash
# Install PowerShell Core
# macOS
brew install --cask powershell

# Linux (Ubuntu/Debian)
sudo apt-get install -y powershell
```

### Python

**Windows:**
```powershell
# Download from python.org or use winget
winget install Python.Python.3.12

# Verify
python --version
```

**macOS:**
```bash
# Using Homebrew
brew install python3

# Verify
python3 --version
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install python3

# Verify
python3 --version
```

---

## Optional Dependencies

### AI Enrichment

**Required for AI features:**
- HTTP/HTTPS network access
- AI endpoint (OpenAI, Claude, local model)
- Optional: API key

**Alternatives:**
- Use ai_webhook_stub.py for testing
- Disable AI enrichment (Meta.AI.Enable = false)

---

## Troubleshooting Dependencies

### Common Issues

#### PowerShell Not Found
```powershell
# Windows: Verify installation
Get-Command powershell

# macOS/Linux: Install PowerShell Core
# See installation instructions above
```

#### Python Not Found
```powershell
# Check if python is in PATH
Get-Command python

# Windows alternative
py --version
```

#### Module Import Errors
```powershell
# Check file paths
Test-Path .\scripts\codex-tools.psm1

# Force reimport
Import-Module .\scripts\codex-tools.psm1 -Force
```

#### Permission Errors
```powershell
# Check execution policy
Get-ExecutionPolicy

# Set for current user
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## Dependency Checklist

### Pre-Flight Check

```powershell
# 1. PowerShell version
$PSVersionTable.PSVersion  # Should be 5.1+

# 2. Python version
python --version  # Should be 3.7+

# 3. Config file exists
Test-Path codex-config.json  # Should be True

# 4. Modules exist
Test-Path .\scripts\codex-tools.psm1  # Should be True
Test-Path .\scripts\codex-router.psm1  # Should be True
Test-Path .\scripts\codex-meta.psm1  # Should be True

# 5. Python scripts exist
Test-Path .\scripts\pre-run\python_pre\build_signatures.py  # Should be True
Test-Path .\scripts\pre-run\python_pre\cluster_and_layout.py  # Should be True

# 6. Write permissions
Test-Path E:\CODEX_V3 -PathType Container  # Should be True or create it
```

---

## Summary Tables

### Input Files Summary

| File | Type | Required | Used By | Purpose |
|------|------|----------|---------|---------|
| codex-config.json | JSON | Yes | All scripts | Configuration |
| catalog.jsonl | JSONL | No | Python scripts, ai_enrich | File inventory |
| signatures.jsonl | JSONL | No | cluster_and_layout.py | SimHash data |
| proposed_layout.json | JSON | No | run-codex.ps1 | Cluster routing |
| ai_enrich_*.json | JSON | No | codex-router.psm1 | AI metadata |

### Output Files Summary

| File | Location | Created By | Format | Purpose |
|------|----------|------------|--------|---------|
| catalog.jsonl | metadata/pre/ | pre_run.ps1 | JSONL | File inventory |
| signatures.jsonl | metadata/pre/ | build_signatures.py | JSONL | SimHash signatures |
| clusters.json | metadata/pre/ | cluster_and_layout.py | JSON | Cluster data |
| proposed_layout.json | metadata/ | cluster_and_layout.py | JSON | Routing suggestions |
| ai_enrich_*.json | metadata/pre/ | ai_enrich.ps1 | JSON | AI enrichment |
| codex.manifest.json | metadata/ | run-codex.ps1 | JSON | Complete manifest |
| INDEX.md | metadata/ | run-codex.ps1 | Markdown | Human index |
| codex.modules.json | core-kernel/ | run-codex.ps1 | JSON | Module manifest |
| CODEX_V3_*.zip | _backups/ | run-codex.ps1 | ZIP | Backup archive |
| codex.log | logs/ | All scripts | Text | Operation log |

### Module Dependencies Summary

| Module | Imports | Exports | Used By |
|--------|---------|---------|---------|
| codex-tools.psm1 | None | 14 functions | run-codex, pre_run |
| codex-router.psm1 | None | 3 functions | run-codex (via tools) |
| codex-meta.psm1 | codex-tools | 3 functions | pre_run |

---

*Complete I/O and dependency documentation generated: 2026-01-20 20:43:23*
