import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Free Islamic Finance Tools | The Muslim Investor',
  description: 'Institutional-grade Islamic finance tools built for the Ummah. Investor Profile System, Akhirah Financial Compass, Zakat Calculator, Macro Dashboard, and more.',
};

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="relative pt-32 pb-20 mesh-dark overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-15" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="arabic text-2xl text-viridian mb-6">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
            <p className="text-base text-onyx-200 mb-4">You&apos;ve been guessing long enough. These tools replace confusion with clarity — in minutes, not hours.</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">Institutional-Grade Tools.<br />Built for the Ummah.</h1>
            <p className="text-lg text-onyx-200 leading-relaxed max-w-2xl mx-auto">The same analytical frameworks used to manage $500M+ in Islamic assets — simplified, systemized, and available to every Muslim investor on earth.</p>
          </div>
        </section>

        {/* CORNERSTONE TOOLS */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-onyx">Cornerstone Systems</h2>
              <p className="text-sm text-dimgray mt-2">The two tools every TMI member begins with.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Akhirah Financial Compass */}
              <div className="bg-ivory rounded-2xl p-8 md:p-10 border border-viridian/10 flex flex-col">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-viridian mb-4">Course 2 — Cornerstone</span>
                <h3 className="text-xl font-black text-onyx mb-4">The Akhirah Financial Compass</h3>
                <p className="text-sm text-dimgray leading-relaxed mb-6 flex-grow">
                  Your first step toward answering Allah&apos;s question about your wealth. Reveals your Riba 
                  exposure, measures your financial fortress readiness, and tells you whether you&apos;re 
                  prepared to invest — or whether you need to fix your foundation first. The truth, in 10 minutes.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">Islamic Investment Readiness Score</span>
                  <span className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">Riba Exposure Analysis</span>
                  <span className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">Financial Fortress Assessment</span>
                </div>
                <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">Begin Your Assessment →</a>
              </div>

              {/* Investor Profile System */}
              <div className="bg-ivory rounded-2xl p-8 md:p-10 border border-viridian/10 flex flex-col">
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-viridian mb-4">Course 2 — Cornerstone</span>
                <h3 className="text-xl font-black text-onyx mb-4">The TMI Investor Profile System</h3>
                <p className="text-sm text-dimgray leading-relaxed mb-6 flex-grow">
                  35 carefully designed questions that reveal exactly who you are as an investor. Your risk 
                  tolerance, your time horizon, your liquidity needs, your knowledge depth, your emotional 
                  temperament — all mapped into a unique investor DNA profile that drives every portfolio 
                  decision from this point forward. Stop copying someone else&apos;s strategy.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">35-Question Assessment</span>
                  <span className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">5 Investor Dimensions</span>
                  <span className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">Personalized Profile</span>
                </div>
                <a href="https://tmi-replitzip--themusliminvest.replit.app" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">Discover Your Profile →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ALL TOOLS */}
        <section className="py-24 bg-ivory">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-onyx">The Complete TMI Toolkit</h2>
              <p className="text-sm text-dimgray mt-2 max-w-xl mx-auto">Every tool is designed to do one thing: save you time and give you clarity so you can focus on what matters — your Deen, your family, your Akhirah.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  course: 'Course 5',
                  title: 'Amanah Portfolio Command Center',
                  desc: 'Your weekly cockpit. One sheet that shows your entire portfolio — current allocations vs. targets, what to buy, what to sell, and exactly how much. Transforms portfolio management from a stressful guessing game into a 15-minute ritual.',
                  cta: 'Access the Command Center →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 4',
                  title: 'TMI Global Macro Dashboard',
                  desc: '34 economic indicators across 12 analytical tabs that tell you the weather before you step outside. You won\'t become an economist — you\'ll become someone who knows when to lean in and when to protect the Amanah.',
                  cta: 'Read the Weather →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 7',
                  title: 'Zakat & Purification Calculator',
                  desc: 'A 7-sheet system that calculates your Zakat obligation on every modern halal asset — ETFs, Sukuk, gold, crypto, cash. Stop underpaying. Stop overpaying. Meet Allah knowing you fulfilled the obligation with precision.',
                  cta: 'Calculate Your Zakat →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 3',
                  title: 'Halal Equity Analyzer',
                  desc: 'Screen any stock against Shariah compliance thresholds. Reveals revenue purity, debt ratios, and interest income — so you never invest in a company that fails the test without knowing it.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 3',
                  title: 'Sukuk Analyzer',
                  desc: 'Evaluate Sukuk with the same framework used by institutional portfolio managers. Credit quality, structure type, maturity profile, and yield analysis — all in one system.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 5',
                  title: 'Islamic Stop-Loss & Profit Target Planner',
                  desc: 'Protecting your wealth is not fear — it is stewardship. Set disciplined exit points that prevent catastrophic losses and lock in gains. Your Amanah deserves boundaries.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 5',
                  title: 'Relationship Analyzer',
                  desc: 'Understand how your assets move together — and discover the hidden correlations that could destroy your portfolio in a downturn. Diversification is not about counting assets. It\'s about understanding relationships.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 1',
                  title: 'Emergency Purification Guide',
                  desc: 'Found haram in your portfolio? This guide tells you exactly what to do — what to sell immediately, what to purify, and how to cleanse your wealth without panic. Your first aid kit for financial contamination.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 1',
                  title: 'Halal Portfolio Screener',
                  desc: 'Run your existing portfolio through a comprehensive halal audit. Identifies every position that may be non-compliant — before the Day of Judgment does it for you.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
                {
                  course: 'Course 1',
                  title: 'The TMI Mission Pledge',
                  desc: 'Not a form. A covenant between you and Allah. Sign it, hang it, and let it remind you every single day why you started this journey. The most important document in your financial life.',
                  cta: 'Access This Tool →',
                  link: 'https://www.skool.com/the-muslim-investor',
                },
              ].map((tool, i) => (
                <div key={i} className="bg-white rounded-2xl p-7 border border-viridian/5 flex flex-col card-hover">
                  <span className="text-xs font-semibold text-viridian mb-3">{tool.course}</span>
                  <h3 className="text-base font-bold text-onyx mb-3">{tool.title}</h3>
                  <p className="text-sm text-dimgray leading-relaxed mb-6 flex-grow">{tool.desc}</p>
                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-viridian hover:text-viridian-dark transition-colors">
                    {tool.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STUDIO PHOTO + WEB APPS COMING */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="/mehdi-studio.png" alt="TMI Studio — Building tools for the Ummah" className="w-full h-auto object-cover" />
              </div>
              <div>
                <div className="tmi-line mb-6" />
                <h2 className="text-2xl md:text-3xl font-black text-onyx mb-4">Web Applications<br />Launching Summer 2026 — Insha&apos;Allah.</h2>
                <p className="text-dimgray leading-relaxed mb-6">Every tool above is being converted into professional web applications — accessible from any device, anywhere in the world. Same institutional frameworks. Faster, smoother, more powerful.</p>
                <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="btn-outline-dark text-sm">Join the Community for Early Access →</a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 mesh-dark text-center">
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">Tools without action are decoration.<br /><span className="text-viridian">Start with one.</span></h2>
            <p className="text-lg text-onyx-200 leading-relaxed mb-10">The Investor Profile takes 10 minutes. It will tell you more about yourself as an investor than 10 years of guessing.</p>
            <a href="https://tmi-replitzip--themusliminvest.replit.app" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg">Discover Your Investor Profile →</a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
