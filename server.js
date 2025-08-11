/**
 * server.js - Next.js server for Azure App Service
 * Builds Next.js application if needed and starts the server
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('============================================');
console.log('NEXT.JS SERVER - AZURE VERSION');
console.log('============================================');

// Basic environment setup
process.env.NODE_ENV = 'production';
const port = process.env.PORT || 3000;

console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Using port:', port);

// Check for .next directory
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.log('============================================');
  console.log('BUILDING NEXT.JS APPLICATION');
  console.log('============================================');

  try {
    // Try building with npx
    console.log('Running Next.js build...');
    execSync('npx next build', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (err) {
    // If first build attempt fails, try alternative method
    console.error('Failed to build with npx:', err.message);
    try {
      console.log('Trying alternative build method...');
      execSync('node node_modules/next/dist/bin/next build', { stdio: 'inherit' });
      console.log('Alternative build succeeded');
    } catch (err2) {
      console.error('Alternative build also failed:', err2.message);
      process.exit(1);
    }
  }
}

// Verify the build succeeded
if (!fs.existsSync(nextDir)) {
  console.error('ERROR: Build failed - .next directory not found');
  process.exit(1);
}

console.log('============================================');
console.log('STARTING NEXT.JS SERVER');
console.log('============================================');

// Log .next directory contents for debugging
console.log('.next directory contents:');
try {
  const nextDirContents = execSync(`ls -la ${nextDir}`).toString();
  console.log(nextDirContents);
} catch (error) {
  console.log('Failed to list .next directory:', error.message);
}

// Check for standalone mode
const standaloneDir = path.join(nextDir, 'standalone');
const hasStandalone = fs.existsSync(standaloneDir);

try {
  if (hasStandalone && fs.existsSync(path.join(standaloneDir, 'server.js'))) {
    // Standalone mode detected
    console.log('Standalone mode detected, setting up standalone server...');
    
    // Create directories if they don't exist
    const staticDir = path.join(standaloneDir, 'static');
    const publicDir = path.join(standaloneDir, 'public');
    
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy static files
    if (fs.existsSync(path.join(nextDir, 'static'))) {
      console.log('Copying static files to standalone directory...');
      try {
        execSync(`cp -r "${path.join(nextDir, 'static')}"/* "${staticDir}/"`, { stdio: 'inherit' });
      } catch (error) {
        console.error('Error copying static files:', error.message);
      }
    }
    
    // Copy public files
    if (fs.existsSync(path.join(process.cwd(), 'public'))) {
      console.log('Copying public files to standalone directory...');
      try {
        execSync(`cp -r "${path.join(process.cwd(), 'public')}"/* "${publicDir}/"`, { stdio: 'inherit' });
      } catch (error) {
        console.error('Error copying public files:', error.message);
      }
    }
    
    // Change to standalone directory
    console.log('Starting standalone server from', standaloneDir);
    process.chdir(standaloneDir);
    
    // Start the standalone server
    require('./server.js');
  } else {
    // Regular Next.js server mode
    console.log('Starting regular Next.js server...');
    
    try {
      const next = require('next');
      const http = require('http');
      
      const app = next({ dev: false });
      const handle = app.getRequestHandler();
      
      app.prepare().then(() => {
        http.createServer(handle).listen(port, (err) => {
          if (err) throw err;
          console.log(`> Ready on http://localhost:${port}`);
        });
      });
    } catch (error) {
      console.error('Failed to start server directly:', error);
      
      // Try with direct CLI
      console.log('Falling back to Next.js CLI...');
      execSync(`npx next start -p ${port}`, { stdio: 'inherit' });
    }
  }
} catch (error) {
  console.error('Fatal server error:', error);
  
  // Final fallback attempt
  try {
    console.log('Final fallback attempt: direct CLI...');
    execSync(`npx next start -p ${port}`, { stdio: 'inherit' });
  } catch (finalError) {
    console.error('All server start attempts failed:', finalError.message);
    process.exit(1);
  }
}
