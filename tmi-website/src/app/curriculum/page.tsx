import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Curriculum | The Muslim Investor',
  description: '12 professional courses covering spiritual foundations, investor profiling, macro analysis, Halal asset classes, portfolio management, and more.',
};

const curriculum = [
  {
    set: 'The Foundation',
    setNum: 1,
    description: 'Build the spiritual and practical bedrock of your investing journey.',
    courses: [
      {
        num: 1,
        title: 'Welcome to the Movement',
        modules: [
          'Personal Welcome from the Founder',
          'How to Use This Platform & Community Guide',
          'Choosing and Opening a Shariah-Compliant Brokerage Account',
        ],
        transformation: 'You are no longer a passive observer. You are an active participant in the Movement, with your brokerage account open and ready.',
      },
      {
        num: 2,
        title: 'The Akhirah Mindset',
        modules: [
          'Is Being Wealthy Compatible with Being the Best Muslim?',
          'Why Halal Investing is a Spiritual Duty',
          'The Seriousness of Investing in Haram',
          'The Triangle of Halal Financial Freedom',
          'The Barakah Budget: Managing Your Cash Flow',
          'The Islamic View on Debt: Eliminating Riba',
          'Your Financial Fortress: Building Your Emergency Fund',
          'Key Terms & Concepts: Your Financial Dictionary',
        ],
        transformation: 'You possess an unshakeable conviction that building Halal wealth is an act of worship. You have a budget, a debt elimination plan, and the financial vocabulary to move forward.',
      },
    ],
  },
  {
    set: "The Professional Investor's Journey",
    setNum: 2,
    description: 'The 6-step professional framework that takes you from beginner to confident, independent Muslim investor.',
    courses: [
      {
        num: 3,
        title: 'Step 1 — The Investor Profile',
        modules: [
          'Defining Your Personal Vision',
          'Financial Goals & Objectives',
          'Understanding Your Financial Needs',
          'Your Relationship with Money',
          'Assessing Your Risk Tolerance',
          'How Your Career Shapes Your Profile',
          'Uncovering Your Hidden Competitive Edges',
          'Define Your Muslim Investor Profile',
        ],
        transformation: 'You hold your personalized "Compass of Conviction"—a roadmap that makes every future investment decision clearer and more confident.',
      },
      {
        num: 4,
        title: 'Step 2 — The Investor\'s Mindset',
        modules: [
          'The Market is Always Right: The Discipline of Humility',
          'Mastering Your Emotions: Conquering Fear & Greed',
          'The Lie of "Passive" Investing & The Virtue of Effort',
        ],
        transformation: 'You are a Resilient Believer—capable of observing market volatility with professional calm and the deep patience (Sabr) of a Muslim.',
      },
      {
        num: 5,
        title: 'Step 3 — The World View',
        modules: [
          'What is a Macro View & How to Develop Yours',
          'Economic Indicators: Leading, Lagging & Coincident',
          'The 4 Economic Regimes: Goldilocks, Reflation, Inflation, Recession',
          'The 6 Pillars: Growth, Inflation, Liquidity, Risk Appetite, Monetary & Fiscal Policy',
          'Growth Leading Indicators (4 modules)',
          'Inflation Leading Indicators (4 modules)',
          'Liquidity Leading Indicators (4 modules)',
          'Risk Appetite Leading Indicators (4 modules)',
          'Monetary & Fiscal Policy Analysis',
          'Business Cycles & Global Context',
        ],
        transformation: 'You are "The Watchtower"—able to analyze the global economic landscape, discern signal from noise, and allocate time to Ibadah instead of worrying about headlines.',
      },
      {
        num: 6,
        title: 'Step 4 — The Halal Toolbox',
        modules: [
          'What is a Halal Asset Class',
          'The 5 Halal Asset Classes: Sukuk, Equities, Cash, Gold, Bitcoin',
          'Growth Equities: Selection & Screening',
          'Dividend Equities: Income Strategies',
          'Sukuk: Halal vs. Bonds',
          'Islamic Deposits (Cash Management)',
          'Gold: Investment Methods & Compliance',
          'Bitcoin: Halal Assessment & Risks',
        ],
        transformation: 'You command the full arsenal of Halal investment tools. You know what each asset does, why it matters, and how to invest in it compliantly.',
      },
      {
        num: 7,
        title: 'Step 5 — The Analysis',
        modules: [
          'Fundamental Analysis for Halal Assets',
          'Technical Analysis Essentials',
          'Combining Macro, Fundamental & Technical Views',
        ],
        transformation: 'You can analyze any Halal asset with the confidence of a professional, combining multiple lenses into a coherent investment thesis.',
      },
      {
        num: 8,
        title: 'Step 6 — The Amanah Portfolio',
        modules: [
          'Portfolio Construction Principles',
          'Asset Allocation Strategies',
          'The 5-Minute Monthly Rebalancing Ritual',
          'Risk Management & Stop-Loss Framework',
          'The Amanah Portfolio Command Center',
        ],
        transformation: 'Your portfolio is built, balanced, and managed with institutional-grade discipline—requiring only 5 minutes a month to maintain.',
      },
    ],
  },
  {
    set: 'Advanced & Resource Library',
    setNum: 3,
    description: 'Deepen your mastery with real-world case studies, advanced strategies, and the complete stewardship framework.',
    courses: [
      {
        num: 9,
        title: 'The Amanah Blueprints',
        modules: [
          'Zakat Calculation & Obligations',
          'Portfolio Purification Methods',
          'The Pillars of Islamic Wealth Stewardship',
        ],
        transformation: 'You fulfill your Zakat obligations with precision and understand the complete framework of Islamic wealth stewardship.',
      },
      {
        num: 10,
        title: 'Applied TMI: Case Studies',
        modules: [
          'Real-World Portfolio Scenarios',
          'Market Crisis Response Playbooks',
          'Sector Analysis Examples',
        ],
        transformation: 'You can apply everything you\'ve learned to real-world situations with the confidence that comes from seeing it done.',
      },
      {
        num: 11,
        title: "The Professional's Guidebook",
        modules: [
          'Advanced Portfolio Optimization',
          'Multi-Asset Correlation Analysis',
          'Institutional-Grade Risk Frameworks',
        ],
        transformation: 'You operate at the level of a professional fund manager, with advanced tools and frameworks at your disposal.',
      },
      {
        num: 12,
        title: 'The Psychology of Managing Wealth',
        modules: [
          'Behavioral Finance & Islamic Perspective',
          'Long-Term Wealth Stewardship Mindset',
          'Building Generational Halal Wealth',
        ],
        transformation: 'You have mastered the inner game of investing—the psychology that separates those who build lasting, generational Halal wealth from those who don\'t.',
      },
    ],
  },
];

export default function CurriculumPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative pt-32 pb-20 bg-tmi-charcoal overflow-hidden">
          <div className="absolute inset-0 islamic-accent opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-tmi-green font-display text-lg italic mb-4">The Complete Curriculum</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                12 Courses.<br />One Akhirah-First Mission.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                A professional-grade curriculum that takes you from complete beginner to 
                confident, independent Muslim investor—without compromising a single principle.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ CURRICULUM SETS ═══════════ */}
        {curriculum.map((set, setIndex) => (
          <section
            key={set.set}
            className={`py-20 lg:py-24 ${setIndex % 2 === 0 ? 'bg-white' : 'bg-tmi-green-mist'}`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              {/* Set Header */}
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-semibold tracking-widest uppercase text-tmi-green bg-tmi-green/10 px-3 py-1 rounded-full">
                    Set {set.setNum}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-tmi-charcoal mb-3">
                  {set.set}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">{set.description}</p>
              </div>

              {/* Courses Grid */}
              <div className="space-y-8">
                {set.courses.map((course) => (
                  <div
                    key={course.num}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-8 md:p-10">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Course Number */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-tmi-green/10 flex items-center justify-center">
                          <span className="text-2xl font-display font-bold text-tmi-green">
                            {String(course.num).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-display text-2xl font-bold text-tmi-charcoal mb-4">
                            Course {course.num}: {course.title}
                          </h3>

                          {/* Modules */}
                          <div className="grid sm:grid-cols-2 gap-2 mb-6">
                            {course.modules.map((mod) => (
                              <div key={mod} className="flex items-start gap-2">
                                <span className="text-tmi-green text-xs mt-1.5 flex-shrink-0">◆</span>
                                <span className="text-sm text-gray-600">{mod}</span>
                              </div>
                            ))}
                          </div>

                          {/* Transformation */}
                          <div className="bg-tmi-green-mist rounded-xl p-5 border border-tmi-green/10">
                            <p className="text-xs font-semibold tracking-widest uppercase text-tmi-green mb-2">
                              Your Transformation
                            </p>
                            <p className="text-sm text-tmi-charcoal leading-relaxed">
                              {course.transformation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ═══════════ CTA ═══════════ */}
        <section className="py-24 bg-tmi-charcoal text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to begin?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join the free community and start your journey toward Akhirah-first wealth building.
            </p>
            <a
              href="https://www.skool.com/the-muslim-investor"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
            >
              Bismillah — Join the Community →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
