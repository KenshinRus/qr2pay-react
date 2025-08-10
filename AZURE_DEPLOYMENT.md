# Azure Deployment Instructions

## Issues Fixed

1. **Removed problematic `postinstall` script** that was trying to run `next build` at runtime
2. **Updated GitHub Actions workflow** to properly build and deploy Next.js standalone output
3. **Fixed Next.js configuration** to use the correct `serverExternalPackages` instead of deprecated experimental option

## GitHub Actions Changes

The workflow now:
1. Builds the Next.js app with `npm run build`
2. Copies static files to the standalone directory
3. Creates a minimal production package.json
4. Deploys only the standalone directory to Azure
5. Sets the startup command to `node server.js`

## Environment Variables for Azure

Add these to your Azure App Service Configuration → Application Settings:

```
NEXT_PUBLIC_BASE_URL=https://qr2pay-app.azurewebsites.net
SYMMETRIC_KEY=6rdP4tewX/f7Do96XOFvKtfSwLrmbDTZiBtuF7d4To4=
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NODE_ENV=production
PORT=8080
```

## Deployment Steps

1. Push these changes to your `master` branch
2. The GitHub Actions workflow will automatically:
   - Build the Next.js app
   - Create the standalone deployment package
   - Deploy to Azure Web Service
3. Check the Azure App Service logs to verify deployment

## Key Files Changed

- `.github/workflows/master_qr2pay-app.yml` - Updated deployment workflow
- `package.json` - Removed postinstall, added engines
- `next.config.ts` - Fixed deprecated config options
- `.env.production.template` - Environment variables template

## Troubleshooting

If you still see issues:
1. Check Azure App Service logs
2. Verify environment variables are set correctly
3. Ensure the startup command is set to `node server.js`
4. Check that the deployment artifact contains the `server.js` file

The key fix is that we're now deploying the pre-built standalone application instead of trying to build it on Azure, which eliminates the "next: not found" error.
