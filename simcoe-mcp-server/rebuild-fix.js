#!/usr/bin/env node

/**
 * VoxSigil MCP Server Rebuild Script
 * Rebuilds TypeScript and provides status
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectDir = 'c:\\Users\\16479\\Desktop\\Simcoe Stone\\voxsigil-mcp-server';

console.log('🔮 ═══════════════════════════════════════════════════════════════════');
console.log('   VOXSIGIL MCP SERVER - REBUILD SCRIPT');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

try {
  console.log('🔨 Building TypeScript...');
  process.chdir(projectDir);
  
  const buildOutput = execSync('npx tsc', { encoding: 'utf8', stdio: 'pipe' });
  
  console.log('✅ TypeScript build successful!');
  console.log('');
  
  // Check if the main files were built
  const mainFiles = [
    'build/index-with-flow.js',
    'build/voxsigil-holo-mesh.js',
    'build/voxsigil-bridge.js'
  ];
  
  console.log('📁 Checking build artifacts...');
  mainFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MISSING`);
    }
  });
  
  console.log('');
  console.log('🔄 NOTE: MCP server will automatically restart in VS Code');
  console.log('    Check VS Code Output panel for flow visualization logs');
  console.log('');
  console.log('✅ Rebuild complete!');
  
} catch (error) {
  console.error('❌ Build failed:');
  console.error(error.message);
  process.exit(1);
}
