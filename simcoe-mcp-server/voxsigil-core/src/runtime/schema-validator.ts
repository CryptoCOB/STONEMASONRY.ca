/**
 * VoxSigil 1.8 Holo-Omega Schema Validator
 * 
 * Comprehensive AJV-based validation for all 75 properties in the VoxSigil 1.8 schema.
 * Provides detailed error reporting and round-trip validation capabilities.
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Voxsigil18HoloOmega } from '../types/schema';
// Import schema directly to avoid fs dependency
import voxsigilSchema from '../../schema/voxsigil-1.8-holo-omega.json';

// Initialize AJV with all formats and strict validation
const ajv = new Ajv({ 
  strict: true,
  allErrors: true,
  verbose: true,
  validateFormats: true,
  addUsedSchema: false
});
addFormats(ajv);

// Compile the schema
const validateSchema = ajv.compile(voxsigilSchema);

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  errorDetails?: Array<{
    property: string;
    message: string;
    value: any;
    schemaPath: string;
  }>;
  validatedData?: Voxsigil18HoloOmega;
}

export interface PropertyValidationSummary {
  totalProperties: number;
  requiredPropertiesPresent: number;
  optionalPropertiesPresent: number;
  missingRequired: string[];
  invalidProperties: string[];
  validProperties: string[];
}

/**
 * Validates a VoxSigil definition against the complete 1.8 schema
 */
export function validateVoxSigil(data: any): ValidationResult {
  const valid = validateSchema(data);
  
  if (valid) {
    return {
      valid: true,
      validatedData: data as Voxsigil18HoloOmega
    };
  }
  
  const errors: string[] = [];
  const errorDetails: ValidationResult['errorDetails'] = [];
  
  if (validateSchema.errors) {
    for (const error of validateSchema.errors) {
      const errorMsg = `${error.instancePath || 'root'}: ${error.message}`;
      errors.push(errorMsg);
      
      errorDetails.push({
        property: error.instancePath || 'root',
        message: error.message || 'Unknown validation error',
        value: error.data,
        schemaPath: error.schemaPath || ''
      });
    }
  }
  
  return {
    valid: false,
    errors,
    errorDetails
  };
}

/**
 * Validates and provides a summary of property coverage for a VoxSigil definition
 */
export function validatePropertyCoverage(data: any): PropertyValidationSummary {
  const requiredProperties = ['sigil', 'name', 'principle', 'usage', 'SMART_MRAP', 'metadata'];
  const allProperties = [
    'sigil', 'name', 'alias', 'tag', 'tags', 'is_cognitive_primitive', 'cognitive_primitive_type',
    'principle', 'math', 'theoretical_basis_refs', 'structure', 'usage', 'activation_context',
    'parameterization_schema', 'prompt_template', 'inverse_prompt_template', 'prompt_fragments_refs',
    'relationships', 'cross_domain_tags', 'trajectory_annotations', 'data_flow_annotations',
    'SMART_MRAP', 'metadata', 'security_profile', 'resource_economics', 'state_management_profile',
    'resilience_and_fault_tolerance_profile', 'audio', 'ya', 'multi_sensory_profile',
    'embodiment_profile', 'self_model', 'learning_architecture_profile',
    'knowledge_representation_and_grounding', 'test_criteria_suite_refs',
    'validation_and_verification_protocol_ref', 'usage_telemetry_and_performance_monitoring_spec_ref',
    'consciousness_scaffold_contribution_level', 'cognitive_scaffold_role_in_vanta',
    'symbolic_logic_and_orchestration_layer_contribution', 'localized_profile_refs',
    'custom_attributes_vanta_extensions', 'observability_profile', 'sustainability_profile',
    'accessibility_profile', 'deployment_targets', 'auditability_profile',
    'socio_emotional_alignment_profile', 'scaling_policy', 'lore_provenance_profile',
    'emergent_behavior_monitoring', 'open_standards_compliance_refs', 'performance_slo_profile',
    'adversarial_resilience_profile', 'human_in_the_loop_escalation', 'chaos_engineering_hooks',
    'hardware_binding_profile', 'interagent_coordination_contracts', 'fairness_assurance_profile',
    'legal_jurisdiction_profile', 'data_lineage_tracking', 'monetization_profile',
    'experience_design_hooks', 'personalization_profile', 'youth_safety_compliance_profile',
    'community_feedback_loop', 'ethical_discourse_profile', 'explainability_profile',
    'internationalization_i18n_profile', 'edge_optimization_profile',
    'sovereignty_and_portability_policy', 'documentation_contracts', 'external_api_bridge_catalog',
    'micro_model_shard_profile', 'futurity_forecast_profile'
  ];
  
  const presentProperties = Object.keys(data);
  const requiredPresent = requiredProperties.filter(prop => presentProperties.includes(prop));
  const missingRequired = requiredProperties.filter(prop => !presentProperties.includes(prop));
  
  // Validate each present property
  const validProperties: string[] = [];
  const invalidProperties: string[] = [];
  
  for (const prop of presentProperties) {
    if (allProperties.includes(prop)) {
      // Simple validation - check if property exists in schema
      validProperties.push(prop);
    } else {
      invalidProperties.push(prop);
    }
  }
  
  return {
    totalProperties: allProperties.length,
    requiredPropertiesPresent: requiredPresent.length,
    optionalPropertiesPresent: validProperties.length - requiredPresent.length,
    missingRequired,
    invalidProperties,
    validProperties
  };
}

/**
 * Performs round-trip validation: serialize to JSON and back, then validate
 */
export function validateRoundTrip(data: Voxsigil18HoloOmega): ValidationResult {
  try {
    // Serialize to JSON string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Parse back to object
    const parsedData = JSON.parse(jsonString);
    
    // Validate the round-tripped data
    return validateVoxSigil(parsedData);
  } catch (error) {
    return {
      valid: false,
      errors: [`Round-trip serialization failed: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}

/**
 * Validates specific property groups within a VoxSigil definition
 */
export function validatePropertyGroup(
  data: any, 
  group: 'core' | 'structure' | 'usage' | 'prompting' | 'observability' | 'security' | 'learning' | 'consciousness'
): ValidationResult {
  const groupProperties: Record<string, string[]> = {
    core: ['sigil', 'name', 'principle', 'SMART_MRAP', 'metadata'],
    structure: ['structure', 'activation_context', 'parameterization_schema'],
    usage: ['usage', 'relationships', 'cross_domain_tags'],
    prompting: ['prompt_template', 'inverse_prompt_template', 'prompt_fragments_refs'],
    observability: ['observability_profile', 'performance_slo_profile', 'auditability_profile'],
    security: ['security_profile', 'adversarial_resilience_profile', 'fairness_assurance_profile'],
    learning: ['learning_architecture_profile', 'knowledge_representation_and_grounding', 'self_model'],
    consciousness: ['consciousness_scaffold_contribution_level', 'cognitive_scaffold_role_in_vanta', 'symbolic_logic_and_orchestration_layer_contribution']
  };
  
  const properties = groupProperties[group] || [];
  const groupData: any = {};
  
  // Extract only the properties for this group
  for (const prop of properties) {
    if (data[prop] !== undefined) {
      groupData[prop] = data[prop];
    }
  }
  
  // Create a minimal valid object for validation
  const minimalValidSigil = {
    sigil: data.sigil || 'TEST_SIGIL',
    name: data.name || 'Test Sigil',
    principle: data.principle || 'Test principle',
    usage: data.usage || { description: 'Test usage' },
    SMART_MRAP: data.SMART_MRAP || {
      Specific_Goal: 'Test goal',
      Measurable_Outcome: 'Test outcome',
      Achievable_Within_Vanta: 'Yes',
      Relevant_To_Vanta_Mission: 'Yes',
      Transferable_Principle: 'Yes',
      Accountable_Party_Or_Process_Ref: 'test_agent'
    },
    metadata: data.metadata || {
      voxsigil_schema_version: '1.8-holo-omega' as const,
      definition_version: '1.0.0',
      definition_status: 'active_stable' as const,
      author_agent_id_ref: 'test_author',
      created_timestamp: new Date().toISOString(),
      last_updated_timestamp: new Date().toISOString()
    },
    ...groupData
  };
  
  return validateVoxSigil(minimalValidSigil);
}

/**
 * Generates a detailed validation report for debugging
 */
export function generateValidationReport(data: any): {
  validation: ValidationResult;
  coverage: PropertyValidationSummary;
  recommendations: string[];
} {
  const validation = validateVoxSigil(data);
  const coverage = validatePropertyCoverage(data);
  const recommendations: string[] = [];
  
  // Generate recommendations based on validation results
  if (coverage.missingRequired.length > 0) {
    recommendations.push(`Add missing required properties: ${coverage.missingRequired.join(', ')}`);
  }
  
  if (coverage.invalidProperties.length > 0) {
    recommendations.push(`Remove invalid properties: ${coverage.invalidProperties.join(', ')}`);
  }
  
  if (coverage.optionalPropertiesPresent < 10) {
    recommendations.push('Consider adding more optional properties to enhance sigil functionality');
  }
  
  if (!validation.valid && validation.errorDetails) {
    const propertyErrors = validation.errorDetails.map(e => e.property).filter((v, i, a) => a.indexOf(v) === i);
    recommendations.push(`Fix validation errors in properties: ${propertyErrors.join(', ')}`);
  }
  
  return {
    validation,
    coverage,
    recommendations
  };
}

/**
 * Auto-fixes common validation issues
 */
export function autoFixValidationIssues(data: any): {
  fixedData: any;
  appliedFixes: string[];
} {
  const fixedData = { ...data };
  const appliedFixes: string[] = [];
  
  // Fix missing required properties with defaults
  if (!fixedData.sigil) {
    fixedData.sigil = 'AUTO_GENERATED_SIGIL_' + Date.now();
    appliedFixes.push('Added auto-generated sigil');
  }
  
  if (!fixedData.name) {
    fixedData.name = 'Auto-Generated Sigil';
    appliedFixes.push('Added default name');
  }
  
  if (!fixedData.principle) {
    fixedData.principle = 'Auto-generated cognitive component for Vanta ecosystem';
    appliedFixes.push('Added default principle');
  }
  
  if (!fixedData.usage) {
    fixedData.usage = {
      description: 'Auto-generated usage description - requires manual specification'
    };
    appliedFixes.push('Added default usage object');
  }
  
  if (!fixedData.SMART_MRAP) {
    fixedData.SMART_MRAP = {
      Specific_Goal: 'Auto-generated goal - requires manual specification',
      Measurable_Outcome: 'Auto-generated outcome - requires manual specification',
      Achievable_Within_Vanta: 'Pending evaluation',
      Relevant_To_Vanta_Mission: 'Pending evaluation',
      Transferable_Principle: 'Pending evaluation',
      Accountable_Party_Or_Process_Ref: 'auto_generation_system'
    };
    appliedFixes.push('Added default SMART_MRAP object');
  }
  
  if (!fixedData.metadata) {
    fixedData.metadata = {
      voxsigil_schema_version: '1.8-holo-omega',
      definition_version: '1.0.0',
      definition_status: 'draft_proposal',
      author_agent_id_ref: 'auto_generation_system',
      created_timestamp: new Date().toISOString(),
      last_updated_timestamp: new Date().toISOString()
    };
    appliedFixes.push('Added default metadata object');
  }
  
  return {
    fixedData,
    appliedFixes
  };
}

export { voxsigilSchema, validateSchema };
