# CODEX V3 Pipeline - Complete User Guide

**A Practical Guide to Using the CODEX V3 Integrated Pipeline**

> "Catalog → Signatures → Clustering → Layout → Build"

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Understanding the Pipeline](#understanding-the-pipeline)
3. [Configuration Deep Dive](#configuration-deep-dive)
4. [Stage 1: Pre-Run (Catalog & Cluster)](#stage-1-pre-run-catalog--cluster)
5. [Stage 2: Build (Route & Organize)](#stage-2-build-route--organize)
6. [Working with Signatures](#working-with-signatures)
7. [Clustering Explained](#clustering-explained)
8. [Layout Generation](#layout-generation)
9. [Routing Rules](#routing-rules)
10. [Practical Examples](#practical-examples)
11. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- PowerShell 5.1+ (Windows) or PowerShell Core (cross-platform)
- Python 3.7+ (optional, for AI enrichment)
- CODEX-MONAD repository cloned

### 5-Minute Setup

```powershell
# 1. Navigate to CODEX-MONAD
cd ~/Documents/GitHub/CODEX-MONAD

# 2. Review configuration
notepad codex-config.json

# 3. Run Pre-Run (Stage 1)
.\scripts\pre-run\pre_run.ps1

# 4. Review proposed layout
notepad metadata\proposed_layout.json

# 5. Run Build (Stage 2)
.\scripts\run-codex.ps1

# 6. Check output
explorer E:\CODEX_V3
```

**Result:** Your files are cataloged, clustered by similarity, and organized into a structured layout.

---

## Understanding the Pipeline

### What is CODEX V3?

CODEX V3 is an **intelligent file organization system** that:

1. **Catalogs** - Scans your entire filesystem for relevant files
2. **Fingerprints** - Extracts content signatures (SimHash, shingles)
3. **Clusters** - Groups similar files together
4. **Routes** - Applies intelligent rules to determine where each file goes
5. **Builds** - Creates an organized, navigable collection

### Philosophy

> "The pipeline doesn't just copy files—it **understands relationships** and **preserves context**."

Key principles:
- **Content-aware:** Similarity based on actual content, not just filenames
- **Hierarchical:** Respects natural structure (fractal paths, themes)
- **Traceable:** Full audit trail from source to destination
- **Reversible:** DryRun mode for safe testing

### The Two-Stage Architecture

```
╔══════════════════════════════════════════════════════════╗
║  STAGE 1: PRE-RUN (Analysis)                            ║
╠══════════════════════════════════════════════════════════╣
║  Input:  Source directories + config                    ║
║  Process:                                                ║
║    1. Scan filesystem for matching files                ║
║    2. Extract text content from each file               ║
║    3. Calculate content signatures (SimHash)            ║
║    4. Build similarity matrix (shingles, Jaccard)       ║
║    5. Cluster similar files (hierarchical clustering)   ║
║    6. (Optional) AI enrichment for metadata             ║
║  Output: proposed_layout.json                           ║
╚══════════════════════════════════════════════════════════╝
                           ↓
╔══════════════════════════════════════════════════════════╗
║  STAGE 2: BUILD (Organization)                          ║
╠══════════════════════════════════════════════════════════╣
║  Input:  proposed_layout.json + routing rules           ║
║  Process:                                                ║
║    1. Read layout and configuration                     ║
║    2. Apply routing precedence rules                    ║
║    3. Determine destination path for each file          ║
║    4. Copy files to OutputRoot                          ║
║    5. Generate INDEX.md with metadata                   ║
║    6. Create codex.manifest.json                        ║
║    7. Build core-kernel modules manifest                ║
║    8. Create backup ZIP                                 ║
║  Output: Organized CODEX_V3 directory                   ║
╚══════════════════════════════════════════════════════════╝
```

---

## Configuration Deep Dive

### codex-config.json Structure

Located at: `codex-config.json` (root of CODEX-MONAD repo)

#### Essential Settings

```json
{
  "OutputRoot": "E:\\CODEX_V3",
  "DryRun": true,
  "LogPath": "E:\\CODEX_V3\\logs\\codex.log"
}
```

| Setting | Type | Purpose |
|---------|------|---------|
| `OutputRoot` | string | Where organized files go (e.g., `E:\CODEX_V3`) |
| `DryRun` | boolean | `true` = test mode (no file operations), `false` = execute |
| `LogPath` | string | Location for detailed operation log |

**⚠️ Always start with `"DryRun": true` to test your configuration!**

#### Source Definitions

```json
{
  "ReadOnlySources": [
    {
      "name": "E_RAID_ARCHIVE",
      "paths": ["E:\\"]
    }
  ],
  "WritableSources": [
    {
      "name": "C_USER",
      "paths": ["C:\\Users\\"]
    }
  ]
}
```

**ReadOnlySources:**
- Archives, backups, external drives
- Pipeline won't modify these
- Safe to scan without risk

**WritableSources:**
- Active working directories
- Pipeline can organize these
- Be careful—files will be moved!

#### File Filtering

```json
{
  "IncludeExtensions": [
    ".md", ".txt", ".pdf",           // Documents
    ".py", ".js", ".ps1",            // Scripts
    ".json", ".yaml", ".toml"        // Config
  ],
  "ExcludePaths": [
    "**\\node_modules\\**",       // Dependency dirs
    "**\\.git\\**",               // Version control
    "**\\venv\\**",               // Python envs
    "**\\AppData\\**"             // OS files
  ]
}
```

**Pro Tip:** Start with a narrow set of extensions, then expand once you trust the pipeline.

#### Always Include Paths

```json
{
  "AlwaysIncludePaths": [
    "C:\\**\\CODEX 0\\",
    "C:\\**\\Obsidian COLLECTED CODEX DOCS\\",
    "E:\\**\\Old Archive 2021\\Coding\\"
  ]
}
```

These paths are scanned **regardless of exclude rules**. Use for:
- Critical directories
- Known valuable collections
- Project-specific paths

---

## Stage 1: Pre-Run (Catalog & Cluster)

### Purpose

Stage 1 **analyzes without modifying** anything. It:
- Discovers all matching files
- Extracts content for similarity analysis
- Clusters similar files together
- Proposes an organized layout

### Running Pre-Run

```powershell
# Navigate to repo
cd ~/Documents/GitHub/CODEX-MONAD

# Execute Pre-Run
.\scripts\pre-run\pre_run.ps1

# Monitor progress
# Output shows:
#   - Files scanned
#   - Signatures calculated
#   - Clusters formed
#   - Layout proposed
```

### What Pre-Run Does

#### 1. File Discovery
Scans all source paths, respecting:
- Include/exclude extensions
- Path exclusions
- Always-include overrides

**Output:** List of candidate files

#### 2. Content Extraction
Reads each file and extracts text:
- Plain text files: Direct read
- PDF: Text extraction (if available)
- Code files: Comments + structure
- Markdown: Full content

**Output:** Content dictionary per file

#### 3. Signature Calculation

**SimHash:**
```
File A: "The quick brown fox jumps..."
  → Shingles: ["The quick", "quick brown", "brown fox", ...]
  → Hash each shingle
  → Combine into 64-bit SimHash
  → Result: 0x1A2B3C4D5E6F7890
```

**Purpose:** 
- Fast similarity detection
- Hamming distance < threshold = similar
- Deduplication of near-identical files

**Shingles:**
```
Input: "The quick brown fox"
Shingle size: 3 words
Output: [
  "The quick brown",
  "quick brown fox"
]
```

**Purpose:**
- Content fingerprinting
- Jaccard similarity calculation
- Cluster formation

#### 4. Similarity Matrix

For each pair of files, calculate:
```
Similarity(A, B) = Jaccard(Shingles(A), Shingles(B))

Jaccard = |Intersection| / |Union|

Example:
  File A shingles: {1, 2, 3, 4, 5}
  File B shingles: {3, 4, 5, 6, 7}
  Intersection: {3, 4, 5} → 3 items
  Union: {1, 2, 3, 4, 5, 6, 7} → 7 items
  Jaccard = 3/7 = 0.43 (43% similar)
```

**Output:** N×N similarity matrix

#### 5. Hierarchical Clustering

```
Algorithm: Single-linkage clustering
Threshold: 0.4 (configurable)

Process:
1. Each file starts as its own cluster
2. Find most similar pair of clusters
3. Merge if similarity > threshold
4. Repeat until no more merges possible

Result:
  Cluster 1: [fileA, fileB, fileC] - "React tutorials"
  Cluster 2: [fileD, fileE]        - "Python scripts"
  Cluster 3: [fileF]               - "Singleton document"
```

**Linkage Methods:**
- **Single:** Min distance between clusters (loose grouping)
- **Complete:** Max distance (tight grouping)
- **Average:** Mean distance (balanced)

**Configuration:**
```json
{
  "Clustering": {
    "Enable": true,
    "Method": "single",
    "Threshold": 0.4,
    "ShingleSize": 5
  }
}
```

#### 6. AI Enrichment (Optional)

If enabled, calls OpenAI/Claude to:
```python
For each file:
  - Extract title (if not clear from filename)
  - Generate keywords (3-10 key terms)
  - Assign theme (from predefined list)
  - Suggest priority (1-10 importance)
  - Propose fractal path (hierarchical location)
```

**Example AI Output:**
```json
{
  "file": "react-hooks-guide.md",
  "ai_metadata": {
    "title": "Complete Guide to React Hooks",
    "keywords": ["react", "hooks", "useEffect", "useState", "frontend"],
    "theme": "programming/web-development",
    "priority": 7,
    "fractal_path": "Code/Web/React/Guides"
  }
}
```

### Output: proposed_layout.json

```json
{
  "metadata": {
    "generated": "2026-01-20T21:30:00Z",
    "total_files": 1247,
    "clusters": 89,
    "ai_enriched": true
  },
  "files": [
    {
      "id": "file_001",
      "source_path": "C:\Users\...\react-tutorial.md",
      "signature": {
        "simhash": "0x1A2B...",
        "shingles": 125,
        "size_bytes": 4567
      },
      "cluster_id": "cluster_023",
      "ai_metadata": {
        "title": "React Tutorial",
        "keywords": ["react", "jsx", "components"],
        "theme": "programming",
        "fractal_path": "Code/Web/React"
      },
      "proposed_dest": "E:\CODEX_V3\Code\Web\React\react-tutorial.md"
    }
  ],
  "clusters": [
    {
      "id": "cluster_023",
      "theme": "programming/react",
      "file_count": 12,
      "avg_similarity": 0.67,
      "members": ["file_001", "file_002", ...]
    }
  ]
}
```

**Key Fields:**
- `source_path`: Original location
- `signature`: Content fingerprint
- `cluster_id`: Which cluster it belongs to
- `proposed_dest`: Where Stage 2 will place it
- `ai_metadata`: Optional enrichment data

---

## Stage 2: Build (Route & Organize)

### Purpose

Stage 2 **executes the plan** from Stage 1. It:
- Reads proposed_layout.json
- Applies routing rules
- Copies/moves files to OutputRoot
- Generates manifests and indexes

### Running Build

```powershell
# With DryRun enabled (test mode)
.\scripts\run-codex.ps1

# Actual execution (disable DryRun first!)
# Edit codex-config.json: "DryRun": false
.\scripts\run-codex.ps1
```

### Routing Precedence

The pipeline uses a **precedence chain** to determine file destination:

```
1. fractal_path (AI-suggested hierarchy)
   ↓ if not available
2. themes (category-based buckets)
   ↓ if not matched
3. din_code (DIN form detection)
   ↓ if not detected
4. project (project affiliation)
   ↓ if not identified
5. language (file extension fallback)
   ↓
Final: default bucket (Unsorted/)
```

#### 1. Fractal Path (Highest Priority)

**Source:** AI enrichment

**Example:**
```json
{
  "fractal_path": "Code/Web/React/Hooks/Advanced"
}
→ OutputRoot/Code/Web/React/Hooks/Advanced/file.md
```

**When used:**
- AI enrichment enabled
- File has clear hierarchical context
- Path suggestion is confident

#### 2. Theme Buckets

**Source:** Theme detection or AI classification

**Configuration:**
```json
{
  "ThemeBuckets": {
    "programming": "Code",
    "documentation": "Docs",
    "legal": "Legal/Forms",
    "personal": "Personal/Notes"
  }
}
```

**Example:**
```json
{
  "theme": "programming"
}
→ OutputRoot/Code/file.py
```

#### 3. DIN Code Detection

**Source:** Pattern matching in filename/content

**Patterns:**
```
N-PLE-OMEGA-*       → Legal/Forms/PLE/
N-PNEP-INFINITY-*   → Legal/Forms/PNEP/
QHFMV-QS-*          → Legal/Forms/QHFMV/
```

**Example:**
```
Filename: "N-PLE-OMEGA-signed.pdf"
→ OutputRoot/Legal/Forms/PLE/N-PLE-OMEGA-signed.pdf
```

#### 4. Project Affiliation

**Source:** Directory structure analysis

**Example:**
```
Source: C:\Projects\MyApp\src\main.py
Project detected: MyApp
→ OutputRoot/Projects/MyApp/src/main.py
```

#### 5. Language/Extension Fallback

**Source:** File extension

**Example:**
```
File: unknown_script.py
No other routing matched
→ OutputRoot/Code/Python/unknown_script.py
```

### File Operations

```powershell
# DryRun = true
Copy-Item (simulated)
  Source: C:\...\file.md
  Dest:   E:\CODEX_V3\Code\file.md
  Status: WOULD COPY (not executed)

# DryRun = false
Copy-Item (executed)
  Source: C:\...\file.md
  Dest:   E:\CODEX_V3\Code\file.md
  Status: COPIED
  Verified: Hash match ✓
```

**Safety Features:**
- Hash verification after copy
- Collision detection (duplicate filenames)
- Metadata preservation (timestamps, attributes)
- Audit logging (every operation logged)

### Generated Outputs

#### 1. INDEX.md

**Location:** `OutputRoot/INDEX.md`

**Content:**
```markdown
# CODEX V3 Collection Index

Generated: 2026-01-20 21:45:00

## Statistics
- Total Files: 1,247
- Total Size: 3.4 GB
- Clusters: 89
- Themes: 12

## Directory Structure
- Code/ (487 files)
  - Web/ (203 files)
    - React/ (56 files)
    - Vue/ (34 files)
  - Python/ (187 files)
- Docs/ (312 files)
- Legal/ (89 files)

## Recent Additions
- 2026-01-20: react-hooks-advanced.md (Code/Web/React/)
- 2026-01-20: python-decorator-guide.py (Code/Python/)

## Clusters
### Cluster: programming/react (12 files)
- react-tutorial.md
- hooks-explained.md
- ...
```

#### 2. codex.manifest.json

**Location:** `OutputRoot/codex.manifest.json`

**Content:**
```json
{
  "version": "3.0.0",
  "generated": "2026-01-20T21:45:00Z",
  "statistics": {
    "total_files": 1247,
    "total_size_bytes": 3654873216,
    "clusters": 89
  },
  "files": [
    {
      "relative_path": "Code/Web/React/hooks.md",
      "source": "C:\Users\...\hooks.md",
      "size": 4567,
      "hash": "sha256:abc123...",
      "cluster": "cluster_023",
      "theme": "programming",
      "added": "2026-01-20T21:45:00Z"
    }
  ]
}
```

#### 3. Backup Archive

**Location:** `OutputRoot/backups/codex_v3_YYYYMMDD_HHMMSS.zip`

**Contents:**
- All organized files
- INDEX.md
- codex.manifest.json
- Configuration snapshot

---

## Working with Signatures

### What are Signatures?

**Signatures** = Content fingerprints for similarity detection

### SimHash Explained

```
Algorithm:
1. Extract text from file
2. Create shingles (overlapping n-grams)
3. Hash each shingle with MD5/SHA
4. Combine hashes using bit voting:
   - For each bit position (0-63):
     - If majority of shingles have 1 → set to 1
     - If majority have 0 → set to 0
5. Result: 64-bit fingerprint

Properties:
- Similar content → similar SimHash
- Hamming distance measures difference
- Fast comparison (bitwise XOR)
```

**Example:**
```python
File A: "The quick brown fox"
SimHash: 0x1A2B3C4D5E6F7890

File B: "The quick brown dog" (one word changed)
SimHash: 0x1A2B3C4D5E6F7891

Hamming distance = 1 bit difference
→ Very similar!
```

### Shingles Explained

```
Input: "The quick brown fox jumps over"
Shingle size: 3 words

Shingles:
1. "The quick brown"
2. "quick brown fox"
3. "brown fox jumps"
4. "fox jumps over"

Purpose:
- Capture word sequences
- Preserve local context
- Enable similarity matching
```

**Configuration:**
```json
{
  "ShingleSize": 5,  // 5-word windows
  "ShingleStep": 1   // Shift by 1 word each time
}
```

**Trade-offs:**
- Larger shingles = more specific, fewer matches
- Smaller shingles = more general, more matches

### Similarity Calculation

```python
def jaccard_similarity(file_a, file_b):
    shingles_a = set(extract_shingles(file_a))
    shingles_b = set(extract_shingles(file_b))
    
    intersection = shingles_a & shingles_b
    union = shingles_a | shingles_b
    
    return len(intersection) / len(union)

# Example:
# File A: 100 shingles
# File B: 120 shingles
# Shared: 60 shingles
# Union: 160 unique shingles
# Similarity = 60/160 = 0.375 (37.5%)
```

---

## Clustering Explained

### Why Cluster?

**Problem:** 1,000 files scattered across 50 directories.

**Goal:** Group similar files together automatically.

**Solution:** Hierarchical clustering based on content similarity.

### Clustering Algorithm

```
1. Start: Each file is its own cluster
   [A] [B] [C] [D] [E] [F]

2. Calculate pairwise similarity
   A-B: 0.8
   A-C: 0.3
   B-C: 0.7
   ...

3. Merge most similar (A-B = 0.8)
   [AB] [C] [D] [E] [F]

4. Recalculate similarities with new cluster
   AB-C: max(A-C, B-C) = 0.7 (single linkage)
   AB-D: ...

5. Merge next highest (AB-C = 0.7)
   [ABC] [D] [E] [F]

6. Repeat until threshold
   Final clusters:
   [ABC] [DE] [F]
```

### Linkage Methods

#### Single Linkage (Loose)
```
Distance(Cluster1, Cluster2) = MIN(all pairwise distances)

Result: Large, loose clusters
Use case: Exploratory grouping
```

#### Complete Linkage (Tight)
```
Distance(Cluster1, Cluster2) = MAX(all pairwise distances)

Result: Small, tight clusters
Use case: Strict categorization
```

#### Average Linkage (Balanced)
```
Distance(Cluster1, Cluster2) = AVERAGE(all pairwise distances)

Result: Moderate clusters
Use case: General purpose
```

### Threshold Selection

```json
{
  "Threshold": 0.4
}
```

| Threshold | Effect |
|-----------|--------|
| 0.2 | Very loose - many large clusters |
| 0.4 | **Balanced** (recommended) |
| 0.6 | Tight - many small clusters |
| 0.8 | Very tight - mostly singletons |

**How to choose:**
1. Start with 0.4
2. Run Pre-Run
3. Review proposed_layout.json
4. Adjust if clusters too large/small

---

## Layout Generation

### How Layout is Proposed

```
For each file:
  1. Check fractal_path (if AI enriched)
     → Use if confident
  
  2. Check theme classification
     → Map to theme bucket
  
  3. Check DIN code pattern
     → Route to Legal/Forms/[type]/
  
  4. Check project affiliation
     → Route to Projects/[name]/
  
  5. Check file extension
     → Route to Code/[language]/
  
  6. Default: Unsorted/
```

### Fractal Paths Explained

**Concept:** AI suggests **hierarchical location** based on content analysis.

**Example:**
```
File: "react-hooks-useEffect-guide.md"

AI Analysis:
  Topic: React Hooks
  Specific: useEffect hook
  Type: Tutorial/Guide
  
Fractal Path: "Code/Web/React/Hooks/useEffect/Guides"

Reasoning:
  Code → Web → React → Hooks → useEffect → Guides
  (General → Specific)
```

**Benefits:**
- Intuitive navigation
- Preserves conceptual hierarchy
- Scalable to any depth

### Theme Buckets

**Predefined categories:**
```json
{
  "programming": "Code",
  "documentation": "Docs",
  "legal": "Legal/Forms",
  "research": "Research",
  "personal": "Personal",
  "business": "Business",
  "media": "Media"
}
```

**Custom Buckets:**
```json
// tools/ThemeMaps.personal.json
{
  "ai_research": "Research/AI",
  "codex_docs": "CODEX/Documentation",
  "scripts_automation": "Code/Automation"
}
```

---

## Routing Rules

### Rule Precedence

Rules are evaluated in order:

```
1. FRACTAL_PATH (highest priority)
2. THEMES
3. DIN_CODE
4. PROJECT
5. LANGUAGE
6. DEFAULT (Unsorted/)
```

**First match wins.** Lower rules only apply if higher rules don't match.

### Custom Routing

**Edit:** `codex-config.json`

```json
{
  "Routing": {
    "Enable": true,
    "Precedence": ["fractal_path", "themes", "din_code"],
    
    "CustomRules": [
      {
        "pattern": "**obsidian**",
        "destination": "Notes/Obsidian/"
      },
      {
        "pattern": "*.sql",
        "destination": "Code/SQL/"
      }
    ]
  }
}
```

### DIN Code Patterns

**Built-in patterns:**
```
N-PLE-OMEGA       → Legal/Forms/PLE/
N-PNEP-INFINITY   → Legal/Forms/PNEP/
QHFMV-QS          → Legal/Forms/QHFMV/
```

**Add custom:**
```json
{
  "DIN": {
    "Patterns": {
      "CUSTOM-FORM-*": "Legal/Forms/Custom/"
    }
  }
}
```

---

## Practical Examples

### Example 1: Organize Code Projects

**Goal:** Catalog all Python and JavaScript projects.

**Config:**
```json
{
  "OutputRoot": "E:\\CODEX_V3",
  "DryRun": true,
  "Sources": [
    {
      "name": "projects",
      "paths": ["C:\\Users\\...\\Projects"]
    }
  ],
  "IncludeExtensions": [".py", ".js", ".md", ".json"],
  "ExcludePaths": ["**\\node_modules\\**", "**\\venv\\**"]
}
```

**Workflow:**
```powershell
# 1. Run Pre-Run
.\scripts\pre-run\pre_run.ps1

# 2. Review clusters
notepad metadata\proposed_layout.json
# Expect clusters like:
#   - Django projects
#   - React apps
#   - Utility scripts

# 3. Run Build
.\scripts\run-codex.ps1

# 4. Check output
ls E:\CODEX_V3\Code\
# Should see Python/, JavaScript/, etc.
```

### Example 2: Archive Legal Documents

**Goal:** Organize all DIN forms and legal PDFs.

**Config:**
```json
{
  "OutputRoot": "E:\\CODEX_V3",
  "Sources": [
    {
      "name": "legal",
      "paths": ["C:\\Users\\...\\Documents\\Legal"]
    }
  ],
  "IncludeExtensions": [".pdf", ".docx"],
  "Routing": {
    "Precedence": ["din_code", "themes"]
  }
}
```

**Result:**
```
E:\CODEX_V3\Legal\Forms\
  PLE/
    N-PLE-OMEGA-signed.pdf
    N-PLE-OMEGA-draft.pdf
  PNEP/
    N-PNEP-INFINITY-v1.pdf
  QHFMV/
    QHFMV-QS-final.pdf
```

### Example 3: Migrate Obsidian Vault

**Goal:** Import Obsidian notes into CODEX structure.

**Config:**
```json
{
  "AlwaysIncludePaths": [
    "C:\\**\\Obsidian Vault\\**"
  ],
  "Routing": {
    "CustomRules": [
      {
        "pattern": "**obsidian**",
        "destination": "Notes/Obsidian/"
      }
    ]
  }
}
```

**AI Enrichment:**
Enable AI to:
- Detect note topics
- Extract keywords from frontmatter
- Suggest categorization

---

## Troubleshooting

### Problem: Pre-Run is Slow

**Symptoms:**
- Takes hours to complete
- Memory usage high

**Solutions:**

1. **Reduce scope:**
```json
{
  "IncludeExtensions": [".md", ".txt"],  // Fewer types
  "ExcludePaths": ["**\\node_modules\\**"]  // More exclusions
}
```

2. **Disable AI enrichment:**
```json
{
  "AI": {
    "Enable": false
  }
}
```

3. **Limit shingle calculation:**
```json
{
  "Clustering": {
    "ShingleSize": 3  // Smaller = faster
  }
}
```

### Problem: Files Not Clustering as Expected

**Symptoms:**
- Many singleton clusters
- Unrelated files grouped together

**Diagnosis:**

```powershell
# Check similarity threshold
# In codex-config.json:
{
  "Clustering": {
    "Threshold": 0.4  // Try 0.3 for looser clustering
  }
}
```

**Solutions:**

1. **Adjust threshold:**
   - Too many singletons? Lower threshold (0.3)
   - Too many mixed clusters? Raise threshold (0.5)

2. **Change linkage method:**
```json
{
  "Clustering": {
    "Method": "average"  // Try average instead of single
  }
}
```

3. **Increase shingle size:**
```json
{
  "Clustering": {
    "ShingleSize": 7  // Larger = more specific matching
  }
}
```

### Problem: Wrong Routing

**Symptoms:**
- Files going to wrong destinations
- Expected fractal path not used

**Check:**

1. **Routing precedence:**
```json
{
  "Routing": {
    "Precedence": ["fractal_path", "themes", "din_code"]
  }
}
```

2. **AI enrichment enabled:**
```json
{
  "AI": {
    "Enable": true  // Must be true for fractal paths
  }
}
```

3. **Review proposed_layout.json:**
```powershell
# Check what was proposed:
Select-String "proposed_dest" metadata\proposed_layout.json
```

### Problem: Build Fails

**Symptoms:**
- Error during run-codex.ps1
- Files not copied

**Common Causes:**

1. **DryRun still enabled:**
```json
{
  "DryRun": false  // Must be false to execute
}
```

2. **OutputRoot doesn't exist:**
```powershell
# Create directory first:
New-Item -Path "E:\CODEX_V3" -ItemType Directory -Force
```

3. **Permission issues:**
```powershell
# Run PowerShell as Administrator
# Or check file permissions
```

4. **Disk space:**
```powershell
# Check available space:
Get-PSDrive E
```

---

## Advanced Usage

### Custom AI Prompts

**Edit:** AI enrichment prompts

```json
{
  "AI": {
    "Prompts": {
      "theme": "Classify this document into one of: programming, legal, research, personal, business",
      "fractal_path": "Suggest a hierarchical path (max 5 levels) for organizing this content"
    }
  }
}
```

### Batch Processing

**Multiple configurations:**

```powershell
# Process different source sets
.\scripts\run-codex.ps1 -Config codex-config-code.json
.\scripts\run-codex.ps1 -Config codex-config-legal.json
.\scripts\run-codex.ps1 -Config codex-config-notes.json
```

### Incremental Updates

```json
{
  "IncrementalMode": true,  // Only process new/changed files
  "BaselineManifest": "E:\\CODEX_V3\\codex.manifest.json"
}
```

---

## Summary

### Key Concepts Recap

| Concept | What | Why |
|---------|------|-----|
| **Catalog** | Scan and discover files | Know what you have |
| **Signatures** | SimHash + shingles | Detect similarity |
| **Clustering** | Group similar content | Find relationships |
| **Layout** | Propose organization | Plan before execution |
| **Routing** | Apply precedence rules | Smart placement |
| **Build** | Execute the plan | Organized collection |

### The CODEX V3 Workflow

```
Configure → Pre-Run → Review → Build → Verify

🔧 Edit codex-config.json
    ↓
🔍 Run pre_run.ps1 (catalog, cluster, layout)
    ↓
📋 Review proposed_layout.json
    ↓
🏗️  Run run-codex.ps1 (route, organize, build)
    ↓
✅ Verify INDEX.md and manifest
```

### Next Steps

1. **Start small:** Test with a single directory
2. **Use DryRun:** Always test before executing
3. **Review clusters:** Check if grouping makes sense
4. **Iterate:** Adjust configuration based on results
5. **Backup:** Keep original sources safe

---

## See Also

- [CODEX_V3_PIPELINE.md](CODEX_V3_PIPELINE.md) - Technical reference
- [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md) - System architecture
- [CLI-REFERENCE.md](CLI-REFERENCE.md) - Command documentation

---

**Questions? Issues?**
- Check logs: `E:\CODEX_V3\logs\codex.log`
- Review proposed_layout.json for insights
- Start with DryRun to experiment safely
