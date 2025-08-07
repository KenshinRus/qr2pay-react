// components/ClientView.tsx ('use client')
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { decrypt } from '@/lib/actions';
import { UserData } from '@/lib/types';
import { showCopyToast } from '@/lib/utils';

export default function ClientView({ data64 }: { data64: string }) {
  const [details, setDetails] = useState<UserData | null>(null);

  const decryptUrlData = async () => {
    setDetails(await decrypt(data64));
  };

  useEffect(() => {
    decryptUrlData();
  }, []);

  return (
    <>
      {details && (
        <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md space-y-6">
          <h1 className="text-2xl font-bold">Account details</h1>
          <h2 className="text-xl">{details.headerTag}</h2>
          <p>Please make sure the bank account details match the one you see on the page with the QR code.</p>
          <Button onClick={() => showCopyToast(details.bankAccount, 'account number')} variant="default" className="w-full">Copy account: {details.bankAccount}</Button>
          <Button onClick={() => showCopyToast(details.accountOwner, 'account owner')} variant="default" className="w-full">Copy account owner: {details.accountOwner}</Button>
        </div>
      )}
    </>
  );
}