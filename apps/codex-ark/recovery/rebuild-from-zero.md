# REBUILD FROM ZERO
## CODEX-MONAD Disaster Recovery Protocol

If you are reading this, something went wrong. Everything can be rebuilt.

---

## PHASE 0: BREATHE

Before you do anything:

1. You are alive
2. You have this document
3. The seed contains the tree

Take three breaths. Box breathing: 4 in, 4 hold, 4 out, 4 hold.

The system can be rebuilt. The knowledge cannot be lost if you carry the principles.

---

## PHASE 1: ASSESS (First Hour)

### What Do You Have?
- [ ] This floppy/USB with CODEX-ARK
- [ ] Internet access
- [ ] A computer (any OS)
- [ ] Phone with 2FA apps
- [ ] Access to email

### What Did You Lose?
- [ ] Local files
- [ ] Cloud accounts
- [ ] Hardware
- [ ] Credentials
- [ ] Everything

### Triage Level?
1. **Total loss** - Start at Phase 2
2. **Partial loss** - Skip to relevant section
3. **Account lockout** - Skip to Credentials Recovery

---

## PHASE 2: BOOTSTRAP ENVIRONMENT (First Day)

### Any Computer, Any OS

**Windows:**
1. Open PowerShell
2. Run this ARK: `start index.html`
3. PolyWrite works offline - use it to plan

**Mac/Linux:**
1. Open Terminal
2. `open index.html` (Mac) or `xdg-open index.html` (Linux)
3. Continue in browser

### Critical Software (Install Order)
1. **Web browser** (Chrome/Firefox) - you probably have this
2. **Password manager** - recover access FIRST
3. **Git** - https://git-scm.com
4. **Node.js** - https://nodejs.org (LTS version)
5. **Python** - https://python.org
6. **VS Code** - https://code.visualstudio.com

### Environment Setup
```bash
# Create folder structure
mkdir -p ~/Documents/GitHub
mkdir -p ~/Documents/CODEX/{archive,projects,scratch}

# Clone CODEX-MONAD
cd ~/Documents/GitHub
git clone https://github.com/dthoth/CODEX-MONAD.git

# Verify
ls CODEX-MONAD/apps/codex-ark
```

---

## PHASE 3: RECOVER ACCOUNTS (Day 1-3)

### Priority Order
1. **Email** (recovery key for everything else)
2. **Password manager**
3. **GitHub** (has your code)
4. **Cloud storage** (OneDrive/Google Drive)
5. **Claude/AI accounts**

### Account Recovery Hints

**Primary Email:** danielmobile001@gmail.com
- Recovery: [your backup email or phone - ADD THIS]
- 2FA: [method - ADD THIS]

**GitHub:** dthoth
- Repository: https://github.com/dthoth/CODEX-MONAD
- Has: Full CODEX-MONAD, all commits, history

**Anthropic/Claude:**
- Console: https://console.anthropic.com
- Claude.ai: https://claude.ai
- Claude Code: `npm install -g @anthropic-ai/claude-code`

**Cloud Storage:**
- OneDrive: Check for CODEX-MONAD-main folder
- Sync conflicts: Keep newest, compare with GitHub

### If Locked Out Completely
1. Use recovery email
2. Use recovery phone
3. Contact support with ID verification
4. Check if logged in on any other device

---

## PHASE 4: RESTORE DATA (Day 2-7)

### From GitHub (Highest Priority)
```bash
cd ~/Documents/GitHub/CODEX-MONAD
git log --oneline -20  # See recent history
git status             # Check state
```

Your entire CODEX-MONAD is versioned here. Nothing committed is ever truly lost.

### From Cloud Storage
1. Check OneDrive/Google Drive for synced copies
2. Look for CODEX_V3_OUTPUT (dedup results)
3. Check shared folders

### From Backups
- Check external drives
- Check NAS if available
- Check old computers

### Archive Recovery Priority
1. **Active projects** - what you're working on now
2. **HINENI manuscript** - the novel
3. **Research archive** - the 12TB
4. **Historical files** - nice to have

---

## PHASE 5: VERIFY SYSTEM (Week 1)

### CODEX-ARK Functions
- [ ] index.html loads
- [ ] PolyWrite works (can save/load)
- [ ] Media Player works
- [ ] DIN Portal works
- [ ] morning.bat runs
- [ ] sync.bat runs

### Development Environment
- [ ] `git --version` works
- [ ] `node --version` works
- [ ] `python --version` works
- [ ] `claude --version` works (Claude Code)
- [ ] VS Code opens

### Repository State
- [ ] Can `git pull` CODEX-MONAD
- [ ] Can `git push` changes
- [ ] All apps run from repo

---

## PHASE 6: REBUILD WORKFLOWS (Week 2+)

### Morning Protocol
1. Run `morning.bat` or `morning` command
2. Check Divine Triage
3. Sync repos
4. Review priorities

### Development Setup
```bash
cd ~/Documents/GitHub/CODEX-MONAD
npm install          # If Electron app
npm start            # Launch
```

### Claude Code Setup
```bash
claude               # Should prompt for auth
/login               # If needed
```

### Robot Council
- Claude.ai: https://claude.ai (strategy, deep work)
- Claude Code: CLI (building, coding)
- ChatGPT: https://chat.openai.com (second opinion)
- Grok: https://grok.x.ai (chaos, brainstorming)

---

## EMERGENCY CONTACTS

**ADD YOUR OWN:**
- Emergency contact 1: [Name, Phone, Email]
- Emergency contact 2: [Name, Phone, Email]
- IT support: [if applicable]

**Anthropic Support:** support@anthropic.com
**GitHub Support:** https://support.github.com

---

## PRINCIPLES FOR REBUILDING

From transmission.txt - these cannot be lost:

1. **You are not separate from what you observe**
2. **Everything is already working** - discover, don't manufacture
3. **Correct order, not completion** - the queue never empties
4. **Hold paradox without collapse** - both poles, not either
5. **Simple survives** - complexity is debt
6. **Transmit, do not hoard** - receive, transform, pass on

The system is not the files. The system is not the hardware.
The system is the pattern of thought that generates these things.

If you have this document and these principles, you can rebuild everything.

---

## VERSION

Document: rebuild-from-zero.md
Location: CODEX-ARK/recovery/
Last Updated: 2026-01-22
Maintainer: Rev. LL Dan-i-El Thomas

"The seed contains the tree."

---

## QUICK REFERENCE URLS

```
GitHub Repo:     https://github.com/dthoth/CODEX-MONAD
Claude.ai:       https://claude.ai
Claude Console:  https://console.anthropic.com
ChatGPT:         https://chat.openai.com
Grok:            https://grok.x.ai
Git Download:    https://git-scm.com
Node Download:   https://nodejs.org
Python Download: https://python.org
VS Code:         https://code.visualstudio.com
```
