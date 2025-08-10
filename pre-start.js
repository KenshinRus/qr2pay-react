// Azure App Service startup script
// This script is used to prepare the environment before the main server.js runs

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Azure Pre-start script running...');

// Set environment variables
process.env.NODE_ENV = 'production';

try {
  // Check if .next directory exists
  if (!fs.existsSync('.next')) {
    console.log('.next directory not found - running build...');
    
    // Install dependencies if needed
    if (!fs.existsSync('node_modules') || !fs.existsSync('node_modules/.package-lock.json')) {
      console.log('Installing dependencies...');
      execSync('npm ci --no-audit', { stdio: 'inherit' });
    }
    
    // Build the application
    console.log('Building Next.js application...');
    execSync('npx next build', { stdio: 'inherit' });
    
    console.log('Build completed.');
  } else {
    console.log('.next directory exists, skipping build.');
  }
  
  console.log('Pre-start script completed successfully.');
} catch (error) {
  console.error('Error in pre-start script:', error.message);
  console.error(error.stack);
}
