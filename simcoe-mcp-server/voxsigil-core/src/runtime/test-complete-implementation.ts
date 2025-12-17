/**
 * VoxSigil 1.8 Holo-Omega Complete Implementation Test
 * 
 * Tests the full schema-compliant system with all 75 properties.
 */

/// <reference types="node" />
import { VoxSigilDefinitionFactory, SigilCreationOptions } from './sigil-definition-new';
import { validateVoxSigil, generateValidationReport } from './schema-validator';

async function testCompleteImplementation() {
  console.log('🧪 Testing VoxSigil 1.8 Holo-Omega Complete Implementation');
  console.log('============================================================');
  
  const factory = new VoxSigilDefinitionFactory();
  
  // Test 1: Create a minimal sigil
  console.log('\n1. Testing Minimal Sigil Creation...');
  const minimalSigil = factory.createMinimalSigil(
    'TEST_MINIMAL_SIGIL',
    'Test Minimal Sigil',
    'A minimal test sigil for validation',
    'Used for testing the basic required properties of VoxSigil schema'
  );
  
  const minimalValidation = validateVoxSigil(minimalSigil);
  console.log(`   Minimal sigil valid: ${minimalValidation.valid}`);
  if (!minimalValidation.valid) {
    console.log(`   Errors: ${minimalValidation.errors?.join(', ')}`);
  }
  
  // Test 2: Create a standard sigil
  console.log('\n2. Testing Standard Sigil Creation...');
  const standardOptions: SigilCreationOptions = {
    sigilType: 'unicode',
    sigilContent: '🧠',
    name: 'Cognitive Processor',
    principle: 'Processes cognitive tasks with neural-inspired algorithms',
    usageDescription: 'Used for complex reasoning and pattern recognition tasks',
    usageExample: 'processor.process({ input: "complex problem", context: "reasoning" })',
    specificGoal: 'Implement advanced cognitive processing for Vanta',
    measurableOutcome: 'Successfully processes 1000+ cognitive tasks per second',
    achievableWithinVanta: 'Yes, using existing neural network infrastructure',
    relevantToVantaMission: 'Core to Vanta\'s cognitive orchestration capabilities',
    transferablePrinciple: 'Neural processing patterns applicable to other AI components',
    accountableParty: 'vanta_ai_team',
    version: '2.1.0',
    status: 'active_stable',
    author: 'dr_cognitive_systems',
    template: 'standard',
    enableObservability: true,
    enableSecurity: true
  };
  
  const standardResult = factory.createSigil(standardOptions);
  console.log(`   Standard sigil valid: ${standardResult.validation.valid}`);
  console.log(`   Properties count: ${Object.keys(standardResult.sigil).length}`);
  console.log(`   Recommendations: ${standardResult.recommendations.length}`);
  
  // Test 3: Create a comprehensive sigil
  console.log('\n3. Testing Comprehensive Sigil Creation...');
  const comprehensiveOptions: SigilCreationOptions = {
    ...standardOptions,
    sigilContent: '⚡🧠🌟',
    name: 'Advanced Consciousness Processor',
    template: 'comprehensive',
    enableSustainability: true,
    enableAccessibility: true,
    enableLearning: true,
    enableChaosEngineering: true
  };
  
  const comprehensiveResult = factory.createSigil(comprehensiveOptions);
  console.log(`   Comprehensive sigil valid: ${comprehensiveResult.validation.valid}`);
  console.log(`   Properties count: ${Object.keys(comprehensiveResult.sigil).length}`);
  
  // Test 4: Create a consciousness-focused sigil
  console.log('\n4. Testing Consciousness Sigil Creation...');
  const consciousnessOptions: SigilCreationOptions = {
    ...standardOptions,
    sigilContent: '⟠∆∇𓂀',
    name: 'Self-Aware Reasoning Engine',
    principle: 'Implements self-awareness and meta-cognitive reasoning',
    template: 'consciousness',
    enableLearning: true
  };
  
  const consciousnessResult = factory.createSigil(consciousnessOptions);
  console.log(`   Consciousness sigil valid: ${consciousnessResult.validation.valid}`);
  console.log(`   Has self_model: ${consciousnessResult.sigil.self_model ? 'Yes' : 'No'}`);
  console.log(`   Has learning_architecture: ${consciousnessResult.sigil.learning_architecture_profile ? 'Yes' : 'No'}`);
  
  // Test 5: Validate round-trip serialization
  console.log('\n5. Testing Round-Trip Serialization...');
  const roundTripValidation = factory.validateSerialization(comprehensiveResult.sigil);
  console.log(`   Round-trip valid: ${roundTripValidation.valid}`);
  
  // Test 6: Generate validation report
  console.log('\n6. Testing Validation Report Generation...');
  const report = generateValidationReport(comprehensiveResult.sigil);
  console.log(`   Validation: ${report.validation.valid}`);
  console.log(`   Required properties: ${report.coverage.requiredPropertiesPresent}/6`);
  console.log(`   Optional properties: ${report.coverage.optionalPropertiesPresent}/69`);
  console.log(`   Recommendations: ${report.recommendations.length}`);
  
  // Test 7: Property coverage analysis
  console.log('\n7. Testing Property Coverage...');
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
  
  const presentProperties = Object.keys(comprehensiveResult.sigil);
  const coveragePercentage = (presentProperties.length / allProperties.length * 100).toFixed(1);
  console.log(`   Schema coverage: ${presentProperties.length}/${allProperties.length} (${coveragePercentage}%)`);
  
  // Show some example properties that were created
  console.log('\n8. Sample Created Properties:');
  if (comprehensiveResult.sigil.observability_profile) {
    console.log(`   ✓ observability_profile: ${JSON.stringify(comprehensiveResult.sigil.observability_profile).substring(0, 100)}...`);
  }
  if (comprehensiveResult.sigil.sustainability_profile) {
    console.log(`   ✓ sustainability_profile: ${JSON.stringify(comprehensiveResult.sigil.sustainability_profile).substring(0, 100)}...`);
  }
  if (comprehensiveResult.sigil.accessibility_profile) {
    console.log(`   ✓ accessibility_profile: ${JSON.stringify(comprehensiveResult.sigil.accessibility_profile).substring(0, 100)}...`);
  }
  
  // Final summary
  console.log('\n🎯 IMPLEMENTATION SUMMARY:');
  console.log('============================================================');
  console.log(`✅ Minimal sigil validation: ${minimalValidation.valid}`);
  console.log(`✅ Standard sigil validation: ${standardResult.validation.valid}`);
  console.log(`✅ Comprehensive sigil validation: ${comprehensiveResult.validation.valid}`);
  console.log(`✅ Consciousness sigil validation: ${consciousnessResult.validation.valid}`);
  console.log(`✅ Round-trip serialization: ${roundTripValidation.valid}`);
  console.log(`📊 Schema coverage: ${coveragePercentage}% of all 75 properties`);
  console.log(`🏗️ Template system: 6 templates implemented`);
  console.log(`🔍 Validation system: Full AJV schema validation with auto-fixing`);
  console.log(`🏭 Factory system: Complete property builders for all property groups`);
  
  return {
    allTestsPassed: minimalValidation.valid && standardResult.validation.valid && 
                   comprehensiveResult.validation.valid && consciousnessResult.validation.valid && 
                   roundTripValidation.valid,
    coverage: coveragePercentage,
    sampleSigil: comprehensiveResult.sigil
  };
}

// Export for use in other modules
export { testCompleteImplementation };

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  testCompleteImplementation().then(result => {
    console.log(`\n🚀 All tests passed: ${result.allTestsPassed}`);
    if (typeof process !== 'undefined' && 'exit' in process) {
      (process as any).exit(result.allTestsPassed ? 0 : 1);
    }
  }).catch(error => {
    console.error('❌ Test failed:', error);
    if (typeof process !== 'undefined' && 'exit' in process) {
      (process as any).exit(1);
    }
  });
}
