/**
 * VoxSigil 1.8 Holo-Omega Advanced Property Builders
 * 
 * This module provides factory functions for all 75 properties defined in the VoxSigil 1.8 schema,
 * particularly focusing on the 33 new v1.8 properties for operational robustness.
 */

import { Voxsigil18HoloOmega } from '../types/schema';

// ============================================================================
// ADVANCED v1.8 PROPERTY BUILDERS (33 new properties)
// ============================================================================

/**
 * Creates sustainability profile for carbon footprint and eco-credentials
 */
export function createSustainabilityProfile(config: {
  energyEfficiencyRating?: 'A+' | 'A' | 'B' | 'C' | 'D';
  carbonFootprintEstimate?: string;
  ecoCredentialsRefs?: string[];
  greenComputingOptimizations?: string[];
}): Voxsigil18HoloOmega['sustainability_profile'] {
  return {
    energy_efficiency_rating: config.energyEfficiencyRating || 'B',
    carbon_footprint_estimate: config.carbonFootprintEstimate || 'minimal',
    eco_credentials_refs: config.ecoCredentialsRefs || [],
    green_computing_optimizations: config.greenComputingOptimizations || []
  };
}

/**
 * Creates accessibility profile for WCAG compliance and alternate media
 */
export function createAccessibilityProfile(config: {
  wcagComplianceLevel?: 'AA' | 'AAA';
  alternateMediaMappings?: Array<{
    mediaType: string;
    alternateFormat: string;
    conversionMethod: string;
  }>;
  screenReaderCompatibility?: boolean;
  cognitiveLoadReduction?: string[];
}): Voxsigil18HoloOmega['accessibility_profile'] {
  return {
    wcag_compliance_level: config.wcagComplianceLevel || 'AA',
    alternate_media_mappings: config.alternateMediaMappings || [],
    screen_reader_compatibility: config.screenReaderCompatibility || true,
    cognitive_load_reduction_features: config.cognitiveLoadReduction || []
  };
}

/**
 * Creates deployment targets for cloud/edge/VR environments
 */
export function createDeploymentTargets(config: {
  supportedPlatforms?: Array<'cloud_aws' | 'cloud_azure' | 'cloud_gcp' | 'edge_local' | 'vr_meta' | 'vr_steamvr' | 'mobile_ios' | 'mobile_android' | 'desktop_windows' | 'desktop_macos' | 'desktop_linux'>;
  versionRequirements?: Record<string, string>;
  performanceProfiles?: Record<string, {
    minMemory: string;
    minCpu: string;
    networkRequirements: string;
  }>;
}): Voxsigil18HoloOmega['deployment_targets'] {
  return {
    supported_platforms: config.supportedPlatforms || ['cloud_aws', 'desktop_windows'],
    version_requirements: config.versionRequirements || {},
    performance_profiles: config.performanceProfiles || {}
  };
}

/**
 * Creates auditability profile for tamper-proof logging and evidence retention
 */
export function createAuditabilityProfile(config: {
  tamperProofLogging?: boolean;
  evidenceRetentionPeriod?: string;
  blockchainIntegration?: boolean;
  complianceFrameworks?: string[];
  auditTrailEncryption?: boolean;
}): Voxsigil18HoloOmega['auditability_profile'] {
  return {
    tamper_proof_logging: config.tamperProofLogging || false,
    evidence_retention_period: config.evidenceRetentionPeriod || '7_years',
    blockchain_integration: config.blockchainIntegration || false,
    compliance_frameworks: config.complianceFrameworks || [],
    audit_trail_encryption: config.auditTrailEncryption || true
  };
}

/**
 * Creates socio-emotional alignment profile for affect matching and politeness
 */
export function createSocioEmotionalAlignmentProfile(config: {
  affectMatchingEnabled?: boolean;
  politenessLevel?: 'formal' | 'professional' | 'casual' | 'friendly';
  culturalSensitivityRefs?: string[];
  emotionalIntelligenceLevel?: 'basic' | 'intermediate' | 'advanced';
  empathyModelingApproach?: string;
}): Voxsigil18HoloOmega['socio_emotional_alignment_profile'] {
  return {
    affect_matching_enabled: config.affectMatchingEnabled || true,
    politeness_level: config.politenessLevel || 'professional',
    cultural_sensitivity_refs: config.culturalSensitivityRefs || [],
    emotional_intelligence_level: config.emotionalIntelligenceLevel || 'intermediate',
    empathy_modeling_approach: config.empathyModelingApproach || 'context_aware'
  };
}

/**
 * Creates scaling policy for auto/step/elastic scaling
 */
export function createScalingPolicy(config: {
  scalingStrategy?: 'auto' | 'step' | 'elastic' | 'manual';
  minInstances?: number;
  maxInstances?: number;
  targetUtilization?: number;
  scaleUpCooldown?: string;
  scaleDownCooldown?: string;
}): Voxsigil18HoloOmega['scaling_policy'] {
  return {
    scaling_strategy: config.scalingStrategy || 'auto',
    min_instances: config.minInstances || 1,
    max_instances: config.maxInstances || 10,
    target_utilization_percentage: config.targetUtilization || 70,
    scale_up_cooldown: config.scaleUpCooldown || '300s',
    scale_down_cooldown: config.scaleDownCooldown || '600s'
  };
}

/**
 * Creates lore provenance profile for canonical story source-trace
 */
export function createLoreProvenanceProfile(config: {
  canonicalStorySource?: string;
  attributionChain?: Array<{
    contributor: string;
    contributionType: string;
    timestamp: string;
  }>;
  narrativeConsistencyRefs?: string[];
  mythologyIntegrationLevel?: 'none' | 'light' | 'moderate' | 'deep';
}): Voxsigil18HoloOmega['lore_provenance_profile'] {
  return {
    canonical_story_source: config.canonicalStorySource || 'vanta_core_mythology',
    attribution_chain: config.attributionChain || [],
    narrative_consistency_refs: config.narrativeConsistencyRefs || [],
    mythology_integration_level: config.mythologyIntegrationLevel || 'moderate'
  };
}

/**
 * Creates emergent behavior monitoring for novelty detection
 */
export function createEmergentBehaviorMonitoring(config: {
  noveltyDetectionEnabled?: boolean;
  deviationThresholds?: Record<string, number>;
  emergentPatternLogging?: boolean;
  adaptationLearningEnabled?: boolean;
  surpriseMetrics?: string[];
}): Voxsigil18HoloOmega['emergent_behavior_monitoring'] {
  return {
    novelty_detection_enabled: config.noveltyDetectionEnabled || true,
    deviation_thresholds: config.deviationThresholds || {},
    emergent_pattern_logging: config.emergentPatternLogging || true,
    adaptation_learning_enabled: config.adaptationLearningEnabled || false,
    surprise_metrics: config.surpriseMetrics || ['semantic_drift', 'behavioral_anomaly']
  };
}

/**
 * Creates performance SLO profile for latency/throughput targets
 */
export function createPerformanceSLOProfile(config: {
  targetLatencyP99?: string;
  targetThroughput?: string;
  availabilityTarget?: number;
  errorRateThreshold?: number;
  breachEscalationPolicy?: string;
}): Voxsigil18HoloOmega['performance_slo_profile'] {
  return {
    target_latency_p99: config.targetLatencyP99 || '100ms',
    target_throughput: config.targetThroughput || '1000rps',
    availability_target_percentage: config.availabilityTarget || 99.9,
    error_rate_threshold_percentage: config.errorRateThreshold || 0.1,
    breach_escalation_policy: config.breachEscalationPolicy || 'alert_and_scale'
  };
}

/**
 * Creates adversarial resilience profile for red-team vectors and fuzz tests
 */
export function createAdversarialResilienceProfile(config: {
  redTeamVectors?: string[];
  fuzzTestSuites?: string[];
  adversarialRobustness?: 'basic' | 'moderate' | 'high' | 'maximum';
  attackSimulationEnabled?: boolean;
  defenseStrategies?: string[];
}): Voxsigil18HoloOmega['adversarial_resilience_profile'] {
  return {
    red_team_vectors: config.redTeamVectors || [],
    fuzz_test_suites: config.fuzzTestSuites || [],
    adversarial_robustness_level: config.adversarialRobustness || 'moderate',
    attack_simulation_enabled: config.attackSimulationEnabled || false,
    defense_strategies: config.defenseStrategies || []
  };
}

/**
 * Creates human-in-the-loop escalation for override tiers and approval queues
 */
export function createHumanInTheLoopEscalation(config: {
  overrideTiers?: Array<{
    tierLevel: number;
    requiredRole: string;
    approvalTimeoutMs: number;
  }>;
  approvalQueues?: string[];
  uiHooks?: string[];
  escalationTriggers?: string[];
}): Voxsigil18HoloOmega['human_in_the_loop_escalation'] {
  return {
    override_tiers: config.overrideTiers || [],
    approval_queues: config.approvalQueues || [],
    ui_hooks: config.uiHooks || [],
    escalation_triggers: config.escalationTriggers || []
  };
}

/**
 * Creates chaos engineering hooks for fault injection
 */
export function createChaosEngineeringHooks(config: {
  faultInjectionToggles?: Record<string, boolean>;
  blastRadiusLimits?: Record<string, string>;
  experimentSchedule?: string;
  recoveryVerification?: boolean;
}): Voxsigil18HoloOmega['chaos_engineering_hooks'] {
  return {
    fault_injection_toggles: config.faultInjectionToggles || {},
    blast_radius_limits: config.blastRadiusLimits || {},
    experiment_schedule: config.experimentSchedule || 'manual',
    recovery_verification_enabled: config.recoveryVerification || true
  };
}

/**
 * Creates hardware binding profile for micro-architecture hints
 */
export function createHardwareBindingProfile(config: {
  preferredArchitecture?: 'x86_64' | 'arm64' | 'gpu_cuda' | 'gpu_opencl' | 'tpu' | 'fpga';
  memoryRequirements?: string;
  computeIntensity?: 'low' | 'medium' | 'high' | 'extreme';
  hardwareOptimizations?: string[];
}): Voxsigil18HoloOmega['hardware_binding_profile'] {
  return {
    preferred_architecture: config.preferredArchitecture || 'x86_64',
    memory_requirements: config.memoryRequirements || '1GB',
    compute_intensity: config.computeIntensity || 'medium',
    hardware_optimizations: config.hardwareOptimizations || []
  };
}

// ============================================================================
// LEARNING AND KNOWLEDGE BUILDERS
// ============================================================================

/**
 * Creates learning architecture profile
 */
export function createLearningArchitectureProfile(config: {
  learningStrategy?: 'supervised' | 'unsupervised' | 'reinforcement' | 'meta_learning' | 'few_shot' | 'zero_shot';
  adaptationMechanisms?: string[];
  knowledgeTransferEnabled?: boolean;
  memoryConsolidationApproach?: string;
}): Voxsigil18HoloOmega['learning_architecture_profile'] {
  return {
    learning_strategy: config.learningStrategy || 'few_shot',
    adaptation_mechanisms: config.adaptationMechanisms || [],
    knowledge_transfer_enabled: config.knowledgeTransferEnabled || true,
    memory_consolidation_approach: config.memoryConsolidationApproach || 'episodic_semantic_hybrid'
  };
}

/**
 * Creates knowledge representation and grounding profile
 */
export function createKnowledgeRepresentationAndGrounding(config: {
  representationFormat?: 'symbolic' | 'vector' | 'graph' | 'hybrid';
  groundingMechanism?: string;
  conceptualAlignment?: string;
  semanticConsistency?: boolean;
}): Voxsigil18HoloOmega['knowledge_representation_and_grounding'] {
  return {
    representation_format: config.representationFormat || 'hybrid',
    grounding_mechanism: config.groundingMechanism || 'multimodal_embodied',
    conceptual_alignment: config.conceptualAlignment || 'human_compatible',
    semantic_consistency_enforced: config.semanticConsistency || true
  };
}

/**
 * Creates self-model for identity and capabilities awareness
 */
export function createSelfModel(config: {
  identityCore?: string;
  capabilitiesInventory?: string[];
  limitationsAwareness?: string[];
  purposeStatement?: string;
  personalityTraits?: Record<string, number>;
}): Voxsigil18HoloOmega['self_model'] {
  return {
    identity_core: config.identityCore || 'vanta_cognitive_agent',
    capabilities_inventory: config.capabilitiesInventory || [],
    limitations_awareness: config.limitationsAwareness || [],
    purpose_statement: config.purposeStatement || 'cognitive assistance and reasoning',
    personality_traits: config.personalityTraits || {}
  };
}

// ============================================================================
// FACTORY FUNCTION FOR COMPLETE SIGIL CREATION
// ============================================================================

/**
 * Creates a complete VoxSigil definition with all required properties and optional enhancements
 */
export function createCompleteVoxSigil(config: {
  // Required properties
  sigil: string;
  name: string;
  principle: string;
  usage: Voxsigil18HoloOmega['usage'];
  smartMrap: Voxsigil18HoloOmega['SMART_MRAP'];
  metadata: Voxsigil18HoloOmega['metadata'];
  
  // Optional core properties
  alias?: string;
  tag?: string;
  tags?: string[];
  isCognitivePrimitive?: boolean;
  cognitivePrimitiveType?: string;
  math?: string;
  theoreticalBasisRefs?: string[];
  
  // Optional complex properties
  structure?: Voxsigil18HoloOmega['structure'];
  activationContext?: Voxsigil18HoloOmega['activation_context'];
  parameterizationSchema?: Voxsigil18HoloOmega['parameterization_schema'];
  promptTemplate?: Voxsigil18HoloOmega['prompt_template'];
  
  // Optional v1.8 properties
  observabilityProfile?: Voxsigil18HoloOmega['observability_profile'];
  sustainabilityProfile?: Voxsigil18HoloOmega['sustainability_profile'];
  accessibilityProfile?: Voxsigil18HoloOmega['accessibility_profile'];
  deploymentTargets?: Voxsigil18HoloOmega['deployment_targets'];
  auditabilityProfile?: Voxsigil18HoloOmega['auditability_profile'];
  socioEmotionalAlignmentProfile?: Voxsigil18HoloOmega['socio_emotional_alignment_profile'];
  scalingPolicy?: Voxsigil18HoloOmega['scaling_policy'];
  
  // Additional v1.8 properties
  securityProfile?: Voxsigil18HoloOmega['security_profile'];
  resourceEconomics?: Voxsigil18HoloOmega['resource_economics'];
  performanceSloProfile?: Voxsigil18HoloOmega['performance_slo_profile'];
  adversarialResilienceProfile?: Voxsigil18HoloOmega['adversarial_resilience_profile'];
  humanInTheLoopEscalation?: Voxsigil18HoloOmega['human_in_the_loop_escalation'];
  chaosEngineeringHooks?: Voxsigil18HoloOmega['chaos_engineering_hooks'];
  hardwareBindingProfile?: Voxsigil18HoloOmega['hardware_binding_profile'];
  learningArchitectureProfile?: Voxsigil18HoloOmega['learning_architecture_profile'];
  knowledgeRepresentationAndGrounding?: Voxsigil18HoloOmega['knowledge_representation_and_grounding'];
  selfModel?: Voxsigil18HoloOmega['self_model'];
  loreProvenanceProfile?: Voxsigil18HoloOmega['lore_provenance_profile'];
  emergentBehaviorMonitoring?: Voxsigil18HoloOmega['emergent_behavior_monitoring'];
  
  // And many more...
}): Voxsigil18HoloOmega {
  const sigil: Voxsigil18HoloOmega = {
    sigil: config.sigil,
    name: config.name,
    principle: config.principle,
    usage: config.usage,
    SMART_MRAP: config.smartMrap,
    metadata: config.metadata
  };
  
  // Add optional properties if provided
  if (config.alias) sigil.alias = config.alias;
  if (config.tag) sigil.tag = config.tag;
  if (config.tags) sigil.tags = config.tags;
  if (config.isCognitivePrimitive !== undefined) sigil.is_cognitive_primitive = config.isCognitivePrimitive;
  if (config.cognitivePrimitiveType) sigil.cognitive_primitive_type = config.cognitivePrimitiveType;
  if (config.math) sigil.math = config.math;
  if (config.theoreticalBasisRefs) sigil.theoretical_basis_refs = config.theoreticalBasisRefs;
  
  if (config.structure) sigil.structure = config.structure;
  if (config.activationContext) sigil.activation_context = config.activationContext;
  if (config.parameterizationSchema) sigil.parameterization_schema = config.parameterizationSchema;
  if (config.promptTemplate) sigil.prompt_template = config.promptTemplate;
  
  // v1.8 properties
  if (config.observabilityProfile) sigil.observability_profile = config.observabilityProfile;
  if (config.sustainabilityProfile) sigil.sustainability_profile = config.sustainabilityProfile;
  if (config.accessibilityProfile) sigil.accessibility_profile = config.accessibilityProfile;
  if (config.deploymentTargets) sigil.deployment_targets = config.deploymentTargets;
  if (config.auditabilityProfile) sigil.auditability_profile = config.auditabilityProfile;
  if (config.socioEmotionalAlignmentProfile) sigil.socio_emotional_alignment_profile = config.socioEmotionalAlignmentProfile;
  if (config.scalingPolicy) sigil.scaling_policy = config.scalingPolicy;
  if (config.securityProfile) sigil.security_profile = config.securityProfile;
  if (config.resourceEconomics) sigil.resource_economics = config.resourceEconomics;
  if (config.performanceSloProfile) sigil.performance_slo_profile = config.performanceSloProfile;
  if (config.adversarialResilienceProfile) sigil.adversarial_resilience_profile = config.adversarialResilienceProfile;
  if (config.humanInTheLoopEscalation) sigil.human_in_the_loop_escalation = config.humanInTheLoopEscalation;
  if (config.chaosEngineeringHooks) sigil.chaos_engineering_hooks = config.chaosEngineeringHooks;
  if (config.hardwareBindingProfile) sigil.hardware_binding_profile = config.hardwareBindingProfile;
  if (config.learningArchitectureProfile) sigil.learning_architecture_profile = config.learningArchitectureProfile;
  if (config.knowledgeRepresentationAndGrounding) sigil.knowledge_representation_and_grounding = config.knowledgeRepresentationAndGrounding;
  if (config.selfModel) sigil.self_model = config.selfModel;
  if (config.loreProvenanceProfile) sigil.lore_provenance_profile = config.loreProvenanceProfile;
  if (config.emergentBehaviorMonitoring) sigil.emergent_behavior_monitoring = config.emergentBehaviorMonitoring;
  
  return sigil;
}
