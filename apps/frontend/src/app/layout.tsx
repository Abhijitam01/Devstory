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
        <div className="relative min-h-screen bg-background flex flex-col">
          {/* Header - Cursor-inspired */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-12 items-center justify-between px-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">DS</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-lg font-semibold leading-none">DevStory</h1>
                    <span className="text-xs text-muted-foreground">
                      GitHub Repository Timeline
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="cursor-status-bar">
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-muted-foreground">Ready</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">TypeScript</span>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content - Cursor-inspired layout */}
          <main className="flex-1 flex overflow-hidden">
            {children}
          </main>

          {/* Footer - Minimalist */}
          <footer className="border-t bg-muted/30">
            <div className="px-4 py-3 text-center text-xs text-muted-foreground">
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
