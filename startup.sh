#!/bin/bash

echo "=================================================="
echo "QR2Pay Next.js Azure Startup Script v2 - $(date)"
echo "=================================================="

# Ensure script doesn't exit on error
set +e

# Helper function for diagnostic output
function log_diagnostic {
    echo "=================================================="
    echo "DIAGNOSTIC: $1"
    echo "=================================================="
}

# Set the port if not already set
if [ -z "$PORT" ]; then
    export PORT=8080
fi

# Make sure we're in the correct directory
cd /home/site/wwwroot
log_diagnostic "Working directory: $(pwd)"
log_diagnostic "Node version: $(node -v)"
log_diagnostic "NPM version: $(npm -v)"
log_diagnostic "Available disk space: $(df -h . | tail -1)"

# Check permissions in current directory
log_diagnostic "Directory permissions:"
ls -la
log_diagnostic "Can we write to current directory? $(touch test_write && echo "Yes" || echo "No")"
[ -f "test_write" ] && rm test_write

# Check for any existing .next directory
if [ -d ".next" ]; then
    log_diagnostic "Found existing .next directory:"
    ls -la .next
    
    # Check build ID
    if [ -f ".next/BUILD_ID" ]; then
        log_diagnostic "Existing BUILD_ID: $(cat .next/BUILD_ID)"
    else
        log_diagnostic "No BUILD_ID found in existing .next directory"
    fi
else
    log_diagnostic "No existing .next directory"
fi

# Check next.config
if [ -f "next.config.ts" ]; then
    log_diagnostic "next.config.ts exists:"
    cat next.config.ts
elif [ -f "next.config.js" ]; then
    log_diagnostic "next.config.js exists:"
    cat next.config.js
else
    log_diagnostic "No next.config.* file found!"
fi

# ALWAYS force a build for consistency
log_diagnostic "BUILDING NEXT.JS APPLICATION"

# Create a clean environment for building
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# First make sure we have node_modules
if [ ! -d "node_modules" ] || [ ! -f "node_modules/next/package.json" ]; then
    log_diagnostic "Installing dependencies..."
    npm ci --no-audit --no-optional --prefer-offline || npm install --no-audit --no-optional
    log_diagnostic "Dependencies installed. node_modules contents:"
    ls -la node_modules | head -20
fi

# Clean any existing partial build
if [ -d ".next" ]; then
    log_diagnostic "Removing existing .next directory..."
    rm -rf .next
fi

# Build using different approaches, try until one works
log_diagnostic "Building Next.js application - attempt 1..."
npx next build
BUILD_EXIT_CODE=$?

# If that failed, try with explicit node call
if [ $BUILD_EXIT_CODE -ne 0 ] || [ ! -d ".next" ]; then
    log_diagnostic "First build attempt failed with code $BUILD_EXIT_CODE. Trying different approach..."
    
    # Try direct node execution
    log_diagnostic "Building Next.js application - attempt 2 with direct node call..."
    node node_modules/next/dist/bin/next build
    BUILD_EXIT_CODE=$?
fi

# If still failed, try with NODE_OPTIONS
if [ $BUILD_EXIT_CODE -ne 0 ] || [ ! -d ".next" ]; then
    log_diagnostic "Second build attempt failed with code $BUILD_EXIT_CODE. Trying with memory options..."
    
    # Try with increased memory limit
    export NODE_OPTIONS="--max-old-space-size=2048"
    log_diagnostic "Building Next.js application - attempt 3 with increased memory..."
    npx next build
    BUILD_EXIT_CODE=$?
fi

# Final check if build succeeded
if [ ! -d ".next" ]; then
    log_diagnostic "ERROR: All build attempts failed. .next directory is missing"
    log_diagnostic "Creating minimal .next directory for debugging..."
    
    # Create a minimal .next directory for testing
    mkdir -p .next/server/pages
    echo "test-build-id" > .next/BUILD_ID
    
    # Check if we can create the directory
    if [ -d ".next" ]; then
        log_diagnostic "Successfully created test .next directory. This suggests a permissions/disk issue."
    else
        log_diagnostic "Could not create test .next directory. This suggests severe permission issues."
        exit 1
    fi
else
    log_diagnostic "Next.js build completed. Contents of .next directory:"
    ls -la .next
    
    # Show build ID
    if [ -f ".next/BUILD_ID" ]; then
        log_diagnostic "BUILD_ID: $(cat .next/BUILD_ID)"
    else
        log_diagnostic "WARNING: No BUILD_ID found, creating one for testing..."
        echo "manual-build-id-$(date +%s)" > .next/BUILD_ID
    fi
fi

# Check for standalone mode (which is configured in next.config)
if [ -d ".next/standalone" ]; then
    log_diagnostic "Detected standalone output mode. Starting standalone server..."
    cd .next/standalone
    
    # Copy static files and public directory to standalone directory
    log_diagnostic "Copying static assets..."
    mkdir -p ./static
    mkdir -p ./public
    
    if [ -d "../static" ]; then
        log_diagnostic "Copying .next/static files..."
        cp -r ../static/* ./static/ 2>/dev/null || log_diagnostic "Error copying static files"
    fi
    
    if [ -d "../../public" ]; then
        log_diagnostic "Copying public files..."
        cp -r ../../public/* ./public/ 2>/dev/null || log_diagnostic "Error copying public files"
    fi
    
    log_diagnostic "Starting standalone server from $(pwd)..."
    
    # Instead of direct exec, try with more error handling
    node server.js || log_diagnostic "Standalone server failed to start"
else
    # Use regular Next.js server with fallback mechanisms
    log_diagnostic "No standalone output detected. Using standard Next.js server..."
    cd /home/site/wwwroot
    
    # Try with direct next start first
    log_diagnostic "Starting server with 'next start' from $(pwd)..."
    npx next start -p $PORT || node node_modules/next/dist/bin/next start -p $PORT
fi

# This is a fallback in case everything else fails
log_diagnostic "If you see this message, the server has crashed. Trying fallback next start..."
cd /home/site/wwwroot
exec npx next start -p $PORT
