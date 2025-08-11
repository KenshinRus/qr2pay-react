# Azure Deployment Instructions for QR2Pay React

## Updated Deployment Approach

Our refined approach addresses the common issue with Next.js deployments on Azure App Service: **"Could not find a production build in the './.next' directory"**.

### Two Approaches to Fix This Issue

#### Approach 1: Build During Deployment (Preferred)

1. Configure GitHub Actions to build the Next.js app during CI/CD
2. Deploy the pre-built application to Azure
3. Set the startup command to `node server.js`

#### Approach 2: Build at Runtime (Backup)

1. Deploy the full source code to Azure
2. Use a custom server.js and startup.sh to build at runtime
3. Set the startup command to `bash startup.sh` or `node server.js`

## Environment Variables for Azure

Add these to your Azure App Service Configuration → Application Settings:

```bash
NEXT_PUBLIC_BASE_URL=https://yourdomain.azurewebsites.net
SYMMETRIC_KEY=your-symmetric-key
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NODE_ENV=production
PORT=8080
WEBSITE_NODE_DEFAULT_VERSION=22.17.0
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

## GitHub Actions Workflow Configuration

For the preferred approach, ensure your GitHub Actions workflow:

1. Builds the Next.js app with `npm run build`
2. Handles standalone output mode properly
3. Deploys the built application to Azure

```yaml
name: Build and deploy Node.js app to Azure Web App

on:
  push:
    branches: [ "master" ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.x'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build Next.js app
        run: npm run build
        
      - name: Upload artifact for deployment
        uses: actions/upload-artifact@v3
        with:
          name: node-app
          path: |
            .next
            public
            package.json
            server.js
            startup.sh
```

## Key Files Updated

- `server.js` - Enhanced to handle build and server startup
- `startup.sh` - Added for container environment startup
- `package.json` - Updated scripts and added Node.js engine requirements
- `next.config.ts` - Configured for standalone output

## Deployment Options in Azure

### Option 1: Using GitHub Actions Deployment

Configure your Azure Web App deployment settings:

1. Go to your Web App → Deployment Center
2. Select GitHub
3. Connect to your repository and branch
4. Configure the GitHub Actions workflow

### Option 2: Direct Azure App Service Deployment

Set the startup command in Configuration → General settings:

```bash
bash -c "cd /home/site/wwwroot && npm run build && node server.js"
```

For more robust startup with detailed logging:

```bash
bash -c "cd /home/site/wwwroot && echo 'Directory contents:' && ls -la && echo 'Building app...' && npm run build && echo 'Starting server...' && node server.js"
```

For advanced diagnostics and auto-fixing (RECOMMENDED):

```bash
node debug-start.js
```

## Troubleshooting

### Handling the "Could not find a production build in the './.next' directory" Error

If you see this specific error in your logs:

```plaintext
[Error: Could not find a production build in the './.next' directory. Try building your app with 'next build' before starting the production server.]
```

This indicates that the Next.js server is starting before the application has been built. Try these specific solutions:

1. **Use the debug-start.js script (RECOMMENDED)**:
   - In Azure Portal → Configuration → General Settings → Startup Command, use:
   
   ```bash
   node debug-start.js
   ```
   
   This script will:
   - Perform detailed diagnostics of your deployment
   - Automatically attempt to build the Next.js application
   - Fix common permission issues
   - Start the server with fallback mechanisms

2. **Force the build in the startup command**:
   - In Azure Portal → Configuration → General Settings → Startup Command, use:
   
   ```bash
   bash -c "cd /home/site/wwwroot && npm run build && node server.js"
   ```

2. **Check GitHub Actions workflow**:
   - Ensure your workflow includes a specific build step:
   ```yaml
   - name: Build Next.js app
     run: npm run build
   ```
   - And that it uploads the `.next` directory as part of the artifact

3. **Check the presence of .next directory**:
   - Connect to the Kudu console (https://yourapp.scm.azurewebsites.net/DebugConsole)
   - Navigate to `/home/site/wwwroot`
   - Check if the `.next` directory exists and has content with `ls -la .next`

4. **Verify startup command execution**:
   - Add explicit logging to your startup command:
   ```bash
   bash -c "cd /home/site/wwwroot && echo 'PWD: $(pwd)' && echo 'Building...' && npm run build && echo 'Build completed' && node server.js"
   ```
   - Check logs to confirm each step is executing

5. **Check file permissions**:
   - Ensure server.js and startup.sh are executable
   - Verify the application has write permissions to create the `.next` directory
   - Run `chmod +x server.js startup.sh` in Kudu console if needed

The recommended approach is to build during deployment (CI/CD) rather than at runtime for better performance and reliability.
