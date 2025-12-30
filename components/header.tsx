// components/Header.tsx
"use client";

import Link from 'next/link';
import { Menu} from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { UserButton, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">QR to Pay</Link>

        {/* Desktop navigation - hidden on mobile */}
        <ul className="hidden md:flex space-x-4 items-center">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/create">Create QR</Link></li>
          <SignedIn>
            <li><Link href="/manage">Manage</Link></li>
          </SignedIn>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/donate">Donate</Link></li>
          <SignedOut>
            <li>
              <SignInButton mode="modal">
                <Button variant="secondary" size="sm">Sign In</Button>
              </SignInButton>
            </li>
          </SignedOut>
          <SignedIn>
            <li><UserButton afterSignOutUrl="/" /></li>
          </SignedIn>
        </ul>

        {/* Mobile hamburger menu */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="text-primary-foreground p-1">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[300px] bg-primary text-primary-foreground border-primary">
          <DialogTitle className="text-lg font-semibold">Menu</DialogTitle>
            <div className="flex flex-col space-y-4 py-4">
              <ul className="flex flex-col space-y-4">
                <li>
                  <DialogClose asChild>
                    <Link href="/" className="block hover:underline">Home</Link>
                  </DialogClose>
                </li>
                <li>
                  <DialogClose asChild>
                    <Link href="/create" className="block hover:underline">Create QR</Link>
                  </DialogClose>
                </li>
                <SignedIn>
                  <li>
                    <DialogClose asChild>
                      <Link href="/manage" className="block hover:underline">Manage</Link>
                    </DialogClose>
                  </li>
                </SignedIn>
                <li>
                  <DialogClose asChild>
                    <Link href="/contact" className="block hover:underline">Contact</Link>
                  </DialogClose>
                </li>
                <li>
                  <DialogClose asChild>
                    <Link href="/donate" className="block hover:underline">Donate</Link>
                  </DialogClose>
                </li>
                <SignedOut>
                  <li>
                    <SignInButton mode="modal">
                      <Button variant="secondary" size="sm" className="w-full">Sign In</Button>
                    </SignInButton>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li className="flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </li>
                </SignedIn>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}