// startup.js - Simplified approach for Azure App Service
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting application...');

// Check if we have a production build
const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
const isProduction = process.env.NODE_ENV === 'production';

async function attemptBuild() {
  console.log('Attempting to build the application...');
  
  return new Promise((resolve, reject) => {
    // Use the Next.js binary that should be available in Azure
    const buildProcess = spawn('npx', ['next', 'build'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PATH: `/node_modules/.bin:${process.env.PATH}`,
        NODE_PATH: '/node_modules'
      },
      cwd: process.cwd()
    });
    
    buildProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Build failed with exit code ${code}`);
        reject(new Error(`Build process exited with code ${code}`));
        return;
      }
      
      console.log('Build completed successfully');
      resolve();
    });
    
    buildProcess.on('error', (error) => {
      console.error('Build process error:', error);
      reject(error);
    });
  });
}

async function startApplication() {
  if (isProduction && !fs.existsSync(buildIdPath)) {
    console.error('===================================================');
    console.error('PRODUCTION BUILD NOT FOUND');
    console.error('===================================================');
    console.error('Expected build artifacts in .next directory');
    console.error('Current working directory:', process.cwd());
    console.error('Looking for BUILD_ID at:', buildIdPath);
    
    // List what's in the current directory
    console.error('Directory contents:');
    try {
      const files = fs.readdirSync(process.cwd());
      files.forEach(file => {
        console.error('  -', file);
      });
    } catch (err) {
      console.error('Could not list directory contents:', err.message);
    }
    
    // Check if .next exists at all
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      console.error('.next directory exists, contents:');
      try {
        const nextFiles = fs.readdirSync(nextDir);
        nextFiles.forEach(file => {
          console.error('  -', file);
        });
      } catch (err) {
        console.error('Could not list .next contents:', err.message);
      }
    } else {
      console.error('.next directory does not exist');
    }
    
    console.error('===================================================');
    console.error('ATTEMPTING TO BUILD IN PRODUCTION');
    console.error('===================================================');
    
    try {
      await attemptBuild();
      
      if (fs.existsSync(buildIdPath)) {
        console.log('✅ Build successful! BUILD_ID now exists.');
        console.log(`Final NODE_ENV: ${process.env.NODE_ENV}`);
        console.log('Starting server in production mode...');
      } else {
        throw new Error('Build completed but BUILD_ID still missing');
      }
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      console.error('===================================================');
      console.error('FALLING BACK TO DEVELOPMENT MODE');
      console.error('===================================================');
      
      // Override NODE_ENV to development to avoid the production check
      process.env.NODE_ENV = 'development';
      console.log('Environment changed to development mode');
    }
  }

  console.log(`Final NODE_ENV: ${process.env.NODE_ENV}`);
  console.log('Starting server...');

  // Start the actual server
  require('./server.js');
}

startApplication().catch(error => {
  console.error('Application startup failed:', error);
  process.exit(1);
});
