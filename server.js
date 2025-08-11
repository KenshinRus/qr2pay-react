/**
 * Simple server wrapper for Next.js
 * This script is a simplified version that delegates to Next.js directly
 */
console.log('============================================');
console.log('SIMPLE NEXT.JS SERVER - FALLBACK VERSION');
console.log('============================================');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Set production mode
process.env.NODE_ENV = 'production';

// Get the port from environment or default to 3000
const port = process.env.PORT || 3000;

try {
  // Try to load Next.js directly
  const next = require('next');
  const http = require('http');
  
  console.log('Starting Next.js application in production mode');
  console.log('Port:', port);
  
  // Create a Next.js app instance
  const app = next({
    dev: false,
    dir: process.cwd()
  });
  
  // Get the request handler
  const handle = app.getRequestHandler();
  
  // Prepare and start the server
  app.prepare()
    .then(() => {
      // Create HTTP server
      const server = http.createServer((req, res) => {
        handle(req, res);
      });
      
      // Start listening
      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
      });
    });
} catch (error) {
  console.error('Failed to start server directly:', error);
  
  // Try to use the CLI as fallback
  try {
    console.log('Attempting to start using Next.js CLI...');
    require('child_process').execSync(`npx next start -p ${port}`, { 
      stdio: 'inherit' 
    });
  } catch (cliError) {
    console.error('All server start methods failed:', cliError);
    process.exit(1);
  }
}

// Always run the build
try {
  console.log('Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('Next.js build completed');
} catch (error) {
  console.error('Build failed:', error.message);
  console.error('Will attempt to continue with existing .next directory if available');
}

// Check if .next directory exists now
if (!existsSync(nextDir)) {
  console.error('ERROR: .next directory still not found after build attempt!');
  console.error('This could indicate a build failure or permission issue.');
  
  // Try one more desperate build attempt
  try {
    console.log('Last resort: Trying direct npx command...');
    spawnSync('npx', ['next', 'build'], { stdio: 'inherit' });
  } catch (e) {
    console.error('Final build attempt failed:', e.message);
  }
  
  // Check again
  if (!existsSync(nextDir)) {
    console.error('FATAL: Still cannot create .next directory. Server cannot start.');
    process.exit(1);
  }
}

// Check and log .next directory contents
console.log('.next directory exists, contents:');
try {
  const nextDirContents = execSync(`ls -la ${nextDir}`).toString();
  console.log(nextDirContents);
} catch (error) {
  console.log('Failed to list .next directory:', error.message);
}

// Now check for standalone mode
const standaloneDir = join(nextDir, 'standalone');
const standaloneServerFile = join(standaloneDir, 'server.js');

console.log('Starting Next.js server...');
try {
  if (existsSync(standaloneServerFile)) {
    // Standalone mode detected
    console.log('Standalone mode detected, setting up standalone server...');
    
    try {
      // Create directories in standalone if they don't exist
      if (!existsSync(join(standaloneDir, 'static'))) {
        mkdirSync(join(standaloneDir, 'static'), { recursive: true });
      }
      
      if (!existsSync(join(standaloneDir, 'public'))) {
        mkdirSync(join(standaloneDir, 'public'), { recursive: true });
      }
      
      // Copy static files
      if (existsSync(join(nextDir, 'static'))) {
        console.log('Copying static files to standalone directory...');
        cpSync(join(nextDir, 'static'), join(standaloneDir, 'static'), { recursive: true });
      }
      
      // Copy public files
      if (existsSync(join(process.cwd(), 'public'))) {
        console.log('Copying public files to standalone directory...');
        cpSync(join(process.cwd(), 'public'), join(standaloneDir, 'public'), { recursive: true });
      }
      
      // Change directory and run standalone server
      console.log('Starting standalone server from', standaloneDir);
      process.chdir(standaloneDir);
      
      // Directly require the standalone server
      require(standaloneServerFile);
    } catch (error) {
      console.error('Error in standalone mode:', error.message);
      throw error; // Let the outer catch handle this
    }
  } else {
    // Regular Next.js server
    console.log('Using regular Next.js server...');
    
    // Import Next.js directly
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
    });
  }
} catch (error) {
  console.error('Fatal server error:', error);
  
  // Try direct start as a last resort
  try {
    console.log('Attempting last resort: direct next start...');
    execSync('npx next start -p ' + port, { stdio: 'inherit' });
  } catch (finalError) {
    console.error('All attempts failed, cannot start server:', finalError.message);
    process.exit(1);
  }
}
