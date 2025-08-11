// startup.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting application startup process...');

async function ensureProductionBuild() {
  const isProduction = process.env.NODE_ENV === 'production';
  const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
  
  if (isProduction) {
    console.log('Production mode detected');
    
    // Check if .next directory exists and has build files
    if (!fs.existsSync(buildIdPath)) {
      console.log('No production build found. Building application...');
      
      return new Promise((resolve, reject) => {
        const buildProcess = spawn('npm', ['run', 'build'], {
          stdio: 'inherit',
          shell: true
        });
        
        buildProcess.on('close', (code) => {
          if (code !== 0) {
            console.error('Build failed! Exiting...');
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
    } else {
      console.log('Production build found, skipping build step');
    }
  }
}

async function startServer() {
  try {
    await ensureProductionBuild();
    
    console.log('Starting server...');
    
    // Start the actual server
    require('./server.js');
    
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
}

startServer();
