#!/bin/bash
# deploy-check.sh - Azure App Service deployment verification script

echo "=== Azure App Service Deployment Check ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"

echo ""
echo "=== Directory Structure ==="
ls -la

echo ""
echo "=== Node Modules Status ==="
if [ -d "node_modules" ]; then
    echo "Local node_modules exists"
    ls -la node_modules/.bin/next || echo "next binary not found in local node_modules"
elif [ -d "/node_modules" ]; then
    echo "Global node_modules exists at /node_modules"
    ls -la /node_modules/.bin/next || echo "next binary not found in global node_modules"
else
    echo "No node_modules found"
fi

echo ""
echo "=== Build Artifacts Check ==="
if [ -d ".next" ]; then
    echo ".next directory exists"
    ls -la .next/
    if [ -f ".next/BUILD_ID" ]; then
        echo "BUILD_ID found: $(cat .next/BUILD_ID)"
    else
        echo "BUILD_ID not found"
    fi
else
    echo ".next directory does not exist"
fi

echo ""
echo "=== Environment Variables ==="
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "PATH: $PATH"
echo "NODE_PATH: $NODE_PATH"

echo ""
echo "=== Package.json scripts ==="
if [ -f "package.json" ]; then
    node -e "console.log(JSON.stringify(require('./package.json').scripts, null, 2))"
else
    echo "No package.json found"
fi

echo "=== End Deployment Check ==="
