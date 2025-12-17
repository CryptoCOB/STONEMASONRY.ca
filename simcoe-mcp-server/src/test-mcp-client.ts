#!/usr/bin/env node

/**
 * MCP Client Test - Demonstrates how to use the Simcoe Stone MCP Server
 * This shows how to call the multi-agent system for competitor research
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function callMCPTool(toolName: string, args: Record<string, any> = {}) {
  return new Promise((resolve, reject) => {
    const mcpServer = spawn('node', ['build/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    mcpServer.stdout.on('data', (data) => {
      output += data.toString();
    });

    mcpServer.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    mcpServer.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`MCP Server exited with code ${code}: ${errorOutput}`));
      }
    });

    // Send the MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: args
      }
    };

    mcpServer.stdin.write(JSON.stringify(request) + '\n');
    mcpServer.stdin.end();
  });
}

async function demonstrateCompetitorResearch() {
  console.log('🔍 **SIMCOE STONE MASONRY - COMPETITOR RESEARCH DEMO**\n');
  
  try {
    // Step 1: Coordinate multiple agents for comprehensive research
    console.log('📋 Step 1: Coordinating AI agents for competitor research...\n');
    
    const coordinationResult = await callMCPTool('coordinate_agents', {
      task: 'Research stone masonry competitors in Ontario Canada, analyze their services, pricing, and market positioning',
      agents: ['browser', 'ollama', 'planner'],
      priority: 'high'
    });
    
    console.log('✅ Agent Coordination Result:');
    console.log(coordinationResult);
    console.log('\n---\n');

    // Step 2: Browser research for competitor data
    console.log('🌐 Step 2: Browser research for stone masonry competitors...\n');
    
    const browserResult = await callMCPTool('browser_research', {
      search_query: 'stone masonry companies Ontario Canada competitors services pricing',
      depth: 'detailed'
    });
    
    console.log('✅ Browser Research Result:');
    console.log(browserResult);
    console.log('\n---\n');

    // Step 3: AI analysis of findings
    console.log('🧠 Step 3: AI analysis with Ollama...\n');
    
    const ollamaResult = await callMCPTool('ollama_agent', {
      model: 'llama3',
      prompt: 'Analyze the stone masonry market in Ontario and create a competitive landscape report',
      task_type: 'research',
      context: 'Focus on residential and commercial stone masonry services, pricing strategies, and market positioning'
    });
    
    console.log('✅ Ollama Analysis Result:');
    console.log(ollamaResult);
    console.log('\n---\n');

    // Step 4: Business planning insights
    console.log('📊 Step 4: Strategic business planning...\n');
    
    const plannerResult = await callMCPTool('business_planner', {
      planning_type: 'competitor_analysis',
      timeframe: 'quarterly',
      focus_area: 'market differentiation and competitive advantages'
    });
    
    console.log('✅ Business Planning Result:');
    console.log(plannerResult);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('❌ Error during competitor research:', errorMessage);
  }
}

// Run the demonstration
demonstrateCompetitorResearch().catch(console.error);
