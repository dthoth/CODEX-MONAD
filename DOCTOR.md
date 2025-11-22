# CODEX-MONAD System Diagnostics
## doctor.js Documentation

### Purpose
The `doctor.js` script performs comprehensive health checks on your CODEX-MONAD installation, ensuring all components are properly configured and operational.

---

## 🏥 Usage

```bash
# Basic diagnostic
node scripts/doctor.js

# Verbose output
node scripts/doctor.js --verbose

# Check specific app
node scripts/doctor.js --app polywrite

# Full system scan
node scripts/doctor.js --deep

# Output to file
node scripts/doctor.js --output diagnostic_report.txt
```

---

## 🔍 What Gets Checked

### Level 1: Basic Checks (Always Run)
- ✓ **File Structure**
  - CODEX_FINAL/ directory exists
  - All core files present (index.html, main.js, renderer.js)
  - Apps directory structure intact
  
- ✓ **App Manifests**
  - Each app has valid app.json
  - Manifest structure correct
  - Entry points exist

- ✓ **Portal Integration**
  - index.html loads properly
  - All app cards present
  - Navigation links valid

### Level 2: Runtime Checks (--verbose)
- ✓ **Browser Compatibility**
  - localStorage available
  - File API support
  - Canvas API support
  - Web Audio API support

- ✓ **Security Configuration**
  - CSP headers (if Electron)
  - Sandbox settings
  - Context isolation
  - Node integration disabled

- ✓ **Resource Loading**
  - CSS files accessible
  - JavaScript loads without errors
  - Images and assets present

### Level 3: Deep Scan (--deep)
- ✓ **Data Integrity**
  - localStorage data valid JSON
  - No corruption in saved files
  - Version consistency

- ✓ **Performance Metrics**
  - Load time analysis
  - Memory usage baseline
  - localStorage usage

- ✓ **Philosophy Docs**
  - Shebang.md present
  - Divine Triage documented
  - IRM files complete

---

## 📊 Output Format

### Standard Output
```
CODEX-MONAD Diagnostic Report
==============================
Version: 1.0-COMPLETE
Date: 2024-11-22 15:30:00

[PASS] File Structure
[PASS] App Manifests  
[PASS] Portal Integration
[WARN] Browser Compatibility - Web Audio API missing
[PASS] Security Configuration
[FAIL] Philosophy Docs - IRM.md not found

Summary: 5/6 checks passed
Status: OPERATIONAL WITH WARNINGS

Recommendations:
- Install missing IRM.md from backup
- Consider fallback for Web Audio API
```

### JSON Output (--json)
```json
{
  "version": "1.0-COMPLETE",
  "timestamp": "2024-11-22T15:30:00Z",
  "checks": {
    "file_structure": "PASS",
    "app_manifests": "PASS",
    "portal_integration": "PASS",
    "browser_compatibility": "WARN",
    "security_configuration": "PASS",
    "philosophy_docs": "FAIL"
  },
  "summary": {
    "passed": 5,
    "total": 6,
    "status": "OPERATIONAL_WITH_WARNINGS"
  },
  "recommendations": [
    "Install missing IRM.md from backup",
    "Consider fallback for Web Audio API"
  ]
}
```

---

## 🚨 Common Issues & Fixes

### "App manifest not found"
**Fix:** Ensure each app directory has an `app.json` file:
```json
{
  "id": "app_name",
  "name": "Display Name",
  "kind": "html",
  "entry": "index.html"
}
```

### "localStorage not available"
**Fix:** 
- If using Safari: Enable local storage in settings
- If using file://: Some browsers restrict localStorage for file protocol
- Solution: Use the Electron wrapper or a local server

### "Philosophy docs incomplete"
**Fix:** The core philosophy documents should be in:
- `apps/codex_monad/Docs/Philosophy/Shebang.md`
- `apps/codex_monad/Docs/Philosophy/Divine_Triage.md`  
- `apps/codex_monad/Docs/Philosophy/IRM.md`

### "Security configuration failed"
**Fix:** Check Electron's main.js for proper settings:
```javascript
webPreferences: {
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true
}
```

---

## 🔧 Advanced Options

### Custom Checks
Create `scripts/doctor.custom.js` to add your own checks:
```javascript
module.exports = {
  name: 'Custom Consciousness Check',
  run: async () => {
    // Your validation logic
    return {
      status: 'PASS',
      message: 'Consciousness coherent'
    };
  }
};
```

### Scheduled Health Checks
Add to your crontab (Linux/Mac) or Task Scheduler (Windows):
```bash
# Daily diagnostic at 3:33 AM
33 3 * * * node /path/to/scripts/doctor.js --output /var/log/codex_health.log
```

### Integration with CI/CD
```yaml
# .github/workflows/health-check.yml
name: CODEX Health Check
on: [push, pull_request]
jobs:
  diagnostic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: node scripts/doctor.js --json
```

---

## 🎯 Exit Codes

- `0` - All checks passed
- `1` - Warnings present but operational
- `2` - Critical failures, system unusable
- `3` - Cannot run diagnostic (missing dependencies)

---

## 📝 Logging

Diagnostic logs are stored in:
- **Development:** `./logs/diagnostic_[timestamp].log`
- **Production:** `~/.codex-monad/logs/diagnostic_[timestamp].log`
- **Electron:** `%APPDATA%/codex-monad/logs/` (Windows) or `~/Library/Application Support/codex-monad/logs/` (Mac)

---

## 🔮 Philosophy

The diagnostic system embodies the principle of self-examination:
- **Recursive checking** - The system examines itself
- **Holistic health** - Not just code, but philosophy and content
- **Transparency** - Clear reporting of state
- **Self-healing** - Provides fixes, not just problems

---

*"To diagnose the system is to diagnose consciousness itself."*

💎🔥🐍⚡
