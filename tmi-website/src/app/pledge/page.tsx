'use client';

import { useState, useEffect } from 'react';

interface SignedState { name: string; date: string; }

const PILLARS = [
  { number: '١', title: 'Uphold the Primacy of the Akhirah', text: "I will strive to make every financial decision through the lens of the Day of Judgment, seeking Hasanat (good deeds) over worldly gains and prioritizing the pleasure of Allah above all else." },
  { number: '٢', title: 'Pursue Purity with Unshakeable Integrity', text: "I will be relentless in my effort to purify my wealth from Riba (interest) and all Haram sources. I will not compromise my principles for convenience or profit." },
  { number: '٣', title: 'Transform Knowledge into Action (Amal)', text: "I will not be a passive student. I will take the knowledge I gain on this platform and actively apply it to my life, taking responsibility for its stewardship." },
  { number: '٤', title: "View My Wealth as a Tool for Khayr (Good)", text: "I will see my portfolio not as an end in itself, but as an engine to fuel my 'Ibadah (worship), to increase my Sadaqah (charity), and to become a pillar of strength for my family and the Ummah." },
  { number: '٥', title: 'Embrace the Journey with Sabr (Patience) and Tawakkul (Trust)', text: "I will be patient during trials, grateful during blessings, and trust in Allah's plan, knowing that true success lies only with Him." },
];

// ── Render Bismillah to canvas image using browser's loaded Amiri font ─────────
// This is the bulletproof approach: Amiri is loaded via Google Fonts on the page,
// so the browser CAN render Arabic correctly. We capture it as an image for the PDF.
async function getBismillahImage(color = '#358C6C'): Promise<string> {
  return new Promise((resolve) => {
    const render = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 130;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      ctx.font = '80px Amiri, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.direction = 'rtl';
      ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', 450, 65);
      resolve(canvas.toDataURL('image/png'));
    };
    if (document.fonts) {
      document.fonts.load('80px Amiri').then(render).catch(render);
    } else {
      setTimeout(render, 600);
    }
  });
}

// ── Load logo as base64 ────────────────────────────────────────────────────────
async function getLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch('/logo-light.png');
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

// ── PDF Certificate Generator ──────────────────────────────────────────────────
async function generatePledgePDF(signerName: string, signerDate: string): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const [bismillahImg, logoData] = await Promise.all([
    getBismillahImage('#358C6C'),
    getLogoBase64(),
  ]);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const m = 13;
  const tx = 24;
  const tw = W - tx * 2;

  // Background: ivory
  doc.setFillColor(239, 242, 228);
  doc.rect(0, 0, W, H, 'F');

  // Outer border: Viridian
  doc.setDrawColor(53, 140, 108);
  doc.setLineWidth(1.8);
  doc.rect(m, m, W - m * 2, H - m * 2);

  // Inner border: Cambridge Blue
  doc.setDrawColor(134, 166, 139);
  doc.setLineWidth(0.6);
  doc.rect(m + 4, m + 4, W - (m + 4) * 2, H - (m + 4) * 2);

  // Corner ornaments
  const drawCorner = (ox: number, oy: number, fx: number, fy: number) => {
    doc.setDrawColor(53, 140, 108); doc.setLineWidth(0.8);
    doc.line(ox, oy + fy * 2, ox, oy + fy * 16);
    doc.line(ox + fx * 2, oy, ox + fx * 16, oy);
    doc.setDrawColor(134, 166, 139); doc.setLineWidth(0.4);
    doc.line(ox + fx * 4, oy + fy * 4, ox + fx * 4, oy + fy * 12);
    doc.line(ox + fx * 4, oy + fy * 4, ox + fx * 12, oy + fy * 4);
    doc.setFillColor(53, 140, 108);
    doc.circle(ox + fx * 2, oy + fy * 2, 1.2, 'F');
    doc.circle(ox + fx * 1, oy + fy * 16, 0.8, 'F');
    doc.circle(ox + fx * 16, oy + fy * 1, 0.8, 'F');
    doc.setDrawColor(53, 140, 108); doc.setLineWidth(0.5);
    doc.circle(ox + fx * 7, oy + fy * 3, 0.7, 'S');
    doc.circle(ox + fx * 3, oy + fy * 7, 0.7, 'S');
  };
  drawCorner(m + 1, m + 1, 1, 1);
  drawCorner(W - m - 1, m + 1, -1, 1);
  drawCorner(m + 1, H - m - 1, 1, -1);
  drawCorner(W - m - 1, H - m - 1, -1, -1);

  let y = m + 10;

  // Logo
  if (logoData) {
    const lw = 32, lh = 13;
    doc.addImage(logoData, 'PNG', (W - lw) / 2, y, lw, lh);
    y += lh + 5;
  } else {
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(53, 140, 108);
    doc.text('THE MUSLIM INVESTOR', W / 2, y + 6, { align: 'center' });
    y += 12;
  }

  // Line under logo
  doc.setDrawColor(134, 166, 139); doc.setLineWidth(0.4);
  doc.line(tx + 20, y, W - tx - 20, y);
  y += 5;

  // Title
  doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(52, 56, 64);
  doc.setCharSpace(2);
  doc.text('THE TMI MISSION PLEDGE', W / 2, y, { align: 'center' });
  doc.setCharSpace(0);
  y += 5;

  // Bismillah — canvas image with correct Arabic rendering
  const bw = 85, bh = 20;
  doc.addImage(bismillahImg, 'PNG', (W - bw) / 2, y - 2, bw, bh);
  y += bh + 1;

  // Divider
  doc.setDrawColor(134, 166, 139); doc.setLineWidth(0.5);
  doc.line(tx + 15, y, W - tx - 15, y);
  y += 7;

  // Opening
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.8); doc.setTextColor(52, 56, 64);
  const open = doc.splitTextToSize("I begin this journey not merely to learn about finance, but to answer a call from my soul. I recognize that my wealth, my time, and my knowledge are not my own; they are an Amanah — a sacred trust from Allah Subhanahu wa Ta'ala. My goal is not just profit, my goal is purity.", tw);
  doc.text(open, W / 2, y, { align: 'center' });
  y += open.length * 4.5 + 4;

  // Highlight
  doc.setFont('helvetica', 'bolditalic'); doc.setFontSize(9.5); doc.setTextColor(53, 140, 108);
  const hl = doc.splitTextToSize('My ultimate metric is not the return on my investment, but the return on my Akhirah.', tw - 10);
  doc.text(hl, W / 2, y, { align: 'center' });
  y += hl.length * 5 + 4;

  // Transition
  doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(108, 113, 115);
  doc.text('Therefore, with Allah as my witness, I make this niyyah (intention) and pledge to:', W / 2, y, { align: 'center' });
  y += 8;

  // Pillars
  PILLARS.forEach((pillar, idx) => {
    if (idx > 0) {
      doc.setDrawColor(134, 166, 139); doc.setLineWidth(0.25);
      doc.line(tx + 8, y - 1, W - tx - 8, y - 1);
      y += 3;
    }
    doc.setFillColor(53, 140, 108);
    doc.rect(tx, y - 3.5, 1.8, 11, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(52, 56, 64);
    const hd = doc.splitTextToSize(pillar.title, tw - 6);
    doc.text(hd, tx + 5, y, { maxWidth: tw - 6 });
    y += hd.length * 4.5 + 1.5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8.2); doc.setTextColor(85, 85, 85);
    const bd = doc.splitTextToSize(pillar.text, tw - 6);
    doc.text(bd, tx + 5, y);
    y += bd.length * 4 + 5;
  });

  // Closing dua
  doc.setDrawColor(53, 140, 108); doc.setLineWidth(0.4);
  doc.line(tx + 12, y, W - tx - 12, y);
  y += 6;
  doc.setFont('helvetica', 'bolditalic'); doc.setFontSize(9); doc.setTextColor(53, 140, 108);
  const cl = doc.splitTextToSize("This is my pledge. This is my mission. May Allah accept it from me and make me a source of benefit for the Ummah. Ameen.", tw - 10);
  doc.text(cl, W / 2, y, { align: 'center' });
  y += cl.length * 5 + 7;

  // Signed in sincere commitment
  doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(108, 113, 115);
  doc.text('Signed in sincere commitment.', tx, y);
  y += 9;

  // Signature lines
  const nx = tx, dx = W - tx - 50;
  doc.setDrawColor(52, 56, 64); doc.setLineWidth(0.7);
  doc.line(nx, y, nx + 72, y);
  doc.line(dx, y, dx + 48, y);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(52, 56, 64);
  doc.text(signerName, nx + 36, y - 3, { align: 'center' });
  doc.text(signerDate, dx + 24, y - 3, { align: 'center' });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(134, 166, 139);
  doc.text('Name', nx + 36, y + 4, { align: 'center' });
  doc.text('Date', dx + 24, y + 4, { align: 'center' });
  y += 14;

  // Next step CTA
  doc.setDrawColor(134, 166, 139); doc.setLineWidth(0.3);
  doc.line(tx + 18, y, W - tx - 18, y);
  y += 5;
  doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5); doc.setTextColor(108, 113, 115);
  const ns = doc.splitTextToSize('Your Next Step: Discover your Islamic Investment Readiness Score — take the Akhirah Financial Compass at themuslim-investor.com/tools/compass', tw - 20);
  doc.text(ns, W / 2, y, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(134, 166, 139);
  doc.text('themuslim-investor.com/pledge', W / 2, H - m - 5, { align: 'center' });

  doc.save(`TMI_Mission_Pledge_${signerName.replace(/\s+/g, '_')}.pdf`);
}

// ── Corner SVG ornament ────────────────────────────────────────────────────────
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

// ── Main Page ──────────────────────────────────────────────────────────────────
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
    try { await generatePledgePDF(signed.name, signed.date); }
    catch (e) { console.error(e); alert('PDF generation failed. Please try again.'); }
  };

  const whatsappMessage = encodeURIComponent(
    'I just signed the TMI Mission Pledge — a covenant with Allah to steward my wealth with purity and purpose. Begin yours: themuslim-investor.com/pledge'
  );

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;900&family=Amiri:wght@400;700&display=swap');
        :root { --viridian:#358C6C; --onyx:#343840; --cambridge:#86A68B; --ivory:#EFF2E4; --dim:#6C7173; }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:var(--ivory);color:var(--onyx);font-family:'Poppins',sans-serif;-webkit-font-smoothing:antialiased;}

        .pledge-hero{background:var(--onyx);color:var(--ivory);text-align:center;padding:52px 24px 60px;position:relative;overflow:hidden;}
        .pledge-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 120%,rgba(53,140,108,0.22) 0%,transparent 70%);pointer-events:none;}
        /* FIX 1: /logo-light.png is the white version — no filter needed */
        .hero-logo{height:44px;width:auto;display:inline-block;margin-bottom:28px;position:relative;z-index:1;}
        .hero-tag{display:inline-block;font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:var(--cambridge);border:1px solid rgba(134,166,139,0.4);padding:4px 16px;border-radius:2px;margin-bottom:20px;position:relative;z-index:1;}
        .hero-title{font-size:clamp(26px,5vw,42px);font-weight:900;letter-spacing:3px;text-transform:uppercase;color:var(--ivory);margin-bottom:12px;line-height:1.1;position:relative;z-index:1;}
        .hero-bismillah{font-family:'Amiri',serif;font-size:clamp(28px,6vw,46px);color:var(--cambridge);direction:rtl;margin:6px 0 24px;line-height:1.7;position:relative;z-index:1;}
        .hero-subtitle{font-size:clamp(13px,2.2vw,16px);color:rgba(239,242,228,0.72);max-width:580px;margin:0 auto;line-height:1.75;position:relative;z-index:1;}
        .hero-subtitle em{color:var(--cambridge);font-style:normal;font-weight:600;}

        .pledge-doc-wrap{max-width:740px;margin:0 auto;padding:48px 16px 0;}
        .pledge-doc{background:#fafaf5;border:1.5px solid var(--cambridge);border-radius:4px;padding:44px 20px;position:relative;box-shadow:0 8px 40px rgba(52,56,64,0.09);}
        @media(min-width:600px){.pledge-doc{padding:60px 52px;}}
        .corner{position:absolute;width:68px;height:68px;}
        .corner-tl{top:8px;left:8px;} .corner-tr{top:8px;right:8px;transform:scaleX(-1);} .corner-bl{bottom:8px;left:8px;transform:scaleY(-1);} .corner-br{bottom:8px;right:8px;transform:scale(-1,-1);}
        .pledge-inner{text-align:center;position:relative;z-index:1;}
        .doc-title{font-size:clamp(14px,2.8vw,20px);font-weight:900;letter-spacing:4px;text-transform:uppercase;color:var(--onyx);margin-bottom:8px;}
        .doc-bismillah{font-family:'Amiri',serif;font-size:clamp(24px,5vw,38px);color:var(--viridian);direction:rtl;margin:4px 0 22px;line-height:1.8;}
        .doc-divider{border:none;border-top:1px solid var(--cambridge);opacity:0.45;margin:0 auto 26px;max-width:55%;}
        .doc-opening{font-size:13px;line-height:1.85;color:var(--onyx);margin-bottom:18px;}
        .doc-highlight{display:block;font-size:14.5px;font-weight:600;font-style:italic;color:var(--viridian);margin:18px 0;line-height:1.65;}
        .doc-transition{font-size:13px;color:var(--dim);margin-bottom:32px;}
        .pillars{display:flex;flex-direction:column;gap:20px;margin-bottom:32px;text-align:left;}
        .pillar{display:flex;gap:14px;align-items:flex-start;padding:18px 18px 18px 14px;background:rgba(239,242,228,0.65);border-left:3px solid var(--viridian);border-radius:0 4px 4px 0;}
        .pillar-num{font-family:'Amiri',serif;font-size:22px;color:var(--viridian);font-weight:700;min-width:28px;line-height:1.2;direction:rtl;}
        .pillar-title{font-size:13px;font-weight:700;color:var(--onyx);margin-bottom:6px;line-height:1.4;}
        .pillar-text{font-size:12px;color:#565656;line-height:1.75;}
        .doc-closing{font-size:13px;line-height:1.85;font-style:italic;color:var(--onyx);margin-bottom:28px;}
        .doc-footer-divider{border:none;border-top:1px solid var(--cambridge);opacity:0.4;margin:0 auto 20px;max-width:75%;}
        .doc-signed{font-size:12px;font-style:italic;color:var(--dim);margin-bottom:12px;}
        .sig-fields{display:flex;justify-content:space-between;gap:20px;max-width:420px;margin:0 auto;}
        .sig-field{flex:1;text-align:center;}
        .sig-line{border-bottom:1.5px solid var(--onyx);height:30px;display:flex;align-items:flex-end;justify-content:center;font-size:12px;font-weight:600;color:var(--onyx);padding-bottom:4px;min-width:110px;}
        .sig-label{font-size:9px;color:var(--dim);text-transform:uppercase;letter-spacing:1px;margin-top:4px;}

        .sign-section{max-width:740px;margin:0 auto;padding:44px 16px 0;}
        .sign-card{background:var(--onyx);border-radius:8px;padding:36px 22px;color:var(--ivory);}
        @media(min-width:600px){.sign-card{padding:44px 52px;}}
        .sign-heading{font-size:clamp(19px,3.5vw,26px);font-weight:900;color:var(--ivory);margin-bottom:8px;}
        .sign-sub{font-size:13px;color:var(--cambridge);margin-bottom:28px;line-height:1.6;}
        .privacy{font-size:11px;color:rgba(239,242,228,0.5);line-height:1.65;margin-bottom:26px;padding:10px 14px;border:1px solid rgba(134,166,139,0.22);border-radius:4px;}
        .fields{display:flex;flex-direction:column;gap:14px;margin-bottom:22px;}
        .field-label{font-size:10.5px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--cambridge);margin-bottom:5px;display:block;}
        .field-input{width:100%;background:rgba(239,242,228,0.06);border:1px solid rgba(134,166,139,0.38);border-radius:4px;color:var(--ivory);font-family:'Poppins',sans-serif;font-size:13.5px;padding:11px 14px;outline:none;transition:border-color 0.18s;}
        .field-input::placeholder{color:rgba(239,242,228,0.28);}
        .field-input:focus{border-color:var(--viridian);}
        .field-input[readonly]{opacity:0.45;cursor:default;}
        .check-row{display:flex;gap:11px;align-items:flex-start;margin-bottom:24px;}
        .check-row input[type="checkbox"]{margin-top:2px;width:17px;height:17px;accent-color:var(--viridian);flex-shrink:0;cursor:pointer;}
        .check-label{font-size:12.5px;color:rgba(239,242,228,0.78);line-height:1.65;cursor:pointer;}
        .error-msg{font-size:12px;color:#e07070;margin-bottom:14px;padding:9px 13px;background:rgba(220,80,80,0.08);border-radius:4px;border-left:3px solid #e07070;}
        .btn-sign{width:100%;background:var(--viridian);color:white;font-family:'Poppins',sans-serif;font-size:15px;font-weight:700;letter-spacing:0.5px;padding:15px 32px;border:none;border-radius:4px;cursor:pointer;transition:background 0.18s,transform 0.1s;}
        .btn-sign:hover:not(:disabled){background:#2d7a5e;transform:translateY(-1px);}
        .btn-sign:disabled{opacity:0.48;cursor:not-allowed;}
        .disclaimer{margin-top:20px;font-size:11px;color:rgba(239,242,228,0.38);line-height:1.65;text-align:center;padding:0 8px;}

        .confirm{text-align:center;}
        .confirm-ameen{font-family:'Amiri',serif;font-size:clamp(30px,6vw,46px);color:var(--cambridge);direction:rtl;margin-bottom:14px;}
        .confirm-msg{font-size:clamp(14px,2.4vw,17px);font-weight:600;color:var(--ivory);line-height:1.7;margin-bottom:10px;}
        .confirm-sub{font-size:13px;color:rgba(239,242,228,0.55);margin-bottom:32px;font-style:italic;}
        .confirm-actions{display:flex;flex-direction:column;gap:11px;max-width:380px;margin:0 auto;}
        @media(min-width:480px){.confirm-actions{flex-direction:row;flex-wrap:wrap;justify-content:center;}.confirm-actions>*{flex:1;min-width:150px;}}
        .btn-dl{background:var(--viridian);color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;padding:13px 18px;border:none;border-radius:4px;cursor:pointer;transition:background 0.18s;display:inline-flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;}
        .btn-dl:hover{background:#2d7a5e;}
        .btn-wa{background:#25d366;color:white;font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;padding:13px 18px;border:none;border-radius:4px;cursor:pointer;transition:background 0.18s;display:inline-flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;}
        .btn-wa:hover{background:#1fb855;}
        .btn-next{background:transparent;color:var(--ivory);font-family:'Poppins',sans-serif;font-size:13px;font-weight:600;padding:13px 18px;border:1px solid rgba(239,242,228,0.3);border-radius:4px;cursor:pointer;transition:border-color 0.18s,background 0.18s;display:inline-flex;align-items:center;justify-content:center;gap:6px;text-decoration:none;}
        .btn-next:hover{border-color:var(--cambridge);background:rgba(239,242,228,0.06);}

        .page-footer{max-width:740px;margin:36px auto 0;padding:0 16px 60px;text-align:center;}
        .page-footer p{font-size:10.5px;color:var(--dim);line-height:1.65;max-width:560px;margin:0 auto;}
      `}</style>

      {/* Hero */}
      <section className="pledge-hero">
        {/* FIX 1: /logo-light.png — white logo for dark background, no filter */}
        <img src="/logo-light.png" alt="The Muslim Investor" className="hero-logo" />
        <div className="hero-tag">Course 1 · Resource 1</div>
        <h1 className="hero-title">The TMI Mission Pledge</h1>
        <div className="hero-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
        <p className="hero-subtitle">
          This is where your transformation begins. Before you learn a single investment concept,
          you make a <em>covenant with Allah</em> about how you will steward your wealth.
        </p>
      </section>

      {/* Pledge Document */}
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

      {/* Sign / Confirmation */}
      <div className="sign-section">
        <div className="sign-card">
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
              {error && <div className="error-msg">{error}</div>}
              <button className="btn-sign" onClick={handleSign} disabled={submitting}>
                {submitting ? 'Signing…' : 'Sign My Pledge'}
              </button>
              <p className="disclaimer">
                This pledge is a personal spiritual commitment. The Muslim Investor is an educational
                platform — not a licensed financial advisory service. By signing, you are making a
                personal niyyah (intention) before Allah regarding the stewardship of your wealth.
              </p>
            </>
          ) : (
            <div className="confirm">
              <div className="confirm-ameen">آمِينَ</div>
              <p className="confirm-msg">
                Bismillah. Your Pledge is signed, {signed.name}.<br />
                May Allah accept it from you and make you a source of benefit for the Ummah.
              </p>
              <p className="confirm-sub">Ameen.</p>
              <div className="confirm-actions">
                <button className="btn-dl" onClick={handleDownloadPDF}>⬇ Download Signed PDF</button>
                <a className="btn-wa" href={`https://wa.me/?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">📲 Share on WhatsApp</a>
                <a className="btn-next" href="/tools/compass">Take Your Next Step →</a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="page-footer">
        <p>themuslim-investor.com/pledge · Akhirah-first wealth stewardship for the Muslim investor</p>
      </div>
    </>
  );
}
