'use client';

import Link from 'next/link';
import { Github, Twitter, Youtube, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Blogs', href: '/blogs' },
    ],
    Legal: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms and Conditions', href: '/terms' },
      { label: 'Cancellation and Refunds', href: '/refunds' },
      { label: 'Shipping and Exchange', href: '/shipping' },
    ],
  };

  const socialLinks = [
    { label: 'X Twitter', href: 'https://twitter.com', icon: Twitter },
    { label: 'GitHub', href: 'https://github.com', icon: Github },
    { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
    { label: 'Discord', href: 'https://discord.com', icon: MessageCircle },
    { label: 'Email', href: 'mailto:contact@devstory.app', icon: Mail },
  ];

  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139,92,246,0.4) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large DevStory Text */}
        <div className="pt-16 pb-8 border-b border-white/10">
          <div className="text-center">
            <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-black text-white/5 hover:text-white/10 transition-all duration-500 leading-none tracking-tight">
              DEVSTORY
            </h2>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <span className="text-white font-bold text-xl">D</span>
                </div>
                <span className="text-2xl font-bold text-white">DevStory</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Visualize. Understand. Discover.
              </p>
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-bold">D</span>
                </div>
                <span>Built for developers</span>
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.Platform.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500/0 group-hover:bg-purple-500 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.Legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500/0 group-hover:bg-purple-500 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links - Now in line */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Connect</h3>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-sm transition-all inline-flex items-center gap-3 group"
                    >
                      {link.icon && (
                        <link.icon className="w-4 h-4 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                      )}
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm text-center md:text-left">
              © {currentYear} DevStory. All rights reserved.
            </p>
            <p className="text-white/60 text-xs text-center md:text-right">
              Visualizing how code evolves, one commit at a time
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
