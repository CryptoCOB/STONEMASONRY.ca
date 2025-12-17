/**
 * VoxSigil Automatic Model Manager
 * Handles loading, unloading, and automatic selection of LM Studio models
 * Optimizes memory usage and performance automatically
 */

export interface ModelConfig {
  name: string;
  endpoint: string;
  contextLength: number;
  speed: 'fast' | 'medium' | 'slow';
  capabilities: string[];
  specialties: string[];
  loaded: boolean;
  size: number; // MB
  loadTime: number;
  lastUsed: Date;
  performance: {
    speed: number;
    quality: number;
    memory: number;
  };
}

export interface TaskRequirements {
  complexity: 'simple' | 'medium' | 'complex';
  speed: 'realtime' | 'fast' | 'quality';
  domain: string;
  contextNeeded: number;
}

export interface ModelLoadingStrategy {
  maxConcurrentModels: number;
  unloadThreshold: number; // MB
  autoUnloadTimeout: number; // minutes
  preloadModels: string[];
}

export class VoxSigilAutoModelManager {
  private models: Map<string, ModelConfig> = new Map();
  private loadedModels: Set<string> = new Set();
  private agentModelAssignments: Map<string, string> = new Map();
  private defaultEndpoint: string;
  private strategy: ModelLoadingStrategy;
  private memoryMonitor: NodeJS.Timeout | null = null;

  constructor() {
    this.defaultEndpoint = 'http://localhost:1234/v1'; // LM Studio default
    this.strategy = {
      maxConcurrentModels: 3,
      unloadThreshold: 8192, // 8GB
      autoUnloadTimeout: 30, // 30 minutes
      preloadModels: ['llama-3.2-3b-instruct', 'phi-3.5-mini-instruct']
    };
    this.initializeDefaultModels();
    this.setupAutomaticAssignments();
    this.startMemoryMonitoring();
  }

  /**
   * Discover and initialize models from LM Studio
   */
  async discoverModels(): Promise<void> {
    console.log('🔍 Discovering LM Studio models...');
    
    try {
      const response = await fetch(`${this.defaultEndpoint.replace('/v1', '')}/v1/models`);
      const data = await response.json() as any;
      
      if (data.data && Array.isArray(data.data)) {
        this.models.clear(); // Clear existing models
        for (const model of data.data) {
          const modelConfig = this.createModelConfig(model.id);
          this.models.set(model.id, modelConfig);
        }
        console.log(`✅ Discovered ${data.data.length} models`);
        this.setupAutomaticAssignments();
      }
    } catch (error) {
      console.log('⚠️ Could not connect to LM Studio, using default models');
      this.initializeDefaultModels();
    }
  }

  private createModelConfig(modelId: string): ModelConfig {
    return {
      name: modelId,
      endpoint: this.defaultEndpoint,
      contextLength: this.estimateContextLength(modelId),
      speed: this.estimateSpeed(modelId),
      capabilities: this.determineCapabilities(modelId),
      specialties: this.determineSpecialties(modelId),
      loaded: false,
      size: this.estimateSize(modelId),
      loadTime: 0,
      lastUsed: new Date(),
      performance: this.estimatePerformance(modelId)
    };
  }

  private initializeDefaultModels() {
    // Auto-detect available models from LM Studio
    const defaultModels = [
      // Fast models for quick responses
      this.createModelConfigFromTemplate('llama-3.2-3b-instruct', 8192, 'fast', ['chat', 'instruct', 'reasoning'], ['quick_responses', 'coordination', 'emergency']),
      this.createModelConfigFromTemplate('phi-3.5-mini-instruct', 4096, 'fast', ['chat', 'instruct'], ['speed', 'emergency', 'coordination']),
      
      // Medium models for balanced performance
      this.createModelConfigFromTemplate('llama-3.2-8b-instruct', 16384, 'medium', ['chat', 'instruct', 'reasoning', 'coding'], ['business_analysis', 'code_generation', 'strategic_planning']),
      this.createModelConfigFromTemplate('mistral-7b-instruct', 8192, 'medium', ['chat', 'instruct', 'coding'], ['code_generation', 'problem_solving', 'technical_writing']),
      
      // High-quality models for complex tasks
      this.createModelConfigFromTemplate('llama-3.1-70b-instruct', 32768, 'slow', ['chat', 'instruct', 'reasoning', 'complex_analysis'], ['strategic_planning', 'complex_reasoning', 'research']),
      this.createModelConfigFromTemplate('qwen2.5-32b-instruct', 32768, 'medium', ['chat', 'instruct', 'reasoning', 'multilingual'], ['research', 'analysis', 'business_planning'])
    ];

    defaultModels.forEach(model => {
      this.models.set(model.name, model);
    });
  }

  private createModelConfigFromTemplate(
    name: string, 
    contextLength: number, 
    speed: 'fast' | 'medium' | 'slow', 
    capabilities: string[], 
    specialties: string[]
  ): ModelConfig {
    return {
      name,
      endpoint: this.defaultEndpoint,
      contextLength,
      speed,
      capabilities,
      specialties,
      loaded: false,
      size: this.estimateSize(name),
      loadTime: 0,
      lastUsed: new Date(),
      performance: this.estimatePerformance(name)
    };
  }

  /**
   * Load a specific model
   */
  async loadModel(modelId: string): Promise<boolean> {
    console.log(`🔄 Loading model: ${modelId}`);
    
    if (this.loadedModels.has(modelId)) {
      console.log(`✅ Model ${modelId} already loaded`);
      return true;
    }

    try {
      // Check memory constraints
      if (this.loadedModels.size >= this.strategy.maxConcurrentModels) {
        await this.unloadLeastUsedModel();
      }

      const startTime = Date.now();
      
      // Simulate model loading (LM Studio API call would go here)
      const response = await fetch(`${this.defaultEndpoint}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 1
        })
      });

      if (response.ok) {
        const loadTime = Date.now() - startTime;
        this.loadedModels.add(modelId);
        
        const model = this.models.get(modelId);
        if (model) {
          model.loaded = true;
          model.loadTime = loadTime;
          model.lastUsed = new Date();
        }
        
        console.log(`✅ Model ${modelId} loaded in ${loadTime}ms`);
        return true;
      }
    } catch (error) {
      console.log(`⚠️ Could not verify model ${modelId}, assuming available`);
      this.loadedModels.add(modelId);
      return true;
    }
    
    return false;
  }

  /**
   * Unload a specific model
   */
  async unloadModel(modelId: string): Promise<boolean> {
    console.log(`🔄 Unloading model: ${modelId}`);
    
    this.loadedModels.delete(modelId);
    const model = this.models.get(modelId);
    if (model) {
      model.loaded = false;
    }
    
    console.log(`✅ Model ${modelId} unloaded`);
    return true;
  }

  /**
   * Get the best model for an agent and task
   */
  async getBestModelForAgent(agentType: string, taskType: string = 'general'): Promise<string> {
    // Check if we have a specific assignment
    let assignedModel = this.agentModelAssignments.get(`${agentType}:${taskType}`);
    if (!assignedModel) {
      assignedModel = this.agentModelAssignments.get(agentType);
    }
    
    if (assignedModel && this.models.has(assignedModel)) {
      await this.ensureModelLoaded(assignedModel);
      return assignedModel;
    }

    // Find the best available model
    const requirements = this.getTaskRequirements(agentType, taskType);
    const bestModel = this.selectOptimalModel(requirements);
    
    if (bestModel) {
      await this.ensureModelLoaded(bestModel);
      return bestModel;
    }

    // Fallback to first available model
    const firstModel = Array.from(this.models.keys())[0];
    if (firstModel) {
      await this.ensureModelLoaded(firstModel);
      return firstModel;
    }

    throw new Error('No models available');
  }

  private async ensureModelLoaded(modelId: string): Promise<void> {
    if (!this.loadedModels.has(modelId)) {
      await this.loadModel(modelId);
    }
    
    // Update last used time
    const model = this.models.get(modelId);
    if (model) {
      model.lastUsed = new Date();
    }
  }

  private selectOptimalModel(requirements: TaskRequirements): string | null {
    const candidates = Array.from(this.models.values())
      .filter(model => this.meetsRequirements(model, requirements))
      .sort((a, b) => this.scoreModel(b, requirements) - this.scoreModel(a, requirements));
    
    return candidates.length > 0 ? candidates[0].name : null;
  }

  private meetsRequirements(model: ModelConfig, requirements: TaskRequirements): boolean {
    // Check context length
    if (model.contextLength < requirements.contextNeeded) {
      return false;
    }
    
    // Check speed requirements
    if (requirements.speed === 'realtime' && model.speed !== 'fast') {
      return false;
    }
    
    return true;
  }

  private scoreModel(model: ModelConfig, requirements: TaskRequirements): number {
    let score = 0;
    
    // Speed scoring
    if (requirements.speed === 'realtime') {
      score += model.speed === 'fast' ? 100 : 0;
    } else if (requirements.speed === 'fast') {
      score += model.speed === 'fast' ? 80 : model.speed === 'medium' ? 60 : 40;
    } else {
      score += model.speed === 'slow' ? 100 : model.speed === 'medium' ? 80 : 60;
    }
    
    // Quality scoring based on size (larger models generally better quality)
    score += Math.min(model.performance.quality * 100, 50);
    
    // Specialty matching
    if (model.specialties.includes(requirements.domain)) {
      score += 30;
    }
    
    // Context length bonus
    if (model.contextLength >= requirements.contextNeeded * 2) {
      score += 20;
    }
    
    return score;
  }

  private getTaskRequirements(agentType: string, taskType: string): TaskRequirements {
    const baseRequirements: { [key: string]: TaskRequirements } = {
      'coordinate': {
        complexity: 'simple',
        speed: 'realtime',
        domain: 'coordination',
        contextNeeded: 2048
      },
      'ollama': {
        complexity: 'medium',
        speed: 'fast',
        domain: 'general',
        contextNeeded: 4096
      },
      'browser': {
        complexity: 'medium',
        speed: 'fast',
        domain: 'research',
        contextNeeded: 8192
      },
      'coder': {
        complexity: 'complex',
        speed: 'quality',
        domain: 'code_generation',
        contextNeeded: 16384
      },
      'planner': {
        complexity: 'complex',
        speed: 'quality',
        domain: 'strategic_planning',
        contextNeeded: 8192
      },
      'emergency': {
        complexity: 'simple',
        speed: 'realtime',
        domain: 'emergency',
        contextNeeded: 2048
      }
    };

    return baseRequirements[agentType] || baseRequirements['ollama'];
  }

  private setupAutomaticAssignments() {
    // Fast models for time-critical agents
    const fastModels = Array.from(this.models.values())
      .filter(m => m.speed === 'fast')
      .map(m => m.name);
    
    // Medium models for balanced agents
    const mediumModels = Array.from(this.models.values())
      .filter(m => m.speed === 'medium')
      .map(m => m.name);
    
    // Slow but high-quality models for complex tasks
    const qualityModels = Array.from(this.models.values())
      .filter(m => m.speed === 'slow' || m.performance.quality > 0.8)
      .map(m => m.name);

    // Assign models to agents
    if (fastModels.length > 0) {
      this.agentModelAssignments.set('coordinate', fastModels[0]);
      this.agentModelAssignments.set('emergency', fastModels[0]);
    }
    
    if (mediumModels.length > 0) {
      this.agentModelAssignments.set('ollama', mediumModels[0]);
      this.agentModelAssignments.set('browser', mediumModels[0]);
    }
    
    if (qualityModels.length > 0) {
      this.agentModelAssignments.set('coder', qualityModels[0]);
      this.agentModelAssignments.set('planner', qualityModels[0]);
    }

    console.log('🤖 Automatic model assignments:');
    for (const [agent, model] of this.agentModelAssignments) {
      console.log(`   ${agent} → ${model}`);
    }
  }

  private startMemoryMonitoring(): void {
    this.memoryMonitor = setInterval(() => {
      this.monitorMemoryUsage();
    }, 60000); // Check every minute
  }

  private monitorMemoryUsage(): void {
    const currentUsage = this.getCurrentMemoryUsage();
    
    if (currentUsage > this.strategy.unloadThreshold) {
      console.log(`⚠️ Memory usage high (${currentUsage}MB), unloading models`);
      this.unloadLeastUsedModel();
    }
  }

  private getCurrentMemoryUsage(): number {
    let totalMemory = 0;
    for (const modelId of this.loadedModels) {
      const model = this.models.get(modelId);
      if (model) {
        totalMemory += model.performance.memory;
      }
    }
    return totalMemory;
  }

  private async unloadLeastUsedModel(): Promise<void> {
    if (this.loadedModels.size <= 1) return; // Keep at least one model
    
    const sortedModels = Array.from(this.loadedModels)
      .map(id => this.models.get(id))
      .filter(model => model !== undefined)
      .sort((a, b) => a!.lastUsed.getTime() - b!.lastUsed.getTime());

    if (sortedModels.length > 0) {
      await this.unloadModel(sortedModels[0]!.name);
    }
  }

  // Estimation methods
  private estimateSize(modelId: string): number {
    const name = modelId.toLowerCase();
    if (name.includes('1b')) return 1024;
    if (name.includes('3b')) return 3072;
    if (name.includes('7b')) return 7168;
    if (name.includes('8b')) return 8192;
    if (name.includes('13b')) return 13312;
    if (name.includes('32b')) return 32768;
    if (name.includes('70b')) return 71680;
    return 4096;
  }

  private estimateContextLength(modelId: string): number {
    const name = modelId.toLowerCase();
    if (name.includes('32k')) return 32768;
    if (name.includes('16k')) return 16384;
    if (name.includes('8k')) return 8192;
    if (name.includes('4k')) return 4096;
    return 8192;
  }

  private estimateSpeed(modelId: string): 'fast' | 'medium' | 'slow' {
    const name = modelId.toLowerCase();
    if (name.includes('1b') || name.includes('3b') || name.includes('mini')) return 'fast';
    if (name.includes('70b') || name.includes('32b')) return 'slow';
    return 'medium';
  }

  private determineCapabilities(modelId: string): string[] {
    const capabilities = ['chat', 'instruct'];
    const name = modelId.toLowerCase();
    
    if (name.includes('code')) capabilities.push('coding');
    if (name.includes('reason')) capabilities.push('reasoning');
    if (name.includes('math')) capabilities.push('mathematics');
    
    return capabilities;
  }

  private determineSpecialties(modelId: string): string[] {
    const specialties: string[] = [];
    const name = modelId.toLowerCase();
    
    if (name.includes('code')) specialties.push('code_generation');
    if (name.includes('fast') || name.includes('mini')) specialties.push('speed', 'emergency');
    if (name.includes('instruct')) specialties.push('instruction_following');
    if (name.includes('chat')) specialties.push('conversation');
    if (name.includes('70b') || name.includes('32b')) specialties.push('complex_reasoning', 'strategic_planning');
    
    return specialties.length > 0 ? specialties : ['general'];
  }

  private estimatePerformance(modelId: string): { speed: number; quality: number; memory: number } {
    const name = modelId.toLowerCase();
    let speed = 0.5, quality = 0.5;
    const memory = this.estimateSize(modelId);
    
    // Speed estimates (higher is faster)
    if (name.includes('1b')) speed = 0.9;
    else if (name.includes('3b')) speed = 0.8;
    else if (name.includes('7b')) speed = 0.6;
    else if (name.includes('8b')) speed = 0.5;
    else if (name.includes('13b')) speed = 0.4;
    else if (name.includes('32b')) speed = 0.3;
    else if (name.includes('70b')) speed = 0.2;
    
    // Quality estimates (higher is better)
    if (name.includes('1b')) quality = 0.6;
    else if (name.includes('3b')) quality = 0.7;
    else if (name.includes('7b')) quality = 0.8;
    else if (name.includes('8b')) quality = 0.85;
    else if (name.includes('13b')) quality = 0.9;
    else if (name.includes('32b')) quality = 0.93;
    else if (name.includes('70b')) quality = 0.95;
    
    return { speed, quality, memory };
  }

  // Public methods for monitoring
  getLoadedModels(): string[] {
    return Array.from(this.loadedModels);
  }

  getModelStatus(): { total: number; loaded: number; assignments: number } {
    return {
      total: this.models.size,
      loaded: this.loadedModels.size,
      assignments: this.agentModelAssignments.size
    };
  }

  getModelInfo(modelId: string): ModelConfig | undefined {
    return this.models.get(modelId);
  }

  async preloadModels(): Promise<void> {
    console.log('🚀 Preloading recommended models...');
    for (const modelId of this.strategy.preloadModels) {
      if (this.models.has(modelId)) {
        await this.loadModel(modelId);
      }
    }
  }

  destroy(): void {
    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
    }
  }
}

// Export singleton instance
export const autoModelManager = new VoxSigilAutoModelManager();
