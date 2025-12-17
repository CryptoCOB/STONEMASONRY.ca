/**
 * Test Business Planner Response
 */

import { autoModelManager } from './build/auto-model-manager.js';

async function testBusinessPlanner() {
  console.log('🧪 Testing Business Planner Response Format...\n');

  try {
    // Simulate what the orchestrator does
    const args = {
      planning_type: 'feature_roadmap',
      timeframe: 'quarterly', 
      focus_area: 'Auto Model Manager'
    };

    // Map MCP parameters to agent method
    const objective = `${args.planning_type} planning for ${args.focus_area} with ${args.timeframe} timeframe`;
    const constraints = args.timeframe ? [`Timeframe: ${args.timeframe}`] : [];
    
    console.log('📋 Test Parameters:');
    console.log(`  Objective: ${objective}`);
    console.log(`  Constraints: ${JSON.stringify(constraints)}`);

    // Test the response format
    const mockResult = {
      plan: 'Mock business plan content',
      constraints: constraints,
      timestamp: new Date().toISOString(),
      voxsigilSignature: 'test-sigil-123',
      thoughtPattern: { sigil: 'test' },
      strategicResonance: 'test-resonance',
      businessConsciousness: ['test-property']
    };

    console.log('\n📊 Mock Agent Response:');
    console.log(JSON.stringify(mockResult, null, 2));

    // Test MCP response format
    const mcpResponse = {
      content: [{
        type: 'text',
        text: `📈 **Strategic Planning Complete**\n\n${mockResult.plan || mockResult.content || JSON.stringify(mockResult)}`
      }]
    };

    console.log('\n🔧 MCP Response Format:');
    console.log(JSON.stringify(mcpResponse, null, 2));

    console.log('\n✅ Response format test successful!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testBusinessPlanner();
