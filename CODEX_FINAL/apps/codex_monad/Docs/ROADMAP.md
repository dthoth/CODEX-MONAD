# ROADMAP

Development plan for Codex Monad Seedline project.

---

## Current Status: v0.1.0 (October 2025)

**Foundation Phase** - Structure complete, content collection in progress

✅ Directory architecture established  
✅ Portal and index pages created  
✅ Documentation framework in place  
⏳ Anchor file retrieval pending  
⏳ Content population in progress  

---

## Phase 1: Foundation (v0.1 → v0.2)
**Timeline:** 1-2 weeks  
**Status:** CURRENT

### Critical Path
- [ ] Locate PolyWrite2 Pro HTML (May 2024 anchor file)
- [ ] Test in multiple browsers (Chrome, Edge, Firefox, Safari)
- [ ] Download all 18 DIN forms from existing site
- [ ] Find pranayama breathing tools in archives
- [ ] Gather existing bash scripts (codex_*.sh files)
- [ ] Compile philosophy documents from conversations

### Success Criteria
- All five folders populated with existing content
- PolyWrite2 Pro opens and functions correctly
- Every link in START_HERE.html works
- System tested on at least 2 platforms

---

## Phase 2: Integration (v0.2 → v0.3)
**Timeline:** 1-2 weeks  
**Status:** PLANNED

### Core Features
- [ ] Create Chronicle tracking system
  - [ ] `chronicle_tracker.js` - Event logging
  - [ ] `stats_analyzer.js` - Analytics
  - [ ] `recap_generator.js` - Report generation
  - [ ] `Apps/chronicle_dashboard.html` - UI
- [ ] Build file classification pipeline
  - [ ] `.codex/INGEST.tsv` generator
  - [ ] `classify.py` - File categorization
  - [ ] `codex_update.py` - Manifest updates
- [ ] Implement naming policy
  - [ ] Prefix system (C-, A-, D-, L-, N-)
  - [ ] Batch renaming script
  - [ ] Documentation of conventions
- [ ] Create archive discipline
  - [ ] `archive/original-versions/` structure
  - [ ] Snapshot script on each ingest
  - [ ] Version tracking system

### Success Criteria
- Chronicle dashboard generates meaningful reports
- New files automatically classified and organized
- Consistent naming across all files
- Archive history preserved for rollback

---

## Phase 3: Expansion (v0.3 → v0.4)
**Timeline:** 1-2 weeks  
**Status:** PLANNED

### Applications
- [ ] **Irony Engine** (`Apps/irony_engine.html`)
  - Self-reference detector
  - Contradiction analyzer
  - Meta-pattern mapper
  - Integrated with `Codex/irony_analyzer.js`
- [ ] **Legal Documents** (7 files)
  - `L-DISCLAIMER-PARADOX.html`
  - `L-TERMS-OF-NOTICING.html`
  - `L-PRIVACY-POLICY.html`
  - `L-COOKIE-POLICY.html` (ironic - no cookies!)
  - `L-WARRANTY-DISCLAIMER.html`
  - `L-LICENSE-FREEDOM.html`
  - `L-GDPR-COMPLIANCE.html` (also ironic - offline!)
- [ ] **Portal Badge System**
  - DIN status (green if all forms present)
  - Parrot status (green if asset found)
  - Snapshot status (green if archive exists)
  - Legal status (green if all L- files present)

### Philosophy Integration
- [ ] **IRM Pack**
  - `Philosophy/IRM/PHYSICS.md` - Full equations
  - `Philosophy/IRM/predictions.md` - 7 falsifiable claims
  - `Philosophy/IRM/behavioral_physics.md` - ΣῬἘΨ sheet
  - Cross-references and citations
- [ ] **Shebang Whitepaper**
  - `Philosophy/Shebang/PHILOSOPHY.md`
  - `Philosophy/Shebang/neurochemical_map.json`
  - `Philosophy/Shebang/ritual_modes.md`
- [ ] **Divine Triage**
  - `Philosophy/Divine_Triage/SYSTEM.md`
  - `Philosophy/Divine_Triage/examples.md`
- [ ] **Ancient Wisdom**
  - `Philosophy/Ancient_Wisdom/greek_foundations.md`
  - `Philosophy/Ancient_Wisdom/hebrew_gematria.md`
  - `Philosophy/Ancient_Wisdom/latin_roots.md`

### Success Criteria
- All philosophical frameworks documented
- Legal parody complete and functional
- Portal provides system status at a glance
- Irony Engine detects recursive patterns

---

## Phase 4: Optimization (v0.4 → v0.5)
**Timeline:** 1 week  
**Status:** PLANNED

### SEED Variant Creation
- [ ] Create `Core/polywrite_seed.html` (≤1.36MB)
  - Inline all CSS/JS
  - Text-only UI
  - Monospace system font only
  - Single editor pane
  - Minimal feature set
  - Save/download capability
  - Timestamp button
- [ ] Document SEED constraints
  - Hard budget definition
  - Bill of materials
  - Compression strategy
  - Feature reduction rationale
- [ ] Test SEED on legacy systems
  - Actual floppy disk test
  - Minimal system requirements
  - Maximum compatibility

### Performance
- [ ] Minimize all HTML/CSS/JS
- [ ] Optimize asset loading
- [ ] Reduce file sizes across board
- [ ] Test on low-end hardware
- [ ] Verify fast load times

### Success Criteria
- SEED variant fits on 1.44MB floppy
- Core functionality preserved
- Loads quickly on old systems
- Zero-dependency operation confirmed

---

## Phase 5: Polish (v0.5 → v1.0)
**Timeline:** 1 week  
**Status:** PLANNED

### Launchers
- [ ] `Browser/Core/launcher.sh` (Unix/Mac)
- [ ] `Browser/Core/launcher.ps1` (Windows)
- [ ] `Browser/Core/local_server.py` (Python fallback)
- [ ] Cross-platform testing
- [ ] Error handling and fallbacks

### Documentation
- [ ] `Docs/DEPLOYMENT.md` - USB + floppy guides
- [ ] `Docs/USAGE.md` - User instructions
- [ ] `Docs/API.md` - Developer reference
- [ ] `Docs/TESTS.md` - Smoke test suite
- [ ] Update all existing docs for accuracy

### Quality Assurance
- [ ] **Smoke Tests**
  - PolyWrite open/save/download cycle
  - Chronicle dashboard export
  - Portal badge accuracy
  - Offline functionality
  - Cross-platform launchers
- [ ] **Accessibility**
  - High-contrast theme
  - Keyboard navigation
  - ARIA roles
  - Screen reader testing
- [ ] **i18n Hooks**
  - Config key for UI language
  - Philology files language-tagged
  - Preparation for translation

### Success Criteria
- All documentation complete and accurate
- Test suite passes on all platforms
- Accessibility standards met
- Ready for public release

---

## Phase 6: Release (v1.0)
**Timeline:** 1 week  
**Status:** PLANNED

### Packaging
- [ ] **MONAD Distribution**
  - Create `.zip` archive (≤15MB)
  - Include all launchers
  - Generate `SHA256SUMS.txt`
  - Version info (`version.json`)
  - Test extraction and use
- [ ] **SEED Distribution**
  - Create `.img` or file set
  - Verify floppy fit
  - Document two-disk protocol
  - Test on period hardware if possible

### Release Hygiene
- [ ] File integrity checksums
- [ ] License files (`LICENSE`, `NOTICE`)
- [ ] Third-party attributions (if any)
- [ ] Versioning metadata
- [ ] Release notes
- [ ] Installation instructions

### Distribution
- [ ] Host on GitHub/similar
- [ ] Create download page
- [ ] Write announcement
- [ ] Share in relevant communities
- [ ] Collect feedback

### Success Criteria
- Clean, tested distributions
- Clear installation instructions
- All files checksummed
- Community feedback positive

---

## Post-1.0: Future Directions

### Potential Enhancements
- **Optional SQLite integration**
  - Full-text search
  - Relationship tracking
  - Query interface
  - Metadata management
- **Tauri-based desktop app**
  - Native application wrapper
  - Better file system access
  - Enhanced performance
  - Standalone executable
- **Encryption tools**
  - PGP integration
  - Encrypted archives
  - Secure notes
- **Version control**
  - Git integration
  - Local repository
  - Change tracking
  - Rollback capability
- **Peer-to-peer sync**
  - User-controlled sync
  - No central servers
  - Mesh networking
  - Selective sharing

### Will NOT Add
- ❌ Cloud services
- ❌ Centralized servers
- ❌ Tracking/analytics
- ❌ Mandatory updates
- ❌ Subscription models
- ❌ Data collection
- ❌ External dependencies

### Community Contributions
- Translation projects
- Additional forms/apps
- Theme variants
- Documentation improvements
- Platform-specific optimizations
- Accessibility enhancements

---

## Milestones Summary

| Version | Focus | Timeline | Status |
|---------|-------|----------|--------|
| v0.1 | Foundation & Structure | Week 1 | ✅ Complete |
| v0.2 | Content Population | Week 2 | ⏳ Current |
| v0.3 | Integration & Features | Week 3 | 📋 Planned |
| v0.4 | Philosophy & Apps | Week 4 | 📋 Planned |
| v0.5 | SEED & Optimization | Week 5 | 📋 Planned |
| v1.0 | Polish & Release | Week 6 | 🎯 Target |

---

## Contributing to Roadmap

Suggestions for roadmap items:
1. Check against core philosophy (offline, portable, no dependencies)
2. Propose in GitHub Issues or discussions
3. Consider implementation complexity
4. Evaluate value vs. bloat tradeoff
5. Maintain spirit of simplicity

---

## Guiding Principles

**Throughout all development:**
- ✅ Maintain offline-first operation
- ✅ Zero external dependencies
- ✅ Cross-platform compatibility
- ✅ Human-readable/inspectable code
- ✅ Respect user privacy
- ✅ Keep it simple
- ✅ Document everything
- ✅ Test thoroughly
- ✅ Embrace the recursion

"The system already works. We're just making it visible."

---

**See also:** `CHANGELOG.md` for version history

🐍💀🔥✨🦜📎🍷🜃∞🜃
