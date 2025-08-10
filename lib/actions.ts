// lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { UserData } from './types';
import { getSymmetricKey } from './keyManager';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // For GCM

export async function generateAction(formData: FormData) {
  const headerTag = formData.get('headertag')?.toString() || '';
  const bankAccount = formData.get('bank_account')?.toString() || '';
  const accountOwner = formData.get('account_owner')?.toString() || '';
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const data = { bankAccount, accountOwner, headerTag, pin } as UserData;
  const dataString = JSON.stringify(data);

  const key = await getSymmetricKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encryptedData = Buffer.concat([cipher.update(dataString, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Combine iv, authTag, and encrypted data into a single string for the URL
  const payload = `${iv.toString('base64')}.${authTag.toString('base64')}.${encryptedData.toString('base64')}`;

  redirect(`/share?data=${encodeURIComponent(payload)}`);
}

export async function decrypt(payload: string): Promise<UserData> {
  try {
    const [iv64, authTag64, encryptedData64] = payload.split('.');
    if (!iv64 || !authTag64 || !encryptedData64) {
        throw new Error("Invalid payload format.");
    }

    const key = await getSymmetricKey();
    const iv = Buffer.from(iv64, 'base64');
    const authTag = Buffer.from(authTag64, 'base64');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    const decryptedData = Buffer.concat([decipher.update(encryptedData64, 'base64'), decipher.final()]);

    return JSON.parse(decryptedData.toString('utf8')) as UserData;
  } catch (e) {
    console.error("Decryption failed:", e);
    throw new Error(`Decryption failed. The data may be corrupt or invalid.`);
  }
}