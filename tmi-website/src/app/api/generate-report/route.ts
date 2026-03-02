import { NextResponse } from 'next/server';
import { PROFILES, ALLOCATIONS, calculateScores, determineProfile } from '../../tools/profile/data/profile-data';

// ============================================================================
// GOOGLE SHEETS WEBHOOK — fire-and-forget, never blocks the user
// ============================================================================
async function fireWebhook(data: {
  name: string;
  email: string;
  profileType: string;
  spiritual_focus: number;
  risk_tolerance: number;
  knowledge_level: number;
  time_horizon: number;
  financial_stability: number;
  allocation: Record<string, number>;
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: data.name,
        email: data.email,
        profile_type: data.profileType,
        spiritual_focus: data.spiritual_focus,
        risk_tolerance: data.risk_tolerance,
        knowledge_level: data.knowledge_level,
        time_horizon: data.time_horizon,
        financial_stability: data.financial_stability,
        allocation: JSON.stringify(data.allocation),
      }),
    });
  } catch (e) {
    console.error("Webhook failed (non-blocking):", e);
  }
}

// ============================================================================
// PROMPT BUILDER
// ============================================================================
function buildPrompt(answers: Record<string, string>, scores: Record<string, number>, profileKey: string, userName: string): string {
  const profile = PROFILES[profileKey as keyof typeof PROFILES];
  const alloc = ALLOCATIONS[profileKey as keyof typeof ALLOCATIONS];

  return `You are a warm, knowledgeable Islamic finance advisor creating a personalized investment report for a Muslim. Write with the voice of The Muslim Investor (TMI) — an Akhirah-first wealth platform. Your tone is warm, direct, spiritually grounded, and professionally authoritative. Address the reader as "you" personally.

USER: ${userName}
PROFILE: ${profile.name} ${profile.emoji}

IIRS (Islamic Investment Readiness Score) — Scores 0-100:
- Spiritual Focus: ${scores.spiritual_focus}
- Risk Tolerance: ${scores.risk_tolerance}
- Knowledge Level: ${scores.knowledge_level}
- Time Horizon: ${scores.time_horizon}
- Financial Stability: ${scores.financial_stability}

ALLOCATION: ${JSON.stringify(alloc.allocation)}
RECOMMENDED FUNDS: ${JSON.stringify(alloc.funds)}

USER ANSWERS: ${JSON.stringify(answers)}

Generate a personalized 8-part investment report. This report will be exported as a PDF the user keeps — be thorough and comprehensive.

PART 1: OPENING (3 paragraphs) — Warm "Assalamu Alaikum" greeting using their name (${userName}), acknowledge their courage in seeking halal wealth, frame this as preparing their answer for the Day of Judgment when Allah will ask "How did you earn it and how did you spend it?"

PART 2: YOUR PROFILE (3 paragraphs) — Explain ${profile.name} in depth: strengths, what it means for their investment approach, how it connects to their personality. Be specific to their answers.

PART 3: SPIRITUAL-PSYCHOLOGICAL PROFILE (3 paragraphs) — Connect investing personality to Akhirah goals. Include a relevant hadith with attribution. Discuss their IIRS spiritual focus score of ${scores.spiritual_focus}/100.

PART 4: ASSET ALLOCATION (detailed) — Present allocation as a markdown table. Present all 4 fund recommendations with tickers. For EACH fund, explain in 2-3 sentences WHY it fits this specific profile.

PART 5: 90-DAY ACTION PLAN (detailed) — Week-by-week actionable steps for Days 1-30, 31-60, 61-90. Be concrete and practical.

PART 6: ISLAMIC FINANCE GUIDANCE (tailored) — Tailored to knowledge level (${scores.knowledge_level}/100). Beginner = Riba, screening, purification fundamentals. Advanced = AAOIFI standards, Sukuk structures, complex alternatives.

PART 7: RESOURCES & NEXT STEPS — Recommend TMI courses, Akhirah Financial Compass, TMI community on Skool (themuslim-investor.com).

PART 8: CLOSING & DU'A (inspiring) — Every step toward halal wealth is worship. Wealth is an Amanah. End with du'a: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ"

IMPORTANT: The educational disclaimer "This report provides educational guidance based on Islamic finance principles and is not personalized financial advice" should appear naturally near the allocation section.

TONE: Warm, personal, spiritually grounded. Reference their specific answers.
FORMAT: Use markdown headers (##), bullet points, tables.
LENGTH: ~2500-3000 words. This is a keepable PDF — be thorough.`;
}

// ============================================================================
// FALLBACK REPORT
// ============================================================================
function generateFallbackReport(answers: Record<string, string>, scores: Record<string, number>, profileKey: string, userName: string): string {
  const profile = PROFILES[profileKey as keyof typeof PROFILES];
  const alloc = ALLOCATIONS[profileKey as keyof typeof ALLOCATIONS];

  return `## بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

---

## Part 1: Opening

Assalamu Alaikum wa Rahmatullahi wa Barakatuh, dear ${userName},

Alhamdulillah, you have taken an important step on your journey toward aligning your wealth with your faith. By completing this assessment, you have demonstrated a commitment that sets you apart — the willingness to ask yourself the hard questions about how your money serves your Akhirah.

Your responses reveal someone who understands that wealth is an Amanah — a sacred trust from Allah Subhanahu wa Ta'ala. On the Day of Judgment, when you are asked "How did you earn it and how did you spend it?", this assessment is part of preparing your answer.

---

## Part 2: Your Investor Profile

**You are: ${profile.name} ${profile.emoji}**

${profile.desc}

This profile reflects your unique combination of spiritual conviction, risk comfort, financial knowledge, and life circumstances. There is no "better" or "worse" profile — each represents a different path to the same destination: wealth that pleases Allah and serves your Akhirah.

Your Islamic Investment Readiness Score (IIRS) captures five dimensions that together paint a complete picture of your investing personality.

---

## Part 3: Spiritual-Psychological Profile

Your spiritual focus score of ${scores.spiritual_focus}/100 indicates ${scores.spiritual_focus > 60 ? "a strong connection between your faith and your financial decisions. This is a powerful foundation — your investments are not just financial instruments but acts of worship." : "an opportunity to deepen the connection between your daily faith practice and your financial decisions. As you grow in this dimension, you will find that investing becomes an extension of your 'ibadah."}

The Prophet Muhammad ﷺ said: *"The believer's shade on the Day of Resurrection will be his charity."* (Tirmidhi)

Your risk tolerance of ${scores.risk_tolerance}/100 and knowledge level of ${scores.knowledge_level}/100 combine to shape how you should approach the markets. With a time horizon score of ${scores.time_horizon}/100 and financial stability of ${scores.financial_stability}/100, your IIRS profile is well-suited to the allocation recommended below.

---

## Part 4: Asset Allocation

**Your Recommended Allocation:**

| Asset Class | Allocation |
|-------------|------------|
${Object.entries(alloc.allocation).map(([k, v]) => `| ${k} | ${v}% |`).join("\n")}

**Recommended Funds:**

${alloc.funds.map((f, i) => `**${i + 1}. ${f.name}** (${f.ticker}) — *${f.type}*
${f.rationale}. This fund was selected specifically for your ${profile.name} profile because it aligns with your risk tolerance and investment goals while maintaining full Shariah compliance.`).join("\n\n")}

*Note: These are educational examples of Shariah-compliant funds, not personalized buy/sell recommendations. Consult a qualified advisor before making investment decisions.*

---

## Part 5: 90-Day Action Plan

**Days 1-30 — Foundation Phase:**
- Complete a full financial audit: list all assets, debts, and monthly cash flows
- Ensure you have 3-6 months of expenses in an emergency fund
- Open a Shariah-compliant brokerage account
- Calculate and set aside your Zakat obligation
- Read the TMI Foundation Course materials

**Days 31-60 — Execution Phase:**
- Make your first investment following the allocation above
- Set up automatic monthly contributions
- Begin the TMI curriculum to deepen your understanding
- Join the TMI community on Skool for accountability and support

**Days 61-90 — Optimization Phase:**
- Review your portfolio performance and rebalance if needed
- Increase your contribution amount if financially comfortable
- Identify one area of Islamic finance knowledge to deepen
- Schedule a quarterly review routine going forward

---

## Part 6: Islamic Finance Guidance

${scores.knowledge_level < 50 ?
"**Fundamentals:** Riba (interest) is prohibited — this is one of the clearest commands in the Quran. Shariah screening filters companies by business activity and financial ratios. Purification means donating any incidental haram income to charity to keep your wealth clean." :
"**Advanced:** AAOIFI standards for global compliance. Sukuk structures (Ijarah, Murabaha, Musharakah, Wakalah) carry different risk profiles. Islamic alternatives exist for every conventional product — Diminishing Musharakah for mortgages, Takaful for insurance, Mudarabah for partnerships."}

---

## Part 7: Resources & Next Steps

- **TMI Foundation Course** — Comprehensive halal investing principles
- **Akhirah Financial Compass** — Complete financial assessment at themuslim-investor.com/tools
- **TMI Community on Skool** — Weekly Q&A, accountability, and support at themuslim-investor.com
- **Portfolio Command Center** — Track and manage your halal portfolio

---

## Part 8: Closing & Du'a

Dear ${userName}, every step you take toward purifying your wealth is an act of worship. Every dirham, dollar, or pound that you invest with the consciousness of Allah is a seed planted for your Akhirah.

Remember: your ultimate metric is not the return on your investment, but the return on your Akhirah.

اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

*"O Allah, suffice me with what You have permitted instead of what You have forbidden, and enrich me by Your Grace so that I need none other than You."*

May Allah bless your wealth, multiply your Hasanat, and accept this effort from you.

**— The Muslim Investor Team**`;
}

// ============================================================================
// API HANDLER
// ============================================================================
export async function POST(request: Request) {
  try {
    const { answers, name, email } = await request.json();

    if (!answers || Object.keys(answers).length < 30) {
      return NextResponse.json({ success: false, error: "Please complete all questions." }, { status: 400 });
    }

    const userName = name || answers.q1 || "Brother/Sister";
    const scores = calculateScores(answers);
    const profileKey = determineProfile(scores);
    const profile = PROFILES[profileKey as keyof typeof PROFILES];
    const alloc = ALLOCATIONS[profileKey as keyof typeof ALLOCATIONS];
    const prompt = buildPrompt(answers, scores, profileKey, userName);

    let report = "";
    let method = "fallback";

    const apiKey = process.env.CLAUDE_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        if (response.ok) {
          const data = await response.json();
          report = data.content?.[0]?.text || "";
          method = "claude";
        } else {
          console.error("Claude API error:", response.status);
        }
      } catch (e) {
        console.error("Claude API call failed:", e);
      }
    }

    if (!report) {
      report = generateFallbackReport(answers, scores, profileKey, userName);
      method = "fallback";
    }

    // Fire-and-forget webhook — NEVER blocks the response
    fireWebhook({
      name: userName,
      email: email || "",
      profileType: profile.name,
      spiritual_focus: scores.spiritual_focus,
      risk_tolerance: scores.risk_tolerance,
      knowledge_level: scores.knowledge_level,
      time_horizon: scores.time_horizon,
      financial_stability: scores.financial_stability,
      allocation: alloc.allocation,
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      profile: `${profile.name} ${profile.emoji}`,
      profileKey,
      desc: profile.desc,
      report,
      scores,
      allocation: alloc.allocation,
      funds: alloc.funds,
      method,
      userName,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: "An error occurred. Please try again." }, { status: 500 });
  }
}
