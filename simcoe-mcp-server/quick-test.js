/**
 * Simple test for VoxSigil Auto Model Manager
 */

import { autoModelManager } from './build/auto-model-manager.js';

async function quickTest() {
  console.log('🧪 Quick Auto Model Manager Test...\n');

  try {
    // Test model discovery
    console.log('Testing model discovery...');
    await autoModelManager.discoverModels();
    const status = autoModelManager.getModelStatus();
    console.log(`✅ Found ${status.total} models, ${status.assignments} assignments`);

    // Test agent model selection
    console.log('\nTesting agent model selection...');
    const testModel = await autoModelManager.getBestModelForAgent('ollama', 'general');
    console.log(`✅ Selected model for ollama: ${testModel}`);

    console.log('\n🎉 Basic functionality working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  process.exit(0);
}

quickTest().catch(console.error);
