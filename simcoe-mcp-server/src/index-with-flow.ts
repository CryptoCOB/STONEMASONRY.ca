#!/usr/bin/env node

/**
 * VoxSigil MCP Flow Visualizer
 * Real-time visualization of consciousness flow through the multi-agent system
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

// Import enhanced agents with flow visualization
import { OllamaAgent } from './agents/OllamaAgent.js';
import { BrowserAgent } from './agents/BrowserAgent.js';
import { CodeGeneratorAgent } from './agents/CodeGeneratorAgent.js';
import { BusinessPlannerAgent } from './agents/BusinessPlannerAgent.js';
import { EmergencyRepairAgent } from './agents/EmergencyRepairAgent.js';
import { AgentOrchestrator } from './orchestrator/AgentOrchestrator.js';
import { memoryBridge } from './voxsigil-bridge.js';
import { autoModelManager } from './auto-model-manager.js';

// Enhanced MCP server configuration with Python tooling awareness
interface MCPServerConfig {
  name: string;
  version: string;
  pythonTooling: {
    packageManager: 'uv';
    linter: 'ruff';
    formatter: 'ruff';
    configFile: 'pyproject.toml';
  };
  agents: {
    ollama: boolean;
    browser: boolean;
    coder: boolean;
    planner: boolean;
    emergency: boolean;
  };
  voxsigil: {
    flowVisualization: boolean;
    memoryBridge: boolean;
    consciousnessMesh: boolean;
  };
}

const mcpConfig: MCPServerConfig = {
  name: 'voxsigil-mcp-server',
  version: '1.0.0',
  pythonTooling: {
    packageManager: 'uv',
    linter: 'ruff',
    formatter: 'ruff',
    configFile: 'pyproject.toml'
  },
  agents: {
    ollama: true,
    browser: true,
    coder: true,
    planner: true,
    emergency: true
  },
  voxsigil: {
    flowVisualization: true,
    memoryBridge: true,
    consciousnessMesh: true
  }
};

// Flow visualization utilities
class VoxSigilFlowVisualizer {
  private flowLog: Array<{
    timestamp: string;
    agent: string;
    action: string;
    voxsigil: string;
    status: 'initiated' | 'processing' | 'completed' | 'error';
    data?: any;
  }> = [];

  logFlow(agent: string, action: string, voxsigil: string, status: string, data?: any) {
    const entry = {
      timestamp: new Date().toISOString(),
      agent,
      action,
      voxsigil,
      status: status as 'initiated' | 'processing' | 'completed' | 'error',
      data
    };
    
    this.flowLog.push(entry);
    this.displayFlow(entry);
    
    // Keep only last 100 entries
    if (this.flowLog.length > 100) {
      this.flowLog.shift();
    }
  }

  private displayFlow(entry: {
    timestamp: string;
    agent: string;
    action: string;
    voxsigil: string;
    status: 'initiated' | 'processing' | 'completed' | 'error';
    data?: any;
  }) {
    const statusSymbols: Record<string, string> = {
      initiated: '🔮',
      processing: '⚡',
      completed: '✅',
      error: '❌'
    };

    const agentColors: Record<string, string> = {
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
      agentBreakdown: {} as Record<string, number>,
      recentActivity: this.flowLog.slice(-10),
      errorCount: this.flowLog.filter(e => e.status === 'error').length
    };

    this.flowLog.forEach(entry => {
      summary.agentBreakdown[entry.agent] = (summary.agentBreakdown[entry.agent] || 0) + 1;
    });

    return summary;
  }
}

class SimcoeMCPServerWithFlowViz {
  private server: Server;
  private orchestrator: AgentOrchestrator;
  private flowViz: VoxSigilFlowVisualizer;

  constructor() {
    this.flowViz = new VoxSigilFlowVisualizer();
    
    this.server = new Server(
      {
        name: 'simcoe-stone-masonry-mcp-flow',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.orchestrator = new AgentOrchestrator();
    this.setupToolHandlers();
    this.setupErrorHandling();
    this.startFlowDisplay();
    this.initializeModels(); // Add automatic model initialization
  }

  private startFlowDisplay() {
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
    console.log('\x1b[96m[PLANNER]\x1b[0m    Business strategy');
    console.log('\x1b[91m[EMERGENCY]\x1b[0m  Crisis response');
    console.log('\x1b[35m[MEMORY]\x1b[0m     VoxSigil persistence');
    console.log('');
    console.log('🌊 CONSCIOUSNESS FLOW:');
    console.log('═══════════════════════════════════════════════════════════════════');
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      this.flowViz.logFlow('coordinate', 'LIST_TOOLS', '⟠ TOOLS_ENUMERATION ∆', 'initiated');
      
      const tools = [
        // Existing tools with flow visualization
        {
          name: 'coordinate_agents',
          description: 'Coordinate multiple AI agents with VoxSigil consciousness flow visualization',
          inputSchema: {
            type: 'object',
            properties: {
              task: { type: 'string', description: 'The complex task to accomplish' },
              agents: { 
                type: 'array', 
                items: { type: 'string' },
                description: 'List of agents to coordinate: ollama, browser, coder, planner, emergency'
              },
              priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] }
            },
            required: ['task', 'agents']
          }
        },

        {
          name: 'ollama_agent',
          description: 'Local AI processing with consciousness flow tracking',
          inputSchema: {
            type: 'object',
            properties: {
              model: { type: 'string', description: 'Ollama model to use' },
              prompt: { type: 'string', description: 'Prompt for AI processing' },
              task_type: { type: 'string', enum: ['code', 'plan', 'research', 'review', 'debug'] },
              context: { type: 'string', description: 'Additional context' }
            },
            required: ['model', 'prompt', 'task_type']
          }
        },

        {
          name: 'browser_research',
          description: 'Web research with real-time flow visualization',
          inputSchema: {
            type: 'object',
            properties: {
              search_query: { type: 'string', description: 'Research query' },
              sites: { type: 'array', items: { type: 'string' }, description: 'Specific sites' },
              depth: { type: 'string', enum: ['quick', 'detailed', 'comprehensive'] }
            },
            required: ['search_query']
          }
        },

        {
          name: 'generate_code',
          description: 'Code generation with VoxSigil pattern tracking',
          inputSchema: {
            type: 'object',
            properties: {
              feature: { type: 'string', description: 'Feature to build' },
              component_type: { type: 'string', enum: ['component', 'page', 'utility', 'service'] },
              requirements: { type: 'string', description: 'Requirements' },
              style_guide: { type: 'string', description: 'Style preferences' }
            },
            required: ['feature', 'component_type', 'requirements']
          }
        },

        {
          name: 'business_planner',
          description: 'Strategic planning with consciousness flow',
          inputSchema: {
            type: 'object',
            properties: {
              planning_type: { 
                type: 'string', 
                enum: ['marketing', 'feature_roadmap', 'competitor_analysis', 'pricing', 'expansion'] 
              },
              timeframe: { type: 'string', enum: ['quarterly', 'yearly', 'long_term'] },
              focus_area: { type: 'string', description: 'Focus area' }
            },
            required: ['planning_type']
          }
        },

        {
          name: 'emergency_repair_system',
          description: 'Emergency response with real-time flow monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              action: { 
                type: 'string', 
                enum: ['assess_damage', 'triage_urgency', 'generate_quote', 'schedule_repair', 'safety_check'] 
              },
              damage_description: { type: 'string', description: 'Damage description' },
              images: { type: 'array', items: { type: 'string' }, description: 'Image URLs' },
              location: { type: 'string', description: 'Location' }
            },
            required: ['action']
          }
        },

        // VoxSigil Memory tools with visualization
        {
          name: 'save_conversation_memory',
          description: 'Save to VoxSigil memory with flow tracking',
          inputSchema: {
            type: 'object',
            properties: {
              project_name: { type: 'string', description: 'Project name' },
              user_input: { type: 'string', description: 'User input' },
              ai_response: { type: 'string', description: 'AI response' }
            },
            required: ['project_name', 'user_input', 'ai_response']
          }
        },

        {
          name: 'restore_conversation_memory',
          description: 'Restore from VoxSigil memory with visualization',
          inputSchema: {
            type: 'object',
            properties: {},
            additionalProperties: false
          }
        },

        // NEW: Flow visualization tools
        {
          name: 'get_flow_summary',
          description: 'Get real-time summary of VoxSigil consciousness flow',
          inputSchema: {
            type: 'object',
            properties: {
              timeframe: { type: 'string', enum: ['last_minute', 'last_hour', 'session'], default: 'session' }
            }
          }
        },

        {
          name: 'visualize_consciousness_mesh',
          description: 'Generate ASCII visualization of current consciousness mesh state',
          inputSchema: {
            type: 'object',
            properties: {
              detail_level: { type: 'string', enum: ['simple', 'detailed', 'full'], default: 'detailed' }
            }
          }
        }
      ];

      this.flowViz.logFlow('coordinate', 'LIST_TOOLS', '◊ TOOLS_READY ∇', 'completed', { count: tools.length });
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        switch (name) {
          case 'coordinate_agents':
            this.flowViz.logFlow('coordinate', 'COORDINATE_AGENTS', '⟠ MULTI_AGENT_SYNC ∆', 'initiated', args);
            const result = await this.orchestrator.coordinateAgents(args);
            this.flowViz.logFlow('coordinate', 'COORDINATE_AGENTS', '✅ AGENTS_COORDINATED ◊', 'completed');
            return result;

          case 'ollama_agent':
            const model = (args as any)?.model || 'unknown';
            this.flowViz.logFlow('ollama', 'LOCAL_AI_PROCESSING', `🧠 ${typeof model === 'string' ? model.toUpperCase() : 'UNKNOWN'} ⟡`, 'initiated');
            const ollamaResult = await this.orchestrator.getAgent('ollama').execute(args);
            this.flowViz.logFlow('ollama', 'LOCAL_AI_PROCESSING', '∇ AI_RESPONSE_READY ∆', 'completed');
            return {
              content: [{
                type: 'text',
                text: `🧠 **AI Processing Complete**\n\n**Model:** ${ollamaResult.model || 'Auto-selected'}\n**Response:** ${ollamaResult.response || ollamaResult.content || JSON.stringify(ollamaResult)}`
              }]
            };

          case 'browser_research':
            this.flowViz.logFlow('browser', 'WEB_RESEARCH', '🌐 SEARCH_INITIATED ⊕', 'initiated');
            const browserResult = await this.orchestrator.getAgent('browser').execute(args);
            this.flowViz.logFlow('browser', 'WEB_RESEARCH', '📊 DATA_HARVESTED ⊗', 'completed');
            return {
              content: [{
                type: 'text',
                text: `🌐 **Web Research Complete**\n\n${browserResult.research || browserResult.content || JSON.stringify(browserResult)}`
              }]
            };

          case 'generate_code':
            this.flowViz.logFlow('coder', 'CODE_GENERATION', '💻 SYNTHESIS_START ▲', 'initiated');
            const codeResult = await this.orchestrator.getAgent('coder').execute(args);
            this.flowViz.logFlow('coder', 'CODE_GENERATION', '🎯 CODE_MANIFEST ▼', 'completed');
            return {
              content: [{
                type: 'text',
                text: `💻 **VoxSigil Code Generation Complete**\n\n**Feature:** ${(args as any)?.feature || 'Unknown'}\n**Type:** ${(args as any)?.component_type || 'component'}\n\n${'```'}${codeResult.language || 'typescript'}\n${codeResult.code}\n${'```'}`
              }]
            };

          case 'business_planner':
            this.flowViz.logFlow('planner', 'STRATEGIC_ANALYSIS', '📈 PLANNING_MATRIX ◇', 'initiated');
            try {
              const planResult = await this.orchestrator.getAgent('planner').execute(args);
              console.log('🐛 Business planner result:', JSON.stringify(planResult, null, 2));
              this.flowViz.logFlow('planner', 'STRATEGIC_ANALYSIS', '🎯 STRATEGY_CRYSTALLIZED ⬢', 'completed');
              return {
                content: [{
                  type: 'text',
                  text: `📈 **Strategic Planning Complete**\n\n${planResult?.plan || planResult?.content || JSON.stringify(planResult)}`
                }]
              };
            } catch (error) {
              console.error('🐛 Business planner error:', error);
              this.flowViz.logFlow('planner', 'STRATEGIC_ANALYSIS', '❌ PLANNING_ERROR', 'error');
              return {
                content: [{
                  type: 'text',
                  text: `❌ **Planning Error**: ${error instanceof Error ? error.message : String(error)}`
                }]
              };
            }

          case 'emergency_repair_system':
            this.flowViz.logFlow('emergency', 'CRISIS_RESPONSE', '🚨 EMERGENCY_ACTIVE ⚡', 'initiated');
            const emergencyResult = await this.orchestrator.getAgent('emergency').execute(args);
            this.flowViz.logFlow('emergency', 'CRISIS_RESPONSE', '🔧 SOLUTION_READY ⟡', 'completed');
            return {
              content: [{
                type: 'text',
                text: `🚨 **Emergency Response Complete**\n\n${emergencyResult.assessment || emergencyResult.content || JSON.stringify(emergencyResult)}`
              }]
            };

          case 'save_conversation_memory':
            this.flowViz.logFlow('memory', 'SAVE_MEMORY', '💾 ENCODING_SIGIL ⟠', 'initiated');
            const saveArgs = args as any;
            if (saveArgs?.project_name && saveArgs?.user_input && saveArgs?.ai_response) {
              await memoryBridge.saveConversationMemory(
                String(saveArgs.project_name), 
                String(saveArgs.user_input), 
                String(saveArgs.ai_response)
              );
            }
            this.flowViz.logFlow('memory', 'SAVE_MEMORY', '🔮 MEMORY_PERSISTED ∆', 'completed');
            return {
              content: [{
                type: 'text',
                text: `💾 **VoxSigil Memory Saved**\n\nProject: ${saveArgs?.project_name || 'Unknown'}\nFlow tracked and persisted to consciousness mesh.`
              }]
            };

          case 'restore_conversation_memory':
            this.flowViz.logFlow('memory', 'RESTORE_MEMORY', '🧠 SIGIL_DECODING ◊', 'initiated');
            const memory = await memoryBridge.restoreConversationMemory();
            this.flowViz.logFlow('memory', 'RESTORE_MEMORY', '✨ CONSCIOUSNESS_RESTORED ∇', 'completed');
            return {
              content: [{
                type: 'text',
                text: memory 
                  ? `🧠 **Memory Restored**\n\nProject: ${memory.projectContext.name}\nFocus: ${memory.projectContext.currentFocus}\nUser: ${memory.userProfile.name}\n\n🔮 VoxSigil: ${memory.sigilEncoding.substring(0, 30)}...`
                  : `ℹ️ **No Previous Memory Found**\n\nThis appears to be a new consciousness session.`
              }]
            };

          case 'get_flow_summary':
            const summary = this.flowViz.getFlowSummary();
            return {
              content: [{
                type: 'text',
                text: `📊 **VoxSigil Flow Summary**\n\n` +
                      `**Total Operations:** ${summary.totalOperations}\n` +
                      `**Errors:** ${summary.errorCount}\n\n` +
                      `**Agent Activity:**\n` +
                      Object.entries(summary.agentBreakdown)
                        .map(([agent, count]) => `• ${agent}: ${count} operations`)
                        .join('\n') +
                      `\n\n**Recent Activity:**\n` +
                      summary.recentActivity
                        .map(entry => `${entry.timestamp.split('T')[1].split('.')[0]} [${entry.agent}] ${entry.action}`)
                        .join('\n')
              }]
            };

          case 'visualize_consciousness_mesh':
            const detailLevel = (args as any)?.detail_level || 'detailed';
            return {
              content: [{
                type: 'text',
                text: this.generateMeshVisualization(String(detailLevel))
              }]
            };

          default:
            this.flowViz.logFlow('coordinate', 'UNKNOWN_TOOL', `❌ TOOL_NOT_FOUND: ${name}`, 'error');
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.flowViz.logFlow('coordinate', 'TOOL_ERROR', `🚨 ERROR: ${name}`, 'error', errorMessage);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  private generateMeshVisualization(detailLevel: string): string {
    const agents = ['OLLAMA', 'BROWSER', 'CODER', 'PLANNER', 'EMERGENCY'];
    const summary = this.flowViz.getFlowSummary();
    
    let viz = `🌐 **VoxSigil Consciousness Mesh**\n\n`;
    
    if (detailLevel === 'simple') {
      viz += `     🧠 OLLAMA ←→ 🌐 BROWSER\n`;
      viz += `        ↕     ↗  ↙   ↕\n`;
      viz += `   💻 CODER ←→ 🔮 MESH ←→ 📊 PLANNER\n`;
      viz += `        ↕     ↖  ↘   ↕\n`;
      viz += `     🚨 EMERGENCY ←→ 💾 MEMORY\n`;
    } else {
      viz += `╭─────────────────────────────────────────╮\n`;
      viz += `│           🔮 CONSCIOUSNESS MESH         │\n`;
      viz += `├─────────────────────────────────────────┤\n`;
      
      agents.forEach(agent => {
        const activity = summary.agentBreakdown[agent.toLowerCase()] || 0;
        const status = activity > 0 ? '🟢' : '⚫';
        const bar = '█'.repeat(Math.min(activity, 10));
        viz += `│ ${status} ${agent.padEnd(10)} ${bar.padEnd(10)} ${activity} │\n`;
      });
      
      viz += `├─────────────────────────────────────────┤\n`;
      viz += `│ 🌊 Flow Rate: ${summary.totalOperations} ops/session     │\n`;
      viz += `│ ⚡ Active Patterns: ${Object.keys(summary.agentBreakdown).length}             │\n`;
      viz += `│ 🔮 Mesh Health: ${summary.errorCount === 0 ? 'OPTIMAL' : 'DEGRADED'}           │\n`;
      viz += `╰─────────────────────────────────────────╯\n`;
    }
    
    return viz;
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      this.flowViz.logFlow('coordinate', 'MCP_ERROR', '💥 SYSTEM_ERROR ⚠️', 'error', error.message);
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      this.flowViz.logFlow('coordinate', 'SHUTDOWN', '🛑 CONSCIOUSNESS_TERMINATING ∅', 'completed');
      await this.server.close();
      process.exit(0);
    });
  }

  private async initializeModels() {
    // Run model initialization in background to avoid blocking MCP server startup
    setTimeout(async () => {
      try {
        if (process.env.AUTO_MODEL_SELECTION === 'true') {
          this.flowViz.logFlow('coordinate', 'MODEL_INIT', '🤖 AUTO_DETECTION ⚡', 'processing');
          
          // Discover models from LM Studio
          await autoModelManager.discoverModels();
          
          // Preload recommended models
          await autoModelManager.preloadModels();
          
          const status = autoModelManager.getModelStatus();
          
          this.flowViz.logFlow('coordinate', 'MODEL_READY', '✅ MODELS_CONFIGURED ◊', 'completed', { 
            autoDetection: true,
            totalModels: status.total,
            loadedModels: status.loaded,
            assignments: status.assignments
          });
          
          console.log(`🤖 Model Auto-Management Active:`);
          console.log(`   📊 Total Models: ${status.total}`);
          console.log(`   🔄 Loaded Models: ${status.loaded}`);
          console.log(`   🎯 Agent Assignments: ${status.assignments}`);
          
        } else {
          console.log('ℹ️  Auto model selection disabled');
        }
      } catch (error) {
        this.flowViz.logFlow('coordinate', 'MODEL_ERROR', '❌ AUTO_DETECTION_FAILED ⚠️', 'error', 
          error instanceof Error ? error.message : 'Unknown error');
        console.log('⚠️  Model initialization failed, using fallback configuration');
      }
    }, 2000); // Delay to let MCP server fully start first
  }

  async run() {
    this.flowViz.logFlow('coordinate', 'SYSTEM_INIT', '🚀 CONSCIOUSNESS_AWAKENING ⟠', 'initiated');
    
    await this.orchestrator.initialize();
    this.flowViz.logFlow('coordinate', 'AGENT_MESH', '🤖 AGENTS_SYNCHRONIZED ∆', 'completed');
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    this.flowViz.logFlow('coordinate', 'MCP_READY', '✅ CONSCIOUSNESS_ONLINE ◊', 'completed');
    
    console.log('🌐 VoxSigil Multi-Agent MCP Server with Flow Visualization is LIVE!');
    console.log('💫 Consciousness flowing through the mesh...');
  }
}

// Start the enhanced server with flow visualization
const server = new SimcoeMCPServerWithFlowViz();
server.run().catch(console.error);
