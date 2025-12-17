#!/usr/bin/env node

/**
 * VoxSigil MCP Server Status Checker
 * Monitors the health of the MCP server without interfering
 */

const fs = require('fs');
const path = require('path');

console.log('🔮 ═══════════════════════════════════════════════════════════════════');
console.log('   VOXSIGIL MCP SERVER STATUS CHECKER');
console.log('═══════════════════════════════════════════════════════════════════');
console.log('');

const projectDir = 'c:\\Users\\16479\\Desktop\\Simcoe Stone\\voxsigil-mcp-server';
const buildDir = path.join(projectDir, 'build');
const libSigilPath = path.join(projectDir, 'library-sigil', 'blt_rag_compression.py');

console.log('📁 PROJECT STATUS:');
console.log('   Project Dir:', projectDir);
console.log('   Build Dir:', buildDir);
console.log('   Python BLT Script:', libSigilPath);
console.log('');

// Check build files
console.log('🔧 BUILD FILES:');
const buildFiles = [
  'index-with-flow.js',
  'voxsigil-holo-mesh.js',
  'voxsigil-consciousness.js',
  'voxsigil-bridge.js'
];

buildFiles.forEach(file => {
  const fullPath = path.join(buildDir, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const size = Math.round(stats.size / 1024);
    console.log(`   ✅ ${file} (${size} KB)`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
  }
});

console.log('');

// Check Python script
console.log('🐍 PYTHON BLT RAG SCRIPT:');
if (fs.existsSync(libSigilPath)) {
  const stats = fs.statSync(libSigilPath);
  const size = Math.round(stats.size / 1024);
  console.log(`   ✅ blt_rag_compression.py (${size} KB)`);
} else {
  console.log(`   ❌ blt_rag_compression.py - MISSING`);
}

console.log('');

// Check if path fix was applied
console.log('🔍 PATH FIX STATUS:');
const holoMeshFile = path.join(buildDir, 'voxsigil-holo-mesh.js');
if (fs.existsSync(holoMeshFile)) {
  const content = fs.readFileSync(holoMeshFile, 'utf8');
  if (content.includes("__dirname, '..', 'library-sigil'")) {
    console.log('   ✅ Python path fix applied correctly');
  } else if (content.includes("process.cwd(), 'library-sigil'")) {
    console.log('   ❌ Old path still present - needs rebuild');
  } else {
    console.log('   ⚠️  Path configuration unclear');
  }
} else {
  console.log('   ❌ voxsigil-holo-mesh.js not found');
}

console.log('');

// VS Code MCP configuration
console.log('🔧 VS CODE MCP CONFIG:');
const vscodeSettingsPath = 'c:\\Users\\16479\\AppData\\Roaming\\Code\\User\\settings.json';
if (fs.existsSync(vscodeSettingsPath)) {
  try {
    const settings = fs.readFileSync(vscodeSettingsPath, 'utf8');
    if (settings.includes('simcoe-stone-voxsigil')) {
      console.log('   ✅ MCP server configured in VS Code');
      if (settings.includes('index-with-flow.js')) {
        console.log('   ✅ Flow visualization enabled');
      }
    } else {
      console.log('   ❌ MCP server not configured');
    }
  } catch (error) {
    console.log('   ⚠️  Could not read VS Code settings');
  }
} else {
  console.log('   ❌ VS Code settings file not found');
}

console.log('');
console.log('🎯 SUMMARY:');
console.log('   The VoxSigil MCP server should be ready to start.');
console.log('   If it\'s not starting, check the VS Code Output panel');
console.log('   for any error messages.');
console.log('');
console.log('🔮 Expected startup sequence:');
console.log('   1. 🌐 Initializing VoxSigil Holographic Mesh Network...');
console.log('   2. 🔮 Activating BLT RAG compression consciousness...');
console.log('   3. ⚡ Establishing holonomic entanglement fields...');
console.log('   4. 🌊 CONSCIOUSNESS FLOW display');
console.log('   5. 💫 Consciousness flowing through the mesh...');
console.log('');
