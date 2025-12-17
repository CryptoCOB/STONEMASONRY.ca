#!/usr/bin/env node

/**
 * Simcoe Stone Masonry Multi-Agent MCP Server
 * Coordinates AI agents for business planning, research, and code generation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

// Import our agent modules
import { OllamaAgent } from './agents/OllamaAgent.js';
import { BrowserAgent } from './agents/BrowserAgent.js';
import { CodeGeneratorAgent } from './agents/CodeGeneratorAgent.js';
import { BusinessPlannerAgent } from './agents/BusinessPlannerAgent.js';
import { EmergencyRepairAgent } from './agents/EmergencyRepairAgent.js';
import { AgentOrchestrator } from './orchestrator/AgentOrchestrator.js';

class SimcoeMCPServer {
  private server: Server;
  private orchestrator: AgentOrchestrator;

  constructor() {
    this.server = new Server(
      {
        name: 'simcoe-stone-masonry-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize the agent orchestrator
    this.orchestrator = new AgentOrchestrator();
    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // === MULTI-AGENT COORDINATION ===
          {
            name: 'coordinate_agents',
            description: 'Coordinate multiple AI agents to work together on complex tasks',
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

          // === OLLAMA LOCAL AI AGENT ===
          {
            name: 'ollama_agent',
            description: 'Use local Ollama AI models for code generation, planning, and analysis',
            inputSchema: {
              type: 'object',
              properties: {
                model: { type: 'string', description: 'Ollama model to use (e.g., codellama, llama3, mistral)' },
                prompt: { type: 'string', description: 'Prompt for the AI model' },
                task_type: { type: 'string', enum: ['code', 'plan', 'research', 'review', 'debug'] },
                context: { type: 'string', description: 'Additional context for the task' }
              },
              required: ['model', 'prompt', 'task_type']
            }
          },

          // === BROWSER AUTOMATION AGENT ===
          {
            name: 'browser_research',
            description: 'Use Browser Use to research stone masonry trends, competitors, and market data',
            inputSchema: {
              type: 'object',
              properties: {
                search_query: { type: 'string', description: 'What to research' },
                sites: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Specific sites to check (optional)'
                },
                depth: { type: 'string', enum: ['quick', 'detailed', 'comprehensive'] }
              },
              required: ['search_query']
            }
          },

          // === CODE GENERATION AGENT ===
          {
            name: 'generate_code',
            description: 'Generate React/TypeScript code for new features with AI assistance',
            inputSchema: {
              type: 'object',
              properties: {
                feature: { type: 'string', description: 'Feature to build (e.g., Emergency Repair Hotline)' },
                component_type: { type: 'string', enum: ['component', 'page', 'utility', 'service'] },
                requirements: { type: 'string', description: 'Detailed requirements' },
                style_guide: { type: 'string', description: 'Styling preferences' }
              },
              required: ['feature', 'component_type', 'requirements']
            }
          },

          // === BUSINESS PLANNING AGENT ===
          {
            name: 'business_planner',
            description: 'AI-powered business planning and strategy for Simcoe Stone Masonry',
            inputSchema: {
              type: 'object',
              properties: {
                planning_type: { 
                  type: 'string', 
                  enum: ['marketing', 'feature_roadmap', 'competitor_analysis', 'pricing', 'expansion'] 
                },
                timeframe: { type: 'string', enum: ['quarterly', 'yearly', 'long_term'] },
                focus_area: { type: 'string', description: 'Specific area to focus on' }
              },
              required: ['planning_type']
            }
          },

          // === EMERGENCY REPAIR AGENT ===
          {
            name: 'emergency_repair_system',
            description: 'AI system for managing emergency stone repair requests',
            inputSchema: {
              type: 'object',
              properties: {
                action: { 
                  type: 'string', 
                  enum: ['assess_damage', 'triage_urgency', 'generate_quote', 'schedule_repair', 'safety_check'] 
                },
                damage_description: { type: 'string', description: 'Description of the damage' },
                images: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Image URLs of the damage'
                },
                location: { type: 'string', description: 'Location of the damage' }
              },
              required: ['action']
            }
          },

          // === RESEARCH AND TRENDS ===
          {
            name: 'market_research',
            description: 'Comprehensive market research using multiple AI agents',
            inputSchema: {
              type: 'object',
              properties: {
                research_type: { 
                  type: 'string', 
                  enum: ['trends', 'competitors', 'pricing', 'materials', 'techniques', 'customer_needs'] 
                },
                region: { type: 'string', description: 'Geographic focus (e.g., Ontario, Canada)' },
                depth: { type: 'string', enum: ['overview', 'detailed', 'comprehensive'] }
              },
              required: ['research_type']
            }
          },

          // === FEATURE DEVELOPMENT ===
          {
            name: 'develop_feature',
            description: 'End-to-end feature development using coordinated AI agents',
            inputSchema: {
              type: 'object',
              properties: {
                feature_name: { type: 'string', description: 'Name of the feature to develop' },
                description: { type: 'string', description: 'Detailed feature description' },
                priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                include_research: { type: 'boolean', description: 'Include market research phase' }
              },
              required: ['feature_name', 'description']
            }
          }
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'coordinate_agents':
            return await this.orchestrator.coordinateAgents(args);

          case 'ollama_agent':
            return await this.orchestrator.getAgent('ollama').execute(args);

          case 'browser_research':
            return await this.orchestrator.getAgent('browser').execute(args);

          case 'generate_code':
            return await this.orchestrator.getAgent('coder').execute(args);

          case 'business_planner':
            return await this.orchestrator.getAgent('planner').execute(args);

          case 'emergency_repair_system':
            return await this.orchestrator.getAgent('emergency').execute(args);

          case 'market_research':
            return await this.orchestrator.performMarketResearch(args);

          case 'develop_feature':
            return await this.orchestrator.developFeature(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${errorMessage}`);
      }
    });
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run() {
    console.log('🤖 Starting Simcoe Stone Masonry Multi-Agent MCP Server...');
    console.log('🔗 Initializing agent mesh...');
    
    await this.orchestrator.initialize();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log('✅ Multi-Agent MCP Server running!');
    console.log('🌐 Available agents: Ollama, Browser, Code Generator, Business Planner, Emergency Repair');
  }
}

// Start the server
const server = new SimcoeMCPServer();
server.run().catch(console.error);
