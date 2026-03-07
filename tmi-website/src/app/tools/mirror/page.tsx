"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

// ============================================================================
// TMI PORTFOLIO MIRROR v3 — THE CULMINATION TOOL
// Step 4 of the 4-Step Financial Foundation
// Strict TypeScript — all 9 fixes applied
// ============================================================================

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type ShariahStatus = "COMPLIANT" | "NON_COMPLIANT" | "QUESTIONABLE" | "NOT_FOUND";

interface ShariahEquityEntry { name: string; status: ShariahStatus; sector: string; reason?: string; }
interface ShariahEtfEntry { name: string; status: ShariahStatus; type: string; reason?: string; }

interface ShariahDb {
  metadata: { source: string; standard: string; last_updated: string; next_update: string; disclaimer: string };
  equities: Record<string, ShariahEquityEntry>;
  etfs: Record<string, ShariahEtfEntry>;
}

interface ScreeningResult { status: ShariahStatus; reason: string | null; source: string; name?: string; sector?: string; type?: string; }

interface AssetCategory {
  value: string; label: string; group: string;
  autoStatus?: ShariahStatus; autoReason?: string; excludeFromAnalysis?: boolean;
}

interface ProfileAllocation {
  sukuk: number; equities: number; gold: number; cash: number;
  crypto: number; real_estate: number; alternatives: number;
  [key: string]: number;
}

interface InvestorProfile { name: string; expected: ProfileAllocation; }

// Fix 5: Added mortgage and financeType for real estate
interface HoldingInput {
  id: number; name: string; category: string; value: string;
  mortgage?: string; financeType?: string;
}

interface ScreenedHolding { id: number; name: string; category: string; value: number; screening: ScreeningResult; displayName?: string; }
interface HoldingWithPct extends ScreenedHolding { pct: number; group: string; }

interface ConcentrationInsight { severity: string; holding?: string; pct?: number; msg: string; }
interface CashAnalysis { level: string; pct: number; msg: string; q: string | null; }
interface GeoInsight { type: string; msg: string; }
interface RiskInsight { type: string; msg: string; }
interface Deviation { category: string; expected: number; actual: number; deviation: number; status: string; direction: string; }
interface Reconciliation { overall: string; alignPct: number; deviations: Deviation[]; profileName: string; }
interface IirsInsight { level: string; msg: string; }
interface ComplianceSummary { compliant: ScreenedHolding[]; nonCompliant: ScreenedHolding[]; questionable: ScreenedHolding[]; notFound: ScreenedHolding[]; }

interface AnalysisResult {
  totalValue: number; grouped: Record<string, number>; holdingsWithPct: HoldingWithPct[];
  concentration: ConcentrationInsight[]; cashAnalysis: CashAnalysis; geo: GeoInsight[];
  risk: RiskInsight[]; reconciliation: Reconciliation | null; iirsInsight: IirsInsight | null;
  compliance: ComplianceSummary; holdingsCount: number; error?: string;
}

interface PieDataPoint { label: string; value: number; }
interface SelectOption { value: string; label: string; }
interface StatusBadgeConfig { bg: string; color: string; icon: string; label: string; }

// Fix 3: Compliance verdict type
interface ComplianceVerdict { level: "clean" | "non_compliant" | "questionable" | "unverified"; bannerBg: string; bannerBorder: string; bannerColor: string; icon: string; title: string; description: string; }


// ============================================================================
// SHARIAH SCREENING DATABASE
// ============================================================================

const SHARIAH_DB: ShariahDb = {
  metadata: { source: "IdealRatings via Bloomberg Terminal", standard: "AAOIFI", last_updated: "2026-03-01", next_update: "2026-06-01", disclaimer: "Screening based on most recent available financial data. Status may change with new reporting periods. Always verify with a qualified Shariah advisor for final investment decisions." },
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
    JPM: { name: "JPMorgan Chase", status: "NON_COMPLIANT", reason: "Conventional banking \u2014 primary business is interest-based lending", sector: "Financials" },
    BAC: { name: "Bank of America", status: "NON_COMPLIANT", reason: "Conventional banking \u2014 primary business is interest-based lending", sector: "Financials" },
    WFC: { name: "Wells Fargo", status: "NON_COMPLIANT", reason: "Conventional banking \u2014 primary business is interest-based lending", sector: "Financials" },
    C: { name: "Citigroup Inc.", status: "NON_COMPLIANT", reason: "Conventional banking \u2014 primary business is interest-based lending", sector: "Financials" },
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
    PM: { name: "Philip Morris", status: "NON_COMPLIANT", reason: "Tobacco \u2014 harmful products", sector: "Consumer Staples" },
    MO: { name: "Altria Group", status: "NON_COMPLIANT", reason: "Tobacco \u2014 harmful products", sector: "Consumer Staples" },
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
    AGG: { name: "iShares Core US Aggregate Bond ETF", status: "NON_COMPLIANT", reason: "Conventional bonds \u2014 Riba", type: "Conventional ETF" },
    BND: { name: "Vanguard Total Bond Market ETF", status: "NON_COMPLIANT", reason: "Conventional bonds \u2014 Riba", type: "Conventional ETF" },
    GLD: { name: "SPDR Gold Trust", status: "COMPLIANT", type: "Gold ETF" },
    IAU: { name: "iShares Gold Trust", status: "COMPLIANT", type: "Gold ETF" },
    IBIT: { name: "iShares Bitcoin Trust ETF", status: "QUESTIONABLE", reason: "Bitcoin Shariah status debated among scholars", type: "Crypto ETF" },
  },
};

// ============================================================================
// FIX 2: INVESTOR PROFILES — Aligned with profile-data.ts
// ============================================================================

const INVESTOR_PROFILES: Record<string, InvestorProfile> = {
  fortress_builder: { name: "Fortress Builder", expected: { sukuk: 40, equities: 15, gold: 15, cash: 30, crypto: 0, real_estate: 0, alternatives: 0 } },
  foundation_builder: { name: "Foundation Builder", expected: { sukuk: 30, equities: 20, gold: 10, cash: 40, crypto: 0, real_estate: 0, alternatives: 0 } },
  practical_provider: { name: "Practical Provider", expected: { sukuk: 30, equities: 40, gold: 0, cash: 15, crypto: 0, real_estate: 15, alternatives: 0 } },
  purposeful_builder: { name: "Purposeful Builder", expected: { sukuk: 25, equities: 50, gold: 0, cash: 10, crypto: 0, real_estate: 15, alternatives: 0 } },
  steady_steward: { name: "Steady Steward", expected: { sukuk: 25, equities: 55, gold: 10, cash: 0, crypto: 0, real_estate: 10, alternatives: 0 } },
  tactical_trader: { name: "Tactical Trader", expected: { sukuk: 0, equities: 80, gold: 10, cash: 10, crypto: 0, real_estate: 0, alternatives: 0 } },
  growth_seeker: { name: "Growth Seeker", expected: { sukuk: 0, equities: 85, gold: 10, cash: 5, crypto: 0, real_estate: 0, alternatives: 0 } },
};

// ============================================================================
// FIX 4: ASSET CATEGORIES — etf_conventional is NON_COMPLIANT
// ============================================================================

const ASSET_CATEGORIES: AssetCategory[] = [
  { value: "us_equities", label: "US Equities", group: "equities" },
  { value: "international_equities", label: "International Equities", group: "equities" },
  { value: "emerging_markets", label: "Emerging Market Equities", group: "equities" },
  { value: "sukuk", label: "Sukuk / Islamic Fixed Income", group: "sukuk", autoStatus: "COMPLIANT" },
  { value: "conventional_bonds", label: "Conventional Bonds", group: "sukuk", autoStatus: "NON_COMPLIANT", autoReason: "Generates interest (Riba) \u2014 non-compliant by definition" },
  { value: "real_estate_investment", label: "Real Estate (Investment Property)", group: "real_estate" },
  { value: "real_estate_home", label: "Real Estate (Primary Home)", group: "real_estate", excludeFromAnalysis: true },
  { value: "gold", label: "Gold / Precious Metals", group: "gold", autoStatus: "COMPLIANT" },
  { value: "commodities", label: "Commodities", group: "alternatives" },
  { value: "crypto", label: "Cryptocurrency / Bitcoin", group: "crypto" },
  { value: "cash_islamic", label: "Cash / Islamic Savings Account", group: "cash", autoStatus: "COMPLIANT" },
  { value: "cash_conventional", label: "Cash / Conventional Savings Account", group: "cash", autoStatus: "NON_COMPLIANT", autoReason: "Generates interest (Riba) \u2014 non-compliant by definition" },
  { value: "pension", label: "Pension / Retirement Fund", group: "alternatives" },
  { value: "private_business", label: "Private Business / Equity", group: "alternatives" },
  { value: "etf_islamic", label: "ETF / Islamic Fund", group: "equities", autoStatus: "COMPLIANT" },
  { value: "etf_conventional", label: "ETF / Conventional Fund", group: "equities", autoStatus: "NON_COMPLIANT", autoReason: "Conventional funds contain non-Shariah-compliant holdings (banks, alcohol, weapons, gambling) \u2014 non-compliant by definition" },
  { value: "other", label: "Other", group: "alternatives" },
];

const CATEGORY_MAP: Record<string, AssetCategory> = {};
ASSET_CATEGORIES.forEach((c: AssetCategory) => { CATEGORY_MAP[c.value] = c; });


// ============================================================================
// SHARIAH SCREENING (Fix 5: handles real estate finance type)
// ============================================================================

function screenHolding(ticker: string, categoryValue: string, financeType?: string): ScreeningResult {
  // Fix 5: Real estate investment property screening by finance type
  if (categoryValue === "real_estate_investment") {
    if (financeType === "conventional") {
      return { status: "NON_COMPLIANT", reason: "Investment property financed with conventional mortgage (Riba). Seeking additional investment income through interest-based debt is a deliberate choice that requires urgent attention.", source: "category" };
    }
    if (financeType === "islamic" || financeType === "outright") {
      return { status: "COMPLIANT", reason: null, source: "category" };
    }
    return { status: "NOT_FOUND", reason: "Please specify how this property is financed", source: "category" };
  }

  const cat: AssetCategory | undefined = CATEGORY_MAP[categoryValue];
  if (cat?.autoStatus) {
    return { status: cat.autoStatus, reason: cat.autoReason || null, source: "category" };
  }
  if (!ticker || ticker.trim() === "") {
    return { status: "NOT_FOUND", reason: null, source: "no_ticker" };
  }
  const normalized: string = ticker.trim().toUpperCase();
  const eqEntry: ShariahEquityEntry | undefined = SHARIAH_DB.equities[normalized];
  if (eqEntry) return { status: eqEntry.status, reason: eqEntry.reason || null, source: "database", name: eqEntry.name, sector: eqEntry.sector };
  const etfEntry: ShariahEtfEntry | undefined = SHARIAH_DB.etfs[normalized];
  if (etfEntry) return { status: etfEntry.status, reason: etfEntry.reason || null, source: "database", name: etfEntry.name, type: etfEntry.type };
  return { status: "NOT_FOUND", reason: "This holding is not in our screening database. We cannot verify its Shariah compliance.", source: "not_found" };
}

// ============================================================================
// FIX 3: COMPLIANCE VERDICT — Conservative hierarchy
// ============================================================================

function getComplianceVerdict(compliance: ComplianceSummary): ComplianceVerdict {
  const nc: number = compliance.nonCompliant.length;
  const q: number = compliance.questionable.length;
  const nf: number = compliance.notFound.length;

  if (nc > 0) return {
    level: "non_compliant", bannerBg: "#FEE2E2", bannerBorder: "#DC2626", bannerColor: "#DC2626",
    icon: "\u26a0\ufe0f",
    title: `URGENT: Your portfolio contains ${nc} non-Shariah-compliant holding${nc > 1 ? "s" : ""} that require${nc === 1 ? "s" : ""} immediate action.`,
    description: "Your portfolio contains holdings that have been identified as non-Shariah-compliant based on AAOIFI screening standards. Every day these holdings remain, you carry the weight of non-compliant income. This is not about optimization \u2014 it is about purification.",
  };

  if (q > 0) return {
    level: "questionable", bannerBg: "#FEF3C7", bannerBorder: "#F59E0B", bannerColor: "#92400E",
    icon: "\u26a0\ufe0f",
    title: `Your portfolio contains ${q} holding${q > 1 ? "s" : ""} whose Shariah compliance could not be fully verified. These require your attention and further investigation before your portfolio can be considered clean.`,
    description: `We were unable to fully verify the Shariah compliance of ${q} holding${q > 1 ? "s" : ""} in your portfolio. Until these are verified, we cannot confirm your portfolio is fully Shariah-compliant. This is not a minor footnote \u2014 the status of your wealth on the Day of Judgment depends on certainty, not assumptions.`,
  };

  if (nf > 0) return {
    level: "unverified", bannerBg: "#F3F4F6", bannerBorder: "#9CA3AF", bannerColor: "#4B5563",
    icon: "\u2753",
    title: `Your portfolio contains ${nf} holding${nf > 1 ? "s" : ""} that are not in our screening database. We cannot confirm full Shariah compliance until these are independently verified.`,
    description: `We could not screen ${nf} of your holdings against our database. This does not mean they are haram \u2014 it means we have not verified them. Please verify these holdings independently with a qualified Shariah advisor.`,
  };

  return {
    level: "clean", bannerBg: "#E8F5EE", bannerBorder: "#358C6C", bannerColor: "#358C6C",
    icon: "\u2705",
    title: "Alhamdulillah \u2014 all holdings in your portfolio have passed Shariah screening based on AAOIFI standards.",
    description: "Alhamdulillah \u2014 based on our screening against AAOIFI standards (source: IdealRatings), all holdings in your portfolio appear Shariah-compliant.",
  };
}


// ============================================================================
// ANALYSIS ENGINE (Fix 5: uses net equity for real estate)
// ============================================================================

function analyzePortfolio(holdings: ScreenedHolding[], profileId: string | null, iirsScore: number | null): AnalysisResult {
  const profile: InvestorProfile | null = profileId ? INVESTOR_PROFILES[profileId] || null : null;
  const totalValue: number = holdings.reduce((s: number, h: ScreenedHolding) => s + h.value, 0);
  if (totalValue === 0) {
    return { error: "Portfolio value cannot be zero", totalValue: 0, grouped: {}, holdingsWithPct: [], concentration: [], cashAnalysis: { level: "NORMAL", pct: 0, msg: "", q: null }, geo: [], risk: [], reconciliation: null, iirsInsight: null, compliance: { compliant: [], nonCompliant: [], questionable: [], notFound: [] }, holdingsCount: 0 };
  }

  const grouped: Record<string, number> = { equities: 0, sukuk: 0, gold: 0, cash: 0, crypto: 0, real_estate: 0, alternatives: 0 };
  const holdingsWithPct: HoldingWithPct[] = holdings.map((h: ScreenedHolding): HoldingWithPct => {
    const pct: number = (h.value / totalValue) * 100;
    const cat: AssetCategory | undefined = CATEGORY_MAP[h.category];
    const grp: string = cat?.group || "alternatives";
    if (!cat?.excludeFromAnalysis) grouped[grp] = (grouped[grp] || 0) + pct;
    return { ...h, pct, group: grp };
  });

  const investableHoldings: HoldingWithPct[] = holdingsWithPct.filter((h: HoldingWithPct) => !CATEGORY_MAP[h.category]?.excludeFromAnalysis);
  const investableTotal: number = investableHoldings.reduce((s: number, h: HoldingWithPct) => s + h.value, 0);

  const concentration: ConcentrationInsight[] = [];
  for (const h of investableHoldings) {
    const pct: number = investableTotal > 0 ? (h.value / investableTotal) * 100 : 0;
    if (pct > 90) concentration.push({ severity: "critical", holding: h.name, pct: Math.round(pct * 10) / 10, msg: `Your entire financial future rests on ${h.name} (${pct.toFixed(1)}%). This is not diversification \u2014 this is all-in.` });
    else if (pct > 50) concentration.push({ severity: "high", holding: h.name, pct: Math.round(pct * 10) / 10, msg: `Half your wealth depends on ${h.name} (${pct.toFixed(1)}%). This conviction requires a clear thesis.` });
    else if (pct > 30) concentration.push({ severity: "medium", holding: h.name, pct: Math.round(pct * 10) / 10, msg: `${h.name} represents ${pct.toFixed(1)}% of your portfolio \u2014 a significant conviction position.` });
  }
  if (investableHoldings.length === 1) concentration.push({ severity: "critical", msg: "Your entire portfolio is one holding. Maximum concentration risk." });
  if (investableHoldings.length > 20) concentration.push({ severity: "low", msg: `You have ${investableHoldings.length} holdings. Beyond 20 positions, you may be creating the illusion of diversification.` });

  const cashPct: number = grouped.cash || 0;
  let cashAnalysis: CashAnalysis;
  if (cashPct > 50) cashAnalysis = { level: "EXTREME", pct: cashPct, msg: "Half your wealth sits idle while inflation erodes it.", q: "What are you protecting against?" };
  else if (cashPct > 30) cashAnalysis = { level: "HIGH", pct: cashPct, msg: "Significant cash reserves \u2014 waiting or nervous?", q: "How long has your cash been at this level?" };
  else if (cashPct > 10) cashAnalysis = { level: "MODERATE", pct: cashPct, msg: "Healthy reserve. Dry powder.", q: "Do you have criteria for deployment?" };
  else if (cashPct < 5) cashAnalysis = { level: "LOW", pct: cashPct, msg: "Fully invested. No cushion.", q: "If a crisis creates buying opportunities, where do funds come from?" };
  else cashAnalysis = { level: "NORMAL", pct: cashPct, msg: "Cash position within typical ranges.", q: null };

  const geo: GeoInsight[] = [];
  const usPct: number = holdingsWithPct.filter((h: HoldingWithPct) => h.category === "us_equities").reduce((s: number, h: HoldingWithPct) => s + h.pct, 0);
  const emPct: number = holdingsWithPct.filter((h: HoldingWithPct) => h.category === "emerging_markets").reduce((s: number, h: HoldingWithPct) => s + h.pct, 0);
  const intlPct: number = holdingsWithPct.filter((h: HoldingWithPct) => h.category === "international_equities").reduce((s: number, h: HoldingWithPct) => s + h.pct, 0);
  const totalEq: number = usPct + intlPct + emPct;
  if (totalEq > 0) {
    if ((usPct / totalEq) * 100 > 90 && totalEq > 20) geo.push({ type: "us_concentration", msg: "Your equity is almost entirely US-based." });
    if (emPct === 0 && totalEq > 20) geo.push({ type: "no_emerging", msg: "No exposure to emerging markets, including Muslim-majority economies." });
  }

  const risk: RiskInsight[] = [];
  const growthPct: number = (grouped.equities || 0) + (grouped.crypto || 0);
  const defensivePct: number = (grouped.sukuk || 0) + (grouped.gold || 0) + (grouped.cash || 0);
  if (growthPct > 80) risk.push({ type: "high_growth", msg: "Over 80% in growth assets. You will feel the full force of bear markets." });
  if ((grouped.crypto || 0) > 20) risk.push({ type: "high_crypto", msg: `Crypto is ${(grouped.crypto || 0).toFixed(1)}% \u2014 the most volatile asset class.` });
  if (defensivePct === 0 && growthPct > 50) risk.push({ type: "no_defensive", msg: "No defensive positions. Your entire portfolio moves with market sentiment." });
  if ((grouped.gold || 0) === 0) risk.push({ type: "no_gold", msg: "No gold. No connection to the Sunnah currency and no crisis hedge." });

  let reconciliation: Reconciliation | null = null;
  if (profile) {
    const deviations: Deviation[] = [];
    let alignedCount: number = 0;
    const cats: string[] = Object.keys(profile.expected);
    for (const catKey of cats) {
      const expected: number = profile.expected[catKey];
      const actual: number = grouped[catKey] || 0;
      const dev: number = actual - expected;
      const absDev: number = Math.abs(dev);
      let status: string = "aligned";
      if (absDev <= 15) { alignedCount++; } else if (absDev <= 30) { status = "notable_drift"; } else { status = "significant_misalignment"; }
      if (absDev > 10) deviations.push({ category: catKey, expected, actual: Math.round(actual * 10) / 10, deviation: Math.round(dev * 10) / 10, status, direction: dev > 0 ? "overweight" : "underweight" });
    }
    deviations.sort((a: Deviation, b: Deviation) => Math.abs(b.deviation) - Math.abs(a.deviation));
    const alignPct: number = cats.length > 0 ? (alignedCount / cats.length) * 100 : 0;
    reconciliation = { overall: alignPct >= 80 ? "well_aligned" : alignPct >= 50 ? "partial_alignment" : "significant_mismatch", alignPct: Math.round(alignPct), deviations, profileName: profile.name };
  }

  let iirsInsight: IirsInsight | null = null;
  if (iirsScore !== null && iirsScore !== undefined) {
    if (iirsScore < 40) iirsInsight = { level: "CRITICAL", msg: "Your financial foundation is in crisis. Focus on the Compass action plan before making ANY portfolio changes." };
    else if (iirsScore < 70) iirsInsight = { level: "BUILDING", msg: "Your foundation needs work. Portfolio optimization should wait until emergency items are resolved." };
    else iirsInsight = { level: "READY", msg: "Your foundation is solid. Portfolio alignment is your appropriate next focus." };
  }

  const compliance: ComplianceSummary = {
    compliant: holdings.filter((h: ScreenedHolding) => h.screening?.status === "COMPLIANT"),
    nonCompliant: holdings.filter((h: ScreenedHolding) => h.screening?.status === "NON_COMPLIANT"),
    questionable: holdings.filter((h: ScreenedHolding) => h.screening?.status === "QUESTIONABLE"),
    notFound: holdings.filter((h: ScreenedHolding) => h.screening?.status === "NOT_FOUND"),
  };

  return { totalValue, grouped, holdingsWithPct, concentration, cashAnalysis, geo, risk, reconciliation, iirsInsight, compliance, holdingsCount: investableHoldings.length };
}


// ============================================================================
// FIX 8: FALLBACK NARRATIVE — Uses all 3 data layers + correct verdict
// ============================================================================

function generateFallback(a: AnalysisResult, userName: string, iirsVal: number | null): string {
  const { reconciliation, compliance, concentration, iirsInsight, grouped, cashAnalysis } = a;
  const verdict: ComplianceVerdict = getComplianceVerdict(compliance);

  let t: string = `## Bismillah\n\nDear ${userName},\n\nThe Mirror does not tell you what you want to hear. It shows you what is. Here is what your portfolio reveals.\n\n`;

  // Shariah verdict (Fix 3)
  if (verdict.level === "non_compliant") {
    t += `## \u26a0\ufe0f Shariah Compliance \u2014 Urgent Action Required\n\n${verdict.description}\n\n`;
    compliance.nonCompliant.forEach((h: ScreenedHolding) => { t += `- **${h.name}** \u2014 ${h.screening?.reason || "Non-compliant"}\n`; });
    t += `\n`;
  } else if (verdict.level === "questionable") {
    t += `## \u26a0\ufe0f Shariah Compliance \u2014 Verification Required\n\n${verdict.description}\n\n`;
    compliance.questionable.forEach((h: ScreenedHolding) => { t += `- **${h.name}** \u2014 ${h.screening?.reason || "Requires review"}\n`; });
    t += `\n`;
  } else if (verdict.level === "unverified") {
    t += `## Shariah Compliance \u2014 Unverified Holdings\n\n${verdict.description}\n\n`;
    compliance.notFound.forEach((h: ScreenedHolding) => { t += `- **${h.name}** \u2014 Not in screening database\n`; });
    t += `\n`;
  } else {
    t += `## \u2705 Shariah Compliance\n\n${verdict.description}\n\n`;
  }

  t += `## Your Portfolio at a Glance\n\nTotal Portfolio Value: $${a.totalValue.toLocaleString()} across ${a.holdingsCount} holdings.\n\n`;

  // Profile alignment (always present now)
  if (reconciliation) {
    t += `## Profile Alignment\n\nYou identified as a **${reconciliation.profileName}**. `;
    if (reconciliation.overall === "well_aligned") {
      t += `Your portfolio allocation closely matches this profile (${reconciliation.alignPct}% alignment). Your actions reflect your stated identity \u2014 this consistency suggests intentional stewardship.\n\n`;
    } else if (reconciliation.overall === "significant_mismatch") {
      t += `However, your portfolio tells a different story. At ${reconciliation.alignPct}% alignment, there is a significant gap between who you claim to be and what your holdings demonstrate.\n\n`;
      if (reconciliation.deviations.length > 0) {
        reconciliation.deviations.slice(0, 3).forEach((d: Deviation) => {
          t += `- **${d.category}**: ${d.actual}% actual vs ${d.expected}% expected (${d.direction} by ${Math.abs(d.deviation)}%)\n`;
        });
        t += `\n`;
      }
    } else {
      t += `Your portfolio partially aligns (${reconciliation.alignPct}%), but there are notable drifts that deserve examination.\n\n`;
    }
  }

  // IIRS (always present now)
  if (iirsInsight && iirsVal !== null) {
    t += `## Financial Readiness\n\nYour IIRS is **${iirsVal}/100** (${iirsInsight.level}). ${iirsInsight.msg}`;
    if (iirsInsight.level === "CRITICAL") {
      t += ` Before optimizing your portfolio, you need to address the urgent issues identified by your Akhirah Financial Compass. Portfolio alignment without a solid foundation is like decorating a house with a cracked foundation.`;
    }
    t += `\n\n`;
  }

  if (concentration.length > 0) t += `## Concentration\n\n${concentration[0].msg}\n\n`;

  t += `## Questions for Reflection\n\n`;
  t += `1. If you stood before Allah today and He asked about every holding in your portfolio \u2014 would you be confident in your answer?\n`;
  t += `2. Does your portfolio reflect intentional stewardship, or has it grown by default without conscious direction?\n`;
  t += `3. What would need to change for your portfolio to truly align with who you say you are?\n\n`;
  t += `---\n\n*Mehdi \u2014 Founder, The Muslim Investor*\n*themuslim-investor.com*`;
  return t;
}


// ============================================================================
// COLORS & CONSTANTS
// ============================================================================

const C = { viridian: "#358C6C", onyx: "#343840", cambridge: "#86A68B", ivory: "#EFF2E4", dimGray: "#6C7173", red: "#DC2626", amber: "#F59E0B", white: "#FFFFFF", bg: "#F8FAF5" } as const;
const FONT: string = "'Poppins', sans-serif";

// ============================================================================
// SUB-COMPONENTS (module-level to avoid remounting)
// ============================================================================

function StatusBadge({ status, reason }: { status: ShariahStatus; reason?: string | null }): React.JSX.Element {
  const config: Record<ShariahStatus, StatusBadgeConfig> = {
    COMPLIANT: { bg: "#E8F5EE", color: C.viridian, icon: "\u2705", label: "Compliant" },
    NON_COMPLIANT: { bg: "#FEE2E2", color: C.red, icon: "\ud83d\udd34", label: "Non-Compliant" },
    QUESTIONABLE: { bg: "#FEF3C7", color: "#92400E", icon: "\ud83d\udfe1", label: "Requires Review" },
    NOT_FOUND: { bg: "#F3F4F6", color: C.dimGray, icon: "\u26aa", label: "Not in database" },
  };
  const cfg: StatusBadgeConfig = config[status] || config.NOT_FOUND;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: cfg.bg, fontSize: 12, fontFamily: FONT }}>
      <span>{cfg.icon}</span>
      <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
      {reason && status !== "COMPLIANT" && <span style={{ color: cfg.color, fontWeight: 400, fontSize: 11 }}>\u2014 {reason}</span>}
    </div>
  );
}

function PieChart({ data, size = 220 }: { data: PieDataPoint[]; size?: number }): React.JSX.Element | null {
  const total: number = data.reduce((s: number, d: PieDataPoint) => s + d.value, 0);
  if (total === 0) return null;
  const colors: string[] = [C.viridian, "#5BA88C", C.cambridge, "#A8C5AD", C.dimGray, "#4A6FA5", "#E8A838"];
  let cumulative: number = 0;
  const slices: React.JSX.Element[] = data.filter((d: PieDataPoint) => d.value > 0).map((d: PieDataPoint, i: number): React.JSX.Element => {
    const pct: number = d.value / total;
    const startAngle: number = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const endAngle: number = cumulative * 2 * Math.PI - Math.PI / 2;
    const largeArc: number = pct > 0.5 ? 1 : 0;
    const r: number = size / 2 - 4;
    const cx: number = size / 2; const cy: number = size / 2;
    const x1: number = cx + r * Math.cos(startAngle); const y1: number = cy + r * Math.sin(startAngle);
    const x2: number = cx + r * Math.cos(endAngle); const y2: number = cy + r * Math.sin(endAngle);
    if (pct >= 0.999) return <circle key={i} cx={cx} cy={cy} r={r} fill={colors[i % colors.length]} />;
    return <path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`} fill={colors[i % colors.length]} />;
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{slices}</svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {data.filter((d: PieDataPoint) => d.value > 0).map((d: PieDataPoint, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: FONT }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ color: C.onyx }}>{d.label}: <strong>{((d.value / total) * 100).toFixed(1)}%</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ children, style: extraStyle }: { children: React.ReactNode; style?: React.CSSProperties }): React.JSX.Element {
  return <div style={{ background: C.white, borderRadius: 12, padding: "28px 32px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #E5E7EB", ...extraStyle }}>{children}</div>;
}

function FormInput({ label, value, onChange, placeholder, type = "text", required, note }: { label: string; value: string; onChange: (val: string) => void; placeholder?: string; type?: string; required?: boolean; note?: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.onyx, marginBottom: 6, fontFamily: FONT }}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>
      <input type={type} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: FONT, color: C.onyx, outline: "none", boxSizing: "border-box", transition: "border 0.2s" }} onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = C.viridian; }} onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "#D1D5DB"; }} />
      {note && <p style={{ fontSize: 12, color: C.dimGray, marginTop: 4, fontFamily: FONT }}>{note}</p>}
    </div>
  );
}

function FormSelect({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (val: string) => void; options: SelectOption[]; placeholder?: string }): React.JSX.Element {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.onyx, marginBottom: 6, fontFamily: FONT }}>{label}</label>
      <select value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #D1D5DB", fontSize: 14, fontFamily: FONT, color: value ? C.onyx : C.dimGray, outline: "none", boxSizing: "border-box", background: C.white, cursor: "pointer" }}>
        <option value="">{placeholder || "Select..."}</option>
        {options.map((o: SelectOption) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "primary", style: extraStyle }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: "primary" | "secondary" | "danger"; style?: React.CSSProperties }): React.JSX.Element {
  const variants: Record<string, { bg: string; color: string; border: string }> = { primary: { bg: C.viridian, color: C.white, border: "none" }, secondary: { bg: "transparent", color: C.viridian, border: `2px solid ${C.viridian}` }, danger: { bg: "transparent", color: C.red, border: `1px solid ${C.red}` } };
  const v = variants[variant];
  return <button onClick={onClick} disabled={disabled} style={{ padding: "12px 28px", borderRadius: 8, fontSize: 15, fontWeight: 600, fontFamily: FONT, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, background: v.bg, color: v.color, border: v.border, transition: "all 0.2s", ...extraStyle }}>{children}</button>;
}

function Progress({ current }: { current: number }): React.JSX.Element {
  const stepLabels: string[] = ["Welcome", "Foundation", "Holdings", "Results"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {stepLabels.map((s: string, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: FONT, background: i + 1 <= current ? C.viridian : "#E5E7EB", color: i + 1 <= current ? C.white : C.dimGray, transition: "all 0.3s" }}>{i + 1 <= current ? "\u2713" : i + 1}</div>
            <span style={{ fontSize: 11, color: i + 1 <= current ? C.viridian : C.dimGray, marginTop: 4, fontFamily: FONT, fontWeight: i + 1 === current ? 600 : 400 }}>{s}</span>
          </div>
          {i < stepLabels.length - 1 && <div style={{ height: 2, flex: 1, background: i + 1 < current ? C.viridian : "#E5E7EB", transition: "all 0.3s", margin: "0 -8px", marginBottom: 18 }} />}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PortfolioMirror(): React.JSX.Element {
  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileType, setProfileType] = useState<string>("");
  const [iirsScore, setIirsScore] = useState<string>("");
  // Fix 1: Removed skipIirs state — IIRS is now required
  const [holdings, setHoldings] = useState<HoldingInput[]>([{ id: 1, name: "", category: "", value: "" }]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [narrative, setNarrative] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>("");
  const [logoBase64, setLogoBase64] = useState<string>("");
  const nextId = useRef<number>(2);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Fix 6: Load logo as base64 on mount for PDF
  useEffect((): void => {
    const img: HTMLImageElement = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = (): void => {
      try {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setLogoBase64(canvas.toDataURL("image/png"));
        }
      } catch (_e: unknown) { /* CORS fallback — PDF will omit logo */ }
    };
    img.src = "/images/tmi-logo-white-bg.png";
  }, []);

  // Fix 5: Compute totalValue using net equity for real estate
  const totalValue: number = useMemo((): number => {
    return holdings.reduce((s: number, h: HoldingInput) => {
      const gross: number = parseFloat(String(h.value).replace(/,/g, "")) || 0;
      if (h.category === "real_estate_investment" && h.mortgage) {
        const mort: number = parseFloat(String(h.mortgage).replace(/,/g, "")) || 0;
        return s + Math.max(0, gross - mort);
      }
      return s + gross;
    }, 0);
  }, [holdings]);

  const addHolding = (): void => {
    setHoldings((prev: HoldingInput[]) => [...prev, { id: nextId.current++, name: "", category: "", value: "" }]);
  };
  const removeHolding = (id: number): void => {
    if (holdings.length <= 1) return;
    setHoldings((prev: HoldingInput[]) => prev.filter((h: HoldingInput) => h.id !== id));
  };
  const updateHolding = (id: number, field: string, val: string): void => {
    setHoldings((prev: HoldingInput[]) => prev.map((h: HoldingInput) => (h.id === id ? { ...h, [field]: val } : h)));
  };

  const canProceedStep2: boolean = name.trim().length > 0 && email.trim().length > 0 && email.includes("@");

  // Fix 1: Hard gate — both Profile AND IIRS required to proceed
  const iirsNum: number = parseInt(iirsScore, 10);
  const iirsValid: boolean = iirsScore.length > 0 && !isNaN(iirsNum) && iirsNum >= 0 && iirsNum <= 100;
  const profileValid: boolean = profileType.length > 0 && profileType !== "none";
  const canProceedStep3: boolean = profileValid && iirsValid;

  const validHoldings: HoldingInput[] = holdings.filter((h: HoldingInput) => {
    const gross: number = parseFloat(String(h.value).replace(/,/g, "")) || 0;
    return h.name.trim().length > 0 && h.category.length > 0 && gross > 0;
  });
  const canAnalyze: boolean = validHoldings.length >= 1;

  // ============================================================================
  // RUN ANALYSIS (Fix 5: net equity, Fix 7: updated AI prompt)
  // ============================================================================

  const runAnalysis = async (): Promise<void> => {
    setLoading(true);
    setLoadingMsg("Screening your holdings against AAOIFI standards...");
    setStep(5);

    // Fix 5: Use net equity for real estate
    const screened: ScreenedHolding[] = validHoldings.map((h: HoldingInput): ScreenedHolding => {
      let val: number = parseFloat(String(h.value).replace(/,/g, ""));
      let dName: string = h.name;
      if (h.category === "real_estate_investment" && h.mortgage) {
        const mort: number = parseFloat(String(h.mortgage).replace(/,/g, "")) || 0;
        val = Math.max(0, val - mort);
        if (mort > 0) dName = `${h.name} (Net equity: $${val.toLocaleString()})`;
      }
      const screening: ScreeningResult = screenHolding(h.name, h.category, h.financeType);
      return { id: h.id, name: h.name, category: h.category, value: val, screening, displayName: dName };
    });

    await new Promise<void>((r: () => void) => setTimeout(r, 800));
    setLoadingMsg("Analyzing portfolio structure and alignment...");

    // Both are guaranteed to be valid due to Fix 1 hard gate
    const profileId: string = profileType;
    const iirs: number = parseInt(iirsScore, 10);
    const result: AnalysisResult = analyzePortfolio(screened, profileId, iirs);

    result.holdingsWithPct = screened.map((h: ScreenedHolding): HoldingWithPct => {
      const pct: number = result.totalValue > 0 ? (h.value / result.totalValue) * 100 : 0;
      const cat: AssetCategory | undefined = CATEGORY_MAP[h.category];
      return { ...h, pct, group: cat?.group || "alternatives" };
    });
    result.compliance = {
      compliant: screened.filter((h: ScreenedHolding) => h.screening?.status === "COMPLIANT"),
      nonCompliant: screened.filter((h: ScreenedHolding) => h.screening?.status === "NON_COMPLIANT"),
      questionable: screened.filter((h: ScreenedHolding) => h.screening?.status === "QUESTIONABLE"),
      notFound: screened.filter((h: ScreenedHolding) => h.screening?.status === "NOT_FOUND"),
    };
    setAnalysis(result);

    await new Promise<void>((r: () => void) => setTimeout(r, 600));
    setLoadingMsg("Generating your personal Mirror Analysis with AI...");

    const profileObj: InvestorProfile = INVESTOR_PROFILES[profileId];
    const holdingsSummary: string = screened.map((h: ScreenedHolding): string => {
      const catLabel: string = CATEGORY_MAP[h.category]?.label || h.category;
      const pctStr: string = ((h.value / result.totalValue) * 100).toFixed(1);
      const reasonStr: string = h.screening.reason ? ` [${h.screening.reason}]` : "";
      return `- ${h.displayName || h.name} (${catLabel}): $${h.value.toLocaleString()} (${pctStr}%) \u2014 Shariah Status: ${h.screening.status}${reasonStr}`;
    }).join("\n");
    const allocSummary: string = Object.entries(result.grouped).filter(([, v]: [string, number]) => v > 0).map(([k, v]: [string, number]) => `- ${k}: ${v.toFixed(1)}%`).join("\n");
    const compSummary: string = `Compliant: ${result.compliance.compliant.length} | Non-compliant: ${result.compliance.nonCompliant.length} | Questionable: ${result.compliance.questionable.length} | Unverified: ${result.compliance.notFound.length}`;
    const reconcSummary: string = result.reconciliation ? `Overall: ${result.reconciliation.overall}\n${result.reconciliation.deviations.slice(0, 5).map((d: Deviation): string => `- ${d.category}: ${d.actual}% actual vs ${d.expected}% expected (${d.direction} by ${Math.abs(d.deviation)}%)`).join("\n")}` : "";

    // Fix 7: Updated system prompt — always includes Profile and IIRS, adds IIRS interpretation guide
    const systemPrompt: string = `You are the TMI Portfolio Mirror \u2014 the culmination tool in The Muslim Investor\u2019s 4-Step Financial Foundation. You have access to three layers of data about this Muslim investor:

1. Their INVESTOR PROFILE \u2014 who they say they are
2. Their IIRS SCORE \u2014 whether their financial foundation is ready
3. Their ACTUAL PORTFOLIO \u2014 what they actually hold, including Shariah compliance screening results

Your role is to synthesize ALL THREE into one unified, penetrating, personal reflection. You REFLECT \u2014 you show them the truth about the gap between their stated identity and their actual reality.

CRITICAL RULES:
1. NEVER recommend specific funds, ETFs, stocks, or financial products by name
2. NEVER name specific brokerage platforms
3. NEVER provide a rebalancing plan, specific allocation targets, or trading instructions
4. DO flag Haram holdings clearly and urgently \u2014 this is the ONE exception
5. For non-compliant holdings, state clearly: "This holding has been identified as non-Shariah-compliant based on AAOIFI screening standards (source: IdealRatings). We strongly recommend divesting and consulting a qualified Shariah advisor."
6. For unverified holdings, state: "We could not verify this holding against our screening database. This does not mean it is haram \u2014 it means we haven\u2019t screened it. Please verify independently."
7. Use the person\u2019s NAME throughout
8. Frame everything through Akhirah preparation, not wealth optimization
9. Reference Quran and Hadith naturally \u2014 not as decoration but as genuine guidance
10. The tone is warm, direct, and honest \u2014 like a trusted advisor who cares enough to tell uncomfortable truths

IIRS SCORE INTERPRETATION:
- 0-29: CRITICAL \u2014 Financial foundation in crisis. Riba, no emergency fund, or both. Portfolio changes are premature.
- 30-49: BUILDING \u2014 Foundation needs significant work. Focus on Compass action plan first.
- 50-69: PROGRESSING \u2014 Foundation improving but not solid. Portfolio review appropriate but major changes should wait.
- 70-100: INVESTMENT READY \u2014 Foundation is solid. Portfolio alignment is the right focus.

IIRS COMPONENT BREAKDOWN:
- Riba Elimination: 40 points max (the heaviest weight \u2014 interest-based debt is the #1 priority)
- Emergency Fund: 25 points max (the safety net before any investing)
- Expense Control: 20 points max (spending discipline)
- Savings Rate: 15 points max (capacity to invest)

If IIRS < 40, the Mirror should say clearly: "Your financial foundation is in crisis. Before optimizing your portfolio, you need to address the urgent issues identified by your Akhirah Financial Compass. Portfolio alignment without a solid foundation is like decorating a house with a cracked foundation."

INVESTOR PROFILE INTERPRETATION:
Use the profile to contextualize the portfolio. A Fortress Builder with 80% equities has a massive identity-portfolio gap. A Growth Seeker with 50% cash is either paralyzed or strategic \u2014 the Mirror asks which.

STRUCTURE YOUR RESPONSE WITH THESE EXACT SECTIONS:

## Bismillah
Brief personal opening addressing them by name. Acknowledge their courage.

## 1. Your Shariah Compliance Status
List every NON_COMPLIANT holding with reason. List QUESTIONABLE and NOT_FOUND. Be direct about haram.

## 2. Your Portfolio at a Glance
Total value, allocation breakdown, number of holdings.

## 3. What Your Portfolio Says About Your Beliefs
The psychological/spiritual mirror.

## 4. Your Profile Alignment
Compare their actual allocation to their ${profileObj.name} expected allocation. Identify the biggest gaps. What do these gaps reveal about the distance between who they claim to be and what their portfolio demonstrates?

## 5. Your Financial Readiness
Their IIRS Score is ${iirs}. Level: ${result.iirsInsight?.level || "N/A"}. ${result.iirsInsight?.msg || ""}. Connect this to their portfolio decisions \u2014 if their IIRS indicates their foundation is in crisis, their portfolio optimization is premature. If their IIRS is strong, portfolio alignment becomes the appropriate focus.

## 6. The Unified Picture
Tie everything together in 2-3 paragraphs.

## 7. Questions for Reflection
3-5 penetrating, personal questions.

## 8. Your Next Step
Guide to TMI ecosystem based on their situation.

End with a brief du\u2019a and sign off as "Mehdi \u2014 Founder, The Muslim Investor"`;

    const userPrompt: string = `Analyze this Muslim investor\u2019s portfolio and provide a comprehensive Mirror Analysis.

NAME: ${name}
INVESTOR PROFILE: ${profileObj.name}
IIRS SCORE: ${iirs}/100 (${result.iirsInsight?.level || ""} \u2014 ${result.iirsInsight?.msg || ""})
TOTAL PORTFOLIO VALUE: $${result.totalValue.toLocaleString()}

HOLDINGS:
${holdingsSummary}

ALLOCATION BY ASSET CLASS:
${allocSummary}

SHARIAH SCREENING SUMMARY:
${compSummary}
${result.compliance.nonCompliant.length > 0 ? "Non-compliant holdings: " + result.compliance.nonCompliant.map((h: ScreenedHolding) => h.name).join(", ") : ""}

PROFILE RECONCILIATION:
${reconcSummary}

CONCENTRATION ALERTS:
${result.concentration.length > 0 ? result.concentration.map((c: ConcentrationInsight) => c.msg).join("\n") : "No significant concentration issues"}

CASH ANALYSIS:
${result.cashAnalysis.level}: ${result.cashAnalysis.msg}

RISK EXPOSURE:
${result.risk.length > 0 ? result.risk.map((r: RiskInsight) => r.msg).join("\n") : "No significant risk flags"}

Remember: This is the CULMINATION tool. Be personal. Be honest. Use their name. Flag haram urgently. Reflect, don\u2019t prescribe.`;

    try {
      const response: Response = await fetch("/api/mirror", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userPrompt }),
      });
      const data: { narrative?: string; error?: string } = await response.json();
      if (data.narrative && data.narrative.length > 100) { setNarrative(data.narrative); }
      else { setNarrative(generateFallback(result, name, iirs)); }
    } catch (e: unknown) {
      console.error("AI call failed:", e);
      setNarrative(generateFallback(result, name, iirs));
    }

    try {
      fetch("/api/mirror", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toISOString(), name, email,
          profile_type: profileObj.name, iirs_score: iirs,
          total_value: result.totalValue, num_holdings: screened.length,
          allocation: result.grouped,
          compliant_pct: screened.length > 0 ? Math.round((result.compliance.compliant.length / screened.length) * 100) : 0,
          non_compliant_count: result.compliance.nonCompliant.length,
          questionable_count: result.compliance.questionable.length,
          alignment: result.reconciliation?.overall || "no_profile",
        }),
      }).catch(() => { /* fire-and-forget */ });
    } catch (_e: unknown) { /* fire-and-forget */ }

    setLoading(false);
    setStep(6);
  };

  useEffect((): void => { window.scrollTo?.({ top: 0, behavior: "smooth" }); }, [step]);

  // Render markdown
  const renderMarkdown = (text: string): React.ReactNode[] | null => {
    if (!text) return null;
    return text.split("\n").map((line: string, i: number): React.ReactNode => {
      if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: 20, fontWeight: 700, color: C.onyx, marginTop: 28, marginBottom: 12, fontFamily: FONT, borderBottom: `2px solid ${C.viridian}`, paddingBottom: 6 }}>{line.replace("## ", "")}</h2>;
      if (line.startsWith("**") && line.endsWith("**")) return <p key={i} style={{ fontWeight: 700, color: C.onyx, margin: "8px 0", fontFamily: FONT }}>{line.replace(/\*\*/g, "")}</p>;
      if (line.startsWith("- **")) { const parts: string[] = line.replace("- **", "").split("**"); return <div key={i} style={{ display: "flex", gap: 4, margin: "4px 0 4px 16px", fontFamily: FONT, fontSize: 14, lineHeight: 1.7, color: C.onyx }}><span style={{ color: C.viridian, marginRight: 4 }}>{"\u2022"}</span><span><strong>{parts[0]}</strong>{parts.slice(1).join("")}</span></div>; }
      if (line.startsWith("- ")) return <div key={i} style={{ display: "flex", gap: 4, margin: "4px 0 4px 16px", fontFamily: FONT, fontSize: 14, lineHeight: 1.7, color: C.onyx }}><span style={{ color: C.viridian, marginRight: 4 }}>{"\u2022"}</span><span>{line.replace("- ", "")}</span></div>;
      if (line.match(/^\d+\. /)) return <div key={i} style={{ margin: "4px 0 4px 16px", fontFamily: FONT, fontSize: 14, lineHeight: 1.7, color: C.onyx }}>{line}</div>;
      if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) return <p key={i} style={{ fontStyle: "italic", color: C.dimGray, margin: "6px 0", fontFamily: FONT, fontSize: 14, lineHeight: 1.7 }}>{line.replace(/\*/g, "")}</p>;
      if (line.startsWith("---")) return <hr key={i} style={{ border: "none", borderTop: `1px solid ${C.cambridge}`, margin: "20px 0" }} />;
      if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
      const rendered: React.ReactNode[] = line.split(/(\*\*[^*]+\*\*)/).map((part: string, j: number): React.ReactNode => {
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={j}>{part.replace(/\*\*/g, "")}</strong>;
        return <React.Fragment key={j}>{part}</React.Fragment>;
      });
      return <p key={i} style={{ margin: "6px 0", fontFamily: FONT, fontSize: 14, lineHeight: 1.8, color: C.onyx }}>{rendered}</p>;
    });
  };

  // ============================================================================
  // STEP RENDERERS
  // ============================================================================

  const renderStep1 = (): React.JSX.Element => (
    <div>
      <Progress current={1} />
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: C.onyx, fontFamily: FONT, lineHeight: 1.3, marginBottom: 12 }}>What Does Your Portfolio<br />Actually Say About You?</h1>
        <p style={{ fontSize: 15, color: C.dimGray, fontFamily: FONT, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>Most Muslims have never held a mirror up to their investments. This tool combines your Investor Profile, your IIRS score, and your actual holdings into one honest picture. What you see might change everything.</p>
      </div>
      <Card>
        <FormInput label="Full Name" value={name} onChange={setName} placeholder="Your full name" required />
        <FormInput label="Email Address" value={email} onChange={setEmail} placeholder="your@email.com" type="email" required />
        <p style={{ fontSize: 12, color: C.dimGray, fontFamily: FONT, lineHeight: 1.6, marginTop: 8, padding: "12px 16px", background: C.ivory, borderRadius: 8 }}>Your name personalizes your report. Your email delivers your PDF. We will never sell, share, or distribute your personal data to any external third party. Your individual holdings are analyzed in your browser and never stored on our servers.</p>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}><Btn onClick={() => setStep(2)} disabled={!canProceedStep2}>Continue &rarr;</Btn></div>
    </div>
  );

  // Fix 1: Hard gate on Step 2 — both Profile and IIRS required
  const renderStep2 = (): React.JSX.Element => (
    <div>
      <Progress current={2} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 8 }}>Your TMI Foundation</h2>
      <p style={{ fontSize: 14, color: C.dimGray, fontFamily: FONT, marginBottom: 24, lineHeight: 1.6 }}>The Mirror combines three layers — your identity, your readiness, and your holdings — to give you a picture no other tool can. Both your Investor Profile and IIRS are required.</p>

      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 12 }}>Your Investor Profile</h3>
        <FormSelect label="Which TMI Investor Profile are you?" value={profileType} onChange={setProfileType} placeholder="Select your profile..." options={[...Object.entries(INVESTOR_PROFILES).map(([k, v]: [string, InvestorProfile]): SelectOption => ({ value: k, label: v.name })), { value: "none", label: "I haven't taken the Investor Profile yet" }]} />
        {profileType === "none" && (
          <div style={{ padding: 20, background: C.ivory, borderRadius: 8, borderLeft: `4px solid ${C.viridian}` }}>
            <p style={{ fontSize: 14, color: C.onyx, fontFamily: FONT, lineHeight: 1.7, marginBottom: 12 }}>
              Your Mirror analysis combines three layers — your identity, your readiness, and your holdings — to give you a picture no other tool can. Without your Investor Profile, we cannot assess whether your portfolio matches who you are. And guessing with your Amanah is not something TMI is willing to do.
            </p>
            <a href="https://themuslim-investor.com/tools/profile" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", padding: "10px 20px", background: C.viridian, color: C.white, borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: FONT, textDecoration: "none" }}>
              Take the Investor Profile &rarr;
            </a>
            <p style={{ fontSize: 12, color: C.dimGray, fontFamily: FONT, marginTop: 10 }}>Once you have your result, come back here and select your profile to continue.</p>
          </div>
        )}
      </Card>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 12 }}>Your IIRS Score</h3>
        <FormInput label="What is your Islamic Investment Readiness Score (IIRS)?" value={iirsScore} onChange={setIirsScore} placeholder="0-100" type="number" required />
        {iirsScore.length > 0 && !iirsValid && (
          <p style={{ fontSize: 12, color: C.red, fontFamily: FONT, marginTop: -12 }}>Please enter a valid IIRS between 0 and 100.</p>
        )}
        <p style={{ fontSize: 12, color: C.dimGray, fontFamily: FONT, marginTop: 4, lineHeight: 1.6 }}>
          {"Don't know your IIRS? "}
          <a href="https://themuslim-investor.com/tools/compass" target="_blank" rel="noopener noreferrer" style={{ color: C.viridian, fontWeight: 600, textDecoration: "none" }}>
            Take the Akhirah Financial Compass first &rarr;
          </a>
        </p>
      </Card>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, flexWrap: "wrap", gap: 12 }}>
        <Btn variant="secondary" onClick={() => setStep(1)}>&larr; Back</Btn>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <Btn onClick={() => setStep(3)} disabled={!canProceedStep3}>Continue &rarr;</Btn>
          {!canProceedStep3 && (
            <span style={{ fontSize: 12, color: C.dimGray, fontFamily: FONT }}>Complete both your Investor Profile and IIRS to continue.</span>
          )}
        </div>
      </div>
    </div>
  );

  // Fix 5: Holdings step with real estate mortgage/finance fields
  const renderStep3 = (): React.JSX.Element => (
    <div>
      <Progress current={3} />
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 8 }}>Your Holdings</h2>
      <p style={{ fontSize: 14, color: C.dimGray, fontFamily: FONT, marginBottom: 24, lineHeight: 1.6 }}>Enter every financial position you hold. The more complete your picture, the more accurate your Mirror.</p>
      <Card style={{ marginBottom: 20, background: C.ivory, border: `1px solid ${C.cambridge}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.onyx, fontFamily: FONT }}>Total Portfolio Value</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: C.viridian, fontFamily: FONT }}>${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ fontSize: 12, color: C.dimGray, fontFamily: FONT, marginTop: 4 }}>{validHoldings.length} holding{validHoldings.length !== 1 ? "s" : ""} entered</div>
      </Card>
      {totalValue > 0 && (() => {
        const groups: Record<string, number> = {};
        validHoldings.forEach((h: HoldingInput) => {
          const cat: AssetCategory | undefined = CATEGORY_MAP[h.category];
          const grp: string = cat?.group || "other";
          const lbl: string = grp.charAt(0).toUpperCase() + grp.slice(1).replace("_", " ");
          let val: number = parseFloat(String(h.value).replace(/,/g, ""));
          if (h.category === "real_estate_investment" && h.mortgage) {
            val = Math.max(0, val - (parseFloat(String(h.mortgage).replace(/,/g, "")) || 0));
          }
          groups[lbl] = (groups[lbl] || 0) + val;
        });
        const pd: PieDataPoint[] = Object.entries(groups).map(([label, value]: [string, number]): PieDataPoint => ({ label, value })).sort((a: PieDataPoint, b: PieDataPoint) => b.value - a.value);
        return <Card style={{ marginBottom: 20, textAlign: "center" }}><PieChart data={pd} /></Card>;
      })()}
      {holdings.map((h: HoldingInput, idx: number) => {
        const screening: ScreeningResult | null = h.name.length > 0 && h.category.length > 0 ? screenHolding(h.name, h.category, h.financeType) : null;
        const isHaram: boolean = h.category === "conventional_bonds" || h.category === "cash_conventional" || h.category === "etf_conventional";
        const isRealEstate: boolean = h.category === "real_estate_investment";
        const grossVal: number = parseFloat(String(h.value).replace(/,/g, "")) || 0;
        const mortVal: number = parseFloat(String(h.mortgage || "").replace(/,/g, "")) || 0;
        const netEquity: number = isRealEstate ? Math.max(0, grossVal - mortVal) : grossVal;
        return (
          <Card key={h.id} style={{ marginBottom: 12, border: isHaram || (isRealEstate && h.financeType === "conventional") ? `1px solid ${C.red}` : "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.dimGray, fontFamily: FONT }}>Holding #{idx + 1}</span>
              {holdings.length > 1 && <button onClick={() => removeHolding(h.id)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>{"\u00d7"}</button>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: FONT }}>Holding Name / Ticker</label><input value={h.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHolding(h.id, "name", e.target.value)} placeholder="e.g., AAPL, SPUS, Gold" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: FONT, boxSizing: "border-box" }} /></div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: FONT }}>{isRealEstate ? "Property Value ($)" : "Current Value ($)"}</label><input type="number" value={h.value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHolding(h.id, "value", e.target.value)} placeholder="0" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: FONT, boxSizing: "border-box" }} /></div>
            </div>
            <div style={{ marginTop: 10 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: FONT }}>Asset Class</label><select value={h.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateHolding(h.id, "category", e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: FONT, boxSizing: "border-box", background: C.white }}><option value="">Select asset class...</option>{ASSET_CATEGORIES.map((c: AssetCategory) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>

            {/* Fix 5: Real estate additional fields */}
            {isRealEstate && (
              <div style={{ marginTop: 12, padding: 16, background: "#F9FAFB", borderRadius: 8, display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: FONT }}>Outstanding mortgage balance ($)</label>
                  <input type="number" value={h.mortgage || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHolding(h.id, "mortgage", e.target.value)} placeholder="0 = owned outright" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: FONT, boxSizing: "border-box" }} />
                  {mortVal > grossVal && grossVal > 0 && <p style={{ fontSize: 12, color: C.red, fontFamily: FONT, marginTop: 4 }}>Your mortgage exceeds the property value. Please verify.</p>}
                  {grossVal > 0 && <p style={{ fontSize: 12, color: C.viridian, fontWeight: 600, fontFamily: FONT, marginTop: 4 }}>Net equity: ${netEquity.toLocaleString()}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.onyx, marginBottom: 4, fontFamily: FONT }}>How is this property financed?</label>
                  <select value={h.financeType || ""} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateHolding(h.id, "financeType", e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #D1D5DB", fontSize: 13, fontFamily: FONT, boxSizing: "border-box", background: C.white }}>
                    <option value="">Select financing type...</option>
                    <option value="outright">Owned outright (no mortgage)</option>
                    <option value="islamic">Islamic financing (Murabaha / Ijara)</option>
                    <option value="conventional">Conventional mortgage</option>
                  </select>
                </div>
                {h.financeType === "conventional" && (
                  <div style={{ padding: "8px 12px", background: "#FEE2E2", borderRadius: 6, fontSize: 12, color: C.red, fontFamily: FONT, fontWeight: 600 }}>
                    {"\u26a0\ufe0f"} Investment property financed with conventional mortgage (Riba). This is flagged as non-compliant.
                  </div>
                )}
              </div>
            )}

            {isHaram && !isRealEstate && <div style={{ marginTop: 8, padding: "8px 12px", background: "#FEE2E2", borderRadius: 6, fontSize: 12, color: C.red, fontFamily: FONT, fontWeight: 600 }}>{"\u26a0\ufe0f"} This category is automatically flagged as non-compliant.</div>}
            {screening && h.name.length > 0 && h.category.length > 0 && <div style={{ marginTop: 8 }}><StatusBadge status={screening.status} reason={screening.reason} /></div>}
          </Card>
        );
      })}
      <button onClick={addHolding} style={{ width: "100%", padding: 14, borderRadius: 8, border: `2px dashed ${C.cambridge}`, background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.viridian, transition: "all 0.2s", marginBottom: 24 }}>+ Add Holding</button>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><Btn variant="secondary" onClick={() => setStep(2)}>&larr; Back</Btn><Btn onClick={runAnalysis} disabled={!canAnalyze}>Reveal My Mirror &rarr;</Btn></div>
    </div>
  );

  const renderLoading = (): React.JSX.Element => (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ width: 56, height: 56, border: `4px solid ${C.ivory}`, borderTop: `4px solid ${C.viridian}`, borderRadius: "50%", animation: "tmi-spin 1s linear infinite", margin: "0 auto 24px" }} />
      <style>{`@keyframes tmi-spin { to { transform: rotate(360deg); } }`}</style>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 8 }}>Preparing Your Mirror</h2>
      <p style={{ fontSize: 14, color: C.dimGray, fontFamily: FONT }}>{loadingMsg}</p>
    </div>
  );

  // ============================================================================
  // RESULTS (Fix 3: verdict banner, Fix 6: branded PDF)
  // ============================================================================

  const renderResults = (): React.JSX.Element | null => {
    if (!analysis) return null;
    const { compliance, totalValue: tv, grouped, holdingsWithPct: hwp } = analysis;
    const nonCompCount: number = compliance.nonCompliant.length;
    const questCount: number = compliance.questionable.length;
    const notFoundCount: number = compliance.notFound.length;
    const verdict: ComplianceVerdict = getComplianceVerdict(compliance);
    const pieData: PieDataPoint[] = Object.entries(grouped).filter(([, v]: [string, number]) => v > 0).map(([k, v]: [string, number]): PieDataPoint => ({ label: k.charAt(0).toUpperCase() + k.slice(1).replace("_", " "), value: v })).sort((a: PieDataPoint, b: PieDataPoint) => b.value - a.value);

    // Fix 6: Branded PDF with logo, correct verdict, branded footer
    const handlePdfPrint = (): void => {
      const pw: Window | null = window.open("", "_blank");
      if (!pw) return;
      const logoHtml: string = logoBase64 ? `<img src="${logoBase64}" style="height:50px;display:block;margin:0 auto 16px" alt="TMI" />` : "";
      const hHtml: string = (hwp || []).map((h: HoldingWithPct): string => { const cl: string = CATEGORY_MAP[h.category]?.label || ""; const ps: string = ((h.value / tv) * 100).toFixed(1); const sc: string = h.screening?.status === "COMPLIANT" ? "compliant" : "non-compliant"; return `<tr><td>${h.displayName || h.name}</td><td>${cl}</td><td>$${h.value.toLocaleString()}</td><td>${ps}%</td><td><span class="badge ${sc}">${h.screening?.status || ""}</span></td></tr>`; }).join("");
      const nHtml: string = narrative.split("\n").map((line: string): string => { if (line.startsWith("## ")) return `<h2>${line.replace("## ", "")}</h2>`; if (line.startsWith("- ")) return `<p style="margin-left:16px">\u2022 ${line.replace("- ", "")}</p>`; if (line.trim() === "") return "<br/>"; return `<p>${line.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")}</p>`; }).join("");
      const verdictHtml: string = `<div style="background:${verdict.bannerBg};border:1px solid ${verdict.bannerBorder};padding:16px;border-radius:8px;margin:16px 0"><strong style="color:${verdict.bannerColor}">${verdict.icon} ${verdict.title}</strong></div>`;
      const ds: string = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      pw.document.write(`<!DOCTYPE html><html><head><title>TMI Portfolio Mirror Report</title><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet"><style>body{font-family:'Poppins',sans-serif;max-width:800px;margin:0 auto;padding:40px 20px;color:#343840}h1{color:#358C6C;font-size:24px;margin:0}h2{color:#343840;font-size:18px;border-bottom:2px solid #358C6C;padding-bottom:6px}p{line-height:1.8;font-size:14px}.header{text-align:center;margin-bottom:32px;padding-bottom:20px}.badge{display:inline-block;padding:4px 10px;border-radius:4px;font-size:12px;font-weight:600}.compliant{background:#E8F5EE;color:#358C6C}.non-compliant{background:#FEE2E2;color:#DC2626}table{width:100%;border-collapse:collapse;font-size:13px;margin:16px 0}th,td{padding:8px;text-align:left;border-bottom:1px solid #E5E7EB}th{font-weight:700;border-bottom:2px solid #343840}@media print{body{padding:20px}}</style></head><body><div class="header">${logoHtml}<h1 style="color:#358C6C;font-size:24px;margin:0">TMI Portfolio Mirror Report</h1><p style="color:#6C7173;font-size:14px;margin-top:8px">Prepared for <strong>${name}</strong> \u2014 ${ds}</p><div style="height:3px;background:#358C6C;margin-top:16px"></div></div><h2>Shariah Compliance</h2>${verdictHtml}<p>Compliant: ${compliance.compliant.length} | Non-compliant: ${nonCompCount} | Questionable: ${questCount} | Unverified: ${notFoundCount}</p><h2>Portfolio Summary</h2><p>Total Value: <strong>$${tv.toLocaleString()}</strong> | Holdings: <strong>${analysis.holdingsCount}</strong></p><table><thead><tr><th>Holding</th><th>Category</th><th>Value</th><th>%</th><th>Status</th></tr></thead><tbody>${hHtml}</tbody></table><h2>Mirror Analysis</h2>${nHtml}<div style="margin-top:40px;border-top:2px solid #358C6C;padding-top:20px;text-align:center"><p style="font-size:12px;color:#6C7173;line-height:1.6"><strong>Disclaimer:</strong> Educational analysis based on Islamic finance principles. Not personalized financial advice. Shariah screening sourced from IdealRatings (AAOIFI standards). Updated quarterly.<br/><br/><strong>The Muslim Investor</strong> \u2014 Preparing Your Answer for the Day of Judgment<br/>themuslim-investor.com/tools/mirror</p></div></body></html>`);
      pw.document.close();
      setTimeout(() => pw.print(), 500);
    };

    const handleWhatsApp = (): void => { const t: string = encodeURIComponent("I just held up a mirror to my portfolio with The Muslim Investor. What does YOUR portfolio say about you? themuslim-investor.com/tools/mirror"); window.open(`https://wa.me/?text=${t}`, "_blank"); };

    return (
      <div ref={resultsRef}>
        {/* Fix 3: Compliance verdict banner using conservative hierarchy */}
        <div style={{ background: verdict.bannerBg, border: `1px solid ${verdict.bannerBorder}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>{verdict.icon}</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: verdict.bannerColor, fontFamily: FONT, margin: 0, lineHeight: 1.5 }}>{verdict.title}</h2>
          </div>
          {verdict.level === "non_compliant" && compliance.nonCompliant.map((h: ScreenedHolding, i: number) => (
            <div key={i} style={{ fontSize: 13, color: C.red, fontFamily: FONT, marginLeft: 34, marginTop: 4 }}>{"\u2022"} <strong>{h.name}</strong> {"\u2014"} {h.screening?.reason || "Non-compliant"}</div>
          ))}
        </div>
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 16 }}>Portfolio Summary</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 20 }}>
            <div style={{ textAlign: "center", padding: 16, background: C.ivory, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.dimGray, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 1 }}>Total Value</div><div style={{ fontSize: 22, fontWeight: 900, color: C.viridian, fontFamily: FONT }}>${tv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
            <div style={{ textAlign: "center", padding: 16, background: C.ivory, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.dimGray, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 1 }}>Holdings</div><div style={{ fontSize: 22, fontWeight: 900, color: C.onyx, fontFamily: FONT }}>{analysis.holdingsCount}</div></div>
            <div style={{ textAlign: "center", padding: 16, background: verdict.level === "clean" ? "#E8F5EE" : "#FEE2E2", borderRadius: 8 }}><div style={{ fontSize: 11, color: C.dimGray, fontFamily: FONT, textTransform: "uppercase", letterSpacing: 1 }}>Compliant</div><div style={{ fontSize: 22, fontWeight: 900, color: verdict.level === "clean" ? C.viridian : C.red, fontFamily: FONT }}>{compliance.compliant.length}/{compliance.compliant.length + nonCompCount + questCount + notFoundCount}</div></div>
          </div>
          <PieChart data={pieData} />
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 16 }}>Screening Results</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: FONT, fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `2px solid ${C.onyx}` }}><th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Holding</th><th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Category</th><th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Value</th><th style={{ textAlign: "right", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>%</th><th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700, color: C.onyx }}>Shariah Status</th></tr></thead>
              <tbody>{(hwp || []).map((h: HoldingWithPct, i: number) => (<tr key={i} style={{ borderBottom: "1px solid #E5E7EB" }}><td style={{ padding: "8px 12px", fontWeight: 600, color: C.onyx }}>{h.displayName || h.name}</td><td style={{ padding: "8px 12px", color: C.dimGray }}>{CATEGORY_MAP[h.category]?.label || h.category}</td><td style={{ padding: "8px 12px", textAlign: "right", color: C.onyx }}>${h.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td><td style={{ padding: "8px 12px", textAlign: "right", color: C.onyx }}>{h.pct !== undefined ? h.pct.toFixed(1) : ((h.value / tv) * 100).toFixed(1)}%</td><td style={{ padding: "8px 12px" }}><StatusBadge status={h.screening?.status || "NOT_FOUND"} reason={h.screening?.reason} /></td></tr>))}</tbody>
            </table>
          </div>
        </Card>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}><div style={{ width: 36, height: 36, borderRadius: "50%", background: C.viridian, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 18 }}>{"\ud83e\ude9e"}</span></div><h3 style={{ fontSize: 20, fontWeight: 900, color: C.onyx, fontFamily: FONT, margin: 0 }}>Your Mirror Analysis</h3></div>
          <div>{renderMarkdown(narrative)}</div>
        </Card>
        {/* Fix 1: Removed conditional Profile/Compass buttons — both are now required */}
        <Card style={{ background: C.ivory, border: `1px solid ${C.cambridge}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: C.onyx, fontFamily: FONT, marginBottom: 16 }}>Your Next Steps</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Btn onClick={handlePdfPrint}>Download Report (PDF)</Btn>
            <Btn variant="secondary" onClick={handleWhatsApp}>Share on WhatsApp</Btn>
            <Btn variant="secondary" onClick={() => window.open("https://skool.com/the-muslim-investor", "_blank")}>Join TMI Community &rarr;</Btn>
          </div>
        </Card>
        <div style={{ marginTop: 24, padding: 20, background: "#F9FAFB", borderRadius: 8, fontSize: 11, color: C.dimGray, fontFamily: FONT, lineHeight: 1.6 }}><strong>Disclaimer:</strong> This tool provides educational analysis based on Islamic finance principles. It is not personalized financial advice. The Shariah screening database is sourced from IdealRatings (AAOIFI standards) and updated quarterly. Always verify compliance with a qualified Shariah advisor before making investment decisions.<br /><br /><strong>Privacy:</strong> We collect your name, email, and aggregated portfolio allocation (percentages only) to personalize your experience and deliver your report. Your individual holdings are processed in your browser and are never stored on our servers. We will never sell, share, or distribute your personal data to any external third party.</div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER (Fix 9: actual logo image in header)
  // ============================================================================

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: FONT }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&family=Amiri&display=swap" rel="stylesheet" />
      <div style={{ background: C.onyx, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Fix 9: Actual logo image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/tmi-logo-light.png" alt="The Muslim Investor" style={{ height: 28 }} />
          <span style={{ fontSize: 13, color: C.dimGray, fontFamily: FONT }}>Portfolio Mirror</span>
        </div>
        <span style={{ fontSize: 11, color: C.dimGray, fontFamily: FONT }}>Step 4 of 4 {"\u2014"} Financial Foundation</span>
      </div>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 5 && renderLoading()}
        {step === 6 && renderResults()}
      </div>
      <div style={{ background: C.onyx, padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
        <p style={{ fontSize: 12, color: C.dimGray, fontFamily: FONT, margin: 0 }}>The Muslim Investor {"\u2014"} Preparing Your Answer for the Day of Judgment</p>
        <p style={{ fontSize: 11, color: "#4B5563", fontFamily: FONT, marginTop: 4 }}>Shariah Screening: IdealRatings {"\u00b7"} AAOIFI Standards {"\u00b7"} Bloomberg Terminal</p>
      </div>
    </div>
  );
}
