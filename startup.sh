#!/bin/bash

echo "=================================================="
echo "QR2Pay Next.js Azure Startup Script - $(date)"
echo "=================================================="

# Set the port if not already set
if [ -z "$PORT" ]; then
    export PORT=8080
fi

# Make sure we're in the correct directory
cd /home/site/wwwroot
echo "Working directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# IMPORTANT: Display current directory contents for debugging
echo "Directory listing:"
ls -la

# ALWAYS force a build for consistency
echo "=================================================="
echo "BUILDING NEXT.JS APPLICATION"
echo "=================================================="

# First install dependencies if they don't exist
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "Installing dependencies with npm ci..."
    npm ci --no-audit --no-optional
    echo "Dependencies installed."
fi

# Always force a rebuild to ensure we have a fresh .next directory
echo "Building Next.js application with next build..."
NODE_ENV=production npx next build
BUILD_EXIT_CODE=$?

# Check if build succeeded
if [ $BUILD_EXIT_CODE -ne 0 ]; then
    echo "ERROR: Next.js build failed with exit code $BUILD_EXIT_CODE"
    exit 1
fi

# Check if .next directory was created
if [ ! -d ".next" ]; then
    echo "ERROR: Build appeared to succeed but .next directory is missing"
    exit 1
fi

echo "Next.js build completed successfully."
echo "Contents of .next directory:"
ls -la .next

# Check for standalone mode (which is configured in next.config.ts)
if [ -d ".next/standalone" ]; then
    echo "Detected standalone output mode. Starting standalone server..."
    cd .next/standalone
    
    # Copy static files and public directory to standalone directory
    echo "Copying static assets..."
    mkdir -p ./static
    mkdir -p ./public
    
    if [ -d "../static" ]; then
        echo "Copying .next/static files..."
        cp -r ../static/* ./static/ 2>/dev/null || echo "No static files to copy"
    fi
    
    if [ -d "../../public" ]; then
        echo "Copying public files..."
        cp -r ../../public/* ./public/ 2>/dev/null || echo "No public files to copy"
    fi
    
    echo "Starting standalone server from $(pwd)..."
    exec node server.js
else
    # Use regular Next.js server
    echo "Using standard Next.js server..."
    cd /home/site/wwwroot
    echo "Starting server from $(pwd)..."
    exec node server.js
fi
