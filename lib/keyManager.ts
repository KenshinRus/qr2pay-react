import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const vaultName = process.env.AZURE_KEY_VAULT_NAME;
const secretName = process.env.SYMMETRIC_KEY_SECRET_NAME;

let symmetricKey: Buffer | null = null;

/**
 * Retrieves the symmetric encryption key.
 * In production, it fetches from Azure Key Vault.
 * In development, it reads from the SYMMETRIC_KEY environment variable.
 * The key is cached in memory after the first retrieval.
 * @returns A Buffer containing the 256-bit symmetric key.
 */
export async function getSymmetricKey(): Promise<Buffer> {
    if (symmetricKey) {
        return symmetricKey;
    }

    let keyBase64: string | undefined;

    if (process.env.NODE_ENV === 'production') {
        if (!vaultName || !secretName) {
            throw new Error("Azure Key Vault environment variables are not set for production.");
        }
        const credential = new DefaultAzureCredential();
        const vaultUrl = `https://${vaultName}.vault.azure.net`;
        const client = new SecretClient(vaultUrl, credential);
        const secret = await client.getSecret(secretName);
        keyBase64 = secret.value;
    } else {
        // For local development, read from .env.local
        keyBase64 = process.env.SYMMETRIC_KEY;
    }

    if (!keyBase64) {
        throw new Error("Symmetric key could not be found.");
    }

    symmetricKey = Buffer.from(keyBase64, 'base64');
    if (symmetricKey.length !== 32) {
        throw new Error("Invalid symmetric key length. Key must be 256 bits (32 bytes).");
    }
    
    return symmetricKey;
}