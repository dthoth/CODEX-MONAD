# CODEX Monad Tools - Data Processing & Organization

This directory contains the complete data intake, processing, and organization layer for CODEX Monad.

---

## 📦 What's Included

### CODEX V3 Final Kit (Primary System)
**Location:** `CODEX_V3_Final_Kit/`

Complete data processing pipeline with:
- **Automated file classification** by language, type, and entry points
- **Metadata generation** and signature building
- **Intelligent clustering** and layout proposals
- **AI enrichment integration** via webhook
- **Backup and verification** systems
- **Cross-platform support** (Windows/Mac tested, Linux compatible)

**Quick Start:**
```powershell
# Windows (PowerShell)
cd CODEX_V3_Final_Kit
.\RUN_ALL.ps1

# Mac/Linux (requires PowerShell Core)
pwsh RUN_ALL.ps1
```

**What it does:**
1. Catalogs all files in your data sources
2. Builds signatures and metadata
3. Clusters related content
4. Proposes optimal organization structure
5. Optionally enriches with AI analysis
6. Executes the organization (or dry-run preview)

---

### Python Analysis Tools
**Location:** Root of Tools directory

Additional Python-based tools for logging and analysis:

#### `codex_monad.py`
CLI wrapper for LLM interactions with SQLite logging.

**Usage:**
```bash
# Interactive prompt
python3 codex_monad.py -m "Analyze this project structure"

# From stdin
cat analysis.txt | python3 codex_monad.py
```

**Features:**
- Logs all user/assistant interactions to SQLite
- Session-based organization
- Metadata tracking
- Extensible for any LLM API

#### `symbolic_drift_logger.py`
Tracks semantic drift in conversations over time.

**Usage:**
```bash
python3 symbolic_drift_logger.py --window 10
```

**Output:**
- Timestamp-based drift scores
- Identifies topic shifts
- Useful for conversation analysis

#### `archive_worker.py`
Automated archiving and data lifecycle management.

#### `codex_browser.py`
CLI browser for navigating logged sessions and metadata.

---

## 🎯 Workflows

### Workflow 1: Organize New Data
```bash
# 1. Run CODEX V3 to analyze and organize
cd CODEX_V3_Final_Kit
.\RUN_ALL.ps1

# 2. Review proposed layout
# 3. Execute or refine
# 4. Data is now organized in CODEX structure
```

### Workflow 2: Track AI Interactions
```bash
# Use codex_monad.py for any AI work
python3 codex_monad.py -m "Help me with X"

# Later, analyze drift
python3 symbolic_drift_logger.py > drift_report.txt

# Browse sessions
python3 codex_browser.py
```

### Workflow 3: Archive to USB/Cloud
```bash
# Use archive_worker.py to prepare for transfer
python3 archive_worker.py --target /Volumes/USB_DRIVE

# CODEX V3 can then organize the archived data
```

---

## 📁 CODEX V3 Architecture

```
CODEX_V3_Final_Kit/
├── RUN_ALL.ps1              # Main execution script
├── RUN_ALL_DRY.ps1          # Dry-run preview
├── README.txt               # Quick start guide
│
├── CODEX_V3_Integrated/     # Main processing system
│   ├── schemas/             # JSON schemas for data structures
│   ├── scripts/             # PowerShell modules
│   │   ├── codex-tools.psm1      # Core utilities
│   │   ├── codex-router.psm1     # Data routing logic
│   │   ├── codex-meta.psm1       # Metadata management
│   │   └── pre-run/              # Pre-processing pipeline
│   │       ├── pre_run.ps1
│   │       ├── ai_enrich.ps1
│   │       └── python_pre/       # Python helpers
│   │           ├── build_signatures.py
│   │           └── cluster_and_layout.py
│   │
│   └── tools/
│       ├── ai_webhook_stub.py    # AI integration endpoint
│       └── ThemeMaps.personal.json  # Classification themes
│
└── Core_Install/            # Core skeleton installer
    └── scripts/             # Installation utilities
```

---

## 🔧 Configuration

### CODEX V3 Configuration
Edit `CODEX_V3_Integrated/codex-config.json`:

```json
{
  "TargetRoot": "E:/CODEX_V3",
  "DryRun": true,
  "AIWebhookURL": "http://127.0.0.1:8765",
  "BackupBeforeBuild": true,
  "LogLevel": "INFO"
}
```

### Python Tools Configuration
Edit the DB_PATH in each Python script to customize storage location.

---

## 🚀 Advanced Usage

### Custom Classification Themes
Edit `tools/ThemeMaps.personal.json` to add your own classification categories:

```json
{
  "consciousness": {
    "keywords": ["awareness", "meditation", "pranayama"],
    "patterns": ["^din-", "ritual"]
  },
  "development": {
    "keywords": ["code", "script", "automation"],
    "extensions": [".py", ".sh", ".ps1"]
  }
}
```

### AI Enrichment
The AI webhook can be any endpoint that accepts:
```json
{
  "operation": "classify",
  "content": "file content or metadata",
  "context": {}
}
```

And returns:
```json
{
  "category": "suggested category",
  "confidence": 0.95,
  "tags": ["tag1", "tag2"]
}
```

---

## 📊 Output Structure

After running CODEX V3, your data will be organized as:

```
E:/CODEX_V3/
├── Projects/
│   ├── Active/
│   ├── Archive/
│   └── Research/
├── Media/
│   ├── Images/
│   ├── Audio/
│   └── Video/
├── Documents/
│   ├── Personal/
│   ├── Work/
│   └── Reference/
├── Code/
│   ├── Python/
│   ├── JavaScript/
│   └── Scripts/
└── .codex/
    ├── manifest.json
    ├── signatures/
    └── metadata/
```

---

## 🐛 Troubleshooting

### PowerShell Execution Policy
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
```

### Python Dependencies
```bash
# Most scripts use only standard library
# If needed:
pip install --break-system-packages sqlite3
```

### Mac/Linux PowerShell
```bash
# Install PowerShell Core
brew install powershell

# Or via package manager on Linux
```

### Permission Issues
```bash
# Make scripts executable
chmod +x *.sh *.py
```

---

## 🔗 Integration with Main CODEX

These tools feed INTO the main CODEX Monad apps:

1. **CODEX V3** organizes your data
2. **PolyWrite** lets you work with organized documents
3. **DIN Portal** catalogs the forms and metadata
4. **Bureaucratic Universe** indexes everything

The complete workflow:
```
Raw Data → CODEX V3 → Organized Structure → CODEX Apps → USB/Cloud
```

---

## 📝 Version History

- **v3.0** (Oct 29, 2024) - Complete integrated system with AI enrichment
- **v2.x** - Earlier iterations with manual processing
- **v1.x** - Original bash-based prototypes

---

## 🤝 Contributing

Found a bug? Have an improvement?

1. Open an issue on GitHub
2. Describe the problem or enhancement
3. Submit a pull request

**Especially welcome:**
- Bash ports of PowerShell modules
- Additional classification themes
- AI enrichment integrations
- Performance optimizations

---

## 📚 Related Documentation

- `../Docs/ROADMAP.md` - Future development plans
- `../Philosophy/index.html` - Theoretical foundations
- `CODEX_V3_Final_Kit/README.txt` - Quick start guide
- Main project README.md - Complete system overview

---

## 🎯 Philosophy

These tools embody the CODEX principle:

> "Consciousness technology disguised as file organization"

By organizing your data, you're not just sorting files - you're:
- Mapping your knowledge landscape
- Revealing hidden patterns
- Building searchable memory
- Creating portable wisdom

The tools are the ritual. The organization is the practice.

---

**"The system already works. We're just making it visible."**

🐍💀🔥✨🦜📎🍷🜃∞🜃
