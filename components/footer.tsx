import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted mt-auto border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QR2Pay. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
