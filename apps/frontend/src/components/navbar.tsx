'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Menu, X, ArrowRight } from 'lucide-react';
import { GradientButton } from './ui/gradient-button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/features', label: 'Features' },
    { href: '/demo', label: 'Demo' },
    { href: '/how-it-works', label: 'How it works' },
    { href: '/stats', label: 'Stats' },
    { href: '/contact', label: 'Contact' },
    { href: '/faq', label: 'FAQ' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg'
          : 'bg-transparent border-b border-border/20'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            </div>
            <span className="text-xl font-bold text-foreground">Opensox AI</span>
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <GradientButton
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Github className="w-4 h-4" />
                Contribute
              </GradientButton>
              <GradientButton
                variant="primary"
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </GradientButton>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2">
                <GradientButton
                  variant="secondary"
                  size="sm"
                  className="gap-2 w-full"
                >
                  <Github className="w-4 h-4" />
                  Contribute
                </GradientButton>
                <GradientButton
                  variant="primary"
                  size="sm"
                  className="gap-2 w-full bg-gradient-to-r from-purple-600 to-purple-700"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </GradientButton>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

