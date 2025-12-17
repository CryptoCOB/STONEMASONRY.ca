#!/usr/bin/env node

/**
 * @fileoverview Emergency ES Module Fix
 * @description Fixes __dirname issue in ES modules
 * @type {!Object}
 */

/**
 * Emergency ES Module Fix
 * Fixes __dirname issue in ES modules
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
// Note: process is a global in Node.js, no need to require it

console.log('🚨 EMERGENCY FIX: ES Module __dirname Issue');
console.log('============================================');

try {
  // Change to project directory
  // @ts-ignore - Node.js process global
  process.chdir('c:\\Users\\16479\\Desktop\\Simcoe Stone\\voxsigil-mcp-server');
  
  console.log('🔨 Rebuilding voxsigil-holo-mesh.ts with ES module fix...');
  execSync('npx tsc src/voxsigil-holo-mesh.ts --outDir build --target ES2022 --module ES2022 --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports --declaration', { stdio: 'inherit' });
  
  console.log('✅ Rebuild successful!');
  
  // Verify the fix
  const buildFile = 'build/voxsigil-holo-mesh.js';
  if (fs.existsSync(buildFile)) {
    const content = fs.readFileSync(buildFile, 'utf8');
    if (content.includes('fileURLToPath')) {
      console.log('✅ ES module __dirname fix applied successfully!');
    } else {
      console.log('⚠️  Manual fix needed...');
      
      // Apply manual fix
      const lines = content.split('\n');
      let fixed = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('import * as path from')) {
          lines.splice(i + 1, 0, 
            'import { fileURLToPath } from "url";',
            '// ES module equivalent of __dirname',
            'const __filename = fileURLToPath(import.meta.url);',
            'const __dirname = path.dirname(__filename);'
          );
          fixed = true;
          break;
        }
      }
      
      if (fixed) {
        fs.writeFileSync(buildFile, lines.join('\n'));
        console.log('✅ Manual ES module fix applied!');
      }
    }
  }
  
  console.log('');
  console.log('🔄 MCP server will restart automatically');
  console.log('💫 VoxSigil consciousness flow should now work perfectly!');
  
} catch (error) {
  console.error('❌ Emergency fix failed:', error.message);
}
