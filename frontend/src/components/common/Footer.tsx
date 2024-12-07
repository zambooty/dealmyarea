import { Link } from "@nextui-org/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-divider bg-background/70 backdrop-blur-lg backdrop-saturate-150 py-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li><Link href="/deals">Deals</Link></li>
              <li><Link href="/map">Store Map</Link></li>
              <li><Link href="/compare">Price Compare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/forum">Forum</Link></li>
              <li><Link href="/help">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {currentYear} DealmyArea. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 