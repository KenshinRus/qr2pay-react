// lib/downloadUtils.ts (client-side utility)
'use client'

import { UserData } from '@/lib/types'; // Adjust path if needed

export async function downloadQRCode(qrUrl: string, details: UserData | null, qrSize: string) {
  // Parse the QR size to get dimensions
  const [widthStr, heightStr] = qrSize.split('x');
  const qrWidth = parseInt(widthStr, 10);
  const qrHeight = parseInt(heightStr, 10);

  // Create canvas with extra height for text
  const canvas = document.createElement('canvas');
  const extraHeight = 120; // Space for text lines (adjust as needed)
  canvas.width = qrWidth;
  canvas.height = qrHeight + extraHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    alert('Canvas not supported');
    return;
  }

  // Fill background (optional, white)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load QR image
  const img = new Image();
  img.crossOrigin = 'anonymous'; // For CORS if needed
  img.src = qrUrl;

  await new Promise((resolve) => {
    img.onload = resolve;
  });

  // Draw QR image centered at the bottom
  ctx.drawImage(img, 0, extraHeight, qrWidth, qrHeight);

  // Draw text above the QR
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 24px Arial'; // Adjust font size/style';
  ctx.textAlign = 'center';

  // "Please scan to pay"
  ctx.fillText('Please scan to pay', canvas.width / 2, 30);

  // Header tag
  ctx.font = 'bold 20px Arial';
  ctx.fillText(details?.headerTag ?? 'NA', canvas.width / 2, 60);

  // Account number
  ctx.font = '16px Arial';
  ctx.fillText(`Account number: ${details?.bankAccount ?? 'NA'}`, canvas.width / 2, 90);

  // Account owner
  ctx.font = '16px Arial';
  ctx.fillText(`Account owner: ${details?.accountOwner ?? 'NA'}`, canvas.width / 2, 115);

  // Download the canvas as PNG
  const href = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = href;
  a.download = 'bankdetailsqr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}