"use client";

import { useState, useEffect, useCallback } from "react";

// ─── TYPES ──────────────────────────────────────────────────────────────
interface Demographics {
  location: string;
  ageRange: string;
  education: string;
  adults: number;
  children: number;
  incomeRange: string;
  employment: string;
}

interface Income {
  primary: string;
  spouse: string;
  business: string;
  investment: string;
}

interface Expenses {
  [key: string]: string;
}

interface Debt {
  name: string;
  type: string;
  balance: string;
  apr: string;
  minPayment: string;
  extraPayment: string;
  remainingTerm: string;
}

interface DebtCalc {
  name: string;
  type: string;
  balance: string;
  apr: number;
  minPayment: string;
  extraPayment: string;
  remainingTerm: string;
  bal: number;
  minPay: number;
  extraPay: number;
  totalPay: number;
  monthlyInterest: number;
  priorityScore: number;
  payoffMonths: number | string;
  isInterestOnly: boolean;
}

interface UserInfo {
  name: string;
  email: string;
}

interface AppState {
  userInfo: UserInfo;
  demographics: Demographics;
  income: Income;
  expenses: Expenses;
  debts: Debt[];
  emergencyFund: string;
}

interface ExpenseCutItem {
  category: string;
  amount: number;
}

interface ComputedResult {
  totalIncome: number;
  totalExpenses: number;
  cashFlow: number;
  savingsRate: number;
  totalDebt: number;
  debtCalcs: DebtCalc[];
  sortedDebts: DebtCalc[];
  debtPaymentsExclMortgage: number;
  totalMonthlyInterest: number;
  totalMinPayments: number;
  peerAverages: Record<string, number>;
  differences: Record<string, number>;
  overspendCount: number;
  expenseValues: Record<string, number>;
  ef: number;
  monthsProtected: number;
  iirsScore: number;
  ribaScore: number;
  efScore: number;
  expenseScore: number;
  savingsScore: number;
  ribaStatus: string;
  efStatus: string;
  expenseStatus: string;
  savingsStatus: string;
  crisisLabel: string;
  milestones: { label: string; achieved: boolean }[];
  headline: string;
  battlePlanTitle: string;
  actionSteps: string[];
  expenseCuts: ExpenseCutItem[];
  totalCuts: number;
  charityExcess: number;
  efStrikeAmount: number;
  newCashFlow: number;
  projectedImpact: string[];
  whatIfProjection: string;
  islamicRealityCheck: string[];
  ribaStrategy: { freedomDate: string; priorityTarget: string; method: string; currentPath: string; acceleratedPath: string; islamicDuty: string } | null;
  closingMessage: string;
}

// ─── DATA TABLES ────────────────────────────────────────────────────────
const LOCATIONS = [
  "Dubai","London","New York","Toronto","Riyadh","Istanbul","Cairo",
  "Karachi","Jakarta","Kuala Lumpur","Singapore","Sydney","Paris","Berlin"
];

const LOCATION_MULTIPLIERS: Record<string, Record<string, number>> = {
  "Dubai":        { housing:1.4, food:1.3, transport:1.2, utilities:1.3, healthcare:1.4, overall:1.32 },
  "London":       { housing:1.6, food:1.4, transport:1.5, utilities:1.4, healthcare:1.5, overall:1.48 },
  "New York":     { housing:1.7, food:1.5, transport:1.4, utilities:1.5, healthcare:1.6, overall:1.54 },
  "Toronto":      { housing:1.3, food:1.2, transport:1.2, utilities:1.2, healthcare:1.3, overall:1.24 },
  "Riyadh":       { housing:1.0, food:1.0, transport:1.0, utilities:1.0, healthcare:1.0, overall:1.0 },
  "Istanbul":     { housing:0.7, food:0.6, transport:0.6, utilities:0.65,healthcare:0.7, overall:0.65 },
  "Cairo":        { housing:0.4, food:0.3, transport:0.3, utilities:0.35,healthcare:0.4, overall:0.35 },
  "Karachi":      { housing:0.3, food:0.25,transport:0.25,utilities:0.3, healthcare:0.35,overall:0.29 },
  "Jakarta":      { housing:0.5, food:0.4, transport:0.35,utilities:0.4, healthcare:0.45,overall:0.42 },
  "Kuala Lumpur":  { housing:0.8, food:0.7, transport:0.6, utilities:0.7, healthcare:0.75,overall:0.71 },
  "Singapore":    { housing:1.8, food:1.3, transport:1.1, utilities:1.3, healthcare:1.4, overall:1.38 },
  "Sydney":       { housing:1.5, food:1.3, transport:1.3, utilities:1.3, healthcare:1.4, overall:1.36 },
  "Paris":        { housing:1.5, food:1.3, transport:1.4, utilities:1.3, healthcare:1.4, overall:1.38 },
  "Berlin":       { housing:1.2, food:1.1, transport:1.2, utilities:1.1, healthcare:1.2, overall:1.16 },
};

const INCOME_RANGES = [
  "Under $30k","$30k-$50k","$50k-$75k","$75k-$100k",
  "$100k-$150k","$150k-$200k","$200k+"
];

const INCOME_BENCHMARKS: Record<string, Record<string, number>> = {
  "Under $30k":   { housing:35, food:15, transport:18, utilities:10, healthcare:8,  savings:10 },
  "$30k-$50k":    { housing:32, food:14, transport:16, utilities:9,  healthcare:7,  savings:12 },
  "$50k-$75k":    { housing:30, food:12, transport:15, utilities:8,  healthcare:6,  savings:15 },
  "$75k-$100k":   { housing:28, food:11, transport:14, utilities:7,  healthcare:6,  savings:18 },
  "$100k-$150k":  { housing:26, food:10, transport:13, utilities:6,  healthcare:5,  savings:20 },
  "$150k-$200k":  { housing:24, food:9,  transport:12, utilities:5,  healthcare:5,  savings:22 },
  "$200k+":       { housing:22, food:8,  transport:11, utilities:5,  healthcare:4,  savings:25 },
};

const AGE_RANGES = ["18-24","25-34","35-44","45-54","55-64","65+"];
const EDUCATION_LEVELS = ["High School","Bachelor's","Master's","PhD"];
const EMPLOYMENT_TYPES = ["Employee","Self-Employed","Student","Retired"];
const DEBT_TYPES = ["Credit Card","Personal Loan","Auto Loan","Student Loan","Mortgage","Other"];

const EXPENSE_CATEGORIES = [
  { key:"housing",      label:"Housing (Rent/Mortgage)", peerKey:"housing" },
  { key:"transport",    label:"Transportation",          peerKey:"transport" },
  { key:"food",         label:"Food & Groceries",        peerKey:"food" },
  { key:"utilities",    label:"Utilities",               peerKey:"utilities" },
  { key:"healthcare",   label:"Healthcare",              peerKey:"healthcare" },
  { key:"education",    label:"Education",               peerKey:null },
  { key:"personal",     label:"Personal/Clothing",       peerKey:"personal" },
  { key:"entertainment",label:"Entertainment",           peerKey:"entertainment" },
  { key:"charity",      label:"Charity/Zakat (2.5% min)",peerKey:"charity" },
  { key:"other",        label:"Other Expenses",          peerKey:null },
];

// Categories that count for overspend scoring (have peer benchmarks)
const SCORED_EXPENSE_KEYS = ["housing","transport","food","utilities","healthcare","personal","entertainment","charity"];

// ─── BRAND TOKENS ───────────────────────────────────────────────────────
const V = {
  viridian: "#358C6C",
  viridianDark: "#246B54",
  viridianLight: "#BFE3D6",
  viridianBg: "#E7F4EF",
  onyx: "#343840",
  cambridge: "#86A68B",
  ivory: "#EFF2E4",
  dimGray: "#6C7173",
  white: "#FFFFFF",
  red: "#DC2626",
  amber: "#F59E0B",
  redBg: "#FEF2F2",
  amberBg: "#FFFBEB",
  greenBg: "#F0FDF4",
};

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────────────
const fmt = (n: number | undefined | null): string => {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
};

const fmtPct = (n: number | undefined | null): string => {
  if (!n || isNaN(n)) return "0%";
  return (n * 100).toFixed(1) + "%";
};

const fmtNum = (n: number): string => Math.round(n).toLocaleString("en-US");

// ─── NPER CALCULATION ───────────────────────────────────────────────────
function nper(rate: number, pmt: number, pv: number): number {
  if (rate === 0) return pv > 0 && pmt > 0 ? pv / pmt : 999;
  if (pmt <= pv * rate) return 999; // interest-only or negative amortization
  try {
    const n = Math.log(pmt / (pmt - pv * rate)) / Math.log(1 + rate);
    return isFinite(n) && n > 0 ? Math.ceil(n) : 999;
  } catch {
    return 999;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// CALCULATION ENGINE — ALL EXCEL FORMULAS REPLICATED
// ═══════════════════════════════════════════════════════════════════════
function computeAll(state: AppState): ComputedResult {
  const { demographics, income, expenses, debts, emergencyFund } = state;
  const userName = state.userInfo.name || "Friend";

  // ── INCOME ──
  const totalIncome = Object.values(income).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  // ── PEER AVERAGES ──
  const loc = demographics.location || "Riyadh";
  const incRange = demographics.incomeRange || "Under $30k";
  const locMult = LOCATION_MULTIPLIERS[loc] || LOCATION_MULTIPLIERS["Riyadh"];
  const incBench = INCOME_BENCHMARKS[incRange] || INCOME_BENCHMARKS["Under $30k"];

  const peerAverages: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    if (cat.peerKey === "personal") {
      peerAverages[cat.key] = totalIncome * 0.04;
    } else if (cat.peerKey === "entertainment") {
      peerAverages[cat.key] = totalIncome * 0.05;
    } else if (cat.peerKey === "charity") {
      peerAverages[cat.key] = Math.max(totalIncome * 0.025, totalIncome * 0.05);
    } else if (cat.peerKey && incBench[cat.peerKey] !== undefined && locMult[cat.peerKey] !== undefined) {
      peerAverages[cat.key] = (incBench[cat.peerKey] / 100) * totalIncome * locMult[cat.peerKey];
    } else {
      peerAverages[cat.key] = 0;
    }
  });

  // ── EXPENSES ──
  const expenseValues: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    expenseValues[cat.key] = parseFloat(expenses[cat.key]) || 0;
  });

  // ── DEBTS ──
  const activeDebts = debts.filter(d => (parseFloat(d.balance) || 0) > 0);
  const totalDebt = activeDebts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0);
  const maxBalance = activeDebts.length > 0 ? Math.max(...activeDebts.map(d => parseFloat(d.balance) || 0)) : 1;

  const debtCalcs: DebtCalc[] = debts.map(d => {
    const bal = parseFloat(d.balance) || 0;
    const aprVal = parseFloat(d.apr) || 0;
    const minPay = parseFloat(d.minPayment) || 0;
    const extraPay = parseFloat(d.extraPayment) || 0;
    const termInput = parseFloat(d.remainingTerm) || 0;
    const totalPay = minPay + extraPay;
    const monthlyInterest = bal * (aprVal / 100) / 12;
    const isInterestOnly = bal > 0 && minPay > 0 && minPay <= monthlyInterest;

    // Priority score: hybrid avalanche/snowball
    let priorityScore = 0;
    if (bal > 0) {
      priorityScore = (1 + (d.type === "Credit Card" ? 1 : 0)) *
        (1 + Math.min((aprVal / 100) * 10, 5)) *
        (bal < 1000 ? 1.5 : 1) *
        (bal / (maxBalance > 0 ? maxBalance : 1));
    }

    // Payoff months using NPER or term input
    let payoffMonths: number | string = "-";
    if (bal > 0) {
      if (isInterestOnly) {
        payoffMonths = "INTEREST-ONLY!";
      } else if (termInput > 0) {
        payoffMonths = termInput;
      } else if (aprVal > 0 && totalPay > monthlyInterest) {
        const rate = aprVal / 100 / 12;
        const rawNper = nper(rate, totalPay, bal);
        const maxTerm = d.type === "Mortgage" ? 360 : d.type === "Auto Loan" ? 72 : d.type === "Student Loan" ? 240 : 600;
        payoffMonths = Math.min(maxTerm, rawNper);
      } else if (aprVal === 0 && totalPay > 0) {
        payoffMonths = Math.ceil(bal / totalPay);
      }
    }

    return {
      name: d.name, type: d.type, balance: d.balance, apr: aprVal,
      minPayment: d.minPayment, extraPayment: d.extraPayment, remainingTerm: d.remainingTerm,
      bal, minPay, extraPay, totalPay, monthlyInterest, priorityScore, payoffMonths, isInterestOnly,
    };
  });

  const sortedDebts = [...debtCalcs].filter(d => d.bal > 0).sort((a, b) => b.priorityScore - a.priorityScore);

  const debtPaymentsExclMortgage = debtCalcs
    .filter(d => d.type !== "Mortgage" && d.bal > 0)
    .reduce((s, d) => s + d.minPay + d.extraPay, 0);

  const totalMonthlyInterest = debtCalcs.reduce((s, d) => s + d.monthlyInterest, 0);
  const totalMinPayments = debtCalcs.filter(d => d.bal > 0).reduce((s, d) => s + d.minPay, 0);

  expenseValues.debtPayments = debtPaymentsExclMortgage;
  const totalExpenses = EXPENSE_CATEGORIES.reduce((s, cat) => s + (expenseValues[cat.key] || 0), 0) + debtPaymentsExclMortgage;
  const cashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? cashFlow / totalIncome : (cashFlow < 0 ? -1 : 0);

  // ── DIFFERENCES & OVERSPEND ──
  const differences: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    const pa = peerAverages[cat.key] || 0;
    differences[cat.key] = pa > 0 ? expenseValues[cat.key] - pa : 0;
  });

  // Overspend count: only scored categories
  const overspendCount = SCORED_EXPENSE_KEYS.filter(k => (differences[k] || 0) > 0).length;

  // ── EMERGENCY FUND ──
  const ef = parseFloat(emergencyFund) || 0;
  const monthsProtected = totalExpenses > 0 ? ef / totalExpenses : 0;

  // ═══ IIRS SCORING — EXACT EXCEL FORMULAS ═══

  // Riba Elimination (40 max)
  let ribaScore: number;
  if (totalDebt > 0) {
    ribaScore = Math.min(30, Math.max(5, 30 - Math.min(20, (totalDebt / Math.max(1, totalIncome)) * 20)));
  } else {
    ribaScore = 40;
  }

  // Emergency Fund (25 max) — Excel: MIN(25, IF(months>=6, 25, IF(months>=3, 20, IF(months>=1, 10, months*10))))
  let efScore: number;
  if (monthsProtected >= 6) efScore = 25;
  else if (monthsProtected >= 3) efScore = 20;
  else if (monthsProtected >= 1) efScore = 10;
  else efScore = monthsProtected * 10;

  // Expense Control (20 max) — Excel: 20 - COUNTIF(differences > 0) * 3
  const expenseScore = Math.min(20, 20 - overspendCount * 3);

  // Savings Rate (15 max) — exact Excel step function
  let savingsScore: number;
  if (savingsRate >= 0.2) savingsScore = 15;
  else if (savingsRate >= 0.15) savingsScore = 12;
  else if (savingsRate >= 0.1) savingsScore = 8;
  else savingsScore = 0;

  // IIRS with cap based on emergency fund
  let iirsScore: number;
  if (totalIncome === 0) {
    iirsScore = 0;
  } else {
    const rawSum = ribaScore + efScore + expenseScore + savingsScore;
    let cap = 100;
    if (monthsProtected === 0) cap = 40;
    else if (monthsProtected < 1) cap = 50;
    else if (monthsProtected < 3) cap = 60;
    iirsScore = Math.min(cap, rawSum);
  }

  // Status labels
  const ribaStatus = ribaScore >= 40 ? "COMPLETE" : ribaScore > 20 ? "MANAGEABLE" : ribaScore > 10 ? "HEAVY" : "CRUSHING";
  const efStatus = efScore >= 20 ? "STRONG" : efScore >= 10 ? "BUILDING" : "WEAK";
  const expenseStatus = expenseScore >= 15 ? "EXCELLENT" : expenseScore >= 10 ? "GOOD" : "POOR";
  const savingsStatus = savingsRate < 0.1 ? "UNACCEPTABLE" : savingsScore >= 12 ? "EXCELLENT" : savingsScore >= 8 ? "ON TARGET" : "LOW";

  // ═══ CRISIS LABEL — EXACT EXCEL LOGIC ═══
  let crisisLabel: string;
  if (totalIncome === 0) crisisLabel = "NO INCOME CRISIS";
  else if (monthsProtected === 0 && cashFlow > 5000) crisisLabel = "EMERGENCY FUND CRISIS - Inexcusable";
  else if (monthsProtected === 0) crisisLabel = "EMERGENCY FUND CRISIS";
  else if (monthsProtected < 1) crisisLabel = "EMERGENCY FUND WARNING";
  else if (totalDebt > 0 && cashFlow > totalDebt) crisisLabel = "RIBA CRISIS - Can Eliminate Today";
  else if (totalDebt > 0 && cashFlow > totalDebt / 3) crisisLabel = "RIBA CRISIS - Can Eliminate in 3 Months";
  else if (totalDebt > 0 && cashFlow < 0) crisisLabel = "DOUBLE EMERGENCY";
  else if (totalDebt > 0) crisisLabel = "RIBA CRISIS";
  else if (savingsRate < 0.1) crisisLabel = "SAVINGS CRISIS - Sub 10%";
  else if (iirsScore >= 70) crisisLabel = "INVESTMENT READY";
  else if (iirsScore >= 50) crisisLabel = "PROGRESSING";
  else if (iirsScore >= 30) crisisLabel = "BUILDING";
  else crisisLabel = "CRITICAL";

  // ═══ MILESTONES — EXPENSE OPTIMIZED uses >$100 threshold per Excel ═══
  const milestones = [
    { label: "Riba-Free", achieved: totalDebt === 0 },
    { label: "10% Minimum Savings", achieved: savingsRate >= 0.1 },
    { label: "1-Month Buffer", achieved: monthsProtected >= 1 },
    { label: "3-Month Safety Net", achieved: monthsProtected >= 3 },
    { label: "6-Month Fortress", achieved: monthsProtected >= 6 },
    { label: "Expenses Optimized", achieved: SCORED_EXPENSE_KEYS.filter(k => (differences[k] || 0) > 100).length === 0 },
    { label: "15% Savings Rate", achieved: savingsRate >= 0.15 },
    { label: "20% Savings Rate", achieved: savingsRate >= 0.2 },
    { label: "Investment Ready", achieved: iirsScore >= 70 && monthsProtected >= 3 && totalDebt === 0 },
  ];

  // ═══ EXPENSE CUTS — categories where user overspends ═══
  const expenseCuts: ExpenseCutItem[] = [];
  const scoredCats = EXPENSE_CATEGORIES.filter(c => SCORED_EXPENSE_KEYS.includes(c.key) && c.key !== "charity");
  const sortedOverspends = scoredCats
    .filter(c => (differences[c.key] || 0) > 0)
    .sort((a, b) => (differences[b.key] || 0) - (differences[a.key] || 0));

  sortedOverspends.forEach(cat => {
    expenseCuts.push({ category: cat.label, amount: differences[cat.key] });
  });

  const charityExcess = totalDebt > 0 ? Math.max(0, expenseValues.charity - totalIncome * 0.025) : 0;
  const entertainmentAmount = expenseValues.entertainment || 0;
  const totalCuts = expenseCuts.reduce((s, c) => s + c.amount, 0) + (totalDebt > 0 ? charityExcess : 0);
  const efStrikeAmount = totalDebt > 0 ? Math.max(0, ef - totalExpenses) : 0;
  const newCashFlow = cashFlow + totalCuts;

  // ═══ HEADLINE — EXACT EXCEL A16 ═══
  let headline: string;
  if (totalIncome === 0) {
    headline = "🔴 CRITICAL: NO INCOME DETECTED — Get income source before using this tool!";
  } else if (monthsProtected === 0 && cashFlow > 5000) {
    headline = `🔴 EMERGENCY FUND CRISIS: You have ${fmt(cashFlow)}/month surplus but ZERO savings — BUILD IT NOW!`;
  } else if (totalDebt > 0 && cashFlow > totalDebt) {
    headline = `💰 YOU CAN PAY OFF ALL ${fmt(totalDebt)} DEBT TODAY WITH YOUR ${fmt(cashFlow)} MONTHLY SURPLUS — DO IT NOW!`;
  } else if (totalDebt > 0 && cashFlow > totalDebt / 3) {
    headline = `📅 YOU CAN BE DEBT-FREE IN 3 MONTHS — You have ${fmt(cashFlow)}/month to eliminate ${fmt(totalDebt)} — NO EXCUSES!`;
  } else if (totalDebt > 0 && cashFlow < 0) {
    headline = `🔴 DOUBLE EMERGENCY: RIBA (${fmt(totalDebt)}) + NEGATIVE CASH FLOW (${fmt(Math.abs(cashFlow))}/month deficit)`;
  } else if (totalDebt > 0) {
    headline = `🔴 EMERGENCY: ELIMINATE RIBA — ${fmt(totalDebt)} blocking your path to Allah's pleasure`;
  } else if (totalDebt === 0 && monthsProtected < 1 && cashFlow > 0) {
    headline = `⚠️ DANGER: Less than 1 month emergency fund — Build it NOW with your ${fmt(cashFlow)}/month surplus`;
  } else if (totalDebt === 0 && cashFlow < 0) {
    headline = `🔴 EMERGENCY: NEGATIVE CASH FLOW — You're spending ${fmt(Math.abs(cashFlow))} more than you earn — heading toward RIBA!`;
  } else if (savingsRate < 0.1) {
    headline = `⚠️ WARNING: Your ${fmtPct(savingsRate)} savings rate is below Islamic minimum 10%`;
  } else if (monthsProtected < 6) {
    headline = "📊 BUILD: Complete your 6-month fortress";
  } else {
    headline = "✅ OPTIMIZE: Ready for investment preparation";
  }

  // ═══ BATTLE PLAN TITLE — EXACT EXCEL A27 ═══
  let battlePlanTitle: string;
  if (totalIncome === 0) {
    battlePlanTitle = "⚠️ GET INCOME FIRST — Cannot create plan with zero income";
  } else if (totalDebt === 0 && monthsProtected < 3 && cashFlow > 0) {
    battlePlanTitle = "🚨 EMERGENCY FUND BUILDING REQUIRED:";
  } else if (totalDebt > 0 && cashFlow > totalDebt) {
    battlePlanTitle = "💰 IMMEDIATE ACTION: PAY OFF ALL DEBT TODAY!";
  } else if (totalDebt > 0 && cashFlow > totalDebt / 3) {
    battlePlanTitle = "📅 3-MONTH SPRINT TO FREEDOM:";
  } else if (totalDebt > 0 && savingsRate > 0.5) {
    battlePlanTitle = "💪 USE YOUR HIGH SAVINGS TO CRUSH DEBT:";
  } else if (totalDebt > 0 && cashFlow <= 0) {
    battlePlanTitle = "⚔️ SIMULTANEOUS ATTACK REQUIRED — DO ALL TODAY:";
  } else if (totalDebt > 0) {
    battlePlanTitle = "🎯 RIBA ELIMINATION PLAN:";
  } else if (cashFlow < 0) {
    battlePlanTitle = "⚠️ EMERGENCY EXPENSE CUTS REQUIRED:";
  } else if (monthsProtected < 6) {
    battlePlanTitle = "🏗️ FORTRESS BUILDING PLAN:";
  } else {
    battlePlanTitle = "🚀 INVESTMENT PREPARATION:";
  }

  // ═══ ACTION STEPS — FULL CONDITIONAL ENGINE ═══
  const actionSteps: string[] = [];

  if (totalIncome === 0) {
    actionSteps.push("Get a source of income before using this financial planning tool.");
  } else if (totalDebt === 0 && monthsProtected < 1 && cashFlow > 0) {
    // No debt, no EF, positive surplus
    actionSteps.push(`ACTION 1: Save ${fmt(Math.min(cashFlow, totalExpenses))} THIS MONTH for emergency fund (1 month protection)`);
    if (monthsProtected < 3) {
      const monthsToThree = totalExpenses > 0 ? Math.ceil((totalExpenses * 3 - ef) / Math.min(cashFlow, totalExpenses)) : 12;
      actionSteps.push(`ACTION 2: Continue saving ${fmt(Math.min(cashFlow, totalExpenses))}/month for ${monthsToThree} more months to reach 3-month protection`);
    }
  } else if (totalDebt > 0 && cashFlow > totalDebt) {
    // Can pay off all debt today
    actionSteps.push(`ACTION 1: Transfer ${fmt(totalDebt)} TODAY to pay off ALL debt. You have ${fmt(cashFlow)} available!`);
    actionSteps.push(`ACTION 2: After debt elimination, build 3-month emergency fund with your ${fmt(cashFlow)}/month surplus`);
  } else if (totalDebt > 0 && cashFlow > totalDebt / 3) {
    // Can be debt-free in 3 months
    actionSteps.push(`ACTION 1: Allocate ${fmt(Math.ceil(totalDebt / 3))}/month from your ${fmt(cashFlow)} surplus to debt elimination`);
    actionSteps.push(`ACTION 2: Target ${sortedDebts.length > 0 ? sortedDebts[0].name || "highest priority debt" : "debt"} first (highest priority score)`);
    actionSteps.push(`ACTION 3: After elimination, redirect ALL ${fmt(cashFlow)}/month to emergency fund`);
  } else if (totalDebt > 0 && cashFlow > 0) {
    // Standard riba elimination
    if (efStrikeAmount > 0) {
      actionSteps.push(`ACTION 1 — IMMEDIATE DEBT STRIKE: Transfer ${fmt(efStrikeAmount)} from emergency fund surplus to ${sortedDebts.length > 0 ? sortedDebts[0].name || "highest priority debt" : "debt"} NOW`);
    }
    actionSteps.push(`ACTION 2 — MONTHLY ALLOCATION: Direct ${fmt(cashFlow)}/month to debt elimination`);
  } else if (totalDebt > 0 && cashFlow <= 0) {
    // Double emergency: debt + negative cash flow
    actionSteps.push("ACTION 1 — CUT EXPENSES IMMEDIATELY (see cuts below)");
    actionSteps.push(`ACTION 2 — After cuts, redirect ${fmt(totalCuts)}/month to debt elimination`);
  } else if (totalDebt === 0 && cashFlow < 0) {
    // No debt but negative cash flow
    actionSteps.push("ACTION 1 — CUT EXPENSES IMMEDIATELY to stop bleeding");
  } else if (totalDebt === 0 && monthsProtected < 3 && cashFlow > 0) {
    const monthsToThree = totalExpenses > 0 ? Math.ceil((totalExpenses * 3 - ef) / cashFlow) : 12;
    actionSteps.push(`ACTION 1: Save ${fmt(cashFlow)}/month for ${monthsToThree} months to reach 3-month fortress`);
    actionSteps.push(`ACTION 2: Then continue to 6-month fortress (${fmt(totalExpenses * 6)})`);
  } else if (totalDebt === 0 && monthsProtected < 6 && cashFlow > 0) {
    const monthsToSix = totalExpenses > 0 ? Math.ceil((totalExpenses * 6 - ef) / cashFlow) : 12;
    actionSteps.push(`ACTION 1: Continue building to 6-month fortress — ${monthsToSix} months remaining`);
    actionSteps.push(`ACTION 2: Month ${Math.ceil(monthsProtected) + 1} onwards — Begin investing with full ${fmt(cashFlow)}/month surplus`);
  } else {
    actionSteps.push(`Ready for investment preparation — join TMI to begin your halal investing journey with your ${fmt(cashFlow)}/month surplus!`);
  }

  // ═══ PROJECTED IMPACT ═══
  const projectedImpact: string[] = [];
  if (totalIncome === 0) {
    projectedImpact.push("Get income first to calculate firepower");
  } else if (totalDebt > 0) {
    if (efStrikeAmount > 0) {
      const interestSaved = efStrikeAmount * (sortedDebts.length > 0 ? sortedDebts[0].apr / 100 : 0.15);
      projectedImpact.push(`Immediate benefit: Reduce principal by ${fmt(efStrikeAmount)}, saving ${fmt(interestSaved)}/year in interest`);
    }
    const firepower = Math.max(0, cashFlow) + totalCuts;
    projectedImpact.push(`Total Firepower: ${fmt(firepower)}/month (cash flow + cuts)`);
    if (cashFlow > totalDebt) {
      projectedImpact.push("Freedom date: TODAY if you pay it all now!");
    } else if (firepower > 0) {
      // Accelerated: total min payments + extra firepower
      const totalAccelPayment = totalMinPayments + firepower;
      // Use weighted average rate for NPER
      const weightedMonthlyRate = totalDebt > 0 ? totalMonthlyInterest / totalDebt : 0;
      const accelMonths = totalAccelPayment > 0
        ? (weightedMonthlyRate > 0 ? nper(weightedMonthlyRate, totalAccelPayment, totalDebt) : Math.ceil(totalDebt / totalAccelPayment))
        : 999;
      const today = new Date();
      const accelDate = new Date(today);
      accelDate.setMonth(accelDate.getMonth() + accelMonths);
      const accelStr = accelDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      // Current path: max payoff from any debt (min payments only)
      const maxPayoff = sortedDebts.reduce((mx, d) => {
        const pm = typeof d.payoffMonths === "number" ? d.payoffMonths : 999;
        return Math.max(mx, pm);
      }, 0);
      const currentDate = new Date(today);
      currentDate.setMonth(currentDate.getMonth() + maxPayoff);
      const currentStr = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      projectedImpact.push(`Freedom date: ${accelStr} (accelerated) vs ${currentStr} (current minimum payments)`);
    }
  } else if (totalDebt === 0 && monthsProtected < 3 && cashFlow > 0) {
    projectedImpact.push(`Total Firepower: ${fmt(cashFlow)}/month toward fortress`);
  } else if (cashFlow < 0) {
    projectedImpact.push(`Total Firepower: ${fmt(totalCuts)}/month from expense cuts`);
  } else {
    projectedImpact.push(`Total Firepower: ${fmt(cashFlow)}/month (cash flow + cuts)`);
  }

  // ═══ WHAT-IF PROJECTION ═══
  let whatIfProjection: string;
  if (totalDebt > 0 && cashFlow > totalDebt) {
    whatIfProjection = `Current IIRS: ${Math.round(iirsScore)} → After Plan: 95 (Investment Ready at 70+)`;
  } else if (totalDebt > 0) {
    whatIfProjection = `Current IIRS: ${Math.round(iirsScore)} → After debt elimination + 3-month EF: 75+ (Investment Ready)`;
  } else if (totalDebt === 0 && monthsProtected < 3) {
    whatIfProjection = `Current IIRS: ${Math.round(iirsScore)} → After 3-month emergency fund: 70+ (Investment Ready)`;
  } else if (cashFlow < 0) {
    whatIfProjection = `Current IIRS: ${Math.round(iirsScore)} → After fixing cash flow: ${Math.min(100, Math.round(iirsScore + 20))}`;
  } else {
    whatIfProjection = `Current IIRS: ${Math.round(iirsScore)} → Potential: ${Math.min(100, Math.round(iirsScore + 10))}`;
  }

  // ═══ ISLAMIC REALITY CHECK — only if has debt ═══
  const islamicRealityCheck: string[] = [];
  if (totalDebt > 0) {
    if (cashFlow > totalDebt) {
      islamicRealityCheck.push("You're keeping riba when you can eliminate it TODAY — this is WORSE than being trapped in it!");
    } else if (cashFlow < 0) {
      islamicRealityCheck.push(`You are losing ${fmt(totalMonthlyInterest)}/month to riba — money that could support your family or charity.`);
      islamicRealityCheck.push("With negative cash flow, you're heading toward MORE riba. This spiral must stop TODAY.");
    } else {
      islamicRealityCheck.push(`Every day of delay costs you ${fmt(totalMonthlyInterest / 30)} in riba. That's ${fmt(totalMonthlyInterest)}/month flowing to interest instead of your family, your Sadaqah, or your Akhirah.`);
    }
    islamicRealityCheck.push("The Prophet ♂ said: 'Riba has 70 levels, the least of which is like a man committing fornication with his own mother.'");
    islamicRealityCheck.push("Execute this plan immediately. Your financial AND spiritual health depend on it.");
  }

  // ═══ RIBA ELIMINATION STRATEGY — only if has debt ═══
  let ribaStrategy: ComputedResult["ribaStrategy"] = null;
  if (totalDebt > 0) {
    // Freedom date
    let freedomDate: string;
    if (cashFlow > totalDebt) {
      freedomDate = "TODAY if you pay it all now!";
    } else {
      const maxPayoff = sortedDebts.reduce((mx, d) => {
        const pm = typeof d.payoffMonths === "number" ? d.payoffMonths : 360;
        return Math.max(mx, pm);
      }, 0);
      const fd = new Date();
      fd.setMonth(fd.getMonth() + maxPayoff);
      freedomDate = fd.toLocaleDateString("en-US", { month: "long", year: "numeric" }) + " (current minimum payments)";
    }

    const priorityTarget = sortedDebts.length > 0
      ? `${sortedDebts[0].name || "Debt 1"} (APR: ${sortedDebts[0].apr.toFixed(1)}%)`
      : "No priority target";

    const activeCount = sortedDebts.length;
    const hasHighApr = sortedDebts.some(d => d.apr > 15);
    const method = activeCount > 5 ? "SNOWBALL: Attack smallest balance first for quick wins"
      : hasHighApr ? "AVALANCHE: Attack highest APR to minimize total interest"
      : "HYBRID: Combines quick wins with APR optimization";

    // Current path interest estimate
    const maxPayoffMonths = sortedDebts.reduce((mx, d) => Math.max(mx, typeof d.payoffMonths === "number" ? d.payoffMonths : 120), 0);
    const totalInterestEst = totalMonthlyInterest * maxPayoffMonths;
    const currentPath = `Minimum payments only = ${fmt(totalInterestEst)} total interest over loan terms`;

    // Accelerated path
    const firepower = Math.max(0, cashFlow) + totalCuts;
    const totalAccelPay = totalMinPayments + firepower;
    let acceleratedPath: string;
    if (cashFlow > totalDebt) {
      acceleratedPath = `Pay ALL debt TODAY with your ${fmt(cashFlow)} monthly surplus!`;
    } else if (totalAccelPay > 0) {
      const weightedRate = totalDebt > 0 ? totalMonthlyInterest / totalDebt : 0;
      const months = totalAccelPay > 0
        ? (weightedRate > 0 ? nper(weightedRate, totalAccelPay, totalDebt) : Math.ceil(totalDebt / totalAccelPay))
        : 999;
      acceleratedPath = `With ${fmt(firepower)} extra/month = Freedom in ${months} months!`;
    } else {
      acceleratedPath = "Cut expenses first to create firepower for debt elimination";
    }

    // Islamic duty
    let islamicDuty: string;
    if (cashFlow > totalDebt) {
      islamicDuty = "You're choosing to keep riba when you can eliminate it TODAY. This is INEXCUSABLE!";
    } else {
      islamicDuty = `Every day = spiritual harm. ${fmt(totalMonthlyInterest / 30)}/day flowing to interest. Execute the plan NOW.`;
    }

    ribaStrategy = { freedomDate, priorityTarget, method, currentPath, acceleratedPath, islamicDuty };
  }

  // ═══ CLOSING MESSAGE ═══
  let closingMessage: string;
  if (crisisLabel === "INVESTMENT READY") {
    closingMessage = `Alhamdulillah, ${userName} — you have built a strong foundation. You are ready to begin your halal investment journey. Join the TMI community to take the next step with your brothers and sisters.`;
  } else if (crisisLabel === "PROGRESSING" || crisisLabel === "BUILDING") {
    closingMessage = `${userName}, you are on the right path. The fact that you completed this assessment shows you care about your Akhirah. Follow the action plan above, and revisit this Compass in 30 days to see your progress. You are not alone in this journey.`;
  } else {
    closingMessage = `${userName}, this is your wake-up call. The numbers above are not meant to shame you — they are meant to FREE you. Every single day you delay is a day your wealth works against your Akhirah. Take ACTION 1 today. Not tomorrow. Today. And when you're ready, the TMI community is here to walk this path with you.`;
  }

  return {
    totalIncome, totalExpenses, cashFlow, savingsRate,
    totalDebt, debtCalcs, sortedDebts, debtPaymentsExclMortgage, totalMonthlyInterest, totalMinPayments,
    peerAverages, differences, overspendCount, expenseValues,
    ef, monthsProtected,
    iirsScore, ribaScore, efScore, expenseScore, savingsScore,
    ribaStatus, efStatus, expenseStatus, savingsStatus,
    crisisLabel, milestones,
    headline, battlePlanTitle, actionSteps, expenseCuts, totalCuts, charityExcess, efStrikeAmount, newCashFlow,
    projectedImpact, whatIfProjection, islamicRealityCheck, ribaStrategy, closingMessage,
  };
}

// ─── WEBHOOK — fire-and-forget to Google Sheets ─────────────────────────
async function sendToWebhook(state: AppState, computed: ComputedResult) {
  const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: state.userInfo.name,
        email: state.userInfo.email,
        location: state.demographics.location,
        ageRange: state.demographics.ageRange,
        incomeRange: state.demographics.incomeRange,
        iisr_score: Math.round(computed.iirsScore),
        iisr_status: computed.crisisLabel,
        riba_score: Math.round(computed.ribaScore),
        ef_score: Math.round(computed.efScore),
        expense_score: Math.round(computed.expenseScore),
        savings_score: Math.round(computed.savingsScore),
        total_income: Math.round(computed.totalIncome),
        total_expenses: Math.round(computed.totalExpenses),
        cash_flow: Math.round(computed.cashFlow),
        savings_rate: parseFloat(computed.savingsRate.toFixed(3)),
        total_debt: Math.round(computed.totalDebt),
        monthly_interest: Math.round(computed.totalMonthlyInterest),
        emergency_fund: Math.round(computed.ef),
        months_protected: parseFloat(computed.monthsProtected.toFixed(1)),
        riba_free: computed.totalDebt === 0,
        investment_ready: computed.iirsScore >= 70 && computed.monthsProtected >= 3 && computed.totalDebt === 0,
      }),
    });
  } catch {
    // fire-and-forget — never block user
  }
}

// ─── PDF EXPORT — COMPREHENSIVE MULTI-PAGE REPORT ───────────────────────
async function generatePDF(computed: ComputedResult, userName: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  const contentW = w - margin * 2;
  let y = 0;

  function checkPage(needed: number) {
    if (y + needed > pageH - 25) {
      doc.addPage();
      y = 20;
    }
  }

  function sectionTitle(text: string) {
    checkPage(20);
    y += 6;
    doc.setFillColor(239, 242, 228);
    doc.rect(margin, y - 4, contentW, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(52, 56, 64);
    doc.text(text, margin + 4, y + 3);
    y += 14;
  }

  function bodyText(text: string, color?: number[]) {
    checkPage(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const c = color || [52, 56, 64];
    doc.setTextColor(c[0], c[1], c[2]);
    const lines = doc.splitTextToSize(text, contentW - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4.5 + 2;
  }

  function boldText(text: string, color?: number[]) {
    checkPage(8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const c = color || [52, 56, 64];
    doc.setTextColor(c[0], c[1], c[2]);
    const lines = doc.splitTextToSize(text, contentW - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4.5 + 2;
  }

  // ── HEADER ──
  doc.setFillColor(53, 140, 108);
  doc.rect(0, 0, w, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("THE MUSLIM INVESTOR", w / 2, 15, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Akhirah Financial Compass — Personal IIRS Report", w / 2, 25, { align: "center" });
  doc.setFontSize(8);
  doc.text(`Prepared for ${userName} — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, w / 2, 32, { align: "center" });
  y = 44;

  // ── SCORE ──
  const sc = computed.iirsScore >= 70 ? [53, 140, 108] : computed.iirsScore >= 40 ? [245, 158, 11] : [220, 38, 38];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(sc[0], sc[1], sc[2]);
  doc.text(String(Math.round(computed.iirsScore)), w / 2, y + 6, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(108, 113, 115);
  doc.text("ISLAMIC INVESTMENT READINESS SCORE (out of 100)", w / 2, y + 13, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(sc[0], sc[1], sc[2]);
  doc.setFont("helvetica", "bold");
  doc.text(computed.crisisLabel, w / 2, y + 21, { align: "center" });
  y += 30;

  // ── SCORE BREAKDOWN ──
  sectionTitle("SCORE BREAKDOWN");
  const scores = [
    { label: "Riba Elimination", score: computed.ribaScore, max: 40, status: computed.ribaStatus },
    { label: "Emergency Fund", score: computed.efScore, max: 25, status: computed.efStatus },
    { label: "Expense Control", score: computed.expenseScore, max: 20, status: computed.expenseStatus },
    { label: "Savings Rate", score: computed.savingsScore, max: 15, status: computed.savingsStatus },
  ];
  scores.forEach(s => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(52, 56, 64);
    doc.text(`${s.label}: ${Math.round(s.score)}/${s.max} — ${s.status}`, margin + 2, y);
    const barX = margin + 2;
    y += 3;
    doc.setFillColor(239, 242, 228);
    doc.roundedRect(barX, y, contentW - 4, 3, 1.5, 1.5, "F");
    const pct = s.score / s.max;
    const bc = s.status === "COMPLETE" || s.status === "STRONG" || s.status === "EXCELLENT" || s.status === "ON TARGET"
      ? [53, 140, 108] : s.status === "CRUSHING" || s.status === "WEAK" || s.status === "POOR" || s.status === "UNACCEPTABLE"
      ? [220, 38, 38] : [245, 158, 11];
    doc.setFillColor(bc[0], bc[1], bc[2]);
    doc.roundedRect(barX, y, Math.max((contentW - 4) * pct, 2), 3, 1.5, 1.5, "F");
    y += 8;
  });

  // ── CURRENT SITUATION ──
  sectionTitle("CURRENT SITUATION");
  boldText(`Dear ${userName},`);
  bodyText(`Income: ${fmt(computed.totalIncome)}/month`);
  bodyText(`Expenses: ${fmt(computed.totalExpenses)}/month`);
  bodyText(`Cash Flow: ${fmt(computed.cashFlow)}/month (${fmtPct(computed.savingsRate)} savings rate)`, computed.cashFlow >= 0 ? [53, 140, 108] : [220, 38, 38]);
  if (computed.totalDebt > 0) {
    bodyText(`Total Debt: ${fmt(computed.totalDebt)} (Interest: ${fmt(computed.totalMonthlyInterest)}/month)`, [220, 38, 38]);
  } else {
    bodyText("Debt-Free: Alhamdulillah!", [53, 140, 108]);
  }
  bodyText(`Emergency Fund: ${fmt(computed.ef)} (${computed.monthsProtected.toFixed(1)} months protection)`);

  // ── ACTION PLAN ──
  sectionTitle("YOUR PERSONALIZED ACTION PLAN");
  boldText(computed.headline, computed.headline.includes("✅") ? [53, 140, 108] : [220, 38, 38]);
  y += 2;
  boldText(computed.battlePlanTitle);
  computed.actionSteps.forEach(step => bodyText(step));
  if (computed.expenseCuts.length > 0 && (computed.totalDebt > 0 || computed.cashFlow < 0)) {
    y += 2;
    boldText("EMERGENCY EXPENSE CUTS:");
    computed.expenseCuts.forEach(cut => bodyText(`  • ${cut.category}: CUT ${fmt(cut.amount)}`));
    if (computed.charityExcess > 0) {
      bodyText(`  • CHARITY: Reduce to 2.5% = Save ${fmt(computed.charityExcess)} (until riba eliminated)`);
    }
  }

  // ── PROJECTED IMPACT ──
  sectionTitle("PROJECTED IMPACT");
  computed.projectedImpact.forEach(line => bodyText(line));
  y += 2;
  boldText("WHAT-IF PROJECTION:");
  bodyText(computed.whatIfProjection, [53, 140, 108]);

  // ── ISLAMIC REALITY CHECK ──
  if (computed.islamicRealityCheck.length > 0) {
    sectionTitle("ISLAMIC REALITY CHECK");
    computed.islamicRealityCheck.forEach(line => bodyText(line, [220, 38, 38]));
  }

  // ── RIBA STRATEGY ──
  if (computed.ribaStrategy) {
    sectionTitle("RIBA ELIMINATION STRATEGY");
    boldText(`FREEDOM DATE: ${computed.ribaStrategy.freedomDate}`);
    bodyText(`Priority Target: ${computed.ribaStrategy.priorityTarget}`);
    bodyText(`Elimination Method: ${computed.ribaStrategy.method}`);
    bodyText(`Current Path: ${computed.ribaStrategy.currentPath}`);
    boldText(`Accelerated Path: ${computed.ribaStrategy.acceleratedPath}`, [53, 140, 108]);
    y += 2;
    boldText(`YOUR ISLAMIC DUTY: ${computed.ribaStrategy.islamicDuty}`, [220, 38, 38]);
  }

  // ── PROGRESS TRACKER ──
  sectionTitle("PROGRESS TRACKER");
  computed.milestones.forEach(m => {
    const icon = m.achieved ? "YES" : "NO ";
    const c = m.achieved ? [53, 140, 108] : [108, 113, 115];
    bodyText(`${icon}  ${m.label}`, c);
  });

  // ── CLOSING MESSAGE ──
  checkPage(30);
  y += 4;
  doc.setFillColor(239, 242, 228);
  doc.roundedRect(margin, y, contentW, 28, 3, 3, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(52, 56, 64);
  const closingLines = doc.splitTextToSize(computed.closingMessage, contentW - 10);
  doc.text(closingLines, margin + 5, y + 8);
  y += 36;

  // ── FOOTER on every page ──
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(52, 56, 64);
    doc.rect(0, pageH - 12, w, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("themuslim-investor.com/tools/compass — Your data stays private. Generated locally in your browser.", w / 2, pageH - 5, { align: "center" });
  }

  doc.save(`TMI-IIRS-Report-${userName.replace(/\s+/g, "-")}.pdf`);
}

// ─── WHATSAPP & SHARE ───────────────────────────────────────────────────
function shareWhatsApp(score: number) {
  const text = encodeURIComponent(
    `Bismillah — I just discovered my Islamic Investment Readiness Score: ${score}/100\n\nFind yours at themuslim-investor.com/tools/compass\n\nThe Muslim Investor — Akhirah-First Wealth Building`
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

function shareNative(score: number) {
  if (navigator.share) {
    navigator.share({
      title: "My Islamic Investment Readiness Score",
      text: `Bismillah — My IIRS is ${score}/100. Discover yours at themuslim-investor.com/tools/compass`,
      url: "https://themuslim-investor.com/tools/compass",
    }).catch(() => {});
  } else {
    shareWhatsApp(score);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function IIRSGauge({ score, label, noIncome }: { score: number; label: string; noIncome: boolean }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 90;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1500;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const gaugeColor = noIncome ? V.dimGray : score >= 70 ? V.viridian : score >= 40 ? V.amber : V.red;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={radius} fill="none" stroke={V.ivory} strokeWidth={stroke} />
        <circle cx="110" cy="110" r={radius} fill="none" stroke={gaugeColor} strokeWidth={stroke}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 110 110)" style={{ transition: "stroke-dashoffset 0.1s ease" }} />
        <text x="110" y="100" textAnchor="middle" style={{ fontFamily:"Poppins", fontWeight:900, fontSize: noIncome ? "28px" : "56px", fill: gaugeColor }}>
          {noIncome ? "—" : animatedScore}
        </text>
        <text x="110" y="125" textAnchor="middle" style={{ fontFamily:"Poppins", fontWeight:400, fontSize:"13px", fill: V.dimGray }}>
          out of 100
        </text>
      </svg>
      <div style={{ padding:"6px 20px", borderRadius:"20px",
        background: noIncome ? V.redBg : score >= 70 ? V.viridianBg : score >= 40 ? V.amberBg : V.redBg,
        color: gaugeColor, fontFamily:"Poppins", fontWeight:600, fontSize:"13px", letterSpacing:"0.5px" }}>
        {label}
      </div>
    </div>
  );
}

function ScoreBar({ label, score, max, status }: { label: string; score: number; max: number; status: string }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const barColor = status === "COMPLETE" || status === "STRONG" || status === "EXCELLENT" || status === "ON TARGET"
    ? V.viridian : status === "MANAGEABLE" || status === "BUILDING" || status === "GOOD" || status === "LOW"
    ? V.amber : V.red;
  return (
    <div style={{ marginBottom:"16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px", fontFamily:"Poppins" }}>
        <span style={{ fontWeight:600, fontSize:"14px", color: V.onyx }}>{label}</span>
        <span style={{ fontSize:"13px", color: V.dimGray }}>{Math.round(score)}/{max} — <span style={{ color: barColor, fontWeight:600 }}>{status}</span></span>
      </div>
      <div style={{ height:"10px", borderRadius:"5px", background: V.ivory, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:"5px", background: barColor, transition:"width 1s ease" }} />
      </div>
    </div>
  );
}

function CurrencyInput({ label, value, onChange, placeholder, sublabel }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; sublabel?: string;
}) {
  return (
    <div style={{ marginBottom:"16px" }}>
      <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"4px" }}>{label}</label>
      {sublabel && <span style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray }}>{sublabel}</span>}
      <div style={{ display:"flex", alignItems:"center", marginTop:"4px" }}>
        <span style={{ padding:"12px 14px", background: V.ivory, borderRadius:"8px 0 0 8px",
          border:`1px solid ${V.cambridge}`, borderRight:"none", fontFamily:"Poppins", fontWeight:600, color: V.dimGray, fontSize:"15px" }}>$</span>
        <input type="number" inputMode="decimal" min="0" value={value || ""} onChange={e => onChange(e.target.value)}
          placeholder={placeholder || "0"}
          style={{ flex:1, padding:"12px 14px", border:`1px solid ${V.cambridge}`, borderRadius:"0 8px 8px 0",
            fontFamily:"Poppins", fontSize:"15px", outline:"none", color: V.onyx, background: V.white }} />
      </div>
    </div>
  );
}

function SelectInput({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div style={{ marginBottom:"16px" }}>
      <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width:"100%", padding:"12px 14px", border:`1px solid ${V.cambridge}`, borderRadius:"8px",
          fontFamily:"Poppins", fontSize:"15px", outline:"none", color: V.onyx, background: V.white, cursor:"pointer" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  return (
    <div style={{ marginBottom:"16px" }}>
      <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>{label}</label>
      <input type="number" inputMode="numeric" min={min || 0} max={max || 99}
        value={value} onChange={e => onChange(parseInt(e.target.value) || 0)}
        style={{ width:"100%", padding:"12px 14px", border:`1px solid ${V.cambridge}`, borderRadius:"8px",
          fontFamily:"Poppins", fontSize:"15px", outline:"none", color: V.onyx, background: V.white, boxSizing:"border-box" }} />
    </div>
  );
}

// Card wrapper for results sections
function ResultCard({ children, accent }: { children: React.ReactNode; accent?: "red" | "amber" | "green" | "neutral" }) {
  const bg = accent === "red" ? V.redBg : accent === "amber" ? V.amberBg : accent === "green" ? V.viridianBg : V.white;
  const border = accent === "red" ? `${V.red}25` : accent === "amber" ? `${V.amber}25` : accent === "green" ? `${V.viridian}25` : V.ivory;
  return (
    <div style={{ background: bg, borderRadius:"16px", padding:"24px", border:`1px solid ${border}`, marginBottom:"20px" }}>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily:"Poppins", fontWeight:700, fontSize:"16px", color: V.onyx, marginBottom:"16px", display:"flex", alignItems:"center", gap:"8px" }}>
      {children}
    </h3>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const [showScoring, setShowScoring] = useState(false);

  return (
    <div style={{ textAlign:"center", maxWidth:"640px", margin:"0 auto", padding:"20px 0" }}>
      <p style={{ fontFamily:"'Amiri', serif", fontSize:"26px", color: V.viridian, marginBottom:"8px", lineHeight:1.4 }}>
        {"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
      </p>
      <h1 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"clamp(28px,5vw,42px)", color: V.onyx, margin:"20px 0 8px", lineHeight:1.15 }}>
        THE TMI AKHIRAH<br/>FINANCIAL COMPASS
      </h1>
      <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.viridian, marginBottom:"32px" }}>
        From Financial Chaos to Funding Your Good Deeds
      </p>
      <div style={{ background: V.ivory, borderRadius:"16px", padding:"28px 24px", textAlign:"left", marginBottom:"24px", border:`1px solid ${V.viridianLight}` }}>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7, marginBottom:"16px" }}>
          The wealth you hold is an <strong>Amanah</strong> — a sacred trust from Allah. On the Day of Judgment, you will be asked how you earned it and how you spent it.
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7, marginBottom:"16px" }}>
          This Compass produces your <strong>Islamic Investment Readiness Score (IIRS)</strong> out of 100. It measures whether your financial foundation is solid enough to begin halal investing.
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7 }}>
          Built on three non-negotiable pillars: <strong>Zero Riba</strong>, a <strong>Financial Fortress</strong> (emergency fund), and a <strong>Strong Savings Rate</strong>.
        </p>
      </div>

      {/* Scoring Explanation */}
      <div style={{ textAlign:"left", marginBottom:"24px" }}>
        <button onClick={() => setShowScoring(!showScoring)} style={{ background:"none", border:"none", cursor:"pointer",
          fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.viridian, padding:"8px 0", display:"flex", alignItems:"center", gap:"6px" }}>
          {showScoring ? "▼" : "▶"} How is my score calculated?
        </button>
        {showScoring && (
          <div style={{ background: V.white, borderRadius:"12px", padding:"20px", border:`1px solid ${V.viridianLight}`, marginTop:"8px" }}>
            <p style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx, lineHeight:1.7, marginBottom:"12px" }}>
              Your IIRS is scored out of 100 across four components:
            </p>
            {[
              { title: "Riba Elimination (40 points max)", desc: "Are you free from interest-bearing debt? Zero Riba = full marks. The more debt relative to your income, the lower your score. This is the heaviest component because Riba is the heaviest sin in Islamic finance." },
              { title: "Emergency Fund (25 points max)", desc: "How many months of expenses can you survive without income? 6+ months = full marks. Less than 1 month = minimum marks. You cannot invest money you might need tomorrow." },
              { title: "Expense Control (20 points max)", desc: "Are you living within your means compared to Muslims in your demographic? Each category where you overspend costs you points. Discipline is the foundation of wealth." },
              { title: "Savings Rate (15 points max)", desc: "What percentage of your income are you saving? 20%+ = full marks. Below 10% = zero. The Islamic minimum target is 10%." },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom:"10px" }}>
                <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.viridian, marginBottom:"2px" }}>{item.title}</p>
                <p style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray, lineHeight:1.6 }}>{item.desc}</p>
              </div>
            ))}
            <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.onyx, marginTop:"8px" }}>
              Investment Readiness requires: IIRS 70+, zero Riba, and 3+ months emergency fund.
            </p>
          </div>
        )}
      </div>

      <div style={{ background: V.white, borderRadius:"12px", padding:"20px", border:`1px solid ${V.viridianLight}`, marginBottom:"24px", textAlign:"left" }}>
        <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"13px", color: V.viridian, marginBottom:"12px", letterSpacing:"1px" }}>
          🔒 YOUR DATA STAYS WITH YOU
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"13px", color: V.dimGray, lineHeight:1.6 }}>
          All calculations happen in your browser. Your financial data never leaves your device. Zero servers. Zero databases. Complete privacy.
        </p>
      </div>

      {/* Disclaimers */}
      <div style={{ textAlign:"left", marginBottom:"32px" }}>
        <p style={{ fontFamily:"Poppins", fontSize:"10px", color: V.dimGray, lineHeight:1.6, marginBottom:"8px" }}>
          <strong>Important:</strong> This tool provides educational guidance based on Islamic finance principles. It is not personalized financial advice. Consult a qualified Islamic financial advisor for decisions specific to your situation. The Muslim Investor is an educational platform — not a licensed financial advisory service. All peer benchmarks are approximate averages and may not reflect your specific circumstances.
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"10px", color: V.dimGray, lineHeight:1.6 }}>
          <strong>Privacy:</strong> Your financial data is calculated entirely in your browser and never stored on our servers. We collect only your name, email, and summary results (IIRS score, component scores, and key financial metrics) to personalize your experience and send you your report. <strong>We will never sell, share, or distribute your personal data to any external third party.</strong> Your information is used solely by The Muslim Investor to serve you.
        </p>
      </div>

      <button onClick={onNext} style={{ background: V.viridian, color: V.white, border:"none", padding:"16px 48px", borderRadius:"12px",
        fontFamily:"Poppins", fontWeight:600, fontSize:"17px", cursor:"pointer", letterSpacing:"0.3px", boxShadow:`0 4px 14px ${V.viridian}40` }}>
        Begin Your Assessment →
      </button>
    </div>
  );
}

function RegistrationStep({ userInfo, setUserInfo }: {
  userInfo: UserInfo; setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}) {
  return (
    <div style={{ maxWidth:"480px", margin:"0 auto" }}>
      <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"4px" }}>Before We Begin</h2>
      <p style={{ fontFamily:"Poppins", fontSize:"14px", color: V.dimGray, marginBottom:"28px" }}>
        Your name personalizes your report. Your email delivers your PDF. We will never sell or share your data with any third party.
      </p>
      <div style={{ marginBottom:"16px" }}>
        <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>Full Name</label>
        <input type="text" value={userInfo.name} onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g. Mohammed Al-Farsi"
          style={{ width:"100%", padding:"14px 16px", border:`1px solid ${V.cambridge}`, borderRadius:"10px",
            fontFamily:"Poppins", fontSize:"16px", outline:"none", color: V.onyx, background: V.white, boxSizing:"border-box" }} />
      </div>
      <div style={{ marginBottom:"16px" }}>
        <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>Email Address</label>
        <input type="email" value={userInfo.email} onChange={e => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
          placeholder="you@example.com"
          style={{ width:"100%", padding:"14px 16px", border:`1px solid ${V.cambridge}`, borderRadius:"10px",
            fontFamily:"Poppins", fontSize:"16px", outline:"none", color: V.onyx, background: V.white, boxSizing:"border-box" }} />
      </div>
      <p style={{ fontFamily:"Poppins", fontSize:"11px", color: V.dimGray, lineHeight:1.6 }}>
        🔒 Your information is used solely by The Muslim Investor. We will never sell, share, or distribute your data.
      </p>
    </div>
  );
}

function DemographicsStep({ demographics, setDemographics }: {
  demographics: Demographics; setDemographics: React.Dispatch<React.SetStateAction<Demographics>>;
}) {
  const set = (k: keyof Demographics, v: string | number) => setDemographics(prev => ({ ...prev, [k]: v }));
  return (
    <div style={{ maxWidth:"560px", margin:"0 auto" }}>
      <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"4px" }}>Your Profile</h2>
      <p style={{ fontFamily:"Poppins", fontSize:"14px", color: V.dimGray, marginBottom:"28px" }}>
        This helps us compare your finances with Muslims in your demographic.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 20px" }}>
        <SelectInput label="Location" value={demographics.location} onChange={v => set("location", v)} options={LOCATIONS} />
        <SelectInput label="Age Range" value={demographics.ageRange} onChange={v => set("ageRange", v)} options={AGE_RANGES} />
        <SelectInput label="Education" value={demographics.education} onChange={v => set("education", v)} options={EDUCATION_LEVELS} />
        <SelectInput label="Employment" value={demographics.employment} onChange={v => set("employment", v)} options={EMPLOYMENT_TYPES} />
        <NumberInput label="Adults in Household" value={demographics.adults} onChange={v => set("adults", v)} min={1} max={6} />
        <NumberInput label="Children" value={demographics.children} onChange={v => set("children", v)} min={0} max={10} />
      </div>
      <SelectInput label="Annual Income Range" value={demographics.incomeRange} onChange={v => set("incomeRange", v)} options={INCOME_RANGES} />
    </div>
  );
}

function MizanStep({ income, setIncome, expenses, setExpenses, computed }: {
  income: Income; setIncome: React.Dispatch<React.SetStateAction<Income>>;
  expenses: Expenses; setExpenses: React.Dispatch<React.SetStateAction<Expenses>>;
  computed: ComputedResult;
}) {
  const setInc = (k: keyof Income, v: string) => setIncome(prev => ({ ...prev, [k]: v }));
  const setExp = (k: string, v: string) => setExpenses(prev => ({ ...prev, [k]: v }));
  const { totalIncome, totalExpenses, cashFlow, savingsRate, peerAverages, differences, totalDebt, ef, monthsProtected } = computed;

  return (
    <div style={{ maxWidth:"640px", margin:"0 auto" }}>
      <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"4px" }}>Your Mizan — Islamic Budget</h2>
      <p style={{ fontFamily:"Poppins", fontSize:"14px", color: V.dimGray, marginBottom:"24px" }}>
        Enter your monthly income and expenses. Peer averages are calculated based on your demographic profile.
      </p>
      <div style={{ background: V.ivory, borderRadius:"12px", padding:"20px", marginBottom:"24px" }}>
        <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.viridian, marginBottom:"16px" }}>Monthly Income</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
          <CurrencyInput label="Primary Job (after tax)" value={income.primary} onChange={v => setInc("primary", v)} />
          <CurrencyInput label="Spouse Income" value={income.spouse} onChange={v => setInc("spouse", v)} />
          <CurrencyInput label="Business/Side Income" value={income.business} onChange={v => setInc("business", v)} />
          <CurrencyInput label="Investment Income (Halal)" value={income.investment} onChange={v => setInc("investment", v)} />
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 0", borderTop:`1px solid ${V.cambridge}40`, fontFamily:"Poppins" }}>
          <span style={{ fontWeight:600, color: V.onyx }}>Total Income</span>
          <span style={{ fontWeight:900, fontSize:"18px", color: V.viridian }}>{fmt(totalIncome)}</span>
        </div>
        {totalIncome === 0 && (
          <p style={{ fontFamily:"Poppins", fontSize:"13px", color: V.amber, marginTop:"8px", fontWeight:600 }}>
            ⚠️ Zero income detected — enter income or use 6-month average if variable
          </p>
        )}
      </div>

      <div style={{ background: V.white, borderRadius:"12px", padding:"20px", border:`1px solid ${V.ivory}` }}>
        <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.viridian, marginBottom:"8px" }}>Monthly Expenses</h3>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:"4px 12px", alignItems:"end", marginBottom:"8px" }}>
          <span style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray, fontWeight:600 }}>Category</span>
          <span style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray, fontWeight:600, width:"80px", textAlign:"right" }}>Peer Avg</span>
          <span style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray, fontWeight:600, width:"80px", textAlign:"right" }}>Difference</span>
        </div>
        {EXPENSE_CATEGORIES.map(cat => {
          const pa = peerAverages[cat.key] || 0;
          const diff = differences[cat.key] || 0;
          const diffColor = diff > 0 ? V.red : diff < 0 ? V.viridian : V.dimGray;
          return (
            <div key={cat.key} style={{ display:"grid", gridTemplateColumns:"1fr auto auto", gap:"4px 12px", alignItems:"center", marginBottom:"6px" }}>
              <CurrencyInput label={cat.label} value={expenses[cat.key] || ""} onChange={v => setExp(cat.key, v)} />
              <div style={{ width:"80px", textAlign:"right", fontFamily:"Poppins", fontSize:"13px", color: V.dimGray, paddingBottom:"16px" }}>
                {pa > 0 ? fmt(pa) : "—"}
              </div>
              <div style={{ width:"80px", textAlign:"right", fontFamily:"Poppins", fontSize:"13px", color: diffColor, fontWeight:600, paddingBottom:"16px" }}>
                {pa > 0 ? (diff > 0 ? "+" : "") + fmt(diff) : "—"}
              </div>
            </div>
          );
        })}
        <div style={{ borderTop:`2px solid ${V.onyx}20`, paddingTop:"16px", marginTop:"8px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"8px" }}>
            <span style={{ fontWeight:600 }}>Total Expenses</span>
            <span style={{ fontWeight:900, fontSize:"18px", color: V.onyx }}>{fmt(totalExpenses)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"8px" }}>
            <span style={{ fontWeight:600 }}>Monthly Cash Flow</span>
            <span style={{ fontWeight:900, fontSize:"18px", color: cashFlow >= 0 ? V.viridian : V.red }}>{cashFlow < 0 ? "-" : ""}{fmt(cashFlow)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"Poppins" }}>
            <span style={{ fontWeight:600 }}>Savings Rate</span>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <span style={{ fontWeight:900, fontSize:"18px", color: savingsRate >= 0.1 ? V.viridian : V.red }}>{fmtPct(savingsRate)}</span>
              <span style={{ padding:"4px 10px", borderRadius:"6px", fontSize:"12px", fontWeight:600,
                background: savingsRate >= 0.1 ? V.viridianBg : V.redBg, color: savingsRate >= 0.1 ? V.viridian : V.red }}>
                {savingsRate >= 0.1 ? "✓ Achieved" : "UNACCEPTABLE!"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline warnings */}
      {totalDebt > 0 && computed.expenseValues.charity > totalIncome * 0.025 && (
        <div style={{ marginTop:"16px", padding:"14px", borderRadius:"10px", background: V.amberBg, border:`1px solid ${V.amber}30` }}>
          <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.onyx }}>
            ⚠️ CHARITY WARNING: Reduce to 2.5% minimum until riba eliminated (Save {fmt(computed.expenseValues.charity - totalIncome * 0.025)}/month)
          </p>
        </div>
      )}
      {cashFlow > 5000 && monthsProtected === 0 && totalIncome > 0 && (
        <div style={{ marginTop:"16px", padding:"14px", borderRadius:"10px", background: V.redBg, border:`1px solid ${V.red}30` }}>
          <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.red }}>
            🚨 CRITICAL: You have {fmt(cashFlow)}/month surplus but ZERO emergency fund — BUILD IT NOW!
          </p>
        </div>
      )}
    </div>
  );
}

function DebtStep({ debts, setDebts, computed }: {
  debts: Debt[]; setDebts: React.Dispatch<React.SetStateAction<Debt[]>>; computed: ComputedResult;
}) {
  const [noDebt, setNoDebt] = useState(false);
  const addDebt = () => setDebts(prev => [...prev, { name:"", type:"Credit Card", balance:"", apr:"", minPayment:"", extraPayment:"", remainingTerm:"" }]);
  const removeDebt = (i: number) => setDebts(prev => prev.filter((_, idx) => idx !== i));
  const updateDebt = (i: number, field: keyof Debt, val: string) => setDebts(prev => prev.map((d, idx) => idx === i ? { ...d, [field]: val } : d));

  if (noDebt) {
    return (
      <div style={{ maxWidth:"560px", margin:"0 auto", textAlign:"center" }}>
        <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"4px" }}>Riba Purification Accelerator</h2>
        <p style={{ fontFamily:"Poppins", fontSize:"14px", color: V.dimGray, fontStyle:"italic", marginBottom:"32px" }}>
          &ldquo;And Allah has permitted trade and forbidden Riba&rdquo; — Quran 2:275
        </p>
        <div style={{ background: V.viridianBg, borderRadius:"16px", padding:"40px", border:`2px solid ${V.viridian}` }}>
          <div style={{ fontSize:"48px", marginBottom:"12px" }}>🎉</div>
          <h3 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"22px", color: V.viridian, marginBottom:"8px" }}>Alhamdulillah — You are Riba-Free!</h3>
          <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx }}>Stay vigilant and never return to Riba. Your path is clear.</p>
        </div>
        <button onClick={() => setNoDebt(false)} style={{ marginTop:"20px", background:"transparent", border:`1px solid ${V.dimGray}`,
          padding:"10px 24px", borderRadius:"8px", fontFamily:"Poppins", fontSize:"13px", color: V.dimGray, cursor:"pointer" }}>
          Actually, I have some debt to add
        </button>
      </div>
    );
  }

  const { totalDebt, totalMonthlyInterest, debtCalcs, sortedDebts, totalMinPayments } = computed;

  return (
    <div style={{ maxWidth:"700px", margin:"0 auto" }}>
      <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"4px" }}>Riba Purification Accelerator</h2>
      <p style={{ fontFamily:"Poppins", fontSize:"14px", color: V.dimGray, fontStyle:"italic", marginBottom:"24px" }}>
        &ldquo;And Allah has permitted trade and forbidden Riba&rdquo; — Quran 2:275
      </p>
      <button onClick={() => { setNoDebt(true); setDebts([]); }} style={{ display:"block", width:"100%", marginBottom:"20px",
        background: V.viridianBg, border:`2px dashed ${V.viridian}`, padding:"14px", borderRadius:"10px",
        fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.viridian, cursor:"pointer" }}>
        ✓ I have no Riba or debt — Alhamdulillah!
      </button>

      {debts.map((debt, i) => (
        <div key={i} style={{ background: V.white, border:`1px solid ${V.ivory}`, borderRadius:"12px", padding:"20px", marginBottom:"16px", position:"relative" }}>
          <button onClick={() => removeDebt(i)} style={{ position:"absolute", top:"12px", right:"12px", background: V.redBg,
            border:"none", borderRadius:"6px", padding:"4px 10px", cursor:"pointer", fontFamily:"Poppins", fontSize:"12px", color: V.red, fontWeight:600 }}>Remove</button>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>Debt Name</label>
              <input type="text" value={debt.name} onChange={e => updateDebt(i, "name", e.target.value)} placeholder="e.g. Visa Card"
                style={{ width:"100%", padding:"12px 14px", border:`1px solid ${V.cambridge}`, borderRadius:"8px",
                  fontFamily:"Poppins", fontSize:"15px", outline:"none", color: V.onyx, boxSizing:"border-box" }} />
            </div>
            <SelectInput label="Type" value={debt.type} onChange={v => updateDebt(i, "type", v)} options={DEBT_TYPES} />
            <CurrencyInput label="Balance" value={debt.balance} onChange={v => updateDebt(i, "balance", v)} />
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>APR %</label>
              <input type="number" inputMode="decimal" min="0" max="100" step="0.1" value={debt.apr || ""}
                onChange={e => updateDebt(i, "apr", e.target.value)}
                style={{ width:"100%", padding:"12px 14px", border:`1px solid ${V.cambridge}`, borderRadius:"8px",
                  fontFamily:"Poppins", fontSize:"15px", outline:"none", color: V.onyx, boxSizing:"border-box" }} />
            </div>
            <CurrencyInput label="Minimum Payment" value={debt.minPayment} onChange={v => updateDebt(i, "minPayment", v)} />
            <CurrencyInput label="Extra Payment" value={debt.extraPayment} onChange={v => updateDebt(i, "extraPayment", v)} />
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, marginBottom:"6px" }}>Remaining Term (months)</label>
              <input type="number" inputMode="numeric" min="0" value={debt.remainingTerm || ""} onChange={e => updateDebt(i, "remainingTerm", e.target.value)}
                placeholder="Leave blank to auto-calculate"
                style={{ width:"100%", padding:"12px 14px", border:`1px solid ${V.cambridge}`, borderRadius:"8px",
                  fontFamily:"Poppins", fontSize:"15px", outline:"none", color: V.onyx, boxSizing:"border-box" }} />
              <span style={{ fontFamily:"Poppins", fontSize:"11px", color: V.dimGray }}>Leave blank to auto-calculate from APR and payments</span>
            </div>
          </div>
          {/* Interest-only warning */}
          {debtCalcs[i] && debtCalcs[i].isInterestOnly && (
            <div style={{ padding:"10px 14px", borderRadius:"8px", background: V.redBg, marginTop:"8px" }}>
              <p style={{ fontFamily:"Poppins", fontSize:"12px", fontWeight:700, color: V.red }}>⚠️ INTEREST-ONLY — this debt never decreases!</p>
            </div>
          )}
        </div>
      ))}

      <button onClick={addDebt} style={{ display:"block", width:"100%", padding:"14px", borderRadius:"10px",
        border:`2px dashed ${V.cambridge}`, background:"transparent", fontFamily:"Poppins", fontWeight:600,
        fontSize:"14px", color: V.cambridge, cursor:"pointer", marginBottom:"24px" }}>
        + Add Debt
      </button>

      {totalDebt > 0 && (
        <div style={{ background: V.redBg, borderRadius:"12px", padding:"20px", border:`1px solid ${V.red}30` }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"8px" }}>
            <span style={{ fontWeight:600, color: V.onyx }}>Total Debt</span>
            <span style={{ fontWeight:900, fontSize:"18px", color: V.red }}>{fmt(totalDebt)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"8px" }}>
            <span style={{ fontWeight:600, color: V.onyx }}>Monthly Interest Cost</span>
            <span style={{ fontWeight:600, color: V.red }}>{fmt(totalMonthlyInterest)}/mo</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"8px" }}>
            <span style={{ fontWeight:600, color: V.onyx }}>Daily Riba Cost</span>
            <span style={{ fontWeight:600, color: V.red }}>{fmt(totalMonthlyInterest / 30)}/day</span>
          </div>
          {/* Payment warning */}
          {totalMonthlyInterest > totalMinPayments && (
            <div style={{ padding:"10px", borderRadius:"8px", background:`${V.red}15`, marginTop:"8px" }}>
              <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.red }}>⚠️ DEBT GROWING — Payments &lt; Interest!</p>
            </div>
          )}
          {totalMonthlyInterest <= totalMinPayments && totalMonthlyInterest > totalMinPayments * 0.5 && (
            <div style={{ padding:"10px", borderRadius:"8px", background: V.amberBg, marginTop:"8px" }}>
              <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.amber }}>Warning: Mostly paying interest</p>
            </div>
          )}
          {sortedDebts.length > 0 && (
            <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:`1px solid ${V.red}20` }}>
              <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.onyx, marginBottom:"8px" }}>🎯 Priority Attack Order:</p>
              {sortedDebts.map((d, i) => (
                <p key={i} style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx, marginBottom:"4px" }}>
                  {i + 1}. <strong>{d.name || `Debt ${i + 1}`}</strong> — {fmt(d.bal)} at {d.apr}% APR
                  {d.isInterestOnly && <span style={{ color: V.red, fontWeight:700 }}> ⚠️ INTEREST-ONLY!</span>}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProtectionStep({ emergencyFund, setEmergencyFund, computed }: {
  emergencyFund: string; setEmergencyFund: (v: string) => void; computed: ComputedResult;
}) {
  const { totalExpenses, monthsProtected, ef, totalDebt, cashFlow } = computed;
  const levels = [
    { label:"Critical Minimum", months:1, target:totalExpenses, context:"Bare survival" },
    { label:"Basic Protection", months:3, target:totalExpenses * 3, context:"Standard safety" },
    { label:"Recommended", months:6, target:totalExpenses * 6, context:"Strong position — ready to invest" },
    { label:"Optimal", months:12, target:totalExpenses * 12, context:"Complete security" },
  ];

  return (
    <div style={{ maxWidth:"560px", margin:"0 auto" }}>
      <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"4px" }}>Islamic Protection Optimizer</h2>
      <p style={{ fontFamily:"Poppins", fontSize:"14px", color: V.dimGray, fontStyle:"italic", marginBottom:"28px" }}>
        &ldquo;Tie your camel, then put your trust in Allah&rdquo; — Hadith
      </p>
      <CurrencyInput label="Current Emergency Fund" value={emergencyFund} onChange={setEmergencyFund} sublabel="Total savings accessible within 24 hours" />
      <div style={{ background: monthsProtected >= 6 ? V.viridianBg : monthsProtected >= 1 ? V.amberBg : V.redBg,
        borderRadius:"12px", padding:"24px", textAlign:"center", marginBottom:"24px",
        border:`1px solid ${monthsProtected >= 6 ? V.viridian : monthsProtected >= 1 ? V.amber : V.red}30` }}>
        <p style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"40px", color: V.onyx, marginBottom:"4px" }}>{monthsProtected.toFixed(1)}</p>
        <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.dimGray }}>Months Protected</p>
        {totalExpenses > 0 && (
          <div style={{ marginTop:"16px", height:"8px", borderRadius:"4px", background: V.ivory, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:"4px", width:`${Math.min(100, (monthsProtected / 6) * 100)}%`,
              background: monthsProtected >= 6 ? V.viridian : monthsProtected >= 1 ? V.amber : V.red, transition:"width 0.5s ease" }} />
          </div>
        )}
      </div>
      <div style={{ background: V.white, borderRadius:"12px", border:`1px solid ${V.ivory}` }}>
        {levels.map((lev, i) => {
          const achieved = ef >= lev.target && totalExpenses > 0;
          return (
            <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px",
              borderBottom: i < levels.length - 1 ? `1px solid ${V.ivory}` : "none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                  background: achieved ? V.viridian : V.ivory, color: achieved ? V.white : V.dimGray, fontFamily:"Poppins", fontWeight:700, fontSize:"14px" }}>
                  {achieved ? "✓" : lev.months}
                </div>
                <div>
                  <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, margin:0 }}>{lev.label}</p>
                  <p style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray, margin:0 }}>{lev.context}</p>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"14px", color: V.onyx, margin:0 }}>{fmt(lev.target)}</p>
                <p style={{ fontFamily:"Poppins", fontSize:"12px", fontWeight:600, margin:0, color: achieved ? V.viridian : V.red }}>
                  {achieved ? "ACHIEVED" : "NOT YET"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline warnings */}
      {ef > totalExpenses && totalDebt > 0 && (
        <div style={{ marginTop:"16px", padding:"14px", borderRadius:"10px", background: V.amberBg, border:`1px solid ${V.amber}30` }}>
          <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.onyx }}>
            ⚠️ Consider using surplus emergency fund ({fmt(ef - totalExpenses)}) for debt elimination
          </p>
        </div>
      )}
      {monthsProtected === 0 && cashFlow > 5000 && (
        <div style={{ marginTop:"16px", padding:"14px", borderRadius:"10px", background: V.redBg, border:`1px solid ${V.red}30` }}>
          <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.red }}>
            🚨 CRITICAL: {fmt(cashFlow)}/month surplus but ZERO emergency fund — WHERE IS THE MONEY?
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// RESULTS STEP — THE COMPLETE FINANCIAL PORTRAIT
// ═══════════════════════════════════════════════════════════════════════
function ResultsStep({ computed, state }: { computed: ComputedResult; state: AppState }) {
  const { iirsScore, crisisLabel, ribaScore, efScore, expenseScore, savingsScore,
    ribaStatus, efStatus, expenseStatus, savingsStatus, milestones,
    totalIncome, totalExpenses, cashFlow, savingsRate, totalDebt, totalMonthlyInterest,
    ef, monthsProtected, headline, battlePlanTitle, actionSteps, expenseCuts,
    totalCuts, charityExcess, efStrikeAmount, newCashFlow,
    projectedImpact, whatIfProjection, islamicRealityCheck, ribaStrategy, closingMessage } = computed;
  const noIncome = totalIncome === 0;
  const [exporting, setExporting] = useState(false);
  const userName = state.userInfo.name || "Friend";

  const handleExportPDF = async () => {
    setExporting(true);
    try { await generatePDF(computed, userName); } catch (e) { console.error("PDF export failed:", e); }
    setExporting(false);
  };

  // Fire webhook on mount
  useEffect(() => {
    sendToWebhook(state, computed);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ maxWidth:"720px", margin:"0 auto" }}>

      {/* Bismillah */}
      <p style={{ fontFamily:"'Amiri', serif", fontSize:"22px", color: V.viridian, textAlign:"center", marginBottom:"8px" }}>
        {"بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
      </p>

      {/* Section 1: IIRS Score */}
      <div style={{ textAlign:"center", marginBottom:"28px" }}>
        <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"13px", color: V.viridian, letterSpacing:"2px", marginBottom:"4px" }}>YOUR ISLAMIC FINANCIAL PORTRAIT</p>
        <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"24px", color: V.onyx, marginBottom:"20px" }}>Dear {userName}, here is your IIRS</h2>
        <IIRSGauge score={noIncome ? 0 : iirsScore} label={crisisLabel} noIncome={noIncome} />
      </div>

      {/* Section 2: Score Breakdown */}
      <ResultCard>
        <SectionHeading>Score Breakdown</SectionHeading>
        <ScoreBar label="Riba Elimination" score={ribaScore} max={40} status={ribaStatus} />
        <ScoreBar label="Emergency Fund" score={efScore} max={25} status={efStatus} />
        <ScoreBar label="Expense Control" score={expenseScore} max={20} status={expenseStatus} />
        <ScoreBar label="Savings Rate" score={savingsScore} max={15} status={savingsStatus} />
      </ResultCard>

      {/* Section 3: Current Situation */}
      <ResultCard accent="neutral">
        <SectionHeading>Current Situation</SectionHeading>
        {[
          { label:"Monthly Income", value: noIncome ? "$0 — GET INCOME FIRST" : fmt(totalIncome) + "/month", color: noIncome ? V.red : V.onyx },
          { label:"Monthly Expenses", value: fmt(totalExpenses) + "/month", color: V.onyx },
          { label:"Cash Flow", value: `${cashFlow < 0 ? "-" : ""}${fmt(cashFlow)} (${fmtPct(savingsRate)} savings rate)`, color: cashFlow >= 0 ? V.viridian : V.red },
          { label:"Debt Status", value: totalDebt > 0 ? `${fmt(totalDebt)} (Interest: ${fmt(totalMonthlyInterest)}/mo)` : "Debt-Free — Alhamdulillah!", color: totalDebt > 0 ? V.red : V.viridian },
          { label:"Emergency Fund", value: `${fmt(ef)} (${monthsProtected.toFixed(1)} months protection)`, color: monthsProtected >= 3 ? V.viridian : V.amber },
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"10px", flexWrap:"wrap" }}>
            <span style={{ fontWeight:600, fontSize:"14px", color: V.dimGray }}>{item.label}</span>
            <span style={{ fontWeight:700, fontSize:"14px", color: item.color }}>{item.value}</span>
          </div>
        ))}
      </ResultCard>

      {/* Section 4: Personalized Action Plan */}
      <ResultCard accent={headline.includes("✅") ? "green" : headline.includes("📊") || headline.includes("⚠") ? "amber" : "red"}>
        <SectionHeading>🎯 Your Personalized Action Plan</SectionHeading>
        <div style={{ padding:"14px 16px", borderRadius:"10px", background:`${V.onyx}08`, marginBottom:"16px" }}>
          <p style={{ fontFamily:"Poppins", fontSize:"15px", fontWeight:700, color: V.onyx, lineHeight:1.5 }}>{headline}</p>
        </div>
        <p style={{ fontFamily:"Poppins", fontSize:"14px", fontWeight:700, color: V.viridian, marginBottom:"12px" }}>{battlePlanTitle}</p>
        {actionSteps.map((step, i) => (
          <div key={i} style={{ padding:"12px 16px", borderRadius:"10px", background: V.white, marginBottom:"8px", borderLeft:`4px solid ${V.viridian}` }}>
            <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.onyx, lineHeight:1.6, margin:0 }}>{step}</p>
          </div>
        ))}

        {/* Expense cuts */}
        {expenseCuts.length > 0 && (totalDebt > 0 || cashFlow < 0) && (
          <div style={{ marginTop:"16px" }}>
            <p style={{ fontFamily:"Poppins", fontSize:"14px", fontWeight:700, color: V.red, marginBottom:"10px" }}>EMERGENCY EXPENSE CUTS (Total: {fmt(totalCuts)}/month):</p>
            {expenseCuts.map((cut, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:`${V.red}08`, borderRadius:"6px", marginBottom:"4px" }}>
                <span style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx }}>{cut.category}</span>
                <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.red }}>CUT {fmt(cut.amount)}</span>
              </div>
            ))}
            {totalDebt > 0 && (expenseCuts.find(c => c.category.includes("Entertainment")) || entertainmentCheck(computed)) && (
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background:`${V.red}08`, borderRadius:"6px", marginBottom:"4px" }}>
                <span style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx }}>Entertainment: ELIMINATE 100%</span>
                <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.red }}>{fmt(computed.expenseValues.entertainment)}</span>
              </div>
            )}
            {charityExcess > 0 && (
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", background: V.amberBg, borderRadius:"6px", marginBottom:"4px" }}>
                <span style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx }}>CHARITY: Reduce to 2.5% minimum</span>
                <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.amber }}>Save {fmt(charityExcess)}</span>
              </div>
            )}
            {totalDebt > 0 && efStrikeAmount > 0 && (
              <div style={{ marginTop:"12px", padding:"12px", borderRadius:"8px", background: V.viridianBg }}>
                <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.viridian }}>
                  Combined Firepower: Emergency fund strike ({fmt(efStrikeAmount)} one-time) + Monthly cuts ({fmt(totalCuts)}/month) = New cash flow: {fmt(newCashFlow)}/month
                </p>
              </div>
            )}
          </div>
        )}
      </ResultCard>

      {/* Section 5: Projected Impact */}
      <ResultCard>
        <SectionHeading>📊 Projected Impact</SectionHeading>
        {projectedImpact.map((line, i) => (
          <p key={i} style={{ fontFamily:"Poppins", fontSize:"14px", color: V.onyx, lineHeight:1.7, marginBottom:"8px" }}>{line}</p>
        ))}
      </ResultCard>

      {/* Section 6: What-If Projection */}
      <ResultCard accent="green">
        <SectionHeading>🔮 What-If Projection</SectionHeading>
        <p style={{ fontFamily:"Poppins", fontSize:"16px", fontWeight:700, color: V.viridian, lineHeight:1.5 }}>{whatIfProjection}</p>
      </ResultCard>

      {/* Section 7: Islamic Reality Check */}
      {islamicRealityCheck.length > 0 && (
        <ResultCard accent="red">
          <SectionHeading>⚠️ Islamic Reality Check</SectionHeading>
          {islamicRealityCheck.map((line, i) => (
            <p key={i} style={{ fontFamily:"Poppins", fontSize:"14px", color: V.onyx, lineHeight:1.7, marginBottom:"10px",
              fontStyle: line.includes("Prophet") ? "italic" : "normal", fontWeight: line.includes("Execute") ? 700 : 400 }}>{line}</p>
          ))}
        </ResultCard>
      )}

      {/* Section 8: Riba Elimination Strategy */}
      {ribaStrategy && (
        <ResultCard accent="red">
          <SectionHeading>⚔️ Riba Elimination Strategy</SectionHeading>
          <div style={{ display:"grid", gap:"12px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", background: V.white, borderRadius:"8px" }}>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.dimGray }}>Freedom Date</span>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.red }}>{ribaStrategy.freedomDate}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 14px", background: V.white, borderRadius:"8px" }}>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.dimGray }}>Priority Target</span>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.onyx }}>{ribaStrategy.priorityTarget}</span>
            </div>
            <div style={{ padding:"10px 14px", background: V.white, borderRadius:"8px" }}>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.dimGray }}>Method: </span>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx }}>{ribaStrategy.method}</span>
            </div>
            <div style={{ padding:"10px 14px", background: V.white, borderRadius:"8px" }}>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.dimGray }}>Current Path: </span>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", color: V.red }}>{ribaStrategy.currentPath}</span>
            </div>
            <div style={{ padding:"12px 14px", background: V.viridianBg, borderRadius:"8px", border:`1px solid ${V.viridian}30` }}>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.viridian }}>{ribaStrategy.acceleratedPath}</span>
            </div>
            <div style={{ padding:"12px 14px", background:`${V.red}10`, borderRadius:"8px" }}>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:700, color: V.red }}>YOUR ISLAMIC DUTY: {ribaStrategy.islamicDuty}</span>
            </div>
          </div>
        </ResultCard>
      )}

      {/* Section 9: Progress Tracker */}
      <ResultCard>
        <SectionHeading>🏆 Progress Tracker</SectionHeading>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:"10px" }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", borderRadius:"10px",
              background: m.achieved ? V.viridianBg : V.ivory, border: `1px solid ${m.achieved ? V.viridian : V.dimGray}20` }}>
              <div style={{ width:"24px", height:"24px", borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                background: m.achieved ? V.viridian : `${V.dimGray}20`, color: m.achieved ? V.white : V.dimGray, fontFamily:"Poppins", fontWeight:700, fontSize:"12px" }}>
                {m.achieved ? "✓" : "✗"}
              </div>
              <span style={{ fontFamily:"Poppins", fontSize:"12px", fontWeight:600, color: m.achieved ? V.viridian : V.dimGray }}>{m.label}</span>
            </div>
          ))}
        </div>
      </ResultCard>

      {/* Section 10: Closing Message */}
      <div style={{ background: V.ivory, borderRadius:"16px", padding:"28px 24px", marginBottom:"28px", border:`1px solid ${V.viridianLight}`, textAlign:"center" }}>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7, fontWeight:500 }}>{closingMessage}</p>
      </div>

      {/* Section 11: Action Buttons */}
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center", marginBottom:"12px" }}>
        <button onClick={handleExportPDF} disabled={exporting} style={{ background: V.viridian, color: V.white, border:"none",
          padding:"14px 28px", borderRadius:"10px", fontFamily:"Poppins", fontWeight:600, fontSize:"15px",
          cursor: exporting ? "wait" : "pointer", boxShadow:`0 4px 14px ${V.viridian}40`, opacity: exporting ? 0.7 : 1 }}>
          {exporting ? "Generating..." : "📄 Download PDF Report"}
        </button>
        <button onClick={() => shareWhatsApp(noIncome ? 0 : iirsScore)} style={{ background:"#25D366", color: V.white, border:"none",
          padding:"14px 28px", borderRadius:"10px", fontFamily:"Poppins", fontWeight:600, fontSize:"15px", cursor:"pointer", boxShadow:"0 4px 14px #25D36640" }}>
          WhatsApp Share
        </button>
        <button onClick={() => shareNative(noIncome ? 0 : iirsScore)} style={{ background: V.onyx, color: V.white, border:"none",
          padding:"14px 28px", borderRadius:"10px", fontFamily:"Poppins", fontWeight:600, fontSize:"15px", cursor:"pointer" }}>
          📤 Share Score
        </button>
      </div>
      <div style={{ textAlign:"center", marginBottom:"20px" }}>
        <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer" style={{ background: V.onyx, color: V.white,
          border:"none", padding:"14px 28px", borderRadius:"10px", fontFamily:"Poppins", fontWeight:600, fontSize:"15px",
          cursor:"pointer", textDecoration:"none", display:"inline-flex", alignItems:"center" }}>
          Join TMI Community →
        </a>
      </div>
    </div>
  );
}

// Helper to check if entertainment exists but wasn't in the cuts (because it's not over peer avg)
function entertainmentCheck(computed: ComputedResult): boolean {
  return computed.expenseValues.entertainment > 0 && computed.totalDebt > 0;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════
export default function AkhirahFinancialCompass() {
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const [demographics, setDemographics] = useState<Demographics>({
    location: "Dubai", ageRange: "25-34", education: "Bachelor's",
    adults: 1, children: 0, incomeRange: "$50k-$75k", employment: "Employee"
  });
  const [income, setIncome] = useState<Income>({ primary:"", spouse:"", business:"", investment:"" });
  const [expenses, setExpenses] = useState<Expenses>({
    housing:"", transport:"", food:"", utilities:"", healthcare:"",
    education:"", personal:"", entertainment:"", charity:"", other:""
  });
  const [debts, setDebts] = useState<Debt[]>([]);
  const [emergencyFund, setEmergencyFund] = useState("");

  const state: AppState = { userInfo, demographics, income, expenses, debts, emergencyFund };
  const computed = computeAll(state);
  const totalSteps = 7;
  const stepLabels = ["Welcome", "You", "Profile", "Mizan", "Riba & Debts", "Protection", "Results"];

  const goNext = () => { setStep(s => Math.min(s + 1, totalSteps - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBack = () => { setStep(s => Math.max(s - 1, 0)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div style={{ minHeight:"100vh", background: V.white, fontFamily:"'Poppins', sans-serif" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&family=Amiri&display=swap" rel="stylesheet" />

      {/* TMI Header */}
      <header style={{ background: V.onyx, padding:"12px 20px", display:"flex", alignItems:"center", justifyContent:"center", gap:"12px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <rect x="10" y="30" width="18" height="50" rx="3" fill={V.viridian} />
            <rect x="41" y="10" width="18" height="70" rx="3" fill={V.viridian} />
            <rect x="72" y="30" width="18" height="50" rx="3" fill={V.viridian} />
            <circle cx="50" cy="88" r="6" fill={V.viridian} />
          </svg>
          <span style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"14px", color: V.white, letterSpacing:"0.5px" }}>THE MUSLIM INVESTOR</span>
        </div>
      </header>

      {/* Progress Bar */}
      {step > 0 && (
        <div style={{ position:"sticky", top:0, zIndex:100, background: V.white, borderBottom:`1px solid ${V.ivory}`, padding:"12px 20px" }}>
          <div style={{ maxWidth:"700px", margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              {stepLabels.slice(1).map((label, i) => (
                <button key={i} onClick={() => { if (i + 1 <= step) setStep(i + 1); }}
                  style={{ background:"none", border:"none", fontFamily:"Poppins", fontSize:"11px",
                    fontWeight: step === i + 1 ? 600 : 400, cursor: i + 1 <= step ? "pointer" : "default",
                    color: i + 1 <= step ? V.viridian : V.dimGray, padding:"0 4px" }}>
                  {label}
                </button>
              ))}
            </div>
            <div style={{ height:"4px", borderRadius:"2px", background: V.ivory, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:"2px", background: V.viridian,
                width:`${((step) / (totalSteps - 1)) * 100}%`, transition:"width 0.4s ease" }} />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"32px 20px 100px" }}>
        {step === 0 && <WelcomeStep onNext={goNext} />}
        {step === 1 && <RegistrationStep userInfo={userInfo} setUserInfo={setUserInfo} />}
        {step === 2 && <DemographicsStep demographics={demographics} setDemographics={setDemographics} />}
        {step === 3 && <MizanStep income={income} setIncome={setIncome} expenses={expenses} setExpenses={setExpenses} computed={computed} />}
        {step === 4 && <DebtStep debts={debts} setDebts={setDebts} computed={computed} />}
        {step === 5 && <ProtectionStep emergencyFund={emergencyFund} setEmergencyFund={setEmergencyFund} computed={computed} />}
        {step === 6 && <ResultsStep computed={computed} state={state} />}
      </div>

      {/* Navigation */}
      {step > 0 && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background: V.white, borderTop:`1px solid ${V.ivory}`, padding:"14px 20px", zIndex:100 }}>
          <div style={{ maxWidth:"700px", margin:"0 auto", display:"flex", justifyContent:"space-between" }}>
            <button onClick={goBack} style={{ background:"transparent", border:`1px solid ${V.cambridge}`,
              padding:"12px 28px", borderRadius:"10px", fontFamily:"Poppins", fontWeight:600, fontSize:"15px", color: V.onyx, cursor:"pointer" }}>
              ← Back
            </button>
            {step < totalSteps - 1 && (
              <button onClick={goNext} style={{ background: V.viridian, color: V.white, border:"none",
                padding:"12px 28px", borderRadius:"10px", fontFamily:"Poppins", fontWeight:600, fontSize:"15px",
                cursor:"pointer", boxShadow:`0 4px 14px ${V.viridian}40` }}>
                {step === totalSteps - 2 ? "See My Results →" : "Next →"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ background: V.onyx, padding:"24px 20px", textAlign:"center" }}>
        <p style={{ fontFamily:"Poppins", fontSize:"12px", color: V.dimGray, marginBottom:"4px" }}>
          © {new Date().getFullYear()} The Muslim Investor. All rights reserved.
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"11px", color: `${V.dimGray}90` }}>
          Your data stays on your device. Zero servers. Zero databases. Complete privacy.
        </p>
      </footer>
    </div>
  );
}
