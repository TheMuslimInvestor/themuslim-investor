'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SignedState {
  name: string;
  date: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const PILLARS = [
  {
    number: '١',
    title: 'Uphold the Primacy of the Akhirah',
    text: "I will strive to make every financial decision through the lens of the Day of Judgment, seeking Hasanat (good deeds) over worldly gains and prioritizing the pleasure of Allah above all else.",
  },
  {
    number: '٢',
    title: 'Pursue Purity with Unshakeable Integrity',
    text: "I will be relentless in my effort to purify my wealth from Riba (interest) and all Haram sources. I will not compromise my principles for convenience or profit.",
  },
  {
    number: '٣',
    title: 'Transform Knowledge into Action (Amal)',
    text: "I will not be a passive student. I will take the knowledge I gain on this platform and actively apply it to my life, taking responsibility for its stewardship.",
  },
  {
    number: '٤',
    title: 'View My Wealth as a Tool for Khayr (Good)',
    text: "I will see my portfolio not as an end in itself, but as an engine to fuel my 'Ibadah (worship), to increase my Sadaqah (charity), and to become a pillar of strength for my family and the Ummah.",
  },
  {
    number: '٥',
    title: 'Embrace the Journey with Sabr (Patience) and Tawakkul (Trust)',
    text: "I will be patient during trials, grateful during blessings, and trust in Allah's plan, knowing that true success lies only with Him.",
  },
];

// ─── Corner Ornament SVG (Islamic geometric, TMI brand colors) ───────────────
function CornerOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: flip ? 'scaleX(-1)' : undefined,
        opacity: 0.55,
      }}
    >
      {/* Outer arc lines */}
      <path d="M4 4 Q4 40 40 76" stroke="#358C6C" strokeWidth="1.5" fill="none" />
      <path d="M4 4 Q40 4 76 40" stroke="#358C6C" strokeWidth="1.5" fill="none" />
      {/* Inner decorative lines */}
      <path d="M12 12 Q12 36 36 60" stroke="#86A68B" strokeWidth="1" fill="none" />
      <path d="M12 12 Q36 12 60 36" stroke="#86A68B" strokeWidth="1" fill="none" />
      {/* Corner diamond */}
      <rect x="2" y="2" width="6" height="6" rx="1" fill="#358C6C" transform="rotate(45 5 5)" />
      {/* Dots along arcs */}
      <circle cx="8" cy="24" r="1.5" fill="#358C6C" />
      <circle cx="16" cy="44" r="1.5" fill="#358C6C" />
      <circle cx="24" cy="8" r="1.5" fill="#358C6C" />
      <circle cx="44" cy="16" r="1.5" fill="#358C6C" />
      {/* Star-like center detail */}
      <path d="M12 12 L20 4 L28 12 L20 20 Z" stroke="#358C6C" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─── Side Ornament SVG ────────────────────────────────────────────────────────
function SideOrnament({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flipped ? 'scaleX(-1)' : undefined, opacity: 0.4 }}
    >
      <line x1="10" y1="5" x2="10" y2="115" stroke="#86A68B" strokeWidth="1" />
      {[20, 40, 60, 80, 100].map((y) => (
        <g key={y}>
          <circle cx="10" cy={y} r="3" fill="none" stroke="#358C6C" strokeWidth="1" />
          <line x1="3" y1={y} x2="7" y2={y} stroke="#358C6C" strokeWidth="1" />
          <line x1="13" y1={y} x2="17" y2={y} stroke="#358C6C" strokeWidth="1" />
        </g>
      ))}
      <circle cx="10" cy="60" r="5" fill="none" stroke="#358C6C" strokeWidth="1.2" />
      <circle cx="10" cy="60" r="2" fill="#358C6C" />
    </svg>
  );
}

// ─── PDF Generation ───────────────────────────────────────────────────────────
async function generatePledgePDF(signerName: string, signerDate: string): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const W = 210;
  const H = 297;
  const margin = 14;
  const innerMargin = 20;

  // Background — ivory
  doc.setFillColor(239, 242, 228); // #EFF2E4
  doc.rect(0, 0, W, H, 'F');

  // Outer border — viridian
  doc.setDrawColor(53, 140, 108);
  doc.setLineWidth(1.2);
  doc.rect(margin, margin, W - margin * 2, H - margin * 2);

  // Inner border — lighter
  doc.setDrawColor(134, 166, 139);
  doc.setLineWidth(0.5);
  doc.rect(margin + 3, margin + 3, W - (margin + 3) * 2, H - (margin + 3) * 2);

  // Corner diamond accents
  const corners = [
    [margin + 1, margin + 1],
    [W - margin - 1, margin + 1],
    [margin + 1, H - margin - 1],
    [W - margin - 1, H - margin - 1],
  ];
  doc.setFillColor(53, 140, 108);
  corners.forEach(([cx, cy]) => {
    doc.setFillColor(53, 140, 108);
    doc.circle(cx, cy, 1.5, 'F');
  });

  let y = margin + 12;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(52, 56, 64); // #343840
  doc.setCharSpace(2);
  doc.text('THE TMI MISSION PLEDGE', W / 2, y, { align: 'center' });
  doc.setCharSpace(0);

  y += 7;

  // Bismillah — using unicode
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(20);
  doc.setTextColor(53, 140, 108);
  doc.text('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', W / 2, y, { align: 'center' });

  y += 10;

  // Divider
  doc.setDrawColor(53, 140, 108);
  doc.setLineWidth(0.5);
  doc.line(innerMargin + 20, y, W - innerMargin - 20, y);
  y += 8;

  // Opening paragraph
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(52, 56, 64);
  const openingLines = doc.splitTextToSize(
    'I begin this journey not merely to learn about finance, but to answer a call from my soul. I recognize that my wealth, my time, and my knowledge are not my own; they are an Amanah — a sacred trust from Allah Subhanahu wa Ta\'ala. My goal is not just profit, my goal is purity.',
    W - innerMargin * 2 - 8
  );
  doc.text(openingLines, W / 2, y, { align: 'center' });
  y += openingLines.length * 5 + 4;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(53, 140, 108);
  doc.text('My ultimate metric is not the return on my investment, but the return on my Akhirah.', W / 2, y, { align: 'center' });
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(52, 56, 64);
  doc.text('Therefore, with Allah as my witness, I make this niyyah (intention) and pledge to:', W / 2, y, { align: 'center' });
  y += 10;

  // Pillars
  PILLARS.forEach((pillar) => {
    // Pillar heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(52, 56, 64);
    doc.text(pillar.title, W / 2, y, { align: 'center' });
    y += 6;

    // Pillar text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    const pillarLines = doc.splitTextToSize(pillar.text, W - innerMargin * 2 - 10);
    doc.text(pillarLines, W / 2, y, { align: 'center' });
    y += pillarLines.length * 4.5 + 7;
  });

  // Closing
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(52, 56, 64);
  const closingLines = doc.splitTextToSize(
    'This is my pledge. This is my mission. May Allah accept it from me and make me a source of benefit for the Ummah. Ameen.',
    W - innerMargin * 2 - 10
  );
  doc.text(closingLines, W / 2, y, { align: 'center' });
  y += closingLines.length * 5 + 12;

  // Divider before signature
  doc.setDrawColor(134, 166, 139);
  doc.setLineWidth(0.4);
  doc.line(innerMargin + 10, y, W - innerMargin - 10, y);
  y += 6;

  // "Signed in sincere commitment"
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(108, 113, 115);
  doc.text('Signed in sincere commitment.', innerMargin + 12, y);
  y += 10;

  // Name and Date lines
  const nameX = innerMargin + 12;
  const dateX = W - innerMargin - 50;

  doc.setDrawColor(52, 56, 64);
  doc.setLineWidth(0.5);
  doc.line(nameX, y, nameX + 70, y);
  doc.line(dateX, y, dateX + 40, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(52, 56, 64);
  doc.text(signerName, nameX + 35, y - 3, { align: 'center' });
  doc.text(signerDate, dateX + 20, y - 3, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(108, 113, 115);
  doc.text('Name', nameX + 35, y + 4, { align: 'center' });
  doc.text('Date', dateX + 20, y + 4, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(134, 166, 139);
  doc.text('themuslim-investor.com/pledge', W / 2, H - margin - 5, { align: 'center' });

  doc.save(`TMI_Mission_Pledge_${signerName.replace(/\s+/g, '_')}.pdf`);
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function PledgePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState<SignedState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [today, setToday] = useState('');

  useEffect(() => {
    const d = new Date();
    setToday(
      d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  const handleSign = async () => {
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (!agreed) { setError('Please confirm you have read the Pledge.'); return; }

    setSubmitting(true);

    // Fire-and-forget webhook
    const webhookUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_PLEDGE;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name: name.trim(),
          email: email.trim(),
          source: 'pledge_page',
        }),
      }).catch(() => {});
    }

    setSigned({ name: name.trim(), date: today });
    setSubmitting(false);
  };

  const handleDownloadPDF = async () => {
    if (!signed) return;
    try {
      await generatePledgePDF(signed.name, signed.date);
    } catch {
      alert('PDF generation failed. Please try again.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    "I just signed the TMI Mission Pledge — a covenant with Allah to steward my wealth with purity and purpose. Begin yours: themuslim-investor.com/pledge"
  );

  return (
    <>
      {/* Google Fonts — Poppins + Amiri for Arabic */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&family=Amiri:wght@400;700&display=swap');

        :root {
          --viridian: #358C6C;
          --onyx: #343840;
          --cambridge: #86A68B;
          --ivory: #EFF2E4;
          --dim: #6C7173;
          --ivory-dark: #e0e4d0;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--ivory);
          color: var(--onyx);
          font-family: 'Poppins', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .pledge-page {
          min-height: 100vh;
          background: var(--ivory);
        }

        /* ─── Hero ─── */
        .hero {
          background: var(--onyx);
          color: var(--ivory);
          text-align: center;
          padding: 48px 24px 56px;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 120%, rgba(53,140,108,0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-logo {
          height: 48px;
          width: auto;
          margin-bottom: 32px;
          filter: brightness(0) invert(1);
        }

        .hero-tag {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--cambridge);
          border: 1px solid rgba(134,166,139,0.4);
          padding: 4px 16px;
          border-radius: 2px;
          margin-bottom: 20px;
        }

        .hero-title {
          font-size: clamp(26px, 5vw, 44px);
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--ivory);
          margin-bottom: 16px;
          line-height: 1.1;
        }

        .hero-bismillah {
          font-family: 'Amiri', serif;
          font-size: clamp(28px, 6vw, 48px);
          color: var(--cambridge);
          direction: rtl;
          margin: 8px 0 24px;
          line-height: 1.6;
        }

        .hero-subtitle {
          font-size: clamp(14px, 2.5vw, 17px);
          font-weight: 400;
          color: rgba(239,242,228,0.75);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }

        .hero-subtitle em {
          color: var(--cambridge);
          font-style: normal;
          font-weight: 600;
        }

        /* ─── Pledge Document ─── */
        .pledge-document-wrapper {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 16px 0;
        }

        .pledge-document {
          background: #fafaf5;
          border: 1.5px solid var(--cambridge);
          border-radius: 4px;
          padding: 48px 20px;
          position: relative;
          box-shadow: 0 8px 40px rgba(52,56,64,0.1);
        }

        @media (min-width: 600px) {
          .pledge-document {
            padding: 64px 56px;
          }
        }

        /* Corner ornaments */
        .corner-tl, .corner-tr, .corner-bl, .corner-br {
          position: absolute;
          width: 72px;
          height: 72px;
        }
        .corner-tl { top: 8px; left: 8px; }
        .corner-tr { top: 8px; right: 8px; transform: scaleX(-1); }
        .corner-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
        .corner-br { bottom: 8px; right: 8px; transform: scale(-1, -1); }

        /* Side ornaments */
        .side-left, .side-right {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 120px;
          display: none;
        }
        @media (min-width: 600px) {
          .side-left, .side-right { display: block; }
        }
        .side-left { left: 10px; }
        .side-right { right: 10px; }

        /* Inner content */
        .pledge-inner {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .doc-title {
          font-size: clamp(15px, 3vw, 22px);
          font-weight: 900;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--onyx);
          margin-bottom: 10px;
        }

        .doc-bismillah {
          font-family: 'Amiri', serif;
          font-size: clamp(24px, 5vw, 40px);
          color: var(--viridian);
          direction: rtl;
          margin: 4px 0 24px;
          line-height: 1.8;
        }

        .doc-divider {
          border: none;
          border-top: 1px solid var(--cambridge);
          opacity: 0.5;
          margin: 0 auto 28px;
          max-width: 60%;
        }

        .doc-opening {
          font-size: 13.5px;
          line-height: 1.85;
          color: var(--onyx);
          margin-bottom: 20px;
          font-weight: 400;
        }

        .doc-highlight {
          display: block;
          font-size: 15px;
          font-weight: 600;
          font-style: italic;
          color: var(--viridian);
          margin: 20px 0;
          line-height: 1.6;
        }

        .doc-transition {
          font-size: 13.5px;
          color: var(--dim);
          margin-bottom: 36px;
        }

        /* Pillars */
        .pillars {
          display: flex;
          flex-direction: column;
          gap: 28px;
          margin-bottom: 36px;
          text-align: left;
        }

        .pillar {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 20px 20px 20px 16px;
          background: rgba(239,242,228,0.7);
          border-left: 3px solid var(--viridian);
          border-radius: 0 4px 4px 0;
        }

        .pillar-number {
          font-family: 'Amiri', serif;
          font-size: 24px;
          color: var(--viridian);
          font-weight: 700;
          min-width: 32px;
          line-height: 1.2;
          direction: rtl;
        }

        .pillar-content {}

        .pillar-title {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--onyx);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .pillar-text {
          font-size: 12.5px;
          color: #555;
          line-height: 1.75;
          font-weight: 400;
        }

        .doc-closing {
          font-size: 13.5px;
          line-height: 1.85;
          font-style: italic;
          color: var(--onyx);
          margin-bottom: 32px;
        }

        .doc-footer-divider {
          border: none;
          border-top: 1px solid var(--cambridge);
          opacity: 0.4;
          margin: 0 auto 24px;
          max-width: 80%;
        }

        .doc-signed-line {
          font-size: 12px;
          font-style: italic;
          color: var(--dim);
          margin-bottom: 12px;
        }

        .doc-sig-fields {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          max-width: 440px;
          margin: 0 auto;
        }

        .sig-field {
          flex: 1;
          text-align: center;
        }

        .sig-line {
          border-bottom: 1.5px solid var(--onyx);
          height: 32px;
          margin-bottom: 4px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--onyx);
          padding-bottom: 4px;
          min-width: 120px;
        }

        .sig-label {
          font-size: 10px;
          color: var(--dim);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* ─── Sign Section ─── */
        .sign-section {
          max-width: 760px;
          margin: 0 auto;
          padding: 48px 16px 64px;
        }

        .sign-card {
          background: var(--onyx);
          border-radius: 8px;
          padding: 40px 24px;
          color: var(--ivory);
        }

        @media (min-width: 600px) {
          .sign-card { padding: 48px 56px; }
        }

        .sign-heading {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 900;
          letter-spacing: 1px;
          color: var(--ivory);
          margin-bottom: 8px;
        }

        .sign-subheading {
          font-size: 13.5px;
          color: var(--cambridge);
          margin-bottom: 32px;
          line-height: 1.6;
        }

        .privacy-note {
          font-size: 11.5px;
          color: rgba(239,242,228,0.55);
          line-height: 1.6;
          margin-bottom: 28px;
          padding: 12px 16px;
          border: 1px solid rgba(134,166,139,0.25);
          border-radius: 4px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--cambridge);
          margin-bottom: 6px;
          display: block;
        }

        .field-input {
          width: 100%;
          background: rgba(239,242,228,0.07);
          border: 1px solid rgba(134,166,139,0.4);
          border-radius: 4px;
          color: var(--ivory);
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          padding: 12px 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .field-input::placeholder { color: rgba(239,242,228,0.3); }
        .field-input:focus { border-color: var(--viridian); }

        .field-input[readonly] {
          opacity: 0.5;
          cursor: default;
        }

        .checkbox-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .checkbox-row input[type="checkbox"] {
          margin-top: 2px;
          width: 18px;
          height: 18px;
          accent-color: var(--viridian);
          flex-shrink: 0;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 13px;
          color: rgba(239,242,228,0.8);
          line-height: 1.6;
          cursor: pointer;
        }

        .error-msg {
          font-size: 12.5px;
          color: #e07070;
          margin-bottom: 16px;
          padding: 10px 14px;
          background: rgba(220, 80, 80, 0.1);
          border-radius: 4px;
          border-left: 3px solid #e07070;
        }

        .btn-sign {
          width: 100%;
          background: var(--viridian);
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 16px 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .btn-sign:hover:not(:disabled) { background: #2d7a5e; transform: translateY(-1px); }
        .btn-sign:active:not(:disabled) { transform: translateY(0); }
        .btn-sign:disabled { opacity: 0.5; cursor: not-allowed; }

        /* ─── Confirmation Section ─── */
        .confirm-section {
          text-align: center;
        }

        .confirm-ameen {
          font-family: 'Amiri', serif;
          font-size: clamp(28px, 6vw, 44px);
          color: var(--cambridge);
          direction: rtl;
          margin-bottom: 16px;
        }

        .confirm-message {
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: 600;
          color: var(--ivory);
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .confirm-sub {
          font-size: 13px;
          color: rgba(239,242,228,0.6);
          margin-bottom: 36px;
          font-style: italic;
        }

        .confirm-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          margin: 0 auto;
        }

        @media (min-width: 500px) {
          .confirm-actions { flex-direction: row; flex-wrap: wrap; justify-content: center; }
          .confirm-actions > * { flex: 1; min-width: 160px; }
        }

        .btn-download {
          background: var(--viridian);
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          padding: 14px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-download:hover { background: #2d7a5e; }

        .btn-whatsapp {
          background: #25d366;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          padding: 14px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-whatsapp:hover { background: #20b957; }

        .btn-next {
          background: transparent;
          color: var(--ivory);
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          padding: 14px 20px;
          border: 1px solid rgba(239,242,228,0.35);
          border-radius: 4px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-next:hover { border-color: var(--cambridge); background: rgba(239,242,228,0.07); }
      `}</style>

      <div className="pledge-page">
        {/* ── Hero ── */}
        <section className="hero">
          <div>
            {/* Logo */}
            <div style={{ marginBottom: 28 }}>
              <img
                src="/images/tmi-logo-horizontal.jpg"
                alt="The Muslim Investor"
                className="hero-logo"
                style={{ height: 44, width: 'auto', display: 'inline-block', filter: 'brightness(0) invert(1)' }}
              />
            </div>

            <div className="hero-tag">Course 1 · Resource 1</div>
            <h1 className="hero-title">The TMI Mission Pledge</h1>

            {/* Bismillah */}
            <div className="hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>

            <p className="hero-subtitle">
              This is where your transformation begins. Before you learn a single investment concept,
              you make a <em>covenant with Allah</em> about how you will steward your wealth.
            </p>
          </div>
        </section>

        {/* ── Pledge Document ── */}
        <section className="pledge-document-wrapper">
          <div className="pledge-document">
            {/* Corner ornaments */}
            <div className="corner-tl"><CornerOrnament /></div>
            <div className="corner-tr"><CornerOrnament flip /></div>
            <div className="corner-bl" style={{ transform: 'scaleY(-1)' }}><CornerOrnament /></div>
            <div className="corner-br" style={{ transform: 'scale(-1,-1)' }}><CornerOrnament /></div>

            {/* Side ornaments */}
            <div className="side-left"><SideOrnament /></div>
            <div className="side-right"><SideOrnament flipped /></div>

            <div className="pledge-inner">
              <h2 className="doc-title">THE TMI MISSION PLEDGE</h2>
              <div className="doc-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              <hr className="doc-divider" />

              <p className="doc-opening">
                I begin this journey not merely to learn about finance, but to answer a call from my soul.
                I recognize that my wealth, my time, and my knowledge are not my own; they are an Amanah
                — a sacred trust from Allah Subhanahu wa Ta&apos;ala. My goal is not just profit, my goal is purity.
              </p>

              <span className="doc-highlight">
                My ultimate metric is not the return on my investment,<br />
                but the return on my Akhirah.
              </span>

              <p className="doc-transition">
                Therefore, with Allah as my witness, I make this niyyah (intention) and pledge to:
              </p>

              {/* 5 Pillars */}
              <div className="pillars">
                {PILLARS.map((pillar) => (
                  <div className="pillar" key={pillar.title}>
                    <div className="pillar-number">{pillar.number}</div>
                    <div className="pillar-content">
                      <div className="pillar-title">{pillar.title}</div>
                      <div className="pillar-text">{pillar.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="doc-closing">
                This is my pledge. This is my mission. May Allah accept it from me and make me a
                source of benefit for the Ummah. Ameen.
              </p>

              <hr className="doc-footer-divider" />

              <p className="doc-signed-line">Signed in sincere commitment.</p>

              <div className="doc-sig-fields">
                <div className="sig-field">
                  <div className="sig-line">{signed?.name ?? ''}</div>
                  <div className="sig-label">Name</div>
                </div>
                <div className="sig-field">
                  <div className="sig-line">{signed?.date ?? ''}</div>
                  <div className="sig-label">Date</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sign / Confirmation Section ── */}
        <section className="sign-section">
          <div className="sign-card">

            {!signed ? (
              <>
                <h2 className="sign-heading">Sign Your Pledge</h2>
                <p className="sign-subheading">
                  Make your niyyah. Set your intention. Begin your Akhirah-first journey.
                </p>

                <div className="privacy-note">
                  Your name personalizes your Pledge certificate. Your email delivers your signed PDF.
                  We will never sell, share, or distribute your personal data to any external third party.
                </div>

                <div className="field-group">
                  <div>
                    <label className="field-label" htmlFor="pledge-name">Full Name</label>
                    <input
                      id="pledge-name"
                      type="text"
                      className="field-input"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="pledge-email">Email Address</label>
                    <input
                      id="pledge-email"
                      type="email"
                      className="field-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="pledge-date">Date</label>
                    <input
                      id="pledge-date"
                      type="text"
                      className="field-input"
                      value={today}
                      readOnly
                    />
                  </div>
                </div>

                <div className="checkbox-row">
                  <input
                    id="pledge-agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label className="checkbox-label" htmlFor="pledge-agree">
                    I have read the TMI Mission Pledge above and I sign it with sincere intention before Allah.
                  </label>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <button
                  className="btn-sign"
                  onClick={handleSign}
                  disabled={submitting}
                >
                  {submitting ? 'Signing…' : 'Sign My Pledge'}
                </button>
              </>
            ) : (
              <div className="confirm-section">
                <div className="confirm-ameen">آمِينَ</div>
                <p className="confirm-message">
                  Bismillah. Your Pledge is signed, {signed.name}.<br />
                  May Allah accept it from you and make you a source of benefit for the Ummah.
                </p>
                <p className="confirm-sub">Ameen.</p>

                <div className="confirm-actions">
                  <button className="btn-download" onClick={handleDownloadPDF}>
                    <span>⬇</span> Download Signed PDF
                  </button>

                  <a
                    className="btn-whatsapp"
                    href={`https://wa.me/?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>📲</span> Share on WhatsApp
                  </a>

                  <a
                    className="btn-next"
                    href="/tools/compass"
                  >
                    Take Your Next Step →
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
