import CryptoJS from 'crypto-js';

const secretKey = process.env.SECRET_KEY || 'your-secret-key'; // Store in .env.local

export const encodeData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decodeData = (encodedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encodedData, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};