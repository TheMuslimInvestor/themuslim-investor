"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ============================================================================
// TMI PORTFOLIO MIRROR v2 — THE CULMINATION TOOL
// Step 4 of the 4-Step Financial Foundation
// ============================================================================

// --- SHARIAH SCREENING DATABASE (Placeholder ~50 tickers) ---
const SHARIAH_DB = {
  metadata: {
    source: "IdealRatings via Bloomberg Terminal",
    standard: "AAOIFI",
    last_updated: "2026-03-01",
    next_update: "2026-06-01",
    disclaimer: "Screening based on most recent available financial data. Status may change with new reporting periods. Always verify with a qualified Shariah advisor for final investment decisions."
  },
  equities: {
    AAPL: { name: "Apple Inc.", status: "COMPLIANT", sector: "Technology" },
    MSFT: { name: "Microsoft Corp.", status: "COMPLIANT", sector: "Technology" },
    GOOGL: { name: "Alphabet Inc.", status: "COMPLIANT", sector: "Technology" },
    AMZN: { name: "Amazon.com Inc.", status: "COMPLIANT", sector: "Consumer Discretionary" },
    NVDA: { name: "NVIDIA Corp.", status: "COMPLIANT", sector: "Technology" },
    META: { name: "Meta Platforms Inc.", status: "QUESTIONABLE", reason: "Revenue mix requires review", sector: "Technology" },
    TSLA: { name: "Tesla Inc.", status: "COMPLIANT", sector: "Consumer Discretionary" },
    JNJ: { name: "Johnson & Johnson", status: "COMPLIANT", sector: "Healthcare" },
    UNH: { name: "UnitedHealth Group", status: "QUESTIONABLE", reason: "Insurance operations require review", sector: "Healthcare" },
    V: { name: "Visa Inc.", status: "QUESTIONABLE", reason: "Financial services revenue mix", sector: "Financials" },
    MA: { name: "Mastercard Inc.", status: "QUESTIONABLE", reason: "Financial services revenue mix", sector: "Financials" },
    JPM: { name: "JPMorgan Chase", status: "NON_COMPLIANT", reason: "Conventional banking — primary business is interest-based lending", sector: "Financials" },
    BAC: { name: "Bank of America", status: "NON_COMPLIANT", reason: "Conventional banking — primary business is interest-based lending", sector: "Financials" },
    WFC: { name: "Wells Fargo", status: "NON_COMPLIANT", reason: "Conventional banking — primary business is interest-based lending", sector: "Financials" },
    C: { name: "Citigroup Inc.", status: "NON_COMPLIANT", reason: "Conventional banking — primary business is interest-based lending", sector: "Financials" },
    GS: { name: "Goldman Sachs", status: "NON_COMPLIANT", reason: "Conventional banking and investment banking", sector: "Financials" },
    MS: { name: "Morgan Stanley", status: "NON_COMPLIANT", reason: "Conventional banking and investment banking", sector: "Financials" },
    AIG: { name: "American International Group", status: "NON_COMPLIANT", reason: "Conventional insurance", sector: "Financials" },
    BRK: { name: "Berkshire Hathaway", status: "NON_COMPLIANT", reason: "Significant insurance and financial operations", sector: "Financials" },
    PFE: { name: "Pfizer Inc.", status: "COMPLIANT", sector: "Healthcare" },
    KO: { name: "Coca-Cola Co.", status: "COMPLIANT", sector: "Consumer Staples" },
    PEP: { name: "PepsiCo Inc.", status: "COMPLIANT", sector: "Consumer Staples" },
    DIS: { name: "Walt Disney Co.", status: "QUESTIONABLE", reason: "Entertainment content requires review", sector: "Communication Services" },
    NFLX: { name: "Netflix Inc.", status: "QUESTIONABLE", reason: "Entertainment content requires review", sector: "Communication Services" },
    NKE: { name: "Nike Inc.", status: "COMPLIANT", sector: "Consumer Discretionary" },
    MCD: { name: "McDonald's Corp.", status: "QUESTIONABLE", reason: "Franchise model with debt ratios near threshold", sector: "Consumer Discretionary" },
    HD: { name: "Home Depot", status: "COMPLIANT", sector: "Consumer Discretionary" },
    CRM: { name: "Salesforce Inc.", status: "COMPLIANT", sector: "Technology" },
    ADBE: { name: "Adobe Inc.", status: "COMPLIANT", sector: "Technology" },
    INTC: { name: "Intel Corp.", status: "COMPLIANT", sector: "Technology" },
    AMD: { name: "Advanced Micro Devices", status: "COMPLIANT", sector: "Technology" },
    BA: { name: "Boeing Co.", status: "QUESTIONABLE", reason: "Defense revenue requires review", sector: "Industrials" },
    LMT: { name: "Lockheed Martin", status: "NON_COMPLIANT", reason: "Primary weapons manufacturer", sector: "Industrials" },
    RTX: { name: "RTX Corporation", status: "NON_COMPLIANT", reason: "Primary weapons/defense manufacturer", sector: "Industrials" },
    PM: { name: "Philip Morris", status: "NON_COMPLIANT", reason: "Tobacco — harmful products", sector: "Consumer Staples" },
    MO: { name: "Altria Group", status: "NON_COMPLIANT", reason: "Tobacco — harmful products", sector: "Consumer Staples" },
    BUD: { name: "Anheuser-Busch InBev", status: "NON_COMPLIANT", reason: "Alcohol production", sector: "Consumer Staples" },
    DEO: { name: "Diageo", status: "NON_COMPLIANT", reason: "Alcohol production", sector: "Consumer Staples" },
    WYNN: { name: "Wynn Resorts", status: "NON_COMPLIANT", reason: "Gambling operations", sector: "Consumer Discretionary" },
    LVS: { name: "Las Vegas Sands", status: "NON_COMPLIANT", reason: "Gambling operations", sector: "Consumer Discretionary" },
    "2222.SR": { name: "Saudi Aramco", status: "COMPLIANT", sector: "Energy" },
    HSBA: { name: "HSBC Holdings", status: "NON_COMPLIANT", reason: "Conventional banking", sector: "Financials" },
    "STC.SR": { name: "Saudi Telecom", status: "COMPLIANT", sector: "Communication Services" },
    EMAAR: { name: "Emaar Properties", status: "COMPLIANT", sector: "Real Estate" },
  },
  etfs: {
    SPUS: { name: "SP Funds S&P 500 Sharia ETF", status: "COMPLIANT", type: "Islamic ETF" },
    HLAL: { name: "Wahed FTSE USA Shariah ETF", status: "COMPLIANT", type: "Islamic ETF" },
    SPRE: { name: "SP Funds S&P Global REIT Sharia ETF", status: "COMPLIANT", type: "Islamic ETF" },
    APTS: { name: "SP Funds Apartment REIT ETF", status: "COMPLIANT", type: "Islamic ETF" },
    SPSK: { name: "SP Funds Dow Jones Global Sukuk ETF", status: "COMPLIANT", type: "Islamic ETF" },
    SPY: { name: "SPDR S&P 500 ETF", status: "NON_COMPLIANT", reason: "Contains non-compliant holdings (banks, alcohol, weapons)", type: "Conventional ETF" },
    QQQ: { name: "Invesco QQQ Trust", status: "NON_COMPLIANT", reason: "Contains non-compliant holdings", type: "Conventional ETF" },
    VOO: { name: "Vanguard S&P 500 ETF", status: "NON_COMPLIANT", reason: "Contains non-compliant holdings", type: "Conventional ETF" },
    VTI: { name: "Vanguard Total Stock Market ETF", status: "NON_COMPLIANT", reason: "Contains non-compliant holdings", type: "Conventional ETF" },
    VT: { name: "Vanguard Total World Stock ETF", status: "NON_COMPLIANT", reason: "Contains non-compliant holdings", type: "Conventional ETF" },
    AGG: { name: "iShares Core US Aggregate Bond ETF", status: "NON_COMPLIANT", reason: "Conventional bonds — Riba", type: "Conventional ETF" },
    BND: { name: "Vanguard Total Bond Market ETF", status: "NON_COMPLIANT", reason: "Conventional bonds — Riba", type: "Conventional ETF" },
    GLD: { name: "SPDR Gold Trust", status: "COMPLIANT", type: "Gold ETF" },
    IAU: { name: "iShares Gold Trust", status: "COMPLIANT", type: "Gold ETF" },
    IBIT: { name: "iShares Bitcoin Trust ETF", status: "QUESTIONABLE", reason: "Bitcoin Shariah status debated among scholars", type: "Crypto ETF" },
  }
};

// --- INVESTOR PROFILES (from spec) ---
const INVESTOR_PROFILES = {
  fortress_builder: { name: "Fortress Builder", expected: { sukuk: 60, equities: 20, gold: 15, cash: 5, crypto: 0, real_estate: 0, alternatives: 0 } },
  foundation_builder: { name: "Foundation Builder", expected: { sukuk: 45, equities: 30, gold: 15, cash: 10, crypto: 0, real_estate: 0, alternatives: 0 } },
  practical_provider: { name: "Practical Provider", expected: { sukuk: 35, equities: 40, gold: 5, cash: 5, crypto: 0, real_estate: 15, alternatives: 0 } },
  steady_steward: { name: "Steady Steward", expected: { sukuk: 25, equities: 45, gold: 10, cash: 5, crypto: 0, real_estate: 10, alternatives: 5 } },
  purposeful_builder: { name: "Purposeful Builder", expected: { sukuk: 20, equities: 50, gold: 0, cash: 5, crypto: 0, real_estate: 15, alternatives: 10 } },
  tactical_trader: { name: "Tactical Trader", expected: { sukuk: 10, equities: 50, gold: 5, cash: 10, crypto: 5, real_estate: 10, alternatives: 10 } },
  growth_seeker: { name: "Growth Seeker", expected: { sukuk: 10, equities: 60, gold: 0, cash: 5, crypto: 5, real_estate: 10, alternatives: 10 } },
};

// --- CATEGORY CONFIG ---
const ASSET_CATEGORIES = [
  { value: "us_equities", label: "US Equities", group: "equities" },
  { value: "international_equities", label: "International Equities", group: "equities" },
  { value: "emerging_markets", label: "Emerging Market Equities", group: "equities" },
  { value: "sukuk", label: "Sukuk / Islamic Fixed Income", group: "sukuk", autoStatus: "COMPLIANT" },
  { value: "conventional_bonds", label: "Conventional Bonds", group: "sukuk", autoStatus: "NON_COMPLIANT", autoReason: "Generates interest (Riba) — non-compliant by definition" },
  { value: "real_estate_investment", label: "Real Estate (Investment Property)", group: "real_estate" },
  { value: "real_estate_home", label: "Real Estate (Primary Home)", group: "real_estate", excludeFromAnalysis: true },
  { value: "gold", label: "Gold / Precious Metals", group: "gold", autoStatus: "COMPLIANT" },
  { value: "commodities", label: "Commodities", group: "alternatives" },
  { value: "crypto", label: "Cryptocurrency / Bitcoin", group: "crypto" },
  { value: "cash_islamic", label: "Cash / Islamic Savings Account", group: "cash", autoStatus: "COMPLIANT" },
  { value: "cash_conventional", label: "Cash / Conventional Savings Account", group: "cash", autoStatus: "NON_COMPLIANT", autoReason: "Generates interest (Riba) — non-compliant by definition" },
  { value: "pension", label: "Pension / Retirement Fund", group: "alternatives" },
  { value: "private_business", label: "Private Business / Equity", group: "alternatives" },
  { value: "etf_islamic", label: "ETF / Islamic Fund", group: "equities", autoStatus: "COMPLIANT" },
  { value: "etf_conventional", label: "ETF / Conventional Fund", group: "equities", autoStatus: "QUESTIONABLE", autoReason: "Conventional fund — requires Shariah screening" },
  { value: "other", label: "Other", group: "alternatives" },
];

const CATEGORY_MAP = {};
ASSET_CATEGORIES.forEach(c => { CATEGORY_MAP[c.value] = c; });

// --- SHARIAH SCREENING FUNCTION ---
function screenHolding(ticker, categoryValue) {
  const cat = CATEGORY_MAP[categoryValue];
  if (cat?.autoStatus) {
    return { status: cat.autoStatus, reason: cat.autoReason || null, source: "category" };
  }
  if (!ticker || ticker.trim() === "") return { status: "NOT_FOUND", reason: null, source: "no_ticker" };
  const normalized = ticker.trim().toUpperCase();
  const db = SHARIAH_DB;
  if (db.equities[normalized]) return { ...db.equities[normalized], source: "database" };
  if (db.etfs[normalized]) return { ...db.etfs[normalized], source: "database" };
  return { status: "NOT_FOUND", reason: "This holding is not in our screening database. We cannot verify its Shariah compliance.", source: "not_found" };
}

// --- ANALYSIS ENGINE (ported from Python) ---
function analyzePortfolio(holdings, profileId, iirsScore) {
  const profile = profileId ? INVESTOR_PROFILES[profileId] : null;
  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  if (totalValue === 0) return { error: "Portfolio value cannot be zero" };

  const grouped = { equities: 0, sukuk: 0, gold: 0, cash: 0, crypto: 0, real_estate: 0, alternatives: 0 };
  const holdingsWithPct = holdings.map(h => {
    const pct = (h.value / totalValue) * 100;
    const cat = CATEGORY_MAP[h.category];
    const grp = cat?.group || "alternatives";
    if (!cat?.excludeFromAnalysis) grouped[grp] = (grouped[grp] || 0) + pct;
    return { ...h, pct, group: grp };
  });

  const investableHoldings = holdingsWithPct.filter(h => !CATEGORY_MAP[h.category]?.excludeFromAnalysis);
  const investableTotal = investableHoldings.reduce((s, h) => s + h.value, 0);

  // Concentration
  const concentration = [];
  for (const h of investableHoldings) {
    const pct = investableTotal > 0 ? (h.value / investableTotal) * 100 : 0;
    if (pct > 90) concentration.push({ severity: "critical", holding: h.name, pct: Math.round(pct * 10) / 10, msg: `Your entire financial future rests on ${h.name} (${pct.toFixed(1)}%). This is not diversification — this is all-in.` });
    else if (pct > 50) concentration.push({ severity: "high", holding: h.name, pct: Math.round(pct * 10) / 10, msg: `Half your wealth depends on ${h.name} (${pct.toFixed(1)}%). This conviction requires a clear thesis.` });
    else if (pct > 30) concentration.push({ severity: "medium", holding: h.name, pct: Math.round(pct * 10) / 10, msg: `${h.name} represents ${pct.toFixed(1)}% of your portfolio — a significant conviction position.` });
  }
  if (investableHoldings.length === 1) concentration.push({ severity: "critical", msg: "Your entire portfolio is one holding. Maximum concentration risk." });
  if (investableHoldings.length > 20) concentration.push({ severity: "low", msg: `You have ${investableHoldings.length} holdings. Beyond 20 positions, you may be creating the illusion of diversification.` });

  // Cash
  const cashPct = grouped.cash || 0;
  let cashAnalysis;
  if (cashPct > 50) cashAnalysis = { level: "EXTREME", pct: cashPct, msg: "Half your wealth sits idle while inflation erodes it.", q: "What are you protecting against?" };
  else if (cashPct > 30) cashAnalysis = { level: "HIGH", pct: cashPct, msg: "Significant cash reserves — waiting or nervous?", q: "How long has your cash been at this level?" };
  else if (cashPct > 10) cashAnalysis = { level: "MODERATE", pct: cashPct, msg: "Healthy reserve. Dry powder.", q: "Do you have criteria for deployment?" };
  else if (cashPct < 5) cashAnalysis = { level: "LOW", pct: cashPct, msg: "Fully invested. No cushion.", q: "If a crisis creates buying opportunities, where do funds come from?" };
  else cashAnalysis = { level: "NORMAL", pct: cashPct, msg: "Cash position within typical ranges.", q: null };

  // Geographic
  const geo = [];
  const usPct = holdingsWithPct.filter(h => h.category === "us_equities").reduce((s, h) => s + h.pct, 0);
  const intlPct = holdingsWithPct.filter(h => h.category === "international_equities").reduce((s, h) => s + h.pct, 0);
  const emPct = holdingsWithPct.filter(h => h.category === "emerging_markets").reduce((s, h) => s + h.pct, 0);
  const totalEq = usPct + intlPct + emPct;
  if (totalEq > 0) {
    if ((usPct / totalEq) * 100 > 90 && totalEq > 20) geo.push({ type: "us_concentration", msg: "Your equity is almost entirely US-based." });
    if (emPct === 0 && totalEq > 20) geo.push({ type: "no_emerging", msg: "No exposure to emerging markets, including Muslim-majority economies." });
  }

  // Risk
  const risk = [];
  const growth = (grouped.equities || 0) + (grouped.crypto || 0);
  const defensive = (grouped.sukuk || 0) + (grouped.gold || 0) + (grouped.cash || 0);
  if (growth > 80) risk.push({ type: "high_growth", msg: "Over 80% in growth assets. You will feel the full force of bear markets." });
  if ((grouped.crypto || 0) > 20) risk.push({ type: "high_crypto", msg: `Crypto is ${grouped.crypto.toFixed(1)}% — the most volatile asset class.` });
  if (defensive === 0 && growth > 50) risk.push({ type: "no_defensive", msg: "No defensive positions. Your entire portfolio moves with market sentiment." });
  if ((grouped.gold || 0) === 0) risk.push({ type: "no_gold", msg: "No gold. No connection to the Sunnah currency and no crisis hedge." });

  // Profile reconciliation
  let reconciliation = null;
  if (profile) {
    const deviations = [];
    let alignedCount = 0;
    const cats = Object.keys(profile.expected);
    for (const cat of cats) {
      const expected = profile.expected[cat];
      const actual = grouped[cat] || 0;
      const dev = actual - expected;
      const absDev = Math.abs(dev);
      let status = "aligned";
      if (absDev <= 15) { alignedCount++; }
      else if (absDev <= 30) { status = "notable_drift"; }
      else { status = "significant_misalignment"; }
      if (absDev > 10) deviations.push({ category: cat, expected, actual: Math.round(actual * 10) / 10, deviation: Math.round(dev * 10) / 10, status, direction: dev > 0 ? "overweight" : "underweight" });
    }
    deviations.sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation));
    const alignPct = (alignedCount / cats.length) * 100;
    reconciliation = {
      overall: alignPct >= 80 ? "well_aligned" : alignPct >= 50 ? "partial_alignment" : "significant_mismatch",
      alignPct: Math.round(alignPct),
      deviations,
      profileName: profile.name,
    };
  }

  // IIRS integration
  let iirsInsight = null;
  if (iirsScore !== null && iirsScore !== undefined) {
    if (iirsScore < 40) iirsInsight = { level: "CRITICAL", msg: "Your financial foundation is in crisis. Focus on the Compass action plan before making ANY portfolio changes." };
    else if (iirsScore < 70) iirsInsight = { level: "BUILDING", msg: "Your foundation needs work. Portfolio optimization should wait until emergency items are resolved." };
    else iirsInsight = { level: "READY", msg: "Your foundation is solid. Portfolio alignment is your appropriate next focus." };
  }

  // Shariah summary
  const compliant = holdingsWithPct.filter(h => h.screening?.status === "COMPLIANT");
  const nonCompliant = holdingsWithPct.filter(h => h.screening?.status === "NON_COMPLIANT");
  const questionable = holdingsWithPct.filter(h => h.screening?.status === "QUESTIONABLE");
  const notFound = holdingsWithPct.filter(h => h.screening?.status === "NOT_FOUND");

  return {
    totalValue, grouped, holdingsWithPct, concentration, cashAnalysis, geo, risk, reconciliation, iirsInsight,
    compliance: { compliant, nonCompliant, questionable, notFound },
    holdingsCount: investableHoldings.length,
  };
}

// --- FALLBACK NARRATIVE ---
function generateFallback(analysis, name) {
  const { reconciliation, cashAnalysis, compliance, concentration, risk, iirsInsight } = analysis;
  let text = `## Bismillah\n\nDear ${name},\n\nYou have taken an important step by holding up the Mirror to your portfolio. This takes courage — the willingness to see your financial reality as it truly is.\n\n`;

  if (compliance.nonCompliant.length > 0) {
    text += `## ⚠️ Shariah Compliance — Urgent Attention Required\n\n`;
    text += `${compliance.nonCompliant.length} of your holdings have been identified as non-Shariah-compliant based on AAOIFI screening standards:\n\n`;
    compliance.nonCompliant.forEach(h => { text += `- **${h.name}** — ${h.screening?.reason || "Non-compliant"}\n`; });
    text += `\nEvery day these holdings remain in your portfolio, you carry the weight of non-compliant income. This is not about optimization — it is about purification.\n\n`;
  } else {
    text += `## ✅ Shariah Compliance\n\nAlhamdulillah — based on our screening, your portfolio appears Shariah-compliant.\n\n`;
  }

  text += `## Your Portfolio at a Glance\n\nTotal Portfolio Value: $${analysis.totalValue.toLocaleString()}\nNumber of Holdings: ${analysis.holdingsCount}\n\n`;

  if (reconciliation) {
    text += `## Profile Alignment\n\nYou identified as a **${reconciliation.profileName}**. `;
    if (reconciliation.overall === "well_aligned") text += `Your portfolio closely matches this profile. Your actions reflect your stated identity.\n\n`;
    else if (reconciliation.overall === "significant_mismatch") {
      text += `However, your portfolio tells a different story. There is a significant gap between who you claim to be and what your holdings reveal.\n\n`;
      if (reconciliation.deviations.length > 0) {
        const d = reconciliation.deviations[0];
        text += `Most notably, you are ${d.direction} in ${d.category} by ${Math.abs(d.deviation)}%.\n\n`;
      }
    } else {
      text += `Your portfolio partially aligns with this profile, but there are notable drifts worth examining.\n\n`;
    }
  }

  if (iirsInsight) {
    text += `## Financial Readiness\n\nYour IIRS indicates: ${iirsInsight.msg}\n\n`;
  }

  if (concentration.length > 0) {
    text += `## Concentration\n\n${concentration[0].msg}\n\n`;
  }

  text += `## Questions for Reflection\n\n`;
  text += `1. If you stood before Allah today and He asked about every holding in your portfolio — would you be confident in your answer?\n`;
  text += `2. Does your portfolio reflect intentional stewardship, or has it grown by default without conscious direction?\n`;
  text += `3. What would need to change for your portfolio to truly align with who you say you are?\n\n`;

  text += `---\n\n*Mehdi — Founder, The Muslim Investor*\n*themuslim-investor.com*`;

  return text;
}

// --- COLORS ---
const C = {
  viridian: "#358C6C",
  onyx: "#343840",
  cambridge: "#86A68B",
  ivory: "#EFF2E4",
  dimGray: "#6C7173",
  red: "#DC2626",
  amber: "#F59E0B",
  white: "#FFFFFF",
  bg: "#F8FAF5",
};

// --- STYLES ---
const font = "'Poppins', sans-serif";

// --- STATUS BADGE ---
function StatusBadge({ status, reason }) {
  const config = {
    COMPLIANT: { bg: "#E8F5EE", color: C.viridian, icon: "✅", label: "Compliant" },
    NON_COMPLIANT: { bg: "#FEE2E2", color: C.red, icon: "🔴", label: "Non-Compliant" },
    QUESTIONABLE: { bg: "#FEF3C7", color: "#92400E", icon: "🟡", label: "Requires Review" },
    NOT_FOUND: { bg: "#F3F4F6", color: C.dimGray, icon: "⚪", label: "Not in database" },
  };
  const c = config[status] || config.NOT_FOUND;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: c.bg, fontSize: 12, fontFamily: font }}>
      <span>{c.icon}</span>
      <span style={{ color: c.color, fontWeight: 600 }}>{c.label}</span>
      {reason && status !== "COMPLIANT" && <span style={{ color: c.color, fontWeight: 400, fontSize: 11 }}>— {reason}</span>}
    </div>
  );
}

// --- PIE CHART (SVG) ---
function PieChart({ data, size = 220 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const colors = [C.viridian, "#5BA88C", C.cambridge, "#A8C5AD", C.dimGray, "#4A6FA5", "#E8A838"];
  let cumulative = 0;
  const slices = data.filter(d => d.value > 0).map((d, i) => {
    const pct = d.value / total;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const largeArc = pct > 0.5 ? 1 : 0;
    const r = size / 2 - 4;
    const cx = size / 2, cy = size / 2;
    const x1 = cx + r * Math.cos(startAngle), y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle), y2 = cy + r * Math.sin(endAngle);
    if (pct >= 0.999) return <circle key={i} cx={cx} cy={cy} r={r} fill={colors[i % colors.length]} />;
    return <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={colors[i % colors.length]} />;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{slices}</svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {data.filter(d => d.value > 0).map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: font }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ color: C.onyx }}>{d.label}: <strong>{((d.value / total) * 100).toFixed(1)}%</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function PortfolioMirror() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileType, setProfileType] = useState("");
  const [iirsScore, setIirsScore] = useState("");
  const [skipIirs, setSkipIirs] = useState(false);
  const [holdings, setHoldings] = useState([{ id: 1, name: "", category: "", value: "" }]);
  const [analysis, setAnalysis] = useState(null);
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const nextId = useRef(2);
  const resultsRef = useRef(null);

  const totalValue = useMemo(() => {
    return holdings.reduce((s, h) => s + (parseFloat(String(h.value).replace(/,/g, "")) || 0), 0);
  }, [holdings]);

  const addHolding = () => {
    setHoldings(prev => [...prev, { id: nextId.current++, name: "", category: "", value: "" }]);
  };

  const removeHolding = (id) => {
    if (holdings.length <= 1) return;
    setHoldings(prev => prev.filter(h => h.id !== id));
  };

  const updateHolding = (id, field, val) => {
    setHoldings(prev => prev.map(h => h.id === id ? { ...h, [field]: val } : h));
  };

  const canProceedStep2 = name.trim() && email.trim() && email.includes("@");
  const canProceedStep3 = profileType || profileType === "";
  const validHoldings = holdings.filter(h => h.name.trim() && h.category && parseFloat(String(h.value).replace(/,/g, "")) > 0);
  const canAnalyze = validHoldings.length >= 1;

  // Run analysis
  const runAnalysis = async () => {
    setLoading(true);
    setLoadingMsg("Screening your holdings against AAOIFI standards...");
    setStep(5);

    // Screen each holding
    const screened = validHoldings.map(h => {
      const val = parseFloat(String(h.value).replace(/,/g, ""));
      const screening = screenHolding(h.name, h.category);
      return { ...h, value: val, screening };
    });

    await new Promise(r => setTimeout(r, 800));
    setLoadingMsg("Analyzing portfolio structure and alignment...");

    const profileId = profileType && profileType !== "none" ? profileType : null;
    const iirs = !skipIirs && iirsScore !== "" ? parseInt(iirsScore) : null;
    const result = analyzePortfolio(screened, profileId, iirs);
    result.holdingsWithPct = screened.map(h => {
      const pct = result.totalValue > 0 ? (h.value / result.totalValue) * 100 : 0;
      const cat = CATEGORY_MAP[h.category];
      return { ...h, pct, group: cat?.group || "alternatives" };
    });
    // Re-run compliance with screening data
    result.compliance = {
      compliant: screened.filter(h => h.screening?.status === "COMPLIANT"),
      nonCompliant: screened.filter(h => h.screening?.status === "NON_COMPLIANT"),
      questionable: screened.filter(h => h.screening?.status === "QUESTIONABLE"),
      notFound: screened.filter(h => h.screening?.status === "NOT_FOUND"),
    };

    setAnalysis(result);

    await new Promise(r => setTimeout(r, 600));
    setLoadingMsg("Generating your personal Mirror Analysis with AI...");

    // Build AI prompt
    const profileObj = profileId ? INVESTOR_PROFILES[profileId] : null;
    const holdingsSummary = screened.map(h => `- ${h.name} (${CATEGORY_MAP[h.category]?.label || h.category}): $${h.value.toLocaleString()} (${((h.value / result.totalValue) * 100).toFixed(1)}%) — Shariah Status: ${h.screening.status}${h.screening.reason ? ` [${h.screening.reason}]` : ""}`).join("\n");
    const allocSummary = Object.entries(result.grouped).filter(([_, v]) => v > 0).map(([k, v]) => `- ${k}: ${v.toFixed(1)}%`).join("\n");
    const compSummary = `Compliant: ${result.compliance.compliant.length} | Non-compliant: ${result.compliance.nonCompliant.length} | Questionable: ${result.compliance.questionable.length} | Unverified: ${result.compliance.notFound.length}`;
    let reconcSummary = "Profile not provided";
    if (result.reconciliation) {
      reconcSummary = `Overall: ${result.reconciliation.overall}\n${result.reconciliation.deviations.slice(0, 5).map(d => `- ${d.category}: ${d.actual}% actual vs ${d.expected}% expected (${d.direction} by ${Math.abs(d.deviation)}%)`).join("\n")}`;
    }
    let iirsSummary = "Not provided";
    if (result.iirsInsight) iirsSummary = `Score: ${iirs}, Level: ${result.iirsInsight.level} — ${result.iirsInsight.msg}`;

    const systemPrompt = `You are the TMI Portfolio Mirror — the culmination tool in The Muslim Investor's 4-Step Financial Foundation. You have access to three layers of data about this Muslim investor:

1. Their INVESTOR PROFILE — who they say they are
2. Their IIRS SCORE — whether their financial foundation is ready
3. Their ACTUAL PORTFOLIO — what they actually hold, including Shariah compliance screening results

Your role is to synthesize ALL THREE into one unified, penetrating, personal reflection. You REFLECT — you show them the truth about the gap between their stated identity and their actual reality.

CRITICAL RULES:
1. NEVER recommend specific funds, ETFs, stocks, or financial products by name
2. NEVER name specific brokerage platforms
3. NEVER provide a rebalancing plan, specific allocation targets, or trading instructions
4. DO flag Haram holdings clearly and urgently — this is the ONE exception
5. For non-compliant holdings, state clearly: "This holding has been identified as non-Shariah-compliant based on AAOIFI screening standards (source: IdealRatings). We strongly recommend divesting and consulting a qualified Shariah advisor."
6. For unverified holdings, state: "We could not verify this holding against our screening database. This does not mean it is haram — it means we haven't screened it. Please verify independently."
7. Use the person's NAME throughout
8. Frame everything through Akhirah preparation, not wealth optimization
9. Reference Quran and Hadith naturally — not as decoration but as genuine guidance
10. The tone is warm, direct, and honest — like a trusted advisor who cares enough to tell uncomfortable truths

STRUCTURE YOUR RESPONSE WITH THESE EXACT SECTIONS:

## Bismillah
Brief personal opening addressing them by name. Acknowledge their courage.

## 1. Your Shariah Compliance Status
List every NON_COMPLIANT holding with reason. List QUESTIONABLE and NOT_FOUND. Be direct about haram.

## 2. Your Portfolio at a Glance
Total value, allocation breakdown, number of holdings.

## 3. What Your Portfolio Says About Your Beliefs
The psychological/spiritual mirror. What patterns reveal about beliefs, fears, assumptions.

## 4. Your Profile Alignment
${profileObj ? `Compare actual to ${profileObj.name} expected allocation. Biggest gaps.` : "Profile was not provided — skip this section."}

## 5. Your Financial Readiness
${result.iirsInsight ? `IIRS Score: ${iirs}. Connect to portfolio decisions.` : "IIRS was not provided — skip this section."}

## 6. The Unified Picture
Tie everything together in 2-3 paragraphs.

## 7. Questions for Reflection
3-5 penetrating, personal questions.

## 8. Your Next Step
Guide to TMI ecosystem based on their situation.

End with a brief du'a and sign off as "Mehdi — Founder, The Muslim Investor"`;

    const userPrompt = `Analyze this Muslim investor's portfolio and provide a comprehensive Mirror Analysis.

NAME: ${name}
INVESTOR PROFILE: ${profileObj ? profileObj.name : "Not provided"}
IIRS SCORE: ${iirsSummary}
TOTAL PORTFOLIO VALUE: $${result.totalValue.toLocaleString()}

HOLDINGS:
${holdingsSummary}

ALLOCATION BY ASSET CLASS:
${allocSummary}

SHARIAH SCREENING SUMMARY:
${compSummary}
${result.compliance.nonCompliant.length > 0 ? `Non-compliant holdings: ${result.compliance.nonCompliant.map(h => h.name).join(", ")}` : ""}

PROFILE RECONCILIATION:
${reconcSummary}

CONCENTRATION ALERTS:
${result.concentration.length > 0 ? result.concentration.map(c => c.msg).join("\n") : "No significant concentration issues"}

CASH ANALYSIS:
${result.cashAnalysis.level}: ${result.cashAnalysis.msg}

RISK EXPOSURE:
${result.risk.length > 0 ? result.risk.map(r => r.msg).join("\n") : "No significant risk flags"}

Remember: This is the CULMINATION tool. Be personal. Be honest. Use their name. Flag haram urgently. Reflect, don't prescribe.`;

    try {
      const response = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userPrompt }),
      });
      const data = await response.json();
      const text = data.narrative || "";
      if (text.length > 100) {
        setNarrative(text);
      } else {
        setNarrative(generateFallback(result, name));
      }
    } catch (e) {
      console.error("AI call failed:", e);
      setNarrative(generateFallback(result, name));
    }

    // Fire webhook via API route (fire-and-forget)
    try {
      fetch("/api/mirror", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name, email,
          profile_type: profileObj?.name || "Not provided",
          iirs_score: iirs,
          total_value: result.totalValue,
          num_holdings: screened.length,
          allocation: result.grouped,
          compliant_pct: screened.length > 0 ? Math.round((result.compliance.compliant.length / screened.length) * 100) : 0,
          non_compliant_count: result.compliance.nonCompliant.length,
          questionable_count: result.compliance.questionable.length,
          alignment: result.reconciliation?.overall || "no_profile",
        }),
      }).catch(() => {});
    } catch (_) {}

    setLoading(false);
    setStep(6);
  };

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }, [step]);

  // --- RENDER HELPERS ---
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 20, fontWeight: 700, color: C.onyx, marginTop: 28, marginBottom: 12, fontFamily: font, borderBottom: `2px solid ${C.viridian}`, paddingBottom: 6 }}>{line.replace("## ", "")}</h2>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: 700, color: C.onyx, margin: "8px 0", fontFamily: font }}>{line.replace(/\*\*/g, "")}</p>;
      if (line.startsWith("- **")) {
        const parts = line.replace("- **", "").split("**");
        return <div key={i} style={{ display: "flex", gap: 4, margin: "4px 0 4px 16px", fontFamily: font, fontSize: 14, lineHeight: 1.7, color: C.onyx }}>
          <span style={{ color: C.viridian, marginRight: 4 }}>•</span>
          <span><strong>{parts[0]}</strong>{parts.slice(1).join("")}</span>
        </div>;
      }
      if (line.startsWith("- ")) return <div key={i} style={{ display: "flex", gap: 4, margin: "4px 0 4px 16px", fontFamily: font, fontSize: 14, lineHeight: 1.7, color: C.onyx }}><span style={{ color: C.viridian, marginRight: 4 }}>•</span><span>{line.replace("- ", "")}</span></div>;
      if (line.match(/^\d+\. /)) return <div key={i} style={{ margin: "4px 0 4px 16px", fontFamily: font, fontSize: 14, lineHeight: 1.7, color: C.onyx }}>{line}</div>;
      if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) return <p key={i} style={{ fontStyle: "italic", color: C.dimGray, margin: "6px 0", fontFamily: font, fontSize: 14, lineHeight: 1.7 }}>{line.replace(/\*/g, "")}</p>;
      if (line.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: `1px solid ${C.cambridge}`, margin: "20px 0" }} />;
      if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
      // Bold within text
      const rendered = line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
        return part;
      });
      return <p key={i} style={{ margin: "6px 0", fontFamily: font, fontSize: 14, lineHeight: 1.8, color: C.onyx }}>{rendered}</p>;
    });
  };

  // Card wrapper
  const Card = ({ children, style = {} }) => (
    <div style={{ background: C.white, borderRadius: 12, padding: "28px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid #E5E7EB`, ...style }}>
      {children}
    </div>
  );

  // Input
  const Input = ({ label, value, onChange, placeholder, type = "text", required, note }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.onyx, marginBottom: 6, fontFamily: font }}>
        {label}{required && <span style={{ color: C.red }}> *</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid #D1D5DB`, fontSize: 14, fontFamily: font, color: C.onyx, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
        onFocus={e => e.target.style.borderColor = C.viridian}
        onBlur={e => e.target.style.borderColor = "#D1D5DB"}
      />
      {note && <p style={{ fontSize: 12, color: C.dimGray, marginTop: 4, fontFamily: font }}>{note}</p>}
    </div>
  );

  // Select
  const Select = ({ label, value, onChange, options, placeholder }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.onyx, marginBottom: 6, fontFamily: font }}>{label}</label>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid #D1D5DB`, fontSize: 14, fontFamily: font, color: value ? C.onyx : C.dimGray, outline: "none", boxSizing: "border-box", background: C.white, cursor: "pointer" }}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  // Button
  const Btn = ({ children, onClick, disabled, variant = "primary", style: s = {} }) => {
    const styles = {
      primary: { bg: C.viridian, color: C.white, border: "none" },
      secondary: { bg: "transparent", color: C.viridian, border: `2px solid ${C.viridian}` },
      danger: { bg: "transparent", color: C.red, border: `1px solid ${C.red}` },
    };
    const v = styles[variant];
    return (
      <button
        onClick={onClick} disabled={disabled}
        style={{ padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: font, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, background: v.bg, color: v.color, border: v.border, transition: "all 0.2s", ...s }}
      >
        {children}
      </button>
    );
  };

  // Progress bar
  const Progress = ({ current }) => {
    const steps = ["Welcome", "Foundation", "Holdings", "Results"];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: font, background: i + 1 <= current ? C.viridian : "#E5E7EB", color: i + 1 <= current ? C.white : C.dimGray, transition: "all 0.3s" }}>
                {i + 1 <= current ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i + 1 <= current ? C.viridian : C.dimGray, marginTop: 4, fontFamily: font, fontWeight: i + 1 === current ? 600 : 400 }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ height: 2, flex: 1, background: i + 1 < current ? C.viridian : "#E5E7EB", transition: "all 0.3s", margin: "0 -8px", marginBottom: 18 }} />}
          </div>
        ))}
      </div>
    );
  };

  // --- STEP 1: WELCOME ---
  const renderStep1 = () => (
    <div>
      <Progress current={1} />
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.onyx, fontFamily: font, lineHeight: 1.3, marginBottom: 12 }}>
          What Does Your Portfolio<br />Actually Say About You?
        </h1>
        <p style={{ fontSize: 15, color: C.dimGray, fontFamily: font, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
          Most Muslims have never held a mirror up to their investments. This tool combines your Investor Profile, your IIRS score, and your actual holdings into one honest picture. What you see might change everything.
        </p>
      </div>
      <Card>
        <Input label="Full Name" value={name} onChange={setName} placeholder="Your full name" required />
        <Input label="Email Address" value={email} onChange={setEmail} placeholder="your@email.com" type="email" required />
        <p style={{ fontSize: 12, color: C.dimGray, fontFamily: font, lineHeight: 1.6, marginTop: 8, padding: "12px 16px", background: C.ivory, borderRadius: 8 }}>
          Your name personalizes your report. Your email delivers your PDF. We will never sell, share, or distribute your personal data to any external third party. Your individual holdings are analyzed in your browser and never stored on our servers.
        </p>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
        <Btn onClick={() => setStep(2)} disabled={!canProceedStep2}>Continue →</Btn>
      </div>
    </div>
  );

  // --- STEP 2: FOUNDATION ---
  const renderStep2 = () => (
    <div>
      <Progress current={2} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 8 }}>Your TMI Foundation</h2>
      <p style={{ fontSize: 14, color: C.dimGray, fontFamily: font, marginBottom: 24 }}>Your results from Steps 1-3 of the Financial Foundation.</p>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 12 }}>Your Investor Profile</h3>
        <Select
          label="Which TMI Investor Profile are you?"
          value={profileType}
          onChange={setProfileType}
          placeholder="Select your profile..."
          options={[
            ...Object.entries(INVESTOR_PROFILES).map(([k, v]) => ({ value: k, label: v.name })),
            { value: "none", label: "I haven't taken the Investor Profile yet" },
          ]}
        />
        {profileType === "none" && (
          <div style={{ padding: 16, background: C.ivory, borderRadius: 8, borderLeft: `3px solid ${C.viridian}` }}>
            <p style={{ fontSize: 13, color: C.onyx, fontFamily: font, lineHeight: 1.6, marginBottom: 10 }}>
              The Portfolio Mirror is most powerful when combined with your Investor Profile. We recommend taking it first — it takes 10 minutes.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://themuslim-investor.com/tools/profile" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.viridian, fontWeight: 600, fontFamily: font, textDecoration: "none" }}>
                Take the Investor Profile →
              </a>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 12 }}>Your IIRS Score</h3>
        {!skipIirs && (
          <Input
            label="What is your Islamic Investment Readiness Score (IIRS)?"
            value={iirsScore}
            onChange={setIirsScore}
            placeholder="0-100"
            type="number"
            note="Don't know your IIRS? Take the Akhirah Financial Compass → themuslim-investor.com/tools/compass"
          />
        )}
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: font, fontSize: 13, color: C.dimGray }}>
          <input type="checkbox" checked={skipIirs} onChange={e => setSkipIirs(e.target.checked)} style={{ accentColor: C.viridian }} />
          I haven't taken the Compass yet
        </label>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
        <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
        <Btn onClick={() => setStep(3)}>Continue →</Btn>
      </div>
    </div>
  );

  // --- STEP 3: HOLDINGS ---
  const renderStep3 = () => (
    <div>
      <Progress current={3} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 8 }}>Your Holdings</h2>
      <p style={{ fontSize: 14, color: C.dimGray, fontFamily: font, marginBottom: 24, lineHeight: 1.6 }}>
        Enter every financial position you hold — stocks, ETFs, funds, Sukuk, savings accounts, property, gold, crypto, pension, everything. The more complete your picture, the more accurate your Mirror.
      </p>

      {/* Running total */}
      <Card style={{ marginBottom: 20, background: C.ivory, border: `1px solid ${C.cambridge}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.onyx, fontFamily: font }}>Total Portfolio Value</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: C.viridian, fontFamily: font }}>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ fontSize: 12, color: C.dimGray, fontFamily: font, marginTop: 4 }}>{validHoldings.length} holding{validHoldings.length !== 1 ? "s" : ""} entered</div>
      </Card>

      {/* Live pie chart */}
      {totalValue > 0 && (() => {
        const groups = {};
        validHoldings.forEach(h => {
          const cat = CATEGORY_MAP[h.category];
          const grp = cat?.group || "other";
          const label = grp.charAt(0).toUpperCase() + grp.slice(1).replace("_", " ");
          groups[label] = (groups[label] || 0) + parseFloat(String(h.value).replace(/,/g, ""));
        });
        const data = Object.entries(groups).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
        return <Card style={{ marginBottom: 20, textAlign: "center" }}><PieChart data={data} /></Card>;
      })()}

      {/* Holdings list */}
      {holdings.map((h, idx) => {
        const screening = h.name && h.category ? screenHolding(h.name, h.category) : null;
        const isHaram = h.category === "conventional_bonds" || h.category === "cash_conventional";
        return (
          <Card key={h.id} style={{ marginBottom: 12, border: isHaram ? `1px solid ${C.red}` : `1px solid #E5E7EB` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.dimGray, fontFamily: font }}>Holding #{idx + 1}</span>
              {holdings.length > 1 && (
                <button onClick={() => removeHolding(h.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: font }}>Holding Name / Ticker</label>
                <input
                  value={h.name} onChange={e => updateHolding(h.id, "name", e.target.value)}
                  placeholder="e.g., AAPL, SPUS, Gold"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid #D1D5DB`, fontSize: 13, fontFamily: font, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: font }}>Current Value ($)</label>
                <input
                  type="number" value={h.value} onChange={e => updateHolding(h.id, "value", e.target.value)}
                  placeholder="0"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid #D1D5DB`, fontSize: 13, fontFamily: font, boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: font }}>Asset Class</label>
              <select
                value={h.category} onChange={e => updateHolding(h.id, "category", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid #D1D5DB`, fontSize: 13, fontFamily: font, boxSizing: "border-box", background: C.white }}
              >
                <option value="">Select asset class...</option>
                {ASSET_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            {isHaram && (
              <div style={{ marginTop: 8, padding: "8px 12px", background: "#FEE2E2", borderRadius: 6, fontSize: 12, color: C.red, fontFamily: font, fontWeight: 600 }}>
                ⚠️ This category generates interest (Riba) and is automatically flagged as non-compliant.
              </div>
            )}
            {screening && h.name && h.category && (
              <div style={{ marginTop: 8 }}>
                <StatusBadge status={screening.status} reason={screening.reason} />
              </div>
            )}
          </Card>
        );
      })}

      <button onClick={addHolding} style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px dashed ${C.cambridge}`, background: "transparent", cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 600, color: C.viridian, transition: "all 0.2s", marginBottom: 24 }}>
        + Add Holding
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
        <Btn onClick={runAnalysis} disabled={!canAnalyze}>Reveal My Mirror →</Btn>
      </div>
    </div>
  );

  // --- STEP 5: LOADING ---
  const renderLoading = () => (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ width: 56, height: 56, border: `4px solid ${C.ivory}`, borderTop: `4px solid ${C.viridian}`, borderRadius: "50%", animation: "tmi-spin 1s linear infinite", margin: "0 auto 24px" }} />
      <style>{`@keyframes tmi-spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 8 }}>Preparing Your Mirror</h2>
      <p style={{ fontSize: 14, color: C.dimGray, fontFamily: font }}>{loadingMsg}</p>
    </div>
  );

  // --- STEP 6: RESULTS ---
  const renderResults = () => {
    if (!analysis) return null;
    const { compliance, totalValue: tv, grouped, reconciliation: rec, concentration: conc, cashAnalysis, risk: rsk, iirsInsight, holdingsWithPct } = analysis;
    const nonCompCount = compliance.nonCompliant.length;
    const questCount = compliance.questionable.length;
    const notFoundCount = compliance.notFound.length;
    const allClean = nonCompCount === 0 && questCount === 0;

    // Pie data
    const pieData = Object.entries(grouped).filter(([_, v]) => v > 0).map(([k, v]) => ({
      label: k.charAt(0).toUpperCase() + k.slice(1).replace("_", " "),
      value: v,
    })).sort((a, b) => b.value - a.value);

    return (
      <div ref={resultsRef}>
        {/* Compliance Banner */}
        {nonCompCount > 0 ? (
          <div style={{ background: "#FEE2E2", border: `1px solid ${C.red}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>⚠️</span>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: C.red, fontFamily: font, margin: 0 }}>URGENT: {nonCompCount} Holding{nonCompCount > 1 ? "s" : ""} Require Immediate Shariah Review</h2>
            </div>
            {compliance.nonCompliant.map((h, i) => (
              <div key={i} style={{ fontSize: 13, color: C.red, fontFamily: font, marginLeft: 34 }}>
                • <strong>{h.name}</strong> — {h.screening?.reason || "Non-compliant"}
              </div>
            ))}
          </div>
        ) : questCount > 0 || notFoundCount > 0 ? (
          <div style={{ background: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>🟡</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#92400E", fontFamily: font, margin: 0 }}>{questCount + notFoundCount} Holding{questCount + notFoundCount > 1 ? "s" : ""} Need Verification</h2>
            </div>
          </div>
        ) : (
          <div style={{ background: "#E8F5EE", border: `1px solid ${C.viridian}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>✅</span>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.viridian, fontFamily: font, margin: 0 }}>Alhamdulillah — Your Portfolio Passes Shariah Screening</h2>
            </div>
          </div>
        )}

        {/* Portfolio Summary */}
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 16 }}>Portfolio Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: "center", padding: 16, background: C.ivory, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.dimGray, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>Total Value</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.viridian, fontFamily: font }}>${tv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
            <div style={{ textAlign: "center", padding: 16, background: C.ivory, borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.dimGray, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>Holdings</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.onyx, fontFamily: font }}>{analysis.holdingsCount}</div>
            </div>
            <div style={{ textAlign: "center", padding: 16, background: nonCompCount > 0 ? "#FEE2E2" : "#E8F5EE", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: C.dimGray, fontFamily: font, textTransform: "uppercase", letterSpacing: 1 }}>Compliant</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: nonCompCount > 0 ? C.red : C.viridian, fontFamily: font }}>
                {compliance.compliant.length}/{compliance.compliant.length + nonCompCount + questCount + notFoundCount}
              </div>
            </div>
          </div>
          <PieChart data={pieData} />
        </Card>

        {/* Screening Table */}
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 16 }}>Screening Results</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: font, fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.onyx}` }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Holding</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Category</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Value</th>
                  <th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>%</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Shariah Status</th>
                </tr>
              </thead>
              <tbody>
                {(analysis.holdingsWithPct || []).map((h, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #E5E7EB" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: C.onyx }}>{h.name}</td>
                    <td style={{ padding: "8px 12px", color: C.dimGray }}>{CATEGORY_MAP[h.category]?.label || h.category}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: C.onyx }}>${h.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", color: C.onyx }}>{h.pct?.toFixed(1) || ((h.value / tv) * 100).toFixed(1)}%</td>
                    <td style={{ padding: "8px 12px" }}><StatusBadge status={h.screening?.status} reason={h.screening?.reason} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Mirror Analysis */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.viridian, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>🪞</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: C.onyx, fontFamily: font, margin: 0 }}>Your Mirror Analysis</h3>
          </div>
          <div>{renderMarkdown(narrative)}</div>
        </Card>

        {/* Action buttons */}
        <Card style={{ background: C.ivory, border: `1px solid ${C.cambridge}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.onyx, fontFamily: font, marginBottom: 16 }}>Your Next Steps</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Btn onClick={() => {
              // Print-based PDF
              const printWindow = window.open("", "_blank");
              if (printWindow) {
                printWindow.document.write(`<!DOCTYPE html><html><head><title>TMI Portfolio Mirror Report — ${name}</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet">
                <style>body{font-family:'Poppins',sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#343840}h1{color:#358C6C;font-size:24px}h2{color:#343840;font-size:18px;border-bottom:2px solid #358C6C;padding-bottom:6px}h3{color:#343840;font-size:16px}p{line-height:1.8;font-size:14px}.header{text-align:center;margin-bottom:32px;border-bottom:3px solid #358C6C;padding-bottom:20px}.badge{display:inline-block;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:600}.compliant{background:#E8F5EE;color:#358C6C}.non-compliant{background:#FEE2E2;color:#DC2626}table{width:100%;border-collapse:collapse;font-size:13px;margin:16px 0}th,td{padding:8px;text-align:left;border-bottom:1px solid #E5E7EB}th{font-weight:700;border-bottom:2px solid #343840}@media print{body{padding:20px}}</style>
                </head><body>
                <div class="header"><h1>TMI Portfolio Mirror Report</h1><p>Prepared for <strong>${name}</strong> — ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p></div>
                <h2>Shariah Compliance Summary</h2>
                <p>Compliant: ${compliance.compliant.length} | Non-compliant: ${nonCompCount} | Questionable: ${questCount} | Unverified: ${notFoundCount}</p>
                ${nonCompCount > 0 ? `<div style="background:#FEE2E2;padding:12px;border-radius:8px;margin:12px 0"><strong style="color:#DC2626">Non-compliant holdings:</strong> ${compliance.nonCompliant.map(h => `${h.name} (${h.screening?.reason || ""})`).join(", ")}</div>` : ""}
                <h2>Portfolio Summary</h2>
                <p>Total Value: <strong>$${tv.toLocaleString()}</strong> | Holdings: <strong>${analysis.holdingsCount}</strong></p>
                <table><thead><tr><th>Holding</th><th>Category</th><th>Value</th><th>%</th><th>Status</th></tr></thead><tbody>
                ${(analysis.holdingsWithPct || []).map(h => `<tr><td>${h.name}</td><td>${CATEGORY_MAP[h.category]?.label || ""}</td><td>$${h.value.toLocaleString()}</td><td>${((h.value / tv) * 100).toFixed(1)}%</td><td><span class="badge ${h.screening?.status === "COMPLIANT" ? "compliant" : "non-compliant"}">${h.screening?.status || ""}</span></td></tr>`).join("")}
                </tbody></table>
                <h2>Mirror Analysis</h2>
                ${narrative.split("\n").map(line => {
                  if (line.startsWith("## ")) return `<h2>${line.replace("## ", "")}</h2>`;
                  if (line.startsWith("- ")) return `<p style="margin-left:16px">• ${line.replace("- ", "")}</p>`;
                  if (line.trim() === "") return "<br/>";
                  return `<p>${line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</p>`;
                }).join("")}
                <hr style="margin-top:40px;border:none;border-top:2px solid #358C6C"/>
                <p style="text-align:center;font-size:12px;color:#6C7173">
                <strong>Disclaimer:</strong> This tool provides educational analysis based on Islamic finance principles. It is not personalized financial advice. Shariah screening sourced from IdealRatings (AAOIFI standards). Always verify with a qualified Shariah advisor.<br/><br/>
                themuslim-investor.com/tools/mirror
                </p>
                </body></html>`);
                printWindow.document.close();
                setTimeout(() => printWindow.print(), 500);
              }
            }}>
              Download Report (PDF)
            </Btn>

            <Btn variant="secondary" onClick={() => {
              const text = encodeURIComponent("I just held up a mirror to my portfolio with The Muslim Investor. What does YOUR portfolio say about you? themuslim-investor.com/tools/mirror");
              window.open(`https://wa.me/?text=${text}`, "_blank");
            }}>
              Share on WhatsApp
            </Btn>

            {(!profileType || profileType === "none") && (
              <Btn variant="secondary" onClick={() => window.open("https://themuslim-investor.com/tools/profile", "_blank")}>
                Take the Investor Profile →
              </Btn>
            )}

            {skipIirs && (
              <Btn variant="secondary" onClick={() => window.open("https://themuslim-investor.com/tools/compass", "_blank")}>
                Take the Akhirah Compass →
              </Btn>
            )}

            <Btn variant="secondary" onClick={() => window.open("https://skool.com/the-muslim-investor", "_blank")}>
              Join TMI Community →
            </Btn>
          </div>
        </Card>

        {/* Disclaimers */}
        <div style={{ marginTop: 24, padding: 20, background: "#F9FAFB", borderRadius: 8, fontSize: 11, color: C.dimGray, fontFamily: font, lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> This tool provides educational analysis based on Islamic finance principles. It is not personalized financial advice. The Shariah screening database is sourced from IdealRatings (AAOIFI standards) and updated quarterly. Screening status may change with new financial reporting periods. Always verify compliance with a qualified Shariah advisor before making investment decisions.
          <br /><br />
          <strong>Privacy:</strong> We collect your name, email, and aggregated portfolio allocation (percentages only — not individual holding names or values) to personalize your experience and deliver your report. Your individual holdings are processed in your browser and are never stored on our servers. We will never sell, share, or distribute your personal data to any external third party.
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Amiri&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: C.onyx, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: C.viridian, fontFamily: font }}>T<span style={{ color: C.white }}>M</span>I</span>
          <span style={{ fontSize: 13, color: C.dimGray, fontFamily: font }}>Portfolio Mirror</span>
        </div>
        <span style={{ fontSize: 11, color: C.dimGray, fontFamily: font }}>Step 4 of 4 — Financial Foundation</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 5 && renderLoading()}
        {step === 6 && renderResults()}
      </div>

      {/* Footer */}
      <div style={{ background: C.onyx, padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
        <p style={{ fontSize: 12, color: C.dimGray, fontFamily: font, margin: 0 }}>
          The Muslim Investor — Preparing Your Answer for the Day of Judgment
        </p>
        <p style={{ fontSize: 11, color: "#4B5563", fontFamily: font, marginTop: 4 }}>
          Shariah Screening: IdealRatings · AAOIFI Standards · Bloomberg Terminal
        </p>
      </div>
    </div>
  );
}
