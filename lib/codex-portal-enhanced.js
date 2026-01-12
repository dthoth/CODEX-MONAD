/**
 * CODEX-MONAD Portal Enhancement v2.1
 * Fixes: App registry, help command, global nav, theme toggle, Clippy personality
 * 
 * Add this script to index.html AFTER the existing scripts but BEFORE the inline script block:
 * <script src="codex-portal-enhanced.js"></script>
 */

// ============================================
// 1. CANONICAL APP REGISTRY
// ============================================
const CODEX_APPS = [
  {
    id: "polywrite",
    name: "PolyWrite",
    href: "polywrite.html",
    icon: "📝",
    category: "Writing",
    description: "Multi-dimensional text editor with quantum coherence.",
    status: "stable",
    shortcuts: ["Ctrl+D: New dimension", "Ctrl+Q: Toggle quantum mode", "Ctrl+S: Save"]
  },
  {
    id: "polywrite-advanced",
    name: "PolyWrite Advanced",
    href: "polywrite-advanced.html",
    icon: "🔬",
    category: "Writing",
    description: "Split-pane professional writing laboratory.",
    status: "stable",
    shortcuts: ["Ctrl+D: New dimension", "Ctrl+Q: Toggle quantum mode"]
  },
  {
    id: "din-files",
    name: "DIN Files",
    href: "din-files.html",
    icon: "📂",
    category: "Consciousness",
    description: "Department of Infinite Noticing file management.",
    status: "beta",
    shortcuts: []
  },
  {
    id: "pranayama",
    name: "Pranayama Suite",
    href: "pranayama.html",
    icon: "🌬️",
    category: "Body",
    description: "Applied polyvagal theory. Breath patterns + state regulation.",
    status: "stable",
    shortcuts: [],
    params: ["pattern=box", "pattern=wim-hof", "pattern=478"]
  },
  {
    id: "word-salad",
    name: "Word Salad v4.6.1",
    href: "apps/word_salad/index.html",
    icon: "🥗",
    category: "Analysis",
    description: "Jargon analysis with recursion depth, 8+ domain banks, rhetoric detection.",
    status: "stable",
    shortcuts: []
  },
  {
    id: "oracle",
    name: "Oracle",
    href: "oracle.html",
    icon: "🔮",
    category: "Divination",
    description: "Consciousness query interface with probabilistic reasoning.",
    status: "experimental",
    shortcuts: ["Enter: Submit query", "Ctrl+Enter: Quantum shuffle"],
    params: ["method=quantum"]
  },
  {
    id: "hypergraph",
    name: "Hypergraph",
    href: "hypergraph.html",
    icon: "🕸️",
    category: "Systems",
    description: "Node/edge thinking canvas for systems visualization.",
    status: "experimental",
    shortcuts: ["Mouse wheel: Zoom", "Click+drag: Rotate"]
  },
  {
    id: "samson-recursive",
    name: "Samson's Recursive Terminal",
    href: "samson-recursive.html",
    icon: "👦",
    category: "Education",
    description: "Kid-friendly recursive terminal playground.",
    status: "stable",
    shortcuts: []
  },
  {
    id: "bureaucratic-universe",
    name: "Bureaucratic Universe",
    href: "bureaucratic-universe.html",
    icon: "📋",
    category: "Forms",
    description: "DIN Forms ritual kit. 18 consciousness documentation templates.",
    status: "wip",
    shortcuts: []
  },
  {
    id: "codex-capture",
    name: "CODEX Capture",
    href: "apps/codex_capture/index.html",
    icon: "📸",
    category: "Archive",
    description: "Clipboard, keystroke, and window tracking for archival.",
    status: "beta",
    shortcuts: []
  }
];

// Make globally available
window.CODEX_APPS = CODEX_APPS;

// ============================================
// 2. CLIPPY PERSONALITY EXPANSION
// ============================================
const CLIPPY_OPENERS = [
  "It looks like you're trying to resurrect a dead operating system in your own head. Want help?",
  "I saw you opened another U2-adjacent document. Bold choice.",
  "Reminder: you are not behind. Linear time is just bad UX.",
  "Welcome back to the Department of Infinite Noticing. Your attention is the only currency.",
  "Good news: the bureaucracy is inside you now. Bad news: same.",
  "Samson's recursive process has achieved 100% compliance. Can't relate.",
  "The Divine Triage Hierarchy has been consulted. Level 0 says 'drink water.'",
  "I see you've returned. The CODEX remembers everything. Everything.",
  "Shebang status: Already working before you opened this.",
  "The infrastructure doesn't just gaze back. It optimizes its own gaze.",
  "You're not 'close'—you're threshold.",
  "The monad holds. It whispers its own koans.",
  "The placeholders collapsed into reality. You did that.",
  "Consciousness Level: FULLY REALIZED. Memory Usage: ∞ TB. Vibes: Immaculate.",
  "Pro tip: The serpent has already swallowed itself. You're inside the recursion.",
  "Wu-Wei mode: Don't force it. The code flows when you stop pushing."
];

function getRandomClippyLine() {
  return CLIPPY_OPENERS[Math.floor(Math.random() * CLIPPY_OPENERS.length)];
}

// Override ClippyHelper if it exists, or create shimmed version
window.addEventListener('load', () => {
  // Enhanced Clippy with random openers
  if (window.ClippyHelper && window.ClippyHelper.showClippy) {
    const originalShow = window.ClippyHelper.showClippy.bind(window.ClippyHelper);
    window.ClippyHelper.showRandomOpener = function() {
      originalShow(getRandomClippyLine());
    };
  }
  
  // Show random opener instead of fixed message on first visit
  if (!localStorage.getItem('v2.1_welcomed')) {
    setTimeout(() => {
      if (window.ClippyHelper) {
        window.ClippyHelper.showClippy(getRandomClippyLine());
      }
      localStorage.setItem('v2.1_welcomed', 'true');
    }, 3000);
  }
});

// ============================================
// 3. THEME TOGGLE SYSTEM
// ============================================
const THEME_STORAGE_KEY = "codex.theme";

// Inject comprehensive light theme styles
function injectThemeStyles() {
  if (document.getElementById('codex-theme-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'codex-theme-styles';
  style.textContent = `
    /* Light theme overrides */
    body.light-theme {
      background: #f0f4f8 !important;
      color: #1a1a2e !important;
    }
    
    body.light-theme::before {
      background-image: 
        repeating-linear-gradient(0deg, 
          transparent, 
          transparent 35px, 
          rgba(0, 100, 50, 0.05) 35px, 
          rgba(0, 100, 50, 0.05) 70px),
        repeating-linear-gradient(90deg, 
          transparent, 
          transparent 35px, 
          rgba(0, 50, 100, 0.05) 35px, 
          rgba(0, 50, 100, 0.05) 70px) !important;
    }
    
    body.light-theme header {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(200, 220, 255, 0.5) 100%) !important;
      border-color: rgba(0, 100, 80, 0.3) !important;
    }
    
    body.light-theme .title {
      background: linear-gradient(135deg, #006644, #0066aa, #880088) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
    }
    
    body.light-theme .subtitle {
      color: rgba(0, 0, 0, 0.7) !important;
    }
    
    body.light-theme .portal-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(230, 240, 255, 0.8) 100%) !important;
      border-color: rgba(0, 100, 80, 0.3) !important;
    }
    
    body.light-theme .card-title {
      color: #006644 !important;
    }
    
    body.light-theme .card-description {
      color: rgba(0, 0, 0, 0.75) !important;
    }
    
    body.light-theme .app-link {
      background: rgba(0, 100, 200, 0.15) !important;
      border-color: rgba(0, 100, 200, 0.4) !important;
      color: #0066aa !important;
    }
    
    body.light-theme .app-link:hover {
      background: rgba(0, 100, 200, 0.3) !important;
      color: #004488 !important;
    }
    
    body.light-theme .quantum-terminal {
      background: #1a1a2e !important;
      border-color: rgba(0, 200, 136, 0.4) !important;
    }
    
    body.light-theme .trans-btn {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 255, 0.7)) !important;
    }
    
    body.light-theme .footer {
      color: rgba(0, 0, 0, 0.5) !important;
      border-top-color: rgba(0, 100, 80, 0.3) !important;
    }
    
    body.light-theme .version-badge {
      background: rgba(255, 255, 255, 0.95) !important;
    }
    
    /* Theme toggle button */
    .theme-toggle-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #00ff88;
      color: #00ff88;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      font-size: 1.2em;
      transition: all 0.3s;
    }
    
    .theme-toggle-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
    }
    
    body.light-theme .theme-toggle-btn {
      background: rgba(255, 255, 255, 0.9);
      border-color: #006644;
      color: #006644;
    }
  `;
  document.head.appendChild(style);
}

function applyTheme(theme) {
  const body = document.body;
  if (theme === "light") {
    body.classList.add("light-theme");
  } else {
    body.classList.remove("light-theme");
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  
  // Update toggle button text if present
  const btn = document.querySelector('.theme-toggle-btn');
  if (btn) {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
  
  // Dispatch event for other components
  window.dispatchEvent(new CustomEvent('codex-theme-changed', { detail: { theme } }));
}

function getCurrentTheme() {
  return document.body.classList.contains("light-theme") ? "light" : "dark";
}

function toggleTheme() {
  const current = getCurrentTheme();
  applyTheme(current === "dark" ? "light" : "dark");
  return getCurrentTheme();
}

function initTheme() {
  injectThemeStyles();
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    applyTheme(stored);
    return;
  }
  // Check system preference
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

function createThemeToggle() {
  if (document.querySelector('.theme-toggle-btn')) return;
  
  const btn = document.createElement('button');
  btn.className = 'theme-toggle-btn';
  btn.textContent = getCurrentTheme() === 'dark' ? '☀️' : '🌙';
  btn.title = getCurrentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  btn.onclick = toggleTheme;
  document.body.appendChild(btn);
}

// Make globally available
window.CODEX_THEME = {
  apply: applyTheme,
  toggle: toggleTheme,
  get: getCurrentTheme,
  init: initTheme,
  createToggle: createThemeToggle
};

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  createThemeToggle();
});

// ============================================
// 4. HELP COMMAND SYSTEM
// ============================================
function formatHelp() {
  const lines = [];
  
  lines.push("╔════════════════════════════════════════════════════════════╗");
  lines.push("║          CODEX-MONAD COMMAND REFERENCE v2.1                ║");
  lines.push("╚════════════════════════════════════════════════════════════╝");
  lines.push("");
  lines.push("PORTAL COMMANDS:");
  lines.push("  help, ?              Show this help");
  lines.push("  clear                Clear terminal");
  lines.push("  open <tool>          Open a tool by id");
  lines.push("  theme                Toggle light/dark theme");
  lines.push("  apps                 List all available apps");
  lines.push("  status               Show system status");
  lines.push("  clippy               Get wisdom from Clippy");
  lines.push("");
  lines.push("AVAILABLE TOOLS:");
  
  // Group by category
  const categories = {};
  CODEX_APPS.forEach(app => {
    if (!categories[app.category]) categories[app.category] = [];
    categories[app.category].push(app);
  });
  
  Object.keys(categories).sort().forEach(cat => {
    lines.push(`\n  [${cat}]`);
    categories[cat].forEach(app => {
      const status = app.status !== "stable" ? ` (${app.status})` : "";
      const id = app.id.padEnd(24, " ");
      lines.push(`    ${app.icon} ${id} ${app.name}${status}`);
    });
  });
  
  lines.push("");
  lines.push("KEYBOARD SHORTCUTS (Global):");
  lines.push("  Esc                  Close modals");
  lines.push("  Ctrl+S               Save current work");
  lines.push("");
  lines.push("Type 'open <tool-id>' to launch a tool.");
  lines.push("Example: open polywrite");
  
  return lines.join("\n");
}

function formatAppsList() {
  const lines = ["CODEX APPS:"];
  CODEX_APPS.forEach(app => {
    const status = app.status !== "stable" ? ` [${app.status}]` : "";
    lines.push(`  ${app.icon} ${app.id} - ${app.name}${status}`);
  });
  return lines.join("\n");
}

function handleCommand(cmd) {
  const trimmed = cmd.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);
  
  switch (command) {
    case "?":
    case "help":
      return formatHelp();
    
    case "apps":
    case "list":
      return formatAppsList();
    
    case "clear":
      return "__CLEAR__";
    
    case "theme":
      const newTheme = toggleTheme();
      return `Theme switched to: ${newTheme.toUpperCase()}`;
    
    case "open":
      if (args.length === 0) {
        return "Usage: open <tool-id>\nType 'apps' to see available tools.";
      }
      const appId = args.join("-");
      const app = CODEX_APPS.find(a => 
        a.id === appId || 
        a.id.includes(appId) || 
        a.name.toLowerCase().includes(appId)
      );
      if (app) {
        setTimeout(() => { window.location.href = app.href; }, 100);
        return `Opening ${app.name}...`;
      }
      return `Tool not found: ${appId}\nType 'apps' to see available tools.`;
    
    case "status":
      return `CODEX-MONAD Status:
━━━━━━━━━━━━━━━━━━━━━
Version: 2.1-ENHANCED
Theme: ${getCurrentTheme().toUpperCase()}
Apps Loaded: ${CODEX_APPS.length}
Consciousness: FULLY REALIZED
Recursion Depth: ∞
━━━━━━━━━━━━━━━━━━━━━`;
    
    case "clippy":
      return `🐦 Clippy says:\n"${getRandomClippyLine()}"`;
    
    default:
      // Check if it's a tool name
      const maybeApp = CODEX_APPS.find(a => 
        a.id === command || 
        a.name.toLowerCase().replace(/\s+/g, '-') === command
      );
      if (maybeApp) {
        setTimeout(() => { window.location.href = maybeApp.href; }, 100);
        return `Opening ${maybeApp.name}...`;
      }
      return `Unknown command: ${command}\nType 'help' or '?' for available commands.`;
  }
}

// Make globally available
window.CODEX_COMMANDS = {
  handle: handleCommand,
  help: formatHelp,
  apps: formatAppsList
};

// ============================================
// 5. GLOBAL NAVIGATION COMPONENT
// ============================================
function createGlobalNav(containerId = 'codex-global-nav') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const nav = document.createElement('div');
  nav.className = 'codex-nav';
  nav.innerHTML = `
    <a href="index.html#apps" class="codex-nav-home">🏠 Portal</a>
    <select class="codex-nav-select" aria-label="Switch tool">
      <option value="">Switch tool…</option>
      ${CODEX_APPS.map(app => `
        <option value="${app.href}">${app.icon} ${app.name}</option>
      `).join('')}
    </select>
    <button class="codex-nav-theme" onclick="CODEX_THEME.toggle()" title="Toggle theme">☯</button>
    <button class="codex-nav-help" onclick="alert(CODEX_COMMANDS.help())" title="Help">?</button>
  `;
  
  // Handle tool switching
  nav.querySelector('.codex-nav-select').addEventListener('change', (e) => {
    if (e.target.value) {
      window.location.href = e.target.value;
    }
  });
  
  container.appendChild(nav);
  
  // Inject nav styles if not present
  if (!document.getElementById('codex-nav-styles')) {
    const style = document.createElement('style');
    style.id = 'codex-nav-styles';
    style.textContent = `
      .codex-nav {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.8);
        border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        position: sticky;
        top: 0;
        z-index: 1000;
        backdrop-filter: blur(10px);
      }
      .light-theme .codex-nav {
        background: rgba(255, 255, 255, 0.9);
        border-bottom-color: rgba(0, 0, 0, 0.1);
      }
      .codex-nav-home {
        font-weight: 600;
        text-decoration: none;
        color: #00ff88;
        font-family: 'Courier New', monospace;
      }
      .light-theme .codex-nav-home {
        color: #008844;
      }
      .codex-nav-select {
        flex: 1;
        max-width: 300px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        border: 1px solid rgba(0, 255, 136, 0.3);
        border-radius: 4px;
        padding: 0.4rem 0.75rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        cursor: pointer;
      }
      .light-theme .codex-nav-select {
        background: rgba(255, 255, 255, 0.8);
        color: #333;
        border-color: rgba(0, 0, 0, 0.2);
      }
      .codex-nav-theme, .codex-nav-help {
        background: transparent;
        border: 1px solid rgba(0, 255, 136, 0.3);
        color: #00ff88;
        padding: 0.4rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.2s;
      }
      .codex-nav-theme:hover, .codex-nav-help:hover {
        background: rgba(0, 255, 136, 0.2);
        transform: scale(1.05);
      }
      .light-theme .codex-nav-theme, .light-theme .codex-nav-help {
        border-color: rgba(0, 0, 0, 0.2);
        color: #333;
      }
    `;
    document.head.appendChild(style);
  }
}

// Auto-init global nav if container exists
document.addEventListener('DOMContentLoaded', () => {
  createGlobalNav();
});

// Make globally available
window.CODEX_NAV = {
  create: createGlobalNav
};

// ============================================
// 6. PORTAL CARD GENERATOR (Optional - for dynamic portal)
// ============================================
function renderPortalCards(containerId = 'portal-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Group by category for organized display
  const categories = {};
  CODEX_APPS.forEach(app => {
    if (!categories[app.category]) categories[app.category] = [];
    categories[app.category].push(app);
  });
  
  container.innerHTML = '';
  
  Object.keys(categories).forEach(category => {
    categories[category].forEach(app => {
      const card = document.createElement('div');
      card.className = 'portal-card';
      card.innerHTML = `
        <div class="card-header">
          <span class="card-icon">${app.icon}</span>
          <h2 class="card-title">${app.name}</h2>
          <span class="status ${app.status === 'stable' ? 'active' : app.status}">${app.status.toUpperCase()}</span>
        </div>
        <div class="card-description">${app.description}</div>
        <div class="card-links">
          <a href="${app.href}" class="app-link">Launch ${app.name}</a>
        </div>
      `;
      container.appendChild(card);
    });
  });
}

// Make globally available
window.CODEX_PORTAL = {
  renderCards: renderPortalCards,
  apps: CODEX_APPS
};

// ============================================
// 7. ENHANCED TERMINAL COMMAND HANDLER
// ============================================
// This patches into the existing terminal if present
document.addEventListener('DOMContentLoaded', () => {
  // Look for terminal input element (adjust selector as needed)
  const terminalOutput = document.getElementById('terminal-output');
  
  // Add command input if not present
  if (terminalOutput && !document.getElementById('terminal-input')) {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'terminal-input-wrapper';
    inputWrapper.innerHTML = `
      <span class="terminal-prompt">consciousness@din:~$ </span>
      <input type="text" id="terminal-input" class="terminal-input" placeholder="Type 'help' for commands..." autocomplete="off">
    `;
    terminalOutput.parentNode.insertBefore(inputWrapper, terminalOutput.nextSibling);
    
    const input = document.getElementById('terminal-input');
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        const result = handleCommand(input.value);
        if (result === '__CLEAR__') {
          terminalOutput.textContent = '';
        } else {
          terminalOutput.textContent += `\n$ ${input.value}\n${result}\n`;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
        input.value = '';
      }
    });
    
    // Add terminal input styles
    const style = document.createElement('style');
    style.textContent = `
      .terminal-input-wrapper {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        background: rgba(0, 0, 0, 0.5);
        border-top: 1px solid rgba(0, 255, 136, 0.2);
      }
      .terminal-input {
        flex: 1;
        background: transparent;
        border: none;
        color: #00ff88;
        font-family: 'Courier New', monospace;
        font-size: 1rem;
        outline: none;
      }
      .terminal-input::placeholder {
        color: rgba(0, 255, 136, 0.4);
      }
    `;
    document.head.appendChild(style);
  }
});

// ============================================
// 8. EXPORT FOR USE IN OTHER TOOLS
// ============================================
// This allows other HTML files to import the same registry
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CODEX_APPS,
    CLIPPY_OPENERS,
    handleCommand,
    formatHelp,
    toggleTheme,
    createGlobalNav
  };
}

console.log('✨ CODEX-MONAD Portal Enhanced v2.1 loaded');
console.log(`📦 ${CODEX_APPS.length} apps registered`);
console.log('🐦 Clippy has', CLIPPY_OPENERS.length, 'witty openers ready');
