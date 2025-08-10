#!/bin/bash

# Set the port if not already set
if [ -z "$PORT" ]; then
    export PORT=8080
fi

cd /home/site/wwwroot
echo "Starting application on port $PORT from $(pwd)"

# Display files for debugging
echo "Listing current directory:"
ls -la
echo "Checking .next directory:"
if [ -d ".next" ]; then
    ls -la .next
    if [ -d ".next/standalone" ]; then
        echo "Standalone directory exists:"
        ls -la .next/standalone
    else
        echo "Standalone directory NOT found"
    fi
else
    echo ".next directory NOT found"
fi

# Force build in case .next/standalone doesn't exist
if [ ! -d ".next/standalone" ]; then
    echo "Standalone build not found. Building application..."
    npm ci --no-audit
    npm run build
fi

# Check if build succeeded
if [ -f ".next/standalone/server.js" ]; then
    # Start the standalone server
    echo "Starting Next.js standalone server..."
    cd .next/standalone
    cp -r ../static ./
    cp -r ../../public ./
    node server.js
else
    echo "Standalone server.js not found after build, using regular server.js"
    cd /home/site/wwwroot
    node server.js
fi
