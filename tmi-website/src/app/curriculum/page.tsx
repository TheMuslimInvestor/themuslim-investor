import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Curriculum | The Muslim Investor',
  description: '7 structured courses. A guided spiritual and financial transformation from covenant to Zakat. Built by a $500M fund manager for the Ummah.',
};

const courses = [
  {
    num: 1,
    title: 'The Covenant',
    tagline: 'Your Niyyah made tangible.',
    problem: 'You know something in your financial life isn\u2019t right with Allah — but you don\u2019t know where to start. The guilt has been building for years.',
    transformation: 'You have signed your Mission Pledge before Allah, audited every holding you own, and started the 72-hour purification protocol. The anxiety is replaced by clarity and action.',
    modules: [
      'The Two Questions That Define Everything',
      'The TMI Mission Pledge — Your Covenant with Allah',
      'The Immediate Purge — Identifying and Eliminating Haram',
    ],
    tools: ['TMI Mission Pledge (PDF)', 'Emergency Purification Guide', 'Halal Portfolio Screener', 'Sharia Methodology Note'],
    character: 'Khalid — 42-year-old IT manager in London. Been investing in his company pension for 15 years. Just realized he has no idea if any of it is halal.',
  },
  {
    num: 2,
    title: 'Readiness & Identity',
    tagline: 'Stop guessing. Start knowing.',
    problem: 'You\u2019re following generic \u201Cone-size-fits-all\u201D advice that doesn\u2019t account for your unique life, obligations, and values as a Muslim.',
    transformation: 'You hold your complete financial MRI and a 2,500+ word personalized investor profile. You know your Islamic Investment Readiness Score, your risk tolerance, your strengths, and your unique investor DNA.',
    modules: [
      'The TMI Readiness Assessment — Your Financial X-Ray',
      'Your Investor DNA Profile — The 35-Question Deep Dive',
      'The Portfolio Mirror — Analyzing What You Already Own',
    ],
    tools: ['TMI Akhirah Financial Compass (Excel)', 'TMI Investor Profile System (Web App)', 'TMI Portfolio Analyzer (Web App)'],
    character: 'Amina — 35-year-old physician in Jeddah. High earner, zero investing experience. Overwhelmed by conflicting advice.',
  },
  {
    num: 3,
    title: 'Mastering the Halal Arsenal',
    tagline: 'Six weapons. One purpose.',
    problem: 'You don\u2019t know the difference between a Sukuk and a bond, or whether Bitcoin is halal, or how to screen an equity for Sharia compliance.',
    transformation: 'You command the full arsenal of halal investment tools. You know what each asset does, when it shines, why it exists in your portfolio, and how to invest in it compliantly.',
    modules: [
      'Halal Equities — Owning Shariah-Compliant Businesses',
      'Sukuk — The Stability Anchor',
      'Gold — The Ancient Protector',
      'Islamic REITs, ETFs & Funds',
      'Cash — Islamic Deposits and Liquidity',
      'Bitcoin — The Halal Assessment',
    ],
    tools: ['TMI Halal Equity Analyzer', 'TMI Sukuk Analyzer', 'Asset Class Deep-Dive Guides'],
    character: null,
  },
  {
    num: 4,
    title: 'The TMI Macro System',
    tagline: 'Read the weather. Protect the Amanah.',
    problem: 'You feel like a leaf in the wind — tossed by scary headlines about inflation, recessions, and geopolitical events. You don\u2019t know what any of it means for your money.',
    transformation: 'You are \u201CThe Watchtower.\u201D You can read the global economic environment through 34 indicators across 5 weather regimes and know exactly when to lean in or protect.',
    modules: [
      'The TMI Macro Framework — 5 Weather Regimes',
      '34 Leading Indicators Across 6 Pillars',
      'Growth, Inflation, Liquidity, Risk Appetite, Monetary & Fiscal Policy',
      'From Signal to Portfolio Action',
    ],
    tools: ['TMI Global Macro Dashboard (12-Tab System)', 'Weather Regime Signal Tracker'],
    character: null,
  },
  {
    num: 5,
    title: 'Portfolio & Risk Management',
    tagline: 'One sheet. Three sections. 15\u201320 minutes a week.',
    problem: 'You\u2019ve learned about assets and markets — but you don\u2019t know how to put it all together into a real portfolio that you can actually manage.',
    transformation: 'Your Amanah Portfolio is built, balanced, and managed with institutional discipline. Profile + asset knowledge + macro regime + new cash = one clear instruction. Done.',
    modules: [
      'Portfolio Construction Principles for Muslims',
      'Asset Allocation Strategies by Investor Profile',
      'The 15\u201320 Minute Weekly Ritual',
      'Risk Management & Islamic Stop-Loss Framework',
      'The Amanah Portfolio Command Center Walkthrough',
    ],
    tools: ['TMI Amanah Portfolio Command Center', 'Islamic Stop-Loss & Profit Target Planner', 'Relationship Analyzer'],
    character: null,
  },
  {
    num: 6,
    title: 'Execution & Systems',
    tagline: 'Close the gap between knowledge and action.',
    problem: 'You know what to invest in and why — but you\u2019ve never actually placed a trade. The practical \u201Chow\u201D is the final barrier.',
    transformation: 'You have an open halal brokerage account, you\u2019ve placed your first trade, and you have a systematized execution process that removes emotion from every decision.',
    modules: [
      'Choosing Your Shariah-Compliant Broker',
      'Opening Your Account — Step by Step',
      'Your First Halal Trade',
      'Limit Orders, Automation & Systematized Execution',
    ],
    tools: ['TMI Execution Toolkit', 'Broker Selection & Comparison Guide'],
    character: null,
  },
  {
    num: 7,
    title: 'Zakat & Wealth Purification',
    tagline: 'Where your portfolio becomes an engine of Hasanat.',
    problem: 'You don\u2019t know how to calculate Zakat on modern halal assets — Sukuk, equities, ETFs, gold, Bitcoin. Traditional calculators weren\u2019t built for this.',
    transformation: 'You calculate Zakat with precision across every asset class. Your wealth is not just clean — it is actively generating Hasanat. The spiritual capstone is complete.',
    modules: [
      'The Obligation and Blessing of Zakat',
      'Zakat on Modern Halal Assets (Equities, Sukuk, Gold, Bitcoin)',
      'Purification of Haram Earnings',
      'The TMI Zakat Calculator Walkthrough',
    ],
    tools: ['TMI Zakat & Purification Calculator (7-Sheet System)'],
    character: null,
  },
];

export default function CurriculumPage() {
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
              7 Courses.<br />One Akhirah-First<br />Transformation.
            </h1>
            <p className="text-lg text-onyx-200 leading-relaxed max-w-2xl mx-auto">
              Not a library of content. A structured journey — from covenant to Zakat — built by 
              a practicing $500M fund manager. Each course builds on the last. Each moves you 
              closer to a prepared answer.
            </p>
          </div>
        </section>

        {/* COURSES */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-6">
            {courses.map((c) => (
              <div key={c.num} className="bg-white rounded-2xl border border-onyx-50 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Number */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-viridian/10 flex items-center justify-center">
                      <span className="text-2xl font-black text-viridian">{String(c.num).padStart(2, '0')}</span>
                    </div>

                    <div className="flex-grow">
                      <h2 className="text-2xl font-black text-onyx mb-1">
                        Course {c.num}: {c.title}
                      </h2>
                      <p className="text-sm font-semibold text-viridian mb-4 italic">{c.tagline}</p>

                      {/* Problem → Transformation */}
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-onyx-50 rounded-xl p-5">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-dimgray mb-2">The Problem</p>
                          <p className="text-sm text-onyx leading-relaxed">{c.problem}</p>
                        </div>
                        <div className="bg-ivory rounded-xl p-5 border border-viridian/10">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-viridian mb-2">Your Transformation</p>
                          <p className="text-sm text-onyx leading-relaxed">{c.transformation}</p>
                        </div>
                      </div>

                      {/* Modules */}
                      <div className="mb-4">
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-dimgray mb-3">Modules</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {c.modules.map(m => (
                            <div key={m} className="flex items-start gap-2">
                              <span className="text-viridian text-xs mt-1 flex-shrink-0">◆</span>
                              <span className="text-sm text-dimgray">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tools */}
                      <div className="flex flex-wrap gap-2">
                        {c.tools.map(t => (
                          <span key={t} className="text-xs bg-viridian/5 text-viridian px-3 py-1 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Character */}
                      {c.character && (
                        <div className="mt-4 bg-ivory rounded-lg p-4 border border-viridian/5">
                          <p className="text-xs font-bold tracking-[0.1em] uppercase text-dimgray mb-1">Follow Along With</p>
                          <p className="text-sm text-onyx">{c.character}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 mesh-dark text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-black text-white mb-4">Ready to begin?</h2>
            <p className="text-base text-onyx-200 mb-10 leading-relaxed">
              Join the free community. Sign your Mission Pledge. Start the transformation.
            </p>
            <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-base">
              Bismillah — Join the Community →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
