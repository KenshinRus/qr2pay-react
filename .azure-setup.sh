# Azure App Service Deployment Script
# This file helps configure Azure App Service for Next.js applications

# Path of the current directory
echo "Setting up Next.js application for Azure App Service..."

# Ensure Next.js config is set up correctly for Azure
if [ -f "next.config.ts" ] || [ -f "next.config.js" ]; then
  echo "Next.js config file found."
else
  echo "WARNING: No Next.js config file found!"
fi

# Create a .env file for Azure if it doesn't exist
if [ ! -f ".env" ]; then
  echo "Creating .env file for Azure environment..."
  echo "# Azure Environment Variables" > .env
  echo "NODE_ENV=production" >> .env
fi

# Make sure startup.sh is executable
if [ -f "startup.sh" ]; then
  echo "Making startup.sh executable..."
  chmod +x startup.sh
fi

echo "Azure deployment setup completed."
