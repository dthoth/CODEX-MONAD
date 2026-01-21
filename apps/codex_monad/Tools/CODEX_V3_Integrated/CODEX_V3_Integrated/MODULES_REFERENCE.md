# 🔧 CODEX_V3_Integrated PowerShell Modules Reference

**Last Updated:** 2026-01-20 20:16:41

---

## Overview

CODEX V3 uses three PowerShell modules:

1. **codex-tools.psm1** (15,582 bytes) - Core utilities  
2. **codex-router.psm1** (2,588 bytes) - Routing logic  
3. **codex-meta.psm1** (6,598 bytes) - Metadata handling

Total: **24,768 bytes** of PowerShell code

---

## codex-tools.psm1

**Functions:** 14

### Key Functions

- `Write-Log` - Timestamped logging
- `Get-CodexCandidates` - Scan and filter files from sources
- `New-CodexManifest` - Build complete manifest with metadata
- `Resolve-DestinationPath` - Apply routing rules to determine destination
- `Copy-CodexFiles` - Execute file copy operations
- `New-CodexIndexMarkdown` - Generate INDEX.md
- `New-CodexBackupZip` - Create backup archive
- `New-CoreKernelModuleManifest` - Build module manifest

See full function reference in separate documentation.

---

## codex-router.psm1

**Routing Functions:**

- `Route-ByFractalPath` - AI-suggested hierarchical routing
- `Route-ByTheme` - Pattern-based theme routing
- `Route-ByDIN` - DIN code detection and routing
- `Route-ByProject` - Project structure routing
- `Route-ByLanguage` - Extension-based fallback

---

## codex-meta.psm1

**Metadata Functions:**

- `Extract-FileMetadata` - Comprehensive metadata extraction
- `Enrich-WithAI` - AI webhook enrichment
- `Validate-Metadata` - Schema validation
- `Apply-ThemePatterns` - Theme pattern matching

---

*Full module reference available in source files.*
