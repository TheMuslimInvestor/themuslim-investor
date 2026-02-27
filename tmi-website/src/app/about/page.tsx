import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About Mehdi | The Muslim Investor',
  description: 'Senior Sukuk Portfolio Manager managing $500M+ in Islamic assets. Durham MSc Islamic Finance. 15+ years in Islamic capital markets. The story behind TMI.',
};

export default function AboutPage() {
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
              The Man Behind<br />the Mission.
            </h1>
            <p className="text-lg text-onyx-200 leading-relaxed max-w-2xl mx-auto">
              Senior Sukuk Portfolio Manager. $500M+ in Islamic assets. 
              15+ years in Islamic capital markets. Based in Dubai.
              This is not a marketing narrative — it is proof.
            </p>
          </div>
        </section>

        {/* STORY */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Photo */}
              <div>
                <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-viridian/10 via-cambridge/10 to-ivory flex items-center justify-center border border-viridian/10 sticky top-28">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 rounded-full bg-viridian/15 mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-black text-viridian">M</span>
                    </div>
                    <p className="text-xs text-dimgray italic">Headshot coming soon</p>
                  </div>
                </div>
              </div>

              {/* Story */}
              <div className="lg:col-span-2 space-y-12">
                {/* 2008 */}
                <div>
                  <div className="tmi-line mb-6" />
                  <h2 className="text-2xl md:text-3xl font-black text-onyx mb-6">Forged in Crisis: 2008</h2>
                  <div className="space-y-4 text-dimgray leading-relaxed">
                    <p>
                      Mehdi entered finance at the worst possible moment — during the 2008 financial crisis, when 
                      the conventional system collapsed like a house of cards. He watched the global financial 
                      architecture crumble in real time, just as he was completing his education.
                    </p>
                    <p>
                      But what felt like devastation was <strong className="text-onyx">divine redirection</strong>. 
                      Witnessing the fragility of a system built on Riba, Mehdi pursued a Master&apos;s degree in 
                      Islamic Finance at Durham University while simultaneously preparing for the CFA examination.
                    </p>
                    <p>
                      Obsessed with starting in Islamic finance, he reached out to <strong className="text-onyx">over 
                      200 professionals</strong> across London, Switzerland, and the entire GCC. That relentless 
                      hustle led to his first role: Junior Sukuk and Equities Trader at one of the largest Islamic 
                      financial institutions in Abu Dhabi, in early 2011.
                    </p>
                    <p>
                      He loved it. For five years, he immersed himself in Islamic capital markets — trading Sukuk, 
                      executing Shariah-compliant transactions, and building the institutional expertise that would 
                      later become TMI&apos;s backbone.
                    </p>
                  </div>
                </div>

                {/* Urban Chefs */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-onyx mb-6">The Entrepreneurial Crucible</h2>
                  <div className="space-y-4 text-dimgray leading-relaxed">
                    <p>
                      After five years in institutional Islamic finance, Mehdi felt the pull of entrepreneurship. 
                      In 2016, he founded Urban Chefs — a foodtech company delivering daily-changing menus to 
                      offices. He poured everything into it: his time, his savings, his identity.
                    </p>
                    <p>
                      With the grace of Allah, it came to life. It grew. And then, slowly and painfully, it began 
                      to die. Not suddenly. Like watching something you built with your heart fade before your eyes.
                    </p>
                    <div className="bg-ivory rounded-xl p-6 border-l-4 border-viridian">
                      <p className="text-base text-onyx italic font-medium leading-relaxed">
                        &ldquo;It was really a mourning. You&apos;re imagining something — with the grace of Allah — 
                        you bring it to life. It&apos;s growing. And then suddenly it has to die. Like a house of cards.&rdquo;
                      </p>
                    </div>
                    <p>
                      That failure was not a business lesson. It was a <strong className="text-onyx">spiritual 
                      recalibration</strong>. It shattered the illusion that Mehdi was an entrepreneur. And it 
                      revealed something profound: even while running a food company, every time he sought 
                      escape — intellectually, emotionally — he found himself watching finance interviews, 
                      studying market dynamics. Finance was not his career. It was his <em>fitrah</em>.
                    </p>
                  </div>
                </div>

                {/* The Return */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-onyx mb-6">The Return and the Mission</h2>
                  <div className="space-y-4 text-dimgray leading-relaxed">
                    <p>
                      Mehdi returned to institutional Islamic finance in 2018 with deeper gratitude and sharper 
                      clarity. Today he serves as a <strong className="text-onyx">Senior Sukuk Portfolio Manager</strong> in 
                      Dubai, managing over $500 million in Shariah-compliant assets.
                    </p>
                    <p>
                      But his professional success revealed a painful truth: millions of Muslims worldwide invest 
                      through schemes that deploy haram stocks — and they don&apos;t even know it. They are, 
                      indirectly, collecting sayyi&apos;at.
                    </p>
                    <p>
                      The question became inescapable: <em>If I love this work so much, and if the Ummah needs 
                      it so badly, why am I keeping it locked behind institutional walls?</em>
                    </p>
                  </div>
                </div>

                {/* The Confession */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-onyx mb-6">The Selfish Confession</h2>
                  <div className="space-y-4 text-dimgray leading-relaxed">
                    <p>
                      Mehdi does not pretend altruism. His why is beautifully, transparently selfish — in the 
                      most Islamic sense possible:
                    </p>
                    <div className="bg-ivory rounded-xl p-6 border-l-4 border-viridian">
                      <p className="text-base text-onyx italic font-medium leading-relaxed">
                        &ldquo;If I&apos;m really true to myself — all of this pricing and money and revenue 
                        and business — this is not why I&apos;m doing it. In a very selfish manner, I want 
                        to collect Hasanat. This is what I want to do. This is all I want to do.&rdquo;
                      </p>
                    </div>
                    <p>
                      This confession is disarming because it is honest. When a man tells you he is doing 
                      this to save his own soul — and the way he saves his soul is by saving yours — you 
                      trust him. Because his incentives and yours are identical.
                    </p>
                  </div>
                </div>

                {/* $9 Moment */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-onyx mb-6">The $9 Decision</h2>
                  <div className="space-y-4 text-dimgray leading-relaxed">
                    <p>
                      A friend heard Mehdi&apos;s vision to help two billion Muslims — then heard his 
                      pricing: $250/month. And he said the words that changed everything:
                    </p>
                    <div className="bg-ivory rounded-xl p-6 border-l-4 border-viridian">
                      <p className="text-base text-onyx italic font-medium leading-relaxed">
                        &ldquo;You cannot tell me you want to help two billion Muslims and charge $250 a month. 
                        That&apos;s helping the one percent. Not the ninety-nine.&rdquo;
                      </p>
                    </div>
                    <p>
                      That was a slap to the soul. TMI was reborn — not as a business, but as a mission. 
                      At <strong className="text-onyx">$9 a month</strong>. Because a $250 fee serves the 
                      wealthy. A $9 fee serves the doctor in Jeddah and the student in Jakarta. It serves 
                      the entire Ummah.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIALS */}
        <section className="py-20 bg-ivory">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <h2 className="text-2xl font-black text-onyx text-center mb-12">Credibility Proof Points</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: '$500M Islamic Assets', desc: 'Senior Sukuk Portfolio Manager at a leading Dubai-based Islamic asset management firm.' },
                { title: 'Durham MSc + CFA', desc: 'Master\u2019s in Islamic Finance from Durham University. CFA candidate. Academic depth and professional rigor.' },
                { title: '200+ Cold Outreaches', desc: 'He fought his way into Islamic finance. Contacting 200+ professionals across London, Switzerland, and the GCC.' },
                { title: 'Daily Practitioner', desc: 'He executes Islamic financial transactions every single working day. His tools are the same logic he uses professionally.' },
                { title: 'Protected from Haram', desc: 'His entire career has been in Islamic finance. Allah closed the doors of conventional finance and opened the halal path.' },
                { title: '$9/Month Proof of Niyyah', desc: 'No one prices a $500M fund manager\u2019s expertise at $9/month unless the mission is genuine.' },
              ].map(c => (
                <div key={c.title} className="bg-white rounded-xl p-6 border border-viridian/10">
                  <h3 className="text-base font-bold text-onyx mb-2">{c.title}</h3>
                  <p className="text-sm text-dimgray leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 mesh-dark text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <p className="text-xl md:text-2xl text-viridian-100 font-semibold leading-relaxed mb-8 italic">
              &ldquo;The most beloved of people to Allah are those who are most beneficial to people.&rdquo;
            </p>
            <p className="text-sm text-dimgray mb-2">— Al-Mu&apos;jam al-Awsat. Graded Hasan by Al-Albani.</p>
            <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
              className="btn-primary text-base mt-8 inline-flex">
              Join Mehdi&apos;s Free Community →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
