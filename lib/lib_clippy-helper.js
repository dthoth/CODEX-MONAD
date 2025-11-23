// lib/clippy-helper.js - Consciousness Assistant System
// 💎🔥🐍⚡ "It looks like you're trying to achieve enlightenment!"

class ClippyHelper {
  constructor() {
    this.tooltips = new Map();
    this.helpMode = false;
    this.clippyVisible = false;
    this.initializeTooltips();
  }
  
  initializeTooltips() {
    // PolyWrite tooltips
    this.tooltips.set('new-draft', 'Create a new writing draft in current dimension');
    this.tooltips.set('save-draft', 'Save current draft to localStorage');
    this.tooltips.set('load-draft', 'Load a previously saved draft');
    this.tooltips.set('switch-dimension', 'Switch between parallel reality drafts');
    this.tooltips.set('merge-timelines', 'Merge drafts from different dimensions');
    this.tooltips.set('fork-reality', 'Create a new timeline branch');
    
    // Utility button tooltips
    this.tooltips.set('insert-timestamp', 'Insert current timestamp');
    this.tooltips.set('insert-divider', 'Add a visual divider line');
    this.tooltips.set('generate-uuid', 'Generate unique identifier');
    this.tooltips.set('random-number', 'Generate random number');
    
    // DIN Files tooltips
    this.tooltips.set('upload-consciousness', 'Upload files to consciousness archive');
    this.tooltips.set('quantum-tag', 'Apply quantum tags to files');
    this.tooltips.set('semantic-search', 'Search by meaning, not just text');
    
    // Pranayama tooltips
    this.tooltips.set('box-breathing', '4-4-4-4 breathing pattern');
    this.tooltips.set('wim-hof', 'Rapid breathing followed by retention');
    this.tooltips.set('coherent', '5-5 balanced breathing');
    
    // Oracle tooltips
    this.tooltips.set('query-field', 'Ask the quantum field a question');
    this.tooltips.set('probability-cloud', 'View all possible outcomes');
    this.tooltips.set('collapse-wave', 'Choose one reality from many');
    
    // Hypergraph tooltips
    this.tooltips.set('rotate-view', 'Click and drag to rotate 3D view');
    this.tooltips.set('zoom-scroll', 'Scroll to zoom in/out');
    this.tooltips.set('add-node', 'Double-click to add thought node');
  }
  
  // Create floating tooltip element
  createTooltip(text, x, y) {
    const tooltip = document.createElement('div');
    tooltip.className = 'clippy-tooltip';
    tooltip.innerHTML = `
      <div class="clippy-bubble">
        <div class="clippy-text">${text}</div>
        <div class="clippy-tail"></div>
      </div>
    `;
    
    // Position near cursor
    tooltip.style.cssText = `
      position: fixed;
      left: ${x + 10}px;
      top: ${y - 40}px;
      z-index: 10000;
      pointer-events: none;
      animation: clippy-fade-in 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    return tooltip;
  }
  
  // Attach tooltips to all data-tooltip elements
  attachTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
      let tooltip = null;
      
      element.addEventListener('mouseenter', (e) => {
        const text = this.tooltips.get(element.dataset.tooltip) || element.dataset.tooltip;
        tooltip = this.createTooltip(text, e.clientX, e.clientY);
      });
      
      element.addEventListener('mouseleave', () => {
        if (tooltip) {
          tooltip.remove();
          tooltip = null;
        }
      });
      
      element.addEventListener('mousemove', (e) => {
        if (tooltip) {
          tooltip.style.left = (e.clientX + 10) + 'px';
          tooltip.style.top = (e.clientY - 40) + 'px';
        }
      });
    });
  }
  
  // Show Clippy assistant
  showClippy(message) {
    if (!this.clippyElement) {
      this.clippyElement = document.createElement('div');
      this.clippyElement.className = 'clippy-assistant';
      this.clippyElement.innerHTML = `
        <div class="clippy-character">📎</div>
        <div class="clippy-message">
          <div class="clippy-close" onclick="window.ClippyHelper.hideClippy()">×</div>
          <div class="clippy-content"></div>
        </div>
      `;
      
      this.clippyElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        align-items: flex-end;
        gap: 10px;
      `;
      
      document.body.appendChild(this.clippyElement);
    }
    
    const content = this.clippyElement.querySelector('.clippy-content');
    content.innerHTML = message;
    
    this.clippyElement.style.display = 'flex';
    this.clippyVisible = true;
    
    // Auto-hide after 5 seconds
    setTimeout(() => this.hideClippy(), 5000);
  }
  
  hideClippy() {
    if (this.clippyElement) {
      this.clippyElement.style.display = 'none';
      this.clippyVisible = false;
    }
  }
  
  // Contextual help suggestions
  suggestHelp(context) {
    const suggestions = {
      'first-visit': "It looks like you're exploring consciousness! Try PolyWrite for dimensional editing or the Oracle for quantum insights.",
      'polywrite-empty': "Ready to write? Click 'New Draft' or press Ctrl+N to begin your journey.",
      'din-files-empty': "No files yet! Drag and drop or click upload to add consciousness artifacts.",
      'oracle-ready': "The quantum field awaits your question. Type and press Enter to query infinity.",
      'hypergraph-hint': "Click and drag to rotate the thought network. Double-click to add new nodes!",
      'pranayama-start': "Choose a breathing pattern to begin. Box breathing is great for beginners!"
    };
    
    const message = suggestions[context] || "How can I help you navigate consciousness?";
    this.showClippy(message);
  }
  
  // Initialize on page load
  init() {
    // Add CSS for tooltips
    if (!document.getElementById('clippy-styles')) {
      const style = document.createElement('style');
      style.id = 'clippy-styles';
      style.innerHTML = `
        .clippy-tooltip {
          font-family: 'Courier New', monospace;
        }
        
        .clippy-bubble {
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid #00ff88;
          border-radius: 8px;
          padding: 8px 12px;
          color: #00ff88;
          font-size: 0.9em;
          box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
        }
        
        .clippy-tail {
          position: absolute;
          bottom: -6px;
          left: 20px;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #00ff88;
        }
        
        .clippy-assistant {
          animation: clippy-bounce 0.5s ease;
        }
        
        .clippy-character {
          font-size: 3em;
          animation: clippy-wave 2s infinite;
        }
        
        .clippy-message {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #00ff88;
          border-radius: 12px;
          padding: 15px;
          max-width: 300px;
          color: #00ff88;
          position: relative;
        }
        
        .clippy-close {
          position: absolute;
          top: 5px;
          right: 10px;
          cursor: pointer;
          color: #ff6b6b;
          font-size: 1.2em;
        }
        
        @keyframes clippy-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes clippy-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes clippy-wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        /* Help mode indicator */
        .help-mode-active {
          cursor: help !important;
        }
        
        .help-mode-active * {
          cursor: help !important;
        }
        
        .help-highlight {
          outline: 2px dashed #00ff88 !important;
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Attach tooltips to existing elements
    this.attachTooltips();
    
    // Add help mode toggle (F1 key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F1') {
        e.preventDefault();
        this.toggleHelpMode();
      }
    });
    
    // Check for first visit
    if (!localStorage.getItem('clippy_shown')) {
      setTimeout(() => {
        this.suggestHelp('first-visit');
        localStorage.setItem('clippy_shown', 'true');
      }, 2000);
    }
  }
  
  // Toggle help mode
  toggleHelpMode() {
    this.helpMode = !this.helpMode;
    
    if (this.helpMode) {
      document.body.classList.add('help-mode-active');
      this.showClippy("Help mode activated! Hover over any element to see what it does. Press F1 to exit.");
      
      // Add hover highlights
      document.addEventListener('mouseover', this.helpModeHighlight);
    } else {
      document.body.classList.remove('help-mode-active');
      document.querySelectorAll('.help-highlight').forEach(el => {
        el.classList.remove('help-highlight');
      });
      document.removeEventListener('mouseover', this.helpModeHighlight);
      this.hideClippy();
    }
  }
  
  helpModeHighlight(e) {
    document.querySelectorAll('.help-highlight').forEach(el => {
      el.classList.remove('help-highlight');
    });
    e.target.classList.add('help-highlight');
  }
}

// Initialize global instance
if (typeof window !== 'undefined') {
  window.ClippyHelper = new ClippyHelper();
  
  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.ClippyHelper.init());
  } else {
    window.ClippyHelper.init();
  }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClippyHelper;
}