#!/bin/bash
# This script runs at container startup on Azure App Service Linux

echo "Running .profile startup script - $(date)"

# Make startup.sh executable 
if [ -f "/home/site/wwwroot/startup.sh" ]; then
    echo "Making startup.sh executable"
    chmod +x /home/site/wwwroot/startup.sh
fi

# Check for .next directory
if [ ! -d "/home/site/wwwroot/.next" ]; then
    echo ".next directory not found, this could cause startup issues"
else
    echo ".next directory exists with files:"
    ls -la /home/site/wwwroot/.next | head -10
fi

echo ".profile script completed"
