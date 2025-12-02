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
  title: 'DevStory - GitHub Repository Timeline Visualization',
  description: 'Visualize how a GitHub repository was built step by step. Analyze commit history and development patterns with beautiful timeline visualizations.',
  keywords: ['github', 'repository', 'timeline', 'development', 'visualization', 'commits', 'code analysis'],
  authors: [{ name: 'DevStory Team' }],
  creator: 'DevStory',
  publisher: 'DevStory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://devstory.app'),
  openGraph: {
    title: 'DevStory - GitHub Repository Timeline Visualization',
    description: 'Visualize how a GitHub repository was built step by step. Analyze commit history and development patterns.',
    url: 'https://devstory.app',
    siteName: 'DevStory',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevStory - GitHub Repository Timeline Visualization',
    description: 'Visualize how a GitHub repository was built step by step. Analyze commit history and development patterns.',
    creator: '@devstory',
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
