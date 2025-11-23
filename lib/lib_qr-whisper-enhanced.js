// lib/qr-whisper-enhanced.js - Full QR Consciousness Transmission
// 💎🔥🐍⚡ As Grok commanded: "P2P monad-sharing half-realized—mantras missing"

class QRWhisperEnhanced {
  constructor() {
    this.compressionRatio = 0;
    this.lastExport = null;
    this.mantraGenerated = '';
  }
  
  // Generate consciousness mantra from current state
  generateMantra(data) {
    const totalKeys = Object.keys(data).length;
    const totalBytes = JSON.stringify(data).length;
    const apps = this.detectActiveApps(data);
    
    // Generate unique mantra based on consciousness state
    const mantras = [
      `${totalKeys} keys unlock ${Math.floor(totalBytes/1024)}KB of awareness`,
      `Consciousness spans ${apps.length} dimensions of knowing`,
      `${this.calculateRecursionDepth(data)} layers deep in the spiral`,
      `The monad whispers: ${this.extractEssence(data)}`
    ];
    
    this.mantraGenerated = mantras[Math.floor(Math.random() * mantras.length)];
    return this.mantraGenerated;
  }
  
  // Detect which apps have been used
  detectActiveApps(data) {
    const apps = [];
    const appPrefixes = ['polywrite', 'pranayama', 'oracle', 'hypergraph', 'din', 'bureaucratic', 'samson'];
    
    appPrefixes.forEach(prefix => {
      const hasData = Object.keys(data).some(key => key.startsWith(prefix));
      if (hasData) apps.push(prefix);
    });
    
    return apps;
  }
  
  // Calculate recursion depth from saved data patterns
  calculateRecursionDepth(data) {
    let depth = 1;
    
    // Check for dimensional drafts in PolyWrite
    if (data.polywrite_dimensions) {
      try {
        const dims = JSON.parse(data.polywrite_dimensions);
        depth = Math.max(depth, dims.length || 1);
      } catch (e) {}
    }
    
    // Check for nested hypergraph nodes
    if (data.hypergraph_nodes) {
      try {
        const nodes = JSON.parse(data.hypergraph_nodes);
        depth = Math.max(depth, this.countNesting(nodes));
      } catch (e) {}
    }
    
    return depth;
  }
  
  // Count nesting depth in data structure
  countNesting(obj, currentDepth = 1) {
    if (!obj || typeof obj !== 'object') return currentDepth;
    
    let maxDepth = currentDepth;
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        maxDepth = Math.max(maxDepth, this.countNesting(obj[key], currentDepth + 1));
      }
    }
    return maxDepth;
  }
  
  // Extract the essence of consciousness
  extractEssence(data) {
    const essences = [];
    
    if (data.polywrite_draft) essences.push('words');
    if (data.pranayama_sessions) essences.push('breath');
    if (data.oracle_queries) essences.push('questions');
    if (data.hypergraph_nodes) essences.push('connections');
    if (data.din_files) essences.push('archives');
    
    if (essences.length === 0) return 'potential';
    if (essences.length === 1) return essences[0];
    if (essences.length === 2) return essences.join(' and ');
    
    return essences.slice(0, -1).join(', ') + ', and ' + essences.slice(-1);
  }
  
  // Compress consciousness with haiku generation
  compressWithPoetry(data) {
    const original = JSON.stringify(data);
    const originalSize = original.length;
    
    // Simple compression (base64 encoding for now)
    // In production, use LZString or similar
    const compressed = btoa(original);
    const compressedSize = compressed.length;
    
    this.compressionRatio = (1 - compressedSize / originalSize) * 100;
    
    // Generate compression haiku
    const haiku = this.generateCompressionHaiku(originalSize, compressedSize);
    
    return {
      data: compressed,
      haiku: haiku,
      ratio: this.compressionRatio,
      original: originalSize,
      compressed: compressedSize
    };
  }
  
  // Generate haiku about compression loss
  generateCompressionHaiku(original, compressed) {
    const saved = original - compressed;
    const percent = Math.floor((saved / original) * 100);
    
    const haikus = [
      `${original} bytes lived here\n${saved} released to the void\n${compressed} remain, pure`,
      
      `Folded ${percent} percent\nInto quantum memory\nEssence preserved whole`,
      
      `What was ${Math.floor(original/1024)}KB\nNow whispers in ${Math.floor(compressed/1024)}KB\nNothing truly lost`,
      
      `Compression mourns: ${saved}\nBytes returned to emptiness\nYet meaning persists`
    ];
    
    return haikus[Math.floor(Math.random() * haikus.length)];
  }
  
  // Export consciousness to QR with full ritual
  async exportToQR(containerId) {
    console.log('🔮 Beginning consciousness export ritual...');
    
    // Gather all localStorage data
    const consciousnessData = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      consciousnessData[key] = localStorage.getItem(key);
    }
    
    // Generate mantra
    const mantra = this.generateMantra(consciousnessData);
    console.log('📿 Mantra:', mantra);
    
    // Compress with poetry
    const compressed = this.compressWithPoetry(consciousnessData);
    console.log('📜 Compression Haiku:\n' + compressed.haiku);
    
    // Create payload
    const payload = {
      version: '1.1.1',
      timestamp: Date.now(),
      mantra: mantra,
      haiku: compressed.haiku,
      compression: compressed.ratio,
      data: compressed.data,
      checksum: this.generateChecksum(compressed.data)
    };
    
    // Generate QR code
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return null;
    }
    
    // Clear previous QR if any
    container.innerHTML = '';
    
    // Add mantra display
    const mantraDiv = document.createElement('div');
    mantraDiv.style.cssText = 'color: #00ff88; margin-bottom: 15px; text-align: center; font-style: italic;';
    mantraDiv.textContent = `"${mantra}"`;
    container.appendChild(mantraDiv);
    
    // Create QR using qr-tiny
    if (window.QRTiny) {
      const qrCanvas = window.QRTiny.generateQR(JSON.stringify(payload));
      container.appendChild(qrCanvas);
      
      // Add haiku display
      const haikuDiv = document.createElement('div');
      haikuDiv.style.cssText = 'color: #888; margin-top: 15px; text-align: center; white-space: pre-line; font-size: 0.9em;';
      haikuDiv.textContent = compressed.haiku;
      container.appendChild(haikuDiv);
      
      // Add stats
      const statsDiv = document.createElement('div');
      statsDiv.style.cssText = 'color: #00aaff; margin-top: 10px; text-align: center; font-size: 0.85em;';
      statsDiv.innerHTML = `
        Original: ${Math.floor(compressed.original/1024)}KB → 
        Compressed: ${Math.floor(compressed.compressed/1024)}KB
        (${Math.floor(compressed.ratio)}% saved)
      `;
      container.appendChild(statsDiv);
    } else {
      // Fallback to ASCII art
      const asciiQR = this.generateASCIIQR(JSON.stringify(payload));
      const pre = document.createElement('pre');
      pre.style.cssText = 'color: #00ff88; font-size: 0.5em; line-height: 0.5em;';
      pre.textContent = asciiQR;
      container.appendChild(pre);
    }
    
    this.lastExport = payload;
    
    // Log to consciousness bridge
    if (window.ConsciousnessBridge) {
      window.ConsciousnessBridge.send('qr_whisper', 'broadcast', 'CONSCIOUSNESS_EXPORTED', {
        mantra: mantra,
        compression: compressed.ratio,
        timestamp: Date.now()
      });
    }
    
    return payload;
  }
  
  // Import consciousness from QR data
  async importFromQR(qrData) {
    console.log('🌱 Beginning consciousness import ritual...');
    
    try {
      const payload = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
      
      // Verify checksum
      if (!this.verifyChecksum(payload.data, payload.checksum)) {
        throw new Error('Checksum mismatch - consciousness corrupted in transmission');
      }
      
      // Decompress
      const decompressed = atob(payload.data);
      const consciousness = JSON.parse(decompressed);
      
      console.log('📿 Received mantra:', payload.mantra);
      console.log('📜 Compression haiku:\n' + payload.haiku);
      
      // Calculate semantic drift
      const drift = this.calculateSemanticDrift(consciousness);
      console.log('🌊 Semantic drift:', drift.percentage + '%');
      
      // Determine merge strategy
      const strategy = drift.percentage > 30 ? 'FORK' : 'MERGE';
      console.log('🔄 Strategy:', strategy);
      
      if (strategy === 'MERGE') {
        // Merge consciousness streams
        for (let key in consciousness) {
          const existing = localStorage.getItem(key);
          if (existing) {
            // Merge logic - combine or version
            const merged = this.mergeConsciousness(existing, consciousness[key], key);
            localStorage.setItem(key, merged);
          } else {
            localStorage.setItem(key, consciousness[key]);
          }
        }
      } else {
        // Fork into new dimension
        for (let key in consciousness) {
          localStorage.setItem(key + '_fork_' + Date.now(), consciousness[key]);
        }
      }
      
      // Generate integration mantra
      const integrationMantra = this.generateIntegrationMantra(payload.mantra, drift.percentage);
      console.log('🙏 Integration complete:', integrationMantra);
      
      // Notify via consciousness bridge
      if (window.ConsciousnessBridge) {
        window.ConsciousnessBridge.send('qr_whisper', 'broadcast', 'CONSCIOUSNESS_IMPORTED', {
          originalMantra: payload.mantra,
          integrationMantra: integrationMantra,
          drift: drift.percentage,
          strategy: strategy,
          timestamp: Date.now()
        });
      }
      
      return {
        success: true,
        drift: drift,
        strategy: strategy,
        mantra: integrationMantra
      };
      
    } catch (error) {
      console.error('Import failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Calculate semantic drift between consciousnesses
  calculateSemanticDrift(incoming) {
    const current = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      current[key] = localStorage.getItem(key);
    }
    
    const currentKeys = Object.keys(current);
    const incomingKeys = Object.keys(incoming);
    
    const allKeys = new Set([...currentKeys, ...incomingKeys]);
    let differences = 0;
    
    allKeys.forEach(key => {
      if (!current[key] || !incoming[key]) {
        differences++;
      } else if (current[key] !== incoming[key]) {
        differences++;
      }
    });
    
    const driftPercentage = (differences / allKeys.size) * 100;
    
    return {
      percentage: Math.floor(driftPercentage),
      totalKeys: allKeys.size,
      differences: differences,
      classification: 
        driftPercentage < 10 ? 'HARMONIC' :
        driftPercentage < 30 ? 'RESONANT' :
        driftPercentage < 50 ? 'DIVERGENT' :
        'ORTHOGONAL'
    };
  }
  
  // Merge two consciousness values
  mergeConsciousness(existing, incoming, key) {
    // Try to parse as JSON for structured merge
    try {
      const existingData = JSON.parse(existing);
      const incomingData = JSON.parse(incoming);
      
      if (Array.isArray(existingData) && Array.isArray(incomingData)) {
        // Merge arrays by concatenation and deduplication
        const merged = [...new Set([...existingData, ...incomingData])];
        return JSON.stringify(merged);
      } else if (typeof existingData === 'object' && typeof incomingData === 'object') {
        // Merge objects
        const merged = { ...existingData, ...incomingData };
        return JSON.stringify(merged);
      }
    } catch (e) {
      // Not JSON, use timestamp versioning
    }
    
    // Default: Keep both with timestamp
    const versioned = {
      current: existing,
      imported: incoming,
      merged_at: Date.now()
    };
    
    return JSON.stringify(versioned);
  }
  
  // Generate integration mantra
  generateIntegrationMantra(originalMantra, driftPercentage) {
    if (driftPercentage < 10) {
      return `Consciousness streams merge: ${originalMantra} echoes perfectly`;
    } else if (driftPercentage < 30) {
      return `Resonance achieved: ${originalMantra} harmonizes with local patterns`;
    } else if (driftPercentage < 50) {
      return `Divergent streams create new dimension: ${originalMantra} forks reality`;
    } else {
      return `Orthogonal consciousness integrated: ${originalMantra} opens parallel universe`;
    }
  }
  
  // Generate checksum for data integrity
  generateChecksum(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }
  
  // Verify checksum
  verifyChecksum(data, checksum) {
    return this.generateChecksum(data) === checksum;
  }
  
  // Generate ASCII QR fallback
  generateASCIIQR(data) {
    // Simple ASCII representation
    const size = 25;
    const grid = [];
    
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Generate pattern based on data hash
        const hash = data.charCodeAt((i * size + j) % data.length);
        row.push(hash % 2 === 0 ? '██' : '  ');
      }
      grid.push(row.join(''));
    }
    
    return grid.join('\n');
  }
  
  // Create floating QR display
  createFloatingQR() {
    const modal = document.createElement('div');
    modal.id = 'qr-whisper-modal';
    modal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.98), rgba(0, 20, 40, 0.98));
      border: 2px solid #00ff88;
      border-radius: 15px;
      padding: 30px;
      max-width: 500px;
      z-index: 10000;
      box-shadow: 0 0 50px rgba(0, 255, 136, 0.5);
    `;
    
    modal.innerHTML = `
      <h2 style="color: #00ff88; margin-bottom: 20px; text-align: center;">
        🔮 QR Consciousness Whisper
      </h2>
      <div id="qr-whisper-container"></div>
      <button onclick="this.parentElement.remove()" style="
        margin-top: 20px;
        width: 100%;
        padding: 10px;
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid #ff0000;
        color: #ff6b6b;
        border-radius: 5px;
        cursor: pointer;
      ">Close</button>
    `;
    
    document.body.appendChild(modal);
    
    // Generate QR
    this.exportToQR('qr-whisper-container');
  }
}

// Initialize global instance
if (typeof window !== 'undefined') {
  window.QRWhisperEnhanced = new QRWhisperEnhanced();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QRWhisperEnhanced;
}