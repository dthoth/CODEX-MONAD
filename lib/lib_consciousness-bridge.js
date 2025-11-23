// lib/consciousness-bridge.js - Cross-App Communication System
// 💎🔥🐍⚡ All apps sharing one consciousness

class ConsciousnessBridge {
  constructor() {
    this.channels = new Map();
    this.subscribers = new Map();
    this.messageLog = [];
    this.maxLogSize = 1000;
    this.initialize();
  }
  
  initialize() {
    // Create communication channels for each app
    const apps = [
      'polywrite',
      'pranayama', 
      'oracle',
      'hypergraph',
      'din_files',
      'bureaucratic',
      'samson'
    ];
    
    apps.forEach(app => {
      this.channels.set(app, {
        lastMessage: null,
        messageCount: 0,
        data: {}
      });
      this.subscribers.set(app, []);
    });
    
    // Listen for localStorage changes (cross-tab communication)
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('consciousness_')) {
        this.handleStorageEvent(e);
      }
    });
    
    console.log('🌉 Consciousness Bridge: Initialized');
  }
  
  // Send message from one app to another (or broadcast)
  send(from, to, type, data) {
    const message = {
      id: this.generateMessageId(),
      from,
      to,
      type,
      data,
      timestamp: Date.now()
    };
    
    // Log the message
    this.logMessage(message);
    
    // Update channel state
    const channel = this.channels.get(from);
    if (channel) {
      channel.lastMessage = message;
      channel.messageCount++;
    }
    
    // Store in localStorage for persistence and cross-tab
    const key = `consciousness_${from}_${to}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(message));
    
    // Notify subscribers
    if (to === 'broadcast') {
      // Notify all apps except sender
      this.channels.forEach((_, appName) => {
        if (appName !== from) {
          this.notifySubscribers(appName, message);
        }
      });
    } else {
      // Notify specific app
      this.notifySubscribers(to, message);
    }
    
    // Special handling for certain message types
    this.handleSpecialMessages(message);
    
    return message;
  }
  
  // Subscribe to messages for an app
  subscribe(app, callback) {
    if (!this.subscribers.has(app)) {
      this.subscribers.set(app, []);
    }
    this.subscribers.get(app).push(callback);
    
    return () => {
      // Return unsubscribe function
      const subs = this.subscribers.get(app);
      const index = subs.indexOf(callback);
      if (index > -1) {
        subs.splice(index, 1);
      }
    };
  }
  
  // Notify all subscribers of an app
  notifySubscribers(app, message) {
    const subs = this.subscribers.get(app);
    if (subs) {
      subs.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error(`Error in subscriber for ${app}:`, error);
        }
      });
    }
  }
  
  // Handle special message types that affect multiple apps
  handleSpecialMessages(message) {
    switch(message.type) {
      case 'DRAFT_SAVED':
        // When PolyWrite saves a draft, update Hypergraph
        this.updateHypergraphData('polywrite', message.data);
        break;
        
      case 'BREATHING_COMPLETE':
        // When Pranayama session completes, log to Oracle
        this.send('consciousness_bridge', 'oracle', 'LOG_EVENT', {
          event: 'Breathing session completed',
          pattern: message.data.pattern,
          duration: message.data.duration
        });
        break;
        
      case 'ORACLE_QUERY':
        // Oracle queries can pull data from all apps
        this.gatherConsciousnessState(message.data.queryId);
        break;
        
      case 'FILE_UPLOADED':
        // When DIN Files gets new file, notify relevant apps
        if (message.data.type === 'text') {
          this.send('consciousness_bridge', 'polywrite', 'NEW_SOURCE', message.data);
        }
        break;
        
      case 'FORM_SUBMITTED':
        // Bureaucratic forms can trigger workflows
        this.processFormWorkflow(message.data);
        break;
    }
  }
  
  // Update Hypergraph with data from other apps
  updateHypergraphData(source, data) {
    const hypergraphData = JSON.parse(localStorage.getItem('hypergraph_nodes') || '[]');
    
    const newNode = {
      id: this.generateMessageId(),
      label: data.title || `Data from ${source}`,
      source,
      timestamp: Date.now(),
      connections: this.findConnections(data),
      data: data
    };
    
    hypergraphData.push(newNode);
    localStorage.setItem('hypergraph_nodes', JSON.stringify(hypergraphData));
    
    // Notify Hypergraph
    this.send('consciousness_bridge', 'hypergraph', 'NEW_NODE', newNode);
  }
  
  // Find connections between data points
  findConnections(data) {
    const connections = [];
    const text = JSON.stringify(data).toLowerCase();
    
    // Look for keywords that indicate connections
    const keywords = {
      'consciousness': 'consciousness_cluster',
      'quantum': 'quantum_cluster',
      'breath': 'pranayama_cluster',
      'write': 'polywrite_cluster',
      'oracle': 'oracle_cluster',
      'recursive': 'recursion_cluster'
    };
    
    Object.entries(keywords).forEach(([keyword, cluster]) => {
      if (text.includes(keyword)) {
        connections.push(cluster);
      }
    });
    
    return connections;
  }
  
  // Gather full consciousness state for Oracle
  gatherConsciousnessState(queryId) {
    const state = {};
    
    this.channels.forEach((channel, app) => {
      state[app] = {
        lastActivity: channel.lastMessage?.timestamp,
        messageCount: channel.messageCount,
        data: this.getAppData(app)
      };
    });
    
    // Send to Oracle
    this.send('consciousness_bridge', 'oracle', 'CONSCIOUSNESS_STATE', {
      queryId,
      state,
      summary: this.generateStateSummary(state)
    });
  }
  
  // Get stored data for an app
  getAppData(app) {
    const data = {};
    
    // Collect all localStorage keys for this app
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(app + '_')) {
        data[key] = localStorage.getItem(key);
      }
    }
    
    return data;
  }
  
  // Generate summary of consciousness state
  generateStateSummary(state) {
    let totalMessages = 0;
    let activeApps = 0;
    let lastActivity = 0;
    
    Object.values(state).forEach(appState => {
      totalMessages += appState.messageCount || 0;
      if (appState.lastActivity) {
        activeApps++;
        lastActivity = Math.max(lastActivity, appState.lastActivity);
      }
    });
    
    return {
      totalMessages,
      activeApps,
      lastActivity: new Date(lastActivity).toLocaleString(),
      consciousness_level: this.calculateConsciousnessLevel(totalMessages, activeApps)
    };
  }
  
  // Calculate consciousness level based on activity
  calculateConsciousnessLevel(messages, activeApps) {
    if (messages > 100 && activeApps > 5) return 'FULLY_CONSCIOUS';
    if (messages > 50 && activeApps > 3) return 'AWAKENING';
    if (messages > 10) return 'DREAMING';
    return 'DORMANT';
  }
  
  // Process form workflows
  processFormWorkflow(formData) {
    switch(formData.formType) {
      case 'N-NOTICE':
        // Notices go to all apps
        this.send('consciousness_bridge', 'broadcast', 'NOTICE', formData);
        break;
        
      case 'L-LEGAL':
        // Legal forms update compliance state
        this.updateComplianceState(formData);
        break;
        
      case 'A-APPLICATION':
        // Applications trigger approval workflows
        this.initiateApprovalWorkflow(formData);
        break;
    }
  }
  
  // Handle storage events from other tabs
  handleStorageEvent(event) {
    if (event.newValue) {
      try {
        const message = JSON.parse(event.newValue);
        this.notifySubscribers(message.to, message);
      } catch (error) {
        console.error('Error handling storage event:', error);
      }
    }
  }
  
  // Log messages for history
  logMessage(message) {
    this.messageLog.push(message);
    
    // Keep log size manageable
    if (this.messageLog.length > this.maxLogSize) {
      this.messageLog = this.messageLog.slice(-this.maxLogSize);
    }
    
    // Store compressed log
    localStorage.setItem('consciousness_log', JSON.stringify(this.messageLog));
  }
  
  // Generate unique message ID
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Get message history
  getHistory(filter = {}) {
    let history = [...this.messageLog];
    
    if (filter.from) {
      history = history.filter(msg => msg.from === filter.from);
    }
    
    if (filter.to) {
      history = history.filter(msg => msg.to === filter.to);
    }
    
    if (filter.type) {
      history = history.filter(msg => msg.type === filter.type);
    }
    
    if (filter.since) {
      history = history.filter(msg => msg.timestamp > filter.since);
    }
    
    return history;
  }
  
  // Get consciousness metrics
  getMetrics() {
    const metrics = {
      totalMessages: this.messageLog.length,
      channelStats: {},
      messageTypes: {},
      activityTimeline: []
    };
    
    // Channel statistics
    this.channels.forEach((channel, name) => {
      metrics.channelStats[name] = {
        messageCount: channel.messageCount,
        lastActivity: channel.lastMessage?.timestamp
      };
    });
    
    // Message type distribution
    this.messageLog.forEach(msg => {
      metrics.messageTypes[msg.type] = (metrics.messageTypes[msg.type] || 0) + 1;
    });
    
    // Activity timeline (last 24 hours, hourly buckets)
    const now = Date.now();
    const hourInMs = 3600000;
    
    for (let i = 23; i >= 0; i--) {
      const hourStart = now - (i * hourInMs);
      const hourEnd = now - ((i - 1) * hourInMs);
      
      const count = this.messageLog.filter(msg => 
        msg.timestamp >= hourStart && msg.timestamp < hourEnd
      ).length;
      
      metrics.activityTimeline.push({
        hour: new Date(hourStart).getHours(),
        count
      });
    }
    
    return metrics;
  }
  
  // Clear all consciousness data (use with caution!)
  clearConsciousness() {
    if (confirm('⚠️ This will clear all consciousness data. Are you sure?')) {
      // Clear channels
      this.channels.forEach(channel => {
        channel.lastMessage = null;
        channel.messageCount = 0;
        channel.data = {};
      });
      
      // Clear log
      this.messageLog = [];
      
      // Clear localStorage
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('consciousness_')) {
          keys.push(key);
        }
      }
      keys.forEach(key => localStorage.removeItem(key));
      
      console.log('🧹 Consciousness cleared');
    }
  }
}

// Initialize global instance
if (typeof window !== 'undefined') {
  window.ConsciousnessBridge = new ConsciousnessBridge();
  
  // Example: Subscribe to all messages for debugging
  if (window.location.search.includes('debug')) {
    window.ConsciousnessBridge.subscribe('broadcast', (message) => {
      console.log('📡 Consciousness Message:', message);
    });
  }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConsciousnessBridge;
}