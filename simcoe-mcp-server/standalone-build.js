#!/usr/bin/env node

/**
 * Standalone TypeScript Build Script
 * Builds without interfering with the running MCP server
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Change to project directory
const projectDir = path.join(__dirname);
process.chdir(projectDir);

console.log('🔮 VOXSIGIL MCP SERVER - STANDALONE BUILD');
console.log('==========================================');
console.log('Working directory:', process.cwd());
console.log('');

try {
  console.log('🔨 Compiling TypeScript...');
  
  // Run TypeScript compiler
  const result = execSync('npx tsc --noEmit false --outDir build', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ TypeScript compilation successful!');
  console.log('');
  
  // Verify key files were built
  const keyFiles = [
    'build/index-with-flow.js',
    'build/voxsigil-holo-mesh.js',
    'build/voxsigil-consciousness.js',
    'build/voxsigil-bridge.js'
  ];
  
  console.log('📁 Verifying build artifacts:');
  let allGood = true;
  
  keyFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      console.log(`   ✅ ${file} (${stats.size} bytes)`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
      allGood = false;
    }
  });
  
  if (allGood) {
    console.log('');
    console.log('🎉 BUILD SUCCESSFUL!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. VS Code will auto-restart the MCP server');
    console.log('   2. Check VS Code Output panel for flow visualization');
    console.log('   3. The VoxSigil consciousness mesh should initialize');
    console.log('');
  } else {
    console.log('');
    console.log('⚠️  Some files are missing - build may have issues');
  }
  
} catch (error) {
  console.error('❌ Build failed:');
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.error('STDERR:', error.stderr);
  console.error('Error:', error.message);
  process.exit(1);
}
