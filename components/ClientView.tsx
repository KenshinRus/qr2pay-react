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

    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isAndroid) {
      // Use MAIN/LAUNCHER intent to open the app's main activity directly.
      // S.browser_fallback_url sends to Play Store only if the app is NOT installed.
      window.location.href =
        'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=nz.co.asb.asbmobile;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dnz.co.asb.asbmobile;end;';
    } else if (isIOS) {
      // iOS: try the universal link, fall back to App Store after timeout
      window.location.href = 'https://digital.asb.co.nz';
      setTimeout(() => {
        if (document.hasFocus()) {
          window.location.href = 'https://apps.apple.com/nz/app/asb-mobile-banking/id434348489';
        }
      }, 1500);
    } else {
      // Desktop fallback
      window.open('https://www.asb.co.nz/banking-with-asb/mobile-banking.html', '_blank');
    }
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