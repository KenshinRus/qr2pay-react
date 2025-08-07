// lib/actions.ts
'use server';

import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { UserData } from './types';
import { getPrivateKey, getPublicKey } from './keyManager';

export async function generateAction(formData: FormData) {
    console.log('Generating action with form data:', formData);
  const headerTag = formData.get('headertag')?.toString() || '';
  const bankAccount = formData.get('bank_account')?.toString() || '';
  const accountOwner = formData.get('account_owner')?.toString() || '';
  const pin = Math.floor(1000 + Math.random() * 9000).toString();
  const data = {
    bankAccount,
    accountOwner,
    headerTag,
    pin,
  } as UserData;
  console.log('Data to encrypt:', data);
  const privateKey = await getPrivateKey();
  const encrypted = crypto.privateEncrypt(privateKey, Buffer.from(JSON.stringify(data)));
  const base64 = encrypted.toString('base64');
  redirect(`/share?data=${encodeURIComponent(base64)}`);
}

export async function decrypt(data64: string) : Promise<UserData> {
  try {
    const data = Buffer.from(data64, 'base64');
    const publicKey = await getPublicKey();
    const decrypted = crypto.publicDecrypt(publicKey, data);
    console.log('Decrypted data:', decrypted.toString());
    return JSON.parse(decrypted.toString()) as UserData;
  } catch (e) {
    throw new Error(`Decryption failed: ${e}`);
  }
}

