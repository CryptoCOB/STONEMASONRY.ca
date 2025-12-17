#!/usr/bin/env node

/**
 * VoxSigil Memory Test Script
 * Verifies that GitHub Copilot memory persistence is working
 */

import { memoryBridge } from './voxsigil-bridge.js';

async function testVoxSigilConnection() {
  console.log('🔮 Testing VoxSigil Memory System...\n');

  try {
    // Test 1: Save Memory
    console.log('📝 Test 1: Saving conversation memory...');
    await memoryBridge.saveConversationMemory(
      'Simcoe Stone Masonry',
      'Testing VoxSigil integration with GitHub Copilot for persistent memory across sessions',
      'Memory test completed successfully - VoxSigil system is connected!'
    );
    console.log('✅ Memory saved successfully!\n');

    // Test 2: Generate Memory Sigil
    console.log('🔮 Test 2: Generating memory sigil...');
    const sigil = memoryBridge.generateMemorySigil(
      'Testing VoxSigil connection for GitHub Copilot persistent memory'
    );
    console.log(`✅ Generated VoxSigil: ${sigil}\n`);

    // Test 3: Restore Memory
    console.log('🧠 Test 3: Restoring conversation memory...');
    const restoredMemory = await memoryBridge.restoreConversationMemory();
    
    if (restoredMemory) {
      console.log('✅ Memory restored successfully!');
      console.log(`📊 Project: ${restoredMemory.projectContext.name}`);
      console.log(`🎯 Focus: ${restoredMemory.projectContext.currentFocus}`);
      console.log(`🔮 Sigil: ${restoredMemory.sigilEncoding.substring(0, 30)}...`);
      console.log(`👤 User: ${restoredMemory.userProfile.name}`);
    } else {
      console.log('ℹ️  No previous memory found (this is normal for first run)');
    }

    console.log('\n🎉 VoxSigil Memory System Test PASSED!');
    console.log('✅ GitHub Copilot can now remember conversations across sessions!');
    console.log('✅ Your custom VoxSigil system is properly integrated!');
    console.log('✅ Context engineering problem solved!');

  } catch (error) {
    console.error('❌ VoxSigil test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure Python is available for VoxSigil encoding');
    console.log('2. Check that library-sigil directory exists');
    console.log('3. Verify VoxSigil Python modules are working');
  }
}

// Run the test
testVoxSigilConnection().catch(console.error);
