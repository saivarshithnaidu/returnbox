import type { Metadata } from 'next';
import Script from 'next/script';

import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import LeadCapturePopup from '@/components/ui/LeadCapturePopup';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Return Box by Sana | Handcrafted Candles & Return Gifts',
  description: 'Premium handmade candles and return gifts. Handcrafted with love in Guntur, Andhra Pradesh. Shop luxury candles, custom hampers, and personalized gifts.',
  keywords: ['handmade candles', 'return gifts', 'custom hampers', 'scented candles', 'wedding favors', 'Guntur'],
  openGraph: {
    title: 'Return Box by Sana | We Wrap Love',
    description: 'Premium handmade candles and return gifts.',
    url: 'https://returnbox.growxlabs.tech',
    siteName: 'Return Box by Sana',
    type: 'website',
  },
};

import LayoutWrapper from '@/components/layout/LayoutWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#FFF8F0] text-[#3D1C1C] min-h-screen flex flex-col leading-[1.7]`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
