import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DevStory - GitHub Repository Timeline',
  description: 'Visualize how a GitHub repository was built step by step. Analyze commit history and development patterns.',
  keywords: ['github', 'repository', 'timeline', 'development', 'visualization', 'commits'],
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
    title: 'DevStory - GitHub Repository Timeline',
    description: 'Visualize how a GitHub repository was built step by step',
    url: 'https://devstory.app',
    siteName: 'DevStory',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevStory - GitHub Repository Timeline',
    description: 'Visualize how a GitHub repository was built step by step',
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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="relative min-h-screen bg-background">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold">DevStory</h1>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  GitHub Repository Timeline
                </span>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-background">
            <div className="container py-6 text-center text-sm text-muted-foreground">
              <p>
                Built with ❤️ for developers who love to understand how projects evolve
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
