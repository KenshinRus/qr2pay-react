const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

// Log the environment for debugging
console.log('Starting server.js');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', process.cwd());

// Check if .next directory exists
if (!existsSync(path.join(process.cwd(), '.next'))) {
  console.log('.next directory not found. Running next build...');
  try {
    // Run next build
    execSync('npx next build', { stdio: 'inherit' });
    console.log('Build completed successfully');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('.next directory found, skipping build step');
}

// Start the Next.js server
console.log('Starting Next.js server...');
try {
  // Use the standard Next.js server
  require('next/dist/server/production-server');
} catch (error) {
  console.error('Failed to start Next.js server:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
