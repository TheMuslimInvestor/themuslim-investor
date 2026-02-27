import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Free Tools | The Muslim Investor',
  description: 'Institutional-grade Islamic finance tools: Akhirah Financial Compass, Investor Profile System, Amanah Portfolio Command Center, Zakat Calculator, and more.',
};

const featured = [
  {
    name: 'TMI Akhirah Financial Compass',
    desc: 'A complete financial MRI that produces your Islamic Investment Readiness Score — measuring Riba exposure, financial fortress readiness, and savings discipline. This is your starting point.',
    format: 'Excel Workbook',
    course: 'Course 2',
  },
  {
    name: 'TMI Investor Profile System',
    desc: 'A 35-question deep-dive assessment that produces a 2,500+ word personalized report revealing your unique investor identity — from Fortress Builder to Growth Seeker. Your Compass of Conviction.',
    format: 'Interactive Web App',
    course: 'Course 2',
  },
];

const tools = [
  {
    name: 'Amanah Portfolio Command Center',
    desc: 'The convergence tool. Profile + asset knowledge + macro regime + new cash = one clear instruction. One sheet. Three sections. 15\u201320 minutes a week.',
    format: 'Excel System',
    course: 'Course 5',
  },
  {
    name: 'Global Macro Dashboard',
    desc: 'A 12-tab dashboard tracking 34 leading indicators that produces one signal: the current economic weather regime and what it means for your portfolio positioning.',
    format: 'Excel Dashboard',
    course: 'Course 4',
  },
  {
    name: 'Zakat & Purification Calculator',
    desc: 'A 7-sheet system designed specifically for modern halal portfolios — calculating Zakat on equities, Sukuk, gold, Bitcoin, and assets most traditional calculators cannot cover.',
    format: 'Excel Calculator',
    course: 'Course 7',
  },
  {
    name: 'Halal Equity Analyzer',
    desc: 'Screen individual stocks for Shariah compliance using AAOIFI-based financial ratios. Revenue screens, debt ratios, and prohibited business activity filters.',
    format: 'Excel Tool',
    course: 'Course 3',
  },
  {
    name: 'Sukuk Analyzer',
    desc: 'Evaluate Sukuk instruments for issuer credibility, Shariah structure, risk characteristics, and portfolio fit. The same logic used professionally for institutional portfolios.',
    format: 'Excel Tool',
    course: 'Course 3',
  },
  {
    name: 'Islamic Stop-Loss & Profit Target Planner',
    desc: 'Professional-grade risk management for halal portfolios. Set disciplined stop-losses and profit targets for each position, removing emotion from your decisions.',
    format: 'Excel Planner',
    course: 'Course 5',
  },
  {
    name: 'Relationship Analyzer',
    desc: 'Understand correlations between your halal asset classes. See how Sukuk, equities, gold, and Bitcoin interact across different market environments.',
    format: 'Excel Tool',
    course: 'Course 5',
  },
  {
    name: 'Emergency Purification Guide',
    desc: 'The 72-hour protocol. Inventory your holdings, screen each one, and execute a purification plan. Step-by-step, with Khalid as your guide.',
    format: 'PDF Guide',
    course: 'Course 1',
  },
  {
    name: 'Halal Portfolio Screener',
    desc: 'Quickly screen your existing portfolio holdings against AAOIFI Shariah standards. Identify what\u2019s clean and what needs to go.',
    format: 'Excel Screener',
    course: 'Course 1',
  },
  {
    name: 'TMI Mission Pledge',
    desc: 'Your Niyyah made tangible. Five commitments between you and your Creator about how you will approach your wealth from this day forward.',
    format: 'Fillable PDF',
    course: 'Course 1',
  },
];

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Institutional-Grade Tools.<br />Built for the Ummah.
            </h1>
            <p className="text-lg text-onyx-200 leading-relaxed max-w-2xl mx-auto">
              The same analytical logic used to manage $500 million in Islamic assets — 
              translated into tools that eliminate guesswork and work in minutes, not hours.
            </p>
          </div>
        </section>

        {/* FEATURED TOOLS */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <div className="tmi-line mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-onyx mb-3">Cornerstone Tools</h2>
              <p className="text-base text-dimgray">Start here. These two tools form the foundation of your entire TMI journey.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {featured.map(t => (
                <div key={t.name} className="group bg-gradient-to-br from-ivory to-white rounded-2xl p-10 border-2 border-viridian/15 hover:border-viridian/40 card-hover">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold tracking-[0.1em] uppercase text-viridian bg-viridian/10 px-3 py-1 rounded-full">{t.course}</span>
                    <span className="text-xs text-dimgray">{t.format}</span>
                  </div>
                  <h3 className="text-xl font-bold text-onyx mb-4">{t.name}</h3>
                  <p className="text-sm text-dimgray leading-relaxed mb-6">{t.desc}</p>
                  <span className="text-sm font-semibold text-viridian group-hover:translate-x-1 transition-transform inline-block">
                    Available in Community →
                  </span>
                </div>
              ))}
            </div>

            {/* ALL TOOLS */}
            <div className="mb-12">
              <h2 className="text-2xl font-black text-onyx mb-3">Complete Tool Library</h2>
              <p className="text-base text-dimgray">All tools included with membership. Professional quality, maximum accessibility.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map(t => (
                <div key={t.name} className="bg-white rounded-xl p-7 border border-onyx-50 hover:border-viridian/20 card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-viridian">{t.course}</span>
                    <span className="text-xs text-dimgray">· {t.format}</span>
                  </div>
                  <h3 className="text-base font-bold text-onyx mb-3">{t.name}</h3>
                  <p className="text-sm text-dimgray leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WEB APPS COMING */}
        <section className="py-20 bg-ivory">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-black text-onyx mb-4">Web applications launching soon.</h2>
            <p className="text-base text-dimgray max-w-2xl mx-auto mb-8 leading-relaxed">
              We&apos;re building interactive, mobile-friendly web apps for every tool. 
              The Excel versions are available now — the web apps will make them even more accessible.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Investor Profile Web App', 'Portfolio Analyzer', 'Zakat Calculator', 'Macro Dashboard', 'Halal Screener'].map(i => (
                <span key={i} className="text-sm bg-white px-4 py-2 rounded-full border border-viridian/10 text-dimgray font-medium">{i}</span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 mesh-dark text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-black text-white mb-4">Get instant access to every tool.</h2>
            <p className="text-base text-onyx-200 mb-10">
              Join the free community and download the complete toolkit today.
            </p>
            <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-base">
              Join Free & Access All Tools →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
