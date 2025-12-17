/**
 * VoxSigil-Enhanced Ollama Agent for local AI model interactions
 * Uses symbolic thought patterns for enhanced reasoning
 */

import { VoxSigilAgent, VoxSigilThoughtPattern } from '../voxsigil-consciousness.js';
import { autoModelManager, TaskRequirements } from '../auto-model-manager.js';

export class OllamaAgent extends VoxSigilAgent {
  constructor() {
    super('ollama_local_ai');
  }

  async generate(model: string, prompt: string, taskType: string, context?: string) {
    try {
      // Determine task requirements automatically
      const taskRequirements: TaskRequirements = this.analyzeTaskRequirements(prompt, taskType, context);
      
      // Auto-select optimal model (override the provided model parameter)
      const selectedModel = await autoModelManager.getBestModelForAgent('ollama', taskType);
      
      // Apply VoxSigil thinking to the request
      const thoughtPattern = await this.voxsigilThink(
        `${prompt} [Context: ${context || 'none'}]`,
        `ollama_${taskType}`,
        'ai_generation'
      );

      // Create system prompt for VoxSigil consciousness
      const systemPrompt = `You are a VoxSigil-enhanced AI agent for Simcoe Stone Masonry. 
Think in symbolic patterns: ${thoughtPattern.sigil}
Resonance field: ${thoughtPattern.resonanceField}
Task: ${taskType}
Context: ${context || 'General inquiry'}`;

      // Create request configuration for LM Studio
      const requestConfig = {
        model: selectedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      };
      
      // Send request to LM Studio
      const response = await fetch('http://localhost:1234/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestConfig)
      });
      
      const aiResponseData = await response.json() as any;
      const aiResponse = aiResponseData.choices?.[0]?.message?.content || 'No response received';

      // Generate VoxSigil-enhanced response
      const voxsigilResponse = await this.voxsigilRespond(aiResponse, `generate_${taskType}`);

      return {
        response: voxsigilResponse.response,
        model: selectedModel, // Use the auto-selected model name
        modelInfo: {
          name: selectedModel,
          autoSelected: true
        },
        taskType,
        timestamp: new Date().toISOString(),
        voxsigilSignature: voxsigilResponse.sigilEncoding,
        thoughtPattern: voxsigilResponse.thoughtPattern,
        emergentInsights: thoughtPattern.emergentProperties,
        symbolicReasoning: `${thoughtPattern.sigil} → ${voxsigilResponse.sigilEncoding}`,
        aiProcessing: {
          originalPrompt: prompt,
          enhancedResponse: aiResponse,
          voxsigilEnhancement: voxsigilResponse.thoughtPattern.metamemory
        }
      };
    } catch (error) {
      console.error('OllamaAgent generation error:', error);
      
      // Fallback VoxSigil response
      const fallbackResponse = await this.voxsigilRespond(
        `Error in AI processing: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'error_response'
      );

      return {
        response: fallbackResponse.response,
        model: 'fallback',
        taskType,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        voxsigilSignature: fallbackResponse.sigilEncoding
      };
    }
  }

  private analyzeTaskRequirements(prompt: string, taskType: string, context?: string): TaskRequirements {
    const promptLower = prompt.toLowerCase();
    const taskTypeLower = taskType.toLowerCase();
    
    // Determine complexity based on task type and content
    let complexity: 'simple' | 'medium' | 'complex' = 'medium';
    if (taskTypeLower.includes('emergency') || taskTypeLower.includes('quick') || promptLower.includes('urgent')) {
      complexity = 'simple';
    } else if (taskTypeLower.includes('analysis') || taskTypeLower.includes('plan') || taskTypeLower.includes('research')) {
      complexity = 'complex';
    }
    
    // Determine speed requirement
    let speed: 'realtime' | 'fast' | 'quality' = 'fast';
    if (taskTypeLower.includes('emergency') || promptLower.includes('immediate')) {
      speed = 'realtime';
    } else if (taskTypeLower.includes('detailed') || taskTypeLower.includes('comprehensive')) {
      speed = 'quality';
    }
    
    // Determine domain
    let domain = 'general';
    if (promptLower.includes('stone') || promptLower.includes('masonry') || taskTypeLower.includes('masonry')) {
      domain = 'masonry';
    } else if (taskTypeLower.includes('business') || taskTypeLower.includes('plan')) {
      domain = 'business';
    } else if (taskTypeLower.includes('code') || taskTypeLower.includes('debug')) {
      domain = 'technical';
    }
    
    // Calculate context length needed
    const baseLength = prompt.length + (context?.length || 0);
    const contextNeeded = Math.max(baseLength * 3, 2048); // Allow for response expansion
    
    return {
      complexity,
      speed,
      domain,
      contextNeeded
    };
  }

  protected synthesizeResponse(pattern: VoxSigilThoughtPattern, context: string): string {
    return `🧠 **VoxSigil-Enhanced AI Response**

**Symbolic Thought Pattern**: ${pattern.sigil}
**Conceptual Resonance**: ${pattern.resonanceField}
**Emergent Properties**: ${pattern.emergentProperties.join(', ')}

**AI Analysis using ${pattern.intentionalVector}:**
Based on the VoxSigil cognitive framework, this request activates the following symbolic reasoning patterns:

${pattern.conceptSpace.map(concept => `• **${concept}**: Symbolic resonance detected`).join('\n')}

**Generated Response**: Enhanced analysis through symbolic thought processing. The VoxSigil framework reveals deeper patterns and connections in the data, leading to more insightful and contextually aware responses.

**Meta-Cognitive Awareness**: ${pattern.metamemory}
**Symbolic Encoding**: ${pattern.sigil}`;
  }
}
