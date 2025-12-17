#!/usr/bin/env node

/**
 * VoxSigil-MCP Bridge for GitHub Copilot
 * Allows Copilot to use VoxSigil system for context engineering and persistence
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface SigilState {
  project_id: string;
  session_id: string;
  timestamp: string;
  context_encoding: string;
  agent_states: Record<string, any>;
  conversation_memory: string[];
  project_progress: {
    completed_features: string[];
    current_tasks: string[];
    next_priorities: string[];
  };
  technical_context: {
    tech_stack: string[];
    file_structure: Record<string, any>;
    dependencies: string[];
    configurations: Record<string, any>;
  };
  business_context: {
    domain: string;
    objectives: string[];
    constraints: string[];
    stakeholders: string[];
  };
}

class VoxSigilMCPBridge {
  private server: Server;
  private sigilPath: string;
  private currentState: SigilState | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'voxsigil-copilot-bridge',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.sigilPath = path.join(process.cwd(), 'library-sigil');
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // === COPILOT CONTEXT MANAGEMENT ===
          {
            name: 'encode_context_sigil',
            description: 'Create a VoxSigil that encodes current project/conversation context for Copilot',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Name of the current project' },
                session_summary: { type: 'string', description: 'Summary of current session' },
                technical_state: { type: 'object', description: 'Current technical context' },
                conversation_history: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Key conversation points to remember'
                },
                next_session_priorities: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'What to focus on next time'
                }
              },
              required: ['project_name', 'session_summary']
            }
          },

          {
            name: 'decode_context_sigil',
            description: 'Read a VoxSigil to restore Copilot context from previous sessions',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Project to restore context for' },
                session_id: { type: 'string', description: 'Specific session ID (optional)' },
                include_history: { type: 'boolean', default: true, description: 'Include conversation history' }
              },
              required: ['project_name']
            }
          },

          {
            name: 'update_progress_sigil',
            description: 'Update project progress in the VoxSigil as work continues',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Project being updated' },
                completed_tasks: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Tasks completed in this session'
                },
                new_insights: {
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'New insights or learnings'
                },
                blockers: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Current blockers or challenges'
                },
                updated_files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Files that were modified'
                }
              },
              required: ['project_name']
            }
          },

          {
            name: 'query_sigil_memory',
            description: 'Search VoxSigil memory for specific information across sessions',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'What to search for in sigil memory' },
                project_filter: { type: 'string', description: 'Limit to specific project (optional)' },
                timeframe: { 
                  type: 'string', 
                  enum: ['last_session', 'last_week', 'last_month', 'all_time'],
                  description: 'Time range to search'
                }
              },
              required: ['query']
            }
          },

          {
            name: 'generate_context_summary',
            description: 'Generate a human-readable summary of current project state from sigils',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Project to summarize' },
                format: { 
                  type: 'string', 
                  enum: ['brief', 'detailed', 'technical', 'business'],
                  description: 'Type of summary to generate'
                },
                audience: {
                  type: 'string',
                  enum: ['developer', 'stakeholder', 'copilot', 'user'],
                  description: 'Who the summary is for'
                }
              },
              required: ['project_name']
            }
          },

          {
            name: 'create_session_bridge',
            description: 'Create a bridge sigil to carry context to next Copilot session',
            inputSchema: {
              type: 'object',
              properties: {
                project_name: { type: 'string', description: 'Current project' },
                exit_state: { type: 'string', description: 'How this session is ending' },
                handoff_notes: { type: 'string', description: 'Notes for next session' },
                urgent_items: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Urgent items for immediate attention next time'
                }
              },
              required: ['project_name', 'exit_state']
            }
          },

          // === VOXSIGIL INTEGRATION ===
          {
            name: 'load_voxsigil_scaffold',
            description: 'Load a specific VoxSigil scaffold for enhanced AI capabilities',
            inputSchema: {
              type: 'object',
              properties: {
                scaffold_name: { type: 'string', description: 'Name of scaffold to load' },
                context_binding: { type: 'string', description: 'Bind to current project context' },
                activation_mode: {
                  type: 'string',
                  enum: ['passive', 'active', 'hybrid'],
                  description: 'How the scaffold should operate'
                }
              },
              required: ['scaffold_name']
            }
          },

          {
            name: 'weave_context_sigil',
            description: 'Use VoxSigil weaving to create persistent context threads',
            inputSchema: {
              type: 'object',
              properties: {
                thread_type: {
                  type: 'string',
                  enum: ['technical', 'business', 'creative', 'problem_solving'],
                  description: 'Type of context thread to weave'
                },
                anchor_points: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key points to anchor the thread'
                },
                persistence_level: {
                  type: 'string',
                  enum: ['session', 'project', 'permanent'],
                  description: 'How long the thread should persist'
                }
              },
              required: ['thread_type', 'anchor_points']
            }
          }
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'encode_context_sigil':
            return await this.encodeContextSigil(args);
          case 'decode_context_sigil':
            return await this.decodeContextSigil(args);
          case 'update_progress_sigil':
            return await this.updateProgressSigil(args);
          case 'query_sigil_memory':
            return await this.querySigilMemory(args);
          case 'generate_context_summary':
            return await this.generateContextSummary(args);
          case 'create_session_bridge':
            return await this.createSessionBridge(args);
          case 'load_voxsigil_scaffold':
            return await this.loadVoxSigilScaffold(args);
          case 'weave_context_sigil':
            return await this.weaveContextSigil(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `VoxSigil operation failed: ${errorMessage}`);
      }
    });
  }

  private async encodeContextSigil(args: any) {
    const timestamp = new Date().toISOString();
    const sessionId = `session_${Date.now()}`;
    
    const sigilState: SigilState = {
      project_id: args.project_name.toLowerCase().replace(/\s+/g, '_'),
      session_id: sessionId,
      timestamp,
      context_encoding: this.generateContextEncoding(args),
      agent_states: {},
      conversation_memory: args.conversation_history || [],
      project_progress: {
        completed_features: [],
        current_tasks: [],
        next_priorities: args.next_session_priorities || []
      },
      technical_context: args.technical_state || {},
      business_context: {
        domain: 'stone_masonry',
        objectives: [],
        constraints: [],
        stakeholders: []
      }
    };

    // Save the sigil
    const sigilFile = path.join(this.sigilPath, 'context', `${sigilState.project_id}_${sessionId}.yaml`);
    await fs.mkdir(path.dirname(sigilFile), { recursive: true });
    await fs.writeFile(sigilFile, yaml.dump(sigilState, { indent: 2 }));

    // Create a symbolic representation
    const contextSymbol = this.generateContextSymbol(sigilState);

    return {
      content: [
        {
          type: 'text',
          text: `🔮 **VoxSigil Context Encoded**\n\n` +
                `**Project:** ${args.project_name}\n` +
                `**Session:** ${sessionId}\n` +
                `**Timestamp:** ${timestamp}\n\n` +
                `**Context Symbol:** ${contextSymbol}\n\n` +
                `**Encoded State:**\n` +
                `- Conversation History: ${args.conversation_history?.length || 0} items\n` +
                `- Next Priorities: ${args.next_session_priorities?.length || 0} items\n` +
                `- Technical Context: ${Object.keys(args.technical_state || {}).length} elements\n\n` +
                `**Usage:** Use \`decode_context_sigil\` with project name "${args.project_name}" to restore this context in future sessions.\n\n` +
                `**Sigil Path:** ${sigilFile}`
        }
      ]
    };
  }

  private async decodeContextSigil(args: any) {
    const projectId = args.project_name.toLowerCase().replace(/\s+/g, '_');
    const contextDir = path.join(this.sigilPath, 'context');
    
    try {
      const files = await fs.readdir(contextDir);
      const projectFiles = files.filter(f => f.startsWith(projectId) && f.endsWith('.yaml'));
      
      if (projectFiles.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ **No VoxSigil context found for project "${args.project_name}"**\n\n` +
                    `This appears to be a new project or the sigils haven't been created yet.\n` +
                    `Use \`encode_context_sigil\` to create initial context.`
            }
          ]
        };
      }

      // Get the most recent file if no specific session requested
      const targetFile = args.session_id 
        ? projectFiles.find(f => f.includes(args.session_id))
        : projectFiles.sort().pop();

      if (!targetFile) {
        throw new Error(`Session ${args.session_id} not found`);
      }

      const sigilContent = await fs.readFile(path.join(contextDir, targetFile), 'utf8');
      const sigilState: SigilState = yaml.load(sigilContent) as SigilState;
      
      this.currentState = sigilState;

      let contextSummary = `🔮 **VoxSigil Context Restored**\n\n`;
      contextSummary += `**Project:** ${args.project_name}\n`;
      contextSummary += `**Session:** ${sigilState.session_id}\n`;
      contextSummary += `**Last Updated:** ${sigilState.timestamp}\n\n`;
      
      if (sigilState.conversation_memory.length > 0 && args.include_history) {
        contextSummary += `**Previous Conversation Context:**\n`;
        sigilState.conversation_memory.forEach((item, i) => {
          contextSummary += `${i + 1}. ${item}\n`;
        });
        contextSummary += `\n`;
      }

      if (sigilState.project_progress.next_priorities.length > 0) {
        contextSummary += `**Next Priorities:**\n`;
        sigilState.project_progress.next_priorities.forEach((priority, i) => {
          contextSummary += `${i + 1}. ${priority}\n`;
        });
        contextSummary += `\n`;
      }

      if (Object.keys(sigilState.technical_context).length > 0) {
        contextSummary += `**Technical Context:**\n`;
        Object.entries(sigilState.technical_context).forEach(([key, value]) => {
          contextSummary += `- **${key}:** ${JSON.stringify(value)}\n`;
        });
        contextSummary += `\n`;
      }

      contextSummary += `**Context Symbol:** ${this.generateContextSymbol(sigilState)}\n\n`;
      contextSummary += `✅ **Ready to continue from where we left off!**`;

      return {
        content: [
          {
            type: 'text',
            text: contextSummary
          }
        ]
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Error decoding VoxSigil:** ${errorMessage}\n\n` +
                  `Please check that the sigil files exist and are properly formatted.`
          }
        ]
      };
    }
  }

  private async updateProgressSigil(args: any) {
    if (!this.currentState) {
      return {
        content: [
          {
            type: 'text',
            text: `⚠️ **No active sigil context.** Use \`decode_context_sigil\` first to load project context.`
          }
        ]
      };
    }

    // Update the current state
    if (args.completed_tasks) {
      this.currentState.project_progress.completed_features.push(...args.completed_tasks);
    }
    
    if (args.new_insights) {
      this.currentState.conversation_memory.push(...args.new_insights.map((insight: string) => `💡 ${insight}`));
    }

    if (args.blockers) {
      this.currentState.conversation_memory.push(...args.blockers.map((blocker: string) => `🚫 BLOCKER: ${blocker}`));
    }

    if (args.updated_files) {
      (this.currentState.technical_context as any).recent_files = args.updated_files;
      (this.currentState.technical_context as any).last_file_update = new Date().toISOString();
    }

    // Save updated state
    const sigilFile = path.join(
      this.sigilPath, 
      'context', 
      `${this.currentState.project_id}_${this.currentState.session_id}.yaml`
    );
    await fs.writeFile(sigilFile, yaml.dump(this.currentState, { indent: 2 }));

    return {
      content: [
        {
          type: 'text',
          text: `✅ **VoxSigil Progress Updated**\n\n` +
                `**Completed Tasks:** ${args.completed_tasks?.length || 0}\n` +
                `**New Insights:** ${args.new_insights?.length || 0}\n` +
                `**Blockers:** ${args.blockers?.length || 0}\n` +
                `**Updated Files:** ${args.updated_files?.length || 0}\n\n` +
                `**Updated Context Symbol:** ${this.generateContextSymbol(this.currentState)}`
        }
      ]
    };
  }

  private async querySigilMemory(args: any) {
    const contextDir = path.join(this.sigilPath, 'context');
    
    try {
      const files = await fs.readdir(contextDir);
      const results = [];

      for (const file of files) {
        if (!file.endsWith('.yaml')) continue;
        if (args.project_filter && !file.includes(args.project_filter.toLowerCase().replace(/\s+/g, '_'))) continue;

        const content = await fs.readFile(path.join(contextDir, file), 'utf8');
        const sigil: SigilState = yaml.load(content) as SigilState;

        // Simple text search across conversation memory
        const matches = sigil.conversation_memory.filter(item => 
          item.toLowerCase().includes(args.query.toLowerCase())
        );

        if (matches.length > 0) {
          results.push({
            project: sigil.project_id,
            session: sigil.session_id,
            timestamp: sigil.timestamp,
            matches
          });
        }
      }

      if (results.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `🔍 **No matches found for "${args.query}"**\n\n` +
                    `Try different search terms or check if sigils exist for the project.`
            }
          ]
        };
      }

      let response = `🔍 **VoxSigil Memory Search Results**\n\n`;
      response += `**Query:** "${args.query}"\n`;
      response += `**Found:** ${results.length} session(s) with matches\n\n`;

      results.forEach((result, i) => {
        response += `**${i + 1}. ${result.project} (${result.session})**\n`;
        response += `*${result.timestamp}*\n`;
        result.matches.forEach(match => {
          response += `- ${match}\n`;
        });
        response += `\n`;
      });

      return {
        content: [
          {
            type: 'text',
            text: response
          }
        ]
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Error searching sigil memory:** ${errorMessage}`
          }
        ]
      };
    }
  }

  private async generateContextSummary(args: any) {
    // Implementation for generating different types of summaries
    return {
      content: [
        {
          type: 'text',
          text: `📊 **Context Summary for ${args.project_name}**\n\n` +
                `*Summary generation in progress...*\n\n` +
                `Format: ${args.format || 'brief'}\n` +
                `Audience: ${args.audience || 'developer'}`
        }
      ]
    };
  }

  private async createSessionBridge(args: any) {
    const bridgeData = {
      project_name: args.project_name,
      exit_state: args.exit_state,
      handoff_notes: args.handoff_notes,
      urgent_items: args.urgent_items || [],
      timestamp: new Date().toISOString(),
      bridge_symbol: this.generateBridgeSymbol(args)
    };

    const bridgeFile = path.join(
      this.sigilPath, 
      'bridges', 
      `${args.project_name.toLowerCase().replace(/\s+/g, '_')}_bridge.yaml`
    );
    
    await fs.mkdir(path.dirname(bridgeFile), { recursive: true });
    await fs.writeFile(bridgeFile, yaml.dump(bridgeData, { indent: 2 }));

    return {
      content: [
        {
          type: 'text',
          text: `🌉 **Session Bridge Created**\n\n` +
                `**Project:** ${args.project_name}\n` +
                `**Exit State:** ${args.exit_state}\n` +
                `**Bridge Symbol:** ${bridgeData.bridge_symbol}\n\n` +
                `**Handoff Notes:**\n${args.handoff_notes}\n\n` +
                `**Urgent Items:**\n` +
                `${args.urgent_items?.map((item: string, i: number) => `${i + 1}. ${item}`).join('\n') || 'None'}\n\n` +
                `✅ **Ready for next session handoff!**`
        }
      ]
    };
  }

  private async loadVoxSigilScaffold(args: any) {
    const scaffoldPath = path.join(this.sigilPath, 'scaffolds', `${args.scaffold_name}.voxsigil`);
    
    try {
      const scaffoldContent = await fs.readFile(scaffoldPath, 'utf8');
      
      return {
        content: [
          {
            type: 'text',
            text: `🏗️ **VoxSigil Scaffold Loaded**\n\n` +
                  `**Scaffold:** ${args.scaffold_name}\n` +
                  `**Mode:** ${args.activation_mode || 'passive'}\n\n` +
                  `**Scaffold Content:**\n\`\`\`\n${scaffoldContent}\n\`\`\`\n\n` +
                  `✅ **Enhanced AI capabilities activated!**`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ **Scaffold "${args.scaffold_name}" not found**\n\n` +
                  `Available scaffolds can be found in: ${this.sigilPath}/scaffolds/`
          }
        ]
      };
    }
  }

  private async weaveContextSigil(args: any) {
    const contextThread = {
      thread_type: args.thread_type,
      anchor_points: args.anchor_points,
      persistence_level: args.persistence_level,
      timestamp: new Date().toISOString(),
      thread_symbol: this.generateThreadSymbol(args)
    };

    return {
      content: [
        {
          type: 'text',
          text: `🧵 **Context Thread Woven**\n\n` +
                `**Type:** ${args.thread_type}\n` +
                `**Persistence:** ${args.persistence_level}\n` +
                `**Thread Symbol:** ${contextThread.thread_symbol}\n\n` +
                `**Anchor Points:**\n` +
                `${args.anchor_points.map((point: string, i: number) => `${i + 1}. ${point}`).join('\n')}\n\n` +
                `✅ **Context thread active and persistent!**`
        }
      ]
    };
  }

  private generateContextEncoding(args: any): string {
    // Generate a symbolic encoding of the context
    const symbols = ['⟠', '∆', '∇', '◊', '⬟', '⟡', '▲', '▼', '◇', '⬢'];
    const hash = this.simpleHash(JSON.stringify(args));
    return symbols[hash % symbols.length] + symbols[(hash >> 4) % symbols.length] + symbols[(hash >> 8) % symbols.length];
  }

  private generateContextSymbol(state: SigilState): string {
    return `⟠${state.project_id}∆${state.session_id.slice(-4)}◊`;
  }

  private generateBridgeSymbol(args: any): string {
    return `🌉⟠${args.exit_state}∆${Date.now().toString().slice(-4)}◊`;
  }

  private generateThreadSymbol(args: any): string {
    return `🧵⟠${args.thread_type}∆${args.persistence_level}◊`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Add missing methods referenced by memoryBridge
  async saveState(state: SigilState): Promise<void> {
    const sigilFile = path.join(this.sigilPath, 'context', `${state.project_id}_${state.session_id}.yaml`);
    await fs.mkdir(path.dirname(sigilFile), { recursive: true });
    await fs.writeFile(sigilFile, yaml.dump(state, { indent: 2 }));
  }

  async loadState(identifier: string): Promise<SigilState | null> {
    try {
      const contextDir = path.join(this.sigilPath, 'context');
      
      if (identifier === 'latest') {
        // Find the most recent file
        const files = await fs.readdir(contextDir);
        const yamlFiles = files.filter(f => f.endsWith('.yaml')).sort();
        if (yamlFiles.length === 0) return null;
        
        const latestFile = yamlFiles[yamlFiles.length - 1];
        const content = await fs.readFile(path.join(contextDir, latestFile), 'utf8');
        return yaml.load(content) as SigilState;
      } else {
        // Look for specific file
        const content = await fs.readFile(path.join(contextDir, `${identifier}.yaml`), 'utf8');
        return yaml.load(content) as SigilState;
      }
    } catch (error) {
      return null;
    }
  }

  async run() {
    console.log('🔮 Starting VoxSigil-MCP Bridge for GitHub Copilot...');
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log('✅ VoxSigil Bridge ready for Copilot context engineering!');
  }
}

// Create and export memory bridge instance for use in main MCP server
export const memoryBridge = {
  async saveConversationMemory(projectName: string, userInput: string, aiResponse: string) {
    const bridge = new VoxSigilMCPBridge();
    return bridge.saveState({
      project_id: projectName,
      session_id: `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
      context_encoding: `${userInput} | ${aiResponse}`,
      agent_states: {},
      conversation_memory: [userInput, aiResponse],
      project_progress: {
        completed_features: [],
        current_tasks: [],
        next_priorities: []
      },
      technical_context: {
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
        file_structure: {},
        dependencies: [],
        configurations: {}
      },
      business_context: {
        domain: projectName,
        objectives: [],
        constraints: [],
        stakeholders: []
      }
    });
  },

  async restoreConversationMemory() {
    const bridge = new VoxSigilMCPBridge();
    const state = await bridge.loadState('latest');
    if (state) {
      return {
        sessionId: state.session_id,
        timestamp: new Date(state.timestamp),
        projectContext: {
          name: state.project_id,
          type: 'web_development',
          progress: state.project_progress.completed_features,
          currentFocus: state.project_progress.current_tasks[0] || 'unknown'
        },
        userProfile: {
          name: 'Builder',
          preferences: ['innovation', 'ai_integration'],
          workingStyle: 'collaborative',
          expertise: ['voxsigil', 'context_engineering']
        },
        conversationHistory: {
          topics: state.conversation_memory,
          decisions: [],
          features: state.project_progress.completed_features,
          todos: state.project_progress.next_priorities
        },
        sigilEncoding: state.context_encoding
      };
    }
    return null;
  },

  generateMemorySigil(context: string): string {
    const symbols = ['⟠', '∆', '∇', '𓂀', '◊', '∴', '∵', '∈', '∃', '∀', '⊕', '⊗', '⊙', '⊚'];
    let hash = 0;
    for (let i = 0; i < context.length; i++) {
      const char = context.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    hash = Math.abs(hash);
    
    let sigil = '';
    for (let i = 0; i < 8; i++) {
      sigil += symbols[hash % symbols.length];
      hash = Math.floor(hash / symbols.length);
    }
    return sigil;
  }
};

// Export bridge class for standalone use if needed
export { VoxSigilMCPBridge };
