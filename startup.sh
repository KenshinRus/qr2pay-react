#!/bin/bash

# Set the port if not already set
if [ -z "$PORT" ]; then
    export PORT=8080
fi

echo "Starting application on port $PORT"

# Check if standalone build exists
if [ ! -f "/home/site/wwwroot/.next/standalone/server.js" ]; then
    echo "Standalone build not found. Building application..."
    cd /home/site/wwwroot
    npm run build
fi

# Start the standalone server
echo "Starting Next.js standalone server..."
cd /home/site/wwwroot
node .next/standalone/server.js
