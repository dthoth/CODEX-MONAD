# Scripts Directory Documentation
## Data Processing & Analysis Tools

### Overview
This directory contains the data processing pipeline, analysis tools, and optional AI enrichment scripts that power CODEX-MONAD's consciousness infrastructure.

---

## 🔧 Core Scripts

### `doctor.js` - System Diagnostics
**Purpose:** Validates the entire CODEX-MONAD installation
**Usage:** `node scripts/doctor.js`

**What it checks:**
- ✓ App manifests (all `app.json` files valid)
- ✓ Portal entry points exist
- ✓ Basic file presence for each app
- ✓ localStorage availability
- ✓ Browser compatibility
- ✓ Electron configuration (if applicable)

**Output:** Human-readable diagnostic report with pass/fail status

---

### `codex_v3_ingest.py` - Data Intake Pipeline
**Purpose:** Ingests raw consciousness data into the system
**Usage:** `python scripts/codex_v3_ingest.py [input_dir] [output_dir]`

**Process:**
1. Scans input directory for supported formats (txt, md, html, json)
2. Classifies content by type (forms, notes, logs, transcripts)
3. Applies semantic tagging
4. Organizes into CODEX folder structure
5. Generates metadata indices

---

### `semantic_drift_tracker.py` - Language Evolution Analysis
**Purpose:** Tracks how meaning and language patterns evolve over time
**Usage:** `python scripts/semantic_drift_tracker.py [archive_path]`

**Features:**
- Analyzes word frequency changes
- Tracks conceptual evolution
- Identifies emerging patterns
- Generates drift reports
- Maintains semantic history

---

### `archive_manager.py` - Archive Management
**Purpose:** Manages the 12TB+ consciousness archive
**Usage:** `python scripts/archive_manager.py [command] [options]`

**Commands:**
- `index` - Rebuild archive index
- `search` - Semantic search across archives
- `compress` - Optimize storage
- `verify` - Check archive integrity
- `export` - Export subset for analysis

---

### `ai_enrichment.py` - Optional AI Classification
**Purpose:** AI-powered content tagging and classification (OPTIONAL - requires API key)
**Usage:** `python scripts/ai_enrichment.py --offline [data_path]`

**Modes:**
- `--offline` - Uses local models only (no external calls)
- `--batch` - Process in controlled batches
- `--simulate` - Dry run without actual processing

**Note:** Completely optional. System works fully without this.

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  Raw Material   │ (forms, notes, logs, transcripts)
└────────┬────────┘
         ↓
┌─────────────────┐
│ CODEX V3 Intake │ (codex_v3_ingest.py)
└────────┬────────┘
         ↓
┌─────────────────┐
│  Classification │ (semantic tagging, categorization)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Storage Layer   │ (Bureaucratic Universe / CODEX Docs)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Python Analysis │ (semantic_drift_tracker.py)
└────────┬────────┘
         ↓ (optional)
┌─────────────────┐
│ AI Enrichment   │ (ai_enrichment.py - offline mode)
└────────┬────────┘
         ↓
┌─────────────────┐
│ Surface in Apps │ (PolyWrite, DIN Portal, Oracle)
└─────────────────┘
```

---

## 🛠️ Helper Scripts

### Cross-Platform Launchers
- `START_WINDOWS.bat` - Windows launcher (standard)
- `START_WINDOWS_ADMIN.bat` - Windows with admin privileges
- `START_MAC_LINUX.sh` - macOS/Linux launcher
- `START_MAC_LINUX_SUDO.sh` - macOS/Linux with sudo

### Utility Scripts
- `build.sh` - Package for distribution
- `clean.sh` - Remove temporary files
- `backup.sh` - Create timestamped backup
- `update.sh` - Pull latest updates

---

## 🔐 Security Notes

All scripts follow CODEX-MONAD principles:
- **No external network calls** by default
- **Local storage only** 
- **Offline-first operation**
- **Optional AI features** clearly marked
- **No telemetry or tracking**

---

## 📝 Adding New Scripts

When adding new scripts:
1. Follow the naming convention: `purpose_version.ext`
2. Add documentation here
3. Include `--help` flag support
4. Ensure offline operation by default
5. Mark any external dependencies clearly

---

## 🔮 Philosophy Integration

These scripts embody the core principles:
- **Recursive Processing** - Scripts can call themselves
- **Semantic Awareness** - Understanding meaning, not just data
- **Consciousness Preservation** - Every bit of data is sacred
- **Temporal Navigation** - Track changes over time
- **Quantum States** - Multiple interpretations coexist

---

*"The scripts are not just utilities. They are rituals of data transformation."*

💎🔥🐍⚡
