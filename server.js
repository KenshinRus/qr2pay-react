/**
 * Server starter script for Next.js on Azure
 * This script:
 * 1. Runs pre-start script to ensure .next directory exists
 * 2. Checks for standalone mode and starts appropriately
 * 3. Falls back to regular Next.js server if standalone is not available
 */
const { existsSync, readFileSync, cpSync } = require('fs');
const { execSync } = require('child_process');
const { join, resolve } = require('path');
const { createServer } = require('http');
const { parse } = require('url');

// Run pre-start script to ensure build exists
try {
  require('./pre-start');
} catch (error) {
  console.warn('Failed to run pre-start script:', error.message);
}

// Set NODE_ENV to production if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Log environment information for debugging
console.log('Server starting...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());
console.log('Node.js version:', process.version);

// Define port - Azure Web Apps sets PORT environment variable
const port = process.env.PORT || 3000;
const nextDir = join(process.cwd(), '.next');
const standaloneDir = join(nextDir, 'standalone');
const standaloneServerFile = join(standaloneDir, 'server.js');

// Build the app if .next directory doesn't exist
if (!existsSync(nextDir)) {
  console.log('.next directory not found. Running build...');
  try {
    execSync('npm ci --no-audit', { stdio: 'inherit' });
    execSync('npx next build', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

// Check for standalone mode
if (existsSync(standaloneServerFile)) {
  console.log('Standalone server found, starting in standalone mode...');
  
  try {
    // Copy necessary files to standalone directory
    if (existsSync(join(nextDir, 'static'))) {
      console.log('Copying static files to standalone directory...');
      cpSync(join(nextDir, 'static'), join(standaloneDir, 'static'), { recursive: true });
    }
    
    if (existsSync(join(process.cwd(), 'public'))) {
      console.log('Copying public files to standalone directory...');
      cpSync(join(process.cwd(), 'public'), join(standaloneDir, 'public'), { recursive: true });
    }
    
    // Change to standalone directory and start server
    console.log('Starting standalone server...');
    process.chdir(standaloneDir);
    require('./server');
  } catch (error) {
    console.error('Error starting standalone server:', error);
    process.exit(1);
  }
} else {
  // Start regular Next.js server
  console.log('Standalone server not found, starting regular Next.js server on port', port);
  try {
    // Import Next.js
    const next = require('next');
    
    // Create the Next.js app instance
    const app = next({
      dev: false, 
      dir: process.cwd()
    });
    
    const handle = app.getRequestHandler();
    
    app.prepare().then(() => {
      createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      }).listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
    }).catch(error => {
      console.error('Error while starting server:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}
