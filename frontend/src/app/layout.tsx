import type { Metadata } from 'next';
import { Hind_Siliguri, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { MessageCircle, ShoppingBag } from 'lucide-react';

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972) — মতিঝিল, ঢাকা',
  description:
    '১৯৭২ সাল থেকে ঢাকার মতিঝিলের ঐতিহ্যবাহী খাসির ভুনা খিচুড়ি, লেগ খিচুড়ি, স্পেশাল কাচ্চি ও বোরহানি। ৫০+ বছরের বিশ্বস্ত স্বাদ ও আধুনিক হোম ডেলিভারি।',
  keywords: [
    'Gharowa Restaurant',
    'ঘরোয়া রেস্টুরেন্ট',
    'খাসির ভুনা খিচুড়ি',
    'Mutton Khichuri Motijheel',
    'Kacchi Biryani Dhaka',
    'Motijheel Metro Station food',
    'Best Bengali food Dhaka',
    'Gharowa 1972',
  ],
  authors: [{ name: 'Gharowa Hotel & Restaurant' }],
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Since 1972) — মতিঝিল, ঢাকা',
    description:
      '১৯৭২ সাল থেকে ঢাকার ঐতিহ্যের স্বাদ। খাঁটি খাসির ভুনা খিচুড়ি ও কাচ্চির আসল ঠিকানা।',
    url: 'http://localhost:3000',
    siteName: 'Gharowa Hotel & Restaurant',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Gharowa Mutton Bhuna Khichuri Heritage Platter',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'ঘরোয়া হোটেল এন্ড রেস্টুরেন্ট (Gharowa Hotel & Restaurant)',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop',
    '@id': 'http://localhost:3000',
    url: 'http://localhost:3000',
    telephone: '+8801973255888',
    priceRange: '৳৳',
    servesCuisine: ['Bangladeshi', 'Traditional Heritage', 'Biryani', 'Khichuri'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '9/C Motijheel C/A',
      addressLocality: 'Dhaka',
      postalCode: '1000',
      addressCountry: 'BD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.7314,
      longitude: 90.4172,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '07:00',
        closes: '23:30',
      },
    ],
  };

  return (
    <html lang="bn" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${hindSiliguri.variable} ${inter.variable} ${playfair.variable} bg-obsidian-500 text-gray-100 antialiased selection:bg-gold-500 selection:text-obsidian-950`}
      >
        <Navbar />

        <main className="min-h-screen pt-20">{children}</main>

        <Footer />
        <CartDrawer />

        {/* Sticky Mobile Floating Order CTA */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-30">
          <a
            href="https://wa.me/8801973255888"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-between shadow-2xl border border-emerald-400/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>WhatsApp-এ সরাসরি অর্ডার করুন</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              ০১৯৭৩২৫৫৮৮৮
            </span>
          </a>
        </div>
      </body>
    </html>
  );
}
