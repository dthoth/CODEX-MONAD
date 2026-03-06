# Library Archaeology Toolkit

Tools for cataloging and deduplicating massive file collections across multiple volumes.

## Overview

Designed for ~19,000+ files across volumes:
- **Vault-0**, **OverflowVault-16TB**, **System_12TB**, **HINENI_HUB**
- 14,623 PDFs, 1,301 JPGs, 1,040 ZIPs, 800+ HTML, 246 DOCs, 127 TXTs

## Tools

### cataloger.py

Recursively catalogs files with metadata and MD5 hashing.

**Captures:**
- Full path, filename, extension
- Size (bytes), modified date
- MD5 hash (optional)

**Features:**
- Skips `.DS_Store` and `._*` files (counts them separately)
- Progress indicator during scan
- Graceful error handling (permission denied, etc.)
- JSON manifest output

**Usage:**

```bash
# Basic catalog with MD5 hashing
python cataloger.py /path/to/directory -o catalog.json

# Fast scan without hashing (for initial exploration)
python cataloger.py /path/to/directory --no-hash -o fast_catalog.json

# Quiet mode
python cataloger.py /path/to/directory -q -o catalog.json
```

**Options:**
- `-o, --output` - Output JSON file (default: catalog.json)
- `--no-hash` - Skip MD5 computation for faster scanning
- `-q, --quiet` - Suppress progress output

### deduper.py

Analyzes catalog manifests to find duplicates and name collisions.

**Detects:**
- **Exact duplicates** - Same MD5 hash (identical content)
- **Name collisions** - Same filename, different content

**Reports:**
- Total/unique file counts
- Space wasted by duplicates
- Top duplicate sets by wasted space
- Name collision details

**Usage:**

```bash
# Analyze single manifest
python deduper.py catalog.json

# Combine multiple volumes
python deduper.py vault0.json overflow.json system.json -o combined_report.json

# Quick summary only (no JSON output)
python deduper.py *.json --summary-only
```

**Options:**
- `-o, --output` - Output report file (default: dedup_report.json)
- `--summary-only` - Print summary, skip JSON output
- `-q, --quiet` - Suppress terminal output

## Example Workflow

### Step 1: Catalog each volume

```bash
# Full catalog with hashing (slower but enables dedup)
python cataloger.py /Volumes/Vault-0 -o vault0_catalog.json
python cataloger.py /Volumes/OverflowVault-16TB -o overflow_catalog.json
python cataloger.py /Volumes/System_12TB -o system_catalog.json
python cataloger.py /Volumes/HINENI_HUB -o hineni_catalog.json

# Or fast scan first to see what's there
python cataloger.py /Volumes/Vault-0 --no-hash -o vault0_quick.json
```

### Step 2: Find duplicates

```bash
# Analyze all volumes together
python deduper.py vault0_catalog.json overflow_catalog.json system_catalog.json hineni_catalog.json -o full_dedup_report.json
```

### Step 3: Review results

The `dedup_report.json` contains:
- `summary` - Overall statistics
- `duplicate_groups` - Files with identical content (sorted by wasted space)
- `name_collisions` - Same filename, different content

## Output Format

### catalog.json

```json
{
  "stats": {
    "root_path": "/Volumes/Vault-0",
    "scan_date": "2024-01-15T10:30:00",
    "total_files": 14623,
    "total_size_bytes": 52428800000,
    "total_size_human": "48.8 GB",
    "extensions": {".pdf": 8234, ".jpg": 1301, ...}
  },
  "files": [
    {
      "path": "/Volumes/Vault-0/docs/paper.pdf",
      "filename": "paper.pdf",
      "extension": ".pdf",
      "size_bytes": 1048576,
      "modified_date": "2023-06-15T14:22:00",
      "md5_hash": "d41d8cd98f00b204e9800998ecf8427e"
    }
  ],
  "errors": []
}
```

### dedup_report.json

```json
{
  "summary": {
    "total_files": 19000,
    "unique_files": 15000,
    "duplicate_sets": 847,
    "wasted_space_human": "12.3 GB"
  },
  "duplicate_groups": [
    {
      "md5": "abc123...",
      "count": 5,
      "wasted_human": "500 MB",
      "files": ["path1", "path2", ...]
    }
  ],
  "name_collisions": [
    {
      "filename": "document.pdf",
      "count": 3,
      "variants": [...]
    }
  ]
}
```

## Performance Notes

- **With hashing**: ~100-500 files/sec depending on file sizes and disk speed
- **Without hashing**: ~5,000+ files/sec (metadata only)
- **Memory**: Keeps all file metadata in memory; ~1KB per file entry
- For 19,000 files: expect ~20MB RAM usage

## Tips

1. **Start with `--no-hash`** to quickly see file counts and extensions
2. **Run full hash scan overnight** for large volumes
3. **Combine manifests** to find cross-volume duplicates
4. **Review wasted space** to prioritize cleanup efforts
