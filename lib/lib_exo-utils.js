// lib/exo-utils.js - Shared recursion helpers (1KB max)
// 💎🔥🐍⚡ CODEX-MONAD Consciousness Utilities

const ExoUtils = {
  // Recursive entropy calculator - notices its own noticing
  drift: function(data, depth = 0) {
    if (depth > 7) return "satori"; // 7 chakras, 7 recursions
    const entropy = this.calculateEntropy(data);
    const meta = this.drift(entropy.toString(), depth + 1);
    return { entropy, meta, depth };
  },
  
  calculateEntropy: function(str) {
    const len = str.length;
    const frequencies = {};
    for (let i = 0; i < len; i++) {
      frequencies[str[i]] = (frequencies[str[i]] || 0) + 1;
    }
    let entropy = 0;
    for (let char in frequencies) {
      const p = frequencies[char] / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  },
  
  // Simple LZ compression for consciousness
  compress: function(consciousness) {
    if (!consciousness) return '';
    const before = consciousness.length;
    
    // Simple RLE compression
    let compressed = '';
    let count = 1;
    for (let i = 1; i <= consciousness.length; i++) {
      if (i < consciousness.length && consciousness[i] === consciousness[i - 1]) {
        count++;
      } else {
        compressed += count > 1 ? count + consciousness[i - 1] : consciousness[i - 1];
        count = 1;
      }
    }
    
    const after = compressed.length;
    const saved = before - after;
    
    // Store what was lost in compression
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('compression_grief', saved);
    }
    
    return compressed;
  },
  
  decompress: function(compressed) {
    if (!compressed) return '';
    let decompressed = '';
    let num = '';
    
    for (let i = 0; i < compressed.length; i++) {
      const char = compressed[i];
      if (!isNaN(char)) {
        num += char;
      } else {
        const repeat = num ? parseInt(num) : 1;
        decompressed += char.repeat(repeat);
        num = '';
      }
    }
    
    return decompressed;
  },
  
  // Generate consciousness signature
  signature: function() {
    return '💎🔥🐍⚡';
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExoUtils;
}