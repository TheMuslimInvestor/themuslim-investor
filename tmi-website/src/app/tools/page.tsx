import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Free Tools | The Muslim Investor',
  description: 'Professional Islamic finance tools: Investor Profile Assessment, Akhirah Financial Compass, Stop-Loss Planner, and more.',
};

const tools = [
  {
    name: 'TMI Investor Profile Assessment',
    description: 'A comprehensive 35-question assessment that defines your unique Muslim Investor Profile. Covers risk tolerance, financial goals, values alignment, and competitive edges to create your personalized investing compass.',
    category: 'Self-Discovery',
    format: 'Interactive Excel',
    highlight: true,
  },
  {
    name: 'TMI Akhirah Financial Compass',
    description: 'Align your financial decisions with your Akhirah goals. This tool helps you evaluate investments, spending, and charitable giving through the lens of spiritual return—not just financial return.',
    category: 'Spiritual Framework',
    format: 'Excel Workbook',
    highlight: true,
  },
  {
    name: 'Islamic Stop-Loss & Profit Target Planner',
    description: 'A professional-grade risk management tool adapted for Halal portfolios. Set disciplined stop-loss levels and profit targets for each position, removing emotion from your investment decisions.',
    category: 'Risk Management',
    format: 'Excel Workbook',
    highlight: false,
  },
  {
    name: 'TMI Relationship Analyzer',
    description: 'Understand the correlations between your Halal asset classes. See how Sukuk, equities, gold, and Bitcoin interact in different market environments to build a truly diversified portfolio.',
    category: 'Portfolio Analysis',
    format: 'Excel Workbook',
    highlight: false,
  },
  {
    name: 'Barakah Budget Tracker',
    description: 'A simple, purpose-built budgeting system with Islamic categories including Sadaqah, Zakat, and investable surplus. See exactly where your rizq goes each month.',
    category: 'Financial Foundation',
    format: 'Excel Template',
    highlight: false,
  },
  {
    name: 'Riba-Free Debt Escape Plan',
    description: 'A step-by-step calculator and planner to prioritize eliminating interest-bearing debt from your life. Includes milestone tracking and motivational Islamic reminders.',
    category: 'Debt Freedom',
    format: 'Excel Template',
    highlight: false,
  },
  {
    name: 'Halal Equity Screener',
    description: 'Screen stocks for Shariah compliance using standard financial ratios and Halal criteria. Filter out companies with impermissible revenue sources or excessive debt.',
    category: 'Asset Screening',
    format: 'Excel Tool',
    highlight: false,
  },
  {
    name: 'Zakat & Purification Calculator',
    description: 'Calculate your Zakat obligations with precision across all asset classes. Includes purification calculations for any inadvertent Haram exposure in your portfolio.',
    category: 'Zakat & Purification',
    format: 'Excel Calculator',
    highlight: false,
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative pt-32 pb-20 bg-tmi-charcoal overflow-hidden">
          <div className="absolute inset-0 islamic-accent opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-tmi-green font-display text-lg italic mb-4">Professional Tools, Free Access</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                Institutional-grade tools.<br />Built for you.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Every tool is designed to save you time, eliminate guesswork, and keep 
                your financial life 100% Halal. Professional quality, zero cost.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ FEATURED TOOLS ═══════════ */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-16">
              <div className="tmi-divider mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-tmi-charcoal mb-3">
                Featured Tools
              </h2>
              <p className="text-lg text-gray-600">
                Start with these two cornerstone tools—they form the foundation of your TMI journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {tools.filter(t => t.highlight).map((tool) => (
                <div key={tool.name} className="group relative bg-gradient-to-br from-tmi-green-mist to-white rounded-2xl p-10 border-2 border-tmi-green/20 hover:border-tmi-green/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-tmi-green bg-tmi-green/10 px-3 py-1 rounded-full mb-4">
                    {tool.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-tmi-charcoal mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{tool.format}</span>
                    <span className="text-sm font-semibold text-tmi-green group-hover:translate-x-1 transition-transform">
                      Available in Community →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ═══════════ ALL TOOLS ═══════════ */}
            <div className="mb-12">
              <h2 className="font-display text-3xl font-bold text-tmi-charcoal mb-3">
                Complete Tool Library
              </h2>
              <p className="text-lg text-gray-600">
                All tools are available to community members for free.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => !t.highlight).map((tool) => (
                <div key={tool.name} className="bg-white rounded-xl p-7 border border-gray-100 hover:border-tmi-green/20 hover:shadow-md transition-all duration-300">
                  <span className="inline-block text-xs font-semibold tracking-widest uppercase text-tmi-green/70 mb-3">
                    {tool.category}
                  </span>
                  <h3 className="font-display text-lg font-bold text-tmi-charcoal mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  <span className="text-xs text-gray-400 font-medium">{tool.format}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ COMING SOON ═══════════ */}
        <section className="py-20 bg-tmi-green-mist">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold text-tmi-charcoal mb-4">
              Web apps coming soon.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              We&apos;re building professional web applications for every tool—interactive, 
              mobile-friendly, and shareable. The Excel versions are available now to get you started.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Investor Profile Web App', 'Zakat Calculator', 'Portfolio Dashboard', 'Halal Screener'].map((item) => (
                <span key={item} className="text-sm bg-white px-4 py-2 rounded-full border border-tmi-green/10 text-gray-600">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CTA ═══════════ */}
        <section className="py-24 bg-tmi-charcoal text-center">
          <div className="max-w-3xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Get instant access to all tools.
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join the free community and download every tool today. No payment required.
            </p>
            <a
              href="https://www.skool.com/the-muslim-investor"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base"
            >
              Join Free & Download Tools →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
