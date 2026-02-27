import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-tmi-charcoal" />
          <div className="absolute inset-0 islamic-accent opacity-40" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-tmi-charcoal to-transparent z-10" />
          
          {/* Decorative elements */}
          <div className="absolute top-32 right-10 w-72 h-72 rounded-full bg-tmi-green/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-tmi-green/3 blur-3xl" />

          <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32">
            <div className="max-w-4xl">
              {/* Bismillah */}
              <p className="text-tmi-green font-display text-lg md:text-xl italic mb-8 animate-fade-in opacity-0">
                Bismillah ir-Rahman ir-Rahim
              </p>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-8 animate-fade-in-up opacity-0 delay-100">
                Your ultimate metric is not the return on your investment—
                <span className="text-tmi-green">it is the return on your Akhirah.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mb-12 animate-fade-in-up opacity-0 delay-300">
                Professional Islamic finance education that helps you purify your wealth from Riba, 
                invest in 100% Halal assets, and free up your time for what truly matters—
                your Ibadah, your family, and your Akhirah.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 delay-400">
                <a
                  href="https://www.skool.com/the-muslim-investor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base"
                >
                  Join the Free Community →
                </a>
                <Link href="/curriculum" className="btn-secondary !border-white/30 !text-white hover:!bg-white/10 text-base">
                  Explore the Curriculum
                </Link>
              </div>

              {/* Trust Markers */}
              <div className="flex flex-wrap gap-8 mt-16 animate-fade-in opacity-0 delay-600">
                {[
                  { value: '$500M+', label: 'Islamic Assets Managed' },
                  { value: '15+', label: 'Years in Islamic Finance' },
                  { value: '100%', label: 'Shariah Compliant' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-tmi-green">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ THE MIRROR / PAIN SECTION ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-white geo-pattern">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="tmi-divider mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-5xl font-bold text-tmi-charcoal mb-6">
                Let&apos;s hold up a mirror to the soul.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                You work hard. You pray. You fast. You love Allah and His Messenger ﷺ. 
                But there is a quiet anxiety you carry—a gnawing disconnect between your 
                faith and your finances.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'The Fear of Unseen Haram',
                  desc: 'Your pension, your mutual funds, the very financial system you participate in—is it secretly collecting sayyi\'at for you? Is your wealth built on the architecture of Riba?',
                  icon: '⚖️',
                },
                {
                  title: 'The Weight of Powerlessness',
                  desc: 'You see the Ummah suffering. Your heart breaks, you make du\'a. But your financial capacity feels like a thimble of water against a roaring fire. You want to give more, but you can\'t.',
                  icon: '🤲',
                },
                {
                  title: 'The Lie of "Later"',
                  desc: 'You tell yourself you\'ll purify your finances "when you have more money." But Shaytan\'s greatest trick is the promise of tomorrow. Every day you delay is a day you choose the status quo.',
                  icon: '⏳',
                },
              ].map((pain) => (
                <div key={pain.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:border-tmi-green/20 transition-all duration-300">
                  <span className="text-3xl block mb-4">{pain.icon}</span>
                  <h3 className="font-display text-xl font-bold text-tmi-charcoal mb-3">{pain.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{pain.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ THE BRIDGE / TRANSFORMATION ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-tmi-green-mist noise-bg overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="tmi-divider mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-5xl font-bold text-tmi-charcoal mb-6">
                From anxiety to Amanah.
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Imagine having the knowledge, the tools, and the community to confidently say: 
                &ldquo;Every dirham I own is Halal, every investment I make is pure, and my wealth 
                is a weapon for my Akhirah.&rdquo;
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Purify Your Wealth',
                  desc: 'Eliminate Riba and Haram from your portfolio with professional-grade screening tools and clear Shariah guidance.',
                  num: '01',
                },
                {
                  title: 'Free Up Your Time',
                  desc: 'A 5-minute monthly portfolio ritual replaces hours of anxiety. Spend your time on Ibadah, family, and the Ummah.',
                  num: '02',
                },
                {
                  title: 'Maximize Your Sadaqah',
                  desc: 'Build the financial capacity to give more. Sadaqah offers the best spiritual ROI—Allah multiplies every good deed.',
                  num: '03',
                },
                {
                  title: 'Face Allah with Confidence',
                  desc: 'Prepare your answers for the Day of Judgment: how you earned your wealth, how you spent it, and how you grew it.',
                  num: '04',
                },
              ].map((item) => (
                <div key={item.num} className="group relative bg-white rounded-2xl p-8 border border-tmi-green/10 hover:border-tmi-green/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className="text-5xl font-display font-bold text-tmi-green/10 group-hover:text-tmi-green/20 transition-colors absolute top-4 right-6">
                    {item.num}
                  </span>
                  <h3 className="font-display text-xl font-bold text-tmi-charcoal mb-3 mt-4">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CREDIBILITY / ABOUT MEHDI PREVIEW ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Photo placeholder */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-tmi-green/10 to-tmi-green-mist overflow-hidden flex items-center justify-center border border-tmi-green/10">
                  <div className="text-center p-8">
                    <div className="w-32 h-32 rounded-full bg-tmi-green/20 mx-auto mb-6 flex items-center justify-center">
                      <span className="text-5xl font-display font-bold text-tmi-green">M</span>
                    </div>
                    <p className="text-sm text-gray-500 italic">Headshot coming soon</p>
                  </div>
                </div>
                {/* Floating credential card */}
                <div className="absolute -bottom-6 -right-6 bg-tmi-charcoal text-white rounded-xl p-6 shadow-2xl max-w-xs hidden lg:block">
                  <p className="font-display text-lg font-semibold text-tmi-green-light">Senior Sukuk Portfolio Manager</p>
                  <p className="text-sm text-gray-400 mt-1">Managing $500M+ in Islamic Assets</p>
                  <p className="text-sm text-gray-400">Based in Dubai, UAE</p>
                </div>
              </div>

              {/* Text */}
              <div>
                <div className="tmi-divider mb-6" />
                <h2 className="font-display text-3xl md:text-4xl font-bold text-tmi-charcoal mb-6">
                  Not another &ldquo;guru.&rdquo;<br />
                  A professional who does this for a living.
                </h2>
                <div className="space-y-5 text-gray-600 leading-relaxed">
                  <p>
                    Mehdi is a Senior Sukuk Portfolio Manager at one of the region&apos;s leading 
                    Islamic financial institutions, managing over $500 million in Shariah-compliant 
                    assets. His career spans 15+ years in Islamic finance, starting from the aftermath 
                    of the 2008 financial crisis.
                  </p>
                  <p>
                    He launched The Muslim Investor with a singular mission: to help as many Muslims 
                    as possible avoid the Haram, invest purely, and use their wealth as a tool for 
                    their Akhirah. Not for profit—for Hassanat.
                  </p>
                  <p className="font-display text-xl text-tmi-charcoal font-semibold italic">
                    &ldquo;I&apos;m doing it for myself, because I need to collect as many Hassanat 
                    as possible. This is all I want to do.&rdquo;
                  </p>
                </div>
                <Link href="/about" className="btn-secondary mt-8 text-sm">
                  Read Mehdi&apos;s Full Story →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CURRICULUM PREVIEW ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-tmi-charcoal overflow-hidden">
          <div className="absolute inset-0 islamic-accent opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="tmi-divider mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
                12 Courses. One Mission.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                A comprehensive curriculum built by a professional fund manager—structured to take you 
                from complete beginner to confident, independent Muslim investor.
              </p>
            </div>

            {/* Three Pillars */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  pillar: 'The Foundation',
                  courses: [
                    'Course 1: Welcome to the Movement',
                    'Course 2: The Akhirah Mindset',
                  ],
                  desc: 'Build your spiritual and financial foundation. Understand why Halal investing is a duty, not a luxury.',
                  color: 'from-tmi-green/20 to-tmi-green/5',
                },
                {
                  pillar: "The Professional Investor's Journey",
                  courses: [
                    'Course 3: The Investor Profile',
                    'Course 4: The Investor\'s Mindset',
                    'Course 5: The World View',
                    'Course 6: The Halal Toolbox',
                    'Course 7: The Analysis',
                    'Course 8: The Amanah Portfolio',
                  ],
                  desc: 'Master the 6-step professional framework. From your investor profile to building and managing your portfolio.',
                  color: 'from-tmi-green/30 to-tmi-green/10',
                },
                {
                  pillar: 'Advanced & Resource Library',
                  courses: [
                    'Course 9: The Amanah Blueprints',
                    'Course 10: Applied TMI Case Studies',
                    'Course 11: The Professional\'s Guidebook',
                    'Course 12: Psychology of Managing Wealth',
                  ],
                  desc: 'Real case studies, advanced strategies, Zakat obligations, and the psychology of long-term wealth stewardship.',
                  color: 'from-tmi-green/40 to-tmi-green/15',
                },
              ].map((set) => (
                <div key={set.pillar} className="relative group">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${set.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-tmi-green/30 transition-all duration-300 h-full">
                    <h3 className="font-display text-xl font-bold text-tmi-green mb-3">{set.pillar}</h3>
                    <p className="text-sm text-gray-400 mb-6">{set.desc}</p>
                    <div className="space-y-2">
                      {set.courses.map((course) => (
                        <div key={course} className="flex items-start gap-2">
                          <span className="text-tmi-green mt-0.5 text-xs">◆</span>
                          <span className="text-sm text-gray-300">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/curriculum" className="btn-primary text-base">
                View Full Curriculum →
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ HOW IT WORKS ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="tmi-divider mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-5xl font-bold text-tmi-charcoal mb-6">
                How it works.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Join the Community',
                  desc: 'Enter our free Skool community. Introduce yourself, connect with fellow Muslim investors, and begin your journey.',
                },
                {
                  step: '2',
                  title: 'Learn at Your Pace',
                  desc: 'Work through 12 structured courses with video lessons, professional tools, and practical worksheets. Each course builds on the last.',
                },
                {
                  step: '3',
                  title: 'Build & Maintain',
                  desc: 'Construct your Amanah Portfolio with our Command Center. Then maintain it with a simple 5-minute monthly ritual.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-tmi-green/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-display font-bold text-tmi-green">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-tmi-charcoal mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ PRICING ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-tmi-green-mist geo-pattern">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="tmi-divider mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-5xl font-bold text-tmi-charcoal mb-4">
              Built for the 99%, not the 1%.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              &ldquo;You cannot tell me you want to help 2 billion Muslims and charge $250 per month. 
              That helps the 1%. I want to help the 99%.&rdquo;
            </p>

            <div className="bg-white rounded-3xl p-10 md:p-14 shadow-xl border border-tmi-green/10 max-w-lg mx-auto">
              <p className="text-sm font-semibold tracking-widest uppercase text-tmi-green mb-2">TMI Membership</p>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-6xl font-display font-bold text-tmi-charcoal">$9</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-500 text-sm mb-8">Less than a coffee a week.</p>

              <div className="space-y-4 text-left mb-10">
                {[
                  '12 professional courses with video lessons',
                  '14+ Excel tools & professional resources',
                  'Amanah Portfolio Command Center',
                  'Investor Profile Assessment',
                  'Zakat & Purification Calculator',
                  'Direct access to Mehdi',
                  'Private community of Muslim investors',
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <span className="text-tmi-green font-bold mt-0.5">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="https://www.skool.com/the-muslim-investor"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-base"
              >
                Start Your Journey — Join Free →
              </a>
              <p className="text-xs text-gray-400 mt-4">Free community access. Paid membership launches soon.</p>
            </div>
          </div>
        </section>

        {/* ═══════════ FINAL CTA ═══════════ */}
        <section className="relative py-24 lg:py-32 bg-tmi-charcoal text-center overflow-hidden">
          <div className="absolute inset-0 islamic-accent opacity-20" />
          <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-display text-2xl md:text-3xl text-tmi-green-light font-semibold leading-relaxed mb-8">
              &ldquo;The only obsession we should have is how prepared we are going to be when we face Allah, 
              Subhanahu wa ta&apos;ala.&rdquo;
            </p>
            <p className="text-gray-400 mb-10 text-lg">
              The journey begins here. Your wealth. Your Amanah. Your Akhirah.
            </p>
            <a
              href="https://www.skool.com/the-muslim-investor"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg"
            >
              Bismillah — Join the Movement →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
