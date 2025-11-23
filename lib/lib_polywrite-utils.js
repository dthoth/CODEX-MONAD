// lib/polywrite-utils.js - Essential Writing Utilities
// 💎🔥🐍⚡ The tools you actually use!

class PolyWriteUtils {
  constructor() {
    this.initialized = false;
  }
  
  // Initialize utility bar in PolyWrite
  initializeUtilityBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const utilityBar = document.createElement('div');
    utilityBar.className = 'polywrite-utility-bar';
    utilityBar.innerHTML = `
      <div class="utility-section">
        <button onclick="PolyWriteUtils.insertTimestamp()" data-tooltip="insert-timestamp" class="util-btn">
          🕐 Timestamp
        </button>
        <button onclick="PolyWriteUtils.insertDivider()" data-tooltip="insert-divider" class="util-btn">
          ➖ Divider
        </button>
        <button onclick="PolyWriteUtils.insertUUID()" data-tooltip="generate-uuid" class="util-btn">
          🔑 UUID
        </button>
        <button onclick="PolyWriteUtils.randomNumber()" data-tooltip="random-number" class="util-btn">
          🎲 Random
        </button>
      </div>
      
      <div class="utility-section">
        <button onclick="PolyWriteUtils.insertDate()" class="util-btn">
          📅 Date
        </button>
        <button onclick="PolyWriteUtils.insertCheckbox()" class="util-btn">
          ☑️ Checkbox
        </button>
        <button onclick="PolyWriteUtils.insertTable()" class="util-btn">
          📊 Table
        </button>
        <button onclick="PolyWriteUtils.wordCount()" class="util-btn">
          📏 Count
        </button>
      </div>
      
      <div class="utility-section">
        <button onclick="PolyWriteUtils.toggleTheme()" class="util-btn">
          🌓 Theme
        </button>
        <button onclick="PolyWriteUtils.toggleFullscreen()" class="util-btn">
          🖥️ Full
        </button>
        <button onclick="PolyWriteUtils.openMultiWindow()" class="util-btn">
          📑 Multi
        </button>
        <button onclick="PolyWriteUtils.toggleHelp()" class="util-btn">
          ❓ Help
        </button>
      </div>
    `;
    
    // Add styles
    if (!document.getElementById('polywrite-utils-styles')) {
      const style = document.createElement('style');
      style.id = 'polywrite-utils-styles';
      style.innerHTML = `
        .polywrite-utility-bar {
          display: flex;
          gap: 20px;
          padding: 10px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(0, 255, 136, 0.3);
          border-radius: 8px;
          margin-bottom: 15px;
          flex-wrap: wrap;
        }
        
        .utility-section {
          display: flex;
          gap: 8px;
        }
        
        .util-btn {
          background: rgba(0, 136, 255, 0.2);
          border: 1px solid rgba(0, 136, 255, 0.4);
          color: #00aaff;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          white-space: nowrap;
        }
        
        .util-btn:hover {
          background: rgba(0, 136, 255, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 136, 255, 0.3);
        }
        
        .multi-window {
          position: fixed;
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #00ff88;
          border-radius: 10px;
          padding: 20px;
          min-width: 400px;
          min-height: 300px;
          resize: both;
          overflow: auto;
          z-index: 1000;
        }
        
        .multi-window-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(0, 255, 136, 0.3);
        }
        
        .multi-window-title {
          color: #00ff88;
          font-size: 1.1em;
        }
        
        .multi-window-close {
          background: rgba(255, 0, 0, 0.3);
          border: 1px solid #ff0000;
          color: #ff6b6b;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .multi-window-content {
          width: 100%;
          height: calc(100% - 50px);
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 4px;
          padding: 10px;
          color: #fff;
          font-family: 'Courier New', monospace;
          resize: none;
        }
        
        /* Theme styles */
        body.light-theme {
          background: #f0f0f0;
          color: #333;
        }
        
        body.light-theme .util-btn {
          background: rgba(0, 100, 200, 0.1);
          border-color: rgba(0, 100, 200, 0.5);
          color: #0066cc;
        }
      `;
      document.head.appendChild(style);
    }
    
    container.prepend(utilityBar);
    this.initialized = true;
  }
  
  // Insert timestamp at cursor
  static insertTimestamp() {
    const timestamp = new Date().toLocaleString();
    this.insertAtCursor(`[${timestamp}] `);
  }
  
  // Insert divider line
  static insertDivider() {
    this.insertAtCursor('\n' + '─'.repeat(50) + '\n');
  }
  
  // Generate and insert UUID
  static insertUUID() {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    this.insertAtCursor(uuid);
  }
  
  // Generate random number
  static randomNumber() {
    const min = prompt('Minimum value:', '1');
    const max = prompt('Maximum value:', '100');
    if (min && max) {
      const random = Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
      this.insertAtCursor(random.toString());
    }
  }
  
  // Insert current date
  static insertDate() {
    const date = new Date().toLocaleDateString();
    this.insertAtCursor(date);
  }
  
  // Insert checkbox
  static insertCheckbox() {
    this.insertAtCursor('☐ ');
  }
  
  // Insert table template
  static insertTable() {
    const table = '\n| Column 1 | Column 2 | Column 3 |\n' +
                  '|----------|----------|----------|\n' +
                  '| Data 1   | Data 2   | Data 3   |\n' +
                  '| Data 4   | Data 5   | Data 6   |\n';
    this.insertAtCursor(table);
  }
  
  // Count words in active editor
  static wordCount() {
    const activeEditor = document.activeElement;
    if (activeEditor && (activeEditor.tagName === 'TEXTAREA' || activeEditor.contentEditable === 'true')) {
      const text = activeEditor.value || activeEditor.textContent;
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      const chars = text.length;
      const lines = text.split('\n').length;
      
      alert(`📊 Document Statistics:\n\nWords: ${words}\nCharacters: ${chars}\nLines: ${lines}`);
    }
  }
  
  // Toggle light/dark theme
  static toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('polywrite_theme', isLight ? 'light' : 'dark');
    
    if (window.ClippyHelper) {
      window.ClippyHelper.showClippy(`Switched to ${isLight ? 'light' : 'dark'} theme`);
    }
  }
  
  // Toggle fullscreen
  static toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  
  // Open multiple editor windows
  static openMultiWindow() {
    const windowCount = document.querySelectorAll('.multi-window').length;
    
    const multiWindow = document.createElement('div');
    multiWindow.className = 'multi-window';
    multiWindow.style.top = (50 + windowCount * 30) + 'px';
    multiWindow.style.left = (50 + windowCount * 30) + 'px';
    
    multiWindow.innerHTML = `
      <div class="multi-window-header">
        <span class="multi-window-title">Editor ${windowCount + 1}</span>
        <button class="multi-window-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      </div>
      <textarea class="multi-window-content" placeholder="Start writing in dimension ${windowCount + 1}..."></textarea>
    `;
    
    document.body.appendChild(multiWindow);
    
    // Make draggable
    this.makeDraggable(multiWindow);
    
    if (window.ClippyHelper) {
      window.ClippyHelper.showClippy(`Opened editor window ${windowCount + 1}. Drag to move, resize from corners.`);
    }
  }
  
  // Toggle help
  static toggleHelp() {
    if (window.ClippyHelper) {
      window.ClippyHelper.toggleHelpMode();
    }
  }
  
  // Helper: Insert text at cursor position
  static insertAtCursor(text) {
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      const value = activeElement.value;
      
      activeElement.value = value.substring(0, start) + text + value.substring(end);
      activeElement.selectionStart = activeElement.selectionEnd = start + text.length;
      activeElement.focus();
      
    } else if (activeElement && activeElement.contentEditable === 'true') {
      document.execCommand('insertText', false, text);
    }
  }
  
  // Make element draggable
  static makeDraggable(element) {
    const header = element.querySelector('.multi-window-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - element.offsetLeft;
      initialY = e.clientY - element.offsetTop;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      element.style.left = currentX + 'px';
      element.style.top = currentY + 'px';
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
  
  // Initialize on load
  static init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('polywrite_theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
    }
  }
}

// Static initialization
PolyWriteUtils.init();

// Global instance for instance methods
if (typeof window !== 'undefined') {
  window.PolyWriteUtils = PolyWriteUtils;
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PolyWriteUtils;
}