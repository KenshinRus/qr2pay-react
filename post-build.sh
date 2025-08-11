#!/bin/bash

echo "Running post-build script..."

# Ensure the build was successful
if [ ! -f ".next/BUILD_ID" ]; then
    echo "Warning: No BUILD_ID found, running build..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "Build failed in post-build script!"
        exit 1
    fi
fi

echo "Post-build script completed successfully"
