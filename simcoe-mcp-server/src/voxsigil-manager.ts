import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

interface VoxSigil {
  schema_version: string;
  meta: {
    sigil: string;
    alias?: string;
    tag?: string;
    tags?: string[];
  };
  holo_mesh?: {
    is_cognitive_primitive: boolean;
    mesh_compatibility: string;
    registration_ready: boolean;
    vanta_core_integration?: {
      event_support: boolean;
      async_capable: boolean;
      memory_aware: boolean;
    };
    temporal_pattern?: string;
  };
  cognitive: {
    principle: string;
    usage?: string;
    context_windows?: string[];
    invocation_patterns?: string[];
  };
  SMART_MRAP?: any;
  metadata?: any;
}

interface SigilRegistry {
  sigils: Map<string, VoxSigil>;
  scaffolds: Map<string, VoxSigil>;
  pglyphs: Map<string, VoxSigil>;
  tags: Map<string, string[]>;
}

export class VoxSigilManager {
  private registry: SigilRegistry;
  private libraryPath: string;

  constructor(libraryPath: string = './library-sigil') {
    this.libraryPath = libraryPath;
    this.registry = {
      sigils: new Map(),
      scaffolds: new Map(),
      pglyphs: new Map(),
      tags: new Map()
    };
    this.loadSigilLibrary();
  }

  /**
   * Load all VoxSigils from the library-sigil directory
   */
  private loadSigilLibrary(): void {
    try {
      // Load main sigils
      const sigilsDir = join(this.libraryPath, 'sigils');
      if (readdirSync(sigilsDir)) {
        this.loadSigilsFromDirectory(sigilsDir, 'sigils');
      }

      // Load scaffolds
      const scaffoldsDir = join(this.libraryPath, 'scaffolds');
      if (readdirSync(scaffoldsDir)) {
        this.loadSigilsFromDirectory(scaffoldsDir, 'scaffolds');
      }

      console.log(`✨ VoxSigil Library Loaded: ${this.registry.sigils.size} sigils, ${this.registry.scaffolds.size} scaffolds`);
      this.buildTagIndex();
    } catch (error) {
      console.error('Failed to load VoxSigil library:', error);
    }
  }

  /**
   * Load sigils from a specific directory
   */
  private loadSigilsFromDirectory(directory: string, type: 'sigils' | 'scaffolds'): void {
    const files = readdirSync(directory).filter(file => 
      file.endsWith('.voxsigil') || file.endsWith('.yaml')
    );

    for (const file of files) {
      try {
        const filePath = join(directory, file);
        const content = readFileSync(filePath, 'utf8');
        const sigil = yaml.load(content) as VoxSigil;

        if (sigil.meta?.sigil) {
          this.registry[type].set(sigil.meta.sigil, sigil);
          
          // Also register in main sigils registry
          this.registry.sigils.set(sigil.meta.sigil, sigil);

          // Check if it's a pglyph (persona glyph)
          if (this.isPglyph(sigil)) {
            this.registry.pglyphs.set(sigil.meta.sigil, sigil);
          }
        }
      } catch (error) {
        console.warn(`Failed to load sigil from ${file}:`, error);
      }
    }
  }

  /**
   * Check if a sigil is a pglyph (persona glyph)
   */
  private isPglyph(sigil: VoxSigil): boolean {
    const tags = sigil.meta.tags || [];
    const tag = sigil.meta.tag || '';
    
    return tags.includes('pglyph') || 
           tags.includes('persona') || 
           tags.includes('identity') ||
           tag.includes('Identity') ||
           sigil.meta.alias?.includes('pglyph') ||
           false;
  }

  /**
   * Build tag index for fast searching
   */
  private buildTagIndex(): void {
    for (const [sigilId, sigil] of this.registry.sigils) {
      const allTags = [
        sigil.meta.tag,
        ...(sigil.meta.tags || [])
      ].filter(Boolean) as string[];

      for (const tag of allTags) {
        if (!this.registry.tags.has(tag)) {
          this.registry.tags.set(tag, []);
        }
        this.registry.tags.get(tag)!.push(sigilId);
      }
    }
  }

  /**
   * Get a sigil by its identifier
   */
  getSigil(sigilId: string): VoxSigil | undefined {
    return this.registry.sigils.get(sigilId);
  }

  /**
   * Get all sigils with a specific tag
   */
  getSigilsByTag(tag: string): VoxSigil[] {
    const sigilIds = this.registry.tags.get(tag) || [];
    return sigilIds.map(id => this.registry.sigils.get(id)!).filter(Boolean);
  }

  /**
   * Search sigils by keyword in principle or usage
   */
  searchSigils(query: string): VoxSigil[] {
    const results: VoxSigil[] = [];
    const searchTerm = query.toLowerCase();

    for (const sigil of this.registry.sigils.values()) {
      const searchableText = [
        sigil.meta.sigil,
        sigil.meta.alias,
        sigil.cognitive.principle,
        sigil.cognitive.usage
      ].join(' ').toLowerCase();

      if (searchableText.includes(searchTerm)) {
        results.push(sigil);
      }
    }

    return results;
  }

  /**
   * Get all cognitive primitives
   */
  getCognitivePrimitives(): VoxSigil[] {
    return Array.from(this.registry.sigils.values())
      .filter(sigil => sigil.holo_mesh?.is_cognitive_primitive === true);
  }

  /**
   * Get all scaffolds
   */
  getScaffolds(): VoxSigil[] {
    return Array.from(this.registry.scaffolds.values());
  }

  /**
   * Get all pglyphs (persona glyphs)
   */
  getPglyphs(): VoxSigil[] {
    return Array.from(this.registry.pglyphs.values());
  }

  /**
   * Generate context from relevant sigils
   */
  generateContext(query: string, maxSigils: number = 5): string {
    const relevantSigils = this.searchSigils(query).slice(0, maxSigils);
    
    if (relevantSigils.length === 0) {
      return '🔮 No relevant VoxSigils found for this context.';
    }

    let context = '🔮 **VoxSigil Context Engineering**\n\n';
    
    for (const sigil of relevantSigils) {
      context += `**${sigil.meta.sigil}** (${sigil.meta.alias || 'Unknown'})\n`;
      context += `📋 Tag: ${sigil.meta.tag}\n`;
      context += `🧠 Principle: ${sigil.cognitive.principle}\n`;
      if (sigil.cognitive.usage) {
        context += `🎯 Usage: ${sigil.cognitive.usage}\n`;
      }
      context += '\n---\n\n';
    }

    return context;
  }

  /**
   * Invoke a sigil for context engineering
   */
  invokeSigil(sigilId: string, context?: string): string {
    const sigil = this.getSigil(sigilId);
    
    if (!sigil) {
      return `❌ Sigil '${sigilId}' not found in library.`;
    }

    let invocation = `🔮 **Invoking VoxSigil: ${sigil.meta.sigil}**\n\n`;
    invocation += `**Alias:** ${sigil.meta.alias || 'None'}\n`;
    invocation += `**Tag:** ${sigil.meta.tag}\n\n`;
    invocation += `**Cognitive Principle:**\n${sigil.cognitive.principle}\n\n`;
    
    if (sigil.cognitive.usage) {
      invocation += `**Usage Context:**\n${sigil.cognitive.usage}\n\n`;
    }

    if (context) {
      invocation += `**Applied Context:**\n${context}\n\n`;
    }

    if (sigil.cognitive.invocation_patterns) {
      invocation += `**Invocation Patterns:**\n`;
      for (const pattern of sigil.cognitive.invocation_patterns) {
        invocation += `• ${pattern}\n`;
      }
      invocation += '\n';
    }

    return invocation;
  }

  /**
   * Get library statistics
   */
  getLibraryStats(): any {
    return {
      total_sigils: this.registry.sigils.size,
      scaffolds: this.registry.scaffolds.size,
      pglyphs: this.registry.pglyphs.size,
      cognitive_primitives: this.getCognitivePrimitives().length,
      tags: this.registry.tags.size,
      available_tags: Array.from(this.registry.tags.keys())
    };
  }

  /**
   * List all available sigils
   */
  listAllSigils(): string[] {
    return Array.from(this.registry.sigils.keys());
  }
}

// Export the manager instance
export const voxSigilManager = new VoxSigilManager();
