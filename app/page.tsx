// app/page.tsx (Updated with field validation and NZ bank account validation)
'use client';

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">QR to Pay: Scan, Copy, Pay!</h1>
      <div className="flex flex-col items-center mb-6">
        <Image 
          src="/logo.png" 
          alt="QR2Pay Logo" 
          width={400} 
          height={300} 
          priority
          className="mb-4 rounded-lg shadow-sm"
        />
      </div>
      <h2 className="text-xl">The smarter way for Kiwis to share bank details without the hassle of scribbling on scraps of paper!</h2>
      <h3 className="text-lg">How It Works (Super Easy Instructions):</h3>
      <ul className="list-disc pl-6">
        <li><b>Go to the <Link href="/create">Create QR page</Link> and enter your Details</b>: Pop in your bank account number, name, and any description (like "Thanks for the widgets!").</li>
        <li><b>Generate QR Code:</b> Hit the button, and we&apos;ll create a unique QR code just for you</li>
        <li><b>Share It</b>: Print it out, stick it on your stall, email it, or display it on your phone – wherever your customers can scan it.</li>
        <li><b>Customer Side</b>: They scan the QR, land on a clean page with your details, copy them, and paste into their bank transfer. Done in seconds!</li>
      </ul>
      <div>
        <h3 className="text-lg">T & C</h3>
        <p>This service doesn't store any user data anywhere and provides an instant URL with user data encrypted in it.<br />
        This service is provided as free and on as is basis.</p>
      </div>
    </div>
  );
}