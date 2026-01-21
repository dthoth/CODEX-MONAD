# 🔧 CODEX_V3_Integrated

**A Two-Stage File Organization and Enrichment Pipeline**

---

## Overview

CODEX_V3_Integrated is a PowerShell-based pipeline that:
- **Scans** source directories for files
- **Clusters** similar content using advanced algorithms
- **Enriches** metadata with AI (optional)
- **Routes** files based on themes, projects, and patterns
- **Organizes** into a structured knowledge base
- **Indexes** and backs up the collection

---

## Quick Links

📚 **Documentation:**
- [Configuration Guide](CONFIGURATION_GUIDE.md) - Complete config reference
- [Scripts Reference](SCRIPTS_REFERENCE.md) - All scripts documented
- [Modules Reference](MODULES_REFERENCE.md) - PowerShell modules
- [Usage Examples](USAGE_EXAMPLES.md) - Practical tutorials
- [Original README](README.md) - Quick reference

🔗 **External:**
- [CODEX V3 Pipeline Overview](../../../../../docs/CODEX_V3_PIPELINE.md)
- [CLI Tools Reference](../../../../../docs/CLI_TOOLS.md)

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  STAGE 1: PRE-RUN (Analysis & Clustering)               │
│  ──────────────────────────────────────────────────────  │
│  • Scan sources                                          │
│  • Build signatures (SimHash)                            │
│  • Cluster similar files                                 │
│  • Generate proposed_layout.json                         │
│  • Optional: AI enrichment                               │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│  STAGE 2: BUILD (Organization & Deployment)             │
│  ──────────────────────────────────────────────────────  │
│  • Load configuration & layout                           │
│  • Apply routing (fractal → theme → DIN → project)       │
│  • Copy files to OutputRoot                              │
│  • Generate INDEX.md & manifest                          │
│  • Create backup ZIP                                     │
└──────────────────────────────────────────────────────────┘
```

---

## Components

### PowerShell Modules (24,768 bytes)
- **codex-tools.psm1** (15,582 bytes) - Core utilities
- **codex-router.psm1** (2,588 bytes) - Routing logic
- **codex-meta.psm1** (6,598 bytes) - Metadata handling

### PowerShell Scripts (7,084 bytes)
- **run-codex.ps1** - Stage 2 (BUILD)
- **pre_run.ps1** - Stage 1 (PRE-RUN)
- **ai_enrich.ps1** - AI enrichment
- **read_legacy_*.ps1** - Migration adapters

### Python Scripts (7,623 bytes)
- **build_signatures.py** - SimHash generation
- **cluster_and_layout.py** - Clustering algorithm
- **ai_webhook_stub.py** - AI webhook server

### Configuration (11,243 bytes)
- **codex-config.json** - Main configuration
- **JSON schemas** - Validation schemas
- **ThemeMaps.personal.json** - Custom routing

---

## Quick Start

```powershell
# 1. Configure sources
notepad codex-config.json

# 2. Run PRE-RUN (analysis)
powershell -ExecutionPolicy Bypass -File .\scripts\pre-run\pre_run.ps1

# 3. Review proposed layout
notepad metadata\proposed_layout.json

# 4. Run BUILD (organization)
powershell -ExecutionPolicy Bypass -File .\scripts\run-codex.ps1

# 5. Check results
notepad E:\CODEX_V3\metadata\INDEX.md
```

---

## Key Features

### ✨ Intelligent Clustering
- Shingle-based similarity detection
- SimHash for near-duplicate detection
- Hierarchical clustering
- Configurable thresholds

### 🎯 Flexible Routing
Routing precedence (in order):
1. **fractal_path** - AI-suggested hierarchy
2. **themes** - Pattern-based categorization
3. **DIN codes** - DIN-### detection
4. **project** - Project structure detection
5. **language** - Extension-based fallback

### 🤖 AI Enrichment (Optional)
- Title extraction
- Content summarization
- Keyword generation
- Priority scoring
- Hierarchical path suggestion

### 📦 Complete Solution
- Comprehensive logging
- DryRun mode for testing
- Timestamped backups
- Human-readable indexes
- JSON manifests

---

## Configuration Highlights

**Global Settings:**
- `DryRun`: true/false (simulation mode)
- `OutputRoot`: E:\CODEX_V3
- `LogPath`: E:\CODEX_V3\logs\codex.log

**Sources:**
- Multiple source directories
- Extension filtering
- Flexible path configuration

**Enrichment:**
- Theme pattern matching
- AI webhook integration
- Snippet extraction

**Routing:**
- Theme buckets
- Fractal paths
- Project detection
- Language fallback

---

## Documentation Index

| Document | Purpose | Size |
|----------|---------|------|
| [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) | Complete config reference | 10,232 bytes |
| [SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md) | All scripts documented | 10,627 bytes |
| [MODULES_REFERENCE.md](MODULES_REFERENCE.md) | PowerShell modules | 1,596 bytes |
| [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) | Practical tutorials | 1,689 bytes |

**Total Documentation:** 24,144 bytes

---

## Typical Workflow

### First-Time Setup
1. Review and edit `codex-config.json`
2. Set `DryRun: true`
3. Run PRE-RUN
4. Review proposed layout
5. Run BUILD (dry-run)
6. Review logs
7. Set `DryRun: false`
8. Run BUILD (for real)

### Ongoing Use
1. Add files to source directories
2. Run PRE-RUN (optional, for clustering)
3. Run BUILD
4. Review INDEX.md

### Incremental Updates
1. Disable PreRun for speed
2. Run BUILD only
3. New files are organized immediately

---

## File Statistics

**Total Files:** 19  
**Total Size:** 52,070 bytes

**Breakdown:**
- PowerShell Scripts: 5 files
- PowerShell Modules: 3 files
- Python Scripts: 3 files
- JSON Configs: 5 files
- Documentation: 3 files

---

## Requirements

- **PowerShell 5.1+** (Windows) or **PowerShell Core 7+** (cross-platform)
- **Python 3.7+** (optional, for PRE-RUN and AI)
- **Windows/Linux/macOS**

---

## Support

- **Documentation:** See links above
- **Issues:** Report to CODEX-MONAD repository
- **Questions:** Review usage examples

---

## Related Projects

- **CODEX-MONAD** - Parent project
- **Core_Install** - Installation utilities
- **hineni-hub** - Application launcher

---

**Last Updated:** 2026-01-20 20:22:20  
**Version:** 3.0  
**Status:** Active Development

---

*"Documentation is love. Documentation is backup for the mind."*
