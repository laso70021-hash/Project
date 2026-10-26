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
        <link rel="icon" href="/assets/aistudio/favicon_1e293d6d.png" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined') {
                  window.gm_authFailure = function() {
                    window.dispatchEvent(new CustomEvent('gmp-auth-failure', { detail: { reason: 'gm_authFailure' } }));
                  };
                  var origError = console.error;
                  console.error = function() {
                    var args = Array.prototype.slice.call(arguments);
                    var msg = args.map(function(a) { return String(a); }).join(' ');
                    if (
                      msg.indexOf('RefererNotAllowedMapError') !== -1 ||
                      msg.indexOf('Google Maps JavaScript API error') !== -1 ||
                      msg.indexOf('ApiProjectMapError') !== -1
                    ) {
                      window.dispatchEvent(new CustomEvent('gmp-auth-failure', { detail: { reason: 'RefererNotAllowedMapError', msg: msg } }));
                      console.warn('[Google Maps Platform Notice - Handled Gracefully]', msg);
                      return;
                    }
                    if (
                      msg.indexOf('OverQuotaMapError') !== -1 ||
                      msg.indexOf('QuotaExceededError') !== -1
                    ) {
                      window.dispatchEvent(new CustomEvent('gmp-quota-exceeded', { detail: { msg: msg } }));
                      console.warn('[Google Maps Platform Quota Notice - Handled Gracefully]', msg);
                      return;
                    }
                    origError.apply(console, args);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className="h-full bg-[#f1f5f9] text-slate-900 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
