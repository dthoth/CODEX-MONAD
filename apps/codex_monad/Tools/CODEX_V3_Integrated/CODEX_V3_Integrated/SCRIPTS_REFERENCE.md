# 📜 CODEX_V3_Integrated Scripts Reference

**Last Updated:** 2026-01-20 20:18:55

---

## Overview

The CODEX V3 pipeline consists of **5 PowerShell scripts** organized into functional groups:

### Main Pipeline Scripts
1. **run-codex.ps1** - Stage 2 (BUILD)
2. **pre_run.ps1** - Stage 1 (PRE-RUN)

### Enrichment Scripts
3. **ai_enrich.ps1** - AI metadata enrichment

### Migration Adapters
4. **read_legacy_index.ps1** - Import legacy INDEX.md
5. **read_legacy_manifest.ps1** - Import legacy manifest.json

---

## Main Pipeline Scripts

### run-codex.ps1

**Purpose:** Stage 2 - BUILD and deploy organized collection

**Location:** `scripts/run-codex.ps1`  
**Size:** 2,717 bytes (58 lines)  
**Requirements:** PowerShell 5.1+

#### Parameters

```powershell
param(
    [string]$ConfigPath = "$PSScriptRoot\..\codex-config.json"
)
```

- `$ConfigPath` - Path to config file (default: adjacent to script)

#### Workflow

```
1. Import codex-tools.psm1 module
   ↓
2. Load and parse codex-config.json
   ↓
3. Create staging directories
   ↓
4. Scan source directories → Get candidate files
   ↓
5. Load proposed_layout.json (if exists from PRE-RUN)
   ↓
6. Build complete manifest with routing
   ↓
7. Copy files to OutputRoot (respects DryRun)
   ↓
8. Generate INDEX.md
   ↓
9. Create core-kernel modules manifest
   ↓
10. Create backup ZIP
    ↓
COMPLETE
```

#### Key Operations

**Manifest Building:**
```powershell
$manifest = New-CodexManifest -FileList $candidates -Config $config -LogPath $log
```

**Proposed Layout Application:**
```powershell
if ($config.PreRun.ProposedLayout.Enable -and $config.PreRun.ProposedLayout.ApplyAutoLayout) {
  $layout = Get-Content -Raw -Path $mapPath | ConvertFrom-Json
  # Override destinations with cluster-based layout
}
```

**File Copying:**
```powershell
Copy-CodexFiles -Manifest $manifest -Config $config -LogPath $log
```

#### Outputs

- `metadata/codex.manifest.json` - Complete manifest
- `metadata/INDEX.md` - Human-readable index
- `core-kernel/codex.modules.json` - Module manifest
- `collection/*` - Organized files
- `_backups/CODEX_backup_*.zip` - Timestamped backup

#### Usage

```powershell
# Default config path
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1

# Custom config
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1 -ConfigPath "C:\custom\config.json"
```

---

### pre_run.ps1

**Purpose:** Stage 1 - Analysis, clustering, and layout generation

**Location:** `scripts/pre-run/pre_run.ps1`  
**Size:** 2,183 bytes (42 lines)  
**Requirements:** PowerShell 5.1+

#### Parameters

```powershell
param(
    [string]$ConfigPath = "$PSScriptRoot\..\..\codex-config.json"
)
```

#### Workflow

```
1. Import modules (codex-tools, codex-meta)
   ↓
2. Load config
   ↓
3. Scan sources → Get candidates
   ↓
4. Call Python preprocessing:
   │
   ├─→ build_signatures.py
   │   └─ Generate SimHash signatures
   │
   └─→ cluster_and_layout.py
       └─ Cluster similar files
       └─ Generate proposed_layout.json
   ↓
5. Optional: AI enrichment (ai_enrich.ps1)
   ↓
OUTPUTS: proposed_layout.json, file_signatures.json
```

#### Python Integration

Calls Python scripts for advanced processing:

**build_signatures.py:**
- Generates SimHash fingerprints
- Calculates shingle-based similarity
- Outputs: `metadata/file_signatures.json`

**cluster_and_layout.py:**
- Performs hierarchical clustering
- Groups similar files
- Generates proposed layout
- Outputs: `metadata/proposed_layout.json`

#### Proposed Layout Structure

```json
[
  {
    "cluster_id": 1,
    "similarity_score": 0.85,
    "target": "collection/Text/Research",
    "members": [
      "path/to/file1.md",
      "path/to/file2.md",
      "path/to/file3.md"
    ]
  },
  ...
]
```

#### Usage

```powershell
# Run PRE-RUN stage
powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1

# Then review proposed_layout.json before running BUILD
```

---

## Enrichment Scripts

### ai_enrich.ps1

**Purpose:** Enrich file metadata using AI webhook

**Location:** `scripts/pre-run/ai_enrich.ps1`  
**Size:** 1,845 bytes (31 lines)

#### Parameters

```powershell
param(
    [string]$ConfigPath,
    [string]$CandidatesJsonPath
)
```

- `$ConfigPath` - Configuration file
- `$CandidatesJsonPath` - Path to candidates JSON (from pre_run)

#### Process

```
1. Load candidates JSON
   ↓
2. Check AI.Enable in config
   ↓
3. Batch candidates (BatchSize from config)
   ↓
4. For each batch:
   │
   ├─→ Extract file content
   ├─→ POST to AI.Endpoint
   ├─→ Parse response
   └─→ Merge enriched metadata
   ↓
5. Save enriched candidates
```

#### AI Request Format

```json
{
  "files": [
    {
      "path": "path/to/file.md",
      "content": "file text content...",
      "metadata": {...}
    }
  ]
}
```

#### AI Response Format

```json
{
  "enriched": [
    {
      "path": "path/to/file.md",
      "title": "Extracted Title",
      "summary": "Brief summary...",
      "keywords": ["keyword1", "keyword2"],
      "entities": ["Entity1"],
      "priority": 7,
      "fractal_path": "collection/Text/Research"
    }
  ]
}
```

#### Usage

```powershell
# Called automatically by pre_run.ps1 if AI.Enable = true
# Can also run standalone:
.\scripts\pre-run\ai_enrich.ps1 -ConfigPath config.json -CandidatesJsonPath candidates.json
```

---

## Migration Adapters

### read_legacy_index.ps1

**Purpose:** Import files from legacy INDEX.md format

**Location:** `scripts/adapters/read_legacy_index.ps1`  
**Size:** 166 bytes

#### Parameters

```powershell
param([string]$IndexPath)
```

#### Process

```
1. Parse INDEX.md (markdown table)
2. Extract file paths and metadata
3. Convert to V3 candidate format
4. Return candidates array
```

#### Usage

```powershell
$candidates = .\scripts\adapters\read_legacy_index.ps1 -IndexPath "old/INDEX.md"
```

---

### read_legacy_manifest.ps1

**Purpose:** Import files from legacy manifest.json

**Location:** `scripts/adapters/read_legacy_manifest.ps1`  
**Size:** 173 bytes

#### Parameters

```powershell
param([string]$ManifestPath)
```

#### Process

```
1. Load legacy manifest JSON
2. Map old fields to new schema
3. Convert to V3 format
4. Return candidates array
```

#### Usage

```powershell
$candidates = .\scripts\adapters\read_legacy_manifest.ps1 -ManifestPath "old/manifest.json"
```

---

## Python Scripts

### build_signatures.py

**Location:** `scripts/pre-run/python_pre/build_signatures.py`  
**Size:** 2,444 bytes

**Purpose:** Generate SimHash signatures for files

#### Algorithm

1. **Text Extraction**
   - Read file content
   - Normalize text (lowercase, strip punctuation)
   - Limit to MaxTextBytes

2. **Shingle Generation**
   - Create character n-grams (size from config)
   - Example: "hello" with size=3 → ["hel", "ell", "llo"]

3. **SimHash Calculation**
   - Hash each shingle
   - Combine hashes into fingerprint
   - 64-bit hash value

4. **Output**
   ```json
   {
     "path/to/file": {
       "simhash": "a1b2c3d4e5f6g7h8",
       "shingle_count": 1234
     }
   }
   ```

---

### cluster_and_layout.py

**Location:** `scripts/pre-run/python_pre/cluster_and_layout.py`  
**Size:** 3,775 bytes

**Purpose:** Cluster similar files and propose organization

#### Algorithm

1. **Similarity Matrix**
   - Compare all file pairs
   - Calculate Jaccard similarity
   - Use SimHash for near-duplicate detection

2. **Clustering**
   - Hierarchical clustering (linkage from config)
   - Methods: single, complete, average
   - Min cluster size from config

3. **Layout Generation**
   - Determine common themes per cluster
   - Suggest target directories
   - Rank by similarity score

4. **Output**
   ```json
   [
     {
       "cluster_id": 1,
       "size": 15,
       "similarity_score": 0.87,
       "target": "collection/Text/Research",
       "members": ["file1", "file2", ...]
     }
   ]
   ```

---

### ai_webhook_stub.py

**Location:** `tools/ai_webhook_stub.py`  
**Size:** 1,404 bytes

**Purpose:** Simple AI enrichment webhook stub for testing

#### Features

- **HTTP Server:** Listens on port 8765
- **Endpoint:** POST /enrich
- **Mock Responses:** Returns placeholder metadata
- **Logging:** Logs all requests

#### Usage

```bash
# Start stub
python tools\ai_webhook_stub.py

# In another terminal, run pipeline with AI.Enable = true
```

#### Extending

Replace mock logic with actual AI calls:
```python
def enrich_content(content, filename):
    # Call OpenAI, Claude, or local model
    # Return enriched metadata
    pass
```

---

## Script Execution Order

### Full Pipeline

```bash
# 1. PRE-RUN (optional but recommended)
powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1

# 2. Review proposed layout (optional)
notepad metadata\proposed_layout.json

# 3. BUILD (execute pipeline)
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1
```

### Quick Run (Skip PRE-RUN)

```bash
# Direct to BUILD (no clustering)
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1
```

---

## Error Handling

All scripts use `$ErrorActionPreference='Stop'` by default.

### Common Issues

**"Config not found"**
- Check config path parameter
- Verify file exists

**"Python not found"** (in pre_run.ps1)
- Install Python 3.7+
- Add to PATH
- Or disable PreRun.Enable

**"AI endpoint unreachable"** (in ai_enrich.ps1)
- Start ai_webhook_stub.py
- Or set AI.Enable = false

---

## Testing Scripts

### Dry Run

```powershell
# Set DryRun in config
$config = Get-Content codex-config.json | ConvertFrom-Json
$config.DryRun = $true
$config | ConvertTo-Json -Depth 10 | Set-Content codex-config.json

# Run pipeline safely
.\scripts\run-codex.ps1
```

### Verbose Mode

```powershell
$VerbosePreference = "Continue"
.\scripts\run-codex.ps1
```

---

## Related Documentation

- [Configuration Guide](CONFIGURATION_GUIDE.md)
- [Modules Reference](MODULES_REFERENCE.md)
- [CODEX V3 Pipeline](../../../../../docs/CODEX_V3_PIPELINE.md)

---

*Scripts reference generated: 2026-01-20 20:18:55*
