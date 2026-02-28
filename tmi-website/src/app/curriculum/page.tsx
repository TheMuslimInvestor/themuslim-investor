import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'TMI Curriculum | 7 Courses from Covenant to Zakat',
  description: '7 structured courses. From signing your Mission Pledge to calculating Zakat on modern halal assets. Institutional-grade Islamic finance education — 15-20 minutes a week.',
};

export default function CurriculumPage() {
  const courses = [
    {
      num: 1,
      title: 'The Covenant',
      subtitle: 'Your spiritual foundation.',
      time: '~30 min',
      problem: 'You sense something is wrong with your finances — but you have no idea how deep the contamination goes.',
      transformation: 'You sign your Mission Pledge, perform an immediate financial audit, and begin the purification process. You go from silent anxiety to active commitment.',
      modules: ['The TMI Mission Pledge — Your niyyah, formalized', 'Emergency Halal Portfolio Audit — Find the haram in your existing investments', 'The Purification Protocol — What to sell, what to keep, how to cleanse'],
      tools: ['Mission Pledge (Fillable PDF)', 'Halal Portfolio Screener', 'Emergency Purification Guide'],
      character: 'Khalid',
      charDesc: '41-year-old engineer in Houston. Good salary, 401k on autopilot, zero idea what\'s halal in his portfolio. He just wants to pray Fajr without guilt.',
    },
    {
      num: 2,
      title: 'Readiness & Identity',
      subtitle: 'Know yourself before you invest.',
      time: '~45 min',
      problem: 'You want to invest but have no idea if you\'re even ready — or what type of investor you actually are.',
      transformation: 'The Akhirah Financial Compass reveals your complete financial reality. The 35-question Investor Profile System reveals your unique investor DNA. Stop guessing — start knowing.',
      modules: ['The Akhirah Financial Compass — Your complete financial MRI', 'The TMI Investor Profile System — 35 questions, 5 dimensions, your DNA', 'Reading Your Results — From profile to portfolio strategy'],
      tools: ['Akhirah Financial Compass', 'Investor Profile System (35 Questions)', 'Investment Readiness Score'],
      character: 'Amina',
      charDesc: '34-year-old doctor in Jeddah. Earns well, saves aggressively, but freezes when faced with investment choices. She needs clarity, not more options.',
    },
    {
      num: 3,
      title: 'The Halal Arsenal',
      subtitle: 'Six asset classes. Zero compromise.',
      time: '~1.5 hours',
      problem: 'You hear "halal investing" but can\'t name more than one or two options. You assume it means lower returns and fewer choices.',
      transformation: 'You master six halal asset classes with institutional depth — and realize the halal universe is richer, more diverse, and more powerful than you imagined.',
      modules: ['Halal Equities — Screening, analysis, and selection', 'Sukuk — The Islamic bond alternative explained', 'Gold — Physical and paper, Shariah considerations', 'Halal REITs — Real estate income without Riba', 'Cash & Money Markets — Preserving capital the halal way', 'Bitcoin — The scholarly debate and practical framework'],
      tools: ['Halal Equity Analyzer', 'Sukuk Analyzer', 'Asset Class Comparison Framework'],
      character: 'Yusuf',
      charDesc: '28-year-old software engineer in Toronto. Knows code, knows crypto, knows nothing about Sukuk or REITs. He wants to diversify beyond "halal stocks" and Bitcoin.',
    },
    {
      num: 4,
      title: 'The TMI Macro System',
      subtitle: 'Read the weather. Protect the Amanah.',
      time: '~1 hour',
      problem: 'Markets feel like chaos. You don\'t know whether to invest, hold, or sell. You react emotionally to headlines instead of following a system.',
      transformation: 'You learn to read the economic environment with 34 indicators across 5 weather regimes. Not to predict — but to position your portfolio with wisdom.',
      modules: ['The 5 Weather Regimes — Sunny, cloudy, stormy, and beyond', 'The 34 Macro Indicators — What to watch, what to ignore', 'Reading the Dashboard — Translating signals into portfolio action'],
      tools: ['TMI Global Macro Dashboard (34 indicators, 12 tabs)', 'Weather Regime Signal System'],
      character: 'Omar',
      charDesc: '45-year-old business owner in Dubai. Built a company but panics during market drops. He needs a framework to stop reacting and start positioning.',
    },
    {
      num: 5,
      title: 'Portfolio & Risk Management',
      subtitle: 'One system. Complete control.',
      time: '~1 hour',
      problem: 'You have investments scattered across platforms with no unified strategy, no risk limits, and no idea if your overall allocation makes sense.',
      transformation: 'Everything converges into the Amanah Portfolio Command Center. One sheet. Three sections. Your entire portfolio, managed in 15–20 minutes a week.',
      modules: ['Building Your Target Allocation — Profile-driven, weather-adjusted', 'The Amanah Portfolio Command Center — Your weekly cockpit', 'Risk Management — Stop-losses, position sizing, and the Islamic framework for protection'],
      tools: ['Amanah Portfolio Command Center', 'Islamic Stop-Loss & Profit Target Planner', 'Relationship Analyzer'],
      character: 'Hassan',
      charDesc: '38-year-old consultant in London. Has a Wealthsimple account, some gold, scattered crypto. He needs one system to unify everything and manage it without stress.',
    },
    {
      num: 6,
      title: 'Execution & Systems',
      subtitle: 'Close the gap. Take action.',
      time: '~45 min',
      problem: 'You understand the theory but have never actually placed a trade, opened a halal brokerage, or set a limit order. Knowledge without action is just decoration.',
      transformation: 'You open your halal brokerage, place your first trade, and build the automated systems that turn your strategy into a weekly ritual.',
      modules: ['Choosing a Halal Brokerage — Platform comparison and selection', 'Your First Trade — Step-by-step, from login to confirmation', 'Building Your Weekly Ritual — Automate what can be automated'],
      tools: ['Broker Selection Guide', 'Execution Checklist', 'Weekly Ritual Template'],
      character: 'Layla',
      charDesc: '31-year-old marketing manager in Chicago. Completed Courses 1–5 but has never logged into a brokerage. She needs someone to hold her hand through the first trade.',
    },
    {
      num: 7,
      title: 'Zakat & Wealth Purification',
      subtitle: 'The spiritual capstone.',
      time: '~45 min',
      problem: 'You\'ve been giving Zakat for years but have never calculated it on your investment portfolio — ETFs, Sukuk, gold, crypto. You don\'t even know where to start.',
      transformation: 'You calculate Zakat on every modern halal asset class with precision. Your portfolio transforms from a financial instrument into an engine of Hasanat.',
      modules: ['Zakat on Modern Halal Investments — ETFs, Sukuk, gold, crypto', 'The 7-Sheet Calculation System — Step by step', 'Income Purification — How to cleanse unavoidable haram exposure'],
      tools: ['TMI Zakat & Purification Calculator (7-Sheet System)'],
      character: 'Fatima',
      charDesc: '50-year-old teacher in Cairo. Has been giving Zakat for 30 years but never on her ETF portfolio. She doesn\'t want to meet Allah having underpaid her obligation.',
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
            <p className="arabic text-2xl text-viridian mb-6">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">7 Courses.<br />One Guided Transformation.</h1>
            <p className="text-lg text-onyx-200 leading-relaxed max-w-2xl mx-auto">Not a library of content you browse and forget. A structured spiritual and financial journey — each course building on the last, each moving you closer to a prepared answer.</p>
          </div>
        </section>

        {/* COURSES */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="space-y-20">
              {courses.map((c) => (
                <div key={c.num} className="relative">
                  {/* Course number + time */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-viridian flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-black text-white">{String(c.num).padStart(2, '0')}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-onyx leading-tight">Course {c.num}: {c.title}</h2>
                      <p className="text-sm text-viridian font-semibold">{c.subtitle} · <span className="text-dimgray font-normal">{c.time}</span></p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8 ml-0 lg:ml-20">
                    {/* Left: Problem → Transformation */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-dimgray mb-2">The Problem</p>
                        <p className="text-sm text-dimgray leading-relaxed">{c.problem}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-viridian mb-2">The Transformation</p>
                        <p className="text-sm text-onyx leading-relaxed font-medium">{c.transformation}</p>
                      </div>

                      {/* Character */}
                      <div className="bg-ivory rounded-xl p-5 border border-viridian/10">
                        <p className="text-xs font-bold tracking-[0.1em] uppercase text-viridian mb-2">Follow Along With: {c.character}</p>
                        <p className="text-sm text-dimgray leading-relaxed italic">{c.charDesc}</p>
                      </div>
                    </div>

                    {/* Right: Modules + Tools */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-dimgray mb-3">Modules</p>
                        <div className="space-y-2">
                          {c.modules.map((m, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="text-viridian font-bold mt-0.5 flex-shrink-0 text-xs">▸</span>
                              <span className="text-sm text-onyx">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-[0.15em] uppercase text-dimgray mb-3">Tools & Resources</p>
                        <div className="flex flex-wrap gap-2">
                          {c.tools.map(t => (
                            <span key={t} className="text-xs bg-viridian/10 text-viridian font-medium px-3 py-1.5 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider (except last) */}
                  {c.num < 7 && <div className="border-b border-onyx/5 mt-16" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 mesh-dark text-center">
          <div className="absolute inset-0 islamic-pattern opacity-15" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
            <div className="tmi-line mx-auto mb-8" />
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-6">The first step is the hardest.</h2>
            <p className="text-lg text-onyx-200 leading-relaxed mb-10">The Mission Pledge takes 5 minutes. Everything else builds from there. Your wealth. Your Amanah. Your answer.</p>
            <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" className="btn-primary text-lg">Bismillah — Begin the Journey →</a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
