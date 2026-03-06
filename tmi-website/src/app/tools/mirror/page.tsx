import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Free Islamic Finance Tools | The Muslim Investor',
  description: 'Free tools to discover your Islamic Investor Profile, check your IIRS score, scan for Riba exposure, and see what your portfolio reveals about you. Institutional-grade Islamic finance tools built for every Muslim.',
};

export default function ToolsPage() {
  const freeTools = [
    {
      step: 1,
      course: 'Course 1 \u2014 Your Starting Point',
      title: 'The TMI Mission Pledge',
      desc: 'Before you learn a single investment concept, make a covenant with Allah about HOW you will steward your wealth. This is not a form \u2014 it\u2019s a niyyah. The most important document in your financial life.',
      tags: ['Spiritual Foundation', '2 Minutes', 'Sacred Commitment'],
      cta: 'Sign Your Pledge \u2192',
      link: '/pledge',
      external: false,
      live: true,
    },
    {
      step: 2,
      course: 'Course 2 \u2014 Know Yourself',
      title: 'The TMI Investor Profile',
      desc: '35 carefully designed questions that reveal exactly who you are as an investor. Your risk tolerance, your time horizon, your knowledge depth, your spiritual focus \u2014 all mapped into a unique Investor DNA profile. Stop copying someone else\u2019s strategy. Discover yours.',
      tags: ['Investor DNA', '5 Dimensions', '10 Minutes', 'AI-Powered Report'],
      cta: 'Discover Your Profile \u2192',
      link: '/tools/profile',
      external: false,
      live: true,
    },
    {
      step: 3,
      course: 'Course 2 \u2014 Know Your Foundation',
      title: 'The Akhirah Financial Compass',
      desc: 'Your Islamic Investment Readiness Score (IIRS) in 10 minutes. Scans your Riba exposure, measures your emergency fund strength, analyzes your expenses against Muslims in your demographic, and generates a personalized action plan with exact dollar amounts. The truth about whether you\u2019re ready to invest \u2014 or whether you need to fix your foundation first.',
      tags: ['IIRS Score', 'Riba Scan', 'Personalized Action Plan', '10 Minutes'],
      cta: 'Begin Your Assessment \u2192',
      link: '/tools/compass',
      external: false,
      live: true,
    },
    {
      step: 4,
      course: 'Course 2 \u2014 Know Your Reality',
      title: 'The TMI Portfolio Mirror',
      desc: 'Enter your current holdings and see what your portfolio actually says about your beliefs, fears, and Islamic alignment. The Mirror reflects the gap between who you say you are and what your investments demonstrate. No prescriptions \u2014 only honest reflection.',
      tags: ['AI-Powered Analysis', 'Halal Compliance Check', 'Gap Analysis', '10 Minutes'],
      cta: 'Hold Up the Mirror \u2192',
      link: '/tools/mirror',
      external: false,
      live: true,
    },
  ];

  const paidTools = [
    {
      course: 'Course 1',
      title: 'Emergency Purification Guide',
      desc: 'Found haram in your portfolio? This guide tells you exactly what to do \u2014 what to sell immediately, what to purify, and how to cleanse your wealth without panic. Your first aid kit for financial contamination.',
    },
    {
      course: 'Course 1',
      title: 'Halal Portfolio Screener',
      desc: 'Run your existing portfolio through a comprehensive halal audit. Identifies every position that may be non-compliant \u2014 before the Day of Judgment does it for you.',
    },
    {
      course: 'Course 3',
      title: 'Halal Equity Analyzer',
      desc: 'Screen any stock against AAOIFI Shariah compliance thresholds. Reveals revenue purity, debt ratios, and interest income \u2014 so you never invest in a company that fails the test without knowing it.',
    },
    {
      course: 'Course 3',
      title: 'Sukuk Analyzer',
      desc: 'Evaluate Sukuk with the same framework used by institutional portfolio managers. Credit quality, structure type, maturity profile, and yield analysis \u2014 all in one system.',
    },
    {
      course: 'Course 3',
      title: 'Gold Compass',
      desc: 'Navigate gold investment decisions with institutional clarity. Timing indicators, allocation frameworks, and Islamic context for the Sunnah currency.',
    },
    {
      course: 'Course 3',
      title: 'Bitcoin Resource Workbook',
      desc: 'Understand Bitcoin through an Islamic lens. Shariah perspectives, volatility frameworks, and allocation guidance for the most debated digital asset.',
    },
    {
      course: 'Course 3',
      title: 'REIT Resource',
      desc: 'Evaluate Shariah-compliant Real Estate Investment Trusts. Revenue analysis, compliance screening, and portfolio fit assessment.',
    },
    {
      course: 'Course 3',
      title: 'Cash Management Kit',
      desc: 'Optimize your cash reserves with Islamic deposit strategies. Emergency fund sizing, opportunity reserves, and avoiding idle capital decay.',
    },
    {
      course: 'Course 4',
      title: 'TMI Global Macro Dashboard',
      desc: '34 economic indicators across 12 analytical tabs that tell you the weather before you step outside. You won\u2019t become an economist \u2014 you\u2019ll become someone who knows when to lean in and when to protect the Amanah.',
    },
    {
      course: 'Course 5',
      title: 'Amanah Portfolio Command Center',
      desc: 'Your weekly cockpit. One sheet that shows your entire portfolio \u2014 current allocations vs. targets, what needs attention, and how much. Transforms portfolio management from a stressful guessing game into a 15-minute weekly ritual.',
    },
    {
      course: 'Course 5',
      title: 'Islamic Stop-Loss & Profit Target Planner',
      desc: 'Protecting your wealth is not fear \u2014 it is stewardship. Set disciplined exit points that prevent catastrophic losses and lock in gains. Your Amanah deserves boundaries.',
    },
    {
      course: 'Course 5',
      title: 'Relationship Analyzer',
      desc: 'Understand how your assets move together \u2014 and discover the hidden correlations that could destroy your portfolio in a downturn. Diversification is not about counting assets. It\u2019s about understanding relationships.',
    },
    {
      course: 'Course 7',
      title: 'Zakat & Purification Calculator',
      desc: 'A 7-sheet system that calculates your Zakat obligation on every modern halal asset \u2014 ETFs, Sukuk, gold, crypto, cash. Stop underpaying. Stop overpaying. Meet Allah knowing you fulfilled the obligation with precision.',
    },
  ];

  return (
    <>
      <Navbar />
      <main>

        {/* HERO */}
        <section className="relative pt-32 pb-20 mesh-dark overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-15" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <p className="arabic text-2xl text-viridian mb-6">{'\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064E\u0647\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650'}</p>
            <p className="text-base text-onyx-200 mb-4">You&apos;ve been guessing long enough. These tools replace confusion with clarity — in minutes, not hours.</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">Institutional-Grade Tools.<br />Built for the Ummah.</h1>
            <p className="text-lg text-onyx-200 leading-relaxed max-w-2xl mx-auto">The same analytical frameworks used to manage $500M+ in Islamic assets — simplified, systemized, and available to every Muslim investor on earth.</p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 1: YOUR 4-STEP FOUNDATION (Free Tools)        */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-24 lg:py-32 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-onyx">Your 4-Step Financial Foundation</h2>
              <p className="text-sm text-dimgray mt-3 max-w-2xl mx-auto leading-relaxed">These four tools — in this order — build the spiritual and financial foundation every Muslim investor needs before making a single investment decision. All free. All private. Start with Step 1.</p>
            </div>

            {/* 4-Step Sequence */}
            <div className="space-y-6">
              {freeTools.map((tool, i) => (
                <div key={tool.step} className="relative">
                  {/* Connector line (except after last) */}
                  {i < freeTools.length - 1 && (
                    <div className="hidden md:block absolute left-[2.25rem] top-full w-[3px] h-6 bg-gradient-to-b from-viridian/30 to-viridian/5 z-0" />
                  )}

                  <div className="relative flex flex-col md:flex-row gap-6 bg-ivory rounded-2xl p-6 md:p-8 border border-viridian/10 card-hover">
                    {/* Step number */}
                    <div className="flex-shrink-0 flex md:flex-col items-center md:items-center gap-4 md:gap-2">
                      <div className="w-[4.5rem] h-[4.5rem] rounded-2xl bg-viridian flex items-center justify-center shadow-lg shadow-viridian/20">
                        <span className="text-2xl font-black text-white">{String(tool.step).padStart(2, '0')}</span>
                      </div>
                      {/* Status badge */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${tool.live ? 'bg-viridian/10 text-viridian' : 'bg-amber-50 text-amber-600'}`}>
                        <span className={`w-2 h-2 rounded-full ${tool.live ? 'bg-viridian' : 'bg-amber-400'}`} />
                        {tool.live ? 'Live' : 'Coming Soon'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <span className="text-xs font-bold tracking-[0.12em] uppercase text-viridian/70 mb-2 block">{tool.course}</span>
                      <h3 className="text-xl font-black text-onyx mb-3">{tool.title}</h3>
                      <p className="text-sm text-dimgray leading-relaxed mb-5">{tool.desc}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tool.tags.map(tag => (
                          <span key={tag} className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      {tool.live ? (
                        tool.external ? (
                          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm !py-3 !px-6">{tool.cta}</a>
                        ) : (
                          <Link href={tool.link} className="btn-primary text-sm !py-3 !px-6">{tool.cta}</Link>
                        )
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-dimgray">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Coming Summer 2026 — Insha&apos;Allah
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary line */}
            <div className="mt-14 bg-viridian/5 rounded-2xl p-8 border border-viridian/10 text-center">
              <p className="text-sm text-onyx leading-relaxed max-w-3xl mx-auto">
                <strong className="text-viridian">Complete all four steps</strong> and you&apos;ll know: your spiritual commitment (Pledge), your investor identity (Profile), your financial readiness (Compass), and your portfolio alignment (Mirror). That&apos;s a foundation no amount of stock tips can replace.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 2: THE COMPLETE TMI TOOLKIT (Paid)            */}
        {/* ═══════════════════════════════════════════════════════ */}

        {/* Divider banner */}
        <div className="bg-onyx py-5">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 flex items-center justify-center gap-4">
            <div className="h-[1px] flex-grow bg-white/10" />
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-dimgray text-center flex-shrink-0">TMI Membership · $9/month</p>
            <div className="h-[1px] flex-grow bg-white/10" />
          </div>
        </div>

        <section className="py-24 lg:py-32 bg-onyx/[0.03]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-black text-onyx">The Complete TMI Toolkit</h2>
              <p className="text-sm text-dimgray mt-3 max-w-xl mx-auto leading-relaxed">Institutional-grade tools for every stage of your halal investment journey. Available with TMI membership — $9/month.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidTools.map((tool, i) => (
                <div key={i} className="bg-white rounded-2xl p-7 border border-onyx/5 flex flex-col card-hover relative overflow-hidden">
                  {/* Subtle $9 badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold tracking-wide uppercase bg-onyx/5 text-dimgray px-2.5 py-1 rounded-full">$9/mo</span>
                  </div>
                  <span className="text-xs font-semibold text-viridian mb-3">{tool.course}</span>
                  <h3 className="text-base font-bold text-onyx mb-3 pr-12">{tool.title}</h3>
                  <p className="text-sm text-dimgray leading-relaxed mb-6 flex-grow">{tool.desc}</p>
                  <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-viridian hover:text-viridian-dark transition-colors inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Join TMI to Access &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 3: WEB APPS COMING                            */}
        {/* ═══════════════════════════════════════════════════════ */}
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
                <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="btn-outline-dark text-sm">Join the Community for Early Access &rarr;</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* SECTION 4: BOTTOM CTA                                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="py-24 mesh-dark text-center">
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">Start with Step 1.</h2>
            <p className="text-lg text-onyx-200 leading-relaxed mb-10">The TMI Pledge takes 2 minutes. It will clarify your intention more than any financial model ever could.</p>
            <Link href="/pledge" className="btn-primary text-lg">Sign Your Pledge &rarr;</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
