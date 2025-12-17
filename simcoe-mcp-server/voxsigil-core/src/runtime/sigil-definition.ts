/**
 * VoxSigil 1.8 Holo-Omega Definition System
 * 
 * Complete schema-compliant sigil definition factory with validation and templates.
 * Supports all 75 properties with proper TypeScript typing and AJV validation.
 */

import { Voxsigil18HoloOmega } from '../types/schema';
import { 
  createSigil, createName, createPrinciple, createUsage, 
  createSMART_MRAP, createMetadata, createStructure, 
  createActivationContext, createParameterizationSchema,
  createPromptTemplate, createObservabilityProfile,
  createSecurityProfile, createResourceEconomics
} from './property-builders';
import {
  createSustainabilityProfile, createAccessibilityProfile,
  createDeploymentTargets, createAuditabilityProfile,
  createSocioEmotionalAlignmentProfile, createScalingPolicy,
  createLoreProvenanceProfile, createEmergentBehaviorMonitoring,
  createPerformanceSLOProfile, createAdversarialResilienceProfile,
  createHumanInTheLoopEscalation, createChaosEngineeringHooks,
  createHardwareBindingProfile, createLearningArchitectureProfile,
  createKnowledgeRepresentationAndGrounding, createSelfModel,
  createCompleteVoxSigil
} from './advanced-property-builders';
import { 
  validateVoxSigil, validatePropertyCoverage, validateRoundTrip,
  generateValidationReport, autoFixValidationIssues, ValidationResult
} from './schema-validator';

export interface SigilCreationOptions {
  // Core identification
  sigilType: 'unicode' | 'pglyph' | 'ascii';
  sigilContent: string;
  name: string;
  alias?: string;
  
  // Core properties
  principle: string;
  primaryTag?: string;
  additionalTags?: string[];
  
  // Usage specification
  usageDescription: string;
  usageExample?: string | object;
  usageExplanation?: string;
  
  // SMART_MRAP requirements
  specificGoal: string;
  measurableOutcome: string;
  achievableWithinVanta: string;
  relevantToVantaMission: string;
  transferablePrinciple: string;
  accountableParty: string;
  
  // Metadata
  version: string;
  status: 'draft_proposal' | 'under_vanta_review' | 'active_stable' | 'active_experimental' | 'deprecated_phasing_out' | 'archived_historical' | 'vanta_core_primitive' | 'community_extension_pending_integration';
  author: string;
  
  // Optional enhancements
  enableObservability?: boolean;
  enableSecurity?: boolean;
  enableSustainability?: boolean;
  enableAccessibility?: boolean;
  enableLearning?: boolean;
  enableChaosEngineering?: boolean;
  
  // Template selection
  template?: 'minimal' | 'standard' | 'comprehensive' | 'consciousness' | 'agent' | 'primitive';
}

export class VoxSigilDefinitionFactory {
  private validationEnabled: boolean = true;
  
  constructor(enableValidation: boolean = true) {
    this.validationEnabled = enableValidation;
  }
  
  /**
   * Creates a complete VoxSigil definition with validation
   */
  public createSigil(options: SigilCreationOptions): {
    sigil: Voxsigil18HoloOmega;
    validation: ValidationResult;
    recommendations: string[];
  } {
    // Build core required properties
    const sigil = createSigil(options.sigilType, options.sigilContent);
    const name = createName(options.name);
    const principle = createPrinciple('cognitive', options.principle, 'Enhances Vanta ecosystem capabilities');
    
    const usage = createUsage(
      options.usageDescription,
      options.usageExample as string | { [k: string]: unknown; },
      options.usageExplanation
    );
    
    const smartMrap = createSMART_MRAP(
      options.specificGoal,
      options.measurableOutcome,
      options.achievableWithinVanta,
      options.relevantToVantaMission,
      options.transferablePrinciple,
      options.accountableParty
    );
    
    const metadata = createMetadata(
      options.version,
      options.status,
      options.author
    );
    
    // Build the base sigil configuration
    const sigilConfig: Parameters<typeof createCompleteVoxSigil>[0] = {
      sigil,
      name,
      principle,
      usage,
      smartMrap,
      metadata
    };
    
    // Add optional core properties
    if (options.alias) sigilConfig.alias = options.alias;
    if (options.primaryTag) sigilConfig.tag = options.primaryTag;
    if (options.additionalTags) sigilConfig.tags = options.additionalTags;
    
    // Apply template enhancements
    this.applyTemplate(sigilConfig, options.template || 'standard', options);
    
    // Apply feature enhancements
    this.applyOptionalFeatures(sigilConfig, options);
    
    // Create the complete sigil
    const completeSigil = createCompleteVoxSigil(sigilConfig);
    
    // Validate if enabled
    let validation: ValidationResult = { valid: true };
    let recommendations: string[] = [];
    
    if (this.validationEnabled) {
      const report = generateValidationReport(completeSigil);
      validation = report.validation;
      recommendations = report.recommendations;
      
      // If validation fails, try auto-fixing
      if (!validation.valid) {
        const { fixedData, appliedFixes } = autoFixValidationIssues(completeSigil);
        Object.assign(completeSigil, fixedData);
        recommendations.push(...appliedFixes.map(fix => `Auto-fix applied: ${fix}`));
        
        // Re-validate after fixes
        validation = validateVoxSigil(completeSigil);
      }
    }
    
    return {
      sigil: completeSigil,
      validation,
      recommendations
    };
  }
  
  /**
   * Applies template-specific enhancements
   */
  private applyTemplate(
    config: Parameters<typeof createCompleteVoxSigil>[0],
    template: SigilCreationOptions['template'],
    options: SigilCreationOptions
  ): void {
    switch (template) {
      case 'minimal':
        // Only required properties - already handled
        break;
        
      case 'standard':
        // Add basic observability and security
        config.observabilityProfile = createObservabilityProfile({
          metricsEndpoints: ['vanta_metrics_collector'],
          logFormat: 'json',
          traceIdPropagation: true
        });
        config.deploymentTargets = createDeploymentTargets({
          supportedPlatforms: ['cloud_aws', 'desktop_windows']
        });
        break;
        
      case 'comprehensive':
        // Add full operational robustness suite
        config.observabilityProfile = createObservabilityProfile({
          metricsEndpoints: ['vanta_metrics_collector', 'prometheus_endpoint'],
          logFormat: 'json',
          traceIdPropagation: true,
          eventSourcingEnabled: true,
          performanceProfilingLevel: 'detailed'
        });
        config.sustainabilityProfile = createSustainabilityProfile({
          energyEfficiencyRating: 'A',
          carbonFootprintEstimate: 'low'
        });
        config.accessibilityProfile = createAccessibilityProfile({
          wcagComplianceLevel: 'AA',
          screenReaderCompatibility: true
        });
        config.auditabilityProfile = createAuditabilityProfile({
          tamperProofLogging: true,
          evidenceRetentionPeriod: '7_years'
        });
        config.performanceSloProfile = createPerformanceSLOProfile({
          targetLatencyP99: '100ms',
          availabilityTarget: 99.9
        });
        break;
        
      case 'consciousness':
        // Focus on consciousness and cognitive scaffold properties
        config.structure = createStructure(
          'hierarchical',
          [
            {
              name: 'consciousness_core',
              description: 'Core consciousness processing unit',
              component_type_tag: 'consciousness_processor'
            },
            {
              name: 'awareness_monitor',
              description: 'Self-awareness monitoring system',
              component_type_tag: 'awareness_tracker'
            }
          ]
        );
        config.learningArchitectureProfile = createLearningArchitectureProfile({
          learningStrategy: 'meta_learning',
          adaptationMechanisms: ['self_reflection', 'experience_integration'],
          knowledgeTransferEnabled: true
        });
        config.selfModel = createSelfModel({
          identityCore: 'consciousness_agent',
          capabilitiesInventory: ['self_awareness', 'meta_cognition', 'consciousness_modeling'],
          purposeStatement: 'Consciousness modeling and self-aware reasoning'
        });
        break;
        
      case 'agent':
        // Focus on agent capabilities and interaction
        config.activationContext = createActivationContext({
          triggeringEvents: ['user_query', 'agent_collaboration_request'],
          supportedInputModalities: ['text_natural_language', 'programmatic_api_call'],
          supportedOutputModalities: ['text_natural_dialogue', 'programmatic_api_response']
        });
        config.socioEmotionalAlignmentProfile = createSocioEmotionalAlignmentProfile({
          affectMatchingEnabled: true,
          politenessLevel: 'professional',
          emotionalIntelligenceLevel: 'advanced'
        });
        break;
        
      case 'primitive':
        // Mark as cognitive primitive with basic structure
        config.isCognitivePrimitive = true;
        config.cognitivePrimitiveType = 'foundational_operation';
        config.structure = createStructure(
          'sequential',
          [
            {
              name: 'primitive_core',
              description: 'Atomic cognitive operation',
              component_type_tag: 'primitive_processor'
            }
          ]
        );
        break;
    }
  }
  
  /**
   * Applies optional feature enhancements
   */
  private applyOptionalFeatures(
    config: Parameters<typeof createCompleteVoxSigil>[0],
    options: SigilCreationOptions
  ): void {
    if (options.enableObservability && !config.observabilityProfile) {
      config.observabilityProfile = createObservabilityProfile({
        metricsEndpoints: ['vanta_metrics_collector'],
        logFormat: 'json',
        traceIdPropagation: true
      });
    }
    
    if (options.enableSecurity) {
      config.securityProfile = createSecurityProfile({
        accessControlPolicy: 'vanta_rbac_standard',
        auditLoggingLevel: 'detailed',
        encryptionRequirements: ['data_in_transit', 'data_at_rest']
      });
      config.adversarialResilienceProfile = createAdversarialResilienceProfile({
        adversarialRobustness: 'moderate',
        attackSimulationEnabled: false
      });
    }
    
    if (options.enableSustainability) {
      config.sustainabilityProfile = createSustainabilityProfile({
        energyEfficiencyRating: 'B',
        carbonFootprintEstimate: 'moderate'
      });
    }
    
    if (options.enableAccessibility) {
      config.accessibilityProfile = createAccessibilityProfile({
        wcagComplianceLevel: 'AA',
        screenReaderCompatibility: true
      });
    }
    
    if (options.enableLearning) {
      config.learningArchitectureProfile = createLearningArchitectureProfile({
        learningStrategy: 'few_shot',
        adaptationMechanisms: ['pattern_recognition', 'context_adaptation'],
        knowledgeTransferEnabled: true
      });
      config.knowledgeRepresentationAndGrounding = createKnowledgeRepresentationAndGrounding({
        representationFormat: 'hybrid',
        groundingMechanism: 'multimodal_embodied',
        semanticConsistency: true
      });
    }
    
    if (options.enableChaosEngineering) {
      config.chaosEngineeringHooks = createChaosEngineeringHooks({
        faultInjectionToggles: { 'network_latency': false, 'memory_pressure': false },
        experimentSchedule: 'manual'
      });
    }
  }
  
  /**
   * Creates a sigil from a minimal specification with smart defaults
   */
  public createMinimalSigil(
    sigil: string,
    name: string,
    principle: string,
    usage: string
  ): Voxsigil18HoloOmega {
    const options: SigilCreationOptions = {
      sigilType: 'ascii',
      sigilContent: sigil,
      name,
      principle,
      usageDescription: usage,
      specificGoal: `Implement ${name} functionality`,
      measurableOutcome: 'Successful integration and operation within Vanta',
      achievableWithinVanta: 'Yes, with current capabilities',
      relevantToVantaMission: 'Supports cognitive orchestration and expression',
      transferablePrinciple: 'Design patterns applicable to similar cognitive components',
      accountableParty: 'vanta_development_team',
      version: '1.0.0',
      status: 'active_stable',
      author: 'vanta_factory_system',
      template: 'minimal'
    };
    
    return this.createSigil(options).sigil;
  }
  
  /**
   * Validates an existing sigil and provides improvement recommendations
   */
  public validateAndImprove(sigil: any): {
    validation: ValidationResult;
    improvements: Voxsigil18HoloOmega;
    recommendations: string[];
  } {
    const validation = validateVoxSigil(sigil);
    const report = generateValidationReport(sigil);
    
    let improvements = sigil;
    if (!validation.valid) {
      const { fixedData } = autoFixValidationIssues(sigil);
      improvements = fixedData;
    }
    
    return {
      validation,
      improvements,
      recommendations: report.recommendations
    };
  }
  
  /**
   * Performs round-trip validation for serialization safety
   */
  public validateSerialization(sigil: Voxsigil18HoloOmega): ValidationResult {
    return validateRoundTrip(sigil);
  }
}

// Export default factory instance
export const sigilFactory = new VoxSigilDefinitionFactory();

// Export convenience functions
export function createMinimalSigil(sigil: string, name: string, principle: string, usage: string): Voxsigil18HoloOmega {
  return sigilFactory.createMinimalSigil(sigil, name, principle, usage);
}

export function createStandardSigil(options: SigilCreationOptions): Voxsigil18HoloOmega {
  return sigilFactory.createSigil({ ...options, template: 'standard' }).sigil;
}

export function createComprehensiveSigil(options: SigilCreationOptions): Voxsigil18HoloOmega {
  return sigilFactory.createSigil({ ...options, template: 'comprehensive' }).sigil;
}

// Export convenience functions for backward compatibility
export function createVoxSigilDefinition(options: Partial<Voxsigil18HoloOmega>): Voxsigil18HoloOmega {
  // Use the minimal sigil creator with required fields
  const sigil = options.sigil || 'DEFAULT_SIGIL';
  const name = options.name || 'Default Name';
  const principle = options.principle || 'Default principle';
  const usage = typeof options.usage === 'object' 
    ? (options.usage as any).description || 'Default usage'
    : options.usage || 'Default usage';
  
  const minimal = createMinimalSigil(sigil, name, principle, usage);
  
  // Merge with provided options
  return { ...minimal, ...options };
}

export function validateVoxSigilDefinition(sigil: Voxsigil18HoloOmega): ValidationResult {
  return sigilFactory.validateSerialization(sigil);
}

export function createCognitivePrimitive(
  sigil: string,
  name: string,
  principle: string,
  primitiveType: string,
  additionalProperties: Partial<Voxsigil18HoloOmega> = {}
): Voxsigil18HoloOmega {
  const cognitiveOptions: SigilCreationOptions = {
    sigilType: 'unicode',
    sigilContent: sigil,
    name,
    principle,
    usageDescription: `Cognitive primitive for ${primitiveType}`,
    usageExample: `Applied during ${primitiveType} operations`,
    usageExplanation: `Fundamental cognitive operation: ${principle}`,
    specificGoal: `Enable ${primitiveType} functionality in Vanta`,
    measurableOutcome: `Successful ${primitiveType} operations`,
    achievableWithinVanta: 'Yes, fundamental cognitive capability',
    relevantToVantaMission: `Core to Vanta's cognitive architecture`,
    transferablePrinciple: `${primitiveType} principles applicable across domains`,
    accountableParty: 'VoxSigilMind_CognitivePrimitive_Manager',
    version: '1.0.0',
    status: 'active_stable',
    author: 'VoxSigilMind_System',
    template: 'primitive',
    additionalTags: ['cognitive_primitive', primitiveType]
  };

  const result = sigilFactory.createSigil(cognitiveOptions);
  
  // Merge with additional properties that may include is_cognitive_primitive
  const enhancedSigil = { ...result.sigil, ...additionalProperties };
  
  // Ensure cognitive primitive properties are set
  enhancedSigil.is_cognitive_primitive = true;
  enhancedSigil.cognitive_primitive_type = primitiveType;
  
  return enhancedSigil;
}

export { ValidationResult };
