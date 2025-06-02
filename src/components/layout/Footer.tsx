import Link from 'next/link';
import { SITE_NAME, SITE_NAME_THAI, FOOTER_LINKS } from '@/lib/constants';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                 <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
              <div>
                <span className="font-headline text-2xl font-bold block">{SITE_NAME}</span>
                <span className="font-body text-sm text-muted-foreground block">{SITE_NAME_THAI}</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your one-stop solution for tool rentals. Quality tools for every project.
            </p>
            <div className="flex space-x-3">
              <Link href="#" aria-label="Facebook page"><Facebook className="h-5 w-5 hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Twitter page"><Twitter className="h-5 w-5 hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="Instagram page"><Instagram className="h-5 w-5 hover:text-primary transition-colors" /></Link>
              <Link href="#" aria-label="LinkedIn page"><Linkedin className="h-5 w-5 hover:text-primary transition-colors" /></Link>
            </div>
          </div>

          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Company</h5>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Support</h5>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-headline text-lg font-semibold mb-4">Newsletter</h5>
            <p className="text-sm text-muted-foreground mb-3">Subscribe to get updates on new tools and offers.</p>
            <form className="flex space-x-2">
              <Input type="text" placeholder="Enter your email" className="bg-background flex-1" />
              <Button type="submit" variant="default">Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link> | <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
