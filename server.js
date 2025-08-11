/**
 * server.js - Next.js server for Azure App Service
 * AGGRESSIVE VERSION - Always builds Next.js application before starting the server
 * This addresses the common "Could not find a production build in the './.next' directory" error
 */
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('==============================================================');
console.log('NEXT.JS SERVER - AZURE VERSION (FORCED BUILD + SERVER)');
console.log('==============================================================');

// Basic environment setup
process.env.NODE_ENV = 'production';
const port = process.env.PORT || 3000;

// Print detailed diagnostic information
console.log('Diagnostic information:');
console.log('- Node version:', process.version);
console.log('- Current directory:', process.cwd());
console.log('- PORT env variable:', process.env.PORT);
console.log('- Directory contents:');
try {
  const dirContents = execSync('ls -la', { encoding: 'utf8' });
  console.log(dirContents);
} catch (err) {
  console.log('  Unable to list directory contents');
}

// Force build regardless of .next directory status
console.log('==============================================================');
console.log('BUILDING NEXT.JS APPLICATION (FORCED BUILD)');
console.log('==============================================================');

let buildSuccess = false;

// Try multiple build approaches to ensure success
try {
  // Clean any partial build artifacts first
  console.log('Removing any existing partial .next directory...');
  if (fs.existsSync('.next')) {
    try {
      execSync('rm -rf .next', { stdio: 'inherit' });
    } catch (cleanErr) {
      console.error('Warning: Failed to clean .next directory:', cleanErr.message);
      // Continue anyway
    }
  }

  // First build attempt - NPX
  console.log('Build attempt 1: Using npx next build...');
  execSync('npx next build', { stdio: 'inherit' });
  buildSuccess = true;
  console.log('Build completed successfully!');
} catch (err) {
  // If first build attempt fails, try direct node call
  console.error('First build attempt failed:', err.message);
  
  try {
    console.log('Build attempt 2: Using direct node module path...');
    execSync('node node_modules/next/dist/bin/next build', { stdio: 'inherit' });
    buildSuccess = true;
    console.log('Second build attempt succeeded!');
  } catch (err2) {
    // Try with increased memory limit
    console.error('Second build attempt failed:', err2.message);
    
    try {
      console.log('Build attempt 3: Using increased memory limit...');
      execSync('NODE_OPTIONS=--max-old-space-size=2048 npx next build', { stdio: 'inherit' });
      buildSuccess = true;
      console.log('Third build attempt succeeded!');
    } catch (err3) {
      console.error('All build attempts failed:', err3.message);
    }
  }
}

// Check if .next directory exists now
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.error('CRITICAL ERROR: .next directory not found after build attempts');
  console.error('This indicates a serious problem with the build process.');
  console.error('Attempting emergency .next directory creation for debugging...');
  
  try {
    fs.mkdirSync(path.join(process.cwd(), '.next', 'server', 'pages'), { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), '.next', 'BUILD_ID'), 'emergency-' + Date.now());
    console.error('Created emergency .next structure for debugging.');
    console.error('THIS IS NOT A WORKING BUILD, just for diagnostics.');
  } catch (emergencyErr) {
    console.error('Failed even emergency directory creation:', emergencyErr.message);
    process.exit(1);
  }
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
