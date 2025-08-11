// startup.js - Azure App Service startup with robust build handling
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 QR2Pay Application Starting...');
console.log('Environment:', process.env.NODE_ENV || 'not set');
console.log('Working Directory:', process.cwd());

// Check if we have a production build
const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
const isProduction = process.env.NODE_ENV === 'production';

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
  if (isProduction && !fs.existsSync(buildIdPath)) {
    console.error('╔══════════════════════════════════════════════════╗');
    console.error('║              PRODUCTION BUILD NOT FOUND         ║');
    console.error('╚══════════════════════════════════════════════════╝');
    console.error('📍 Expected build artifacts in .next directory');
    console.error('📂 Current working directory:', process.cwd());
    console.error('🔍 Looking for BUILD_ID at:', buildIdPath);
    
    // List what's in the current directory
    console.error('\n📁 Directory contents:');
    try {
      const files = fs.readdirSync(process.cwd());
      files.forEach(file => {
        console.error('  📄', file);
      });
    } catch (err) {
      console.error('❌ Could not list directory contents:', err.message);
    }
    
    // Check if .next exists at all
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      console.error('\n📁 .next directory exists, contents:');
      try {
        const nextFiles = fs.readdirSync(nextDir);
        nextFiles.forEach(file => {
          console.error('  📄', file);
        });
      } catch (err) {
        console.error('❌ Could not list .next contents:', err.message);
      }
    } else {
      console.error('\n❌ .next directory does not exist');
    }
    
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
        console.log('🌍 Final NODE_ENV:', process.env.NODE_ENV);
        console.log('🚀 Starting server in production mode...');
      } else {
        throw new Error('Build completed but BUILD_ID still missing');
      }
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      console.error('\n╔══════════════════════════════════════════════════╗');
      console.error('║            FALLING BACK TO DEV MODE             ║');
      console.error('╚══════════════════════════════════════════════════╝');
      
      // Override NODE_ENV to development to avoid the production check
      process.env.NODE_ENV = 'development';
      console.log('🔄 Environment changed to development mode');
    }
  } else if (isProduction && fs.existsSync(buildIdPath)) {
    const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
    console.log('✅ Production build found!');
    console.log('🆔 BUILD_ID:', buildId);
  }

  console.log(`🌍 Final NODE_ENV: ${process.env.NODE_ENV}`);
  console.log('🚀 Starting server...');

  // Start the actual server
  require('./server.js');
}

startApplication().catch(error => {
  console.error('💥 Application startup failed:', error);
  process.exit(1);
});
