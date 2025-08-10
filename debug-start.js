const fs = require('fs');
const path = require('path');

console.log('Debug startup script running...');
console.log('Current directory:', process.cwd());
console.log('Environment NODE_ENV:', process.env.NODE_ENV);
console.log('Process argv:', process.argv);

// List directory contents
console.log('\n=== Directory listing ===');
try {
  const files = fs.readdirSync('.');
  files.forEach(file => {
    const stat = fs.statSync(file);
    console.log(`${stat.isDirectory() ? 'DIR' : 'FILE'}: ${file}`);
  });
} catch (e) {
  console.error('Error listing directory:', e.message);
}

// Check for .next directory
console.log('\n=== .next directory check ===');
if (fs.existsSync('.next')) {
  console.log('.next directory exists');
  try {
    const nextFiles = fs.readdirSync('.next');
    console.log('.next contents:', nextFiles);
    
    // Check BUILD_ID
    if (fs.existsSync('.next/BUILD_ID')) {
      console.log('BUILD_ID exists, content:', fs.readFileSync('.next/BUILD_ID', 'utf8').trim());
    }
    
    // Check server directory
    if (fs.existsSync('.next/server')) {
      console.log('server directory exists');
      const serverFiles = fs.readdirSync('.next/server');
      console.log('server directory contents:', serverFiles);
    }
  } catch (e) {
    console.error('Error reading .next:', e.message);
  }
} else {
  console.log('.next directory NOT FOUND');
}

// Check for server.js
console.log('\n=== server.js check ===');
if (fs.existsSync('server.js')) {
  console.log('server.js exists');
  const stat = fs.statSync('server.js');
  console.log('server.js size:', stat.size, 'bytes');
} else {
  console.log('server.js NOT FOUND');
}

// Check package.json
console.log('\n=== package.json check ===');
if (fs.existsSync('package.json')) {
  console.log('package.json exists');
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('package.json scripts:', pkg.scripts);
  } catch (e) {
    console.error('Error reading package.json:', e.message);
  }
} else {
  console.log('package.json NOT FOUND');
}

// Try to start the actual server
console.log('\n=== Attempting to start server ===');
try {
  if (fs.existsSync('server.js')) {
    console.log('Starting server...');
    require('./server.js');
  } else {
    console.error('Cannot start server: server.js not found');
    process.exit(1);
  }
} catch (e) {
  console.error('Server startup failed:', e.message);
  console.error('Stack trace:', e.stack);
  process.exit(1);
}
