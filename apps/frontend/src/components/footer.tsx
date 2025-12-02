'use client';

import Link from 'next/link';
import { Github, Twitter, Youtube, Mail } from 'lucide-react';

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
    Socials: [
      { label: 'X Twitter', href: 'https://twitter.com', icon: Twitter },
      { label: 'GitHub', href: 'https://github.com', icon: Github },
      { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
      { label: 'Discord', href: 'https://discord.com', icon: null },
      { label: 'Email', href: 'mailto:contact@devstory.app', icon: Mail },
    ],
  };

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold text-white">DevStory</span>
            </div>
            <p className="text-white/70 text-sm">Visualize. Understand. Discover.</p>
            <div className="flex items-center space-x-2 text-white/60 text-sm">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xs">D</span>
              </div>
              <span>Built for developers</span>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-white font-semibold">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-2"
                      >
                        {link.icon && <link.icon className="w-4 h-4" />}
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8 text-center space-y-2">
          <p className="text-white/70 text-sm">
            © {currentYear} DevStory. All rights reserved.
          </p>
          <p className="text-white/60 text-xs">
            Visualizing how code evolves, one commit at a time
          </p>
        </div>
      </div>
    </footer>
  );
}

