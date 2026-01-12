// app/layout.tsx (Updated)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QR to Pay',
  description: 'Free service to generate QR to share bank payment details. No user registration required!',
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
      <body className={inter.className + " flex flex-col min-h-screen"}>
        <ClerkProvider>
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