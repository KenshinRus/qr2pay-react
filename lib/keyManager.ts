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

    const keyBase64 = process.env.SYMMETRIC_KEY;

    if (!keyBase64) {
        throw new Error("Symmetric key could not be found.");
    }

    symmetricKey = Buffer.from(keyBase64, 'base64');
    if (symmetricKey.length !== 32) {
        throw new Error("Invalid symmetric key length. Key must be 256 bits (32 bytes).");
    }
    
    return symmetricKey;
}