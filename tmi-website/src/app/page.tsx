import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>

        {/* ══════════════════════════════════════════════
            HERO — Pattern interrupt. Spiritual weight.
        ══════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden mesh-dark">
          <div className="absolute inset-0 islamic-pattern opacity-30" />

          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-24 lg:py-32 text-center">
            {/* Bismillah — Arabic, prominent */}
            <p className="arabic text-2xl md:text-3xl text-viridian mb-10 anim-fade-in d1">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-black text-white leading-[1.1] mb-8 anim-fade-up d2 tracking-tight">
              Your portfolio will testify.<br />
              <span className="text-viridian">Either for you — or against you.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-onyx-200 leading-relaxed max-w-2xl mx-auto mb-12 anim-fade-up d3 font-light">
              We are not teaching halal investing. We are preparing your answer 
              for the Day of Judgment. Akhirah-first wealth building — powered by the 
              same system used to manage $500 million in Islamic assets.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center anim-fade-up d4">
              <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
                className="btn-primary text-base">
                Join the Free Community →
              </a>
              <Link href="/curriculum" className="btn-outline text-base">
                Explore the Curriculum
              </Link>
            </div>

            {/* Trust markers */}
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mt-20 anim-fade-in d6">
              {[
                { val: '$500M+', label: 'Islamic Assets Managed' },
                { val: '15+', label: 'Years in Islamic Finance' },
                { val: '$9/mo', label: 'Maximum Accessibility' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-viridian">{s.val}</p>
                  <p className="text-xs text-dimgray tracking-wide uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            THE SACRED WHY — Hadith foundation
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 bg-ivory">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="tmi-line mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight mb-8">
              Two questions about your wealth.<br />
              You cannot escape them.
            </h2>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-viridian/10 max-w-3xl mx-auto">
              <p className="text-base md:text-lg text-onyx leading-relaxed italic mb-6">
                &ldquo;The feet of a servant will not move on the Day of Resurrection until he 
                is asked about his lifetime and how he used it, his youth and how he spent it, 
                <strong className="text-viridian not-italic"> his wealth and how he earned it and how he spent it</strong>, 
                and his knowledge and how he acted upon it.&rdquo;
              </p>
              <p className="text-sm text-dimgray">
                — Sunan al-Tirmidhi 2417. Graded Hasan Sahih.
              </p>
            </div>
            <p className="text-base text-dimgray leading-relaxed max-w-2xl mx-auto mt-10">
              Two of the five questions on the Day of Judgment are specifically about your money. 
              Where you got it. What you did with it. Not maybe. Not possibly. 
              The Prophet ﷺ said your feet <em>will not move</em> until you answer.
            </p>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            THE THREE FEARS — Deep empathy section
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 mesh-light">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight mb-4">
                The weight you carry in silence.
              </h2>
              <p className="text-base text-dimgray max-w-2xl mx-auto leading-relaxed">
                You pray. You fast. You love Allah and His Messenger ﷺ. But there is a quiet 
                anxiety you carry — one you rarely speak about.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'The Unseen Haram',
                  body: 'Your pension. Your mutual funds. That index fund you were told to buy. Is it secretly collecting sayyi\u2019at for you? Is your wealth built on the architecture of Riba — a system Allah Himself declared war upon?',
                  accent: 'This is not anxiety. It is spiritual contamination.',
                },
                {
                  title: 'The Chasm of Hypocrisy',
                  body: 'Your heart is stirred in Jumu\u2019ah. On Monday, you return to a system that holds your livelihood in its hands. The gap between your beliefs and your financial reality creates a crack in your soul.',
                  accent: 'A lion forced to live in a cage.',
                },
                {
                  title: 'The Pain of Powerlessness',
                  body: 'You see the Ummah suffering. You make du\u2019a. You give what you can. And you feel a profound, gut-wrenching shame — your ambition to do khayr is a roaring fire, but your financial capacity is a thimble of water.',
                  accent: 'A spectator to the pain of your own family.',
                },
              ].map((fear, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-onyx-50 card-hover">
                  <div className="w-10 h-10 rounded-lg bg-viridian/10 flex items-center justify-center mb-5">
                    <span className="text-viridian font-black text-sm">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-onyx mb-3">{fear.title}</h3>
                  <p className="text-sm text-dimgray leading-relaxed mb-4">{fear.body}</p>
                  <p className="text-sm font-semibold text-viridian italic">{fear.accent}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            THE THREE LIES — Expose with compassion
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 bg-onyx overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-15" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                The comfortable lies that keep you stuck.
              </h2>
              <p className="text-base text-dimgray max-w-2xl mx-auto">
                You cope with the anxiety by telling yourself stories. Reasonable, comfortable — and spiritually devastating.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  lie: '"I have no choice. This is the system."',
                  truth: 'The Sahaba were a tiny minority facing two superpowers. They never once believed they had no choice. Your cage is not built by the world — it is built by the limits of your own economic imagination.',
                },
                {
                  lie: '"I\'ll get to it later. When I have more money."',
                  truth: 'Shaytan\u2019s greatest trick is the promise of tomorrow. Every day you delay, you actively choose to remain weak. You are not waiting for the right time — you are choosing the status quo.',
                },
                {
                  lie: '"My du\'a is enough."',
                  truth: 'The Prophet ﷺ did not just make du\u2019a before Badr. He sharpened swords, trained men, and planned strategy. Prayer without taking worldly means is not Tawakkul — it is a misunderstanding of our Deen.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <p className="text-lg font-bold text-viridian mb-4">{item.lie}</p>
                  <p className="text-sm text-onyx-200 leading-relaxed">{item.truth}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            THE FIVE PROMISES — What TMI delivers
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 bg-white noise overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight mb-4">
                From anxiety to Amanah.<br />The five promises of TMI.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { num: '01', title: 'Save Your Time for Worship', body: 'Investing becomes a 15–20 minute weekly ritual. The rest of your week is yours — for Quran, Salah, family, and community.' },
                { num: '02', title: 'Remove Every Act of Disobedience', body: 'Riba, haram dividends, prohibited stocks — we identify them and eliminate them so you stand clean before your Lord.' },
                { num: '03', title: 'Prepare Your Answer', body: 'When Allah asks how you earned and spent your wealth, you can say: Ya Rabb, I tried my absolute best. TMI gives you the tools to mean it.' },
                { num: '04', title: 'Maximize Your Sadaqah', body: 'The ultimate ROI is not portfolio returns — it is charitable capacity. Every dirham of Sadaqah is an investment with returns guaranteed by Allah.' },
                { num: '05', title: 'Give You Peace of Mind', body: 'Replace the spiritual anxiety with sakinah — tranquility rooted in knowing your wealth is clean, growing, and aligned with your Deen.' },
              ].map(p => (
                <div key={p.num} className="group bg-ivory rounded-2xl p-7 border border-viridian/5 card-hover">
                  <span className="text-4xl font-black text-viridian/10 group-hover:text-viridian/20 transition-colors block mb-3">{p.num}</span>
                  <h3 className="text-base font-bold text-onyx mb-2">{p.title}</h3>
                  <p className="text-sm text-dimgray leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            CREDIBILITY — About Mehdi preview
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 bg-ivory">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Photo placeholder */}
              <div className="relative order-2 lg:order-1">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-viridian/10 via-cambridge/10 to-ivory overflow-hidden flex items-center justify-center border border-viridian/10">
                  <div className="text-center p-8">
                    <div className="w-28 h-28 rounded-full bg-viridian/15 mx-auto mb-5 flex items-center justify-center">
                      <span className="text-5xl font-black text-viridian">M</span>
                    </div>
                    <p className="text-sm text-dimgray italic">Headshot coming soon</p>
                  </div>
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-4 bg-onyx text-white rounded-xl p-6 shadow-2xl max-w-[260px] hidden lg:block">
                  <p className="text-sm font-bold text-viridian">Senior Sukuk Portfolio Manager</p>
                  <p className="text-xs text-dimgray mt-1">$500M+ Islamic Assets · Dubai</p>
                  <p className="text-xs text-dimgray">Durham MSc Islamic Finance · CFA</p>
                </div>
              </div>

              {/* Text */}
              <div className="order-1 lg:order-2">
                <div className="tmi-line mb-8" />
                <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight mb-6">
                  Not another &ldquo;guru.&rdquo;<br />
                  A practitioner who does this<br />every single day.
                </h2>
                <div className="space-y-5 text-dimgray leading-relaxed">
                  <p>
                    Mehdi is a Senior Sukuk Portfolio Manager in Dubai, managing <strong className="text-onyx">$500 million 
                    in Shariah-compliant assets</strong> at one of the region&apos;s leading Islamic financial institutions. 
                    He has been in Islamic capital markets since 2011 — trading Sukuk, executing Islamic financial 
                    transactions, and building institutional expertise every single working day.
                  </p>
                  <p>
                    He holds a Master&apos;s in Islamic Finance from Durham University, contacted over 200 professionals 
                    across London, Switzerland, and the GCC to break into the industry, and has never transacted a single 
                    haram asset in his entire career. Alhamdulillah, Allah closed the doors of conventional finance 
                    and opened the halal path.
                  </p>
                  <div className="bg-white rounded-xl p-6 border-l-4 border-viridian">
                    <p className="text-base text-onyx font-semibold italic leading-relaxed">
                      &ldquo;If I&apos;m really true to myself — in a very selfish manner — I want to collect Hasanat. 
                      This is what I want to do. This is all I want to do. And it&apos;s going to be done through 
                      helping as many Muslims as possible.&rdquo;
                    </p>
                  </div>
                </div>
                <Link href="/about" className="btn-outline-dark mt-8 text-sm">
                  Read the Full Story →
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            THE 7-COURSE JOURNEY
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 mesh-dark overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-15" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-4">
                7 courses. One guided transformation.
              </h2>
              <p className="text-base text-onyx-200 max-w-2xl mx-auto leading-relaxed">
                Not a library of content. A structured spiritual and financial journey — each course 
                building on the last, each moving you closer to a prepared answer.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { num: 1, title: 'The Covenant', desc: 'Sign your Mission Pledge. Perform an immediate audit of your financial life for haram exposure. This is not onboarding — it is a spiritual covenant.', tools: 'Mission Pledge · Emergency Purification Guide · Halal Portfolio Screener' },
                { num: 2, title: 'Readiness & Identity', desc: 'The Akhirah Financial Compass reveals your complete financial reality. The Investor Profile System reveals your unique investor DNA. Stop guessing — start knowing.', tools: 'Akhirah Financial Compass · Investor Profile System · Portfolio Analyzer' },
                { num: 3, title: 'The Halal Arsenal', desc: 'Six halal asset classes — equities, Sukuk, gold, REITs, cash, Bitcoin — each explained with institutional depth but retail clarity.', tools: 'Halal Equity Analyzer · Sukuk Analyzer · Asset Class Guides' },
                { num: 4, title: 'The Macro System', desc: 'Read the economic environment with 34 indicators across 5 weather regimes. Not to become an economist — but to know when to lean in or protect the Amanah.', tools: 'TMI Global Macro Dashboard · Weather Regime Signals' },
                { num: 5, title: 'Portfolio & Risk Management', desc: 'Everything converges into the Amanah Portfolio Command Center. One sheet. Three sections. 15–20 minutes a week. Institutional management, simplified for the Ummah.', tools: 'Amanah Portfolio Command Center · Stop-Loss Planner' },
                { num: 6, title: 'Execution & Systems', desc: 'The last mile. Open a halal brokerage, place your first trade, use limit orders, and automate your strategy. The gap between knowledge and action is closed permanently.', tools: 'Execution Toolkit · Broker Selection Guide' },
                { num: 7, title: 'Zakat & Wealth Purification', desc: 'The spiritual capstone. Calculate Zakat on modern halal assets with precision. This is where your portfolio transforms from a financial instrument into an engine of Hasanat.', tools: 'TMI Zakat & Purification Calculator' },
              ].map(c => (
                <div key={c.num} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10 hover:border-viridian/30 transition-all duration-300 flex flex-col md:flex-row md:items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-viridian/15 flex items-center justify-center">
                    <span className="text-xl font-black text-viridian">{String(c.num).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Course {c.num}: {c.title}</h3>
                    <p className="text-sm text-onyx-200 leading-relaxed mb-3">{c.desc}</p>
                    <p className="text-xs text-dimgray"><span className="text-viridian font-semibold">Tools:</span> {c.tools}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/curriculum" className="btn-primary text-base">
                View Full Curriculum →
              </Link>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            THE WEEKLY RITUAL — Simplicity promise
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="tmi-line mx-auto mb-8" />
            <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight mb-6">
              15–20 minutes a week.<br />
              <span className="text-viridian">One ritual. Complete peace of mind.</span>
            </h2>
            <p className="text-base text-dimgray max-w-2xl mx-auto leading-relaxed mb-12">
              Once a week, you sit down with the TMI system. Review the macro signal. Check your 
              allocations. Execute any adjustments. Close the laptop. Your Amanah is stewarded. The 
              rest of the week is yours — for Quran, family, community, and worship.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { label: 'Review', desc: 'Check the macro weather signal and your portfolio allocations.' },
                { label: 'Adjust', desc: 'Deploy new savings or rebalance if the signal has shifted.' },
                { label: 'Worship', desc: 'Close the laptop. Your wealth is clean. Your time is yours.' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-viridian/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-black text-viridian">{i + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-onyx mb-2">{step.label}</h3>
                  <p className="text-sm text-dimgray leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            PRICING — $9/month with the story
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-32 bg-ivory">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Story side */}
              <div>
                <div className="tmi-line mb-8" />
                <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight mb-6">
                  Built for the 99%.<br />Not the 1%.
                </h2>
                <div className="space-y-5 text-dimgray leading-relaxed">
                  <p>
                    A friend heard Mehdi&apos;s vision to help two billion Muslims — then heard 
                    his pricing: $250 a month. And he said the words that changed everything:
                  </p>
                  <div className="bg-white rounded-xl p-6 border-l-4 border-viridian">
                    <p className="text-base text-onyx italic font-medium leading-relaxed">
                      &ldquo;You have two choices. Either you charge high and focus on a small subset. 
                      Or you help the masses. But you cannot tell me you want to help two billion 
                      Muslims and charge $250 a month. That&apos;s helping the 1%. Not the 99%.&rdquo;
                    </p>
                  </div>
                  <p>
                    That was a slap to the soul. And from that moment, TMI was reborn. Not as a business. 
                    As a mission. Because a $250 fee builds a business. <strong className="text-onyx">A $9 fee builds a movement.</strong>
                  </p>
                </div>
              </div>

              {/* Pricing card */}
              <div className="bg-white rounded-2xl p-10 md:p-12 shadow-xl border border-viridian/10">
                <p className="text-xs font-bold tracking-[0.15em] uppercase text-viridian mb-3">TMI Membership</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-6xl font-black text-onyx">$9</span>
                  <span className="text-dimgray font-medium">/month</span>
                </div>
                <p className="text-sm text-dimgray mb-8">The same framework used to manage $500M — built for you.</p>

                <div className="space-y-3 mb-10">
                  {[
                    '7 structured courses with video lessons',
                    'Institutional-grade tools & calculators',
                    'Amanah Portfolio Command Center',
                    'Investor Profile Assessment (35 questions)',
                    'Global Macro Dashboard (34 indicators)',
                    'Zakat & Purification Calculator',
                    'Direct access to Mehdi',
                    'Private community of Muslim investors',
                  ].map(f => (
                    <div key={f} className="flex items-start gap-3">
                      <span className="text-viridian font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-sm text-onyx">{f}</span>
                    </div>
                  ))}
                </div>

                <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
                  className="btn-primary w-full text-base">
                  Start Your Journey — Join Free →
                </a>
                <p className="text-xs text-dimgray mt-4 text-center">
                  Free community access now. Paid membership launches Ramadan 2026.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            WHAT TMI IS NOT — Competitive positioning
        ══════════════════════════════════════════════ */}
        <section className="relative py-24 lg:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="tmi-line mx-auto mb-8" />
              <h2 className="text-3xl md:text-4xl font-black text-onyx leading-tight">
                A category of one.
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-dimgray mb-6">TMI is not</h3>
                <div className="space-y-4">
                  {[
                    { label: 'A halal investing app', desc: 'Apps give compliance scores. TMI gives transformation.' },
                    { label: 'A robo-advisor', desc: 'Robo-advisors automate without educating. TMI empowers you to understand exactly what you own and why.' },
                    { label: 'A financial education platform', desc: 'Education platforms teach theory. TMI delivers a complete operational system that works in 15–20 minutes a week.' },
                    { label: 'An Islamic finance course', desc: 'Courses give you fiqh. TMI gives you fiqh, tools, systems, and a community — all for $9/month.' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="text-red-400 font-bold mt-0.5 flex-shrink-0 text-sm">✕</span>
                      <div>
                        <span className="text-sm font-semibold text-onyx">{item.label}.</span>{' '}
                        <span className="text-sm text-dimgray">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-[0.15em] uppercase text-viridian mb-6">TMI is</h3>
                <div className="bg-ivory rounded-2xl p-8 border border-viridian/10">
                  <p className="text-base text-onyx leading-relaxed font-medium mb-4">
                    A spiritual preparation system disguised as a wealth-building platform.
                  </p>
                  <p className="text-sm text-dimgray leading-relaxed">
                    The only platform in the world that begins with the Day of Judgment and works backward 
                    to your brokerage account. Institutional expertise. Akhirah-first philosophy. Professional 
                    tools simplified for someone with 15–20 minutes a week. Maximum accessibility at $9/month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ══════════════════════════════════════════════
            FINAL CTA — The invitation
        ══════════════════════════════════════════════ */}
        <section className="relative py-28 lg:py-36 mesh-dark text-center overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-15" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
            <p className="arabic text-2xl text-viridian mb-8">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-4">
              You&apos;ve been carrying this question alone for years.
            </h2>
            <p className="text-lg text-onyx-200 leading-relaxed mb-10">
              You don&apos;t have to anymore. There are Muslims on this journey with you. 
              Walk with us. Your wealth. Your Amanah. Your Akhirah.
            </p>
            <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-lg">
              Bismillah — Join the Movement →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
