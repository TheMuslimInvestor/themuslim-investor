'use client';

import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface SignedState {
  name: string;
  date: string;
}

// ─── Pledge Content ───────────────────────────────────────────────────────────
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
    title: "View My Wealth as a Tool for Khayr (Good)",
    text: "I will see my portfolio not as an end in itself, but as an engine to fuel my 'Ibadah (worship), to increase my Sadaqah (charity), and to become a pillar of strength for my family and the Ummah.",
  },
  {
    number: '٥',
    title: 'Embrace the Journey with Sabr (Patience) and Tawakkul (Trust)',
    text: "I will be patient during trials, grateful during blessings, and trust in Allah's plan, knowing that true success lies only with Him.",
  },
];

// ─── Corner Ornament SVG ──────────────────────────────────────────────────────
function CornerOrnament() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.55, width: '100%', height: '100%' }}>
      <path d="M4 4 Q4 40 40 76" stroke="#358C6C" strokeWidth="1.5" fill="none" />
      <path d="M4 4 Q40 4 76 40" stroke="#358C6C" strokeWidth="1.5" fill="none" />
      <path d="M12 12 Q12 36 36 60" stroke="#86A68B" strokeWidth="1" fill="none" />
      <path d="M12 12 Q36 12 60 36" stroke="#86A68B" strokeWidth="1" fill="none" />
      <rect x="2" y="2" width="6" height="6" rx="1" fill="#358C6C" transform="rotate(45 5 5)" />
      <circle cx="8" cy="24" r="1.5" fill="#358C6C" />
      <circle cx="16" cy="44" r="1.5" fill="#358C6C" />
      <circle cx="24" cy="8" r="1.5" fill="#358C6C" />
      <circle cx="44" cy="16" r="1.5" fill="#358C6C" />
      <path d="M12 12 L20 4 L28 12 L20 20 Z" stroke="#358C6C" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

// ─── PDF Generation (Fix 2 + Fix 3 + Fix 4) ──────────────────────────────────
async function generatePledgePDF(signerName: string, signerDate: string): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const W = 210;
  const H = 297;
  const m = 12;       // outer margin
  const im = 22;      // inner text margin

  // ── Background ──────────────────────────────────────────────────────────────
  doc.setFillColor(239, 242, 228); // Ivory #EFF2E4
  doc.rect(0, 0, W, H, 'F');

  // ── Outer border ────────────────────────────────────────────────────────────
  doc.setDrawColor(53, 140, 108);   // Viridian
  doc.setLineWidth(1.5);
  doc.rect(m, m, W - m * 2, H - m * 2);

  // ── Inner border ────────────────────────────────────────────────────────────
  doc.setDrawColor(134, 166, 139); // Cambridge Blue
  doc.setLineWidth(0.5);
  doc.rect(m + 3.5, m + 3.5, W - (m + 3.5) * 2, H - (m + 3.5) * 2);

  // ── Corner dots ─────────────────────────────────────────────────────────────
  doc.setFillColor(53, 140, 108);
  [[m, m], [W - m, m], [m, H - m], [W - m, H - m]].forEach(([cx, cy]) => {
    doc.circle(cx, cy, 1.5, 'F');
  });

  // ── Corner diamond ornaments (drawn with lines) ──────────────────────────────
  const drawCorner = (x: number, y: number, flipX: boolean, flipY: boolean) => {
    const sx = flipX ? -1 : 1;
    const sy = flipY ? -1 : 1;
    doc.setDrawColor(53, 140, 108);
    doc.setLineWidth(0.6);
    // Outer arc approximated with lines
    doc.line(x, y + sy * 2, x, y + sy * 14);
    doc.line(x + sx * 2, y, x + sx * 14, y);
    // Inner detail
    doc.setDrawColor(134, 166, 139);
    doc.setLineWidth(0.4);
    doc.line(x + sx * 4, y + sy * 4, x + sx * 4, y + sy * 10);
    doc.line(x + sx * 4, y + sy * 4, x + sx * 10, y + sy * 4);
    // Diamond
    doc.setFillColor(53, 140, 108);
    doc.circle(x + sx * 2, y + sy * 2, 1, 'F');
  };
  drawCorner(m + 1, m + 1, false, false);
  drawCorner(W - m - 1, m + 1, true, false);
  drawCorner(m + 1, H - m - 1, false, true);
  drawCorner(W - m - 1, H - m - 1, true, true);

  // ── Try to load logo ─────────────────────────────────────────────────────────
  try {
    const logoRes = await fetch('/images/tmi-logo.png');
    if (logoRes.ok) {
      const blob = await logoRes.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });
      // Center logo — 28mm wide
      const logoW = 28;
      const logoH = 14;
      doc.addImage('data:image/png;base64,' + base64, 'PNG', (W - logoW) / 2, m + 8, logoW, logoH);
    }
  } catch {
    // Logo unavailable — skip silently
  }

  let y = m + 28;

  // ── Title ────────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(52, 56, 64);
  doc.setCharSpace(2.5);
  doc.text('THE TMI MISSION PLEDGE', W / 2, y, { align: 'center' });
  doc.setCharSpace(0);
  y += 7;

  // ── Bismillah (Fix 2) ─────────────────────────────────────────────────────────
  // Strategy: try to load Amiri font; if unavailable, render transliteration elegantly
  let arabicFontLoaded = false;
  try {
    const fontRes = await fetch('/fonts/Amiri-Regular.ttf');
    if (fontRes.ok) {
      const fontBuffer = await fontRes.arrayBuffer();
      const fontBase64 = btoa(
        new Uint8Array(fontBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      doc.addFileToVFS('Amiri-Regular.ttf', fontBase64);
      doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
      arabicFontLoaded = true;
    }
  } catch {
    arabicFontLoaded = false;
  }

  if (arabicFontLoaded) {
    doc.setFont('Amiri', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(53, 140, 108);
    doc.text('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', W / 2, y + 2, { align: 'center' });
  } else {
    // Elegant fallback — styled transliteration in italic
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(53, 140, 108);
    doc.text('Bismillah Al-Rahman Al-Raheem', W / 2, y + 2, { align: 'center' });
  }
  y += 10;

  // ── Divider ──────────────────────────────────────────────────────────────────
  doc.setDrawColor(134, 166, 139);
  doc.setLineWidth(0.5);
  doc.line(im + 20, y, W - im - 20, y);
  y += 8;

  // ── Opening paragraph ────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(52, 56, 64);
  const opening = doc.splitTextToSize(
    "I begin this journey not merely to learn about finance, but to answer a call from my soul. I recognize that my wealth, my time, and my knowledge are not my own; they are an Amanah — a sacred trust from Allah Subhanahu wa Ta'ala. My goal is not just profit, my goal is purity.",
    W - im * 2
  );
  doc.text(opening, W / 2, y, { align: 'center' });
  y += opening.length * 4.5 + 5;

  // ── Highlight line ───────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(10);
  doc.setTextColor(53, 140, 108);
  const highlight = doc.splitTextToSize(
    'My ultimate metric is not the return on my investment, but the return on my Akhirah.',
    W - im * 2 - 10
  );
  doc.text(highlight, W / 2, y, { align: 'center' });
  y += highlight.length * 5 + 5;

  // ── Transition ───────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(108, 113, 115);
  doc.text('Therefore, with Allah as my witness, I make this niyyah (intention) and pledge to:', W / 2, y, { align: 'center' });
  y += 9;

  // ── Pillars ──────────────────────────────────────────────────────────────────
  PILLARS.forEach((pillar, idx) => {
    // Thin separator before each pillar (except first)
    if (idx > 0) {
      doc.setDrawColor(134, 166, 139);
      doc.setLineWidth(0.3);
      doc.line(im + 10, y - 2, W - im - 10, y - 2);
      y += 3;
    }

    // Left accent bar
    doc.setFillColor(53, 140, 108);
    doc.rect(im, y - 3, 1.5, 12, 'F');

    // Pillar heading
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(52, 56, 64);
    doc.text(pillar.title, im + 5, y, { maxWidth: W - im * 2 - 8 });
    y += 5.5;

    // Pillar body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 90, 90);
    const pillarLines = doc.splitTextToSize(pillar.text, W - im * 2 - 8);
    doc.text(pillarLines, im + 5, y);
    y += pillarLines.length * 4.2 + 6;
  });

  // ── Closing du'a ─────────────────────────────────────────────────────────────
  doc.setDrawColor(134, 166, 139);
  doc.setLineWidth(0.4);
  doc.line(im + 15, y, W - im - 15, y);
  y += 7;

  doc.setFont('helvetica', 'bolditalic');
  doc.setFontSize(9.5);
  doc.setTextColor(53, 140, 108);
  const closing = doc.splitTextToSize(
    "This is my pledge. This is my mission. May Allah accept it from me and make me a source of benefit for the Ummah. Ameen.",
    W - im * 2 - 10
  );
  doc.text(closing, W / 2, y, { align: 'center' });
  y += closing.length * 5 + 8;

  // ── "Signed in sincere commitment" ───────────────────────────────────────────
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(108, 113, 115);
  doc.text('Signed in sincere commitment.', im, y);
  y += 8;

  // ── Signature lines ──────────────────────────────────────────────────────────
  const nameX = im;
  const dateX = W - im - 52;

  doc.setDrawColor(52, 56, 64);
  doc.setLineWidth(0.6);
  doc.line(nameX, y, nameX + 72, y);
  doc.line(dateX, y, dateX + 48, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(52, 56, 64);
  doc.text(signerName, nameX + 36, y - 3, { align: 'center' });
  doc.text(signerDate, dateX + 24, y - 3, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(134, 166, 139);
  doc.text('Name', nameX + 36, y + 4, { align: 'center' });
  doc.text('Date', dateX + 24, y + 4, { align: 'center' });
  y += 14;

  // ── Fix 4: Next Step CTA ─────────────────────────────────────────────────────
  doc.setDrawColor(53, 140, 108);
  doc.setLineWidth(0.3);
  doc.line(im + 20, y, W - im - 20, y);
  y += 5;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(108, 113, 115);
  const nextStep = doc.splitTextToSize(
    'Your Next Step: Discover your Islamic Investment Readiness Score — take the Akhirah Financial Compass at themuslim-investor.com/tools/compass',
    W - im * 2 - 20
  );
  doc.text(nextStep, W / 2, y, { align: 'center' });

  // ── Footer ───────────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(134, 166, 139);
  doc.text('themuslim-investor.com/pledge', W / 2, H - m - 4, { align: 'center' });

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
    setToday(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
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
        body: JSON.stringify({ timestamp: new Date().toISOString(), name: name.trim(), email: email.trim(), source: 'pledge_page' }),
      }).catch(() => {});
    }

    setSigned({ name: name.trim(), date: today });
    setSubmitting(false);
  };

  const handleDownloadPDF = async () => {
    if (!signed) return;
    try {
      await generatePledgePDF(signed.name, signed.date);
    } catch (e) {
      console.error(e);
      alert('PDF generation failed. Please try again.');
    }
  };

  const whatsappMessage = encodeURIComponent(
    'I just signed the TMI Mission Pledge — a covenant with Allah to steward my wealth with purity and purpose. Begin yours: themuslim-investor.com/pledge'
  );

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&family=Amiri:wght@400;700&display=swap');

        :root {
          --viridian: #358C6C;
          --onyx: #343840;
          --cambridge: #86A68B;
          --ivory: #EFF2E4;
          --dim: #6C7173;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--ivory);
          color: var(--onyx);
          font-family: 'Poppins', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* ─── Hero ─────────────────────────────────────────────────────────── */
        .pledge-hero {
          background: var(--onyx);
          color: var(--ivory);
          text-align: center;
          padding: 52px 24px 60px;
          position: relative;
          overflow: hidden;
        }
        .pledge-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 120%, rgba(53,140,108,0.22) 0%, transparent 70%);
          pointer-events: none;
        }

        /* FIX 1: Logo — plain img tag, no Next/Image wrapper issues */
        .hero-logo {
          height: 44px;
          width: auto;
          display: inline-block;
          margin-bottom: 28px;
          /* invert white so logo shows on dark background */
          filter: brightness(0) invert(1);
          position: relative;
          z-index: 1;
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
          position: relative;
          z-index: 1;
        }
        .hero-title {
          font-size: clamp(26px, 5vw, 42px);
          font-weight: 900;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--ivory);
          margin-bottom: 12px;
          line-height: 1.1;
          position: relative;
          z-index: 1;
        }
        .hero-bismillah {
          font-family: 'Amiri', serif;
          font-size: clamp(28px, 6vw, 46px);
          color: var(--cambridge);
          direction: rtl;
          margin: 6px 0 24px;
          line-height: 1.7;
          position: relative;
          z-index: 1;
        }
        .hero-subtitle {
          font-size: clamp(13px, 2.2vw, 16px);
          color: rgba(239,242,228,0.72);
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.75;
          position: relative;
          z-index: 1;
        }
        .hero-subtitle em { color: var(--cambridge); font-style: normal; font-weight: 600; }

        /* ─── Document ─────────────────────────────────────────────────────── */
        .pledge-doc-wrap {
          max-width: 740px;
          margin: 0 auto;
          padding: 48px 16px 0;
        }
        .pledge-doc {
          background: #fafaf5;
          border: 1.5px solid var(--cambridge);
          border-radius: 4px;
          padding: 44px 20px;
          position: relative;
          box-shadow: 0 8px 40px rgba(52,56,64,0.09);
        }
        @media (min-width: 600px) { .pledge-doc { padding: 60px 52px; } }

        .corner { position: absolute; width: 68px; height: 68px; }
        .corner-tl { top: 8px; left: 8px; }
        .corner-tr { top: 8px; right: 8px; transform: scaleX(-1); }
        .corner-bl { bottom: 8px; left: 8px; transform: scaleY(-1); }
        .corner-br { bottom: 8px; right: 8px; transform: scale(-1,-1); }

        .pledge-inner { text-align: center; position: relative; z-index: 1; }

        .doc-title {
          font-size: clamp(14px, 2.8vw, 20px);
          font-weight: 900;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--onyx);
          margin-bottom: 8px;
        }
        .doc-bismillah {
          font-family: 'Amiri', serif;
          font-size: clamp(24px, 5vw, 38px);
          color: var(--viridian);
          direction: rtl;
          margin: 4px 0 22px;
          line-height: 1.8;
        }
        .doc-divider {
          border: none;
          border-top: 1px solid var(--cambridge);
          opacity: 0.45;
          margin: 0 auto 26px;
          max-width: 55%;
        }
        .doc-opening {
          font-size: 13px;
          line-height: 1.85;
          color: var(--onyx);
          margin-bottom: 18px;
        }
        .doc-highlight {
          display: block;
          font-size: 14.5px;
          font-weight: 600;
          font-style: italic;
          color: var(--viridian);
          margin: 18px 0;
          line-height: 1.65;
        }
        .doc-transition {
          font-size: 13px;
          color: var(--dim);
          margin-bottom: 32px;
        }

        .pillars { display: flex; flex-direction: column; gap: 20px; margin-bottom: 32px; text-align: left; }

        .pillar {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 18px 18px 18px 14px;
          background: rgba(239,242,228,0.65);
          border-left: 3px solid var(--viridian);
          border-radius: 0 4px 4px 0;
        }
        .pillar-num {
          font-family: 'Amiri', serif;
          font-size: 22px;
          color: var(--viridian);
          font-weight: 700;
          min-width: 28px;
          line-height: 1.2;
          direction: rtl;
        }
        .pillar-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--onyx);
          margin-bottom: 6px;
          line-height: 1.4;
        }
        .pillar-text { font-size: 12px; color: #565656; line-height: 1.75; }

        .doc-closing {
          font-size: 13px;
          line-height: 1.85;
          font-style: italic;
          color: var(--onyx);
          margin-bottom: 28px;
        }
        .doc-footer-divider {
          border: none;
          border-top: 1px solid var(--cambridge);
          opacity: 0.4;
          margin: 0 auto 20px;
          max-width: 75%;
        }
        .doc-signed { font-size: 12px; font-style: italic; color: var(--dim); margin-bottom: 12px; }

        .sig-fields {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          max-width: 420px;
          margin: 0 auto;
        }
        .sig-field { flex: 1; text-align: center; }
        .sig-line {
          border-bottom: 1.5px solid var(--onyx);
          height: 30px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--onyx);
          padding-bottom: 4px;
          min-width: 110px;
        }
        .sig-label { font-size: 9px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

        /* ─── Sign Section ──────────────────────────────────────────────────── */
        .sign-section { max-width: 740px; margin: 0 auto; padding: 44px 16px 0; }

        .sign-card {
          background: var(--onyx);
          border-radius: 8px;
          padding: 36px 22px;
          color: var(--ivory);
        }
        @media (min-width: 600px) { .sign-card { padding: 44px 52px; } }

        .sign-heading { font-size: clamp(19px, 3.5vw, 26px); font-weight: 900; color: var(--ivory); margin-bottom: 8px; }
        .sign-sub { font-size: 13px; color: var(--cambridge); margin-bottom: 28px; line-height: 1.6; }

        .privacy {
          font-size: 11px;
          color: rgba(239,242,228,0.5);
          line-height: 1.65;
          margin-bottom: 26px;
          padding: 10px 14px;
          border: 1px solid rgba(134,166,139,0.22);
          border-radius: 4px;
        }

        .fields { display: flex; flex-direction: column; gap: 14px; margin-bottom: 22px; }

        .field-label {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--cambridge);
          margin-bottom: 5px;
          display: block;
        }
        .field-input {
          width: 100%;
          background: rgba(239,242,228,0.06);
          border: 1px solid rgba(134,166,139,0.38);
          border-radius: 4px;
          color: var(--ivory);
          font-family: 'Poppins', sans-serif;
          font-size: 13.5px;
          padding: 11px 14px;
          outline: none;
          transition: border-color 0.18s;
        }
        .field-input::placeholder { color: rgba(239,242,228,0.28); }
        .field-input:focus { border-color: var(--viridian); }
        .field-input[readonly] { opacity: 0.45; cursor: default; }

        .check-row { display: flex; gap: 11px; align-items: flex-start; margin-bottom: 24px; }
        .check-row input[type="checkbox"] { margin-top: 2px; width: 17px; height: 17px; accent-color: var(--viridian); flex-shrink: 0; cursor: pointer; }
        .check-label { font-size: 12.5px; color: rgba(239,242,228,0.78); line-height: 1.65; cursor: pointer; }

        .error {
          font-size: 12px;
          color: #e07070;
          margin-bottom: 14px;
          padding: 9px 13px;
          background: rgba(220,80,80,0.08);
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
          letter-spacing: 0.5px;
          padding: 15px 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.18s, transform 0.1s;
        }
        .btn-sign:hover:not(:disabled) { background: #2d7a5e; transform: translateY(-1px); }
        .btn-sign:disabled { opacity: 0.48; cursor: not-allowed; }

        /* Fix 6: Disclaimer */
        .disclaimer {
          margin-top: 20px;
          font-size: 11px;
          color: rgba(239,242,228,0.38);
          line-height: 1.65;
          text-align: center;
          padding: 0 8px;
        }

        /* ─── Confirmation ──────────────────────────────────────────────────── */
        .confirm { text-align: center; }
        .confirm-ameen {
          font-family: 'Amiri', serif;
          font-size: clamp(30px, 6vw, 46px);
          color: var(--cambridge);
          direction: rtl;
          margin-bottom: 14px;
        }
        .confirm-msg {
          font-size: clamp(14px, 2.4vw, 17px);
          font-weight: 600;
          color: var(--ivory);
          line-height: 1.7;
          margin-bottom: 10px;
        }
        .confirm-sub { font-size: 13px; color: rgba(239,242,228,0.55); margin-bottom: 32px; font-style: italic; }

        .confirm-actions {
          display: flex;
          flex-direction: column;
          gap: 11px;
          max-width: 380px;
          margin: 0 auto;
        }
        @media (min-width: 480px) {
          .confirm-actions { flex-direction: row; flex-wrap: wrap; justify-content: center; }
          .confirm-actions > * { flex: 1; min-width: 150px; }
        }

        .btn-dl {
          background: var(--viridian); color: white;
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          padding: 13px 18px; border: none; border-radius: 4px; cursor: pointer;
          transition: background 0.18s; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          text-decoration: none;
        }
        .btn-dl:hover { background: #2d7a5e; }

        .btn-wa {
          background: #25d366; color: white;
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          padding: 13px 18px; border: none; border-radius: 4px; cursor: pointer;
          transition: background 0.18s; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          text-decoration: none;
        }
        .btn-wa:hover { background: #1fb855; }

        .btn-next {
          background: transparent; color: var(--ivory);
          font-family: 'Poppins', sans-serif; font-size: 13px; font-weight: 600;
          padding: 13px 18px; border: 1px solid rgba(239,242,228,0.3); border-radius: 4px; cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          text-decoration: none;
        }
        .btn-next:hover { border-color: var(--cambridge); background: rgba(239,242,228,0.06); }

        /* ─── Page footer ───────────────────────────────────────────────────── */
        .page-footer {
          max-width: 740px;
          margin: 40px auto 0;
          padding: 0 16px 60px;
          text-align: center;
        }
        .page-footer p {
          font-size: 10.5px;
          color: var(--dim);
          line-height: 1.65;
          max-width: 560px;
          margin: 0 auto;
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="pledge-hero">
        {/* FIX 1: plain <img> with absolute path — no Next/Image wrapper */}
        <img
          src="/images/tmi-logo.png"
          alt="The Muslim Investor"
          className="hero-logo"
        />
        <div className="hero-tag">Course 1 · Resource 1</div>
        <h1 className="hero-title">The TMI Mission Pledge</h1>
        <div className="hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <p className="hero-subtitle">
          This is where your transformation begins. Before you learn a single investment concept,
          you make a <em>covenant with Allah</em> about how you will steward your wealth.
        </p>
      </section>

      {/* ── Pledge Document ── */}
      <div className="pledge-doc-wrap">
        <div className="pledge-doc">
          <div className="corner corner-tl"><CornerOrnament /></div>
          <div className="corner corner-tr"><CornerOrnament /></div>
          <div className="corner corner-bl"><CornerOrnament /></div>
          <div className="corner corner-br"><CornerOrnament /></div>

          <div className="pledge-inner">
            <h2 className="doc-title">The TMI Mission Pledge</h2>
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

            <div className="pillars">
              {PILLARS.map((p) => (
                <div className="pillar" key={p.title}>
                  <div className="pillar-num">{p.number}</div>
                  <div>
                    <div className="pillar-title">{p.title}</div>
                    <div className="pillar-text">{p.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <p className="doc-closing">
              This is my pledge. This is my mission. May Allah accept it from me and make me a
              source of benefit for the Ummah. Ameen.
            </p>

            <hr className="doc-footer-divider" />
            <p className="doc-signed">Signed in sincere commitment.</p>

            <div className="sig-fields">
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
      </div>

      {/* ── Sign / Confirmation ── */}
      <div className="sign-section">
        <div className="sign-card">

          {/* Fix 5: full post-sign confirmation */}
          {!signed ? (
            <>
              <h2 className="sign-heading">Sign Your Pledge</h2>
              <p className="sign-sub">Make your niyyah. Set your intention. Begin your Akhirah-first journey.</p>

              <p className="privacy">
                Your name personalizes your Pledge certificate. Your email delivers your signed PDF.
                We will never sell, share, or distribute your personal data to any external third party.
              </p>

              <div className="fields">
                <div>
                  <label className="field-label" htmlFor="p-name">Full Name</label>
                  <input id="p-name" type="text" className="field-input" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="p-email">Email Address</label>
                  <input id="p-email" type="email" className="field-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="field-label" htmlFor="p-date">Date</label>
                  <input id="p-date" type="text" className="field-input" value={today} readOnly />
                </div>
              </div>

              <div className="check-row">
                <input id="p-agree" type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                <label className="check-label" htmlFor="p-agree">
                  I have read the TMI Mission Pledge above and I sign it with sincere intention before Allah.
                </label>
              </div>

              {error && <div className="error">{error}</div>}

              <button className="btn-sign" onClick={handleSign} disabled={submitting}>
                {submitting ? 'Signing…' : 'Sign My Pledge'}
              </button>

              {/* Fix 6: Disclaimer */}
              <p className="disclaimer">
                This pledge is a personal spiritual commitment. The Muslim Investor is an educational
                platform — not a licensed financial advisory service. By signing, you are making a
                personal niyyah (intention) before Allah regarding the stewardship of your wealth.
              </p>
            </>
          ) : (
            /* Fix 5: confirmation state */
            <div className="confirm">
              <div className="confirm-ameen">آمِينَ</div>
              <p className="confirm-msg">
                Bismillah. Your Pledge is signed, {signed.name}.<br />
                May Allah accept it from you and make you a source of benefit for the Ummah.
              </p>
              <p className="confirm-sub">Ameen.</p>

              <div className="confirm-actions">
                <button className="btn-dl" onClick={handleDownloadPDF}>
                  ⬇ Download Signed PDF
                </button>
                <a
                  className="btn-wa"
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📲 Share on WhatsApp
                </a>
                <a className="btn-next" href="/tools/compass">
                  Take Your Next Step →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Page footer note ── */}
      <div className="page-footer">
        <p>
          themuslim-investor.com/pledge · Akhirah-first wealth stewardship for the Muslim investor
        </p>
      </div>
    </>
  );
}
