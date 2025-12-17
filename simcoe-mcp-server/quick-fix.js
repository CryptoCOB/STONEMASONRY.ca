#!/usr/bin/env node

/**
 * Quick Fix Build - Apply Python Path Fix
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 QUICK FIX: Applying Python path correction...');
console.log('');

try {
  // Change to project directory
  process.chdir('c:\\Users\\16479\\Desktop\\Simcoe Stone\\voxsigil-mcp-server');
  
  // Just compile the holo-mesh file
  console.log('🔨 Compiling voxsigil-holo-mesh.ts...');
  execSync('npx tsc src/voxsigil-holo-mesh.ts --outDir build --target ES2022 --module ES2022 --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports', { stdio: 'inherit' });
  
  // Check if the fix was applied
  const buildFile = 'build/voxsigil-holo-mesh.js';
  if (fs.existsSync(buildFile)) {
    const content = fs.readFileSync(buildFile, 'utf8');
    if (content.includes('__dirname, \'..\'')) {
      console.log('✅ Python path fix applied successfully!');
      console.log('   Path now uses: __dirname + /../library-sigil/blt_rag_compression.py');
    } else if (content.includes('process.cwd()')) {
      console.log('❌ Old path still present in build file');
    } else {
      console.log('ℹ️  Path configuration updated');
    }
  }
  
  console.log('');
  console.log('🔄 MCP server should restart automatically');
  console.log('   Check VS Code Output panel for startup logs');
  
} catch (error) {
  console.error('❌ Quick fix failed:', error.message);
  
  // Try alternative approach - manual fix
  console.log('');
  console.log('🛠️  Attempting manual path fix...');
  
  try {
    const buildFile = 'build/voxsigil-holo-mesh.js';
    if (fs.existsSync(buildFile)) {
      let content = fs.readFileSync(buildFile, 'utf8');
      
      // Replace the old path with the new one
      const oldPath = "path.join(process.cwd(), 'library-sigil', 'blt_rag_compression.py')";
      const newPath = "path.join(__dirname, '..', 'library-sigil', 'blt_rag_compression.py')";
      
      if (content.includes(oldPath)) {
        content = content.replace(oldPath, newPath);
        fs.writeFileSync(buildFile, content);
        console.log('✅ Manual path fix applied!');
      } else {
        console.log('ℹ️  No path replacement needed');
      }
    }
  } catch (manualError) {
    console.error('❌ Manual fix also failed:', manualError.message);
  }
}
