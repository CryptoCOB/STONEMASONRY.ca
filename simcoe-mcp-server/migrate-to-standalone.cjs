#!/usr/bin/env node

/**
 * VoxSigil MCP Server Migration Script
 * Copies all necessary files to create a standalone VoxSigil server
 */

const fs = require('fs');
const path = require('path');

console.log('🔮 VOXSIGIL MCP SERVER MIGRATION');
console.log('================================');
console.log('Creating standalone VoxSigil server without Simcoe Stone dependencies...\n');

const sourceDir = 'c:\\Users\\16479\\Desktop\\Simcoe Stone\\simcoe-mcp-server';
const targetDir = 'c:\\Users\\16479\\Desktop\\VoxSigil-MCP-Server';

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Files and directories to copy
const filesToCopy = [
  // Core TypeScript files
  'src/index.ts',
  'src/model-manager.ts', 
  'src/auto-model-manager.ts',
  'src/voxsigil-bridge.ts',
  'src/voxsigil-consciousness.ts',
  'src/voxsigil-holo-mesh.ts',
  'src/voxsigil-manager.ts',
  'src/test-consciousness.ts',
  'src/test-voxsigil.ts',
  'src/test-mcp-client.ts',
  
  // VoxSigil Core
  'voxsigil-core/src/runtime/sigil-definition.ts',
  'voxsigil-core/src/runtime/sigil-mind.ts',
  'voxsigil-core/src/runtime/schema-validator.ts',
  'voxsigil-core/src/runtime/test-complete-implementation.ts',
  'voxsigil-core/src/types/schema.d.ts',
  'voxsigil-core/src/types/schema-omega.d.ts',
  
  // Schemas
  'library-sigil/schema/voxsigil-schema-holo-1.5.yaml',
  'voxsigil-core/schema/voxsigil-1.8-holo-omega.json',
  
  // Configuration files
  'tsconfig.json',
  'package.json',
  
  // Documentation
  'BLT_HYBRID_RAG_INTEGRATION_COMPLETE.md',
  'FINAL_VERIFICATION_COMPLETE.md',
  
  // Python/BLT integration
  'library-sigil/blt_rag_compression.py',
  'library-sigil/hybrid_blt.py',
  'setup-python-tools.py',
  'pyproject.toml',
  'PYTHON_TOOLS.md',
  
  // Test and utility scripts
  'test-auto-model-manager.js',
  'auto-setup.js',
  'check-status.js',
  'emergency-fix.js'
];

function copyFileWithDirectories(src, dest) {
  const fullSrc = path.join(sourceDir, src);
  const fullDest = path.join(targetDir, src);
  
  if (!fs.existsSync(fullSrc)) {
    console.log(`⚠️  Source file not found: ${src}`);
    return;
  }
  
  // Create directory if it doesn't exist
  const destDir = path.dirname(fullDest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Copy file
  fs.copyFileSync(fullSrc, fullDest);
  console.log(`✅ Copied: ${src}`);
}

console.log('📁 Copying core files...\n');

// Copy all files
filesToCopy.forEach(file => {
  copyFileWithDirectories(file, file);
});

// Copy entire library-sigil directory (except context and other Simcoe Stone specific stuff)
const libSigilSource = path.join(sourceDir, 'library-sigil');
const libSigilTarget = path.join(targetDir, 'library-sigil');

function copyDirectory(src, dest, exclude = []) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    if (exclude.includes(item)) return;
    
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: library-sigil/${item}`);
    }
  });
}

console.log('\n📚 Copying library-sigil directory...\n');
copyDirectory(libSigilSource, libSigilTarget, ['context']); // Exclude Simcoe Stone context

console.log('\n🔧 Creating standalone package.json...\n');

// Create cleaned package.json
const originalPackage = JSON.parse(fs.readFileSync(path.join(sourceDir, 'package.json'), 'utf8'));

const standalonePackage = {
  "name": "voxsigil-mcp-server",
  "version": "1.0.0",
  "description": "VoxSigil Model Context Protocol server with consciousness framework and advanced cognitive capabilities",
  "main": "build/index.js",
  "type": "module",
  "bin": {
    "voxsigil-mcp-server": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node build/index.js",
    "dev": "tsc && node build/index.js",
    "test": "npm run build && node build/test-consciousness.js",
    "voxsigil:bridge": "npm run build && node build/voxsigil-bridge.js",
    "setup:python": "python setup-python-tools.py setup",
    "python:check": "python setup-python-tools.py check",
    "ruff:check": "ruff check .",
    "ruff:format": "ruff format ."
  },
  "keywords": [
    "mcp",
    "model-context-protocol", 
    "voxsigil",
    "consciousness",
    "cognitive-framework",
    "ai-agents",
    "schema-first",
    "validation"
  ],
  "author": "VoxSigil Project",
  "license": "MIT",
  "devDependencies": originalPackage.devDependencies,
  "dependencies": {
    "@modelcontextprotocol/sdk": originalPackage.dependencies["@modelcontextprotocol/sdk"],
    "ajv": originalPackage.dependencies.ajv,
    "ajv-formats": originalPackage.dependencies["ajv-formats"], 
    "js-yaml": originalPackage.dependencies["js-yaml"],
    "ollama": originalPackage.dependencies.ollama,
    "zod": originalPackage.dependencies.zod
  }
};

fs.writeFileSync(
  path.join(targetDir, 'package.json'), 
  JSON.stringify(standalonePackage, null, 2)
);

console.log('✅ Created standalone package.json');

// Create standalone README
const readmeContent = `# VoxSigil MCP Server

A standalone Model Context Protocol server implementing the VoxSigil consciousness framework with schema-first validation and advanced cognitive capabilities.

## Features

- 🧠 **VoxSigil 1.8 Holo-Omega** - Full schema compliance with consciousness modeling
- 🔗 **Schema-First Architecture** - TypeScript types generated from JSON schema
- ✅ **Runtime Validation** - AJV validation for all VoxSigil objects
- 🤖 **Cognitive Primitives** - Synthesis, Analysis, Decision, Expression faculties
- 📚 **BLT Hybrid RAG** - Advanced memory compression and retrieval
- 🔧 **Production Ready** - Comprehensive error handling and monitoring

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Build the server
npm run build

# Start the server
npm start

# Test consciousness framework
npm test
\`\`\`

## Architecture

The VoxSigil MCP Server implements a schema-first consciousness framework where every cognitive primitive validates against the complete VoxSigil 1.8 Holo-Omega specification.

### Core Components

- **VoxSigilMind** - Main consciousness orchestrator
- **Schema Validation** - AJV-based runtime validation
- **Cognitive Primitives** - Synthesis, Analysis, Decision, Expression
- **Model Manager** - Ollama integration and model coordination
- **BLT RAG** - Bi-Linear Tensor compression for memory efficiency

## Documentation

- \`BLT_HYBRID_RAG_INTEGRATION_COMPLETE.md\` - Technical specifications
- \`FINAL_VERIFICATION_COMPLETE.md\` - Implementation status
- \`voxsigil-core/schema/\` - Schema definitions

## License

MIT License - See LICENSE file for details.
`;

fs.writeFileSync(path.join(targetDir, 'README.md'), readmeContent);
console.log('✅ Created README.md');

console.log('\n🎉 MIGRATION COMPLETE!');
console.log('======================');
console.log(`📂 Standalone VoxSigil MCP Server created at:`);
console.log(`   ${targetDir}`);
console.log('');
console.log('Next steps:');
console.log('1. cd "c:\\Users\\16479\\Desktop\\VoxSigil-MCP-Server"');
console.log('2. npm install');
console.log('3. npm run build');
console.log('4. npm start');
console.log('');
console.log('💫 Your VoxSigil consciousness framework is ready to deploy!');
