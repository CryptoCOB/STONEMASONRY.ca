/**
 * Direct LM Studio Model Query
 */

async function queryModels() {
  try {
    console.log('🔍 Querying LM Studio models directly...\n');
    
    const response = await fetch('http://localhost:1234/v1/models');
    const data = await response.json();
    
    console.log('📊 **LM STUDIO MODEL INVENTORY**');
    console.log('==================================================\n');
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`Total Models Available: ${data.data.length}\n`);
      
      data.data.forEach((model, index) => {
        console.log(`${index + 1}. ${model.id}`);
        if (model.owned_by) console.log(`   Owner: ${model.owned_by}`);
        if (model.created) console.log(`   Created: ${new Date(model.created * 1000).toLocaleDateString()}`);
        console.log('');
      });
      
      // Analyze model types
      const modelTypes = {
        small: data.data.filter(m => m.id.includes('3b') || m.id.includes('1b')),
        medium: data.data.filter(m => m.id.includes('7b') || m.id.includes('8b')),
        large: data.data.filter(m => m.id.includes('13b') || m.id.includes('30b') || m.id.includes('70b')),
        coding: data.data.filter(m => m.id.toLowerCase().includes('code') || m.id.toLowerCase().includes('deepseek')),
        instruct: data.data.filter(m => m.id.toLowerCase().includes('instruct')),
        chat: data.data.filter(m => m.id.toLowerCase().includes('chat'))
      };
      
      console.log('📈 **MODEL CATEGORIZATION**');
      console.log('==================================================');
      console.log(`Small Models (1B-3B): ${modelTypes.small.length}`);
      modelTypes.small.forEach(m => console.log(`  • ${m.id}`));
      
      console.log(`\nMedium Models (7B-8B): ${modelTypes.medium.length}`);
      modelTypes.medium.forEach(m => console.log(`  • ${m.id}`));
      
      console.log(`\nLarge Models (13B+): ${modelTypes.large.length}`);
      modelTypes.large.forEach(m => console.log(`  • ${m.id}`));
      
      console.log(`\nCoding Models: ${modelTypes.coding.length}`);
      modelTypes.coding.forEach(m => console.log(`  • ${m.id}`));
      
      console.log(`\nInstruct Models: ${modelTypes.instruct.length}`);
      modelTypes.instruct.forEach(m => console.log(`  • ${m.id}`));
      
    } else {
      console.log('❌ No models found or invalid response format');
    }
    
  } catch (error) {
    console.error('❌ Error querying LM Studio:', error.message);
  }
}

queryModels();
