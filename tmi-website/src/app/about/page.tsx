import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Mehdi | The Muslim Investor',
  description: 'Meet Mehdi — Senior Sukuk Portfolio Manager managing $500M+ in Islamic assets, and the founder of The Muslim Investor.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative pt-32 pb-20 bg-tmi-charcoal overflow-hidden">
          <div className="absolute inset-0 islamic-accent opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-tmi-green font-display text-lg italic mb-4">The Man Behind the Mission</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Meet Mehdi.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Senior Sukuk Portfolio Manager. 15+ years in Islamic finance. 
                $500M+ in Shariah-compliant assets under management. Based in Dubai.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ THE STORY ═══════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Photo Column */}
              <div>
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-tmi-green/10 to-tmi-green-mist overflow-hidden flex items-center justify-center border border-tmi-green/10 sticky top-28">
                  <div className="text-center p-6">
                    <div className="w-24 h-24 rounded-full bg-tmi-green/20 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl font-display font-bold text-tmi-green">M</span>
                    </div>
                    <p className="text-xs text-gray-500 italic">Headshot coming soon</p>
                  </div>
                </div>
              </div>

              {/* Story Column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <div className="tmi-divider mb-6" />
                  <h2 className="font-display text-3xl font-bold text-tmi-charcoal mb-6">The Spark</h2>
                  <div className="space-y-5 text-gray-600 leading-relaxed">
                    <p>
                      Mehdi&apos;s journey into finance began in the aftermath of one of the worst 
                      financial crises in modern history—the 2008 global meltdown. While the world 
                      questioned the very foundations of conventional banking, Mehdi found himself 
                      drawn to a different path.
                    </p>
                    <p>
                      His first professional experience was at a regional Islamic bank in the UAE, 
                      where he met remarkable people who planted the seed of what Islamic finance 
                      could truly be—and ignited the spark of an entirely different economic paradigm.
                    </p>
                    <p className="font-display text-xl text-tmi-charcoal font-semibold italic border-l-4 border-tmi-green pl-6">
                      &ldquo;What drives the price of an asset—and what impact any particular 
                      situation will have on an asset—that stimulates me to the point almost 
                      of obsession.&rdquo;
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold text-tmi-charcoal mb-6">The Crucible</h2>
                  <div className="space-y-5 text-gray-600 leading-relaxed">
                    <p>
                      Mehdi&apos;s path wasn&apos;t linear. After years in Islamic finance, he 
                      ventured into entrepreneurship—and experienced devastating failure. He 
                      describes it as a mourning period: watching something you built with your 
                      heart slowly, painfully collapse like a house of cards.
                    </p>
                    <p>
                      But even during that period, he found himself escaping back to finance—watching 
                      market news, following Warren Buffett interviews, analyzing asset prices. It was 
                      his fitrah, calling him back.
                    </p>
                    <p>
                      He made a decision that changed everything: <em>&ldquo;Why am I making what was 
                      supposed to be my life an escape? It should be my core, foundational, fundamental 
                      way of professional life.&rdquo;</em>
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold text-tmi-charcoal mb-6">The Mission</h2>
                  <div className="space-y-5 text-gray-600 leading-relaxed">
                    <p>
                      Today, Mehdi serves as a Senior Sukuk Portfolio Manager at one of the region&apos;s 
                      leading Islamic financial institutions. He manages over $500 million in 
                      Shariah-compliant assets, delivering consistent, respectable results for 
                      institutional investors.
                    </p>
                    <p>
                      But his professional success revealed a painful truth: millions of Muslims 
                      around the world are investing through schemes that deploy Haram stocks—and 
                      they don&apos;t even know it. They are, indirectly, collecting sayyi&apos;at.
                    </p>
                    <p>
                      The Muslim Investor was born from a simple, selfless realization:
                    </p>
                    <p className="font-display text-xl text-tmi-charcoal font-semibold italic border-l-4 border-tmi-green pl-6">
                      &ldquo;If I&apos;m going to be really honest, in a very selfish manner, I want 
                      to collect Hassanat. This is what I want to do. This is all I want to do. And 
                      it&apos;s going to be done through helping as many Muslims as possible.&rdquo;
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold text-tmi-charcoal mb-6">The Conviction</h2>
                  <div className="space-y-5 text-gray-600 leading-relaxed">
                    <p>
                      Someone challenged Mehdi early on: &ldquo;You can&apos;t say you want to help 
                      2 billion Muslims and then charge $250 a month. That helps the 1%, not the 99%.&rdquo;
                    </p>
                    <p>
                      That stopped him right there. TMI would be accessible to everyone—less than $10 
                      a month. Because the mission was never about building a business. It was about 
                      building a scale on the Day of Judgment.
                    </p>
                    <p>
                      Alhamdulillah, Allah has been very kind—reducing the doors to the Haram and 
                      opening the gates toward the Halal. This platform is the culmination of that 
                      journey: institutional-grade Islamic finance education, made accessible to every 
                      Muslim with the courage to begin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CREDENTIALS ═══════════ */}
        <section className="py-20 bg-tmi-green-mist">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-tmi-charcoal text-center mb-12">
              Professional Background
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '📊', title: 'Senior Portfolio Manager', desc: 'Managing $500M+ in Sukuk & Islamic assets' },
                { icon: '🏦', title: 'Islamic Finance Expert', desc: '15+ years across Islamic banking, trading & asset management' },
                { icon: '🌍', title: 'Dubai-Based', desc: 'Operating from the heart of global Islamic finance' },
                { icon: '📜', title: '100% Shariah Compliant', desc: 'Never transacted a single Haram asset in his career' },
              ].map((cred) => (
                <div key={cred.title} className="bg-white rounded-xl p-6 text-center border border-tmi-green/10">
                  <span className="text-3xl block mb-3">{cred.icon}</span>
                  <h3 className="font-display text-lg font-bold text-tmi-charcoal mb-2">{cred.title}</h3>
                  <p className="text-sm text-gray-600">{cred.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="py-24 bg-tmi-charcoal text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="font-display text-2xl md:text-3xl text-tmi-green-light font-semibold leading-relaxed mb-8">
              &ldquo;I want to help as many people as possible to be conscious enough to 
              intellectually avoid the Haram.&rdquo;
            </p>
            <a
              href="https://www.skool.com/the-muslim-investor"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
            >
              Join Mehdi&apos;s Free Community →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
