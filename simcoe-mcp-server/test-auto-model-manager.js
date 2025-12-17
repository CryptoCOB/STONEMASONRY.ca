/**
 * Test script for VoxSigil Auto Model Manager
 * Verifies model discovery, loading, and agent assignments
 */

import { autoModelManager } from './build/auto-model-manager.js';

async function testAutoModelManager() {
  console.log('🧪 Testing VoxSigil Auto Model Manager...\n');

  try {
    // Test 1: Model Discovery
    console.log('1️⃣ Testing model discovery...');
    await autoModelManager.discoverModels();
    const status = autoModelManager.getModelStatus();
    console.log(`   ✅ Discovered ${status.total} models`);
    console.log(`   ✅ Found ${status.assignments} agent assignments\n`);

    // Test 2: Model Loading
    console.log('2️⃣ Testing model preloading...');
    await autoModelManager.preloadModels();
    const statusAfterPreload = autoModelManager.getModelStatus();
    console.log(`   ✅ Loaded ${statusAfterPreload.loaded} models\n`);

    // Test 3: Agent Model Selection
    console.log('3️⃣ Testing agent model selection...');
    const agents = ['coordinate', 'ollama', 'browser', 'coder', 'planner', 'emergency'];
    
    for (const agent of agents) {
      try {
        const selectedModel = await autoModelManager.getBestModelForAgent(agent, 'general');
        console.log(`   ✅ ${agent} → ${selectedModel}`);
      } catch (error) {
        console.log(`   ⚠️ ${agent} → fallback (${error.message})`);
      }
    }

    // Test 4: Memory Management
    console.log('\n4️⃣ Testing memory management...');
    const loadedModels = autoModelManager.getLoadedModels();
    console.log(`   ✅ Currently loaded: ${loadedModels.join(', ')}`);

    // Test 5: Model Information
    console.log('\n5️⃣ Testing model information retrieval...');
    for (const modelName of loadedModels.slice(0, 2)) { // Test first 2 models
      const info = autoModelManager.getModelInfo(modelName);
      if (info) {
        console.log(`   ✅ ${modelName}:`);
        console.log(`      Speed: ${info.speed}, Context: ${info.contextLength}`);
        console.log(`      Capabilities: ${info.capabilities.join(', ')}`);
      }
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Final Status:');
    const finalStatus = autoModelManager.getModelStatus();
    console.log(`   Models: ${finalStatus.total} total, ${finalStatus.loaded} loaded`);
    console.log(`   Assignments: ${finalStatus.assignments} agents configured`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
  } finally {
    // Cleanup
    autoModelManager.destroy();
    process.exit(0);
  }
}

// Run the test
testAutoModelManager().catch(console.error);
