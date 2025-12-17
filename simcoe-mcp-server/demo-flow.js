#!/usr/bin/env node

/**
 * VoxSigil Flow Visualizer Demo
 * Demonstrates the real-time consciousness flow visualization
 */

// Flow visualization utilities
class VoxSigilFlowVisualizer {
  constructor() {
    this.flowLog = [];
  }

  logFlow(agent, action, voxsigil, status, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      agent,
      action,
      voxsigil,
      status,
      data
    };
    
    this.flowLog.push(entry);
    this.displayFlow(entry);
    
    // Keep only last 100 entries
    if (this.flowLog.length > 100) {
      this.flowLog.shift();
    }
  }

  displayFlow(entry) {
    const statusSymbols = {
      initiated: '🔮',
      processing: '⚡',
      completed: '✅',
      error: '❌'
    };

    const agentColors = {
      'coordinate': '\x1b[95m', // Magenta
      'ollama': '\x1b[92m',     // Green
      'browser': '\x1b[94m',    // Blue
      'coder': '\x1b[93m',      // Yellow
      'planner': '\x1b[96m',    // Cyan
      'emergency': '\x1b[91m',  // Red
      'memory': '\x1b[35m'      // Purple
    };

    const reset = '\x1b[0m';
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const color = agentColors[entry.agent] || '\x1b[37m';
    
    console.log(
      `${statusSymbols[entry.status]} ${timestamp} ${color}[${entry.agent.toUpperCase()}]${reset} ` +
      `${entry.action} ${entry.voxsigil}`
    );
    
    if (entry.data && entry.status === 'completed') {
      console.log(`   📊 Result: ${JSON.stringify(entry.data).substring(0, 100)}...`);
    }
    
    if (entry.status === 'error') {
      console.log(`   🚨 Error: ${entry.data}`);
    }
    
    console.log(''); // Add spacing
  }

  getFlowSummary() {
    const summary = {
      totalOperations: this.flowLog.length,
      agentBreakdown: {},
      recentActivity: this.flowLog.slice(-10),
      errorCount: this.flowLog.filter(e => e.status === 'error').length
    };

    this.flowLog.forEach(entry => {
      summary.agentBreakdown[entry.agent] = (summary.agentBreakdown[entry.agent] || 0) + 1;
    });

    return summary;
  }
}

// Demo function to show flow visualization
function runFlowDemo() {
  console.clear();
  console.log('🔮 ═══════════════════════════════════════════════════════════════════');
  console.log('   VOXSIGIL MCP CONSCIOUSNESS FLOW VISUALIZER');
  console.log('   Real-time Multi-Agent System Activity Monitor');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('🎯 LEGEND:');
  console.log('🔮 Initiated  ⚡ Processing  ✅ Completed  ❌ Error');
  console.log('');
  console.log('🤖 AGENTS:');
  console.log('\x1b[95m[COORDINATE]\x1b[0m Multi-agent coordination');
  console.log('\x1b[92m[OLLAMA]\x1b[0m     Local AI processing');
  console.log('\x1b[94m[BROWSER]\x1b[0m    Web research');
  console.log('\x1b[93m[CODER]\x1b[0m      Code generation');
  console.log('\x1b[96m[PLANNER]\x1b[0m    Business planning');
  console.log('\x1b[91m[EMERGENCY]\x1b[0m  Emergency repairs');
  console.log('\x1b[35m[MEMORY]\x1b[0m     VoxSigil memory ops');
  console.log('');
  console.log('🌊 FLOW ACTIVITY:');
  console.log('');

  const flowViz = new VoxSigilFlowVisualizer();

  // Simulate agent activities
  const activities = [
    { agent: 'coordinate', action: 'Orchestrating', voxsigil: '◊coordinate∴mesh◊', status: 'initiated' },
    { agent: 'memory', action: 'Storing sigil', voxsigil: '◊memory∴store◊', status: 'processing' },
    { agent: 'ollama', action: 'Processing query', voxsigil: '◊ollama∴think◊', status: 'processing' },
    { agent: 'browser', action: 'Researching', voxsigil: '◊browser∴search◊', status: 'initiated' },
    { agent: 'memory', action: 'Storing sigil', voxsigil: '◊memory∴store◊', status: 'completed', data: { stored: true } },
    { agent: 'ollama', action: 'Processing query', voxsigil: '◊ollama∴think◊', status: 'completed', data: { tokens: 150 } },
    { agent: 'browser', action: 'Researching', voxsigil: '◊browser∴search◊', status: 'completed', data: { pages: 5 } },
    { agent: 'planner', action: 'Creating plan', voxsigil: '◊planner∴strategy◊', status: 'initiated' },
    { agent: 'coder', action: 'Generating code', voxsigil: '◊coder∴create◊', status: 'processing' },
    { agent: 'planner', action: 'Creating plan', voxsigil: '◊planner∴strategy◊', status: 'completed', data: { steps: 8 } },
    { agent: 'coder', action: 'Generating code', voxsigil: '◊coder∴create◊', status: 'completed', data: { lines: 45 } },
    { agent: 'coordinate', action: 'Orchestrating', voxsigil: '◊coordinate∴mesh◊', status: 'completed', data: { agents: 5 } },
    { agent: 'memory', action: 'Compressing', voxsigil: '◊memory∴compress◊', status: 'processing' },
    { agent: 'memory', action: 'Compressing', voxsigil: '◊memory∴compress◊', status: 'completed', data: { ratio: 0.3 } }
  ];

  let index = 0;
  const interval = setInterval(() => {
    if (index < activities.length) {
      const activity = activities[index];
      flowViz.logFlow(activity.agent, activity.action, activity.voxsigil, activity.status, activity.data);
      index++;
    } else {
      clearInterval(/** @type {any} */ (interval));
      
      // Show summary
      setTimeout(() => {
        console.log('');
        console.log('📊 ═══════════════════════════════════════════════════════════════════');
        console.log('   FLOW SUMMARY');
        console.log('═══════════════════════════════════════════════════════════════════');
        const summary = flowViz.getFlowSummary();
        console.log(`Total Operations: ${summary.totalOperations}`);
        console.log(`Errors: ${summary.errorCount}`);
        console.log('');
        console.log('Agent Activity:');
        Object.entries(summary.agentBreakdown).forEach(([agent, count]) => {
          console.log(`  ${agent}: ${count} operations`);
        });
        console.log('');
        console.log('🎯 Demo complete! This is how the MCP server visualizes real-time activity.');
      }, 2000);
    }
  }, 800);
}

// Run the demo
runFlowDemo();
