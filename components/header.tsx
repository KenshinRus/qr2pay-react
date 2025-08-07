// components/Header.tsx (Updated with ShadCN if needed, but kept simple)
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">QR to Pay</Link>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/create">Create QR</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
}