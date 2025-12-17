/**
 * Agent Orchestrator for coordinating multiple AI agents
 */

import { OllamaAgent } from '../agents/OllamaAgent.js';
import { BrowserAgent } from '../agents/BrowserAgent.js';
import { CodeGeneratorAgent } from '../agents/CodeGeneratorAgent.js';
import { BusinessPlannerAgent } from '../agents/BusinessPlannerAgent.js';
import { EmergencyRepairAgent } from '../agents/EmergencyRepairAgent.js';
import { simplePlannerAgent } from '../simple-planner.js';

export class AgentOrchestrator {
  private agents: Map<string, any> = new Map();

  constructor() {
    // Initialize all agents
    this.agents.set('ollama', new OllamaAgent());
    this.agents.set('browser', new BrowserAgent());
    this.agents.set('coder', new CodeGeneratorAgent());
    this.agents.set('planner', simplePlannerAgent); // Use simple planner for testing
    this.agents.set('emergency', new EmergencyRepairAgent());
  }

  async initialize() {
    console.log('🤖 Initializing agent mesh...');
    // Initialize agents if needed
  }

  getAgent(name: string) {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }
    return {
      execute: async (args: any) => {
        // Execute agent-specific logic
        switch (name) {
          case 'ollama':
            return agent.generate(args.model, args.prompt, args.task_type, args.context);
          case 'browser':
            return agent.research(args.search_query, args.sites);
          case 'coder':
            // Determine language from component_type for React/TypeScript project
            const language = this.determineLanguage(args?.component_type, args?.feature);
            return agent.generateCode(language, args?.requirements || 'Generate code', `Feature: ${args?.feature || 'Unknown'}, Type: ${args?.component_type || 'component'}, Style: ${args?.style_guide || 'default'}`);
          case 'planner':
            // Map MCP parameters to agent method
            const objective = `${args?.planning_type || 'general'} planning for ${args?.focus_area || 'business'} with ${args?.timeframe || 'quarterly'} timeframe`;
            const constraints = args?.timeframe ? [`Timeframe: ${args.timeframe}`] : [];
            return agent.createPlan(objective, constraints);
          case 'emergency':
            // Map MCP parameters to agent method  
            const description = args?.damage_description || args?.description || 'Emergency assessment needed';
            const location = args?.location || 'Unknown location';
            return agent.assessEmergency(description, location);
          default:
            throw new Error(`Unknown agent: ${name}`);
        }
      }
    };
  }

  async performMarketResearch(args: any) {
    const browserAgent = this.agents.get('browser');
    const ollamaAgent = this.agents.get('ollama');
    
    // Coordinate browser and AI for market research
    const results = await browserAgent.research(args.market_segment);
    const analysis = await ollamaAgent.generate('llama3', `Analyze this market data: ${JSON.stringify(results)}`, 'research');
    
    return {
      market_data: results,
      analysis: analysis,
      timestamp: new Date().toISOString()
    };
  }

  async developFeature(args: any) {
    const plannerAgent = this.agents.get('planner');
    const coderAgent = this.agents.get('coder');
    
    // Coordinate planning and coding
    const plan = await plannerAgent.createPlan(args.feature_description);
    const code = await coderAgent.generateCode(args.language || 'javascript', args.feature_description);
    
    return {
      plan: plan,
      code: code,
      timestamp: new Date().toISOString()
    };
  }

  async coordinateAgents(args: any) {
    const { task, agents: agentNames, priority = 'medium' } = args;
    const results = [];
    
    for (const agentName of agentNames) {
      const agent = this.agents.get(agentName);
      if (!agent) {
        results.push({
          agent: agentName,
          error: `Agent ${agentName} not found`
        });
        continue;
      }

      try {
        let result;
        switch (agentName) {
          case 'ollama':
            result = await agent.generate('llama3', task, 'general');
            break;
          case 'browser':
            result = await agent.research(task);
            break;
          case 'coder':
            result = await agent.generateCode('javascript', task);
            break;
          case 'planner':
            result = await agent.createPlan(task);
            break;
          case 'emergency':
            result = await agent.assessEmergency(task);
            break;
          default:
            result = { message: `Unknown agent: ${agentName}` };
        }
        
        results.push({
          agent: agentName,
          result
        });
      } catch (error) {
        results.push({
          agent: agentName,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return {
      content: [{
        type: 'text',
        text: `🤖 **Multi-Agent Coordination Results**\n\n` +
              `**Task:** ${task}\n` +
              `**Priority:** ${priority}\n` +
              `**Agents Used:** ${agentNames.join(', ')}\n\n` +
              `**Results:**\n` +
              results.map(r => r.error ? `❌ ${r.agent}: ${r.error}` : `✅ ${r.agent}: Success`).join('\n')
      }]
    };
  }

  private determineLanguage(componentType?: string, feature?: string): string {
    // For Simcoe Stone project, default to TypeScript/React
    if (componentType === 'component' || componentType === 'page') {
      return 'typescript react';
    } else if (componentType === 'utility') {
      return 'typescript';
    } else if (componentType === 'service') {
      return 'typescript';
    }
    
    // Check feature description for language hints
    const featureLower = (feature || '').toLowerCase();
    if (featureLower.includes('react') || featureLower.includes('component')) {
      return 'typescript react';
    } else if (featureLower.includes('javascript') || featureLower.includes('js')) {
      return 'javascript';
    } else if (featureLower.includes('python')) {
      return 'python';
    }
    
    // Default to TypeScript for the project
    return 'typescript';
  }
}
