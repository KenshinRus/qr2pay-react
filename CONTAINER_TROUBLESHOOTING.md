# Azure App Service Container Troubleshooting Guide

This guide addresses common issues when deploying Next.js applications to Azure App Service containers, particularly focusing on the error: **"Could not find a production build in the './.next' directory"**.

## Understanding Azure App Service Container Environment

Azure App Service for Node.js applications uses containers with specific behaviors:

1. **File System**: The app is deployed to `/home/site/wwwroot`
2. **Node Modules**: Often stored in `/node_modules` (system-wide) or extracted at runtime
3. **Startup**: Azure uses either PM2 or custom startup commands
4. **Build Process**: By default, does NOT build Next.js at deployment time

## Common Issues & Solutions

### Issue 1: Missing .next Directory

**Error Message:**

```plaintext
Error: Could not find a production build in the './.next' directory. Try building your app with 'next build' before starting the production server.
```

**Causes:**

- Next.js application wasn't built before deployment
- Build failed during deployment
- `.next` directory is not included in the deployment package

**Solutions:**

1. **Pre-build and deploy the built application:**

   ```bash
   npm run build
   # Deploy the entire application including .next directory
   ```

2. **Force build at runtime with custom server.js:**

   ```javascript
   // Check if .next exists, if not, build it
   if (!fs.existsSync('.next')) {
     require('child_process').execSync('npm run build');
   }
   ```

3. **Use startup.sh script to build before starting:**

   ```bash
   #!/bin/bash
   if [ ! -d ".next" ]; then
     echo "Building Next.js application..."
     npx next build
   fi
   node server.js
   ```

### Issue 2: Node.js Version Conflicts

**Error Messages:**

```plaintext
Error: The module was compiled against a different Node.js version
```

**Solutions:**

1. Set `WEBSITE_NODE_DEFAULT_VERSION` in App Settings

2. Specify Node.js version in package.json:

   ```json
   "engines": {
     "node": "22.x",
     "npm": "10.x"
   }
   ```

### Issue 3: Permission Issues

**Error Messages:**

```plaintext
Error: EACCES: permission denied, access '/home/site/wwwroot/.next'
```

**Solutions:**

1. Create directories with proper permissions:

   ```bash
   mkdir -p .next/server/pages
   chmod -R 755 .next
   ```

2. Use process.cwd() to ensure correct paths:

   ```javascript
   const nextDir = path.join(process.cwd(), '.next');
   ```

### Issue 4: Standalone Mode Configuration

When using Next.js standalone output mode (`output: 'standalone'` in next.config.js):

**Solutions:**

1. Copy static assets to standalone directory:

   ```bash
   cp -r .next/static .next/standalone/static
   cp -r public .next/standalone/public
   ```

2. Start from the standalone directory:

   ```bash
   cd .next/standalone
   node server.js
   ```

## Debugging Techniques

### 1. Enable Diagnostic Logging

Add to your startup.sh or server.js:

```bash
# Log environment information
echo "NODE_ENV: $NODE_ENV"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"
echo "Node version: $(node -v)"
```

### 2. Check Azure Log Stream

1. Go to Azure Portal → Your App Service → Monitoring → Log stream
2. Watch logs in real-time during startup

### 3. Inspect Container File System

Use the Kudu console (available at `https://<your-app-name>.scm.azurewebsites.net/DebugConsole`):

1. Navigate to `/home/site/wwwroot`
2. Check if `.next` directory exists and has content
3. Verify file permissions with `ls -la`

### 4. Test Build Process Locally

Simulate Azure environment locally:

```bash
# Clear any existing build
rm -rf .next
# Try building
npm run build
# Check the output directory
ls -la .next
```

## Best Practices

1. **Use GitHub Actions** for CI/CD with proper build steps
2. **Pre-build your application** before deployment
3. **Include robust error handling** in startup scripts
4. **Use custom server.js** with fallback mechanisms
5. **Set explicit Node.js version** in App Settings and package.json

## Final Checklist

- ✅ Next.js built before deployment or at startup
- ✅ Correct Node.js version configured
- ✅ Startup command properly set
- ✅ All environment variables configured
- ✅ Static assets properly handled (especially in standalone mode)
- ✅ Permission issues addressed