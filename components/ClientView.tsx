// components/ClientView.tsx ('use client')
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { decrypt } from '@/lib/actions';
import { UserData } from '@/lib/types';
import { showCopyToast } from '@/lib/utils';

export default function ClientView({ data64 }: { data64: string }) {
  const [details, setDetails] = useState<UserData | null>(null);

  const decryptUrlData = useCallback(async () => {
    setDetails(await decrypt(data64));
  }, [data64]);

  useEffect(() => {
    decryptUrlData();
  }, [decryptUrlData]);

  const openASBApp = () => {
    if (!details) return;

    // Try multiple deep link formats for Android
    const deepLinks = [
      // Just open the ASB app (since deep linking to transfer doesn't work)
      `intent://#Intent;scheme=asb;package=nz.co.asb.asbmobile;end;`,
      // Try launching via package
  //`intent://open#Intent;package=nz.co.asb.asbmobile;end;`,
      // Alternative custom scheme to just open app
   //   `asb://open`,
      // Fallback to ASB website
   //   `https://www.asb.co.nz/banking-with-asb/mobile-banking.html`
    ];

    // Try each deep link
    let attempted = 0;
    const tryNextLink = () => {
      if (attempted < deepLinks.length - 1) {
        window.location.href = deepLinks[attempted];
        attempted++;
        setTimeout(() => {
          // If still on page after 1.5s, app didn't open, try next
          if (document.hasFocus()) {
            tryNextLink();
          }
        }, 1500);
      } else {
        // Last fallback - open ASB website
        window.open(deepLinks[deepLinks.length - 1], '_blank');
      }
    };

    tryNextLink();
  };

  return (
    <>
      {details && (
        <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md space-y-6">
          <h1 className="text-2xl font-bold">Account details</h1>
          <h2 className="text-xl">{details.headerTag}</h2>
          <p>Please make sure the bank account details match the one you see on the page with the QR code.</p>
          <Button onClick={() => showCopyToast(details.accountOwner, 'account owner')} variant="default" className="w-full">Copy: {details.accountOwner}</Button>
          <Button onClick={() => showCopyToast(details.bankAccount, 'account number')} variant="default" className="w-full">Copy: {details.bankAccount}</Button>
          <Button onClick={openASBApp} variant="default" className="w-full">Open in ASB Mobile App</Button>
        </div>
      )}
    </>
  );
}