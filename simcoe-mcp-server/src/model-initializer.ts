/**
 * VoxSigil Model Auto-Detection and Setup
 * Automatically configures optimal models for all agents
 */

import { modelManager } from './model-manager.js';
import { VoxSigilMind } from './voxsigil-consciousness.js';

export class VoxSigilModelInitializer {
  private initialized = false;
  private modelStats: any = null;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🤖 ═══════════════════════════════════════════════════════════════════');
    console.log('   VOXSIGIL AUTO MODEL DETECTION & CONFIGURATION');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');

    try {
      // Auto-detect available models from LM Studio
      console.log('🔍 Detecting available LM Studio models...');
      const availableModels = await modelManager.detectAvailableModels();
      
      if (availableModels.length > 0) {
        console.log(`✅ Found ${availableModels.length} available models:`);
        availableModels.slice(0, 5).forEach((model, i) => {
          console.log(`   ${i + 1}. ${model}`);
        });
        if (availableModels.length > 5) {
          console.log(`   ... and ${availableModels.length - 5} more`);
        }
      } else {
        console.log('⚠️  No models detected - using fallback configuration');
      }

      // Get model assignments
      this.modelStats = modelManager.getModelStats();
      console.log('');
      console.log('🎯 AUTOMATIC AGENT-MODEL ASSIGNMENTS:');
      Object.entries(this.modelStats.agentAssignments).forEach(([agent, model]) => {
        console.log(`   🤖 [${agent.toUpperCase()}] → ${model}`);
      });

      console.log('');
      console.log('⚡ MODEL PERFORMANCE TIERS:');
      console.log(`   🚀 Fast (realtime): ${this.modelStats.modelsBySpeed.fast.join(', ')}`);
      console.log(`   ⚖️  Balanced: ${this.modelStats.modelsBySpeed.medium.join(', ')}`);
      console.log(`   🧠 High-quality: ${this.modelStats.modelsBySpeed.slow.join(', ')}`);

      console.log('');
      console.log('🔧 CAPABILITY MAPPING:');
      Object.entries(this.modelStats.modelsByCapability).forEach(([capability, models]: [string, any]) => {
        console.log(`   📋 ${capability}: ${Array.isArray(models) ? models.length : 0} models`);
      });

      // Test a quick model request to verify LM Studio connection
      await this.testLMStudioConnection();

      this.initialized = true;
      console.log('');
      console.log('✅ VoxSigil Auto Model Configuration Complete!');
      console.log('💫 All agents now have optimal model assignments');
      console.log('');

    } catch (error) {
      console.error('❌ Model initialization error:', error);
      console.log('🔄 Falling back to default configuration');
      this.initialized = true; // Mark as initialized even with fallback
    }
  }

  private async testLMStudioConnection(): Promise<void> {
    try {
      console.log('🔗 Testing LM Studio connection...');
      
      const testModel = modelManager.getAgentModel('coordinate'); // Use coordination agent's fast model
      const testConfig = modelManager.createRequestConfig(
        testModel, 
        'Test connection', 
        'Respond with just "OK" to confirm connection'
      );

      const response = await modelManager.sendRequest(testConfig);
      
      if (response && response.trim().length > 0) {
        console.log(`✅ LM Studio connected successfully using ${testModel.name}`);
        console.log(`   Response: "${response.slice(0, 50)}${response.length > 50 ? '...' : ''}"`);
      } else {
        console.log('⚠️  LM Studio connected but no response received');
      }
    } catch (error) {
      console.log('⚠️  LM Studio connection test failed - models will use fallback responses');
      console.log(`   Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getModelStats(): any {
    return this.modelStats;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get recommended model for a specific task
   */
  getRecommendedModel(agentType: string, taskDescription: string): string {
    if (!this.initialized) {
      console.warn('Model initializer not ready, using default');
      return 'llama-3.2-8b-instruct';
    }

    // Analyze task description for requirements
    const taskLower = taskDescription.toLowerCase();
    
    if (taskLower.includes('emergency') || taskLower.includes('urgent')) {
      return this.modelStats.modelsBySpeed.fast[0] || 'phi-3.5-mini-instruct';
    }
    
    if (taskLower.includes('complex') || taskLower.includes('analysis') || taskLower.includes('detailed')) {
      return this.modelStats.modelsBySpeed.slow[0] || 'qwen2.5-32b-instruct';
    }
    
    // Return agent's default assignment
    return this.modelStats.agentAssignments[agentType] || 'llama-3.2-8b-instruct';
  }

  /**
   * Display current model configuration
   */
  displayConfiguration(): void {
    if (!this.initialized) {
      console.log('❌ Model configuration not initialized');
      return;
    }

    console.log('🔮 ═══════════════════════════════════════════════════════════════════');
    console.log('   CURRENT VOXSIGIL MODEL CONFIGURATION');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('');
    
    console.log('🤖 AGENT ASSIGNMENTS:');
    Object.entries(this.modelStats.agentAssignments).forEach(([agent, model]) => {
      const modelInfo = modelManager.getAgentModel(agent);
      console.log(`   [${agent.toUpperCase()}] → ${model} (${modelInfo.speed}, ${modelInfo.contextLength} ctx)`);
    });
    
    console.log('');
    console.log('📊 TOTAL MODELS:', this.modelStats.totalModels);
    console.log('🔗 LM STUDIO ENDPOINT: http://localhost:1234/v1');
    console.log('⚡ AUTO SELECTION: Enabled');
    console.log('');
  }
}

// Export singleton instance
export const modelInitializer = new VoxSigilModelInitializer();
