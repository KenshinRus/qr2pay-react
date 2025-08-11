#!/bin/bash

# This is a special build script for Azure deployment
echo "=== AZURE BUILD SCRIPT RUNNING ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Set environment variables
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1

# Install dependencies
echo "=== INSTALLING DEPENDENCIES ==="
npm ci --no-audit || npm install --no-audit

# Build Next.js application
echo "=== BUILDING NEXT.JS APPLICATION ==="
npx next build

# Check if build succeeded
if [ -d ".next" ] && [ -f ".next/BUILD_ID" ]; then
    echo "=== BUILD SUCCESSFUL ==="
    echo "BUILD_ID: $(cat .next/BUILD_ID)"
    
    # List .next directory contents
    echo "=== .NEXT DIRECTORY CONTENTS ==="
    ls -la .next
    
    echo "=== BUILD SCRIPT COMPLETED SUCCESSFULLY ==="
    exit 0
else
    echo "=== BUILD FAILED - .NEXT DIRECTORY NOT CREATED ==="
    exit 1
fi
