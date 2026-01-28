#!/bin/bash

# startup.sh - Azure App Service startup script
# Supports both production and test environments
echo "Starting application startup process..."
echo "NODE_ENV: $NODE_ENV"

# Validate environment
if [ "$NODE_ENV" != "production" ] && [ "$NODE_ENV" != "test" ]; then
    echo "Error: NODE_ENV must be 'production' or 'test' (got: '$NODE_ENV')"
    exit 1
fi

# Check if .next directory exists and has build files
if [ ! -f ".next/BUILD_ID" ]; then
    echo "No build found. Building application..."
    npm run build

    if [ $? -ne 0 ]; then
        echo "Build failed! Exiting..."
        exit 1
    fi

    echo "Build completed successfully"
else
    BUILD_ID=$(cat .next/BUILD_ID)
    echo "Build found (BUILD_ID: $BUILD_ID), skipping build step"
fi

echo "Starting server..."
exec node server.js
