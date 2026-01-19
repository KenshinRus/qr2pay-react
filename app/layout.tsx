// app/layout.tsx (Updated)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';
import PWAInstaller from '@/components/PWAInstaller';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR to Pay',
  description: 'Free service to generate QR to share bank payment details. No user registration required!',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QR to Pay',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className={inter.className + " flex flex-col min-h-screen"}>
        <ClerkProvider>
          <PWAInstaller />
          <Header />
          <main className="container mx-auto p-3 flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}