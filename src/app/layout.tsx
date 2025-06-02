
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/layout/AppLayout';
import { CartProvider } from '@/contexts/CartContext'; // Added CartProvider import

export const metadata: Metadata = {
  title: 'Chang Chao - Online Tool Rentals',
  description: 'Rent professional tools for your projects. ช่างเช่า - แพลตฟอร์มเช่าเครื่องมือออนไลน์',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <CartProvider> {/* Wrapped AppLayout with CartProvider */}
          <AppLayout>
            {children}
          </AppLayout>
        </CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
