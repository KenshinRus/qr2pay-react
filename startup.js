// startup.js - Azure App Service startup (production and test environments)
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const allowedEnvironments = ['production', 'test'];
const nodeEnv = (process.env.NODE_ENV || '').toLowerCase();

console.log('QR2Pay Startup');
console.log('Working Directory:', process.cwd());
console.log('NODE_ENV:', nodeEnv);

if (!allowedEnvironments.includes(nodeEnv)) {
  console.error(`NODE_ENV must be one of: ${allowedEnvironments.join(', ')} (got: "${process.env.NODE_ENV || ''}")`);
  process.exit(1);
}

const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');

function runBuild() {
  console.log('No build found. Building application...');

  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npx', ['next', 'build'], {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        PATH: `/node_modules/.bin:${process.env.PATH || ''}`,
        NODE_PATH: `/node_modules:${process.env.NODE_PATH || ''}`,
        NEXT_TELEMETRY_DISABLED: '1'
      },
      cwd: process.cwd()
    });

    const timeout = setTimeout(() => {
      console.error('Build timed out after 5 minutes');
      buildProcess.kill();
      reject(new Error('Build timeout'));
    }, 300000);

    buildProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`Build failed with exit code ${code}`));
        return;
      }
      console.log('Build completed successfully');
      resolve();
    });

    buildProcess.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function startApplication() {
  if (!fs.existsSync(buildIdPath)) {
    try {
      await runBuild();

      // Wait for filesystem to sync
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!fs.existsSync(buildIdPath)) {
        throw new Error('Build completed but BUILD_ID still missing');
      }
    } catch (error) {
      console.error('Build failed:', error.message);
      process.exit(1);
    }
  }

  const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
  console.log('BUILD_ID:', buildId);
  console.log('Starting server...');

  require('./server.js');
}

startApplication().catch(error => {
  console.error('Startup failed:', error);
  process.exit(1);
});
