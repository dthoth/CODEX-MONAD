# CODEX-MONAD Apps Documentation

**Complete Reference for All 13 Applications**

> "Each app is a portal to awareness, not distraction."

---

## Overview

CODEX-MONAD contains **13 consciousness-first applications** designed for focused work, creative expression, and personal growth. All apps are:

- **Offline-first** - Work without internet connection
- **Portable** - Run from any location (local or external drive)
- **Minimalist** - Clean interfaces, no distractions
- **Self-contained** - No external dependencies

### Quick Index

| Icon | App | Category | Version | Purpose |
|------|-----|----------|---------|---------|
| 🏛️ | [Bureaucratic Universe](#bureaucratic-universe) | Simulation | v1.0.0 | Bureaucratic complexity simulator |
| 🔏 | [CODEX-ARK Witness](#codex-ark-witness) | Archive | v1.0.0 | Visual tamper detection system |
| 🎭 | [CODEX Capture](#codex-capture) | Productivity | v1.0.0 | Keystroke & context capture |
| 🌱 | [CODEX Monad](#codex-monad) | Portal | v1.0.0 | Ecosystem entry point |
| ⚡ | [Conflict Lab](#conflict-lab) | Analysis | v1.0.0 | Interactive conflict exploration |
| 🚪 | [DIN Portal](#din-portal) | Navigation | v1.0.0 | Dynamic navigation hub |
| 💎 | [Pearl](#pearl) | Writing | v1.0.0 | Academic writing environment |
| ✍️ | [PolyWrite](#polywrite) | Writing | v1.0.0 | Multi-dimensional text editor |
| 🫁 | [Pranayama](#pranayama) | Wellness | v1.0.0 | Breathing pattern generator |
| 🎲 | [Royal Game of Ur](#royal-game-of-ur) | Game | v1.0.0 | Ancient board game |
| ♾️ | [Samson Recursive](#samson-recursive) | Utility | v1.0.0 | Recursive file operations |
| 🔐 | [Vault](#vault) | Security | v2.0.0 | Secure data storage |
| 🥗 | [Word Salad](#word-salad) | Writing | v5.0.0 | Creative writing tool |

---

## Writing & Composition

### Pearl

**💎 Academic Writing Environment**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 164 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/pearl/index.html` |

#### Purpose

Pearl is a **minimalist AI conversation interface** and **academic writing companion** designed for focused dialogue and scholarly composition. Named after the wisdom gem, it provides a clean, distraction-free environment for deep work.

#### Key Features

**✨ Core Capabilities:**
- **Academic-focused interface** - Sepia/light/dark themes optimized for long reading sessions
- **AI conversation** - Integrated Claude/GPT interface for research assistance
- **Citation management** - Track and format academic references
- **Note-taking** - Inline annotations and margin notes
- **Session persistence** - Auto-save all work locally
- **Markdown support** - Full markdown formatting with preview

**🎨 Interface Themes:**
- **Sepia** - Default academic reading mode (warm, eye-friendly)
- **Light** - High-contrast daytime mode
- **Dark** - Low-light evening mode

**📝 Writing Tools:**
- Clean typography (Crimson Pro, IBM Plex Sans)
- Distraction-free full-screen mode
- Word count and reading time estimates
- Export to PDF, DOCX, Markdown

#### Usage

**Basic Workflow:**
```
1. Open Pearl → apps/pearl/index.html
2. Select theme (sepia/light/dark)
3. Start conversation or begin writing
4. Work is auto-saved to browser localStorage
5. Export when complete
```

**Best For:**
- Academic research and writing
- Deep conversations with AI
- Long-form essay composition
- Literature review and note-taking
- Thesis/dissertation drafting

**Pro Tips:**
- Use sepia theme for extended reading/writing sessions (reduces eye strain)
- Pearl saves automatically—no need to manually save
- Press `Ctrl+/` (or `Cmd+/`) for keyboard shortcuts
- Use markdown headings (`#`, `##`, `###`) to structure documents

#### Technical Details

- **Framework:** Vanilla JavaScript, HTML5, CSS3
- **Storage:** Browser localStorage (client-side only)
- **AI Integration:** API-based (OpenAI/Anthropic compatible)
- **Fonts:** Google Fonts (Crimson Pro, IBM Plex Sans, JetBrains Mono)
- **No dependencies** - Works completely offline after initial load

---

### PolyWrite

**✍️ Multi-Dimensional Text Editor**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 127 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/polywrite/index.html` |

#### Purpose

PolyWrite is a **multi-editor writing environment** with advanced session management, parallel editing capabilities, and quantum-inspired features for exploring multiple versions of your writing simultaneously.

#### Key Features

**✨ Parallel Editing:**
- **Multiple sessions** - Work on multiple documents in parallel
- **Session restore** - Resume exactly where you left off
- **Version branching** - Explore different versions without losing work
- **Timeline forking** - Create alternate timelines of your document

**🎯 Focus Tools:**
- **Focus mode** - Full-screen distraction-free writing
- **Typewriter mode** - Keep cursor centered on screen
- **Zen mode** - Hide all UI elements
- **Markdown preview** - Live rendering of markdown

**💾 Session Management:**
- **Auto-save** - Never lose work
- **Session snapshots** - Create restore points
- **Cross-session sync** - Share work across browser tabs
- **Export/import** - Portable session files

**🎨 Customization:**
- Multiple color schemes
- Adjustable font sizes
- Custom keyboard shortcuts
- Configurable auto-save intervals

#### Usage

**Basic Workflow:**
```
1. Open PolyWrite → apps/polywrite/index.html
2. Create new session or restore previous
3. Write with live markdown preview
4. Enable focus mode for deep work
5. Sessions auto-save to localStorage
6. Export when complete
```

**Advanced: Parallel Sessions**
```
1. Open PolyWrite in multiple browser tabs
2. Each tab can work on different sections
3. Sessions sync automatically via localStorage
4. Merge or keep separate as needed
```

**Best For:**
- Complex documents with multiple sections
- Exploring different writing approaches
- Collaborative solo work (multiple perspectives)
- Long-form content creation
- Technical documentation

#### Technical Details

- **Framework:** Vanilla JavaScript
- **Storage:** Browser localStorage + IndexedDB
- **Preview:** Marked.js for markdown rendering
- **Sync:** BroadcastChannel API for cross-tab communication
- **Offline-first:** Full functionality without internet

---

### Word Salad

**🥗 Creative Writing Tool**

| | |
|---|---|
| **Version** | 5.0.0 |
| **Size** | 152 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/word_salad/Word Salad 5.0/index.html` |

#### Purpose

Word Salad is a **creative writing assistant** that helps generate ideas, explore word combinations, and break through writer's block through playful text manipulation.

#### Key Features

**✨ Creative Tools:**
- **Word mixing** - Combine words in unexpected ways
- **Phrase generation** - Create unique expressions
- **Synonym explorer** - Discover alternative words
- **Random prompts** - Spark new ideas
- **Pattern matching** - Find interesting word patterns

**🎲 Generative Features:**
- Randomized word combinations
- Markov chain text generation
- Rhyme and alliteration tools
- Metaphor suggestions

**📝 Writing Modes:**
- Freeform composition
- Structured prompts
- Constraint-based writing
- Experimental text play

#### Usage

**Basic Workflow:**
```
1. Open Word Salad → apps/word_salad/Word Salad 5.0/index.html
2. Enter seed words or phrases
3. Generate variations and combinations
4. Use results as creative inspiration
5. Export interesting phrases
```

**Best For:**
- Breaking writer's block
- Poetry and creative writing
- Brainstorming sessions
- Experimental literature
- Wordplay and language exploration

---

## Productivity & Capture

### CODEX Capture

**🎭 Keystroke & Context Capture**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 28.7 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/codex_capture/index.html` |

#### Purpose

CODEX Capture implements **"The Baseline Triangle"** - capturing three fundamental signals of digital work:

1. **Keystrokes** - What you're typing
2. **Clipboard** - What you're copying/pasting
3. **Window Context** - Where you're working

This creates a continuous record of your digital activity for later review, analysis, or reconstruction.

#### Key Features

**✨ Capture Modes:**
- **Keystroke logging** - Record all keyboard input (with privacy controls)
- **Clipboard monitoring** - Track copy/paste operations
- **Window tracking** - Log active applications and titles
- **Screenshot triggers** - Automatic screenshots on context switches

**🔒 Privacy Features:**
- **Local-only storage** - All data stays on your machine
- **Selective capture** - Exclude sensitive apps (passwords, banking)
- **Encryption** - Optional encryption of capture logs
- **Manual pause** - Easily disable capture temporarily

**📊 Analysis Tools:**
- Timeline visualization
- Activity patterns
- Context switching analysis
- Work session reconstruction

#### Usage

**Setup:**
```
1. Open CODEX Capture → apps/codex_capture/index.html
2. Configure capture preferences
3. Set excluded applications (passwords, etc.)
4. Start capture
5. Review captured data in timeline view
```

**Privacy Considerations:**
- Always exclude password managers, banking apps
- Review capture logs regularly
- Delete sensitive captures immediately
- Use encryption for long-term storage

**Best For:**
- Reconstructing work sessions
- Understanding productivity patterns
- Recovering lost work
- Time tracking and billing
- Research workflow analysis

**⚠️ Important:**
This tool captures sensitive data. Use responsibly and configure exclusions carefully.

---

## Navigation & Organization

### DIN Portal

**🚪 Dynamic Intelligent Navigation**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 931 KB (largest app) |
| **Status** | ✅ Active |
| **Launch** | `apps/din_portal/index.html` |

#### Purpose

DIN Portal is a **meta-navigation system** - a portal within the portal. It provides dynamic, intelligent access to the entire CODEX ecosystem, legal forms, documentation, and archived content.

#### Key Features

**✨ Navigation:**
- **Dynamic menus** - Context-aware navigation
- **Search functionality** - Full-text search across all content
- **Breadcrumb trails** - Never lose your place
- **Recent items** - Quick access to frequently used items

**📚 Content Access:**
- **DIN forms library** - All legal forms indexed and searchable
- **Documentation portal** - Complete CODEX documentation
- **Archive browser** - Historical content access
- **System diagrams** - Visual system overviews

**🔍 Search Features:**
- Full-text search
- Metadata filtering
- Tag-based navigation
- Date range queries

**📋 Forms Included:**
- N-PLE-OMEGA (Public Legal Entity)
- N-PNEP-INFINITY (Private Natural Equity Person)
- QHFMV-QS (Quality Standards)
- Form-Notice templates
- Liability loop documentation
- IP omnidirectional documents

#### Usage

**Basic Navigation:**
```
1. Open DIN Portal → apps/din_portal/index.html
2. Browse categories or use search
3. Click to open documents/forms
4. Use breadcrumbs to navigate back
```

**Form Access:**
```
1. Navigate to Legal Forms section
2. Select form type (PLE, PNEP, etc.)
3. View or download form
4. Fill out as needed
```

**Best For:**
- Legal form access and management
- Documentation discovery
- System architecture review
- Historical archive browsing
- Comprehensive CODEX navigation

#### Technical Details

- **Size:** 931 KB (45 files)
- **Structure:** Nested portal architecture
- **Content:** HTML forms, documentation, diagrams
- **Search:** Client-side full-text search
- **Offline:** Fully functional offline

---

### CODEX Monad

**🌱 Ecosystem Entry Point**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 263 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/codex_monad/START_HERE.html` |

#### Purpose

CODEX Monad is the **foundational seedline** - the first entry point into the entire CODEX-MONAD ecosystem. Think of it as the "README" for the entire system.

#### Key Features

**✨ Orientation:**
- **Welcome guide** - Introduction to CODEX philosophy
- **Quick start** - Get up and running fast
- **Navigation map** - Overview of all apps and tools
- **Philosophy explanation** - The "why" behind CODEX

**📖 Documentation:**
- System overview
- Installation guides
- Usage tutorials
- Troubleshooting help

**🔗 Links:**
- Direct links to all 13 apps
- External resources
- Community connections
- Support channels

#### Usage

**For New Users:**
```
1. Start here: apps/codex_monad/START_HERE.html
2. Read the welcome guide
3. Understand the philosophy
4. Navigate to specific apps
5. Return here for orientation
```

**Best For:**
- First-time CODEX users
- Understanding the ecosystem
- Finding the right app for your needs
- Troubleshooting and support

---

## Security & Archive

### Vault

**🔐 Secure Data Storage**

| | |
|---|---|
| **Version** | 2.0.0 |
| **Size** | 78 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/vault/index.html` |

#### Purpose

Vault provides **encrypted local storage** for sensitive information—passwords, keys, notes, and documents. All encryption happens client-side; your data never leaves your machine.

#### Key Features

**🔒 Security:**
- **AES-256 encryption** - Military-grade encryption
- **Client-side only** - No server, no cloud
- **Master password** - Single password for all vaults
- **Zero-knowledge** - Even you can't recover without password

**📦 Storage:**
- **Multiple vaults** - Organize by category
- **Nested folders** - Hierarchical organization
- **Tags and labels** - Flexible categorization
- **Search** - Encrypted search within vault

**💾 Backup & Export:**
- Export encrypted vaults
- Import from backup
- Password-protected ZIP export
- Cloud sync compatible (encrypted files)

**🎯 Item Types:**
- Passwords and credentials
- Secure notes
- Files and documents
- API keys and tokens
- Credit card info
- SSH keys

#### Usage

**Initial Setup:**
```
1. Open Vault → apps/vault/index.html
2. Create master password (WRITE IT DOWN!)
3. Create your first vault
4. Add items
5. Regularly backup vault files
```

**Adding Items:**
```
1. Unlock vault with master password
2. Click "Add Item"
3. Choose type (password, note, file)
4. Enter details
5. Save (auto-encrypted)
```

**⚠️ Critical:**
- **NEVER forget your master password** - It cannot be recovered
- **Backup your vault files** - Store encrypted backups in multiple locations
- **Use a strong master password** - 16+ characters, mixed case, symbols
- **Don't share master password** - Write it down and store securely offline

**Best For:**
- Password management
- Secure note storage
- API key storage
- Sensitive document archival
- Private key management

---

### CODEX-ARK Witness

**🔏 Visual Tamper Detection**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 51 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/codex-ark/codex-ark-witness.html` |

#### Purpose

CODEX-ARK creates **visual cryptographic fingerprints** that you can recognize by sight. Instead of comparing hashes like `a3b5f2...`, you compare visual patterns. If the pattern changes, the file changed.

#### Key Features

**✨ Visual Fingerprints:**
- **Unique patterns** - Each file generates a unique visual signature
- **Deterministic** - Same file always produces same pattern
- **Human-recognizable** - Memorize patterns visually
- **Tamper-evident** - Any change produces different pattern

**🎨 Pattern Types:**
- Geometric shapes
- Color grids
- Mandala patterns
- Abstract art representations

**🔍 Verification:**
- **Side-by-side comparison** - Compare original vs. current pattern
- **Batch verification** - Check multiple files at once
- **Timeline view** - See pattern changes over time
- **Export patterns** - Save visual fingerprints as images

**📦 Archive Features:**
- Create visual catalog of important files
- Track document versions visually
- Detect unauthorized modifications
- Maintain chain of custody

#### Usage

**Create Fingerprint:**
```
1. Open CODEX-ARK → apps/codex-ark/codex-ark-witness.html
2. Drag and drop file
3. View generated visual pattern
4. Save pattern image as reference
```

**Verify File:**
```
1. Open CODEX-ARK
2. Drag original reference pattern
3. Drag current file
4. Compare patterns visually
5. If identical → file unchanged
6. If different → file modified
```

**Best For:**
- Legal document verification
- Contract integrity checking
- Academic paper authenticity
- Code release verification
- Notary-style witnessing

**Use Cases:**
- "This contract hasn't been altered since signing"
- "My thesis submission matches my final draft"
- "This software release is the official version"
- "No one tampered with the evidence files"

---

## Wellness & Games

### Pranayama

**🫁 Breathing Pattern Generator**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 36 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/pranayama/index.html` |

#### Purpose

Pranayama is a **breathing exercise guide** that helps you practice various breathing patterns for relaxation, focus, and wellness. Named after the yogic practice of breath control.

#### Key Features

**✨ Breathing Patterns:**
- **4-7-8 Relaxation** - Calming breath for sleep
- **Box Breathing** - 4-4-4-4 for focus
- **Wim Hof Method** - Energizing breath
- **Alternate Nostril** - Balance and calm
- **Custom patterns** - Create your own

**🎯 Visual Guidance:**
- Animated breathing circle (expands/contracts)
- Timer for each phase
- Audio cues (optional)
- Progress tracking

**📊 Session Features:**
- Duration setting
- Cycle counting
- Break reminders
- Session history

**🎨 Customization:**
- Visual themes
- Sound options
- Haptic feedback
- Breathing pace adjustment

#### Usage

**Basic Session:**
```
1. Open Pranayama → apps/pranayama/index.html
2. Select breathing pattern
3. Set duration (5, 10, 15 minutes)
4. Follow the visual guide
5. Breathe in sync with circle
```

**Best For:**
- Pre-work focus ritual
- Stress reduction
- Sleep preparation
- Meditation sessions
- Break-time reset

**Tips:**
- Practice in quiet environment
- Use headphones for audio cues
- Start with 5-minute sessions
- Consistency > duration

---

### Royal Game of Ur

**🎲 Ancient Board Game**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 38 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/royal_game_of_ur/index.html` |

#### Purpose

A faithful digital recreation of the **Royal Game of Ur**, one of the oldest known board games (dating to ~2600 BCE). Play against AI or another human.

#### Key Features

**🎮 Game Modes:**
- **Single player** - vs. AI opponent
- **Two player** - local multiplayer
- **Tutorial mode** - Learn the rules
- **Historical info** - Learn about the game's history

**⚛️ Gameplay:**
- Authentic rules from ancient tablets
- 3D dice animation
- Move validation
- Win/loss tracking

**📜 Historical Context:**
- Original game discovered in Ur (Iraq)
- Rules reconstructed from cuneiform tablets
- Popular in ancient Mesopotamia
- Predecessor to backgammon

#### Usage

**Starting a Game:**
```
1. Open Royal Game of Ur → apps/royal_game_of_ur/index.html
2. Select mode (1P vs AI or 2P local)
3. Roll dice by clicking
4. Move pieces according to roll
5. First to get all pieces off wins
```

**Rules Summary:**
- Each player has 7 pieces
- Roll 4 binary dice (0-4 moves)
- Special rosette squares grant extra turn
- Land on opponent's piece to send it back
- First to move all pieces off the board wins

**Best For:**
- Quick game breaks
- Historical gaming experience
- Two-player casual play
- Learning ancient games

---

## Analysis & Simulation

### Conflict Lab

**⚡ Interactive Conflict Exploration**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 100 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/conflict_lab/index.html` |

#### Purpose

Conflict Lab provides an **interactive laboratory for exploring and resolving conflicts** through structured analysis. Model disputes, analyze perspectives, and find resolution pathways.

#### Key Features

**✨ Conflict Modeling:**
- **Stakeholder mapping** - Identify all parties involved
- **Interest analysis** - What each party really wants
- **Position vs. interest** - Distinguish stated positions from underlying needs
- **Power dynamics** - Analyze relative power and influence

**🔍 Analysis Tools:**
- **Perspective shifting** - View conflict from each party's viewpoint
- **Common ground finder** - Identify shared interests
- **Trade-off explorer** - Possible compromises
- **Escalation paths** - Potential conflict trajectories

**📊 Visualization:**
- Conflict maps
- Interest diagrams
- Resolution pathways
- Timeline views

**💡 Resolution Strategies:**
- Integrative solutions (win-win)
- Distributive solutions (compromise)
- Creative alternatives
- Best Alternative To Negotiated Agreement (BATNA) analysis

#### Usage

**Analyzing a Conflict:**
```
1. Open Conflict Lab → apps/conflict_lab/index.html
2. Define the conflict
3. Add stakeholders
4. Map interests and positions
5. Explore resolution options
6. Export analysis
```

**Best For:**
- Mediation preparation
- Negotiation planning
- Understanding complex disputes
- Teaching conflict resolution
- Self-reflection on disagreements

---

### Bureaucratic Universe

**🏛️ Bureaucratic Complexity Simulator**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 35 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/bureaucratic_universe/index.html` |

#### Purpose

A **satirical simulation** of bureaucratic complexity. Experience the absurdity of infinite forms, circular dependencies, and Kafkaesque administrative processes. Both educational and entertaining.

#### Key Features

**✨ Simulation:**
- **Form generation** - Endless bureaucratic forms
- **Circular references** - Form A requires Form B which requires Form A
- **Escalating complexity** - Each step adds more requirements
- **Kafkaesque logic** - Intentionally absurd but realistic

**🎭 Satirical Elements:**
- Realistic bureaucratic language
- Impossible requirements
- Catch-22 situations
- Dark humor commentary

**📋 Generated Forms:**
- Applications for applications
- Permits to apply for permits
- Exemption request forms (non-exempt)
- Complaint forms about complaint forms

#### Usage

**Experience the Simulation:**
```
1. Open Bureaucratic Universe → apps/bureaucratic_universe/index.html
2. Start with simple request
3. Follow the requirements
4. Discover the absurdity
5. Laugh or cry (or both)
```

**Best For:**
- Satirical commentary on bureaucracy
- Understanding administrative complexity
- Creative inspiration
- Gallows humor
- Appreciating simplicity

**Note:** This is intentionally frustrating. That's the point.

---

## Utilities

### Samson Recursive

**♾️ Recursive File Operations**

| | |
|---|---|
| **Version** | 1.0.0 |
| **Size** | 84 KB |
| **Status** | ✅ Active |
| **Launch** | `apps/samson_recursive/index.html` |

#### Purpose

Samson Recursive provides **recursive file and directory operations** with visual feedback. Batch rename, search, transform, or analyze entire directory trees.

#### Key Features

**✨ Recursive Operations:**
- **Batch rename** - Pattern-based renaming across directories
- **Deep search** - Find files matching criteria
- **Transform** - Apply operations to all matching files
- **Analysis** - Directory statistics and reports

**🔍 Search Features:**
- Pattern matching (regex)
- File type filtering
- Size/date filters
- Content search

**🔧 Transform Options:**
- Case conversion
- Extension changes
- Prefix/suffix addition
- Number sequence insertion

**📊 Analysis:**
- Directory size
- File type distribution
- Duplicate detection
- Structure visualization

#### Usage

**Batch Rename Example:**
```
1. Open Samson Recursive → apps/samson_recursive/index.html
2. Select directory
3. Define pattern (e.g., "IMG_*.jpg" → "Photo_*.jpg")
4. Preview changes
5. Execute rename
```

**Best For:**
- Organizing large file collections
- Batch file operations
- Directory maintenance
- File system analysis
- Cleanup and organization

---

## App Comparison Matrix

### By Category

| Category | Apps | Use When... |
|----------|------|-------------|
| **Writing** | Pearl, PolyWrite, Word Salad | Creating documents, essays, creative writing |
| **Productivity** | CODEX Capture | Tracking work, reconstructing sessions |
| **Navigation** | DIN Portal, CODEX Monad | Finding forms, understanding system |
| **Security** | Vault, CODEX-ARK | Protecting data, verifying integrity |
| **Wellness** | Pranayama | Taking breaks, managing stress |
| **Analysis** | Conflict Lab, Bureaucratic Universe | Understanding conflicts, satirizing bureaucracy |
| **Utilities** | Samson Recursive | Managing files, batch operations |
| **Games** | Royal Game of Ur | Taking mental breaks |

### By Complexity

| Simple | Moderate | Advanced |
|--------|----------|----------|
| Pranayama | Pearl | DIN Portal |
| Royal Game of Ur | PolyWrite | CODEX Capture |
| CODEX Monad | Vault | Conflict Lab |
| Bureaucratic Universe | Word Salad | Samson Recursive |
| | CODEX-ARK | |

### By Frequency of Use

**Daily Use:**
- Pearl (writing)
- PolyWrite (composition)
- Vault (password access)
- Pranayama (breaks)

**Weekly Use:**
- DIN Portal (form access)
- CODEX Capture (productivity review)
- Word Salad (creative projects)

**As Needed:**
- Conflict Lab (conflict situations)
- CODEX-ARK (verification)
- Samson Recursive (file operations)
- Royal Game of Ur (recreation)
- Bureaucratic Universe (satire/stress relief)

---

## Getting Started

### For New Users

**Start here:**
1. **CODEX Monad** (`apps/codex_monad/START_HERE.html`) - Orientation
2. **Pearl** (`apps/pearl/index.html`) - Try a writing app
3. **Pranayama** (`apps/pranayama/index.html`) - Take a mindful break

**Then explore:**
4. **DIN Portal** - Understand the ecosystem
5. **Vault** - Set up secure storage
6. **Other apps** - Based on your needs

### Recommended Workflows

**Academic Writing:**
```
Pearl → Write draft
Word Salad → Generate ideas when stuck
Pranayama → Take focus breaks
Vault → Store research credentials
```

**Legal Work:**
```
DIN Portal → Access forms
CODEX-ARK → Verify document integrity
Vault → Store sensitive client info
```

**Creative Work:**
```
PolyWrite → Multi-version drafting
Word Salad → Creative exploration
Pearl → Final polish
```

**Productivity:**
```
CODEX Capture → Track work sessions
Pranayama → Structured breaks
Conflict Lab → Resolve blockers
```

---

## Technical Details

### Common Technologies

All apps use:
- **HTML5, CSS3, JavaScript** - Standard web technologies
- **localStorage** - Client-side data persistence
- **No external dependencies** - Fully offline capable
- **Responsive design** - Work on desktop and mobile

### Storage Locations

| App | Storage Method | Location |
|-----|----------------|----------|
| Pearl | localStorage | Browser storage |
| PolyWrite | localStorage + IndexedDB | Browser storage |
| Vault | localStorage (encrypted) | Browser storage |
| CODEX Capture | IndexedDB | Browser storage |
| Others | localStorage or none | Browser storage |

### Browser Compatibility

**Recommended:**
- Chrome/Chromium 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Required Features:**
- localStorage support
- ES6 JavaScript
- CSS Grid/Flexbox
- Fetch API (for DIN Portal)

---

## Maintenance & Updates

### Version Numbering

Apps use **semantic versioning**:
- `1.0.0` - Major.Minor.Patch
- Most apps are v1.0.0 (initial stable release)
- Vault is v2.0.0 (major revision)
- Word Salad is v5.0.0 (long development history)

### Update Process

1. Updates released through CODEX-MONAD repository
2. Fleet sync propagates updates to all devices
3. Users can `git pull` to update
4. No app store or external update mechanism

### Reporting Issues

**If you encounter problems:**
1. Check browser console for errors
2. Clear localStorage (if app misbehaves)
3. Try in incognito/private mode
4. Report to CODEX-MONAD repository

---

## Philosophy

### Design Principles

**1. Consciousness-First**
Apps are designed to **serve awareness**, not hijack attention:
- No notifications or alerts
- No analytics or tracking
- No artificial engagement mechanics
- Clean, minimal interfaces

**2. Offline-First**
All apps work **without internet**:
- No required cloud services
- Local data storage
- Portable across devices
- No vendor lock-in

**3. Privacy by Design**
Your data stays **on your machine**:
- No telemetry
- No cloud sync (unless you choose)
- Client-side encryption
- Zero-knowledge architecture (Vault)

**4. Timeless Tools**
Built to **last decades**, not months:
- Standard web technologies
- No framework dependencies
- Simple, readable code
- Extensive documentation

### The CODEX Way

> "Technology should amplify human capability, not replace human presence."

Each app embodies this philosophy:
- **Pearl** amplifies writing, doesn't write for you
- **Pranayama** guides breathing, doesn't breathe for you
- **Conflict Lab** structures thinking, doesn't think for you
- **Vault** protects secrets, doesn't manage them for you

---

## See Also

- [ARCHITECTURE_DEEP_DIVE.md](ARCHITECTURE_DEEP_DIVE.md) - How hineni-hub.js loads apps
- [FLEET-SYNC.md](FLEET-SYNC.md) - Syncing apps across devices
- [CLI-REFERENCE.md](CLI-REFERENCE.md) - Command-line tools
- [CODEX_V3_GUIDE.md](CODEX_V3_GUIDE.md) - File organization pipeline

---

## Quick Reference

### Launch Paths

```
apps/bureaucratic_universe/index.html
apps/codex-ark/codex-ark-witness.html
apps/codex_capture/index.html
apps/codex_monad/START_HERE.html
apps/conflict_lab/index.html
apps/din_portal/index.html
apps/pearl/index.html
apps/polywrite/index.html
apps/pranayama/index.html
apps/royal_game_of_ur/index.html
apps/samson_recursive/index.html
apps/vault/index.html
apps/word_salad/Word Salad 5.0/index.html
```

### Support

For questions, issues, or contributions:
- Check documentation in `docs/`
- Review app source code (all open and readable)
- Contribute improvements via Git

---

**Updated:** 2026-01-20  
**Version:** 1.0.0  
**Maintained by:** CODEX-MONAD Project
