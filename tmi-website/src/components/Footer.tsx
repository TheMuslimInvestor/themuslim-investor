import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-onyx text-white">
      {/* Final CTA band */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center">
          <p className="arabic text-3xl md:text-4xl text-viridian-100 mb-6">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl mx-auto leading-tight">
            Your wealth is an Amanah.<br />
            <span className="text-viridian">Treat it like one.</span>
          </h2>
          <p className="text-dimgray max-w-lg mx-auto mb-10 text-base leading-relaxed">
            Join a community of Muslims preparing their answer for the Day of Judgment through Akhirah-first wealth building.
          </p>
          <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
            className="btn-primary text-base">
            Join the Free Community →
          </a>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <img src="/logo-light.png" alt="The Muslim Investor" className="h-8 w-auto mb-5 brightness-[2] invert" />
            <p className="text-sm text-dimgray leading-relaxed max-w-sm">
              Akhirah-first wealth building. Helping Muslims worldwide purify their wealth, 
              eliminate Riba, and prepare their answer for the Day of Judgment.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-dimgray mb-5">Navigate</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-sm text-onyx-200 hover:text-viridian transition-colors">About Mehdi</Link>
              <Link href="/curriculum" className="block text-sm text-onyx-200 hover:text-viridian transition-colors">Curriculum</Link>
              <Link href="/tools" className="block text-sm text-onyx-200 hover:text-viridian transition-colors">Free Tools</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-dimgray mb-5">Connect</h4>
            <div className="space-y-3">
              <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="block text-sm text-onyx-200 hover:text-viridian transition-colors">Skool Community</a>
              <a href="#" className="block text-sm text-onyx-200 hover:text-viridian transition-colors">YouTube</a>
              <a href="#" className="block text-sm text-onyx-200 hover:text-viridian transition-colors">Instagram</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-dimgray">© {new Date().getFullYear()} The Muslim Investor. All rights reserved.</p>
          <p className="text-xs text-dimgray italic">We are not building a business. We are collecting Hasanat at scale.</p>
        </div>
      </div>
    </footer>
  );
}
