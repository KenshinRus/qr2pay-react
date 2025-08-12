'use client';

import Image from "next/image";
import { Button } from '@/components/ui/button';
import { showCopyToast } from '@/lib/utils';

export default function Donate() {
  const details = {
    headerTag: "Please donate to help keep this service running",
    bankAccount: "01-1842-0099435-01",
    accountOwner: "SLAVA KNIAZEV"
  };
  
  return (
    <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">If you find this service useful</h1>
      <h2 className="text-xl">{details.headerTag}</h2>
      <Button onClick={() => showCopyToast(details.bankAccount, 'account number')} variant="default" className="w-full">Copy account number</Button>
      <Button onClick={() => showCopyToast(details.accountOwner, 'account owner')} variant="default" className="w-full">Copy account owner</Button>
      <div className="flex justify-end">
        <Image 
          src="/thankyou.png" 
          alt="Thank You" 
          width={200}
          height={300}
          priority
          className="mb-4 rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
}
