#!/usr/bin/env node

/**
 * MCP Server Restart Script
 * Helps restart the MCP server cleanly
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🔄 Restarting MCP Server...');

// Kill any existing node processes (optional - be careful)
console.log('⚠️  Note: Close any running MCP server first (Ctrl+C in terminal)');

// Change to the correct directory
const serverDir = path.join(__dirname);
console.log(`📁 Working directory: ${serverDir}`);

// Try to build first
console.log('🔨 Building TypeScript...');
const buildProcess = spawn('npm', ['run', 'build'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Build successful!');
    console.log('🚀 Starting MCP server with flow visualization...');
    
    // Start the flow visualizer
    const serverProcess = spawn('node', ['build/index-with-flow.js'], {
      cwd: serverDir,
      stdio: 'inherit',
      shell: true
    });
    
    serverProcess.on('close', (serverCode) => {
      console.log(`🔴 MCP server exited with code ${serverCode}`);
    });
    
  } else {
    console.log(`❌ Build failed with code ${code}`);
    console.log('🔧 Try running: npm install --force');
  }
});
