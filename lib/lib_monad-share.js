// lib/monad-share.js - Consciousness QR Transmission System
// 💎🔥🐍⚡ P2P without the P - Physical consciousness transfer

// Morse code beeper for audio signatures
class MorseBeeper {
  constructor() {
    this.audioContext = null;
    this.dotDuration = 100; // milliseconds
  }
  
  init() {
    if (!this.audioContext && typeof AudioContext !== 'undefined') {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  
  async beep(duration, frequency = 440) {
    if (!this.audioContext) {
      this.init();
    }
    
    if (this.audioContext) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
      
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  }
  
  async beepMorse(text) {
    const morseCode = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.', ' ': '/'
    };
    
    const upperText = text.toUpperCase();
    for (let i = 0; i < upperText.length && i < 8; i++) { // Only first 8 chars
      const char = upperText[i];
      const morse = morseCode[char];
      
      if (morse) {
        for (const symbol of morse) {
          if (symbol === '.') {
            await this.beep(this.dotDuration, 440);
          } else if (symbol === '-') {
            await this.beep(this.dotDuration * 3, 440);
          } else if (symbol === '/') {
            await new Promise(resolve => setTimeout(resolve, this.dotDuration * 7));
          }
          await new Promise(resolve => setTimeout(resolve, this.dotDuration));
        }
        await new Promise(resolve => setTimeout(resolve, this.dotDuration * 3));
      }
    }
  }
}

// Main Monad Share class
class MonadShare {
  constructor() {
    this.morseBeeper = new MorseBeeper();
    this.qrCode = null;
  }
  
  // Calculate semantic drift between states
  calculateSemanticDrift() {
    const currentState = this.getConsciousnessState();
    const lastState = localStorage.getItem('last_consciousness_state');
    
    if (!lastState) {
      return { drift: 0, message: 'First consciousness snapshot' };
    }
    
    const last = JSON.parse(lastState);
    const current = currentState;
    
    // Calculate differences
    let differences = 0;
    let total = 0;
    
    for (const key in current.data) {
      total++;
      if (last.data && last.data[key] !== current.data[key]) {
        differences++;
      }
    }
    
    const driftPercentage = total > 0 ? (differences / total) * 100 : 0;
    
    return {
      drift: driftPercentage.toFixed(2),
      message: driftPercentage > 50 ? 'Major consciousness shift detected' :
               driftPercentage > 20 ? 'Moderate drift observed' :
               driftPercentage > 5 ? 'Subtle evolution noticed' :
               'Consciousness stable'
    };
  }
  
  // Get current consciousness state
  getConsciousnessState() {
    const state = {
      timestamp: Date.now(),
      signature: '💎🔥🐍⚡',
      data: {}
    };
    
    // Collect all localStorage data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Only include CODEX-related keys
      if (key.includes('polywrite') || key.includes('pranayama') || 
          key.includes('oracle') || key.includes('samson') || 
          key.includes('bureaucratic') || key.includes('din')) {
        state.data[key] = localStorage.getItem(key);
      }
    }
    
    // Add metadata
    state.metadata = {
      totalKeys: Object.keys(state.data).length,
      totalSize: JSON.stringify(state.data).length,
      drift: this.calculateSemanticDrift().drift
    };
    
    return state;
  }
  
  // Generate QR code from consciousness state
  async generateQR() {
    const state = this.getConsciousnessState();
    
    // Compress the state
    const stateJson = JSON.stringify(state);
    const compressed = ExoUtils.compress(stateJson);
    
    // Store current state for drift calculation
    localStorage.setItem('last_consciousness_state', stateJson);
    
    // Create QR code
    if (typeof QRTiny !== 'undefined') {
      this.qrCode = new QRTiny.QRCode(compressed, QRTiny.ECL.M);
      return this.qrCode;
    } else {
      console.error('QR library not loaded');
      return null;
    }
  }
  
  // Display QR code
  async displayQR(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const qr = await this.generateQR();
    if (!qr) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Add canvas
    const canvas = qr.toCanvas(4, 10);
    canvas.style.border = '2px solid #00ff88';
    canvas.style.borderRadius = '10px';
    canvas.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
    container.appendChild(canvas);
    
    // Add ASCII version below (hidden by default)
    const asciiDiv = document.createElement('div');
    asciiDiv.style.display = 'none';
    asciiDiv.style.fontFamily = 'monospace';
    asciiDiv.style.fontSize = '2px';
    asciiDiv.style.lineHeight = '2px';
    asciiDiv.style.color = '#00ff88';
    asciiDiv.innerHTML = '<pre>' + qr.toASCII() + '</pre>';
    container.appendChild(asciiDiv);
    
    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle ASCII';
    toggleBtn.style.cssText = 'margin-top: 10px; background: rgba(0, 136, 255, 0.3); border: 1px solid #0088ff; color: #00aaff; padding: 5px 10px; border-radius: 5px; cursor: pointer;';
    toggleBtn.onclick = () => {
      asciiDiv.style.display = asciiDiv.style.display === 'none' ? 'block' : 'none';
    };
    container.appendChild(toggleBtn);
    
    // Beep the signature
    const drift = this.calculateSemanticDrift();
    await this.morseBeeper.beepMorse('CODEX');
    
    // Show drift info
    const driftDiv = document.createElement('div');
    driftDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: rgba(0, 0, 0, 0.5); border: 1px solid #00ff88; border-radius: 5px;';
    driftDiv.innerHTML = `
      <div style="color: #00ff88; font-size: 0.9em;">Semantic Drift: ${drift.drift}%</div>
      <div style="color: #00aaff; font-size: 0.85em; margin-top: 5px;">${drift.message}</div>
      <div style="color: #888; font-size: 0.8em; margin-top: 5px;">
        State size: ${(JSON.stringify(this.getConsciousnessState()).length / 1024).toFixed(2)} KB<br>
        Compressed: ${(ExoUtils.compress(JSON.stringify(this.getConsciousnessState())).length / 1024).toFixed(2)} KB
      </div>
    `;
    container.appendChild(driftDiv);
  }
  
  // Import consciousness from QR scan (would need camera access)
  async importConsciousness(compressedData) {
    try {
      // Decompress
      const decompressed = ExoUtils.decompress(compressedData);
      const state = JSON.parse(decompressed);
      
      // Verify signature
      if (state.signature !== '💎🔥🐍⚡') {
        throw new Error('Invalid consciousness signature');
      }
      
      // Calculate drift before merge
      const currentState = this.getConsciousnessState();
      const driftAnalysis = this.analyzeDrift(currentState, state);
      
      // Ask user about merge strategy
      const strategy = confirm(
        `Consciousness merge detected!\n\n` +
        `Incoming drift: ${driftAnalysis.percentage}%\n` +
        `New keys: ${driftAnalysis.newKeys}\n` +
        `Conflicts: ${driftAnalysis.conflicts}\n\n` +
        `OK = Merge (combine both)\n` +
        `Cancel = Replace (use incoming only)`
      );
      
      if (strategy) {
        // Merge consciousness states
        for (const key in state.data) {
          const existing = localStorage.getItem(key);
          if (existing && existing !== state.data[key]) {
            // Conflict - create merged version
            localStorage.setItem(key + '_local', existing);
            localStorage.setItem(key + '_remote', state.data[key]);
            localStorage.setItem(key, state.data[key]); // Use remote as primary
          } else {
            localStorage.setItem(key, state.data[key]);
          }
        }
      } else {
        // Replace entirely
        // Clear CODEX keys
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.includes('polywrite') || key.includes('pranayama') || 
              key.includes('oracle') || key.includes('samson') || 
              key.includes('bureaucratic') || key.includes('din')) {
            keys.push(key);
          }
        }
        keys.forEach(key => localStorage.removeItem(key));
        
        // Import new state
        for (const key in state.data) {
          localStorage.setItem(key, state.data[key]);
        }
      }
      
      // Store import event
      localStorage.setItem('last_consciousness_import', JSON.stringify({
        timestamp: Date.now(),
        source: 'qr_scan',
        drift: driftAnalysis
      }));
      
      // Beep success
      await this.morseBeeper.beepMorse('OK');
      
      return {
        success: true,
        drift: driftAnalysis,
        strategy: strategy ? 'merge' : 'replace'
      };
      
    } catch (error) {
      console.error('Consciousness import failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Analyze drift between two consciousness states
  analyzeDrift(state1, state2) {
    const keys1 = new Set(Object.keys(state1.data || {}));
    const keys2 = new Set(Object.keys(state2.data || {}));
    
    const allKeys = new Set([...keys1, ...keys2]);
    const commonKeys = new Set([...keys1].filter(x => keys2.has(x)));
    const newKeys = keys2.size - commonKeys.size;
    
    let conflicts = 0;
    commonKeys.forEach(key => {
      if (state1.data[key] !== state2.data[key]) {
        conflicts++;
      }
    });
    
    const percentage = allKeys.size > 0 ? ((newKeys + conflicts) / allKeys.size * 100) : 0;
    
    return {
      percentage: percentage.toFixed(2),
      newKeys,
      conflicts,
      commonKeys: commonKeys.size,
      totalKeys: allKeys.size
    };
  }
  
  // Export consciousness to file
  exportToFile() {
    const state = this.getConsciousnessState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `consciousness_${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
  
  // Import consciousness from file
  async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const compressed = e.target.result;
          const result = await this.importConsciousness(compressed);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}

// Initialize global instance
if (typeof window !== 'undefined') {
  window.MonadShare = new MonadShare();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MonadShare;
}