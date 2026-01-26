// startup.js - Azure App Service startup (production and test environments)
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const allowedEnvironments = ['production', 'test'];
const nodeEnv = process.env.NODE_ENV || '';

console.log('🚀 QR2Pay Startup...');
console.log('Working Directory:', process.cwd());
console.log('NODE_ENV:', nodeEnv);

// Ensure we're running in an allowed environment
if (!allowedEnvironments.includes(nodeEnv.toLowerCase())) {
  console.error('❌ This startup script only supports production and test environments');
  console.error(`NODE_ENV must be one of: ${allowedEnvironments.join(', ')}`);
  console.error(`Current NODE_ENV: "${nodeEnv}"`);
  process.exit(1);
}

// Check if we have a production build
const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');

async function attemptBuild() {
  console.log('🔨 Attempting to build the application in Azure...');
  
  return new Promise((resolve, reject) => {
    // In Azure, node_modules are extracted to /node_modules and linked
    // We need to use npx to find the next binary
    const buildProcess = spawn('npx', ['next', 'build'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        // Ensure proper PATH for Azure environment
        PATH: `/node_modules/.bin:${process.env.PATH || ''}`,
        NODE_PATH: `/node_modules:${process.env.NODE_PATH || ''}`,
        // Disable telemetry during build
        NEXT_TELEMETRY_DISABLED: '1'
      },
      cwd: process.cwd()
    });
    
    let buildTimeout = setTimeout(() => {
      console.error('⏰ Build process timed out after 5 minutes');
      buildProcess.kill();
      reject(new Error('Build timeout'));
    }, 300000); // 5 minutes timeout
    
    buildProcess.on('close', (code) => {
      clearTimeout(buildTimeout);
      if (code !== 0) {
        console.error(`❌ Build failed with exit code ${code}`);
        reject(new Error(`Build process exited with code ${code}`));
        return;
      }
      
      console.log('✅ Build completed successfully in Azure!');
      resolve();
    });
    
    buildProcess.on('error', (error) => {
      clearTimeout(buildTimeout);
      console.error('❌ Build process error:', error);
      reject(error);
    });
  });
}

async function startApplication() {
  if (!fs.existsSync(buildIdPath)) {
    console.error('╔══════════════════════════════════════════════════╗');
    console.error('║              PRODUCTION BUILD NOT FOUND         ║');
    console.error('╚══════════════════════════════════════════════════╝');
    console.error('📍 Expected build artifacts in .next directory');
    console.error('📂 Current working directory:', process.cwd());
    console.error('🔍 Looking for BUILD_ID at:', buildIdPath);
    
    console.error('\n╔══════════════════════════════════════════════════╗');
    console.error('║          ATTEMPTING BUILD IN AZURE              ║');
    console.error('╚══════════════════════════════════════════════════╝');
    
    try {
      await attemptBuild();
      
      // Wait a moment for filesystem to sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (fs.existsSync(buildIdPath)) {
        const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
        console.log('✅ Build successful! BUILD_ID now exists.');
        console.log('🆔 BUILD_ID content:', buildId);
      } else {
        throw new Error('Build completed but BUILD_ID still missing');
      }
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      console.error('💥 Production startup failed - terminating');
      process.exit(1);
    }
  } else {
    const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
    console.log('✅ Production build found!');
    console.log('🆔 BUILD_ID:', buildId);
  }

  console.log('🚀 Starting production server...');

  // Start the actual server
  require('./server.js');
}

startApplication().catch(error => {
  console.error('💥 Application startup failed:', error);
  process.exit(1);
});
