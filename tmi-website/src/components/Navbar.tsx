'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-onyx-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex-shrink-0">
            <img src="/logo-light.png" alt="The Muslim Investor" className="h-12 w-auto" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/about" className="text-[13px] font-semibold tracking-[0.12em] uppercase text-dimgray hover:text-viridian transition-colors">
              About Mehdi
            </Link>
            <Link href="/curriculum" className="text-[13px] font-semibold tracking-[0.12em] uppercase text-dimgray hover:text-viridian transition-colors">
              Curriculum
            </Link>
            <Link href="/tools" className="text-[13px] font-semibold tracking-[0.12em] uppercase text-dimgray hover:text-viridian transition-colors">
              Free Tools
            </Link>
            <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
              className="btn-primary !py-3 !px-6 text-sm">
              Join the Movement
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2" aria-label="Menu">
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-onyx rounded transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-onyx rounded transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-onyx rounded transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white ${open ? 'max-h-80 border-t border-gray-100' : 'max-h-0'}`}>
        <div className="px-6 py-6 space-y-5">
          <Link href="/about" onClick={() => setOpen(false)} className="block text-base font-medium text-onyx hover:text-viridian">About Mehdi</Link>
          <Link href="/curriculum" onClick={() => setOpen(false)} className="block text-base font-medium text-onyx hover:text-viridian">Curriculum</Link>
          <Link href="/tools" onClick={() => setOpen(false)} className="block text-base font-medium text-onyx hover:text-viridian">Free Tools</Link>
          <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
            className="btn-primary block text-center text-sm !py-3">
            Join the Movement
          </a>
        </div>
      </div>
    </nav>
  );
}
