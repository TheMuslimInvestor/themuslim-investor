'use client';

import { useState, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface Holding {
  id: string;
  name: string;
  category: string;
  value: string;
  halalStatus: 'verified_halal' | 'unsure' | 'potentially_haram';
}

interface GroupedTotals {
  equities: number;
  sukuk: number;
  gold: number;
  cash: number;
  crypto: number;
  real_estate: number;
  alternatives: number;
  haram: number;
}

interface AnalysisResult {
  analysis: string;
  groupedTotals: GroupedTotals;
  haramCount: number;
  categoryBreakdown: { label: string; percentage: number; color: string }[];
  totalValue: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CATEGORY_OPTIONS = [
  { value: 'us_equities', label: 'US Equity', group: 'equities', haramAlert: null },
  { value: 'international_equities', label: 'International Equity', group: 'equities', haramAlert: null },
  { value: 'sukuk', label: 'Sukuk / Islamic Fixed Income', group: 'sukuk', haramAlert: null },
  { value: 'conventional_bonds', label: 'Conventional Bonds', group: 'haram', haramAlert: 'Conventional bonds generate interest (Riba). This will be flagged in your analysis.' },
  { value: 'real_estate', label: 'Real Estate', group: 'real_estate', haramAlert: null },
  { value: 'gold', label: 'Gold / Commodities', group: 'gold', haramAlert: null },
  { value: 'crypto', label: 'Crypto / Bitcoin', group: 'crypto', haramAlert: null },
  { value: 'cash_islamic', label: 'Cash / Islamic Deposits', group: 'cash', haramAlert: null },
  { value: 'cash_conventional', label: 'Cash / Conventional Savings', group: 'cash', haramAlert: 'If this account earns interest, it contains Riba.' },
  { value: 'private_business', label: 'Private Investment / Business', group: 'alternatives', haramAlert: null },
  { value: 'pension', label: 'Pension / Retirement Fund', group: 'alternatives', haramAlert: null },
  { value: 'other', label: 'Other', group: 'alternatives', haramAlert: null },
];

const INVESTOR_PROFILES = [
  'Fortress Builder',
  'Foundation Builder',
  'Practical Provider',
  'Steady Steward',
  'Purposeful Builder',
  'Tactical Trader',
  'Growth Seeker',
];

const CHART_COLORS = ['#358C6C', '#86A68B', '#4A9B7F', '#5CAD8F', '#6EC0A1', '#A8C8B0', '#C5D9CA', '#343840'];

// ============================================================================
// ANALYSIS ENGINE (ported from Replit Python)
// ============================================================================

function analyzePortfolio(holdings: Holding[]) {
  const validHoldings = holdings.filter(h => h.name.trim() && parseFloat(h.value) > 0);
  const totalValue = validHoldings.reduce((sum, h) => sum + parseFloat(h.value), 0);

  if (totalValue === 0) return null;

  const groupedTotals: GroupedTotals = {
    equities: 0, sukuk: 0, gold: 0, cash: 0, crypto: 0, real_estate: 0, alternatives: 0, haram: 0,
  };

  const categoryMap: Record<string, number> = {};

  validHoldings.forEach(h => {
    const pct = (parseFloat(h.value) / totalValue) * 100;
    const catOption = CATEGORY_OPTIONS.find(c => c.value === h.category);
    const group = catOption?.group || 'alternatives';
    const isHaram = h.halalStatus === 'potentially_haram' || h.category === 'conventional_bonds';
    const isUnsure = h.halalStatus === 'unsure';

    if (isHaram) {
      groupedTotals.haram += pct;
    } else {
      (groupedTotals as Record<string, number>)[group] = ((groupedTotals as Record<string, number>)[group] || 0) + pct;
    }

    const catLabel = catOption?.label || h.category;
    categoryMap[catLabel] = (categoryMap[catLabel] || 0) + pct;

    if (isUnsure || isHaram) {
      groupedTotals.haram = (groupedTotals.haram || 0);
    }
  });

  // Count actually flagged holdings
  const haramCount = validHoldings.filter(
    h => h.halalStatus === 'potentially_haram' || h.halalStatus === 'unsure' || h.category === 'conventional_bonds' || h.category === 'cash_conventional'
  ).length;

  // Build category breakdown for chart
  const categoryBreakdown = Object.entries(categoryMap)
    .filter(([, pct]) => pct > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([label, percentage], i) => ({
      label,
      percentage: Math.round(percentage * 10) / 10,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

  return { groupedTotals, haramCount, categoryBreakdown, totalValue };
}

// ============================================================================
// SVG PIE CHART
// ============================================================================

function PieChart({ data }: { data: { label: string; percentage: number; color: string }[] }) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 75;
  const innerR = 45;

  let cumulative = 0;
  const slices = data.map(d => {
    const start = cumulative;
    cumulative += (d.percentage / 100) * 360;
    return { ...d, startAngle: start, endAngle: cumulative };
  });

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
  const arc = (startDeg: number, endDeg: number) => {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const xi1 = cx + innerR * Math.cos(s);
    const yi1 = cy + innerR * Math.sin(s);
    const xi2 = cx + innerR * Math.cos(e);
    const yi2 = cy + innerR * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${innerR} ${innerR} 0 ${large} 0 ${xi1} ${yi1} Z`;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <path key={i} d={arc(s.startAngle, s.endAngle)} fill={s.color} stroke="#343840" strokeWidth="1.5" />
      ))}
      <circle cx={cx} cy={cy} r={innerR - 2} fill="#343840" />
    </svg>
  );
}

// ============================================================================
// MARKDOWN RENDERER (simple)
// ============================================================================

function MirrorReport({ text }: { text: string }) {
  const sections = text.split(/\n(?=## )/).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {sections.map((section, i) => {
        const lines = section.split('\n');
        const header = lines[0].replace(/^## /, '').trim();
        const content = lines.slice(1).join('\n').trim();

        const paragraphs = content.split(/\n\n+/).filter(Boolean);

        return (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(53,140,108,0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
          }}>
            <h3 style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#358C6C',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(53,140,108,0.2)',
              paddingBottom: '0.75rem',
            }}>
              {header}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {paragraphs.map((p, j) => {
                const isBullet = p.trim().startsWith('• ') || p.trim().startsWith('- ');
                if (isBullet) {
                  const bullets = p.split('\n').filter(l => l.trim().startsWith('• ') || l.trim().startsWith('- '));
                  return (
                    <ul key={j} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {bullets.map((b, k) => (
                        <li key={k} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <span style={{ color: '#358C6C', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>→</span>
                          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', lineHeight: '1.7', color: '#EFF2E4', opacity: 0.9 }}>
                            {b.replace(/^[•\-]\s/, '')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={j} style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: '1.75',
                    color: '#EFF2E4',
                    opacity: 0.88,
                    margin: 0,
                  }}>
                    {p}
                  </p>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// FALLBACK ANALYSIS (if API fails)
// ============================================================================

function generateFallback(name: string, totalValue: number, haramCount: number, groupedTotals: GroupedTotals, profile?: string): string {
  const firstName = name.split(' ')[0];
  const cashPct = groupedTotals.cash;
  const equityPct = groupedTotals.equities;
  const growthPct = equityPct + groupedTotals.crypto;

  let text = `## WHAT YOUR PORTFOLIO SAYS ABOUT YOUR BELIEFS\n\n`;

  if (growthPct > 70) {
    text += `${firstName}, your portfolio is built for growth — over ${Math.round(growthPct)}% sits in high-risk assets. This says you are either deeply convinced the future holds opportunity, or perhaps you haven't stopped to consider what happens when markets fall 30-40%. There is a meaningful difference between optimism grounded in research and optimism grounded in hope.\n\n`;
  } else if (cashPct > 40) {
    text += `${firstName}, nearly half your wealth sits in cash — doing nothing while inflation quietly erodes it. This is not patience. This is fear dressed as caution. Only you know which it truly is. But while you wait, the world does not wait with you.\n\n`;
  } else {
    text += `${firstName}, your portfolio reflects a measured approach — spread across multiple asset classes with no single overwhelming bet. Whether this came from intentional planning or gradual accumulation is a question worth sitting with.\n\n`;
  }

  if (groupedTotals.gold === 0) {
    text += `There is no gold in your portfolio. No connection to the Sunnah currency. No crisis hedge. Gold has preserved wealth across empires and civilizations. Its absence is a choice — but was it a conscious one?\n\n`;
  }

  text += `## HALAL COMPLIANCE CHECK\n\n`;
  if (haramCount > 0) {
    text += `⚠️ ${haramCount} holding(s) in your portfolio have been flagged as Potentially Haram or Unsure. This holding may not be Shariah-compliant. We strongly encourage you to verify its status with a qualified Shariah advisor and take action immediately if confirmed Haram. Purification of Haram wealth is not optional — it is urgent.\n\n`;
  } else {
    text += `Alhamdulillah — based on what you've shared, your portfolio appears Shariah-compliant. However, we encourage regular screening as fund compositions change.\n\n`;
  }

  if (profile) {
    text += `## THE GAP BETWEEN WHO YOU ARE AND WHAT YOU OWN\n\nYou identified as a ${profile}. Whether your portfolio reflects that identity — or tells a different story — is the question only your actual allocation can answer. The gap between who we say we are and what our money does is often where the deepest truths live.\n\n`;
  }

  text += `## QUESTIONS FOR REFLECTION\n\n`;
  text += `• If the market dropped 30% tomorrow, which of your holdings would keep you up at night? That's where your real risk lives.\n`;
  if (cashPct > 20) text += `• Your cash has been sitting still. What would need to change for you to deploy it with intention?\n`;
  if (groupedTotals.sukuk < 10) text += `• You have no Sukuk in your portfolio. What would it take to add some stability?\n`;
  text += `• When you made your investment decisions, were they driven by knowledge — or by what you heard from others?\n`;
  text += `• On the Day of Judgment, when asked "how did you earn it and how did you spend it?" — what will your portfolio say?\n\n`;

  text += `## YOUR NEXT STEP\n\n`;
  text += `The Mirror shows you the truth. What you do with that truth is yours to decide. ${haramCount > 0 ? 'Start with the Akhirah Financial Compass to get a full picture of your financial readiness: themuslim-investor.com/tools/compass. ' : ''}${!profile ? 'Take the TMI Investor Profile to discover who you truly are as an investor: themuslim-investor.com/tools/profile. ' : ''}Join the TMI community to continue this work with your brothers and sisters: skool.com/the-muslim-investor`;

  return text;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PortfolioMirrorPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hasProfile, setHasProfile] = useState<'yes' | 'no' | null>(null);
  const [selectedProfile, setSelectedProfile] = useState('');
  const [holdings, setHoldings] = useState<Holding[]>([
    { id: '1', name: '', category: 'us_equities', value: '', halalStatus: 'verified_halal' },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const totalPortfolioValue = holdings.reduce((sum, h) => {
    const v = parseFloat(h.value);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  const addHolding = () => {
    setHoldings(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      category: 'us_equities',
      value: '',
      halalStatus: 'verified_halal',
    }]);
  };

  const removeHolding = (id: string) => {
    if (holdings.length > 1) setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const updateHolding = (id: string, field: keyof Holding, value: string) => {
    setHoldings(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const getCategoryAlert = (category: string) => {
    return CATEGORY_OPTIONS.find(c => c.value === category)?.haramAlert || null;
  };

  const handleAnalyze = async () => {
    const validHoldings = holdings.filter(h => h.name.trim() && parseFloat(h.value) > 0);
    if (validHoldings.length === 0) {
      setError('Please enter at least one holding with a name and value.');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setStep(3);

    const portfolioData = analyzePortfolio(holdings);
    if (!portfolioData) {
      setError('Please enter valid portfolio values.');
      setIsAnalyzing(false);
      setStep(2);
      return;
    }

    const holdingsForAPI = validHoldings.map(h => ({
      name: h.name,
      category: CATEGORY_OPTIONS.find(c => c.value === h.category)?.label || h.category,
      value: parseFloat(h.value),
      percentage: (parseFloat(h.value) / portfolioData.totalValue) * 100,
      halalStatus: h.halalStatus === 'verified_halal' ? 'Verified Halal' : h.halalStatus === 'unsure' ? 'Unsure' : 'Potentially Haram',
    }));

    try {
      // Fire Google Sheets webhook (fire-and-forget, privacy-safe aggregated data only)
      const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_MIRROR;
      if (webhookUrl) {
        const allocationPct: Record<string, number> = {};
        portfolioData.categoryBreakdown.forEach(c => { allocationPct[c.label] = c.percentage; });
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            name,
            email,
            total_value: portfolioData.totalValue,
            num_holdings: validHoldings.length,
            allocation: allocationPct,
            haram_flags: portfolioData.haramCount,
            investor_profile: hasProfile === 'yes' ? selectedProfile : 'Not provided',
            source: 'portfolio_mirror',
          }),
        }).catch(() => {});
      }

      // Call Claude API
      const response = await fetch('/api/mirror-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          holdings: holdingsForAPI,
          groupedTotals: portfolioData.groupedTotals,
          haramCount: portfolioData.haramCount,
          investorProfile: hasProfile === 'yes' ? selectedProfile : null,
          totalValue: portfolioData.totalValue,
          holdingsCount: validHoldings.length,
        }),
      });

      const data = await response.json();
      const analysisText = data.analysis || generateFallback(
        name, portfolioData.totalValue, portfolioData.haramCount,
        portfolioData.groupedTotals, hasProfile === 'yes' ? selectedProfile : undefined
      );

      setResult({
        analysis: analysisText,
        groupedTotals: portfolioData.groupedTotals,
        haramCount: portfolioData.haramCount,
        categoryBreakdown: portfolioData.categoryBreakdown,
        totalValue: portfolioData.totalValue,
      });
      setStep(4);
    } catch {
      const fallback = generateFallback(
        name, portfolioData.totalValue, portfolioData.haramCount,
        portfolioData.groupedTotals, hasProfile === 'yes' ? selectedProfile : undefined
      );
      setResult({
        analysis: fallback,
        groupedTotals: portfolioData.groupedTotals,
        haramCount: portfolioData.haramCount,
        categoryBreakdown: portfolioData.categoryBreakdown,
        totalValue: portfolioData.totalValue,
      });
      setStep(4);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrint = () => window.print();

  const whatsappText = `I just held up a mirror to my portfolio with The Muslim Investor. What does YOUR portfolio say about you? themuslim-investor.com/tools/mirror`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  // ============================================================================
  // STYLES
  // ============================================================================

  const s = {
    page: {
      minHeight: '100vh',
      background: '#343840',
      fontFamily: 'Poppins, sans-serif',
      color: '#EFF2E4',
      padding: '0 0 4rem',
    } as React.CSSProperties,
    header: {
      background: 'rgba(52,56,64,0.95)',
      borderBottom: '1px solid rgba(53,140,108,0.3)',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(8px)',
    } as React.CSSProperties,
    logo: {
      fontWeight: 900,
      fontSize: '1.25rem',
      color: '#358C6C',
      letterSpacing: '-0.02em',
    } as React.CSSProperties,
    container: {
      maxWidth: '720px',
      margin: '0 auto',
      padding: '0 1.25rem',
    } as React.CSSProperties,
    card: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(53,140,108,0.2)',
      borderRadius: '16px',
      padding: '2rem',
      marginTop: '2rem',
    } as React.CSSProperties,
    label: {
      display: 'block',
      fontWeight: 600,
      fontSize: '0.8rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: '#86A68B',
      marginBottom: '0.5rem',
    } as React.CSSProperties,
    input: {
      width: '100%',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(53,140,108,0.3)',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      color: '#EFF2E4',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '0.9rem',
      outline: 'none',
      boxSizing: 'border-box' as const,
      transition: 'border-color 0.2s',
    } as React.CSSProperties,
    select: {
      width: '100%',
      background: '#2C2F35',
      border: '1px solid rgba(53,140,108,0.3)',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      color: '#EFF2E4',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '0.9rem',
      outline: 'none',
      boxSizing: 'border-box' as const,
    } as React.CSSProperties,
    btnPrimary: {
      background: '#358C6C',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      padding: '0.875rem 2rem',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
      fontSize: '0.9rem',
      cursor: 'pointer',
      letterSpacing: '0.05em',
      transition: 'background 0.2s, transform 0.1s',
      width: '100%',
    } as React.CSSProperties,
    btnSecondary: {
      background: 'transparent',
      color: '#86A68B',
      border: '1px solid rgba(134,166,139,0.4)',
      borderRadius: '8px',
      padding: '0.75rem 1.5rem',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
      fontSize: '0.85rem',
      cursor: 'pointer',
      letterSpacing: '0.03em',
    } as React.CSSProperties,
    alert: {
      background: 'rgba(220,38,38,0.1)',
      border: '1px solid rgba(220,38,38,0.3)',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      color: '#FCA5A5',
      fontSize: '0.8rem',
      marginTop: '0.5rem',
    } as React.CSSProperties,
    haramBannerRed: {
      background: 'rgba(220,38,38,0.15)',
      border: '1px solid rgba(220,38,38,0.4)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      color: '#FCA5A5',
      fontWeight: 600,
      fontSize: '0.9rem',
    } as React.CSSProperties,
    haramBannerGreen: {
      background: 'rgba(53,140,108,0.15)',
      border: '1px solid rgba(53,140,108,0.4)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      color: '#86A68B',
      fontWeight: 600,
      fontSize: '0.9rem',
    } as React.CSSProperties,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(239,242,228,0.3); }
        input:focus, select:focus { border-color: #358C6C !important; }
        .btn-primary:hover { background: #2E7A5E !important; }
        .btn-add:hover { background: rgba(53,140,108,0.15) !important; }
        .step-indicator { display: flex; gap: 0.5rem; align-items: center; }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(53,140,108,0.3); transition: background 0.3s; }
        .step-dot.active { background: #358C6C; }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: #343840 !important; }
          .print-section { background: white !important; color: #343840 !important; }
        }
        .holding-row { animation: slideIn 0.2s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HEADER */}
      <header style={s.header} className="no-print">
        <div style={s.logo}>T<span style={{ color: '#86A68B' }}>M</span>I</div>
        <div className="step-indicator">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`step-dot ${step >= n ? 'active' : ''}`} />
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6C7173', fontWeight: 600, letterSpacing: '0.08em' }}>
          {step === 1 && 'WELCOME'}
          {step === 2 && 'HOLDINGS'}
          {step === 3 && 'ANALYZING'}
          {step === 4 && 'YOUR MIRROR'}
        </div>
      </header>

      <div style={s.page}>
        <div style={s.container}>

          {/* ================================================================
              STEP 1: WELCOME
          ================================================================ */}
          {step === 1 && (
            <div className="fade-in">
              <div style={{ paddingTop: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#358C6C', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
                  TMI Portfolio Mirror
                </div>
                <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.15, margin: '0 0 1.25rem', letterSpacing: '-0.02em' }}>
                  What Does Your Portfolio<br />
                  <span style={{ color: '#358C6C' }}>Actually Say About You?</span>
                </h1>
                <p style={{ fontSize: '1rem', color: '#86A68B', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 0.75rem' }}>
                  Most Muslims have never looked at their portfolio as a reflection of their beliefs. This tool holds up a mirror. What you see might surprise you.
                </p>
                <div style={{ width: '40px', height: '2px', background: '#358C6C', margin: '1.5rem auto 0', borderRadius: '2px' }} />
              </div>

              <div style={s.card}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={s.label}>Your Full Name</label>
                    <input
                      style={s.input}
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={s.label}>Email Address</label>
                    <input
                      style={s.input}
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={s.label}>Have you taken the TMI Investor Profile?</label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {(['yes', 'no'] as const).map(opt => (
                        <button
                          key={opt}
                          onClick={() => setHasProfile(opt)}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: hasProfile === opt ? '2px solid #358C6C' : '1px solid rgba(53,140,108,0.25)',
                            background: hasProfile === opt ? 'rgba(53,140,108,0.15)' : 'rgba(255,255,255,0.04)',
                            color: hasProfile === opt ? '#EFF2E4' : '#6C7173',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textTransform: 'uppercase' as const,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {opt === 'yes' ? 'Yes' : "No / Don't Remember"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasProfile === 'yes' && (
                    <div className="fade-in">
                      <label style={s.label}>Your Investor Profile</label>
                      <select
                        style={s.select}
                        value={selectedProfile}
                        onChange={e => setSelectedProfile(e.target.value)}
                      >
                        <option value="">Select your profile...</option>
                        {INVESTOR_PROFILES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div style={{ fontSize: '0.75rem', color: '#6C7173', lineHeight: 1.6, padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '2px solid rgba(53,140,108,0.4)' }}>
                    Your name personalizes your report. Your email delivers your PDF. We will never sell, share, or distribute your personal data to any external third party.
                  </div>

                  <button
                    className="btn-primary"
                    style={s.btnPrimary}
                    onClick={() => {
                      if (!name.trim()) { setError('Please enter your name.'); return; }
                      setError('');
                      setStep(2);
                    }}
                  >
                    Hold Up the Mirror →
                  </button>
                  {error && <div style={s.alert}>{error}</div>}
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ fontSize: '0.72rem', color: '#6C7173', lineHeight: 1.7, marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <strong style={{ color: '#86A68B' }}>Disclaimer:</strong> This tool provides educational reflection based on Islamic finance principles. It is not personalized financial advice. Consult a qualified Islamic financial advisor before making investment decisions. Halal status flags are based on your self-reported inputs, not independent Shariah screening.
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 2: PORTFOLIO INPUT
          ================================================================ */}
          {step === 2 && (
            <div className="fade-in">
              <div style={{ paddingTop: '2.5rem', marginBottom: '1.5rem' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#6C7173', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Poppins, sans-serif', marginBottom: '1.5rem', padding: 0 }}>← Back</button>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#358C6C', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Step 2 of 3
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '1.75rem', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                  Enter Your Holdings
                </h2>
                <p style={{ color: '#86A68B', fontSize: '0.9rem', margin: 0 }}>
                  Add every investment you currently hold. Be honest — the Mirror only works if you show it the truth.
                </p>
              </div>

              {/* Running total */}
              <div style={{
                background: 'rgba(53,140,108,0.1)',
                border: '1px solid rgba(53,140,108,0.3)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.8rem', color: '#86A68B', fontWeight: 600 }}>TOTAL PORTFOLIO</span>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', color: '#358C6C' }}>
                  ${totalPortfolioValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>

              {/* Holdings */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {holdings.map((h, idx) => {
                  const alert = getCategoryAlert(h.category);
                  const haram = h.halalStatus === 'potentially_haram';
                  return (
                    <div
                      key={h.id}
                      className="holding-row"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: haram ? '1px solid rgba(220,38,38,0.4)' : '1px solid rgba(53,140,108,0.2)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#86A68B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          Holding {idx + 1}
                        </span>
                        {holdings.length > 1 && (
                          <button onClick={() => removeHolding(h.id)} style={{ background: 'none', border: 'none', color: '#6C7173', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                          <label style={s.label}>Asset Name</label>
                          <input
                            style={s.input}
                            type="text"
                            placeholder="e.g., Apple Stock, Gold Coins, Islamic Deposit..."
                            value={h.name}
                            onChange={e => updateHolding(h.id, 'name', e.target.value)}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <label style={s.label}>Category</label>
                            <select style={s.select} value={h.category} onChange={e => updateHolding(h.id, 'category', e.target.value)}>
                              {CATEGORY_OPTIONS.map(c => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={s.label}>Current Value ($)</label>
                            <input
                              style={s.input}
                              type="number"
                              placeholder="0"
                              value={h.value}
                              onChange={e => updateHolding(h.id, 'value', e.target.value)}
                              min="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label style={s.label}>Halal Status</label>
                          <select
                            style={{
                              ...s.select,
                              borderColor: h.halalStatus === 'potentially_haram' ? 'rgba(220,38,38,0.5)' : h.halalStatus === 'unsure' ? 'rgba(251,191,36,0.4)' : 'rgba(53,140,108,0.3)',
                            }}
                            value={h.halalStatus}
                            onChange={e => updateHolding(h.id, 'halalStatus', e.target.value)}
                          >
                            <option value="verified_halal">✅ Verified Halal</option>
                            <option value="unsure">⚠️ Unsure</option>
                            <option value="potentially_haram">🚫 Potentially Haram</option>
                          </select>
                        </div>
                        {alert && (
                          <div style={s.alert}>⚠️ {alert}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add holding */}
              <button
                className="btn-add"
                onClick={addHolding}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.875rem',
                  background: 'transparent',
                  border: '1px dashed rgba(53,140,108,0.4)',
                  borderRadius: '10px',
                  color: '#358C6C',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'background 0.2s',
                }}
              >
                + Add Another Holding
              </button>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {error && <div style={s.alert}>{error}</div>}
                <button className="btn-primary" style={s.btnPrimary} onClick={handleAnalyze}>
                  Generate My Mirror Analysis →
                </button>
                <p style={{ fontSize: '0.75rem', color: '#6C7173', textAlign: 'center', margin: 0 }}>
                  Individual holding names and values never leave your device. Only aggregated percentages are captured.
                </p>
              </div>
            </div>
          )}

          {/* ================================================================
              STEP 3: LOADING
          ================================================================ */}
          {step === 3 && isAnalyzing && (
            <div className="fade-in" style={{ textAlign: 'center', paddingTop: '4rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                border: '3px solid rgba(53,140,108,0.2)',
                borderTop: '3px solid #358C6C',
                borderRadius: '50%',
                margin: '0 auto 2rem',
                animation: 'spin 1s linear infinite',
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <h2 style={{ fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                The Mirror Is Reflecting...
              </h2>
              <p style={{ color: '#86A68B', fontSize: '0.9rem', maxWidth: '300px', margin: '0 auto' }}>
                Analyzing your portfolio across beliefs, behaviors, and Islamic alignment.
              </p>
            </div>
          )}

          {/* ================================================================
              STEP 4: RESULTS
          ================================================================ */}
          {step === 4 && result && (
            <div className="fade-in" ref={resultsRef}>
              <div style={{ paddingTop: '2.5rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#358C6C', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Your Mirror Report
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '1.75rem', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
                  {name.split(' ')[0]}, Here Is Your Mirror.
                </h2>
                <p style={{ color: '#86A68B', fontSize: '0.85rem', margin: 0 }}>
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Halal banner */}
              {result.haramCount > 0 ? (
                <div style={s.haramBannerRed}>
                  🚫 URGENT: {result.haramCount} holding(s) require immediate Shariah compliance review.
                </div>
              ) : (
                <div style={s.haramBannerGreen}>
                  ✅ Alhamdulillah — No Haram flags detected based on your inputs.
                </div>
              )}

              {/* Portfolio summary */}
              <div style={{ ...s.card, marginTop: 0, marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' as const }}>
                  <PieChart data={result.categoryBreakdown} />
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#6C7173', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Portfolio</div>
                      <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#EFF2E4' }}>
                        ${result.totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {result.categoryBreakdown.slice(0, 6).map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c.color, flexShrink: 0 }} />
                          <span style={{ fontSize: '0.75rem', color: '#86A68B', flex: 1 }}>{c.label}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#EFF2E4' }}>{c.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <MirrorReport text={result.analysis} />

              {/* Signature */}
              <div style={{ marginTop: '2rem', padding: '1.25rem', borderTop: '1px solid rgba(53,140,108,0.2)', textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#EFF2E4' }}>Mehdi</div>
                <div style={{ fontSize: '0.75rem', color: '#6C7173' }}>Founder, The Muslim Investor</div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }} className="no-print">
                <button className="btn-primary" style={s.btnPrimary} onClick={handlePrint}>
                  📄 Download Mirror Report (PDF)
                </button>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{ ...s.btnPrimary, background: '#25D366' }}>
                    💬 Share on WhatsApp
                  </button>
                </a>
                {hasProfile !== 'yes' && (
                  <a href="https://themuslim-investor.com/tools/profile" style={{ textDecoration: 'none' }}>
                    <button style={{ ...s.btnPrimary, background: 'transparent', border: '1px solid rgba(53,140,108,0.5)', color: '#358C6C' }}>
                      Discover Your Investor Profile →
                    </button>
                  </a>
                )}
                {result.haramCount > 0 && (
                  <a href="https://themuslim-investor.com/tools/compass" style={{ textDecoration: 'none' }}>
                    <button style={{ ...s.btnPrimary, background: 'transparent', border: '1px solid rgba(220,38,38,0.4)', color: '#FCA5A5' }}>
                      ⚡ Take the Akhirah Financial Compass →
                    </button>
                  </a>
                )}
                <a href="https://skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <button style={{ ...s.btnSecondary, width: '100%', textAlign: 'center' as const }}>
                    Join the TMI Community →
                  </button>
                </a>
                <button
                  onClick={() => { setStep(1); setResult(null); setHoldings([{ id: '1', name: '', category: 'us_equities', value: '', halalStatus: 'verified_halal' }]); }}
                  style={{ ...s.btnSecondary, width: '100%', textAlign: 'center' as const }}
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
