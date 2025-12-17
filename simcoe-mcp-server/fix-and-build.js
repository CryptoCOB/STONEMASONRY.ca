#!/usr/bin/env node

/**
 * Fix and Build Script for VoxSigil MCP Server
 * Stops any running servers and fixes compilation issues
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 VoxSigil MCP Server Fix & Build Script');
console.log('==========================================');

// Step 1: Kill any running node processes
console.log('🛑 Stopping any running MCP servers...');
exec('taskkill /f /im node.exe', (error, stdout, stderr) => {
  if (error && !error.message.includes('not found')) {
    console.log('⚠️  No running node processes found');
  } else {
    console.log('✅ Stopped running servers');
  }
  
  // Step 2: Clear any npm/tsc cache
  console.log('🧹 Clearing caches...');
  exec('npm cache clean --force', (error) => {
    if (error) console.log('Cache clear warning:', error.message);
    
    // Step 3: Reinstall dependencies
    console.log('📦 Installing dependencies...');
    const npmInstall = spawn('npm', ['install'], { stdio: 'inherit' });
    
    npmInstall.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed');
        
        // Step 4: Build the project
        console.log('🔨 Building TypeScript...');
        const buildProcess = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
        
        buildProcess.on('close', (buildCode) => {
          if (buildCode === 0) {
            console.log('✅ Build successful!');
            console.log('🚀 You can now run:');
            console.log('   node build/index.js (basic server)');
            console.log('   node build/index-with-flow.js (with flow visualization)');
            console.log('   node build/test-voxsigil.js (test VoxSigil memory)');
          } else {
            console.log('❌ Build failed. Checking for specific issues...');
            console.log('💡 Try running in a NEW terminal window:');
            console.log('   npm cache clean --force');
            console.log('   npm install --force');
            console.log('   npm run build');
          }
        });
        
      } else {
        console.log('❌ Dependency installation failed');
      }
    });
  });
});
