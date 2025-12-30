// app/layout.tsx (Updated)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR to Pay',
  description: 'Free service to generate QR for sharing payment details',
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <Header />
          <main className="container mx-auto p-3">
            {children}
          </main>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}