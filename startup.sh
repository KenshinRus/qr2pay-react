#!/bin/bash

# startup.sh - Azure App Service startup script
echo "Starting application startup process..."

# Check if we're in production mode
if [ "$NODE_ENV" = "production" ]; then
    echo "Production mode detected"
    
    # Check if .next directory exists and has build files
    if [ ! -f ".next/BUILD_ID" ]; then
        echo "No production build found. Building application..."
        npm run build
        
        if [ $? -ne 0 ]; then
            echo "Build failed! Exiting..."
            exit 1
        fi
        
        echo "Build completed successfully"
    else
        echo "Production build found, skipping build step"
    fi
fi

echo "Starting server..."
exec node server.js
