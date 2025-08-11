#!/bin/bash

echo "=================================================="
echo "QR2Pay Next.js Azure Startup Script v3 - $(date)"
echo "=================================================="

# Set environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Set the port if not already set
if [ -z "$PORT" ]; then
    export PORT=8080
fi

# Make sure we're in the correct directory
cd /home/site/wwwroot
echo "Working directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Display the current directory contents
echo "Directory contents:"
ls -la

# SIMPLE BUILD STEP - Always build before starting
echo "=================================================="
echo "BUILDING NEXT.JS APPLICATION"
echo "=================================================="

# Install dependencies if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/next/package.json" ]; then
    echo "Installing dependencies..."
    npm ci --no-audit || npm install --no-audit
fi

# Always run the build
echo "Running Next.js build..."
npx next build

# Check if build succeeded
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
    echo "Build successful! BUILD_ID: $(cat .next/BUILD_ID)"
else
    echo "Build did not create proper .next directory. Creating minimal structure..."
    mkdir -p .next/server/pages
    echo "emergency-build-id-$(date +%s)" > .next/BUILD_ID
fi

# Show the contents of .next directory
echo ".next directory contents:"
ls -la .next

# Check for standalone mode (configured in next.config.ts)
if [ -d ".next/standalone" ]; then
    echo "Detected standalone output mode. Starting standalone server..."
    cd .next/standalone
    
    # Create directories if they don't exist
    mkdir -p ./static
    mkdir -p ./public
    
    # Copy static files
    if [ -d "../static" ]; then
        echo "Copying static files..."
        cp -r ../static/* ./static/ 2>/dev/null || echo "No static files to copy"
    fi
    
    # Copy public files
    if [ -d "../../public" ]; then
        echo "Copying public files..."
        cp -r ../../public/* ./public/ 2>/dev/null || echo "No public files to copy"
    fi
    
    echo "Starting standalone server from $(pwd)..."
    node server.js
else
    # Use regular Next.js server
    echo "No standalone output detected. Using regular Next.js server..."
    cd /home/site/wwwroot
    echo "Starting server from $(pwd)..."
    npx next start -p $PORT || node server.js
fi
