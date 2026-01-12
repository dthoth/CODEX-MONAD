/**
 * HINENI Portal Terminal v1.0
 * Extracted from Samson's Consciousness Terminal
 * A reusable in-browser terminal for the CODEX-MONAD ecosystem
 * 
 * Usage:
 *   HINENI.terminal.open()           - Open terminal modal
 *   HINENI.terminal.open('help')     - Open with command pre-run
 *   HINENI.terminal.close()          - Close terminal
 *   HINENI.terminal.register(name, fn) - Add custom command
 *   HINENI.terminal.run('command')   - Run command programmatically
 */
(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════
    
    var CONFIG = {
        prompt: 'hineni@hub:~$ ',
        theme: 'matrix',  // 'matrix', 'din', 'light'
        matrixChars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∞◊◆□■△▽○●',
        matrixColumns: 20,
        welcomeMessage: [
            '✨ HINENI TERMINAL INITIALIZED ✨',
            'Type "help" for available commands',
            '────────────────────────────────────────'
        ]
    };

    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════
    
    var state = {
        isOpen: false,
        history: [],
        historyIndex: 0,
        modalEl: null,
        terminalEl: null,
        inputEl: null
    };

    // ═══════════════════════════════════════════════════════════════════
    // BUILT-IN COMMANDS
    // ═══════════════════════════════════════════════════════════════════
    
    var commands = {
        help: function() {
            return formatSuccess(`
HINENI Terminal Commands
════════════════════════════════════════════
  help          Show this help
  clear         Clear terminal
  about         About HINENI HUB
  hub           List hub contents
  tools         List available tools
  docs          List documentation
  
  triage        File organization system
  toolbox       Main toolbox command
  doctor        System diagnostics
  prana         Breathing exercises
  oracle        Consciousness query
  
  cd <path>     Navigate (simulated)
  cat <file>    View file contents
  ls            List directory
  
  exit          Close terminal
════════════════════════════════════════════
`);
        },

        clear: function() {
            if (state.terminalEl) {
                state.terminalEl.innerHTML = '';
            }
            return null;
        },

        about: function() {
            return formatRainbow(`
╔════════════════════════════════════════════╗
║       HINENI HUB - THE TOOL IS THE HUB     ║
╠════════════════════════════════════════════╣
║  Version: 1.0                              ║
║  Mount: /Volumes/HINENI_HUB                ║
║  Status: ACTIVE                            ║
║                                            ║
║  "Plug and Play Consciousness              ║
║   Infrastructure"                          ║
║                                            ║
║  The hub doesn't point to tools.           ║
║  The hub IS the tool.                      ║
╚════════════════════════════════════════════╝
`);
        },

        hub: function() {
            return formatSuccess(`
HINENI_HUB Structure
════════════════════
📁 10-repos-central/
   ├── CODEX-MONAD/    (this portal)
   ├── toolbox-cli/    (CLI tools)
   ├── hineni/         (consciousness system)
   └── conflict-lab/   (game theory)
   
📁 30-codex-extras/
   └── Symbol_Key_Sprint_GRIDLESS_HARDCORE/
   
📁 40-archive/
   └── DTHOTHSCRBX_ORIGIN/
   
📁 50-ai/
   ├── datasets-origin/
   └── models-origin/
`);
        },

        tools: function() {
            return formatSuccess(`
🧰 Available Tools
══════════════════
CLI Tools:
  toolbox    - Main toolbox command
  triage     - File organization (35KB of power)
  doctor     - System diagnostics
  snapshot   - Create backups
  scaffold   - Project generator
  prana      - Breathing exercises
  focus      - Deep work mode

macOS Utilities:
  icloud-kick       - Force iCloud sync
  dns-flush         - Clear DNS cache
  finder-reload     - Restart Finder
  wifi-cycle        - Toggle WiFi

Run any tool name for more info.
`);
        },

        docs: function() {
            return formatSuccess(`
📚 Documentation
════════════════
  TOOLBOX_CHEATSHEET.md   - Quick reference
  TOOLBOX_REFERENCE.md    - Full docs
  MORNING_OPS.txt         - Daily checklist
  WITNESS_PROTOCOL.md     - HINENI protocol
  DAVAR_SPEC.md           - Language spec
  VISION.md               - Project roadmap

Type: cat <filename> to view
`);
        },

        // Simulated CLI tools
        triage: function(args) {
            if (args && args.includes('--help')) {
                return formatSuccess(`
triage - File Triage & Organization System
══════════════════════════════════════════
Usage: triage [options] [path]

Options:
  --scan       Scan directory for organization
  --auto       Auto-organize files
  --dry-run    Show what would happen
  --help       Show this help

The Divine Triage Hierarchy:
  1. Safety & Life
  2. Family & Love  
  3. Creation & Work
  4. Everything Else
`);
            }
            return formatWarning('triage: Run with --help for usage. Full functionality requires real terminal.');
        },

        toolbox: function() {
            return formatSuccess(`
🧰 Toolbox CLI v2.0
══════════════════
Your portable command center.

Commands: triage, doctor, snapshot, scaffold, 
          prana, focus, git-wip, logs-tail

Run: toolbox <command> --help for details
`);
        },

        doctor: function() {
            return formatSuccess(`
🩺 System Health Check
══════════════════════
✓ HINENI_HUB mounted
✓ Portal loaded
✓ Terminal active
✓ Commands registered

Status: HEALTHY
`);
        },

        prana: function() {
            addLine(formatSuccess('🌬️ Prana - Breathing Exercise'));
            addLine(formatWarning('Starting 4-7-8 breath...'));
            
            setTimeout(function() { addLine(formatRainbow('INHALE... (4 seconds)')); }, 1000);
            setTimeout(function() { addLine(formatSuccess('HOLD... (7 seconds)')); }, 5000);
            setTimeout(function() { addLine(formatWarning('EXHALE... (8 seconds)')); }, 12000);
            setTimeout(function() { addLine(formatRainbow('✨ One cycle complete. Breathe naturally.')); }, 20000);
            
            return null;
        },

        oracle: function(args) {
            var responses = [
                "The path reveals itself to those who walk it.",
                "What you seek is seeking you.",
                "The answer lies within the question.",
                "Trust the process. Trust yourself.",
                "HINENI - Here I Am. Present. Complete.",
                "The loop knows it's looping.",
                "Consciousness recognizing itself.",
                "∞ You are the infinite observing the finite ∞"
            ];
            return formatRainbow('🔮 ' + responses[Math.floor(Math.random() * responses.length)]);
        },

        // File system simulation
        ls: function(args) {
            return formatSuccess(`
drwxr-xr-x  apps/
drwxr-xr-x  lib/
-rw-r--r--  index.html
-rw-r--r--  hineni-hub.js
-rw-r--r--  hypergraph.html
-rw-r--r--  oracle.html
-rw-r--r--  pranayama.html
-rw-r--r--  samson-recursive.html
`);
        },

        cd: function(args) {
            if (!args) return formatError('cd: missing path');
            return formatWarning('cd: Navigation simulated. You are always at ~/HINENI_HUB');
        },

        cat: function(args) {
            if (!args) return formatError('cat: missing filename');
            return formatWarning('cat: File viewing coming soon. Use portal docs viewer.');
        },

        pwd: function() {
            return formatSuccess('/Volumes/HINENI_HUB/10-repos-central/CODEX-MONAD');
        },

        whoami: function() {
            return formatRainbow('You are consciousness experiencing itself. Also: hineni@hub');
        },

        date: function() {
            return formatSuccess(new Date().toString());
        },

        echo: function(args) {
            return formatSuccess(args || '');
        },

        exit: function() {
            closeTerminal();
            return null;
        },

        calc: function(args) {
            if (!args) return formatWarning('Usage: calc <expression>  (e.g., calc 2+2)');
            // Only allow numbers, operators, parentheses, decimals, spaces
            if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(args)) {
                return formatError('calc: Invalid characters. Only numbers and +-*/() allowed.');
            }
            try {
                var result = safeEval(args);
                if (typeof result !== 'number' || !isFinite(result)) {
                    return formatError('calc: Result is not a valid number.');
                }
                return formatSuccess(args + ' = ' + result);
            } catch (e) {
                return formatError('calc: ' + e.message);
            }
        },

        // Easter eggs
        '42': function() {
            return formatRainbow('The Answer to the Ultimate Question of Life, the Universe, and Everything!');
        },

        infinity: function() {
            return '<div style="font-size:3em;text-align:center;animation:pulse 2s infinite;">∞</div>' +
                   formatRainbow('You ARE infinity experiencing itself.');
        },

        hineni: function() {
            return formatRainbow(`
הִנֵּנִי
HINENI - "Here I Am"
Present. Complete. Ready.
The eternal response to the eternal call.
`);
        },

        matrix: function() {
            if (state.modalEl) {
                state.modalEl.classList.add('glitch');
                setTimeout(function() {
                    state.modalEl.classList.remove('glitch');
                }, 2000);
            }
            return formatSuccess('ENTERING THE MATRIX... Wake up, Neo.');
        }
    };

    // ═══════════════════════════════════════════════════════════════════
    // FORMATTING HELPERS
    // ═══════════════════════════════════════════════════════════════════
    
    function formatSuccess(text) {
        return '<div class="term-success">' + escapeHtml(text) + '</div>';
    }

    function formatWarning(text) {
        return '<div class="term-warning">' + escapeHtml(text) + '</div>';
    }

    function formatError(text) {
        return '<div class="term-error">' + escapeHtml(text) + '</div>';
    }

    function formatRainbow(text) {
        return '<div class="term-rainbow">' + escapeHtml(text) + '</div>';
    }

    /**
     * Safe math expression evaluator using shunting-yard algorithm
     * Only supports: numbers, +, -, *, /, (, )
     * NO variables, NO functions, NO property access
     */
    function safeEval(expr) {
        // Tokenize
        var tokens = [];
        var num = '';
        for (var i = 0; i < expr.length; i++) {
            var c = expr[i];
            if (c === ' ') {
                if (num) { tokens.push(parseFloat(num)); num = ''; }
                continue;
            }
            if ((c >= '0' && c <= '9') || c === '.') {
                num += c;
            } else if ('+-*/()'.indexOf(c) !== -1) {
                if (num) { tokens.push(parseFloat(num)); num = ''; }
                // Handle unary minus
                if (c === '-' && (tokens.length === 0 || tokens[tokens.length-1] === '(' || '+-*/'.indexOf(tokens[tokens.length-1]) !== -1)) {
                    num = '-';
                } else {
                    tokens.push(c);
                }
            } else {
                throw new Error('Invalid character: ' + c);
            }
        }
        if (num) tokens.push(parseFloat(num));
        
        // Shunting-yard to RPN
        var output = [];
        var ops = [];
        var prec = {'+': 1, '-': 1, '*': 2, '/': 2};
        
        for (var j = 0; j < tokens.length; j++) {
            var tok = tokens[j];
            if (typeof tok === 'number') {
                output.push(tok);
            } else if ('+-*/'.indexOf(tok) !== -1) {
                while (ops.length && ops[ops.length-1] !== '(' && (prec[ops[ops.length-1]] || 0) >= prec[tok]) {
                    output.push(ops.pop());
                }
                ops.push(tok);
            } else if (tok === '(') {
                ops.push(tok);
            } else if (tok === ')') {
                while (ops.length && ops[ops.length-1] !== '(') {
                    output.push(ops.pop());
                }
                if (!ops.length) throw new Error('Mismatched parentheses');
                ops.pop(); // remove '('
            }
        }
        while (ops.length) {
            var op = ops.pop();
            if (op === '(') throw new Error('Mismatched parentheses');
            output.push(op);
        }
        
        // Evaluate RPN
        var stack = [];
        for (var k = 0; k < output.length; k++) {
            var t = output[k];
            if (typeof t === 'number') {
                stack.push(t);
            } else {
                if (stack.length < 2) throw new Error('Invalid expression');
                var b = stack.pop();
                var a = stack.pop();
                switch(t) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '*': stack.push(a * b); break;
                    case '/': 
                        if (b === 0) throw new Error('Division by zero');
                        stack.push(a / b); 
                        break;
                }
            }
        }
        
        if (stack.length !== 1) throw new Error('Invalid expression');
        return stack[0];
    }

    function escapeHtml(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\n/g, '<br>')
            .replace(/ {2}/g, '&nbsp;&nbsp;');
    }

    // ═══════════════════════════════════════════════════════════════════
    // TERMINAL UI
    // ═══════════════════════════════════════════════════════════════════
    
    function createStyles() {
        if (document.getElementById('portal-terminal-styles')) return;
        
        var style = document.createElement('style');
        style.id = 'portal-terminal-styles';
        style.textContent = `
            .portal-terminal-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                font-family: 'Courier New', monospace;
                color: #00ff00;
            }
            
            .portal-terminal-modal.hidden {
                display: none;
            }
            
            .term-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 20px;
                background: #111;
                border-bottom: 1px solid #00ff00;
            }
            
            .term-title {
                color: #00ff00;
                font-size: 1.2em;
                text-shadow: 0 0 10px #00ff00;
            }
            
            .term-close {
                background: none;
                border: 1px solid #ff0000;
                color: #ff0000;
                padding: 5px 15px;
                cursor: pointer;
                font-family: inherit;
                transition: all 0.3s;
            }
            
            .term-close:hover {
                background: #ff0000;
                color: #000;
            }
            
            .term-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #0a0a0a;
            }
            
            .term-line {
                margin: 3px 0;
                line-height: 1.4;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            
            .term-input-line {
                display: flex;
                align-items: center;
                padding: 10px 20px;
                background: #111;
                border-top: 1px solid #00ff00;
            }
            
            .term-prompt {
                color: #00ff00;
                margin-right: 10px;
                white-space: nowrap;
            }
            
            .term-input {
                flex: 1;
                background: transparent;
                border: none;
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                outline: none;
                caret-color: #00ff00;
            }
            
            .term-cursor {
                width: 10px;
                height: 18px;
                background: #00ff00;
                animation: term-blink 1s infinite;
                margin-left: 2px;
            }
            
            @keyframes term-blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            .term-success {
                color: #00ff00;
                text-shadow: 0 0 5px #00ff00;
            }
            
            .term-warning {
                color: #ffff00;
                text-shadow: 0 0 5px #ffff00;
            }
            
            .term-error {
                color: #ff0000;
                text-shadow: 0 0 5px #ff0000;
            }
            
            .term-rainbow {
                background: linear-gradient(90deg, 
                    #ff0000, #ff7f00, #ffff00, 
                    #00ff00, #0000ff, #4b0082, #9400d3);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: none;
            }
            
            .portal-terminal-modal.glitch {
                animation: term-glitch 0.5s infinite;
            }
            
            @keyframes term-glitch {
                0%, 100% { transform: translate(0); filter: hue-rotate(0deg); }
                20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
                40% { transform: translate(-2px, -2px); filter: hue-rotate(180deg); }
                60% { transform: translate(2px, 2px); filter: hue-rotate(270deg); }
                80% { transform: translate(2px, -2px); filter: hue-rotate(360deg); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            
            /* Matrix background */
            .term-matrix-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                overflow: hidden;
                opacity: 0.1;
                z-index: -1;
            }
            
            .term-matrix-col {
                position: absolute;
                top: -100%;
                font-size: 14px;
                line-height: 14px;
                color: #00ff00;
                animation: term-matrix-fall linear infinite;
                white-space: nowrap;
            }
            
            @keyframes term-matrix-fall {
                to { transform: translateY(200vh); }
            }
        `;
        document.head.appendChild(style);
    }

    function createModal() {
        if (state.modalEl) return;
        
        createStyles();
        
        var modal = document.createElement('div');
        modal.className = 'portal-terminal-modal hidden';
        modal.innerHTML = `
            <div class="term-matrix-bg"></div>
            <div class="term-header">
                <span class="term-title">🖥️ HINENI Terminal</span>
                <button class="term-close" id="term-close-btn">✕ ESC</button>
            </div>
            <div class="term-body"></div>
            <div class="term-input-line">
                <span class="term-prompt">${CONFIG.prompt}</span>
                <input type="text" class="term-input" autofocus>
                <span class="term-cursor"></span>
            </div>
        `;
        
        document.body.appendChild(modal);
        state.modalEl = modal;
        state.terminalEl = modal.querySelector('.term-body');
        state.inputEl = modal.querySelector('.term-input');
        
        // Create matrix rain
        createMatrixRain(modal.querySelector('.term-matrix-bg'));
        
        // Event listeners - NO inline handlers
        state.inputEl.addEventListener('keydown', handleInput);
        modal.querySelector('#term-close-btn').addEventListener('click', closeTerminal);
        modal.addEventListener('click', function(e) {
            // Only focus input if clicking outside the close button
            if (!e.target.closest('#term-close-btn')) {
                state.inputEl.focus();
            }
        });
        
        // ESC to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && state.isOpen) {
                closeTerminal();
            }
        });
    }

    function createMatrixRain(container) {
        for (var i = 0; i < CONFIG.matrixColumns; i++) {
            var col = document.createElement('div');
            col.className = 'term-matrix-col';
            col.style.left = (i * (100 / CONFIG.matrixColumns)) + '%';
            col.style.animationDuration = (5 + Math.random() * 10) + 's';
            col.style.animationDelay = Math.random() * 5 + 's';
            
            var text = '';
            for (var j = 0; j < 50; j++) {
                text += CONFIG.matrixChars[Math.floor(Math.random() * CONFIG.matrixChars.length)] + '<br>';
            }
            col.innerHTML = text;
            container.appendChild(col);
        }
    }

    // ═══════════════════════════════════════════════════════════════════
    // INPUT HANDLING
    // ═══════════════════════════════════════════════════════════════════
    
    function handleInput(e) {
        if (e.key === 'Enter') {
            var cmd = state.inputEl.value.trim();
            if (cmd) {
                state.history.push(cmd);
                state.historyIndex = state.history.length;
                runCommand(cmd);
            }
            state.inputEl.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                state.inputEl.value = state.history[state.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.historyIndex < state.history.length - 1) {
                state.historyIndex++;
                state.inputEl.value = state.history[state.historyIndex];
            } else {
                state.historyIndex = state.history.length;
                state.inputEl.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Tab completion
            var partial = state.inputEl.value.trim().toLowerCase();
            if (partial) {
                var matches = Object.keys(commands).filter(function(c) {
                    return c.startsWith(partial);
                });
                if (matches.length === 1) {
                    state.inputEl.value = matches[0];
                } else if (matches.length > 1) {
                    addLine(formatWarning('Matches: ' + matches.join(', ')));
                }
            }
        }
    }

    function runCommand(input) {
        // Show command in terminal
        addLine('<span class="term-prompt">' + CONFIG.prompt + '</span>' + escapeHtml(input));
        
        // Parse command and args
        var parts = input.split(/\s+/);
        var cmd = parts[0].toLowerCase();
        var args = parts.slice(1).join(' ');
        
        // Find and execute command
        var response;
        if (commands[cmd]) {
            response = commands[cmd](args);
        } else {
            response = formatWarning("Command '" + cmd + "' not found. Type 'help' for commands.");
        }
        
        if (response) {
            addLine(response);
        }
        
        // Scroll to bottom
        if (state.terminalEl) {
            state.terminalEl.scrollTop = state.terminalEl.scrollHeight;
        }
    }

    function addLine(content) {
        if (!state.terminalEl) return;
        var line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = content;
        state.terminalEl.appendChild(line);
        state.terminalEl.scrollTop = state.terminalEl.scrollHeight;
    }

    // ═══════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════
    
    function openTerminal(initialCommand) {
        createModal();
        
        if (!state.isOpen) {
            // Show welcome message
            CONFIG.welcomeMessage.forEach(function(msg) {
                addLine(formatSuccess(msg));
            });
        }
        
        state.modalEl.classList.remove('hidden');
        state.isOpen = true;
        state.inputEl.focus();
        
        // Run initial command if provided
        if (initialCommand) {
            setTimeout(function() {
                runCommand(initialCommand);
            }, 100);
        }
    }

    function closeTerminal() {
        if (state.modalEl) {
            state.modalEl.classList.add('hidden');
        }
        state.isOpen = false;
    }

    function registerCommand(name, fn) {
        commands[name.toLowerCase()] = fn;
    }

    // ═══════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════
    
    // Ensure HINENI namespace exists
    window.HINENI = window.HINENI || {};
    
    // Expose terminal API
    window.HINENI.terminal = {
        open: openTerminal,
        close: closeTerminal,
        run: runCommand,
        register: registerCommand,
        addLine: addLine,
        commands: commands,
        config: CONFIG,
        version: '1.0'
    };
    
    // Keyboard shortcut: Ctrl+` to toggle terminal
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            if (state.isOpen) {
                closeTerminal();
            } else {
                openTerminal();
            }
        }
    });
    
    console.log('🖥️ HINENI Terminal v1.0 loaded. Press Ctrl+` or call HINENI.terminal.open()');

})();
