import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ToastProvider } from '@/components/ui/toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Opensox AI - Find Your Perfect Open-Source Repo',
  description: 'Find top open-source repos in seconds. Filter by your language, framework, or niche. Start contributing in seconds, not hours.',
  keywords: ['open source', 'github', 'repository', 'contributions', 'developer tools'],
  authors: [{ name: 'Opensox AI Team' }],
  creator: 'Opensox AI',
  publisher: 'Opensox AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://opensox.ai'),
  openGraph: {
    title: 'Opensox AI - Find Your Perfect Open-Source Repo',
    description: 'Find top open-source repos in seconds. Filter by your language, framework, or niche.',
    url: 'https://opensox.ai',
    siteName: 'Opensox AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Opensox AI - Find Your Perfect Open-Source Repo',
    description: 'Find top open-source repos in seconds. Filter by your language, framework, or niche.',
    creator: '@opensoxai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="relative min-h-screen bg-black flex flex-col">
          <Navbar />

          {/* Main Content */}
          <main className="flex-1">
            <ToastProvider>
              {children}
            </ToastProvider>
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
