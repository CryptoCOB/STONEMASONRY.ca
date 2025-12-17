// Automated SEO file updater - runs before each build
// Ensures sitemap.xml and robots.txt are always current

const fs = require('fs');
const path = require('path');

// Import the auto-generation functions
const { generateAutoSitemap, generateAutoRobots } = require('../src/utils/autoSitemapGenerator.ts');

const updateSEOFiles = () => {
  try {
    console.log('🔄 Auto-updating SEO files...');
    
    // Update sitemap.xml
    const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
    const newSitemap = generateAutoSitemap();
    fs.writeFileSync(sitemapPath, newSitemap);
    console.log('✅ Sitemap.xml updated automatically');
    
    // Update robots.txt 
    const robotsPath = path.join(__dirname, '../public/robots.txt');
    const newRobots = generateAutoRobots();
    fs.writeFileSync(robotsPath, newRobots);
    console.log('✅ Robots.txt updated automatically');
    
    console.log('🚀 SEO files auto-update complete!');
    
  } catch (error) {
    console.warn('⚠️  SEO auto-update failed, using existing files:', error.message);
    // Don't fail the build, just use existing files
  }
};

// Run the update
updateSEOFiles();
