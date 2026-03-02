"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  PROFILES,
  ALLOCATIONS,
  SECTIONS,
  QUESTIONS,
} from "./data/profile-data";

// ============================================================================
// TMI BRAND — from official brand guide
// ============================================================================
const B = {
  v: "#358C6C",   // Viridian
  o: "#343840",   // Onyx
  c: "#86A68B",   // Cambridge Blue
  i: "#EFF2E4",   // Ivory
  d: "#6C7173",   // Dim Gray
};
const ALLOC_COLORS = ["#358C6C", "#86A68B", "#343840", "#6C7173", "#5BA88C", "#A8C4AD"];

const PROCESSING_MESSAGES = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "Analyzing your spiritual foundation...",
  "Mapping your risk tolerance...",
  "Calibrating your knowledge level...",
  "Building your recommended allocation...",
  "Preparing your personalized report...",
  "Writing your 90-day action plan...",
  "Almost there — finalizing your profile...",
];

const DIM_LABELS: Record<string, string> = {
  spiritual_focus: "Spiritual Focus",
  risk_tolerance: "Risk Tolerance",
  knowledge_level: "Knowledge Level",
  time_horizon: "Time Horizon",
  financial_stability: "Financial Stability",
};

interface ReportData {
  success: boolean;
  profile: string;
  profileKey: string;
  desc: string;
  report: string;
  scores: Record<string, number>;
  allocation: Record<string, number>;
  method: string;
  userName: string;
}

type Screen = "welcome" | "collect" | "assessment" | "processing" | "results" | "error";

export default function InvestorProfilePage() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [processingMsg, setProcessingMsg] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [textInput, setTextInput] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const questionRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screen !== "processing") return;
    const interval = setInterval(() => {
      setProcessingMsg((p) => (p < PROCESSING_MESSAGES.length - 1 ? p + 1 : p));
    }, 3000);
    return () => clearInterval(interval);
  }, [screen]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [screen]);

  const question = QUESTIONS[currentQ];
  const section = question ? SECTIONS.find((s) => s.id === question.section) : null;
  const progress = (currentQ / QUESTIONS.length) * 100;
  const currentAnswer = question ? answers[question.id] || "" : "";
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const goNext = useCallback(() => {
    if (!question) return;
    if (question.type === "text") {
      if (!textInput.trim()) return;
      setAnswers((prev) => ({ ...prev, [question.id]: textInput.trim() }));
    } else if (!currentAnswer) return;
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ((p) => p + 1);
      setTextInput("");
      questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      const finalAnswers = question.type === "text" ? { ...answers, [question.id]: textInput.trim() } : answers;
      submitAssessment(finalAnswers);
    }
  }, [currentQ, question, textInput, currentAnswer, answers]);

  const goBack = useCallback(() => {
    if (currentQ > 0) {
      setCurrentQ((p) => p - 1);
      const prevQ = QUESTIONS[currentQ - 1];
      if (prevQ.type === "text") setTextInput(answers[prevQ.id] || "");
    }
  }, [currentQ, answers]);

  const selectOption = useCallback((value: string) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) { setCurrentQ((p) => p + 1); setTextInput(""); }
    }, 300);
  }, [question, currentQ]);

  const submitAssessment = async (finalAnswers: Record<string, string>) => {
    setScreen("processing");
    setProcessingMsg(0);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, name: userName, email: userEmail }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) { const err = await response.json().catch(() => ({})); throw new Error(err.error || "Server error"); }
      const data: ReportData = await response.json();
      if (data.success) { setReportData(data); setScreen("results"); }
      else throw new Error("Failed to generate report");
    } catch (error: any) {
      setErrorMsg(error.name === "AbortError" ? "Report generation is taking longer than expected. Please try again." : "An error occurred generating your report. Please try again.");
      setScreen("error");
    }
  };

  const startFresh = () => { setAnswers({}); setCurrentQ(0); setTextInput(""); setUserName(""); setUserEmail(""); setEmailError(""); setScreen("welcome"); };
  const beginCollect = () => setScreen("collect");
  const beginAssessment = () => {
    if (!userName.trim()) return;
    if (!userEmail.trim() || !isValidEmail(userEmail)) { setEmailError("Please enter a valid email address."); return; }
    setEmailError("");
    setAnswers({ q1: userName.trim() });
    setCurrentQ(1);
    setScreen("assessment");
  };
  const retrySubmission = () => submitAssessment(answers);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (screen === "assessment" && e.key === "Enter" && question?.type === "text") goNext();
      if (screen === "collect" && e.key === "Enter") beginAssessment();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [screen, question, goNext, userName, userEmail]);

  const shareOnWhatsApp = () => {
    if (!reportData) return;
    const pn = reportData.profile.replace(/[^\x20-\x7E\u00A0-\u024F\u0600-\u06FF]/g, "").trim();
    const text = encodeURIComponent(`I just discovered my Islamic Investor Profile with The Muslim Investor \u2014 I\u2019m ${pn}!\n\nDiscover yours at themuslim-investor.com/tools/profile`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const downloadPDF = () => {
    if (!reportData) return;
    const logoUrl = window.location.origin + "/images/tmi-logo.png";
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const scoresHtml = Object.entries(reportData.scores).map(([k, v]) =>
      `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>${DIM_LABELS[k] || k}</span><span style="font-weight:600;color:${B.v};">${Math.round(v)}%</span></div><div style="height:6px;background:${B.i};border-radius:99px;margin-bottom:12px;overflow:hidden;"><div style="height:100%;width:${v}%;background:${B.v};border-radius:99px;"></div></div>`
    ).join("");
    const allocRows = Object.entries(reportData.allocation).map(([k, v]) =>
      `<tr><td style="padding:10px 14px;border-bottom:1px solid #e8ebe5;color:${B.o};">${k}</td><td style="padding:10px 14px;border-bottom:1px solid #e8ebe5;font-weight:600;color:${B.v};text-align:right;">${v}%</td></tr>`
    ).join("");

    const printHtml = `<!DOCTYPE html><html><head>
      <meta charset="UTF-8">
      <title>TMI Personalized Investor Profile Report \u2014 ${reportData.userName}</title>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Poppins', sans-serif; color: ${B.o}; font-size: 13px; line-height: 1.75; padding: 40px 48px; max-width: 780px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid ${B.v}; }
        .header img { height: 36px; margin-bottom: 10px; }
        .header h1 { font-size: 18px; font-weight: 900; color: ${B.o}; margin-bottom: 4px; }
        .header p { font-size: 12px; color: ${B.d}; }
        .profile-card { background: linear-gradient(135deg, ${B.v}, ${B.o}); color: #fff; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 24px; }
        .profile-card h2 { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
        .profile-card p { opacity: 0.85; font-size: 12px; }
        .section { margin-bottom: 22px; }
        .section-label { font-size: 9px; font-weight: 600; color: ${B.d}; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
        h2 { font-size: 15px; font-weight: 600; margin: 20px 0 6px; color: ${B.v}; }
        h3 { font-size: 13px; font-weight: 600; margin: 14px 0 4px; color: ${B.o}; }
        p { margin: 5px 0; }
        ul, ol { margin: 6px 0 6px 20px; }
        li { margin: 3px 0; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th { background: ${B.i}; font-weight: 600; padding: 10px 14px; text-align: left; font-size: 12px; color: ${B.o}; }
        td { padding: 10px 14px; }
        hr { margin: 18px 0; border: none; border-top: 1px solid #e8ebe5; }
        blockquote { border-left: 3px solid ${B.v}; padding-left: 12px; margin: 10px 0; font-style: italic; color: ${B.d}; }
        strong { font-weight: 600; }
        em { color: ${B.d}; }
        .footer { text-align: center; margin-top: 28px; padding-top: 16px; border-top: 2px solid ${B.v}; }
        .footer img { height: 18px; opacity: 0.5; margin-bottom: 4px; }
        .footer p { font-size: 10px; color: ${B.d}; }
        .disclaimer { background: ${B.i}; padding: 12px 16px; border-radius: 8px; font-size: 10px; color: ${B.d}; margin-top: 18px; line-height: 1.6; }
        @media print { body { padding: 20px; } .profile-card { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head><body>
      <div class="header">
        <img src="${logoUrl}" alt="The Muslim Investor" /><br/>
        <h1>TMI Personalized Investor Profile Report</h1>
        <p>Prepared for ${reportData.userName} \u2014 ${today}</p>
      </div>
      <div class="profile-card">
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.6;margin-bottom:4px;">Your Islamic Investor Profile</div>
        <h2>${reportData.profile}</h2>
        <p>${reportData.desc}</p>
      </div>
      <div class="section">
        <div class="section-label">Your Investor DNA \u2014 5 Dimensions</div>
        ${scoresHtml}
      </div>
      <div class="section">
        <div class="section-label">Recommended Allocation</div>
        <table><thead><tr><th>Asset Class</th><th style="text-align:right;">Allocation</th></tr></thead><tbody>${allocRows}</tbody></table>
      </div>
      <hr/>
      <div class="section">${formatMarkdown(reportData.report)}</div>
      <div class="disclaimer">
        <strong>Disclaimer:</strong> This report provides educational guidance based on Islamic finance principles. It is not personalized financial advice. The asset allocations shown are educational frameworks based on your responses \u2014 not buy/sell recommendations. No specific funds, ETFs, or financial products are recommended. Consult a qualified Islamic financial advisor before making investment decisions.
      </div>
      <div class="footer">
        <img src="${logoUrl}" alt="TMI" /><br/>
        <p>The Muslim Investor \u2014 Akhirah-First Wealth Building</p>
        <p>themuslim-investor.com</p>
      </div>
    </body></html>`;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.onload = () => { setTimeout(() => { printWindow.print(); }, 500); };
    }
  };

  // Shared styles
  const btnPrimary = (disabled = false): React.CSSProperties => ({
    width: "100%", padding: "0.875rem", fontSize: "0.9375rem", fontWeight: 600,
    color: "#fff", background: disabled ? "#c8ccc5" : B.v, border: "none",
    borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
    minHeight: 52, fontFamily: "Poppins, sans-serif", transition: "background 0.2s",
  });
  const btnSecondary: React.CSSProperties = {
    width: "100%", padding: "0.875rem", fontSize: "0.9375rem", fontWeight: 600,
    color: B.v, background: "#fff", border: `1.5px solid ${B.v}`,
    borderRadius: 10, cursor: "pointer", fontFamily: "Poppins, sans-serif",
  };
  const card: React.CSSProperties = {
    background: "#fff", borderRadius: 14, padding: "1.5rem", marginBottom: "1.25rem", border: `1px solid ${B.i}`,
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: "0.6875rem", fontWeight: 600, color: B.d, marginBottom: "1.25rem",
    textTransform: "uppercase" as const, letterSpacing: "0.08em",
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&display=swap');
        .tmi-page, .tmi-page * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        @keyframes tmi-fu { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes tmi-sp { to { transform:rotate(360deg) } }
        @keyframes tmi-si { from { opacity:0; transform:scale(.96) } to { opacity:1; transform:scale(1) } }
        .tmi-fu { animation: tmi-fu 0.5s ease-out both; }
        .tmi-si { animation: tmi-si 0.3s ease-out both; }
        .tmi-report h1 { font-size:1.375rem; font-weight:900; margin:2rem 0 .625rem; color:${B.o}; }
        .tmi-report h2 { font-size:1.125rem; font-weight:600; margin:1.5rem 0 .5rem; color:${B.v}; }
        .tmi-report h3 { font-size:1rem; font-weight:600; margin:1rem 0 .375rem; color:${B.o}; }
        .tmi-report p { margin:.5rem 0; line-height:1.75; color:${B.o}; font-size:.9375rem; }
        .tmi-report ul,.tmi-report ol { margin:.625rem 0 .625rem 1.5rem; }
        .tmi-report li { margin:.3rem 0; line-height:1.7; color:${B.o}; font-size:.9375rem; }
        .tmi-report table { width:100%; border-collapse:collapse; margin:1rem 0; font-size:.875rem; }
        .tmi-report th { background:${B.i}; font-weight:600; padding:.625rem .75rem; text-align:left; border-bottom:2px solid #dde1d8; color:${B.o}; }
        .tmi-report td { padding:.625rem .75rem; border-bottom:1px solid #e8ebe5; color:${B.o}; }
        .tmi-report blockquote { border-left:3px solid ${B.v}; padding-left:1rem; margin:1rem 0; font-style:italic; color:${B.d}; }
        .tmi-report hr { margin:1.5rem 0; border:none; border-top:1px solid #e8ebe5; }
        .tmi-report strong { font-weight:600; }
        .tmi-report em { color:${B.d}; }
        @media print { .tmi-no-print { display:none!important; } }
      `}</style>

      <div className="tmi-page" style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${B.i} 0%, #FAFBF8 50%, #fff 100%)` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1.25rem" }}>

          {/* ==================== WELCOME ==================== */}
          {screen === "welcome" && (
            <div className="tmi-fu" style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "2rem", paddingTop: "0.5rem" }}>
                <img src="/images/tmi-logo.png" alt="The Muslim Investor" style={{ height: 48, width: "auto", margin: "0 auto", display: "block" }} />
              </div>
              <p style={{ fontSize: "1.25rem", color: B.v, fontWeight: 600, marginBottom: "2rem" }}>{"\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0640\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064E\u062D\u0650\u064A\u0645\u0650"}</p>
              <h1 style={{ fontSize: "clamp(1.75rem, 5vw, 2.375rem)", fontWeight: 900, color: B.o, lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                TMI Personalized <span style={{ color: B.v }}>Investor Profile</span>
              </h1>
              <p style={{ fontSize: "1rem", fontWeight: 400, color: B.d, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 2.5rem" }}>
                35 questions that reveal exactly who you are as an investor — so you can stop guessing and start stewarding your Amanah with clarity.
              </p>
              <div style={{ ...card, textAlign: "left", marginBottom: "1.5rem" }}>
                {[
                  { icon: "\uD83C\uDFAF", t: "Your Investor DNA", d: "Discover which of 7 investor profiles matches your unique approach" },
                  { icon: "\uD83D\uDCCA", t: "Your Recommended Allocation", d: "Asset class percentages calibrated to your profile and situation" },
                  { icon: "\uD83D\uDCCB", t: "Your 90-Day Action Plan", d: "A step-by-step path through the TMI curriculum, tailored to you" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", padding: "0.875rem 0", borderBottom: i < 2 ? `1px solid ${B.i}` : "none" }}>
                    <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: B.o, marginBottom: 2 }}>{f.t}</p>
                      <p style={{ fontSize: "0.8125rem", fontWeight: 400, color: B.d, lineHeight: 1.5 }}>{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: `${B.i}90`, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "2rem", textAlign: "left" }}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: B.o, marginBottom: "0.375rem" }}>Disclaimer</p>
                <p style={{ fontSize: "0.6875rem", fontWeight: 400, color: B.d, lineHeight: 1.65 }}>
                  This tool provides educational guidance based on Islamic finance principles. It is not personalized financial advice. The asset allocations shown are educational frameworks based on your responses — not buy/sell recommendations. No specific funds, ETFs, or financial products are recommended. Consult a qualified Islamic financial advisor before making investment decisions.
                </p>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: B.o, lineHeight: 1.65, marginTop: "0.5rem" }}>
                  Privacy: We collect your name, email, and profile results to personalize your experience and deliver your report. We will never sell, share, or distribute your personal data to any external third party. Your assessment responses are processed in your browser and are not stored on our servers.
                </p>
              </div>
              <p style={{ fontSize: "0.8125rem", fontWeight: 400, color: B.d, marginBottom: "1.5rem" }}>{"\u23F1\uFE0F"} Takes approximately 10\u201315 minutes</p>
              <button onClick={beginCollect} style={btnPrimary()}>Begin Assessment</button>
            </div>
          )}

          {/* ==================== COLLECT NAME + EMAIL ==================== */}
          {screen === "collect" && (
            <div className="tmi-fu" style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "2rem" }}>
                <img src="/images/tmi-logo.png" alt="TMI" style={{ height: 32, width: "auto", margin: "0 auto", display: "block" }} />
              </div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: B.o, marginBottom: "0.5rem" }}>Before We Begin</h2>
              <p style={{ fontSize: "0.9375rem", fontWeight: 400, color: B.d, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 2rem" }}>
                Your name personalizes your report. Your email delivers your PDF.
              </p>
              <div style={{ ...card, textAlign: "left", padding: "1.75rem 1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: B.o, marginBottom: 6 }}>Full Name</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Enter your full name" autoFocus
                  style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "0.9375rem", border: `2px solid ${userName ? B.v : "#dde1d8"}`, borderRadius: 8, outline: "none", color: B.o, background: userName ? `${B.i}40` : "#fff", fontFamily: "Poppins, sans-serif", marginBottom: "1.25rem", boxSizing: "border-box" as const }} />
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: B.o, marginBottom: 6 }}>Email Address</label>
                <input type="email" value={userEmail} onChange={(e) => { setUserEmail(e.target.value); setEmailError(""); }} placeholder="your@email.com"
                  style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "0.9375rem", border: `2px solid ${emailError ? "#dc2626" : userEmail ? B.v : "#dde1d8"}`, borderRadius: 8, outline: "none", color: B.o, background: userEmail && !emailError ? `${B.i}40` : "#fff", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const }} />
                {emailError && <p style={{ fontSize: "0.75rem", color: "#dc2626", marginTop: 4 }}>{emailError}</p>}
                <p style={{ fontSize: "0.6875rem", fontWeight: 400, color: B.d, marginTop: "1rem", lineHeight: 1.6 }}>
                  We will never sell, share, or distribute your personal data to any external third party.
                </p>
              </div>
              <button onClick={beginAssessment} disabled={!userName.trim() || !userEmail.trim()} style={btnPrimary(!userName.trim() || !userEmail.trim())}>Start the Assessment \u2192</button>
              <button onClick={() => setScreen("welcome")} style={{ background: "none", border: "none", color: B.d, fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", marginTop: "1rem", fontFamily: "Poppins" }}>{"\u2190"} Back</button>
            </div>
          )}

          {/* ==================== ASSESSMENT ==================== */}
          {screen === "assessment" && question && section && (
            <div ref={questionRef} className="tmi-fu">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <img src="/images/tmi-logo.png" alt="TMI" style={{ height: 28, width: "auto" }} />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: B.v, textTransform: "uppercase", letterSpacing: "0.06em" }}>{section.name}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: B.d }}>{currentQ + 1} of {QUESTIONS.length}</span>
                </div>
                <div style={{ height: 5, background: "#e8ebe5", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${B.v}, ${B.c})`, borderRadius: 99, transition: "width 0.35s ease" }} />
                </div>
                <p style={{ fontSize: "0.6875rem", fontWeight: 400, color: B.d, marginTop: 4 }}>{section.description}</p>
              </div>
              <div key={question.id} className="tmi-si" style={{ ...card, padding: "1.75rem 1.5rem" }}>
                <p style={{ fontSize: "1.0625rem", fontWeight: 600, color: B.o, lineHeight: 1.5, marginBottom: "1.25rem" }}>{question.question}</p>
                {question.type === "text" ? (
                  <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={question.placeholder || "Type your answer..."} autoFocus
                    style={{ width: "100%", padding: "0.875rem 1rem", fontSize: "0.9375rem", fontWeight: 400, border: `2px solid ${textInput ? B.v : "#dde1d8"}`, borderRadius: 8, outline: "none", color: B.o, background: textInput ? `${B.i}40` : "#fff", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = B.v)} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {question.options?.map((opt) => {
                      const sel = currentAnswer === opt.value;
                      return (
                        <button key={opt.value} onClick={() => selectOption(opt.value)}
                          style={{ width: "100%", textAlign: "left", padding: "0.8125rem 1rem", fontSize: "0.875rem", fontWeight: sel ? 600 : 400, color: sel ? B.v : B.o, background: sel ? `${B.v}0F` : "#fff", border: `1.5px solid ${sel ? B.v : "#e8ebe5"}`, borderRadius: 8, cursor: "pointer", transition: "all 0.15s", lineHeight: 1.5, minHeight: 50, fontFamily: "Poppins, sans-serif" }}
                          onMouseOver={(e) => { if (!sel) { e.currentTarget.style.borderColor = B.c; e.currentTarget.style.background = `${B.i}60`; } }}
                          onMouseOut={(e) => { if (!sel) { e.currentTarget.style.borderColor = "#e8ebe5"; e.currentTarget.style.background = "#fff"; } }}>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.625rem" }}>
                <button onClick={goBack} disabled={currentQ <= 1} style={{ flex: 1, padding: "0.8125rem", fontSize: "0.875rem", fontWeight: 600, color: currentQ <= 1 ? "#c8ccc5" : B.o, background: currentQ <= 1 ? "#f5f6f3" : "#f0f1ed", border: "none", borderRadius: 10, cursor: currentQ <= 1 ? "not-allowed" : "pointer", minHeight: 50, fontFamily: "Poppins" }}>{"\u2190"} Back</button>
                <button onClick={goNext} disabled={question.type === "text" ? !textInput.trim() : !currentAnswer}
                  style={{ flex: 1, padding: "0.8125rem", fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: (question.type === "text" ? !textInput.trim() : !currentAnswer) ? "#c8ccc5" : B.v, border: "none", borderRadius: 10, cursor: (question.type === "text" ? !textInput.trim() : !currentAnswer) ? "not-allowed" : "pointer", minHeight: 50, fontFamily: "Poppins" }}>
                  {currentQ === QUESTIONS.length - 1 ? "Submit" : "Next \u2192"}
                </button>
              </div>
            </div>
          )}

          {/* ==================== PROCESSING ==================== */}
          {screen === "processing" && (
            <div className="tmi-fu" style={{ textAlign: "center", padding: "3rem 0" }}>
              <img src="/images/tmi-logo.png" alt="TMI" style={{ height: 36, width: "auto", margin: "0 auto 2rem", display: "block", opacity: 0.7 }} />
              <div style={{ width: 48, height: 48, border: "3px solid #e8ebe5", borderTopColor: B.v, borderRadius: "50%", animation: "tmi-sp 0.8s linear infinite", margin: "0 auto 2rem" }} />
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: B.o, marginBottom: "1.25rem" }}>Alhamdulillah...</h2>
              <div style={{ maxWidth: 360, margin: "0 auto" }}>
                {PROCESSING_MESSAGES.map((msg, i) => (
                  <p key={i} style={{ fontSize: i === 0 ? "1rem" : "0.8125rem", color: i <= processingMsg ? (i === 0 ? B.v : B.o) : "#d1d5cb", fontWeight: i === processingMsg ? 600 : 400, transition: "all 0.4s", marginBottom: "0.375rem", opacity: i <= processingMsg ? 1 : 0.3 }}>
                    {i <= processingMsg ? "\u2713" : "\u25CB"} {msg}
                  </p>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: B.d, marginTop: "1.5rem" }}>This may take up to 60 seconds...</p>
            </div>
          )}

          {/* ==================== RESULTS ==================== */}
          {screen === "results" && reportData && (
            <div className="tmi-fu" ref={reportRef}>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <img src="/images/tmi-logo.png" alt="TMI" style={{ height: 32, width: "auto" }} />
              </div>

              <div className="tmi-no-print" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <button onClick={downloadPDF} style={{ ...btnPrimary(), flex: 1, width: "auto", fontSize: "0.8125rem", padding: "0.6875rem" }}>{"\uD83D\uDCC4"} Download Full PDF</button>
                <button onClick={shareOnWhatsApp} style={{ ...btnSecondary, flex: 1, width: "auto", fontSize: "0.8125rem", padding: "0.6875rem" }}>{"\uD83D\uDCAC"} Share on WhatsApp</button>
              </div>

              {/* Profile Card */}
              <div style={{ background: `linear-gradient(135deg, ${B.v} 0%, ${B.o} 100%)`, borderRadius: 14, padding: "2rem 1.5rem", marginBottom: "1.25rem", color: "#fff", textAlign: "center" }}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Your Islamic Investor Profile</p>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.625rem" }}>{reportData.profile}</h2>
                <p style={{ fontSize: "0.875rem", fontWeight: 400, opacity: 0.85, lineHeight: 1.65, maxWidth: 440, margin: "0 auto" }}>{reportData.desc}</p>
              </div>

              {/* Investor DNA — 5 Dimensions */}
              <div style={card}>
                <h3 style={sectionLabel}>Your Investor DNA — 5 Dimensions</h3>
                {Object.entries(reportData.scores).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: "0.875rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: B.o }}>{DIM_LABELS[key] || key}</span>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: B.v }}>{Math.round(value)}%</span>
                    </div>
                    <div style={{ height: 6, background: B.i, borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${value}%`, background: `linear-gradient(90deg, ${B.v}, ${B.c})`, borderRadius: 99, transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Allocation — NO FUNDS */}
              <div style={card}>
                <h3 style={sectionLabel}>Recommended Allocation</h3>
                <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", marginBottom: "0.875rem" }}>
                  {Object.entries(reportData.allocation).map(([cls, pct], i) => (
                    <div key={cls} style={{ width: `${pct}%`, background: ALLOC_COLORS[i % ALLOC_COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", fontWeight: 600, color: "#fff" }}>{pct >= 14 ? `${pct}%` : ""}</div>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem 1rem", marginBottom: "1rem" }}>
                  {Object.entries(reportData.allocation).map(([cls, pct], i) => (
                    <div key={cls} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: ALLOC_COLORS[i % ALLOC_COLORS.length] }} />
                      <span style={{ fontSize: "0.75rem", color: B.o }}>{cls} ({pct}%)</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "0.8125rem", color: B.d, lineHeight: 1.6, fontStyle: "italic" }}>
                  You will learn how to select specific Shariah-compliant instruments within each asset class in TMI Courses 3-5.
                </p>
              </div>

              {/* Full AI Report */}
              <div style={{ ...card, padding: "1.75rem 1.5rem" }}>
                <h3 style={sectionLabel}>Your Personalized Report</h3>
                <div className="tmi-report" dangerouslySetInnerHTML={{ __html: formatMarkdown(reportData.report) }} />
              </div>

              {/* Disclaimer */}
              <div style={{ background: `${B.i}90`, borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 400, color: B.d, lineHeight: 1.65 }}>
                  This report provides educational guidance based on Islamic finance principles. It is not personalized financial advice.
                  The asset allocations shown are educational frameworks — not buy/sell recommendations. No specific funds, ETFs, or financial products are recommended.
                  Consult a qualified Islamic financial advisor before making investment decisions.
                </p>
              </div>

              {/* Closing CTA */}
              <div style={{ ...card, textAlign: "center", padding: "2rem 1.5rem", background: `linear-gradient(180deg, #fff 0%, ${B.i}50 100%)` }}>
                <p style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{"\uD83C\uDF3F"}</p>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 900, color: B.o, marginBottom: "0.625rem" }}>Your Preparation Starts Here</h3>
                <p style={{ fontSize: "0.9375rem", fontWeight: 400, color: B.d, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 1.5rem" }}>
                  You have already done what most Muslims never do — you stopped and asked yourself the hard questions about your wealth and your faith.
                  This report is your first step. The TMI community walks with you on every step after.
                </p>
                <a href="https://www.skool.com/the-muslim-investor" target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", padding: "0.875rem 2rem", fontSize: "0.9375rem", fontWeight: 600, color: "#fff", background: B.v, borderRadius: 10, textDecoration: "none" }}>
                  Join the TMI Community — Free
                </a>
                <p style={{ fontSize: "0.75rem", color: B.d, marginTop: "0.75rem" }}>
                  Thousands of Muslims preparing their answer for the Day of Judgment
                </p>
              </div>

              {/* Bottom actions */}
              <div className="tmi-no-print" style={{ textAlign: "center", paddingBottom: "2rem" }}>
                <button onClick={downloadPDF} style={{ ...btnPrimary(), marginBottom: "0.625rem" }}>{"\uD83D\uDCC4"} Save Full Report as PDF</button>
                <button onClick={shareOnWhatsApp} style={{ ...btnSecondary, marginBottom: "1.5rem" }}>{"\uD83D\uDCAC"} Share Your Profile on WhatsApp</button>
                <button onClick={startFresh} style={{ background: "none", border: "none", color: B.d, fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer", textDecoration: "underline", fontFamily: "Poppins" }}>Start a New Assessment</button>
                <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${B.i}` }}>
                  <img src="/images/tmi-logo.png" alt="TMI" style={{ height: 24, width: "auto", margin: "0 auto 0.5rem", display: "block", opacity: 0.5 }} />
                  <p style={{ fontSize: "0.6875rem", color: B.d }}>Akhirah-First Wealth Building</p>
                </div>
              </div>
            </div>
          )}

          {/* ==================== ERROR ==================== */}
          {screen === "error" && (
            <div className="tmi-fu" style={{ textAlign: "center", padding: "3rem 0" }}>
              <img src="/images/tmi-logo.png" alt="TMI" style={{ height: 32, width: "auto", margin: "0 auto 2rem", display: "block", opacity: 0.5 }} />
              <div style={{ fontSize: "3rem", marginBottom: "1.25rem" }}>{"\uD83D\uDE14"}</div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 900, color: B.o, marginBottom: "0.5rem" }}>Bismillah</h2>
              <p style={{ fontSize: "0.9375rem", color: B.d, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 2rem" }}>{errorMsg}</p>
              <button onClick={retrySubmission} style={{ ...btnPrimary(), marginBottom: "0.625rem" }}>Try Again</button>
              <button onClick={startFresh} style={{ ...btnPrimary(), background: "#f0f1ed", color: B.o }}>Start Over</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================================
// MARKDOWN -> HTML
// ============================================================================
function formatMarkdown(md: string): string {
  if (!md) return "<p>No report content available.</p>";
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^---+$/gm, "<hr>")
    .replace(/^===+$/gm, "<hr>")
    .replace(/^[\-\u2022]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    .replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

  // Table rendering fix — handle markdown tables properly
  html = html.replace(/\|(.+)\|/g, (match) => {
    const cells = match.split("|").filter((c) => c.trim());
    if (cells.every((c) => /^[\-:]+$/.test(c.trim()))) return "<!--table-sep-->";
    const isHeader = match.includes("---");
    const tag = "td";
    const row = cells.map((c) => `<${tag} style="padding:8px 12px;border-bottom:1px solid #e8ebe5;">${c.trim()}</${tag}>`).join("");
    return `<tr>${row}</tr>`;
  });
  html = html.replace(/<!--table-sep-->/g, "");
  html = html.replace(/(<tr>[\s\S]*?<\/tr>(\s*\n?\s*<tr>[\s\S]*?<\/tr>)*)/g, (tableBlock) => {
    // Wrap consecutive rows in a table
    const firstRow = tableBlock.match(/<tr>(.*?)<\/tr>/);
    if (firstRow) {
      const headerRow = firstRow[1].replace(/<td/g, "<th").replace(/<\/td>/g, "</th>");
      const remaining = tableBlock.replace(firstRow[0], "");
      return `<table style="width:100%;border-collapse:collapse;margin:1rem 0;"><thead><tr>${headerRow}</tr></thead><tbody>${remaining}</tbody></table>`;
    }
    return `<table style="width:100%;border-collapse:collapse;margin:1rem 0;">${tableBlock}</table>`;
  });

  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p><br><\/p>/g, "");
  html = html.replace(/<p>(<h[1-3]>)/g, "$1");
  html = html.replace(/(<\/h[1-3]>)<\/p>/g, "$1");
  html = html.replace(/<p>(<hr>)<\/p>/g, "$1");
  html = html.replace(/<p>(<li>)/g, "<ul>$1");
  html = html.replace(/(<\/li>)<\/p>/g, "$1</ul>");
  html = html.replace(/<\/li><br><li>/g, "</li><li>");
  html = html.replace(/<p>(<table)/g, "$1");
  html = html.replace(/(<\/table>)<\/p>/g, "$1");
  return html;
}