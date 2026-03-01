"use client";

import { useState, useEffect } from "react";

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

interface DebtCalc extends Debt {
  bal: number;
  minPay: number;
  extraPay: number;
  totalPay: number;
  monthlyInterest: number;
  priorityScore: number;
  payoffMonths: number | string;
}

interface AppState {
  demographics: Demographics;
  income: Income;
  expenses: Expenses;
  debts: Debt[];
  emergencyFund: string;
}

interface ComputedResult {
  totalIncome: number;
  totalExpenses: number;
  cashFlow: number;
  savingsRate: number;
  totalDebt: number;
  debtCalcs: DebtCalc[];
  debtPaymentsExclMortgage: number;
  totalMonthlyInterest: number;
  peerAverages: Record<string, number>;
  differences: Record<string, number>;
  overspendCount: number;
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
  actions: { icon: string; text: string }[];
}

// ─── DATA TABLES ────────────────────────────────────────────────────────
const LOCATIONS = [
  "Dubai","London","New York","Toronto","Riyadh","Istanbul","Cairo",
  "Karachi","Jakarta","Kuala Lumpur","Singapore","Sydney","Paris","Berlin"
];

const LOCATION_MULTIPLIERS: Record<string, Record<string, number>> = {
  "Dubai":       { housing:1.4, food:1.3, transport:1.2, utilities:1.3, healthcare:1.4, overall:1.32 },
  "London":      { housing:1.6, food:1.4, transport:1.5, utilities:1.4, healthcare:1.5, overall:1.48 },
  "New York":    { housing:1.7, food:1.5, transport:1.4, utilities:1.5, healthcare:1.6, overall:1.54 },
  "Toronto":     { housing:1.3, food:1.2, transport:1.2, utilities:1.2, healthcare:1.3, overall:1.24 },
  "Riyadh":      { housing:1.0, food:1.0, transport:1.0, utilities:1.0, healthcare:1.0, overall:1.0 },
  "Istanbul":    { housing:0.7, food:0.6, transport:0.6, utilities:0.65,healthcare:0.7, overall:0.65 },
  "Cairo":       { housing:0.4, food:0.3, transport:0.3, utilities:0.35,healthcare:0.4, overall:0.35 },
  "Karachi":     { housing:0.3, food:0.25,transport:0.25,utilities:0.3, healthcare:0.35,overall:0.29 },
  "Jakarta":     { housing:0.5, food:0.4, transport:0.35,utilities:0.4, healthcare:0.45,overall:0.42 },
  "Kuala Lumpur": { housing:0.8, food:0.7, transport:0.6, utilities:0.7, healthcare:0.75,overall:0.71 },
  "Singapore":   { housing:1.8, food:1.3, transport:1.1, utilities:1.3, healthcare:1.4, overall:1.38 },
  "Sydney":      { housing:1.5, food:1.3, transport:1.3, utilities:1.3, healthcare:1.4, overall:1.36 },
  "Paris":       { housing:1.5, food:1.3, transport:1.4, utilities:1.3, healthcare:1.4, overall:1.38 },
  "Berlin":      { housing:1.2, food:1.1, transport:1.2, utilities:1.1, healthcare:1.2, overall:1.16 },
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
  { key:"housing",     label:"Housing (Rent/Mortgage)", peerKey:"housing" },
  { key:"transport",   label:"Transportation",          peerKey:"transport" },
  { key:"food",        label:"Food & Groceries",        peerKey:"food" },
  { key:"utilities",   label:"Utilities",               peerKey:"utilities" },
  { key:"healthcare",  label:"Healthcare",              peerKey:"healthcare" },
  { key:"education",   label:"Education",               peerKey:null },
  { key:"personal",    label:"Personal/Clothing",       peerKey:"personal" },
  { key:"entertainment",label:"Entertainment",          peerKey:"entertainment" },
  { key:"charity",     label:"Charity/Zakat (2.5% min)",peerKey:"charity" },
  { key:"other",       label:"Other Expenses",          peerKey:null },
];

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
};

// ─── UTILITY FUNCTIONS ──────────────────────────────────────────────────
const fmt = (n: number | undefined | null): string => {
  if (n === undefined || n === null || isNaN(n)) return "$0";
  return "$" + Math.round(n).toLocaleString("en-US");
};

const fmtPct = (n: number | undefined | null): string => {
  if (!n || isNaN(n)) return "0%";
  return (n * 100).toFixed(1) + "%";
};

// ─── CALCULATION ENGINE ─────────────────────────────────────────────────
function computeAll(state: AppState): ComputedResult {
  const { demographics, income, expenses, debts, emergencyFund } = state;

  const totalIncome = Object.values(income).reduce((s, v) => s + (parseFloat(v) || 0), 0);

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

  const activeDebts = debts.filter(d => (parseFloat(d.balance) || 0) > 0);
  const totalDebt = activeDebts.reduce((s, d) => s + (parseFloat(d.balance) || 0), 0);
  const maxBalance = activeDebts.length > 0 ? Math.max(...activeDebts.map(d => parseFloat(d.balance) || 0)) : 1;

  const debtCalcs: DebtCalc[] = debts.map(d => {
    const bal = parseFloat(d.balance) || 0;
    const apr = parseFloat(d.apr) || 0;
    const minPay = parseFloat(d.minPayment) || 0;
    const extraPay = parseFloat(d.extraPayment) || 0;
    const termInput = parseFloat(d.remainingTerm) || 0;
    const totalPay = minPay + extraPay;
    const monthlyInterest = bal * (apr / 100) / 12;

    let priorityScore = 0;
    if (bal > 0) {
      priorityScore = (1 + (d.type === "Credit Card" ? 1 : 0)) *
        (1 + Math.min((apr / 100) * 10, 5)) *
        (bal < 1000 ? 1.5 : 1) *
        (bal / (maxBalance > 0 ? maxBalance : 1));
    }

    let payoffMonths: number | string = "-";
    if (bal > 0) {
      if (minPay > 0 && minPay <= monthlyInterest) {
        payoffMonths = "INTEREST-ONLY!";
      } else if (termInput > 0) {
        payoffMonths = termInput;
      } else if (apr > 0 && totalPay > monthlyInterest) {
        const r = apr / 100 / 12;
        const n = Math.log(totalPay / (totalPay - bal * r)) / Math.log(1 + r);
        const maxTerm = d.type === "Mortgage" ? 360 : d.type === "Auto Loan" ? 72 : d.type === "Student Loan" ? 240 : 600;
        payoffMonths = Math.min(maxTerm, Math.ceil(n));
      } else if (totalPay > 0) {
        payoffMonths = Math.ceil(bal / totalPay);
      }
    }

    return { ...d, bal, apr, minPay, extraPay, totalPay, monthlyInterest, priorityScore, payoffMonths };
  });

  const debtPaymentsExclMortgage = debtCalcs
    .filter(d => d.type !== "Mortgage" && d.bal > 0)
    .reduce((s, d) => s + d.minPay + d.extraPay, 0);

  const totalMonthlyInterest = debtCalcs.reduce((s, d) => s + d.monthlyInterest, 0);

  const expenseValues: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    expenseValues[cat.key] = parseFloat(expenses[cat.key]) || 0;
  });
  expenseValues.debtPayments = debtPaymentsExclMortgage;

  const totalExpenses = Object.values(expenseValues).reduce((s, v) => s + v, 0) + debtPaymentsExclMortgage;
  const cashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? cashFlow / totalIncome : (cashFlow < 0 ? -1 : 0);

  const differences: Record<string, number> = {};
  EXPENSE_CATEGORIES.forEach(cat => {
    const pa = peerAverages[cat.key] || 0;
    differences[cat.key] = pa > 0 ? expenseValues[cat.key] - pa : 0;
  });

  const overspendCount = EXPENSE_CATEGORIES.filter(cat => (differences[cat.key] || 0) > 0).length;

  const ef = parseFloat(emergencyFund) || 0;
  const monthsProtected = totalExpenses > 0 ? ef / totalExpenses : 0;

  // IISR Score
  let ribaScore: number;
  if (totalDebt > 0) {
    ribaScore = Math.min(30, Math.max(5, 30 - Math.min(20, (totalDebt / Math.max(1, totalIncome)) * 20)));
  } else {
    ribaScore = 40;
  }

  let efScore: number;
  if (monthsProtected >= 6) efScore = 25;
  else if (monthsProtected >= 3) efScore = 20;
  else if (monthsProtected >= 1) efScore = 10;
  else efScore = monthsProtected * 10;

  const expenseScore = Math.min(20, 20 - overspendCount * 3);

  let savingsScore: number;
  if (savingsRate >= 0.2) savingsScore = 15;
  else if (savingsRate >= 0.15) savingsScore = 12;
  else if (savingsRate >= 0.1) savingsScore = 8;
  else savingsScore = 0;

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

  const ribaStatus = ribaScore >= 40 ? "COMPLETE" : ribaScore > 20 ? "MANAGEABLE" : ribaScore > 10 ? "HEAVY" : "CRUSHING";
  const efStatus = efScore >= 20 ? "STRONG" : efScore >= 10 ? "BUILDING" : "WEAK";
  const expenseStatus = expenseScore >= 15 ? "EXCELLENT" : expenseScore >= 10 ? "GOOD" : "POOR";
  const savingsStatus = savingsRate < 0.1 ? "UNACCEPTABLE" : savingsScore >= 12 ? "EXCELLENT" : savingsScore >= 8 ? "ON TARGET" : "BELOW TARGET";

  let crisisLabel: string;
  if (totalIncome === 0) crisisLabel = "NO INCOME CRISIS";
  else if (monthsProtected === 0 && cashFlow > 5000) crisisLabel = "EMERGENCY FUND CRISIS";
  else if (monthsProtected === 0) crisisLabel = "EMERGENCY FUND CRISIS";
  else if (totalDebt > 0 && cashFlow > totalDebt) crisisLabel = "RIBA CRISIS - Can Eliminate Today";
  else if (totalDebt > 0 && cashFlow < 0) crisisLabel = "DOUBLE EMERGENCY";
  else if (totalDebt > 0) crisisLabel = "RIBA CRISIS";
  else if (savingsRate < 0.1) crisisLabel = "SAVINGS CRISIS";
  else if (iirsScore >= 70) crisisLabel = "INVESTMENT READY";
  else if (iirsScore >= 50) crisisLabel = "PROGRESSING";
  else crisisLabel = "BUILDING";

  const milestones = [
    { label: "Riba-Free", achieved: totalDebt === 0 },
    { label: "10% Minimum Savings", achieved: savingsRate >= 0.1 },
    { label: "1-Month Buffer", achieved: monthsProtected >= 1 },
    { label: "3-Month Safety Net", achieved: monthsProtected >= 3 },
    { label: "6-Month Fortress", achieved: monthsProtected >= 6 },
    { label: "Expenses Optimized", achieved: overspendCount === 0 },
    { label: "15% Savings Rate", achieved: savingsRate >= 0.15 },
    { label: "20% Savings Rate", achieved: savingsRate >= 0.2 },
    { label: "Investment Ready", achieved: iirsScore >= 70 && monthsProtected >= 3 && totalDebt === 0 },
  ];

  const actions: { icon: string; text: string }[] = [];
  if (totalIncome === 0) {
    actions.push({ icon: "\u{1F534}", text: "CRITICAL: NO INCOME DETECTED — Get income source before using this tool!" });
  } else if (monthsProtected === 0 && cashFlow > 5000) {
    actions.push({ icon: "\u{1F534}", text: `EMERGENCY FUND CRISIS: You have ${fmt(cashFlow)}/month surplus but ZERO savings — BUILD IT NOW!` });
  } else if (totalDebt > 0 && cashFlow > totalDebt) {
    actions.push({ icon: "\u{1F4B0}", text: `YOU CAN PAY OFF ALL ${fmt(totalDebt)} DEBT TODAY WITH YOUR ${fmt(cashFlow)} MONTHLY SURPLUS — DO IT NOW!` });
  } else if (totalDebt > 0 && cashFlow > totalDebt / 3) {
    actions.push({ icon: "\u{1F4C5}", text: `YOU CAN BE DEBT-FREE IN 3 MONTHS — You have ${fmt(cashFlow)}/month to eliminate ${fmt(totalDebt)} — NO EXCUSES!` });
  } else if (totalDebt > 0 && cashFlow < 0) {
    actions.push({ icon: "\u{1F534}", text: `DOUBLE EMERGENCY: RIBA (${fmt(totalDebt)}) + NEGATIVE CASH FLOW (${fmt(Math.abs(cashFlow))}/month deficit)` });
  } else if (totalDebt > 0) {
    actions.push({ icon: "\u{1F534}", text: `ELIMINATE RIBA — ${fmt(totalDebt)} blocking your path to Allah's pleasure` });
  } else if (totalDebt === 0 && monthsProtected < 1 && cashFlow > 0) {
    actions.push({ icon: "\u26A0\uFE0F", text: `Less than 1 month emergency fund — Build it NOW with your ${fmt(cashFlow)}/month surplus` });
  } else if (totalDebt === 0 && cashFlow < 0) {
    actions.push({ icon: "\u{1F534}", text: `NEGATIVE CASH FLOW — You're spending ${fmt(Math.abs(cashFlow))} more than you earn — heading toward RIBA!` });
  } else if (savingsRate < 0.1) {
    actions.push({ icon: "\u26A0\uFE0F", text: `Your ${fmtPct(savingsRate)} savings rate is below the Islamic minimum of 10%` });
  } else if (monthsProtected < 6) {
    actions.push({ icon: "\u{1F4CA}", text: "Complete your 6-month financial fortress" });
  } else {
    actions.push({ icon: "\u2705", text: "Ready for investment preparation — join TMI to begin your halal investing journey!" });
  }

  if (totalDebt > 0 && expenseValues.charity > totalIncome * 0.025) {
    actions.push({ icon: "\u26A0\uFE0F", text: `CHARITY WARNING: Reduce to 2.5% minimum until Riba eliminated (Save ${fmt(expenseValues.charity - totalIncome * 0.025)}/month)` });
  }

  if (cashFlow > 5000 && monthsProtected === 0 && totalIncome > 0) {
    actions.push({ icon: "\u{1F6A8}", text: `You have ${fmt(cashFlow)}/month surplus but ZERO emergency fund — BUILD IT NOW!` });
  }

  return {
    totalIncome, totalExpenses, cashFlow, savingsRate,
    totalDebt, debtCalcs, debtPaymentsExclMortgage, totalMonthlyInterest,
    peerAverages, differences, overspendCount,
    ef, monthsProtected,
    iirsScore, ribaScore, efScore, expenseScore, savingsScore,
    ribaStatus, efStatus, expenseStatus, savingsStatus,
    crisisLabel, milestones, actions,
  };
}

// ─── PDF EXPORT ─────────────────────────────────────────────────────────
async function generatePDF(computed: ComputedResult) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Header bar
  doc.setFillColor(53, 140, 108);
  doc.rect(0, 0, w, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("THE MUSLIM INVESTOR", w / 2, 18, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Akhirah Financial Compass — IISR Report", w / 2, 30, { align: "center" });

  y = 52;

  // Score
  doc.setFillColor(239, 242, 228);
  doc.circle(w / 2, y + 20, 22, "F");
  const sc = computed.iirsScore >= 70 ? [53, 140, 108] : computed.iirsScore >= 40 ? [245, 158, 11] : [220, 38, 38];
  doc.setTextColor(sc[0], sc[1], sc[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text(String(Math.round(computed.iirsScore)), w / 2, y + 22, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(108, 113, 115);
  doc.setFont("helvetica", "normal");
  doc.text("out of 100", w / 2, y + 30, { align: "center" });

  y += 40;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(sc[0], sc[1], sc[2]);
  doc.text(computed.crisisLabel, w / 2, y, { align: "center" });

  y += 12;
  doc.setDrawColor(239, 242, 228);
  doc.line(margin, y, w - margin, y);
  y += 8;

  // Score Breakdown
  doc.setTextColor(52, 56, 64);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Score Breakdown", margin, y);
  y += 8;

  const scores = [
    { label: "Riba Elimination", score: computed.ribaScore, max: 40, status: computed.ribaStatus },
    { label: "Emergency Fund", score: computed.efScore, max: 25, status: computed.efStatus },
    { label: "Expense Control", score: computed.expenseScore, max: 20, status: computed.expenseStatus },
    { label: "Savings Rate", score: computed.savingsScore, max: 15, status: computed.savingsStatus },
  ];

  scores.forEach(s => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(52, 56, 64);
    doc.text(s.label, margin, y);
    doc.text(`${Math.round(s.score)}/${s.max} — ${s.status}`, w - margin, y, { align: "right" });
    y += 3;
    doc.setFillColor(239, 242, 228);
    doc.roundedRect(margin, y, w - margin * 2, 4, 2, 2, "F");
    const barW = (s.score / s.max) * (w - margin * 2);
    const bc = s.status === "COMPLETE" || s.status === "STRONG" || s.status === "EXCELLENT" || s.status === "ON TARGET"
      ? [53, 140, 108] : s.status === "CRUSHING" || s.status === "WEAK" || s.status === "POOR" || s.status === "UNACCEPTABLE"
      ? [220, 38, 38] : [245, 158, 11];
    doc.setFillColor(bc[0], bc[1], bc[2]);
    doc.roundedRect(margin, y, Math.max(barW, 2), 4, 2, 2, "F");
    y += 10;
  });

  y += 4;
  doc.line(margin, y, w - margin, y);
  y += 8;

  // Current Situation
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 56, 64);
  doc.text("Current Situation", margin, y);
  y += 8;

  const sits = [
    { label: "Monthly Income", value: fmt(computed.totalIncome) },
    { label: "Monthly Expenses", value: fmt(computed.totalExpenses) },
    { label: "Cash Flow", value: `${fmt(computed.cashFlow)} (${fmtPct(computed.savingsRate)} savings)` },
    { label: "Total Debt", value: computed.totalDebt > 0 ? fmt(computed.totalDebt) : "Debt-Free" },
    { label: "Emergency Fund", value: `${fmt(computed.ef)} (${computed.monthsProtected.toFixed(1)} months)` },
  ];

  sits.forEach(s => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(108, 113, 115);
    doc.text(s.label, margin, y);
    doc.setTextColor(52, 56, 64);
    doc.setFont("helvetica", "bold");
    doc.text(s.value, w - margin, y, { align: "right" });
    y += 7;
  });

  y += 4;
  doc.line(margin, y, w - margin, y);
  y += 8;

  // Action Plan
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(52, 56, 64);
  doc.text("Your Action Plan", margin, y);
  y += 8;

  computed.actions.forEach(a => {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(52, 56, 64);
    const lines = doc.splitTextToSize(`${a.icon} ${a.text}`, w - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 4;
  });

  y += 4;

  // Milestones
  if (y < 240) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Progress Milestones", margin, y);
    y += 8;
    computed.milestones.forEach(m => {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(m.achieved ? 53 : 108, m.achieved ? 140 : 113, m.achieved ? 108 : 115);
      doc.text(`${m.achieved ? "YES" : "NO "} ${m.label}`, margin, y);
      y += 6;
    });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setFillColor(52, 56, 64);
  doc.rect(0, footerY - 5, w, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("themuslim-investor.com/tools/compass", w / 2, footerY + 2, { align: "center" });
  doc.setFontSize(7);
  doc.text("Your data stays private — generated locally in your browser.", w / 2, footerY + 7, { align: "center" });

  doc.save("TMI-Akhirah-Financial-Compass-Report.pdf");
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
      text: `Bismillah — My IISR is ${score}/100. Discover yours at themuslim-investor.com/tools/compass`,
      url: "https://themuslim-investor.com/tools/compass",
    }).catch(() => {});
  } else {
    shareWhatsApp(score);
  }
}

// ─── CIRCULAR GAUGE ─────────────────────────────────────────────────────
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

// ─── SCORE BAR ──────────────────────────────────────────────────────────
function ScoreBar({ label, score, max, status }: { label: string; score: number; max: number; status: string }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const barColor = status === "COMPLETE" || status === "STRONG" || status === "EXCELLENT" || status === "ON TARGET"
    ? V.viridian : status === "MANAGEABLE" || status === "BUILDING" || status === "GOOD" || status === "BELOW TARGET"
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

// ─── INPUT COMPONENTS ───────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════════
// STEP COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ textAlign:"center", maxWidth:"640px", margin:"0 auto", padding:"20px 0" }}>
      <p style={{ fontFamily:"'Amiri', serif", fontSize:"26px", color: V.viridian, marginBottom:"8px", lineHeight:1.4 }}>
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <h1 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"clamp(28px,5vw,42px)", color: V.onyx, margin:"20px 0 8px", lineHeight:1.15 }}>
        THE TMI AKHIRAH<br/>FINANCIAL COMPASS
      </h1>
      <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.viridian, marginBottom:"32px" }}>
        From Financial Chaos to Funding Your Good Deeds
      </p>
      <div style={{ background: V.ivory, borderRadius:"16px", padding:"28px 24px", textAlign:"left", marginBottom:"32px", border:`1px solid ${V.viridianLight}` }}>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7, marginBottom:"16px" }}>
          The wealth you hold is an <strong>Amanah</strong> — a sacred trust from Allah. On the Day of Judgment, you will be asked how you earned it and how you spent it.
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7, marginBottom:"16px" }}>
          This Compass produces your <strong>Islamic Investment Readiness Score (IISR)</strong> out of 100. It measures whether your financial foundation is solid enough to begin halal investing.
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"15px", color: V.onyx, lineHeight:1.7 }}>
          Built on three non-negotiable pillars: <strong>Zero Riba</strong>, a <strong>Financial Fortress</strong> (emergency fund), and a <strong>Strong Savings Rate</strong>.
        </p>
      </div>
      <div style={{ background: V.white, borderRadius:"12px", padding:"20px", border:`1px solid ${V.viridianLight}`, marginBottom:"32px", textAlign:"left" }}>
        <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"13px", color: V.viridian, marginBottom:"12px", letterSpacing:"1px" }}>
          🔒 YOUR DATA STAYS WITH YOU
        </p>
        <p style={{ fontFamily:"Poppins", fontSize:"13px", color: V.dimGray, lineHeight:1.6 }}>
          All calculations happen in your browser. Your financial data never leaves your device. Zero servers. Zero databases. Complete privacy.
        </p>
      </div>
      <button onClick={onNext} style={{ background: V.viridian, color: V.white, border:"none", padding:"16px 48px", borderRadius:"12px",
        fontFamily:"Poppins", fontWeight:600, fontSize:"17px", cursor:"pointer", letterSpacing:"0.3px", boxShadow:`0 4px 14px ${V.viridian}40` }}>
        Begin Your Assessment →
      </button>
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
  const { totalIncome, totalExpenses, cashFlow, savingsRate, peerAverages, differences } = computed;

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
            <span style={{ fontWeight:900, fontSize:"18px", color: cashFlow >= 0 ? V.viridian : V.red }}>{fmt(cashFlow)}</span>
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

  const { totalDebt, totalMonthlyInterest, debtCalcs } = computed;
  const sorted = [...debtCalcs].filter(d => d.bal > 0).sort((a, b) => b.priorityScore - a.priorityScore);

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
          </div>
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
          <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins" }}>
            <span style={{ fontWeight:600, color: V.onyx }}>Daily Riba Cost</span>
            <span style={{ fontWeight:600, color: V.red }}>{fmt(totalMonthlyInterest / 30)}/day</span>
          </div>
          {sorted.length > 0 && (
            <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:`1px solid ${V.red}20` }}>
              <p style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: V.onyx, marginBottom:"8px" }}>🎯 Priority Attack Order:</p>
              {sorted.map((d, i) => (
                <p key={i} style={{ fontFamily:"Poppins", fontSize:"13px", color: V.onyx, marginBottom:"4px" }}>
                  {i + 1}. <strong>{d.name || `Debt ${i + 1}`}</strong> — {fmt(d.bal)} at {d.apr}% APR
                  {d.payoffMonths === "INTEREST-ONLY!" && <span style={{ color: V.red, fontWeight:700 }}> ⚠️ INTEREST-ONLY!</span>}
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
  const { totalExpenses, monthsProtected, ef } = computed;
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
    </div>
  );
}

function ResultsStep({ computed, state }: { computed: ComputedResult; state: AppState }) {
  const { iirsScore, crisisLabel, ribaScore, efScore, expenseScore, savingsScore,
    ribaStatus, efStatus, expenseStatus, savingsStatus, milestones, actions,
    totalIncome, totalExpenses, cashFlow, savingsRate, totalDebt, totalMonthlyInterest,
    ef, monthsProtected } = computed;
  const noIncome = totalIncome === 0;
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    setExporting(true);
    try { await generatePDF(computed); } catch (e) { console.error("PDF export failed:", e); }
    setExporting(false);
  };

  return (
    <div style={{ maxWidth:"700px", margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:"32px" }}>
        <p style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"13px", color: V.viridian, letterSpacing:"2px", marginBottom:"8px" }}>YOUR ISLAMIC FINANCIAL PORTRAIT</p>
        <h2 style={{ fontFamily:"Poppins", fontWeight:900, fontSize:"28px", color: V.onyx, marginBottom:"24px" }}>Islamic Investment Readiness Score</h2>
        <IIRSGauge score={noIncome ? 0 : iirsScore} label={crisisLabel} noIncome={noIncome} />
      </div>

      <div style={{ background: V.white, borderRadius:"16px", padding:"24px", border:`1px solid ${V.ivory}`, marginBottom:"24px" }}>
        <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.onyx, marginBottom:"20px" }}>Score Breakdown</h3>
        <ScoreBar label="Riba Elimination" score={ribaScore} max={40} status={ribaStatus} />
        <ScoreBar label="Emergency Fund" score={efScore} max={25} status={efStatus} />
        <ScoreBar label="Expense Control" score={expenseScore} max={20} status={expenseStatus} />
        <ScoreBar label="Savings Rate" score={savingsScore} max={15} status={savingsStatus} />
      </div>

      <div style={{ background: V.ivory, borderRadius:"16px", padding:"24px", marginBottom:"24px" }}>
        <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.onyx, marginBottom:"16px" }}>Current Situation</h3>
        {[
          { label:"Monthly Income", value: noIncome ? "$0 — GET INCOME FIRST" : fmt(totalIncome) + "/month", color: noIncome ? V.red : V.onyx },
          { label:"Monthly Expenses", value: fmt(totalExpenses) + "/month", color: V.onyx },
          { label:"Cash Flow", value: fmt(cashFlow) + ` (${fmtPct(savingsRate)} savings rate)`, color: cashFlow >= 0 ? V.viridian : V.red },
          { label:"Debt Status", value: totalDebt > 0 ? `${fmt(totalDebt)} (Interest: ${fmt(totalMonthlyInterest)}/mo)` : "Debt-Free — Alhamdulillah!", color: totalDebt > 0 ? V.red : V.viridian },
          { label:"Emergency Fund", value: `${fmt(ef)} (${monthsProtected.toFixed(1)} months protection)`, color: monthsProtected >= 3 ? V.viridian : V.amber },
        ].map((item, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", fontFamily:"Poppins", marginBottom:"10px", flexWrap:"wrap" }}>
            <span style={{ fontWeight:600, fontSize:"14px", color: V.dimGray }}>{item.label}</span>
            <span style={{ fontWeight:600, fontSize:"14px", color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ background: V.white, borderRadius:"16px", padding:"24px", border:`1px solid ${V.ivory}`, marginBottom:"24px" }}>
        <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.onyx, marginBottom:"16px" }}>Your Personalized Action Plan</h3>
        {actions.map((a, i) => (
          <div key={i} style={{ display:"flex", gap:"12px", padding:"14px", borderRadius:"10px",
            background: a.icon === "✅" ? V.viridianBg : a.icon === "📊" ? V.ivory : V.redBg, marginBottom:"10px" }}>
            <span style={{ fontSize:"20px", flexShrink:0 }}>{a.icon}</span>
            <p style={{ fontFamily:"Poppins", fontSize:"14px", fontWeight:600, color: V.onyx, lineHeight:1.5, margin:0 }}>{a.text}</p>
          </div>
        ))}
      </div>

      <div style={{ background: V.ivory, borderRadius:"16px", padding:"24px", marginBottom:"32px" }}>
        <h3 style={{ fontFamily:"Poppins", fontWeight:600, fontSize:"16px", color: V.onyx, marginBottom:"16px" }}>Progress Tracker</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:"12px" }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"12px 14px", borderRadius:"10px",
              background: V.white, border: `1px solid ${m.achieved ? V.viridian : V.dimGray}30` }}>
              <div style={{ width:"24px", height:"24px", borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                background: m.achieved ? V.viridian : V.ivory, color: m.achieved ? V.white : V.dimGray, fontFamily:"Poppins", fontWeight:700, fontSize:"12px" }}>
                {m.achieved ? "✓" : "✗"}
              </div>
              <span style={{ fontFamily:"Poppins", fontSize:"13px", fontWeight:600, color: m.achieved ? V.viridian : V.dimGray }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
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

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════
export default function AkhirahFinancialCompass() {
  const [step, setStep] = useState(0);
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

  const state: AppState = { demographics, income, expenses, debts, emergencyFund };
  const computed = computeAll(state);
  const totalSteps = 6;
  const stepLabels = ["Welcome", "Profile", "Mizan", "Riba & Debts", "Protection", "Results"];

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
        {step === 1 && <DemographicsStep demographics={demographics} setDemographics={setDemographics} />}
        {step === 2 && <MizanStep income={income} setIncome={setIncome} expenses={expenses} setExpenses={setExpenses} computed={computed} />}
        {step === 3 && <DebtStep debts={debts} setDebts={setDebts} computed={computed} />}
        {step === 4 && <ProtectionStep emergencyFund={emergencyFund} setEmergencyFund={setEmergencyFund} computed={computed} />}
        {step === 5 && <ResultsStep computed={computed} state={state} />}
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
                Next →
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
