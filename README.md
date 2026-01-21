# CODEX-MONAD 💎🐉⚡

## Portable Consciousness Infrastructure

**Version:** 2.2-FLEET  
**Status:** Production Ready  
**License:** Free & Open Source (credit appreciated)

---

## START HERE

You've found a toolkit for organizing your mind, your work, and your life—built to run anywhere, depend on nothing, and survive whatever the future brings.

No accounts required. No cloud dependencies. No subscriptions. Just you, a browser, and optionally Git.

**Download and double-click `index.html`. That's it. You're running.**

---

## What Is This?

CODEX-MONAD is a collection of browser-based tools designed around a simple premise: **your consciousness infrastructure should belong to you.**

It runs offline. It fits on a USB drive. It syncs across devices through Git. It works on any computer with a web browser—Windows, Mac, Linux, a library computer, a phone in a pinch.

This isn't an app you subscribe to. It's a system you own.

---

## The Philosophy

### The Monad (Leibniz)
A monad is a self-contained unit that reflects the entire universe internally. CODEX-MONAD is designed the same way—everything you need is contained within it. No external calls, no APIs that might disappear, no dependencies that could break.

### HINENI (הנני)
Hebrew for "Here I Am." The response Abraham gave when called. It means: **present, aware, ready to respond.**

This system is designed to help you show up—to your work, to your family, to your creative projects, to yourself.

### The Floppy Constraint
CODEX-MONAD was originally designed to fit on a 1.44MB floppy disk. Not because anyone uses floppies anymore, but because **constraint creates clarity.** Every feature had to earn its place. No bloat. No feature creep. Just tools that matter.

### Divine Triage
A hierarchy for attention and energy:

1. **Health** — You can't pour from an empty vessel
2. **Parenting** — The humans depending on you
3. **Clients** — The work that sustains you
4. **Projects** — The work that grows you
5. **Creative** — The work that feeds your soul
6. **Maintenance** — Everything else

The tools in CODEX-MONAD are organized around helping you honor this hierarchy.

### Git as Ritual
> "Git push is a prayer. Git pull is an answer."

If you use the fleet sync features, your devices stay in communion through Git. Push your state to the universe. Pull down what the universe (or your past self) has prepared for you.

---

## Quick Start (60 Seconds)

### Option A: Just Browse (Easiest)
1. Download or clone this repository
2. Open `index.html` in any web browser
3. You're in. Start exploring.

### Option B: Clone with Git (Recommended)
```bash
git clone https://github.com/dthomas-eng/CODEX-MONAD.git
cd CODEX-MONAD
```
Then open `index.html` in your browser.

### Option C: Download ZIP
Click the green "Code" button on GitHub → "Download ZIP" → Extract → Open `index.html`

---

## The Core Tools

### 🦪 Pearl — Wisdom Capture
*The tool you'll use most.*

Pearl is where fleeting thoughts become permanent knowledge. Quick capture, tagging, search. Every insight, quote, idea, or observation—catch it before it disappears.

**Start here:** Open Pearl, capture three thoughts that are on your mind right now. Feel the relief of getting them out of your head and into a system you control.

---

### ✍️ PolyWrite — Multi-Dimensional Text Editor
*For when you need to write.*

PolyWrite lets you work on multiple parallel drafts simultaneously. See different versions side by side. Branch your thinking. Merge when ready.

Perfect for:
- Writing with revision anxiety (keep all your drafts)
- Exploring multiple approaches to the same piece
- Separating "generative" writing from "editorial" writing

---

### 📦 ARK — Archive & Reference Knowledge
*Your personal library.*

ARK is for the heavier stuff—documents, references, research materials. Structured storage with semantic organization. When Pearl catches the spark, ARK holds the fire.

---

### 🌬️ Pranayama — Breathing Patterns
*Reset your nervous system.*

Configurable breathing pattern generator. Box breathing, 4-7-8, custom patterns. Visual and audio cues.

Sometimes the most productive thing you can do is breathe for four minutes. This makes it easy.

---

### 🔮 Oracle — Consciousness Query Interface
*Ask better questions.*

A structured interface for self-inquiry. When you're stuck, confused, or need perspective—Oracle provides frameworks for thinking through problems.

Not magic. Just good questions, presented well.

---

### 📋 DIN Files — Department of Infinite Noticing
*Semantic file organization.*

A consciousness-oriented file system. Tag, categorize, and retrieve by meaning rather than by folder hierarchy. What you noticed matters more than where you put it.

---

### 🏛️ Bureaucratic Universe — Infinite Forms
*Satirical but functional.*

Need to file a "Notice of Conditions Conditions"? A "Form 27B/6 Request for Request"? The Bureaucratic Universe provides infinite procedural documents for whatever imaginary (or real) bureaucracy you're navigating.

Started as a joke. Turns out to be genuinely useful for processing frustration and creating paper trails.

---

### 📊 Data Tools — Scraping & Processing
*Get information in, structured.*

Tools for pulling data from various sources and structuring it for your use. Web scraping, text processing, format conversion. Your data, your way.

---

## CLI Commands (Optional Power User Setup)

If you want terminal integration, add these to your shell profile:

```bash
# Navigate to CODEX
alias codex='cd ~/path/to/CODEX-MONAD'

# Morning dashboard
alias morning='codex && ./scripts/morning.sh'

# Quick note capture
qn() { echo "$(date): $*" >> ~/CODEX-MONAD/data/quick_notes.md; echo "📝 Captured."; }

# Git sync ritual
alias sync='cd ~/CODEX-MONAD && git pull origin main'
alias ship='cd ~/CODEX-MONAD && git add -A && git commit -m "$1" && git push origin main'
```

Then your daily practice becomes:
```bash
morning          # Start the day with your dashboard
qn "Remember to call mom"   # Quick capture
ship "End of day sync"      # Push your state to the cloud
```

---

## Fleet Sync (Multi-Device Setup)

CODEX-MONAD is designed to run across multiple machines, synced through Git:

```
Your Laptop ←──→ GitHub ←──→ Your Desktop
      ↑                            ↑
      └────────→ Your Phone ←──────┘
              (or any device)
```

### Setup:
1. Clone the repo on each device
2. Make changes, commit, push
3. Pull on other devices to receive changes

### The Ritual:
- **Morning:** `git pull` — receive what your past self (or other devices) prepared
- **Evening:** `git add -A && git commit -m "end of day" && git push` — offer your work to the repository

Your Git history becomes a log of your consciousness over time.

---

## Directory Structure

```
CODEX-MONAD/
├── index.html          # 🚪 START HERE - Main portal
├── apps/               # Individual tool applications
│   ├── pearl/          # Wisdom capture
│   ├── polywrite/      # Multi-dimensional editor  
│   ├── ark/            # Archive & reference
│   ├── pranayama/      # Breathing patterns
│   ├── oracle/         # Query interface
│   ├── din-files/      # Semantic file system
│   └── ...
├── data/               # Your personal data (gitignored by default)
├── scripts/            # CLI tools and automation
├── docs/               # Full documentation
└── lib/                # Shared libraries
```

---

## Data Privacy

**Your data stays yours.**

- All tools run locally in your browser
- No data is sent anywhere unless you push to Git
- The `data/` folder is gitignored by default—your personal content stays on your machine
- If you want to sync personal data across devices, you control that explicitly

---

## Customization

### Adding Your Own Tools
Drop any HTML file in `apps/` and it becomes accessible from the portal. No build step required.

### Theming
Edit `lib/styles.css` to change the look and feel across all tools.

### Data Location
By default, tools store data in browser localStorage. For persistent storage across browsers, use the `data/` folder and the provided save/load utilities.

---

## Troubleshooting

**Tools not loading?**
- Make sure you're opening `index.html` directly in a browser (not through a file manager preview)
- Some browsers restrict local file access. Try Firefox, or run a simple local server: `python -m http.server 8000`

**Sync conflicts?**
- Git will flag conflicts in the normal way
- For data files, the most recent timestamp usually wins
- Keep separate `data/` folders per device if you want isolation

**Need help?**
- Check `docs/INDEX.md` for full documentation
- Open an issue on GitHub
- Email: danielmobile001@gmail.com or dthoth@mac.com

---

## Contributing

This is free and open source software. Contributions welcome.

- Fork the repo
- Make your changes
- Submit a pull request
- Or just take what's useful and build your own thing

No formal process. No contributor agreements. Just humans helping humans.

---

## Credits & Contact

**Created by:** Daniel Thomas  
**Email:** danielmobile001@gmail.com | dthoth@mac.com  
**Web:** [locals.com/member/thothworks](https://locals.com/member/thothworks)

Built with love, coffee, and the belief that your tools should serve you—not the other way around.

---

## License

**The Unlicense + Attribution Request**

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

**One request:** If you build something cool with this, let me know. If you share it, a credit is appreciated but not required.

In jurisdictions that recognize copyright laws, the author dedicates any and all copyright interest in the software to the public domain.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---

## Final Thought

> "The tool should disappear into the task."

CODEX-MONAD isn't meant to be something you think about. It's meant to be something you think *with*. 

Open it. Use it. Forget it's there. 

Then notice, months later, that you've captured a thousand thoughts, written things you're proud of, and have a system that's entirely yours.

Welcome to the monad. 

**HINENI.** 🐉

---

*Last updated: January 2026*
