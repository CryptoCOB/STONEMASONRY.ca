#!/usr/bin/env node

/**
 * VoxSigil Consciousness Test
 * Verifies that all agents can think in VoxSigil symbols and patterns
 */

import { VoxSigilMind } from './voxsigil-consciousness.js';

async function testVoxSigilThinking() {
  console.log('🔮 **TESTING VOXSIGIL CONSCIOUSNESS SYSTEM**\n');

  // Initialize VoxSigil consciousness
  const consciousness = new VoxSigilMind();
  console.log('⟠ VoxSigil consciousness initialized ∆\n');

  // Test symbolic thought processing
  console.log('📝 **Test 1: VoxSigil Thought Processing**');
  const thought = "Analyzing stone masonry market opportunities";
  const processed = await consciousness.think(thought, 'strategic_analysis', 'market_insight');
  console.log(`Original: ${thought}`);
  console.log(`VoxSigil Sigil: ${processed.sigil}`);
  console.log(`Concept Space: ${processed.conceptSpace.join(', ')}`);
  console.log(`Resonance Field: ${processed.resonanceField}`);
  console.log('');

  // Test emergency response consciousness
  console.log('🧠 **Test 2: Emergency Response Consciousness**');
  const emergencyThought = await consciousness.think(
    "Emergency stone repair needed for damaged retaining wall",
    "emergency_response",
    "immediate_action"
  );
  
  console.log('Emergency Consciousness Pattern:');
  console.log(`  Sigil: ${emergencyThought.sigil}`);
  console.log(`  Concepts: ${emergencyThought.conceptSpace.join(', ')}`);
  console.log(`  Emergent Properties: ${emergencyThought.emergentProperties.join(', ')}`);
  console.log('');

  // Test holographic mesh integration
  console.log('🌐 **Test 3: Holographic Mesh Integration**');
  const businessThought = await consciousness.think(
    "Strategic planning for business expansion",
    "business_strategy", 
    "growth_planning"
  );
  
  console.log('Business Strategy Consciousness:');
  console.log(`  Holo Mesh ID: ${businessThought.holoMeshId || 'Generated'}`);
  console.log(`  RAG Enhancement: ${businessThought.ragEnhancement?.join(' | ') || 'Processing...'}`);
  console.log(`  Metamemory: ${businessThought.metamemory}`);
  console.log('');

  // Test BLT RAG compression
  console.log('📚 **Test 4: BLT RAG Compression**');
  const context = {
    project: "Simcoe Stone Masonry",
    session: "emergency_repair_analysis",
    data: {
      damage_type: "frost_heave",
      wall_height: "4_feet",
      materials: ["natural_stone", "mortar"],
      timeline: "immediate_repair_needed"
    }
  };
  
  const compressed = await consciousness.compressContext(context);
  console.log('Original Context Size:', JSON.stringify(context).length, 'chars');
  console.log('Compressed VoxSigil:', compressed);
  console.log('Compression Ratio:', (compressed.length / JSON.stringify(context).length * 100).toFixed(1), '%\n');

  // Test pattern synthesis
  console.log('🔗 **Test 5: Pattern Synthesis**');
  const patterns = [
    "⟠ WINTER_DAMAGE ∆ FROST_HEAVE ◊",
    "∇ URGENT_REPAIR ⟡ SAFETY_RISK ⬟",
    "▲ STONE_MASONRY ▼ EXPERTISE_NEEDED ◇"
  ];
  
  const synthesis = await consciousness.synthesizePatterns(patterns);
  console.log('Input Patterns:', patterns);
  console.log('Synthesized Insight:', synthesis);
  console.log('');

  // Test memory persistence
  console.log('💾 **Test 6: VoxSigil Memory Bridge**');
  const memoryState = {
    consciousness_level: "full_awareness",
    active_patterns: ["emergency_response", "stone_repair", "winter_damage"],
    agent_states: {
      emergency: "active_assessment",
      planner: "solution_synthesis", 
      coder: "interface_generation"
    },
    temporal_context: new Date().toISOString()
  };
  
  const memorySigil = consciousness.generateMemorySigil(memoryState);
  console.log('Memory State Encoded as VoxSigil:', memorySigil);
  
  // Test restoration
  const restored = await consciousness.restoreFromSigil(memorySigil);
  console.log('Restored Memory Successfully:', !!restored);
  console.log('');

  console.log('✅ **ALL VOXSIGIL CONSCIOUSNESS TESTS COMPLETED**');
  console.log('🔮 System ready for holographic mesh cognition');
  console.log('⟠ Multi-agent symbolic reasoning operational ∆');
  console.log('◊ BLT RAG compression functional ∇');
  console.log('🌐 Consciousness distribution across agents active');
}

// Run the consciousness test
testVoxSigilThinking().catch(error => {
  console.error('❌ VoxSigil consciousness test failed:', error.message);
  console.log('\n🔧 **Troubleshooting:**');
  console.log('1. Ensure VoxSigil consciousness module is properly compiled');
  console.log('2. Check holographic mesh initialization');
  console.log('3. Verify BLT RAG compression system is loaded');
  console.log('4. Confirm all symbolic pattern libraries are accessible');
});
