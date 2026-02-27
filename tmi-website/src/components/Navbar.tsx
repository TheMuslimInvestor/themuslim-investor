'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-light.png" alt="The Muslim Investor" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-tmi-green transition-colors tracking-wide uppercase">
              About Mehdi
            </Link>
            <Link href="/curriculum" className="text-sm font-medium text-gray-600 hover:text-tmi-green transition-colors tracking-wide uppercase">
              Curriculum
            </Link>
            <Link href="/tools" className="text-sm font-medium text-gray-600 hover:text-tmi-green transition-colors tracking-wide uppercase">
              Free Tools
            </Link>
            <a
              href="https://www.skool.com/the-muslim-investor"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm !py-3 !px-6"
            >
              Join Free Community
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-tmi-charcoal transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-tmi-charcoal transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-tmi-charcoal transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 border-t border-gray-100' : 'max-h-0'}`}>
        <div className="px-6 py-6 bg-white space-y-4">
          <Link href="/about" onClick={() => setIsOpen(false)} className="block text-base font-medium text-gray-700 hover:text-tmi-green">
            About Mehdi
          </Link>
          <Link href="/curriculum" onClick={() => setIsOpen(false)} className="block text-base font-medium text-gray-700 hover:text-tmi-green">
            Curriculum
          </Link>
          <Link href="/tools" onClick={() => setIsOpen(false)} className="block text-base font-medium text-gray-700 hover:text-tmi-green">
            Free Tools
          </Link>
          <a
            href="https://www.skool.com/the-muslim-investor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary block text-center text-sm !py-3"
          >
            Join Free Community
          </a>
        </div>
      </div>
    </nav>
  );
}
