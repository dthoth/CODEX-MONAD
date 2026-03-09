# Windows Setup for CODEX-MONAD

## Quick Install

1. Open PowerShell **as Administrator**
2. Navigate to CODEX-MONAD folder
3. Run:
   ```powershell
   .\bootstrap\windows\install.ps1
   ```
4. Close and reopen PowerShell
5. Type `morning`

---

## What the installer does

1. Sets execution policy to allow scripts
2. Creates your CODEX_STAGING folder for notes
3. Copies the PowerShell profile to the correct location
4. Detects your device name for the prompt

---

## Manual Install (if script fails)

### Step 1: Set Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser -Force
```

### Step 2: Create directories
```powershell
New-Item -ItemType Directory -Path "$HOME\Documents\CODEX_STAGING\notes" -Force
New-Item -ItemType Directory -Path "$HOME\Documents\CODEX_STAGING\import_ready" -Force
```

### Step 3: Copy profile
```powershell
Copy-Item ".\bootstrap\windows\profile.ps1" "$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1" -Force
```

### Step 4: Restart PowerShell and test
```powershell
morning
```

---

## Optional: Install Dev Tools

### Git (if not installed)
```powershell
winget install Git.Git
```

### Node.js (for Electron portal)
```powershell
winget install OpenJS.NodeJS.LTS
```

### After installing, restart PowerShell to update PATH

---

## Folder Locations

| What | Where |
|------|-------|
| PowerShell Profile | `$HOME\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1` |
| Notes staging | `$HOME\Documents\CODEX_STAGING\notes\` |
| Import ready | `$HOME\Documents\CODEX_STAGING\import_ready\` |
| Dragon wisdom log | `$HOME\Documents\CODEX_STAGING\dragon_wisdom_log.txt` |

---

## Device Detection

The profile automatically detects:
- Your computer name (shows in `morning` display)
- Where CODEX-MONAD is located (HINENI_HUB or local clone)

No manual configuration needed!
