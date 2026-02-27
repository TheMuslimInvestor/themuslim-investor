import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-tmi-charcoal text-white">
      {/* CTA Band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <p className="font-display text-3xl md:text-4xl font-semibold mb-4 text-tmi-green-light">
            Your wealth is an Amanah. Treat it like one.
          </p>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
            Join a community of Muslims building Halal wealth with purpose, purity, and peace of mind.
          </p>
          <a
            href="https://www.skool.com/the-muslim-investor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base"
          >
            Join the Free Community →
          </a>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <img src="/logo-dark.png" alt="The Muslim Investor" className="h-8 w-auto mb-4 brightness-150" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Akhirah-first wealth building. Helping Muslims worldwide purify their portfolios, 
              avoid Riba, and use their wealth as a tool for eternal success.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Navigate</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-sm text-gray-400 hover:text-tmi-green transition-colors">About Mehdi</Link>
              <Link href="/curriculum" className="block text-sm text-gray-400 hover:text-tmi-green transition-colors">Curriculum</Link>
              <Link href="/tools" className="block text-sm text-gray-400 hover:text-tmi-green transition-colors">Free Tools</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">Connect</h4>
            <div className="space-y-3">
              <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-400 hover:text-tmi-green transition-colors">Skool Community</a>
              <a href="#" className="block text-sm text-gray-400 hover:text-tmi-green transition-colors">YouTube</a>
              <a href="#" className="block text-sm text-gray-400 hover:text-tmi-green transition-colors">Instagram</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} The Muslim Investor. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 italic">
            Bismillah ir-Rahman ir-Rahim
          </p>
        </div>
      </div>
    </footer>
  );
}
