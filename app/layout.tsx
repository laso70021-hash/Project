import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SWAHIVO Logistics OS — Warehouse & Shipping Platform',
  description: 'Production-grade enterprise logistics management operating system for warehousing, shipping, inventory, QR tracking, fleet dispatch, driver telematics, and billing in Tanzania and East Africa.',
  openGraph: {
    title: 'SWAHIVO Logistics OS — Warehouse & Shipping Platform',
    description: 'Production-grade enterprise logistics management operating system for warehousing, shipping, inventory, QR tracking, fleet dispatch, driver telematics, and billing in Tanzania and East Africa.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SWAHIVO Logistics OS — Warehouse & Shipping Platform',
    description: 'Production-grade enterprise logistics management operating system for warehousing, shipping, inventory, QR tracking, fleet dispatch, driver telematics, and billing in Tanzania and East Africa.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#f1f5f9] text-slate-900 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
