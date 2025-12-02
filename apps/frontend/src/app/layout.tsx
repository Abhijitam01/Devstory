import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeToggle } from '@/components/theme-toggle';
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
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <div className="relative min-h-screen bg-background flex flex-col">
          {/* Header - Simple and clean */}
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="flex h-14 items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-bold text-foreground">DevStory</h1>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  GitHub Repository Timeline
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span>Ready</span>
                  <span>•</span>
                  <span>TypeScript</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <ToastProvider>
              {children}
            </ToastProvider>
          </main>

          {/* Footer - Simple */}
          <footer className="border-t bg-background">
            <div className="px-6 py-4 text-center text-sm text-muted-foreground">
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
