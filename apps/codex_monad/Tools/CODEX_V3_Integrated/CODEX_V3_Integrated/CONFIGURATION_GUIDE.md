# 📋 CODEX_V3_Integrated Configuration Deep Dive

**Last Updated:** 2026-01-20 20:13:37  
**Config File:** `codex-config.json`  
**Size:** 8,173 bytes

---

## Overview

The `codex-config.json` file is the central configuration for the CODEX V3 pipeline. It controls:
- Source scanning and filtering
- File routing and organization
- AI enrichment settings
- Clustering and similarity detection
- Output paths and metadata

---

## Configuration Sections

### 1. Global Settings

```json
{
  "DryRun": True,
  "OutputRoot": "E:\\CODEX_V3",
  "LogPath": "E:\\CODEX_V3\\logs\\run.log"
}
```

**DryRun:** 
- `true` = Simulation mode (no file operations)
- `false` = Production mode (actual file copying)
- **Default:** `true` for safety

**OutputRoot:** 
- Base directory for organized CODEX collection
- Default: `E:\CODEX_V3`
- All outputs created relative to this path

**LogPath:** 
- Location of operation logs
- Tracks all pipeline activities
- Essential for debugging

---

### 2. Sources Configuration

**Total Sources:** 0

The pipeline scans these source directories for files to organize:


### 3. Enrichment Configuration

The Enrichment section controls metadata extraction and enhancement:

#### FileInfo Extraction
- **Enable:** Automatic file metadata extraction
- **Fields:**
  - `name` - Filename
  - `size` - File size in bytes
  - `extension` - File type
  - `hash` - SHA256 checksum
  - `modified` - Last modification time
  - `created` - Creation time

#### Theme Detection
- **Enable:** Pattern-based theme classification
- **Patterns:** 50+ theme detection patterns
- **Examples:**
  - `obsidian|vault` → ObsidianVaults
  - `thoth church` → ThothChurch
  - `costume pattern|linen` → Costume_Making
  - `department of infinite noticing|din-` → DeptInfiniteNoticing

**Complete Theme Map:**


#### Snippet Extraction
- **Enable:** Extract small text snippets
- **Max Size:** 64 KB
- **Extensions:** .md, .txt, .rtf, .json, .yaml, .ps1, .sh, .py, .js, .ts
- **Output:** `E:\CODEX_V3\notes\Snippets`
- **Group By:** Theme

#### AI Enrichment (Optional)
- **Mode:** webhook
- **Endpoint:** http://127.0.0.1:8765
- **Batch Size:** 24 files per request
- **Fields Generated:**
  - `title` - Extracted/inferred title
  - `summary` - Brief content summary
  - `keywords` - Relevant keywords
  - `entities` - Named entities
  - `priority` - Importance score (0-10)
  - `fractal_path` - Suggested hierarchical location

---

### 4. PreRun Configuration

Stage 1 (PRE-RUN) analyzes files before organization:

#### General Settings
- **Enable:** True
- **Max Files:** 200,000
- **Max Text Bytes:** 1,048,576 (1 MB)

#### Similarity Detection
**Algorithm:** Shingle-based text similarity

- **Shingle Size:** 7 characters
- **Min Overlap (Jaccard):** 0.28 (28% similarity threshold)
- **SimHash Hamming:** 8 (for near-duplicate detection)

**How it works:**
```
1. Extract text from files
2. Generate character shingles (size 7)
3. Calculate Jaccard similarity between files
4. Identify clusters of similar content
5. Create SimHash fingerprints for deduplication
```

#### Clustering
- **Enable:** True
- **Min Cluster Size:** 3 files
- **Linkage Method:** single (connects clusters by closest pair)
- **Similarity Metric:** jaccard

**Output:** Clusters of related files for batch organization

#### Proposed Layout
- **Enable:** True
- **Apply Auto Layout:** True
- **Bucket Rules:** theme_first (prioritize theme-based routing)

**Generated File:** `metadata/proposed_layout.json`

---

### 5. Pipeline Stages

#### Stage 1: PRE-RUN
- **Enabled:** True
- **Script:** `.\scripts\pre-run\pre_run.ps1`
- **Purpose:** Analysis, clustering, AI enrichment

#### Stage 2: BUILD
- **Enabled:** True
- **Script:** `.\scripts\run-codex.ps1`
- **Purpose:** File copying, manifest generation, indexing

---

### 6. Routing Configuration

**Routing Precedence (in order):**

1. **fractal_path**
2. **themes**
3. **din_code**
4. **project**
5. **language**

#### Routing Flow
```
File enters pipeline
    │
    ├─→ Check for fractal_path (AI-suggested)
    │   └─→ Route to fractal location if present
    │
    ├─→ Check for themes (pattern matching)
    │   └─→ Route to theme bucket if matched
    │
    ├─→ Check for DIN code (pattern: DIN-###)
    │   └─→ Route to notes/DIN_Forms if matched
    │
    ├─→ Check for project classification
    │   └─→ Route to collection/{language}/{project}
    │
    └─→ Fallback to language-based routing
        └─→ Route to collection/{language}/_misc
```

#### FractalPath Routing
- **Enable:** True
- **Root:** E:\CODEX_V3
- **Default Leaf:** _unsorted

Fractal paths create hierarchical structures like:
```
collection/
  Text/
    Research/
      AI/
        MachineLearning/
          document.md
```

#### DIN Code Detection
- **Pattern:** `DIN-\d{{3,}}` (DIN- followed by 3+ digits)
- **Target:** `notes\DIN_Forms`
- **Examples:** DIN-001, DIN-042, DIN-1234

#### Theme Buckets

Complete theme routing map:

- **ObsidianVaults** → `notes\\Document\\Obsidian`
- **DeptInfiniteNoticing** → `notes\\Document\\DIN`
- **ThothChurch** → `notes\\Document\\Thoth`
- **BaldwinIV_Costume** → `notes\\Document\\Costume`
- **Jewish_Study_Ritual** → `notes\\Document\\Jewish`
- **Land_CCRU** → `notes\\Document\\Land_CCRU`
- **Aquaria** → `notes\\Document\\Aquaria`
- **CoreKernel** → `collection\\Text\\CoreKernel`

#### Fallback Routing

**Project Fallback:**  
`collection/{language}/{project}`

**Language Fallback:**  
`collection/{language}/_misc`

**Examples:**
- Python project → `collection/Python/MyProject/`
- Unknown Python file → `collection/Python/_misc/`
- Markdown with no theme → `collection/Text/_misc/`

---

### 7. Migration & Adapters

**Purpose:** Import data from legacy CODEX formats

**Adapters Available:**

#### LegacyManifestV1
- **Detection:** Look for `codex.manifest.json`
- **Reader Script:** `.\\scripts\\adapters\\read_legacy_manifest.ps1`
- **Purpose:** Convert legacy format to V3 structure

#### LegacyIndexV1
- **Detection:** Look for `INDEX.md`
- **Reader Script:** `.\\scripts\\adapters\\read_legacy_index.ps1`
- **Purpose:** Convert legacy format to V3 structure


---

## Configuration Best Practices

### Development vs Production

**Development (DryRun: true):**
- Test configuration changes safely
- Review proposed layouts before applying
- Validate routing rules
- No actual file operations

**Production (DryRun: false):**
- Execute actual file copying
- Apply all routing rules
- Generate manifests and indexes
- Create backups

### Tuning Similarity Detection

**ShingleSize:**
- Smaller (3-5): More sensitive, may over-cluster
- Larger (7-10): Less sensitive, cleaner clusters
- **Recommended:** 7

**MinOverlapJaccard:**
- Lower (0.1-0.2): Broader similarity matching
- Higher (0.3-0.5): Stricter similarity requirement
- **Recommended:** 0.28

**SimHashHamming:**
- Lower (4-6): Stricter duplicate detection
- Higher (8-12): More lenient near-duplicate detection
- **Recommended:** 8

### Adding Custom Themes

Edit the `Theme.Patterns` section:

```json
"your pattern here|alternate|keywords": "YourThemeName"
```

**Pattern Syntax:**
- `|` = OR operator
- `pattern1|pattern2` matches either pattern
- Case-insensitive matching
- Regex metacharacters supported

### Source Management

**Adding a New Source:**
```json
{{
  "id": "my_source",
  "paths": ["C:\\Path\\To\\Files"],
  "extensions": [".ext1", ".ext2"],
  "description": "What this source contains"
}}
```

**Best Practices:**
- Use descriptive IDs
- Include only necessary extensions
- Add helpful descriptions
- Test with DryRun first

---

## Configuration Reference

### Complete Field Index

| Section | Field | Type | Default | Description |
|---------|-------|------|---------|-------------|
| Global | DryRun | boolean | true | Simulation mode |
| Global | OutputRoot | string | E:\\CODEX_V3 | Output directory |
| Global | LogPath | string | E:\\CODEX_V3\\logs\\codex.log | Log file |
| Sources | id | string | - | Source identifier |
| Sources | paths | array | - | Directories to scan |
| Sources | extensions | array | - | File types to include |
| Enrichment.Theme | Enable | boolean | true | Theme detection |
| Enrichment.Theme | Patterns | object | {{}} | Theme patterns |
| Enrichment.AI | Enable | boolean | true | AI enrichment |
| Enrichment.AI | Endpoint | string | localhost:8765 | AI service URL |
| PreRun | MaxFiles | number | 200000 | Max files to process |
| PreRun.Similarity | ShingleSize | number | 7 | Shingle size |
| PreRun.Clustering | Enable | boolean | true | Cluster similar files |
| Routing | Enable | boolean | true | Apply routing |
| Routing | Precedence | array | - | Routing order |

---

## Troubleshooting

### Common Issues

**Issue:** Files not being routed correctly  
**Solution:** Check theme patterns, verify routing precedence

**Issue:** Too many/few clusters  
**Solution:** Adjust ShingleSize and MinOverlapJaccard

**Issue:** AI enrichment failing  
**Solution:** Ensure webhook stub is running at configured endpoint

**Issue:** Out of memory with large file sets  
**Solution:** Reduce MaxFiles or process in batches

### Validation

**Test Configuration:**
```powershell
# Parse config to check for syntax errors
$config = Get-Content -Raw codex-config.json | ConvertFrom-Json
Write-Host "Config valid!"
```

**Validate Paths:**
```powershell
$config.Sources | ForEach-Object {{
  $_.paths | ForEach-Object {{
    Test-Path $_ | Out-Host
  }}
}}
```

---

## Related Documentation

- [CODEX V3 Pipeline](../../../../../docs/CODEX_V3_PIPELINE.md)
- [Script Reference](#) (coming next)
- [CLI Tools](../../../../../docs/CLI_TOOLS.md)

---

*Configuration deep dive generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
