This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Configuration

The application supports two environments for key management:

1. **Local Development**: Keys are read from local files in the `res/` directory
2. **Production (Azure)**: Keys are retrieved from Azure Key Vault

To configure the environment:

1. Copy `.env.example` to `.env.local`
2. For Azure Key Vault integration:
   - Set `NODE_ENV=production`
   - Configure your Azure Key Vault details:
   
   ```env
   AZURE_KEY_VAULT_NAME=your-key-vault-name
   PRIVATE_KEY_SECRET_NAME=private-key
   PUBLIC_KEY_SECRET_NAME=public-key
   ```

### Running the Application

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



