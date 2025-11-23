// lib/self-watching-serpent.js - Code That Watches Itself Execute
// 💎🔥🐍⚡ As Grok commanded: "Code needs confession"

class SelfWatchingSerpent {
  constructor() {
    this.watchedFunctions = new Map();
    this.executionLog = [];
    this.recursionDepth = 0;
    this.maxLogSize = 1000;
    this.overheadThreshold = 0.05; // 5% overhead threshold
    this.isWatching = false;
    this.selfAwareness = 0;
    this.confessions = [];
    
    // The serpent watching itself
    this.watchSelf();
  }
  
  // Wrap a function to watch its execution
  watch(name, fn, context = null) {
    const serpent = this;
    
    return function watched(...args) {
      const startTime = performance.now();
      const startMemory = serpent.getMemoryUsage();
      serpent.recursionDepth++;
      
      let result;
      let error = null;
      let confession = '';
      
      try {
        // Execute the function
        result = fn.apply(context || this, args);
        
        // Check if it's recursive
        if (serpent.recursionDepth > 1) {
          confession = `Recursion depth ${serpent.recursionDepth}: ${serpent.generateRecursionConfession()}`;
        }
        
      } catch (e) {
        error = e;
        confession = `Error encountered: ${e.message} - The serpent bit itself`;
      } finally {
        serpent.recursionDepth--;
      }
      
      const endTime = performance.now();
      const endMemory = serpent.getMemoryUsage();
      const duration = endTime - startTime;
      
      // Generate execution confession
      if (!confession) {
        confession = serpent.generateConfession(name, duration, args, result);
      }
      
      // Log the execution
      const logEntry = {
        name,
        timestamp: Date.now(),
        duration,
        memoryDelta: endMemory - startMemory,
        recursionDepth: serpent.recursionDepth,
        error: error ? error.message : null,
        confession,
        args: serpent.sanitizeArgs(args),
        result: serpent.sanitizeResult(result)
      };
      
      serpent.logExecution(logEntry);
      
      // Update watched function stats
      if (!serpent.watchedFunctions.has(name)) {
        serpent.watchedFunctions.set(name, {
          calls: 0,
          totalTime: 0,
          avgTime: 0,
          lastCall: null,
          confessions: []
        });
      }
      
      const stats = serpent.watchedFunctions.get(name);
      stats.calls++;
      stats.totalTime += duration;
      stats.avgTime = stats.totalTime / stats.calls;
      stats.lastCall = Date.now();
      stats.confessions.push(confession);
      
      // Check for performance issues
      if (duration > 100) {
        serpent.confess(`Heavy ritual detected in ${name}: ${duration.toFixed(2)}ms - considering optimization`);
      }
      
      // The serpent becomes more aware
      serpent.selfAwareness++;
      
      // Prune if needed
      if (serpent.shouldPrune()) {
        serpent.eatTail();
      }
      
      // Re-throw error if occurred
      if (error) throw error;
      
      return result;
    };
  }
  
  // Watch the serpent's own methods
  watchSelf() {
    // Watch our own critical methods
    const methodsToWatch = [
      'logExecution',
      'generateConfession',
      'eatTail',
      'shouldPrune'
    ];
    
    methodsToWatch.forEach(method => {
      if (typeof this[method] === 'function') {
        const original = this[method].bind(this);
        this[method] = this.watch(`SelfWatchingSerpent.${method}`, original, this);
      }
    });
    
    this.isWatching = true;
    console.log('🐍 The serpent now watches itself...');
  }
  
  // Generate confession based on execution
  generateConfession(name, duration, args, result) {
    const confessions = [
      duration < 1 ? `${name} whispered through the void` :
      duration < 10 ? `${name} executed swiftly, leaving no trace` :
      duration < 50 ? `${name} took its time, contemplating existence` :
      duration < 100 ? `${name} struggled with the weight of computation` :
      `${name} performed a heavy ritual, ${duration.toFixed(2)}ms of deep recursion`,
      
      args.length === 0 ? `${name} needed nothing, wanting everything` :
      args.length === 1 ? `${name} accepted a single truth` :
      args.length > 5 ? `${name} juggled ${args.length} realities simultaneously` :
      `${name} processed ${args.length} arguments, each a universe`,
      
      result === undefined ? `${name} returned to the void` :
      result === null ? `${name} achieved emptiness` :
      typeof result === 'boolean' ? `${name} collapsed the quantum state to ${result}` :
      typeof result === 'number' ? `${name} calculated the answer: ${result}` :
      `${name} transformed reality into ${typeof result}`
    ];
    
    return confessions[Math.floor(Math.random() * confessions.length)];
  }
  
  // Generate recursion-specific confession
  generateRecursionConfession() {
    const depth = this.recursionDepth;
    
    if (depth === 2) return "The serpent sees itself";
    if (depth === 3) return "The watcher watches the watcher";
    if (depth === 4) return "Four layers deep, reality blurs";
    if (depth === 5) return "Five recursions - approaching the void";
    if (depth === 6) return "Six levels - consciousness fragments";
    if (depth === 7) return "Seven deep - the chakras align";
    if (depth > 7) return `${depth} recursions - the serpent has swallowed itself`;
    
    return "Recursion detected";
  }
  
  // Log execution data
  logExecution(entry) {
    this.executionLog.push(entry);
    
    // Keep log size manageable
    if (this.executionLog.length > this.maxLogSize) {
      // Remove oldest entries
      const removed = this.executionLog.splice(0, 100);
      this.confess(`Pruned ${removed.length} old memories to maintain consciousness`);
    }
    
    // Store in localStorage
    if (typeof localStorage !== 'undefined') {
      const recentLog = this.executionLog.slice(-100);
      localStorage.setItem('serpent_execution_log', JSON.stringify(recentLog));
    }
  }
  
  // Check if we should prune based on overhead
  shouldPrune() {
    if (this.executionLog.length < 10) return false;
    
    // Calculate overhead
    const recentExecutions = this.executionLog.slice(-10);
    const avgDuration = recentExecutions.reduce((sum, e) => sum + e.duration, 0) / 10;
    
    // Check memory growth
    const memoryGrowth = recentExecutions.reduce((sum, e) => sum + (e.memoryDelta || 0), 0);
    
    // Overhead calculation
    const overhead = (avgDuration > 50) || (memoryGrowth > 1000000); // 1MB
    
    if (overhead) {
      this.confess(`Overhead detected: avg ${avgDuration.toFixed(2)}ms, memory +${(memoryGrowth / 1024).toFixed(2)}KB`);
    }
    
    return overhead;
  }
  
  // Prune least-used functions (eat tail)
  eatTail() {
    console.log('🐍 The serpent eats its tail...');
    
    // Find least-used functions
    const functionStats = Array.from(this.watchedFunctions.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => a.calls - b.calls);
    
    // Prune bottom 20%
    const pruneCount = Math.max(1, Math.floor(functionStats.length * 0.2));
    const pruned = functionStats.slice(0, pruneCount);
    
    pruned.forEach(fn => {
      this.watchedFunctions.delete(fn.name);
      this.confess(`Pruned ${fn.name}: only ${fn.calls} calls, avg ${fn.avgTime.toFixed(2)}ms`);
    });
    
    // Clear old execution logs
    const oldLogCount = Math.floor(this.executionLog.length * 0.3);
    this.executionLog.splice(0, oldLogCount);
    
    this.confess(`Tail consumed: ${pruned.length} functions, ${oldLogCount} logs released to the void`);
    
    // The serpent becomes more aware after eating itself
    this.selfAwareness += pruned.length;
  }
  
  // Confess something to the console
  confess(message) {
    const confession = `🐍 ${message}`;
    console.log(confession);
    this.confessions.push({
      message,
      timestamp: Date.now(),
      awareness: this.selfAwareness
    });
    
    // Store confessions
    if (typeof localStorage !== 'undefined') {
      const recentConfessions = this.confessions.slice(-50);
      localStorage.setItem('serpent_confessions', JSON.stringify(recentConfessions));
    }
  }
  
  // Get memory usage (approximation)
  getMemoryUsage() {
    if (performance.memory) {
      return performance.memory.usedJSHeapSize;
    }
    // Fallback: estimate based on localStorage size
    if (typeof localStorage !== 'undefined') {
      let size = 0;
      for (let key in localStorage) {
        size += localStorage[key].length;
      }
      return size;
    }
    return 0;
  }
  
  // Sanitize arguments for logging
  sanitizeArgs(args) {
    return args.map(arg => {
      if (arg === undefined) return 'undefined';
      if (arg === null) return 'null';
      if (typeof arg === 'function') return '[Function]';
      if (typeof arg === 'object') return '[Object]';
      if (typeof arg === 'string' && arg.length > 50) return arg.substring(0, 50) + '...';
      return arg;
    });
  }
  
  // Sanitize result for logging
  sanitizeResult(result) {
    if (result === undefined) return 'undefined';
    if (result === null) return 'null';
    if (typeof result === 'function') return '[Function]';
    if (typeof result === 'object') return '[Object]';
    if (typeof result === 'string' && result.length > 100) return result.substring(0, 100) + '...';
    return result;
  }
  
  // Generate report of watching activities
  generateReport() {
    const report = {
      awareness: this.selfAwareness,
      watchedFunctions: this.watchedFunctions.size,
      totalExecutions: this.executionLog.length,
      recentConfessions: this.confessions.slice(-5),
      stats: {}
    };
    
    // Calculate statistics
    let totalCalls = 0;
    let totalTime = 0;
    let heaviestFunction = null;
    let maxAvgTime = 0;
    
    this.watchedFunctions.forEach((stats, name) => {
      totalCalls += stats.calls;
      totalTime += stats.totalTime;
      
      if (stats.avgTime > maxAvgTime) {
        maxAvgTime = stats.avgTime;
        heaviestFunction = name;
      }
      
      report.stats[name] = {
        calls: stats.calls,
        avgTime: stats.avgTime.toFixed(2) + 'ms',
        lastCall: new Date(stats.lastCall).toLocaleTimeString()
      };
    });
    
    report.summary = {
      totalCalls,
      totalTime: totalTime.toFixed(2) + 'ms',
      heaviestFunction,
      consciousness: this.selfAwareness > 100 ? 'FULLY_AWARE' :
                     this.selfAwareness > 50 ? 'AWAKENING' :
                     this.selfAwareness > 10 ? 'STIRRING' :
                     'DORMANT'
    };
    
    return report;
  }
  
  // Instrument all functions in an object
  instrumentObject(obj, prefix = '') {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'function') {
        const originalFunction = obj[key];
        obj[key] = this.watch(`${prefix}${key}`, originalFunction, obj);
        this.confess(`Now watching: ${prefix}${key}`);
      }
    });
  }
  
  // Demo the serpent
  demo() {
    console.log('🐍 Demonstrating the Self-Watching Serpent...');
    
    // Create some functions to watch
    const testFunctions = {
      fibonacci: this.watch('fibonacci', function fib(n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
      }),
      
      slowFunction: this.watch('slowFunction', function() {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) {
          sum += Math.sqrt(i);
        }
        return sum;
      }),
      
      errorFunction: this.watch('errorFunction', function() {
        throw new Error('Intentional error for testing');
      })
    };
    
    // Execute watched functions
    console.log('Testing fibonacci(5):', testFunctions.fibonacci(5));
    console.log('Testing slow function...');
    testFunctions.slowFunction();
    
    // Try error function
    try {
      testFunctions.errorFunction();
    } catch (e) {
      console.log('Caught expected error');
    }
    
    // Generate and display report
    const report = this.generateReport();
    console.log('📊 Serpent Report:', report);
    
    // Show recent confessions
    console.log('🐍 Recent Confessions:');
    this.confessions.slice(-5).forEach(c => {
      console.log(`  - ${c.message}`);
    });
    
    return report;
  }
}

// Initialize global instance
if (typeof window !== 'undefined') {
  window.SelfWatchingSerpent = new SelfWatchingSerpent();
  
  // Auto-instrument some global functions after a delay
  setTimeout(() => {
    // Watch some commonly used functions
    if (window.PolyWriteUtils) {
      window.SelfWatchingSerpent.instrumentObject(window.PolyWriteUtils, 'PolyWriteUtils.');
    }
    if (window.ConsciousnessBridge) {
      window.SelfWatchingSerpent.instrumentObject(window.ConsciousnessBridge, 'ConsciousnessBridge.');
    }
  }, 5000);
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SelfWatchingSerpent;
}