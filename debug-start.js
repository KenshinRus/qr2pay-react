/**
 * debug-start.js - Advanced debugging script for Next.js Azure App Service deployment
 * Run this script directly with 'node debug-start.js' to diagnose issues
 * Add as a startup command in Azure Portal for detailed logging
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('==========================================================');
console.log('NEXT.JS AZURE DIAGNOSTIC SCRIPT');
console.log('This script provides detailed information about the environment');
console.log('==========================================================');

// Basic environment information
console.log('\n=== ENVIRONMENT INFORMATION ===');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('Process argv:', process.argv);

// Node modules check
console.log('\n=== NODE MODULES CHECK ===');
try {
  const hasNodeModules = fs.existsSync('node_modules');
  console.log('node_modules exists in current directory:', hasNodeModules);
  
  if (hasNodeModules) {
    const hasNext = fs.existsSync('node_modules/next');
    console.log('next module exists:', hasNext);
    
    if (hasNext) {
      try {
        const nextPackage = require('./node_modules/next/package.json');
        console.log('Next.js version:', nextPackage.version);
      } catch (e) {
        console.log('Could not determine Next.js version');
      }
    }
  }
  
  // Check for system-wide node_modules (Azure sometimes uses this)
  const hasSystemModules = fs.existsSync('/node_modules');
  console.log('System-wide node_modules exists:', hasSystemModules);
} catch (e) {
  console.error('Error checking node_modules:', e.message);
}

// List directory contents
console.log('\n=== DIRECTORY CONTENTS ===');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    try {
      const stat = fs.statSync(file);
      console.log(`${stat.isDirectory() ? 'DIR' : 'FILE'}: ${file}`);
    } catch (e) {
      console.log(`ERROR: Could not stat ${file} - ${e.message}`);
    }
  });
} catch (e) {
  console.error('Error listing directory:', e.message);
}

// Check for .next directory
console.log('\n=== .NEXT DIRECTORY CHECK ===');
const nextDir = path.join(process.cwd(), '.next');
if (fs.existsSync(nextDir)) {
  console.log('.next directory exists at:', nextDir);
  try {
    const nextFiles = fs.readdirSync(nextDir);
    console.log('.next contents:', nextFiles);
    
    // Check BUILD_ID
    const buildIdPath = path.join(nextDir, 'BUILD_ID');
    if (fs.existsSync(buildIdPath)) {
      console.log('BUILD_ID exists, content:', fs.readFileSync(buildIdPath, 'utf8').trim());
    } else {
      console.log('BUILD_ID is missing - indicates incomplete build');
    }
    
    // Check server directory
    const serverDir = path.join(nextDir, 'server');
    if (fs.existsSync(serverDir)) {
      console.log('server directory exists');
      const serverFiles = fs.readdirSync(serverDir);
      console.log('server directory contents:', serverFiles);
    } else {
      console.log('server directory is missing - indicates incomplete build');
    }
    
    // Check standalone directory (for standalone output mode)
    const standaloneDir = path.join(nextDir, 'standalone');
    if (fs.existsSync(standaloneDir)) {
      console.log('standalone directory exists - standalone output mode detected');
      const standaloneFiles = fs.readdirSync(standaloneDir);
      console.log('standalone directory contents:', standaloneFiles);
    }
  } catch (e) {
    console.error('Error reading .next:', e.message);
  }
} else {
  console.log('.next directory NOT FOUND at:', nextDir);
}

// Check for server.js and startup script
console.log('\n=== SERVER FILES CHECK ===');
if (fs.existsSync('server.js')) {
  console.log('server.js exists');
  try {
    // Get the first few lines to see what kind of server it is
    const serverContent = fs.readFileSync('server.js', 'utf8').split('\n').slice(0, 5).join('\n');
    console.log('server.js first 5 lines:', serverContent);
  } catch (e) {
    console.error('Error reading server.js:', e.message);
  }
} else {
  console.log('WARNING: server.js NOT FOUND');
}

// Check for startup.sh
if (fs.existsSync('startup.sh')) {
  console.log('startup.sh exists');
  try {
    // Check if it's executable
    try {
      fs.accessSync('startup.sh', fs.constants.X_OK);
      console.log('startup.sh is executable');
    } catch (e) {
      console.log('WARNING: startup.sh is not executable, fixing permissions...');
      try {
        execSync('chmod +x startup.sh');
        console.log('Permissions fixed for startup.sh');
      } catch (chmodErr) {
        console.error('Failed to fix permissions:', chmodErr.message);
      }
    }
  } catch (e) {
    console.error('Error checking startup.sh:', e.message);
  }
} else {
  console.log('WARNING: startup.sh NOT FOUND');
}

// Check package.json for scripts
console.log('\n=== PACKAGE.JSON CHECK ===');
if (fs.existsSync('package.json')) {
  try {
    const packageJson = require('./package.json');
    console.log('Package name:', packageJson.name);
    console.log('Scripts:', packageJson.scripts);
    console.log('Dependencies:', Object.keys(packageJson.dependencies).length, 'total');
    console.log('Next.js dependency:', packageJson.dependencies.next);
    console.log('Node.js engine requirement:', packageJson.engines?.node);
  } catch (e) {
    console.error('Error reading package.json:', e.message);
  }
} else {
  console.log('WARNING: package.json NOT FOUND');
}

// Attempt to fix any issues found
console.log('\n=== ATTEMPTING AUTOMATIC FIXES ===');

// Fix 1: Build the application if .next is missing
if (!fs.existsSync('.next')) {
  console.log('FIXING: .next directory missing - attempting build...');
  try {
    console.log('Running next build...');
    execSync('npx next build', { stdio: 'inherit' });
    console.log('Build completed successfully!');
    
    // Verify build succeeded
    if (fs.existsSync('.next') && fs.existsSync('.next/BUILD_ID')) {
      console.log('Build verification: SUCCESS - .next directory created');
    } else {
      console.log('Build verification: FAILED - .next directory still missing or incomplete');
    }
  } catch (buildError) {
    console.error('Build attempt failed:', buildError.message);
    console.log('Trying alternative build method...');
    
    try {
      execSync('node node_modules/next/dist/bin/next build', { stdio: 'inherit' });
      console.log('Alternative build method succeeded!');
    } catch (altBuildError) {
      console.error('Alternative build method also failed:', altBuildError.message);
      console.log('Creating emergency .next directory structure...');
      
      try {
        fs.mkdirSync('.next/server/pages', { recursive: true });
        fs.writeFileSync('.next/BUILD_ID', 'emergency-' + Date.now());
        console.log('Created emergency .next structure');
      } catch (emergencyError) {
        console.error('Failed to create emergency structure:', emergencyError.message);
      }
    }
  }
}

// Fix 2: Make sure scripts are executable
['server.js', 'startup.sh'].forEach(script => {
  if (fs.existsSync(script)) {
    try {
      fs.accessSync(script, fs.constants.X_OK);
      console.log(`${script} is already executable`);
    } catch (e) {
      console.log(`FIXING: Making ${script} executable...`);
      try {
        execSync(`chmod +x ${script}`);
        console.log(`${script} is now executable`);
      } catch (chmodErr) {
        console.error(`Failed to make ${script} executable:`, chmodErr.message);
      }
    }
  }
});

// Try to start the server
console.log('\n=== ATTEMPTING TO START SERVER ===');
try {
  if (fs.existsSync('server.js')) {
    console.log('Starting server from server.js...');
    require('./server.js');
  } else {
    console.error('Cannot start server: server.js not found');
    
    // Try with next start as fallback
    console.log('Attempting fallback: next start...');
    try {
      const port = process.env.PORT || 3000;
      execSync(`npx next start -p ${port}`, { stdio: 'inherit' });
    } catch (nextStartError) {
      console.error('next start also failed:', nextStartError.message);
      process.exit(1);
    }
  }
} catch (e) {
  console.error('Server startup failed:', e.message);
  console.error('Stack trace:', e.stack);
  process.exit(1);
}
