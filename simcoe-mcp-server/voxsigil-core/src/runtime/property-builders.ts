/**
 * VoxSigil 1.8 Holo-Omega Property Builders
 * 
 * This module provides factory functions for building each of the 75 properties
 * defined in the VoxSigil 1.8 schema. Each builder creates valid, schema-compliant
 * property values based on the actual schema requirements.
 */

import { Voxsigil18HoloOmega } from '../types/schema';

// ============================================================================
// REQUIRED PROPERTY BUILDERS (6 properties)
// ============================================================================

/**
 * Creates a globally unique sigil identifier
 */
export function createSigil(type: 'unicode' | 'pglyph' | 'ascii', content: string): string {
  switch (type) {
    case 'unicode':
      return content; // e.g., '🔮', '⚡', '🌟'
    case 'pglyph':
      return content; // e.g., '⟠∆∇𓂀', '◊◈◉', '⧬⧭⧮'
    case 'ascii':
      return content.toUpperCase().replace(/\s+/g, '_'); // e.g., 'VANTA_CORE_REASONER_V4.0'
    default:
      throw new Error(`Invalid sigil type: ${type}`);
  }
}

/**
 * Creates a canonical human-readable name
 */
export function createName(baseName: string, variant?: string): string {
  return variant ? `${baseName} ${variant}` : baseName;
}

/**
 * Creates the core principle/essence description
 */
export function createPrinciple(domain: string, essence: string, purpose: string): string {
  return `${domain}: ${essence}. ${purpose}`;
}

/**
 * Creates the usage object (required)
 */
export function createUsage(
  description: string,
  example?: string | { [k: string]: unknown },
  explanation?: string,
  apiEndpoint?: string
): Voxsigil18HoloOmega['usage'] {
  const usage: Voxsigil18HoloOmega['usage'] = {
    description
  };
  
  if (example !== undefined) usage.example = example;
  if (explanation) usage.explanation = explanation;
  if (apiEndpoint) usage.api_endpoint_and_schema_ref = apiEndpoint;
  
  return usage;
}

/**
 * Creates the SMART_MRAP object (required)
 * SMART: Specific, Measurable, Achievable, Relevant, Transferable
 * Accountability: Party or Process Reference
 */
export function createSMART_MRAP(
  specificGoal: string,
  measurableOutcome: string,
  achievableWithinVanta: string,
  relevantToVantaMission: string,
  transferablePrinciple: string,
  accountablePartyOrProcessRef: string
): Voxsigil18HoloOmega['SMART_MRAP'] {
  return {
    Specific_Goal: specificGoal,
    Measurable_Outcome: measurableOutcome,
    Achievable_Within_Vanta: achievableWithinVanta,
    Relevant_To_Vanta_Mission: relevantToVantaMission,
    Transferable_Principle: transferablePrinciple,
    Accountable_Party_Or_Process_Ref: accountablePartyOrProcessRef
  };
}

/**
 * Creates the metadata object (required)
 */
export function createMetadata(
  definitionVersion: string,
  definitionStatus: 'draft_proposal' | 'under_vanta_review' | 'active_stable' | 'active_experimental' | 'deprecated_phasing_out' | 'archived_historical' | 'vanta_core_primitive' | 'community_extension_pending_integration',
  authorAgentIdRef: string,
  created?: string,
  lastModified?: string
): Voxsigil18HoloOmega['metadata'] {
  const now = new Date().toISOString();
  return {
    voxsigil_schema_version: '1.8-holo-omega',
    definition_version: definitionVersion,
    definition_status: definitionStatus,
    author_agent_id_ref: authorAgentIdRef,
    created_timestamp: created || now,
    last_updated_timestamp: lastModified || now
  };
}

// ============================================================================
// STRUCTURE PROPERTY BUILDERS
// ============================================================================

/**
 * Creates a structure object for composite sigils
 */
export function createStructure(
  compositeType: 'sequential' | 'hierarchical' | 'parallel' | 'conditional' | 'recursive' | 'network' | 'fusion' | 'assembly' | 'collection' | 'state_machine' | 'event_driven_orchestration' | 'data_processing_pipeline' | 'feedback_control_loop',
  components: Array<{
    name: string;
    description: string;
    sigil_ref?: string;
    component_type_tag?: string;
    parameters_override_json?: string;
    initialization_sequence_order?: number;
  }>,
  temporalStructure?: 'static_config' | 'sequential_phased_execution' | 'parallel_concurrent_tracks' | 'closed_feedback_loop' | 'open_feedback_loop' | 'oscillatory_dynamic' | 'event_triggered_sequence' | 'continuous_streaming_process' | 'adaptive_temporal_scaling'
): Voxsigil18HoloOmega['structure'] {
  const structure: Voxsigil18HoloOmega['structure'] = {
    composite_type: compositeType,
    components
  };
  
  if (temporalStructure) {
    structure.temporal_structure = temporalStructure;
  }
  
  return structure;
}

// ============================================================================
// ACTIVATION CONTEXT BUILDERS
// ============================================================================

/**
 * Creates activation context for conditional sigil execution
 */
export function createActivationContext(config: {
  triggeringEvents?: string[];
  preconditions?: string[];
  requiredCapabilitiesSelf?: string[];
  requiredCapabilitiesActivator?: string[];
  supportedInputModalities?: Array<'text_structured' | 'text_natural_language' | 'audio_speech_transcribed' | 'audio_ambient_features' | 'image_raw' | 'image_semantic_segments' | 'video_stream_raw' | 'video_object_tracking' | 'haptic_signal_encoded' | 'olfactory_cue_signature' | 'symbolic_data_stream' | 'physiological_data_timeseries' | 'programmatic_api_call' | 'multi_modal_fused_embedding' | 'vanta_event_bus_message'>;
  supportedOutputModalities?: Array<'text_formatted_report' | 'text_natural_dialogue' | 'generated_speech_synthesized' | 'spatial_audio_ambisonic' | 'image_generated_static' | 'video_generated_stream' | 'haptic_feedback_pattern_id' | 'olfactory_release_command' | 'symbolic_data_structure' | 'programmatic_api_response' | 'multi_modal_fused_output' | 'vanta_orchestration_command'>;
  contraindications?: string[];
  priorityLogic?: string;
}): Voxsigil18HoloOmega['activation_context'] {
  const context: Voxsigil18HoloOmega['activation_context'] = {};
  
  if (config.triggeringEvents) context.triggering_events_or_conditions = config.triggeringEvents;
  if (config.preconditions) context.preconditions_state_refs = config.preconditions;
  if (config.requiredCapabilitiesSelf) context.required_capabilities_self = config.requiredCapabilitiesSelf;
  if (config.requiredCapabilitiesActivator) context.required_capabilities_activator = config.requiredCapabilitiesActivator;
  if (config.supportedInputModalities) context.supported_modalities_input = config.supportedInputModalities;
  if (config.supportedOutputModalities) context.supported_modalities_output = config.supportedOutputModalities;
  if (config.contraindications) context.contraindications_or_failure_modes = config.contraindications;
  if (config.priorityLogic) context.activation_priority_logic = config.priorityLogic;
  
  return context;
}

// ============================================================================
// PARAMETERIZATION SCHEMA BUILDERS
// ============================================================================

/**
 * Creates parameterization schema for configurable sigils
 */
export function createParameterizationSchema(
  parameters: Array<{
    name: string;
    type: 'string' | 'number' | 'integer' | 'boolean' | 'enum' | 'sigil_ref' | 'json_object_stringified' | 'array_of_strings' | 'array_of_numbers' | 'data_stream_id_ref' | 'regex_pattern_string' | 'vanta_policy_ref';
    description: string;
    defaultValue?: any;
    allowedValues?: any[];
    constraints?: {
      min?: number;
      max?: number;
      pattern?: string;
      required?: boolean;
    };
  }>
): Voxsigil18HoloOmega['parameterization_schema'] {
  return {
    parameters: parameters.map(param => ({
      name: param.name,
      type: param.type,
      description: param.description,
      ...(param.defaultValue !== undefined && { default_value: param.defaultValue }),
      ...(param.allowedValues && { allowed_values_or_refs: param.allowedValues }),
      ...(param.constraints && { constraints: param.constraints })
    }))
  };
}

// ============================================================================
// PROMPT TEMPLATE BUILDERS
// ============================================================================

/**
 * Creates prompt templates for LLM interaction
 */
export function createPromptTemplate(
  content: string,
  role?: 'system_orchestrator' | 'user_simulator' | 'assistant_core_logic' | 'tool_input_formatter' | 'tool_output_parser' | 'internal_reflector',
  executionMode?: 'command_dispatch' | 'query_resolution' | 'reflective_analysis' | 'emergent_simulation' | 'task_decomposition' | 'data_transformation' | 'creative_generation' | 'critical_evaluation' | 'information_extraction' | 'instruction_following' | 'tool_invocation_request' | 'dialogue_continuation' | 'world_interaction_simulation_step' | 'self_correction_suggestion',
  variables?: Array<{
    name: string;
    type: string;
    description: string;
    defaultValue?: string;
  }>
): Voxsigil18HoloOmega['prompt_template'] {
  const template: Voxsigil18HoloOmega['prompt_template'] = {
    definition_type: 'inline_definition',
    content
  };
  
  if (role) template.role = role;
  if (executionMode) template.execution_mode = executionMode;
  if (variables) template.variables = variables;
  
  return template;
}

// ============================================================================
// OBSERVABILITY PROFILE BUILDERS (v1.8)
// ============================================================================

/**
 * Creates observability profile for monitoring and debugging
 */
export function createObservabilityProfile(config: {
  metricsEndpoints?: string[];
  logFormat?: 'json' | 'text' | 'structured';
  traceIdPropagation?: boolean;
  eventSourcingEnabled?: boolean;
  debugModeHooks?: string[];
  performanceProfilingLevel?: 'none' | 'basic' | 'detailed' | 'full';
}): Voxsigil18HoloOmega['observability_profile'] {
  return {
    metrics_endpoints: config.metricsEndpoints || [],
    log_format: config.logFormat || 'json',
    trace_id_propagation: config.traceIdPropagation || false,
    event_sourcing_enabled: config.eventSourcingEnabled || false,
    debug_mode_hooks: config.debugModeHooks || [],
    performance_profiling_level: config.performanceProfilingLevel || 'basic'
  };
}

// ============================================================================
// SECURITY PROFILE BUILDERS (v1.7)
// ============================================================================

/**
 * Creates security profile for access control and threat protection
 */
export function createSecurityProfile(config: {
  accessControlPolicy?: string;
  encryptionRequirements?: string[];
  auditLoggingLevel?: 'none' | 'basic' | 'detailed' | 'comprehensive';
  threatModelingRefs?: string[];
  securityTestSuiteRefs?: string[];
}): Voxsigil18HoloOmega['security_profile'] {
  return {
    access_control_policy: config.accessControlPolicy || 'default_vanta_rbac',
    encryption_requirements: config.encryptionRequirements || [],
    audit_logging_level: config.auditLoggingLevel || 'basic',
    threat_modeling_refs: config.threatModelingRefs || [],
    security_test_suite_refs: config.securityTestSuiteRefs || []
  };
}

// ============================================================================
// RESOURCE ECONOMICS BUILDERS (v1.7)
// ============================================================================

/**
 * Creates resource economics profile for computational and economic planning
 */
export function createResourceEconomics(config: {
  computationalComplexity?: string;
  memoryFootprint?: string;
  networkBandwidthRequirements?: string;
  costModelRef?: string;
  scalingCharacteristics?: string;
}): Voxsigil18HoloOmega['resource_economics'] {
  return {
    computational_complexity: config.computationalComplexity || 'O(1)',
    memory_footprint: config.memoryFootprint || 'minimal',
    network_bandwidth_requirements: config.networkBandwidthRequirements || 'low',
    cost_model_ref: config.costModelRef,
    scaling_characteristics: config.scalingCharacteristics || 'linear'
  };
}
