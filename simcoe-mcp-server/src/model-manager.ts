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

export class VoxSigilModelManager {
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
    this.initializeModels();
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
      const data: any = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        for (const model of data.data) {
          const modelConfig = this.createModelConfig(model.id);
          this.models.set(model.id, modelConfig);
        }
        console.log(`✅ Discovered ${data.data.length} models`);
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
    const availableModels: ModelConfig[] = [
      // Fast models for quick responses
      {
        name: 'llama-3.2-3b-instruct',
        endpoint: `${this.defaultEndpoint}`,
        contextLength: 8192,
        speed: 'fast',
        capabilities: ['chat', 'instruct', 'reasoning'],
        specialties: ['quick_responses', 'coordination', 'emergency'],
        loaded: false,
        size: 2048,
        loadTime: 0,
        lastUsed: new Date(),
        performance: { speed: 200, quality: 75, memory: 2048 }
      },
      {
        name: 'phi-3.5-mini-instruct',
        endpoint: `${this.defaultEndpoint}`,
        contextLength: 4096,
        speed: 'fast',
        capabilities: ['chat', 'instruct'],
        specialties: ['simple_tasks', 'emergency', 'status_checks'],
        loaded: false,
        size: 1024,
        loadTime: 0,
        lastUsed: new Date(),
        performance: { speed: 250, quality: 70, memory: 1024 }
      },
      
      // Medium models for balanced performance
      {
        name: 'llama-3.2-8b-instruct',
        endpoint: `${this.defaultEndpoint}`,
        contextLength: 16384,
        speed: 'medium',
        capabilities: ['chat', 'instruct', 'reasoning', 'analysis'],
        specialties: ['business_planning', 'code_generation', 'research'],
        loaded: false,
        size: 5120,
        loadTime: 0,
        lastUsed: new Date(),
        performance: { speed: 120, quality: 85, memory: 5120 }
      },
      {
        name: 'mistral-7b-instruct',
        endpoint: `${this.defaultEndpoint}`,
        contextLength: 8192,
        speed: 'medium',
        capabilities: ['chat', 'instruct', 'coding'],
        specialties: ['code_generation', 'technical_writing', 'debugging'],
        loaded: false,
        size: 4096,
        loadTime: 0,
        lastUsed: new Date(),
        performance: { speed: 100, quality: 80, memory: 4096 }
      },
      
      // High-quality models for complex tasks
      {
        name: 'llama-3.1-70b-instruct',
        endpoint: `${this.defaultEndpoint}`,
        contextLength: 32768,
        speed: 'slow',
        capabilities: ['chat', 'instruct', 'reasoning', 'analysis', 'creative'],
        specialties: ['complex_analysis', 'strategic_planning', 'research', 'writing'],
        loaded: false,
        size: 40960,
        loadTime: 0,
        lastUsed: new Date(),
        performance: { speed: 50, quality: 95, memory: 40960 }
      },
      {
        name: 'qwen2.5-32b-instruct',
        endpoint: `${this.defaultEndpoint}`,
        contextLength: 32768,
        speed: 'medium',
        capabilities: ['chat', 'instruct', 'reasoning', 'multilingual'],
        specialties: ['analysis', 'research', 'problem_solving', 'technical'],
        loaded: false,
        size: 20480,
        loadTime: 0,
        lastUsed: new Date(),
        performance: { speed: 75, quality: 90, memory: 20480 }
      }
    ];

    // Store models in map
    availableModels.forEach(model => {
      this.models.set(model.name, model);
    });
  }

  private setupAutomaticAssignments() {
    // Automatic model assignments based on agent type and task requirements
    const assignments = {
      // Fast response agents
      'coordinate': 'llama-3.2-3b-instruct',    // Quick coordination decisions
      'emergency': 'llama-3.2-3b-instruct',     // Fast emergency response
      'memory': 'phi-3.5-mini-instruct',        // Simple memory operations
      
      // Balanced agents
      'ollama': 'llama-3.2-8b-instruct',        // General AI processing
      'coder': 'mistral-7b-instruct',           // Code generation & debugging
      'browser': 'llama-3.2-8b-instruct',      // Web research & analysis
      
      // High-quality agents
      'planner': 'qwen2.5-32b-instruct',        // Strategic business planning
      'analyst': 'llama-3.1-70b-instruct',     // Deep analysis tasks
      'writer': 'llama-3.1-70b-instruct'       // Content creation
    };

    Object.entries(assignments).forEach(([agent, model]) => {
      this.agentModelAssignments.set(agent, model);
    });
  }

  /**
   * Automatically select the best model for a given agent and task
   */
  public selectModelForTask(agentType: string, taskRequirements: TaskRequirements): ModelConfig {
    // Get preferred model for agent
    let selectedModelName = this.agentModelAssignments.get(agentType);

    // Override based on task requirements
    if (taskRequirements.speed === 'realtime') {
      // Force fast model for real-time needs
      selectedModelName = 'phi-3.5-mini-instruct';
    } else if (taskRequirements.complexity === 'complex') {
      // Use high-quality model for complex tasks
      selectedModelName = taskRequirements.contextNeeded > 16384 
        ? 'llama-3.1-70b-instruct' 
        : 'qwen2.5-32b-instruct';
    } else if (taskRequirements.speed === 'quality') {
      // Prioritize quality over speed
      selectedModelName = 'qwen2.5-32b-instruct';
    }

    // Fallback to agent default if no override
    selectedModelName = selectedModelName || this.agentModelAssignments.get(agentType) || 'llama-3.2-8b-instruct';

    const model = this.models.get(selectedModelName);
    if (!model) {
      console.warn(`Model ${selectedModelName} not found, using fallback`);
      return this.models.get('llama-3.2-8b-instruct')!;
    }

    console.log(`🤖 Agent [${agentType.toUpperCase()}] using model: ${model.name} (${model.speed}, ${model.contextLength} ctx)`);
    return model;
  }

  /**
   * Get optimal model configuration for an agent
   */
  public getAgentModel(agentType: string): ModelConfig {
    const modelName = this.agentModelAssignments.get(agentType) || 'llama-3.2-8b-instruct';
    return this.models.get(modelName)!;
  }

  /**
   * Auto-detect available models from LM Studio
   */
  public async detectAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.defaultEndpoint}/models`);
      if (response.ok) {
        const data = await response.json() as any;
        const availableModelNames = data.data?.map((m: any) => m.id) || [];
        
        console.log('🔍 Detected LM Studio models:', availableModelNames);
        
        // Update available models
        this.updateAvailableModels(availableModelNames);
        
        return availableModelNames;
      }
    } catch (error) {
      console.warn('Could not detect LM Studio models, using defaults:', error);
    }
    
    return Array.from(this.models.keys());
  }

  private updateAvailableModels(availableNames: string[]) {
    // Remove models that aren't available
    const currentModels = Array.from(this.models.keys());
    currentModels.forEach(modelName => {
      if (!availableNames.some(available => available.includes(modelName.split('-')[0]))) {
        console.log(`📤 Model ${modelName} not available in LM Studio`);
      }
    });

    // Update assignments to use available models
    this.ensureAssignmentsAreAvailable(availableNames);
  }

  private ensureAssignmentsAreAvailable(availableNames: string[]) {
    for (const [agent, assignedModel] of this.agentModelAssignments.entries()) {
      const isAvailable = availableNames.some(available => 
        available.includes(assignedModel.split('-')[0])
      );
      
      if (!isAvailable) {
        // Find best alternative
        const fallback = this.findBestAvailableModel(availableNames, assignedModel);
        if (fallback) {
          console.log(`🔄 Agent [${agent.toUpperCase()}] reassigned: ${assignedModel} → ${fallback}`);
          this.agentModelAssignments.set(agent, fallback);
        }
      }
    }
  }

  private findBestAvailableModel(availableNames: string[], preferredModel: string): string | null {
    // Try to find similar model
    const preferredFamily = preferredModel.split('-')[0]; // e.g., 'llama', 'mistral'
    
    const similar = availableNames.find(name => name.includes(preferredFamily));
    if (similar) return similar;
    
    // Fallback to any available model
    return availableNames[0] || null;
  }

  /**
   * Create request configuration for LM Studio API
   */
  public createRequestConfig(model: ModelConfig, prompt: string, systemPrompt?: string): any {
    return {
      model: model.name,
      messages: [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: prompt }
      ],
      max_tokens: Math.min(2048, model.contextLength / 4),
      temperature: 0.7,
      top_p: 0.9,
      stream: false
    };
  }

  /**
   * Send request to LM Studio
   */
  public async sendRequest(config: any, endpoint?: string): Promise<string> {
    const url = `${endpoint || this.defaultEndpoint}/chat/completions`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error(`LM Studio request failed: ${response.status}`);
      }

      const data = await response.json() as any;
      return data.choices?.[0]?.message?.content || 'No response generated';
      
    } catch (error) {
      console.error('LM Studio request error:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Get model performance stats
   */
  public getModelStats(): any {
    const stats = {
      totalModels: this.models.size,
      agentAssignments: Object.fromEntries(this.agentModelAssignments),
      modelsBySpeed: {
        fast: Array.from(this.models.values()).filter(m => m.speed === 'fast').map(m => m.name),
        medium: Array.from(this.models.values()).filter(m => m.speed === 'medium').map(m => m.name),
        slow: Array.from(this.models.values()).filter(m => m.speed === 'slow').map(m => m.name)
      },
      modelsByCapability: this.getModelsByCapability()
    };

    return stats;
  }

  private getModelsByCapability(): any {
    const capabilities: any = {};
    
    this.models.forEach(model => {
      model.capabilities.forEach(cap => {
        if (!capabilities[cap]) capabilities[cap] = [];
        capabilities[cap].push(model.name);
      });
    });

    return capabilities;
  }

  /**
   * Initialize models - called from constructor
   */
  private async initializeModels(): Promise<void> {
    await this.discoverModels();
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    setInterval(() => {
      this.checkMemoryUsage();
    }, 60000); // Check every minute
  }

  /**
   * Check memory usage for performance monitoring
   */
  private checkMemoryUsage(): void {
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    
    // Log warning if memory usage is high
    if (heapUsedMB > 1024) { // 1GB threshold
      console.warn(`High memory usage detected: ${heapUsedMB}MB used of ${heapTotalMB}MB total`);
    }
    
    // Optionally trigger garbage collection if available
    if (global.gc && heapUsedMB > 512) {
      global.gc();
    }
  }

  /**
   * Estimate context length for a model
   */
  private estimateContextLength(modelId: string): number {
    if (modelId.includes('3b')) return 8192;
    if (modelId.includes('7b')) return 8192;
    if (modelId.includes('8b')) return 16384;
    if (modelId.includes('32b')) return 32768;
    if (modelId.includes('70b')) return 32768;
    return 4096; // default
  }

  /**
   * Estimate model speed
   */
  private estimateSpeed(modelId: string): 'fast' | 'medium' | 'slow' {
    if (modelId.includes('3b') || modelId.includes('mini')) return 'fast';
    if (modelId.includes('70b')) return 'slow';
    return 'medium';
  }

  /**
   * Determine model capabilities
   */
  private determineCapabilities(modelId: string): string[] {
    const capabilities = ['chat', 'instruct'];
    if (modelId.includes('reasoning') || modelId.includes('llama')) capabilities.push('reasoning');
    if (modelId.includes('code') || modelId.includes('mistral')) capabilities.push('coding');
    if (modelId.includes('qwen')) capabilities.push('multilingual');
    if (modelId.includes('70b')) capabilities.push('analysis', 'creative');
    return capabilities;
  }

  /**
   * Determine model specialties
   */
  private determineSpecialties(modelId: string): string[] {
    if (modelId.includes('3b') || modelId.includes('mini')) {
      return ['quick_responses', 'coordination', 'emergency'];
    }
    if (modelId.includes('mistral')) {
      return ['code_generation', 'technical_writing', 'debugging'];
    }
    if (modelId.includes('70b')) {
      return ['complex_analysis', 'strategic_planning', 'research', 'writing'];
    }
    if (modelId.includes('qwen')) {
      return ['analysis', 'research', 'problem_solving', 'technical'];
    }
    return ['business_planning', 'code_generation', 'research'];
  }

  /**
   * Estimate model size in MB
   */
  private estimateSize(modelId: string): number {
    if (modelId.includes('3b')) return 2048; // 2GB
    if (modelId.includes('7b')) return 4096; // 4GB
    if (modelId.includes('8b')) return 5120; // 5GB
    if (modelId.includes('32b')) return 20480; // 20GB
    if (modelId.includes('70b')) return 40960; // 40GB
    return 1024; // 1GB default
  }

  /**
   * Estimate model performance
   */
  private estimatePerformance(modelId: string): { speed: number; quality: number; memory: number } {
    if (modelId.includes('70b')) {
      return { speed: 50, quality: 95, memory: 40960 };
    }
    if (modelId.includes('32b')) {
      return { speed: 75, quality: 90, memory: 20480 };
    }
    if (modelId.includes('3b') || modelId.includes('mini')) {
      return { speed: 200, quality: 75, memory: 2048 };
    }
    return { speed: 100, quality: 80, memory: 4096 };
  }
}

// Export singleton instance
export const modelManager = new VoxSigilModelManager();
