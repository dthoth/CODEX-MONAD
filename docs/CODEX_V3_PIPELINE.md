# CODEX_V3_Integrated Pipeline Documentation

**Last Updated:** 2026-01-20  
**Location:** `apps/codex_monad/Tools/CODEX_V3_Integrated/CODEX_V3_Integrated/`

## Overview

CODEX_V3_Integrated is a two-stage pipeline for organizing, enriching, and archiving files from multiple sources into a structured CODEX knowledge base.

### Purpose

The pipeline:
1. **Scans** specified source directories for files
2. **Clusters** similar files using content analysis
3. **Enriches** metadata using AI (optional)
4. **Routes** files to appropriate destinations based on themes, projects, and fractal paths
5. **Creates** comprehensive indexes and manifests
6. **Backs up** the organized collection

---

## Architecture

### Two-Stage Design

```
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: PRE-RUN                                          │
│  ────────────────────────────────────────────────────────  │
│  • Scan source directories                                 │
│  • Extract text content                                    │
│  • Calculate similarity (shingle/SimHash)                  │
│  • Cluster similar files                                   │
│  • Generate proposed_layout.json                           │
│  • Optional: AI enrichment (themes, keywords, paths)       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: BUILD                                            │
│  ────────────────────────────────────────────────────────  │
│  • Read configuration and proposed layout                  │
│  • Apply routing rules (fractal → theme → DIN → project)   │
│  • Copy files to OutputRoot                                │
│  • Generate INDEX.md with all metadata                     │
│  • Create codex.manifest.json                              │
│  • Build core-kernel modules manifest                      │
│  • Create backup ZIP                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuration

The pipeline is controlled by `codex-config.json`:

### Key Configuration Sections

#### 1. Global Settings
```json
{
  "DryRun": true,
  "OutputRoot": "E:\\CODEX_V3",
  "LogPath": "E:\\CODEX_V3\\logs\\codex.log"
}
```

#### 2. Sources
Define directories to scan:
```json
{
  "Sources": [
    {
      "id": "downloads",
      "paths": ["C:\\Users\\...\\Downloads"],
      "extensions": [".pdf", ".txt", ".md", ...]
    }
  ]
}
```

#### 3. Routing
Precedence: **fractal_path → themes → DIN → project → language**

```json
{
  "Routing": {
    "Enable": true,
    "Precedence": ["fractal_path", "themes", "din_code", "project", "language"],
    "FractalPath": {...},
    "DIN": {...},
    "ThemeBuckets": {...}
  }
}
```

#### 4. AI Enrichment (Optional)
```json
{
  "AI": {
    "Enable": true,
    "Mode": "webhook",
    "Endpoint": "http://127.0.0.1:8765",
    "Fields": ["title", "summary", "keywords", "entities", "priority", "fractal_path"]
  }
}
```

---

## Scripts & Modules

### PowerShell Scripts

#### `scripts/pre-run/pre_run.ps1`
**Stage 1: Analysis & Clustering**

- Scans all configured sources
- Extracts text content
- Calculates file similarity
- Clusters related files
- Generates `proposed_layout.json`
- Optionally enriches with AI metadata

**Run:**
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1
```

---

#### `scripts/run-codex.ps1`
**Stage 2: Build & Deploy**

- Applies routing rules
- Copies files to OutputRoot
- Generates INDEX.md
- Creates manifest
- Builds backup

**Run:**
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1
```

---

### PowerShell Modules

#### `codex-tools.psm1`
Core utility functions:
- `Get-CodexCandidates` - Scan and filter files
- `New-CodexManifest` - Build manifest data
- `Copy-CodexFiles` - Handle file operations
- `New-CodexIndexMarkdown` - Generate INDEX.md
- `New-CoreKernelModuleManifest` - Create module manifest
- `New-CodexBackupZip` - Create backup archive

#### `codex-router.psm1`
Routing logic:
- Theme-based routing
- Fractal path routing
- DIN code detection
- Project/language fallbacks

#### `codex-meta.psm1`
Metadata handling:
- AI enrichment integration
- Metadata extraction
- Schema validation

---

## Outputs

### Directory Structure
```
E:\CODEX_V3/
├── collection/          # Organized files by project/language
│   ├── Text/
│   ├── Code/
│   └── Media/
├── notes/               # Notes, DIN forms, documents
│   ├── DIN_Forms/
│   ├── Document/
│   └── Snippets/
├── metadata/            # Manifests and indexes
│   ├── codex.manifest.json
│   ├── proposed_layout.json
│   └── INDEX.md
├── core-kernel/         # Module system
│   └── codex.modules.json
├── logs/                # Operation logs
└── _backups/            # Timestamped backups
```

### Generated Files

#### `metadata/INDEX.md`
Comprehensive markdown index with columns:
- Filename
- Relative Path
- Size
- Extensions
- Themes
- Tags
- Priority

#### `metadata/codex.manifest.json`
JSON manifest with all file metadata:
```json
[
  {
    "file": "document.md",
    "path": "notes/Document/document.md",
    "size": 1024,
    "hash": "sha256...",
    "themes": ["research", "notes"],
    "tags": ["important"],
    "fractal_path": "collection/Text/Research"
  }
]
```

#### `core-kernel/codex.modules.json`
Module system manifest for core-kernel integration

---

## Workflow

### Full Pipeline Execution

1. **Configure** `codex-config.json`
   - Set OutputRoot
   - Define Sources
   - Configure routing rules
   - Enable/disable AI enrichment

2. **Run PRE-RUN** (Stage 1)
   ```powershell
   .\scripts\pre-run\pre_run.ps1
   ```
   - Generates `proposed_layout.json`
   - Creates similarity clusters
   - Optionally enriches with AI

3. **Review** proposed layout (optional)
   - Check `metadata/proposed_layout.json`
   - Adjust if needed

4. **Run BUILD** (Stage 2)
   ```powershell
   .\scripts\run-codex.ps1
   ```
   - Applies routing
   - Copies files
   - Generates manifests

5. **Verify** outputs
   - Check INDEX.md
   - Review manifest
   - Verify file organization

---

## Features

### ✨ Intelligent Clustering
- **Shingle-based similarity** (configurable size)
- **SimHash for deduplication** (Hamming distance)
- **Jaccard similarity** for overlap detection
- **Hierarchical clustering** (single/complete/average linkage)

### 🎯 Flexible Routing
- **Fractal paths** - AI-suggested hierarchical organization
- **Theme buckets** - Category-based routing
- **DIN code detection** - Pattern matching for forms
- **Project/language fallback** - Automatic categorization

### 🤖 AI Enrichment (Optional)
- **Title extraction** - Smart title detection
- **Keyword generation** - Automatic tagging
- **Theme classification** - Content categorization
- **Priority scoring** - Importance ranking
- **Fractal path suggestion** - Hierarchical placement

### 📦 Migration Support
- **Legacy adapter system** - Import old CODEX formats
- **Manifest v1 reader** - Parse previous manifests
- **INDEX.md reader** - Import markdown indexes

---

## Advanced Usage

### DryRun Mode
Set `"DryRun": true` in config to test without file operations:
- Logs all operations
- Doesn't copy/move files
- Safe for testing configuration

### Custom Theme Maps
Create `tools/ThemeMaps.personal.json` for custom routing:
```json
{
  "obsidian_vault": "notes/Document/Obsidian",
  "research_papers": "collection/Text/Research",
  "code_projects": "collection/Code/Projects"
}
```

### AI Webhook Integration
The AI stub accepts POST requests with file content and returns enriched metadata.

**Stub location:** `tools/ai_webhook_stub.py`

---

## Dependencies

### PowerShell Requirements
- PowerShell 5.1 or higher
- Modules defined in scripts (imported automatically)

### Optional Python Dependencies
- Python 3.7+ (for AI webhook stub)
- No external packages required for basic stub

---

## Troubleshooting

### Common Issues

**Issue:** Files not being routed correctly  
**Solution:** Check routing precedence in config, verify theme buckets

**Issue:** AI enrichment not working  
**Solution:** Ensure webhook stub is running at configured endpoint

**Issue:** Permission errors  
**Solution:** Run PowerShell as Administrator, check E:\ drive access

**Issue:** Config not found  
**Solution:** Verify `codex-config.json` exists in CODEX_V3_Integrated root

---

## Integration with CODEX-MONAD

The V3 pipeline integrates with the broader CODEX ecosystem:

- **Input:** Scans downloads, documents, project files
- **Processing:** Organizes and enriches content
- **Output:** Structured knowledge base for apps to consume
- **Apps:** DIN Portal, PolyWrite, Pearl can access organized content

---

## Development Notes

### Extending Routing
Add new routing rules in `codex-router.psm1`:
1. Define pattern matching logic
2. Add to routing precedence
3. Update config schema
4. Document in README

### Custom Enrichment
Modify `ai_webhook_stub.py` or create new enrichment endpoints:
1. Accept POST with file content
2. Return JSON with metadata fields
3. Configure endpoint in `codex-config.json`

---

## Related Documentation

- [Core Install Documentation](../../Core_Install/README.md)
- [Main CODEX Apps Catalog](../../../../docs/APPS_CATALOG.md)
- [Architecture Overview](../../../../docs/ARCHITECTURE.md)

---

*Documentation generated by CODEX Documentation Mission*  
*Part of CODEX-MONAD v1.0.0*
