# 📖 CODEX_V3_Integrated Complete Script Analysis

**Generated:** 2026-01-20 20:32:38  
**Total Scripts Analyzed:** 11

---

## Table of Contents

### PowerShell Scripts (5)
1. [run-codex.ps1](#1-run-codexps1) - Stage 2 BUILD
2. [pre_run.ps1](#2-pre_runps1) - Stage 1 PRE-RUN
3. [ai_enrich.ps1](#3-ai_enrichps1) - AI Enrichment
4. [read_legacy_index.ps1](#4-read_legacy_indexps1) - Legacy Adapter
5. [read_legacy_manifest.ps1](#5-read_legacy_manifestps1) - Legacy Adapter

### PowerShell Modules (3)
6. [codex-tools.psm1](#6-codex-toolspsm1) - Core Utilities
7. [codex-router.psm1](#7-codex-routerpsm1) - Routing Logic
8. [codex-meta.psm1](#8-codex-metapsm1) - Metadata Handling

### Python Scripts (3)
9. [build_signatures.py](#9-build_signaturespy) - SimHash Generation
10. [cluster_and_layout.py](#10-cluster_and_layoutpy) - Clustering
11. [ai_webhook_stub.py](#11-ai_webhook_stubpy) - AI Webhook

---

## PowerShell Scripts

### 1. run-codex.ps1

**Purpose:** Stage 2 - BUILD and deploy organized collection  
**Path:** `scripts/run-codex.ps1`  
**Size:** 2660 bytes  
**Lines:** 57  
**Requirements:** PowerShell 5.1+

#### Script Flow

```
START
  ↓
Import codex-tools.psm1
  ↓
Load codex-config.json
  ↓
Initialize logging
  ↓
Create staging directories
  ↓
Scan sources → Get candidates
  ↓
[Optional] Load proposed_layout.json
  ↓
Build manifest with enrichment
  ↓
Save manifest to JSON
  ↓
Copy files to OutputRoot
  ↓
Generate INDEX.md
  ↓
Create core-kernel modules manifest
  ↓
Create backup ZIP
  ↓
Log completion
  ↓
END
```

#### Key Operations

1. **Module Import**
   ```powershell
   Import-Module "$PSScriptRoot\codex-tools.psm1" -Force
   ```

2. **Configuration Loading**
   ```powershell
   $config = Get-Content -Raw -Path $ConfigPath | ConvertFrom-Json
   ```

3. **Candidate Scanning**
   ```powershell
   $candidates = Get-CodexCandidates -Config $config -LogPath $log
   ```

4. **Proposed Layout Application**
   ```powershell
   if ($config.PreRun.ProposedLayout.Enable -and $config.PreRun.ProposedLayout.ApplyAutoLayout) {
     $layout = Get-Content -Raw -Path $mapPath | ConvertFrom-Json
     $Global:__Codex_Override_Targets = @{}
     foreach ($cluster in $layout) {
       foreach ($m in $cluster.members) {
         $Global:__Codex_Override_Targets[$m] = $cluster.target
       }
     }
   }
   ```

5. **Manifest Generation**
   ```powershell
   $manifest = New-CodexManifest -FileList $candidates -Config $config -LogPath $log
   ```

6. **File Operations**
   ```powershell
   Copy-CodexFiles -Manifest $manifest -Config $config -LogPath $log
   ```

7. **Index Creation**
   ```powershell
   $indexPath = New-CodexIndexMarkdown -Manifest $manifest -OutputRoot $config.OutputRoot
   ```

8. **Backup**
   ```powershell
   $zip = New-CodexBackupZip -OutputRoot $config.OutputRoot -Config $config -LogPath $log
   ```

#### Inputs
- `codex-config.json` - Configuration
- `metadata/proposed_layout.json` (optional) - From PRE-RUN

#### Outputs
- `metadata/codex.manifest.json` - Complete manifest
- `metadata/INDEX.md` - Human-readable index
- `core-kernel/codex.modules.json` - Module manifest
- `collection/*` - Organized files
- `_backups/CODEX_V3_*.zip` - Backup archive

---

### 2. pre_run.ps1

**Purpose:** Stage 1 - Analysis, clustering, and layout generation  
**Path:** `scripts/pre-run/pre_run.ps1`  
**Size:** 2142 bytes  
**Lines:** 41  
**Requirements:** PowerShell 5.1+, Python 3.7+

#### Script Flow

```
START
  ↓
Import modules (codex-tools, codex-meta)
  ↓
Load configuration
  ↓
Create metadata/pre directory
  ↓
Get candidates from sources
  ↓
Cap to MaxFiles if needed
  ↓
Build manifest
  ↓
Save catalog.jsonl
  ↓
Call Python: build_signatures.py
  ↓
Call Python: cluster_and_layout.py
  ↓
[Optional] Call ai_enrich.ps1
  ↓
Log completion
  ↓
END
```

#### Key Operations

1. **Module Imports**
   ```powershell
   Import-Module "$PSScriptRoot\..\codex-tools.psm1" -Force
   Import-Module "$PSScriptRoot\..\codex-meta.psm1" -Force
   ```

2. **Candidate Capping**
   ```powershell
   if ($candidates.Count -gt $config.PreRun.MaxFiles) {
     $candidates = $candidates[0..($config.PreRun.MaxFiles-1)]
   }
   ```

3. **Catalog Creation**
   ```powershell
   foreach($m in $manifest){
     $obj = [PSCustomObject]@{ id=$m.id; path=$m.path; ... }
     ($obj | ConvertTo-Json -Compress) | Add-Content -Path $catalogPath
   }
   ```

4. **Python Integration - Signatures**
   ```powershell
   & python "$py" --config "$ConfigPath" --catalog "$catalogPath" 2>&1 | 
     ForEach-Object { Write-Log -Message $_ -Level DEBUG -LogPath $log }
   ```

5. **Python Integration - Clustering**
   ```powershell
   & python "$PSScriptRoot\python_pre\cluster_and_layout.py" --config "$ConfigPath" 2>&1 |
     ForEach-Object { Write-Log -Message $_ -Level DEBUG -LogPath $log }
   ```

6. **AI Enrichment Call**
   ```powershell
   if ($config.Meta.AI.Enable -and $config.Meta.AI.Mode -eq 'webhook') {
     & powershell -ExecutionPolicy Bypass -File "$PSScriptRoot\ai_enrich.ps1" -ConfigPath $ConfigPath
   }
   ```

#### Inputs
- `codex-config.json` - Configuration
- Source directories (from config)

#### Outputs
- `metadata/pre/catalog.jsonl` - File catalog
- `metadata/pre/signatures.jsonl` - SimHash signatures
- `metadata/pre/clusters.json` - Cluster analysis
- `metadata/proposed_layout.json` - Proposed organization
- `metadata/pre/ai_enrich_*.json` (optional) - AI enrichment

---

### 3. ai_enrich.ps1

**Purpose:** Enrich file metadata using AI webhook  
**Path:** `scripts/pre-run/ai_enrich.ps1`  
**Size:** 1815 bytes  
**Lines:** 30

#### Script Flow

```
START
  ↓
Load configuration
  ↓
Check if AI enabled
  ↓
Load catalog from pre_run
  ↓
Batch files (BatchSize from config)
  ↓
For each batch:
  ├─ Build payload
  ├─ POST to AI endpoint
  ├─ Parse response
  └─ Save enriched data
  ↓
Log completion
  ↓
END
```

#### Key Operations

1. **Configuration Check**
   ```powershell
   if(-not $config.Meta.AI.Enable -or $config.Meta.AI.Mode -ne 'webhook' -or 
      [string]::IsNullOrWhiteSpace($config.Meta.AI.Endpoint)){
     Write-Log "AI webhook disabled" "WARN"; exit 0
   }
   ```

2. **Catalog Loading**
   ```powershell
   Get-Content -Path $catalogPath | ForEach-Object {
     $r = $_ | ConvertFrom-Json
     $items += [PSCustomObject]@{ id=$r.id; path=$r.path }
   }
   ```

3. **Batch Processing**
   ```powershell
   for($i=0; $i -lt $items.Count; $i+=$batch){
     $chunk = $items[$i..([Math]::Min($i+$batch-1, $items.Count-1))]
     $payload = [PSCustomObject]@{ records = $chunk; want = $fields }
     ...
   }
   ```

4. **HTTP Request**
   ```powershell
   $resp = Invoke-RestMethod -Uri $endpoint -Method Post -Headers $headers 
           -Body ($payload | ConvertTo-Json -Depth 6) -ContentType "application/json"
   ```

5. **Response Storage**
   ```powershell
   $out = Join-Path $pre ("ai_enrich_" + $i + ".json")
   ($resp | ConvertTo-Json -Depth 8) | Set-Content -Path $out -Force
   ```

#### Inputs
- `metadata/pre/catalog.jsonl` - From pre_run.ps1
- AI.Endpoint from config

#### Outputs
- `metadata/pre/ai_enrich_*.json` - Enriched metadata batches

---

### 4. read_legacy_index.ps1

**Purpose:** Import files from legacy INDEX.md format  
**Path:** `scripts/adapters/read_legacy_index.ps1`  
**Size:** 166 bytes

#### One-Liner Analysis

```powershell
param([string]$Path); 
if (-not (Test-Path $Path)) { Write-Host "Not found: $Path"; exit 1 }; 
Get-Content -Path $Path -TotalCount 10 | ForEach-Object { Write-Host $_ }
```

**Function:** Reads first 10 lines of legacy INDEX.md for inspection

---

### 5. read_legacy_manifest.ps1

**Purpose:** Import files from legacy manifest.json  
**Path:** `scripts/adapters/read_legacy_manifest.ps1`  
**Size:** 173 bytes

#### One-Liner Analysis

```powershell
param([string]$Path); 
if (-not (Test-Path $Path)) { Write-Host "Not found: $Path"; exit 1 }; 
$d=Get-Content -Raw -Path $Path | ConvertFrom-Json; 
"Legacy items: $($d.Count)"
```

**Function:** Counts items in legacy manifest

---

## PowerShell Modules

### 6. codex-tools.psm1

**Purpose:** Core utility functions for the pipeline  
**Path:** `scripts/codex-tools.psm1`  
**Size:** 15277 bytes  
**Lines:** 305  
**Functions:** 14

#### Function List

1. **Write-Log** - Timestamped logging to file and console
2. **Get-LanguageFromExtension** - Map extensions to languages
3. **Get-EntryPointScore** - Score files as potential entry points
4. **Get-FileTagsFromPath** - Extract metadata tags from paths
5. **Should-ExcludePath** - Check if path should be excluded
6. **Get-CodexCandidates** - Scan sources and return candidates
7. **Detect-ProjectRoot** - Find project root directory
8. **New-CodexStaging** - Create output directory structure
9. **New-CodexManifest** - Build complete manifest with metadata
10. **Resolve-DestinationPath** - Apply routing to determine destination
11. **Copy-CodexFiles** - Execute file copy operations
12. **New-CodexIndexMarkdown** - Generate INDEX.md
13. **New-CodexBackupZip** - Create backup archive
14. **New-CoreKernelModuleManifest** - Generate module manifest

#### Critical Functions Deep Dive

**Get-CodexCandidates:**
- Reads Sources from config
- Recursively scans each path
- Filters by extensions
- Excludes system directories
- Returns array of file objects

**New-CodexManifest:**
- Takes candidate list
- Adds file info (hash, size, dates)
- Detects language
- Applies theme patterns
- Extracts tags
- Scores entry points
- Detects project roots
- Returns enriched manifest

**Resolve-DestinationPath:**
- Checks for proposed layout override
- Calls router module
- Applies routing precedence
- Returns final destination path

---

### 7. codex-router.psm1

**Purpose:** Routing logic for file organization  
**Path:** `scripts/codex-router.psm1`  
**Size:** 2517 bytes  
**Lines:** 71

#### Functions

1. **Get-FractalPath** - Retrieves AI-suggested fractal path
2. **Test-DINCode** - Tests for DIN-### pattern
3. **Resolve-RoutedDestination** - Main routing function

#### Routing Precedence Implementation

```powershell
foreach ($key in $route.Precedence) {
  switch ($key) {
    'fractal_path' { ... }
    'themes' { ... }
    'din_code' { ... }
    'project' { ... }
    'language' { ... }
  }
}
```

**Routing Order:**
1. Fractal path (AI-suggested hierarchy)
2. Theme buckets (pattern matching)
3. DIN codes (DIN-### detection)
4. Project (project structure)
5. Language (extension-based fallback)

---

### 8. codex-meta.psm1

**Purpose:** Metadata extraction and enrichment  
**Path:** `scripts/codex-meta.psm1`  
**Size:** 6416 bytes  
**Lines:** 180

#### Functions

1. **Get-Themes** - Extract themes from content/path
2. **Find-Snippets** - Identify snippet-eligible files
3. **Consolidate-Snippets** - Generate snippet notebooks

#### Theme Extraction

Applies regex patterns from config to file content:
```powershell
foreach ($pattern in $patterns.GetEnumerator()) {
  if ($hay -match $pattern.Key) {
    $matched += $pattern.Value
  }
}
```

#### Snippet Consolidation

Groups small files by theme/project/language and generates markdown notebooks.

---

## Python Scripts

### 9. build_signatures.py

**Purpose:** Generate SimHash signatures for similarity detection  
**Path:** `scripts/pre-run/python_pre/build_signatures.py`  
**Size:** 2375 bytes  
**Lines:** 69

#### Algorithm

1. **Text Extraction**
   - Read file (up to MaxTextBytes)
   - Decode as UTF-8 or Latin-1

2. **Tokenization**
   - Remove non-word characters
   - Lowercase all text
   - Filter tokens (length 3-48)

3. **Shingle Generation**
   - Create n-grams of tokens (size from config)
   - Example: ["hello", "world"] with k=2 → ["hello world"]

4. **SimHash Calculation**
   - Hash each shingle
   - Accumulate bit vectors
   - Generate 64-bit fingerprint

#### Key Functions

```python
def shingles(tokens, k=7):
    return [" ".join(tokens[i:i+k]) for i in range(max(0, len(tokens)-k+1))]

def simhash(tokens, hashbits=64):
    v = [0]*hashbits
    for t in tokens:
        h = int(hashlib.md5(t.encode("utf-8")).hexdigest(), 16)
        for i in range(hashbits):
            bit = 1 if (h >> i) & 1 else -1
            v[i] += bit
    fp = 0
    for i in range(hashbits):
        if v[i] >= 0:
            fp |= (1 << i)
    return fp
```

#### Output

`metadata/pre/signatures.jsonl` - One JSON object per line:
```json
{"id": "file_id", "path": "path", "simhash": "abc123...", "tokens": [...]}
```

---

### 10. cluster_and_layout.py

**Purpose:** Cluster similar files and propose organization  
**Path:** `scripts/pre-run/python_pre/cluster_and_layout.py`  
**Size:** 3679 bytes  
**Lines:** 94

#### Algorithm

1. **Similarity Calculation**
   - **Hamming distance** for SimHash comparison
   - **Jaccard similarity** for token overlap

2. **Union-Find Clustering**
   - Initialize each file as its own set
   - For each pair:
     - If Hamming ≤ threshold → union
     - Else if Jaccard ≥ threshold → union
   - Merge similar files into clusters

3. **Layout Generation**
   - Analyze cluster metadata
   - Determine dominant language
   - Find common project
   - Detect theme tags
   - Apply bucketing rules
   - Suggest target directory

#### Key Functions

```python
def hamming(a, b):
    x = int(a, 16) ^ int(b, 16)
    return bin(x).count('1')

def jaccard(a, b):
    if not a or not b: return 0.0
    sa, sb = set(a), set(b)
    return len(sa & sb) / len(sa | sb)

def find(x):
    parent.setdefault(x, x)
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]

def union(a,b):
    ra, rb = find(a), find(b)
    if ra != rb: parent[rb] = ra
```

#### Bucketing Rules

**theme_first:**
```python
theme = next((t for t in ["codex","obsidian","thoth",...] if t in tags), None)
target = f"notes/Document/{theme}" if theme else f"collection/{lang}/{proj}"
```

**project_first:**
```python
target = f"collection/{lang}/{proj}"
```

#### Output

`metadata/proposed_layout.json`:
```json
[
  {
    "clusterId": "file_id",
    "size": 15,
    "target": "collection/Python/MyProject",
    "members": ["path1", "path2", ...]
  }
]
```

---

### 11. ai_webhook_stub.py

**Purpose:** Simple HTTP server for AI enrichment testing  
**Path:** `tools/ai_webhook_stub.py`  
**Size:** 1367 bytes  
**Lines:** 37

#### Server Implementation

```python
class Handler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        # Read request body
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8')
        payload = json.loads(body)
        
        # Generate mock enrichment
        records = payload.get("records", [])
        enriched = []
        for rec in records:
            path = rec.get("path","")
            enriched.append({
                "path": path,
                "title": path.split("\\")[-1],
                "summary": "auto summary placeholder",
                "keywords": ["auto","placeholder"],
                "entities": [],
                "priority": 1,
                "fractal_path": "Fractal/Auto/Placeholder"
            })
        
        # Send response
        resp = {"records": enriched}
        data = json.dumps(resp).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type","application/json")
        self.end_headers()
        self.wfile.write(data)
```

#### Usage

```bash
python tools/ai_webhook_stub.py
# Server running on http://127.0.0.1:8765
```

**Extending:**
Replace mock logic with actual AI API calls (OpenAI, Claude, local models)

---

## Script Dependencies

### Dependency Graph

```
RUN_ALL.ps1
├─→ install-core.ps1
├─→ ai_webhook_stub.py (background)
├─→ pre_run.ps1
│   ├─→ codex-tools.psm1
│   ├─→ codex-meta.psm1
│   ├─→ build_signatures.py
│   ├─→ cluster_and_layout.py
│   └─→ ai_enrich.ps1
└─→ run-codex.ps1
    ├─→ codex-tools.psm1
    ├─→ codex-router.psm1
    └─→ codex-meta.psm1
```

### Module Dependencies

```
codex-tools.psm1 (base)
codex-router.psm1 → codex-tools
codex-meta.psm1 → codex-tools
```

---

## Statistics Summary

| Category | Count | Total Bytes | Total Lines |
|----------|-------|-------------|-------------|
| PowerShell Scripts | 5 | 6956 | 130 |
| PowerShell Modules | 3 | 24210 | 556 |
| Python Scripts | 3 | 7421 | 200 |
| **TOTAL** | **11** | **38587** | **886** |

---

## Key Insights

### Code Quality
- **Modular Design:** Clear separation between tools, routing, and metadata
- **Error Handling:** Stop on errors, log everything
- **DryRun Support:** Safe testing mode throughout
- **Logging:** Comprehensive logging at all levels

### Algorithm Highlights
- **SimHash:** Efficient near-duplicate detection
- **Union-Find:** Fast clustering algorithm
- **Jaccard Similarity:** Token-based content similarity
- **5-Level Routing:** Flexible, prioritized organization

### Integration Patterns
- PowerShell calls Python for heavy computation
- Modular imports with -Force for development
- JSON-based data exchange
- HTTP for AI integration

---

*Complete script analysis generated: 2026-01-20 20:32:38*
