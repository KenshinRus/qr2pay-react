// components/ClientShare.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserData } from '@/lib/types';
import { decrypt } from '@/lib/actions';
import { toast } from 'sonner';
import { downloadQRCode } from '@/lib/downloadUtils';
import { getBaseUrl } from '@/lib/utils';

export default function ClientShare({ data64 }: { data64: string }) {
  const [qrSize, setQrSize] = useState('300x300');
  const [details, setDetails] = useState<UserData | null>(null);
  const baseUrl = getBaseUrl();

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${baseUrl}/view?data=${encodeURIComponent(data64)}`)}&size=${qrSize}`;

  const parseData = useCallback(async () => {
    setDetails(await decrypt(data64));
  }, [data64]);

  useEffect(() => {
    parseData();
  }, [parseData]);

  const handleResize = (value: string) => {
    setQrSize(value);
  };

  const handleDownload = async () => {
    if (details) { // Optional: Guard if details not loaded yet
      await downloadQRCode(qrUrl, details, qrSize);
    }
  };

  const handlePrint = () => {
    const content = `
      <html>
        <head>
          <title>Print QR</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .account-details { text-align: left; margin: 0 auto; max-width: 300px; margin-bottom: 20px; }
            .account-label { font-weight: bold; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <h2>Please scan to pay</h2>
          <h3>${details?.headerTag ?? 'NA'}</h3>
          <div class="account-details">
            <p><span class="account-label">Account number:</span> ${details?.bankAccount ?? 'NA'}</p>
            <p><span class="account-label">Account owner:</span> ${details?.accountOwner ?? 'NA'}</p>
          </div>
          <img src="${qrUrl}" />
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(content);
      win.document.close();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${baseUrl}/view?data=${encodeURIComponent(data64)}`);
    toast('Link copied!', {
      description: 'The payment details link has been copied to your clipboard.',
      style: {
        background: 'rgb(217, 245, 139)',
        border: '1px solid rgb(69, 68, 128)',
        color: 'rgb(69, 68, 128)',
      },
    });
  };

  const handleAddToFavorites = () => {
    const url = `${baseUrl}/view?data=${encodeURIComponent(data64)}`;
    const title = `QR Pay - ${details?.headerTag ?? 'Payment Details'}`;
    
    // Check if the browser supports the add to favorites functionality (legacy browsers)
    if (typeof (window as typeof window & { external?: { AddFavorite?: (url: string, title: string) => void } }).external?.AddFavorite === 'function') {
      // Internet Explorer
      (window as typeof window & { external: { AddFavorite: (url: string, title: string) => void } }).external.AddFavorite(url, title);
      return;
    } else if (typeof (window as typeof window & { sidebar?: { addPanel?: (title: string, url: string, empty: string) => void } }).sidebar?.addPanel === 'function') {
      // Firefox (older versions)
      (window as typeof window & { sidebar: { addPanel: (title: string, url: string, empty: string) => void } }).sidebar.addPanel(title, url, '');
      return;
    }

    // Detect mobile vs desktop and provide appropriate instructions
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    let instructions = '';
    const duration = 8000;

    if (isMobile) {
      if (isIOS) {
        // iOS Safari/Chrome instructions
        instructions = 'On iOS: Tap the Share button (square with arrow) at the bottom, then tap "Add to Bookmarks" or "Add to Favorites"';
      } else if (isAndroid) {
        // Android Chrome instructions
        instructions = 'On Android: Tap the three dots menu (⋮) at the top right, then tap "Add to bookmarks" or the star icon';
      } else {
        // Generic mobile instructions
        instructions = 'On mobile: Look for the menu button (usually three dots or lines) and select "Add to Bookmarks" or "Add to Favorites"';
      }
    } else {
      // Desktop instructions
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const shortcut = isMac ? 'Cmd+D' : 'Ctrl+D';
      instructions = `On desktop: Press ${shortcut} or click the star icon in the address bar to bookmark this page`;
    }

    // Copy URL to clipboard for easier bookmarking
    navigator.clipboard.writeText(url).then(() => {
      toast('Bookmark Instructions', {
        description: `${instructions}. The page URL has been copied to your clipboard for easy access.`,
        duration: duration,
        style: {
          background: 'rgb(217, 245, 139)',
          border: '1px solid rgb(69, 68, 128)',
          color: 'rgb(69, 68, 128)',
        },
      });
    }).catch(() => {
      toast('Bookmark Instructions', {
        description: instructions,
        duration: duration,
        style: {
          background: 'rgb(217, 245, 139)',
          border: '1px solid rgb(69, 68, 128)',
          color: 'rgb(69, 68, 128)',
        },
      });
    });
  };

  const [width, height] = qrSize.split('x').map(Number);

  return (
    <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md text-center space-y-6">
      <h1 className="text-2xl font-bold">Your QR code to Pay for share</h1>
      <h3 className='text-lg'>{details?.headerTag ?? 'NA'}</h3>
      <div className="text-left">
        <h3 className='text-lg'><strong>Account number:</strong> {details?.bankAccount ?? 'NA'}</h3>
        <h3 className='text-lg'><strong>Account owner:</strong> {details?.accountOwner ?? 'NA'}</h3>
      </div>
      <Image src={qrUrl} alt="QR Code" className="mx-auto" width={width} height={height} />
      <Button onClick={handleDownload} variant="default" className="w-full">Download QR code</Button>
      <Button onClick={handlePrint} variant="default" className="w-full">Print QR code</Button>
      <Button onClick={handleCopyLink} variant="default" className="w-full">Copy link to payment details</Button>
      <Button onClick={handleAddToFavorites} variant="default" className="w-full">Add to Favorites</Button>
      <div className="space-y-2">
        <Label htmlFor="qrSize">Select size of QR code</Label>
        <Select onValueChange={handleResize} defaultValue={qrSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="300x300">300</SelectItem>
            <SelectItem value="450x450">450</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}