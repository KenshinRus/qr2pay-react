// lib/keyManager.ts
import fs from 'fs';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Azure Key Vault configuration
const keyVaultName = process.env.AZURE_KEY_VAULT_NAME || '';
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
const privateKeySecretName = process.env.PRIVATE_KEY_SECRET_NAME || 'private-key';
const publicKeySecretName = process.env.PUBLIC_KEY_SECRET_NAME || 'public-key';

// File paths for local development
const privateKeyPath = './res/key.pem';
const publicKeyPath = './res/public.key';

/**
 * Gets private key from either Azure Key Vault in production or from local file in development
 */
export async function getPrivateKey(): Promise<string> {
  if (isProduction) {
    return await getKeyFromKeyVault(privateKeySecretName);
  } else {
    return fs.readFileSync(privateKeyPath, 'utf8');
  }
}

/**
 * Gets public key from either Azure Key Vault in production or from local file in development
 */
export async function getPublicKey(): Promise<string> {
  if (isProduction) {
    return await getKeyFromKeyVault(publicKeySecretName);
  } else {
    return fs.readFileSync(publicKeyPath, 'utf8');
  }
}

/**
 * Retrieves a secret from Azure Key Vault
 */
async function getKeyFromKeyVault(secretName: string): Promise<string> {
  try {
    if (!keyVaultName) {
      throw new Error('Azure Key Vault name is not configured');
    }
    
    // Create a secret client using the DefaultAzureCredential
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUrl, credential);
    
    // Get the secret
    const secret = await client.getSecret(secretName);
    
    if (!secret.value) {
      throw new Error(`Secret ${secretName} value is empty`);
    }
    
    return secret.value;
  } catch (error) {
    console.error(`Error retrieving key from Azure Key Vault: ${error}`);
    throw error;
  }
}
