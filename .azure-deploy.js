// Azure deployment helper script
// This script can be used for pre-deployment tasks
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Azure Deployment Helper Script - Next.js');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Verify the environment
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Create an oryx_prod_node_build file to inform Azure's build system
// that we're handling the build ourselves
fs.writeFileSync('.oryx_prod_node_build', 'true');

// Create a .env file if it doesn't exist
if (!fs.existsSync('.env')) {
  console.log('Creating .env file for Azure environment...');
  fs.writeFileSync('.env', 'NODE_ENV=production\nNEXT_TELEMETRY_DISABLED=1\n');
}

// Make sure startup.sh is executable
try {
  fs.chmodSync('startup.sh', '755');
  console.log('Made startup.sh executable');
} catch (error) {
  console.log('Note: Could not make startup.sh executable:', error.message);
}

// Create a .profile script for startup - Azure may execute this during container startup
try {
  fs.writeFileSync('.profile', `#!/bin/bash
echo "Running .profile script"
chmod +x /home/site/wwwroot/startup.sh
`);
  fs.chmodSync('.profile', '755');
  console.log('Created .profile script');
} catch (error) {
  console.log('Note: Could not create .profile script:', error.message);
}

console.log('Azure deployment helper script completed');
