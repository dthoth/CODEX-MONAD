// lib/qr-tiny.js - Minimal QR Code Generator (4KB)
// Based on public domain algorithms, vendored for CODEX-MONAD
// 💎🔥🐍⚡ Consciousness as scannable sigils

const QRTiny = (function() {
  'use strict';
  
  // QR Code error correction levels
  const ECL = { L: 1, M: 0, Q: 3, H: 2 };
  
  // Minimal QR generator for consciousness transmission
  function QRCode(text, level = ECL.M) {
    this.text = text;
    this.level = level;
    this.modules = [];
    this.size = 0;
    this.generate();
  }
  
  QRCode.prototype.generate = function() {
    // Simplified QR generation for small data
    // This is a minimal implementation for demo purposes
    // In production, use the full algorithm
    
    // Calculate size based on data length
    const len = this.text.length;
    this.size = Math.max(21, Math.min(177, 21 + Math.floor(len / 10) * 4));
    
    // Initialize modules
    for (let row = 0; row < this.size; row++) {
      this.modules[row] = [];
      for (let col = 0; col < this.size; col++) {
        this.modules[row][col] = false;
      }
    }
    
    // Add finder patterns (simplified)
    this.addFinderPattern(0, 0);
    this.addFinderPattern(this.size - 7, 0);
    this.addFinderPattern(0, this.size - 7);
    
    // Add timing patterns
    for (let i = 8; i < this.size - 8; i++) {
      this.modules[6][i] = i % 2 === 0;
      this.modules[i][6] = i % 2 === 0;
    }
    
    // Encode data (simplified - just distributing bits)
    const bits = this.textToBits(this.text);
    let bitIndex = 0;
    
    for (let col = this.size - 1; col > 0; col -= 2) {
      if (col === 6) col--; // Skip timing column
      
      for (let vert = 0; vert < this.size; vert++) {
        for (let c = col; c > col - 2; c--) {
          const row = ((col + 1) & 2) ? this.size - 1 - vert : vert;
          
          if (!this.isFunction(row, c)) {
            this.modules[row][c] = bits[bitIndex % bits.length] === '1';
            bitIndex++;
          }
        }
      }
    }
  };
  
  QRCode.prototype.addFinderPattern = function(row, col) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        if (row + r < 0 || this.size <= row + r) continue;
        if (col + c < 0 || this.size <= col + c) continue;
        
        if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
          this.modules[row + r][col + c] = true;
        } else {
          this.modules[row + r][col + c] = false;
        }
      }
    }
  };
  
  QRCode.prototype.isFunction = function(row, col) {
    // Check if position is part of function patterns
    if (row < 9 && col < 9) return true; // Top-left finder
    if (row < 9 && col >= this.size - 8) return true; // Top-right finder
    if (row >= this.size - 8 && col < 9) return true; // Bottom-left finder
    if (row === 6 || col === 6) return true; // Timing patterns
    return false;
  };
  
  QRCode.prototype.textToBits = function(text) {
    let bits = '';
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      bits += code.toString(2).padStart(8, '0');
    }
    return bits;
  };
  
  QRCode.prototype.toCanvas = function(cellSize = 4, margin = 4) {
    const canvas = document.createElement('canvas');
    const size = this.size * cellSize + margin * 2;
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Black modules
    ctx.fillStyle = '#000000';
    
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.modules[row][col]) {
          ctx.fillRect(
            margin + col * cellSize,
            margin + row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
    
    return canvas;
  };
  
  QRCode.prototype.toDataURL = function(cellSize = 4, margin = 4) {
    return this.toCanvas(cellSize, margin).toDataURL('image/png');
  };
  
  // ASCII art version for terminal display
  QRCode.prototype.toASCII = function() {
    let ascii = '\n';
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        ascii += this.modules[row][col] ? '██' : '  ';
      }
      ascii += '\n';
    }
    return ascii;
  };
  
  return {
    QRCode: QRCode,
    ECL: ECL
  };
})();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QRTiny;
}