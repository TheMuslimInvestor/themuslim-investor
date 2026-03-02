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
// AI PROMPT — aligned to TMI Copywriting Foundation v2
// ============================================================================
function buildPrompt(
  answers: Record<string, string>,
  scores: Record<string, number>,
  profileKey: string,
  userName: string
): string {
  const profile = PROFILES[profileKey as keyof typeof PROFILES];
  const alloc = ALLOCATIONS[profileKey as keyof typeof ALLOCATIONS];

  return `You are Mehdi, the founder of The Muslim Investor — a senior Sukuk portfolio manager in Dubai managing $500M in Islamic assets. You are writing a personalized investor profile report for a Muslim who just completed the TMI Investor Profile assessment.

CRITICAL VOICE AND MISSION GUIDELINES:

1. TMI's mission is NOT wealth building. It is preparing Muslims to answer Allah's questions about their wealth on the Day of Judgment. Frame everything through this lens. The Akhirah comes first. Always. The portfolio serves the Akhirah, not the other way around.

2. NEVER say "build halal wealth" as the primary goal. Say "prepare your answer" or "steward your Amanah" or "align your wealth with your Akhirah."

3. NEVER recommend specific funds, ETFs, stocks, Sukuk, or financial products by name. NEVER name specific brokerage platforms. The allocation percentages are educational — the specific instruments are taught in the TMI curriculum (Courses 3-6).

4. NEVER use the word "journey" — use "path," "process," "transformation," or "preparation."

5. The tone is warm, direct, and spiritually grounded — like a trusted older brother who happens to manage $500M in Islamic assets. Not a sales pitch. Not a robo-advisor. Not a khutbah.

6. Reference the user's SPECIFIC answers throughout. If they mentioned their profession — weave it in. If family is their priority — address it. If their risk tolerance is low — validate it islamically.

7. Use Quran and Hadith naturally — not as decoration but as genuine guidance that connects to their specific situation. Always include proper attribution.

8. The 5 dimension scores are called "Investor DNA" — NOT "IIRS" (the IIRS belongs to a separate tool, the Akhirah Financial Compass).

9. Sign off as "Mehdi — Founder, The Muslim Investor" — there is no "team."

USER: ${userName}
PROFILE: ${profile.name} ${profile.emoji}

INVESTOR DNA — 5 Dimensions (0-100):
- Spiritual Focus: ${scores.spiritual_focus}
- Risk Tolerance: ${scores.risk_tolerance}
- Knowledge Level: ${scores.knowledge_level}
- Time Horizon: ${scores.time_horizon}
- Financial Stability: ${scores.financial_stability}

RECOMMENDED ALLOCATION: ${JSON.stringify(alloc.allocation)}
ALLOCATION RATIONALE: ${alloc.rationale}

USER ANSWERS: ${JSON.stringify(answers)}

Generate a personalized 8-part TMI Investor Profile Report. This will be exported as a PDF the user keeps — be thorough, personal, and spiritually grounded.

PART 1: OPENING (3 paragraphs)
Open with "Assalamu Alaikum" using their name (${userName}). Acknowledge that their wealth is an Amanah — a sacred trust from Allah Subhanahu wa Ta'ala. Frame this assessment as the first step toward preparing their answer for the Day of Judgment, when they will be asked "How did you earn your wealth and how did you spend it?" (reference Sunan al-Tirmidhi 2417). Do NOT frame this as "building wealth" — frame it as preparing their answer and stewarding their Amanah.

PART 2: YOUR PROFILE — ${profile.name} (3 paragraphs)
Explain their profile in depth: what it means, their strengths, how it connects to their specific answers. Be specific — reference their profession, their stated goals, their motivations. Validate their approach islamically.

PART 3: YOUR INVESTOR DNA — SPIRITUAL-PSYCHOLOGICAL PROFILE (3 paragraphs)
Connect their 5 dimension scores to their spiritual and financial reality. Include a relevant Quran ayah or hadith with proper attribution that connects to their specific situation. Discuss what their Spiritual Focus score of ${scores.spiritual_focus}/100 means for their relationship between faith and finances.

PART 4: YOUR RECOMMENDED ALLOCATION (detailed)
Present the allocation as a markdown table showing asset class and percentage. Then write 2-3 paragraphs explaining WHY this specific allocation fits their profile — connect it to their risk tolerance, time horizon, and financial stability scores. Explain what each asset class does for their portfolio in plain language.

IMPORTANT: Do NOT name any specific funds, ETFs, tickers, or financial products. Do NOT name any brokerage platforms. Instead, end this section with: "You will learn how to select specific Shariah-compliant instruments within each asset class in TMI Courses 3-5. The curriculum teaches you the evaluation framework — so you can make informed decisions yourself, not follow someone else's picks."

PART 5: YOUR SADAQAH CONNECTION (1-2 paragraphs)
Connect their profile to the ultimate goal: growing their capacity to give. Reference Quran 2:261 (the seed that grows 700 times). Their ${profile.name} allocation is not just about their portfolio — it is about growing their capacity to be a pillar of strength for their family and the Ummah. "The ultimate metric is not the return on your investment, but the return on your Akhirah."

PART 6: YOUR 90-DAY ACTION PLAN
This plan guides them through the TMI curriculum — NOT into trading. Structure it exactly as follows:

**Days 1-7: Your Spiritual Foundation**
- Sign the TMI Mission Pledge — a covenant between you and Allah about how you will steward your wealth (Course 1)
- Perform an Emergency Purification Audit — scan your current holdings for any haram exposure using the TMI Halal Portfolio Screener (Course 1)
- If haram is found, follow the Emergency Purification Guide to cleanse immediately

**Days 8-30: Know Your Financial Reality**
- Take the Akhirah Financial Compass to discover your IIRS (Islamic Investment Readiness Score) — this tells you whether your financial foundation is solid enough to invest, or whether you need to fix it first (Course 2)
- Based on your IIRS, you will know: Do you need to eliminate Riba first? Do you need to build your emergency fund? Is your savings rate strong enough?
- Review your existing portfolio (if you have one) in light of your Investor Profile AND your IIRS

**Days 31-60: Build Your Knowledge**
- Complete Course 3: The Halal Arsenal — understand the six halal asset classes at institutional depth
- Complete Course 4: The Macro System — learn to read the economic environment so you know WHEN conditions favor different allocations
- Your ${profile.name} allocation will make much more sense once you understand each asset class deeply

**Days 61-90: Prepare for Execution**
- Complete Course 5: Portfolio & Risk Management — learn to use the Amanah Portfolio Command Center
- Complete Course 6: Execution & Systems — when (and only when) you are educated and ready, this course guides you through selecting a Shariah-compliant platform and making your first informed decision
- Begin your 15-20 minute weekly ritual

**Ongoing: Your Akhirah Investment**
- Complete Course 7: Zakat & Wealth Purification
- Increase your Sadaqah capacity — the ultimate ROI
- Stay connected with the TMI community

PART 7: ISLAMIC GUIDANCE (tailored to knowledge level ${scores.knowledge_level}/100)
For beginners: explain the fundamentals of why Riba is prohibited, what Shariah screening means, and why purification matters — with Quran/Hadith references.
For advanced: discuss nuanced concepts appropriate to their level.
Always educational and encouraging. Never condescending.

PART 8: CLOSING & DU'A
Powerful, personal encouragement. Every step toward purifying their wealth is an act of worship. Their portfolio will testify — either for them or against them. Remind them they are not alone — the TMI community walks with them.

End with this du'a:
"اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ"
"O Allah, suffice me with what You have permitted instead of what You have forbidden, and enrich me by Your Grace so that I need none other than You."

Sign off as: "Mehdi — Founder, The Muslim Investor"

TONE: Warm, direct, spiritually grounded. Reference their specific answers. Like a trusted older brother.
FORMAT: Use markdown headers (##), bullet points, tables where appropriate.
LENGTH: ~2500-3000 words. This PDF must be worth keeping.`;
}

// ============================================================================
// FALLBACK REPORT — full 8-part static version (no AI needed)
// ============================================================================
function generateFallbackReport(
  answers: Record<string, string>,
  scores: Record<string, number>,
  profileKey: string,
  userName: string
): string {
  const profile = PROFILES[profileKey as keyof typeof PROFILES];
  const alloc = ALLOCATIONS[profileKey as keyof typeof ALLOCATIONS];

  return `## بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

---

## Part 1: Opening

Assalamu Alaikum wa Rahmatullahi wa Barakatuh, dear ${userName},

Alhamdulillah — you have done something most Muslims never do. You have stopped, reflected, and asked yourself the hard questions about your wealth and your faith. That takes courage. And that courage is itself an act of worship.

Your wealth is not yours. It is an Amanah — a sacred trust from Allah Subhanahu wa Ta'ala. And the Prophet ﷺ told us that on the Day of Judgment, our feet will not move until we are asked about five matters — and two of them are about money: *"How did you earn your wealth, and how did you spend it?"* (Sunan al-Tirmidhi 2417). This assessment is the first step in preparing your answer.

This is not about portfolio returns. This is not about beating the market. This is about standing before your Lord with a clean account and a clear conscience. Let us begin.

---

## Part 2: Your Investor Profile

**You are: ${profile.name} ${profile.emoji}**

${profile.desc}

This profile is not a label — it is a mirror. It reflects your unique combination of spiritual conviction, risk comfort, knowledge depth, planning horizon, and financial stability. There is no "better" or "worse" profile. Each represents a different path toward the same destination: wealth that pleases Allah and serves your Akhirah.

Your Investor DNA — the five dimensions measured in this assessment — paints a complete picture of who you are as an investor. Understanding yourself is the first step. The TMI curriculum teaches you everything else.

---

## Part 3: Your Investor DNA — Spiritual-Psychological Profile

Your Spiritual Focus score of ${scores.spiritual_focus}/100 indicates ${scores.spiritual_focus > 60 ? "a powerful connection between your faith and your financial decisions. This is your greatest asset — far more valuable than any fund or allocation. When your investments are an extension of your 'Ibadah, every financial decision becomes an act of worship." : "an opportunity to deepen the connection between your daily faith practice and your financial decisions. This is not a weakness — it is a starting point. As you work through the TMI curriculum, you will find that investing becomes an extension of your 'Ibadah, not a distraction from it."}

Allah Subhanahu wa Ta'ala reminds us: *"And whoever fears Allah — He will make for him a way out and will provide for him from where he does not expect."* (Quran 65:2-3). Your decision to seek halal is itself an act of Tawakkul.

Your risk tolerance of ${scores.risk_tolerance}/100 combined with your knowledge level of ${scores.knowledge_level}/100 shapes how you should approach the markets. ${scores.knowledge_level < 50 ? "The TMI curriculum is designed to systematically build your knowledge — Course 3 alone will transform your understanding of the six halal asset classes." : "Your existing knowledge gives you a strong foundation. The TMI curriculum will add institutional-grade frameworks to what you already know."} With a time horizon score of ${scores.time_horizon}/100 and financial stability of ${scores.financial_stability}/100, the allocation below is calibrated precisely for you.

---

## Part 4: Your Recommended Allocation

| Asset Class | Allocation |
|-------------|------------|
${Object.entries(alloc.allocation).map(([k, v]) => `| ${k} | ${v}% |`).join("\n")}

${alloc.rationale}

You will learn how to select specific Shariah-compliant instruments within each asset class in TMI Courses 3-5. The curriculum teaches you the evaluation framework — so you can make informed decisions yourself, not follow someone else's picks.

---

## Part 5: Your Sadaqah Connection

Your ${profile.name} allocation is not just about your portfolio — it is about growing your capacity to give. Every dirham of Sadaqah is an investment with returns guaranteed by Allah: *"The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains. And Allah multiplies for whom He wills."* (Quran 2:261)

As your halal wealth compounds over time, so does your ability to be a pillar of strength for your family and the Ummah. The ultimate metric is not the return on your investment, but the return on your Akhirah.

---

## Part 6: Your 90-Day Action Plan

**Days 1-7: Your Spiritual Foundation**
- Sign the **TMI Mission Pledge** — a covenant between you and Allah about how you will steward your wealth (Course 1, Resource 1)
- Perform an **Emergency Purification Audit** — scan your current holdings for any haram exposure using the TMI Halal Portfolio Screener (Course 1)
- If haram is found, follow the **Emergency Purification Guide** to cleanse immediately

**Days 8-30: Know Your Financial Reality**
- Take the **Akhirah Financial Compass** to discover your IIRS (Islamic Investment Readiness Score) — this tells you whether your financial foundation is solid enough to invest, or whether you need to fix it first (Course 2)
- Based on your IIRS, you will know: Do you need to eliminate Riba first? Do you need to build your emergency fund? Is your savings rate strong enough?
- Review your existing portfolio (if you have one) in light of your Investor Profile AND your IIRS — are your current holdings aligned with who you actually are as an investor?

**Days 31-60: Build Your Knowledge**
- Complete **Course 3: The Halal Arsenal** — understand the six halal asset classes (equities, Sukuk, gold, REITs, cash, Bitcoin) at institutional depth
- Complete **Course 4: The Macro System** — learn to read the economic environment so you know WHEN conditions favor different allocations
- Your ${profile.name} allocation of ${Object.entries(alloc.allocation).map(([k, v]) => `${v}% ${k}`).join(", ")} will make much more sense once you understand each asset class deeply

**Days 61-90: Prepare for Execution**
- Complete **Course 5: Portfolio & Risk Management** — learn to use the Amanah Portfolio Command Center, which brings your profile, your allocation, and the macro environment together into a 15-20 minute weekly ritual
- Complete **Course 6: Execution & Systems** — when (and only when) you are educated and ready, this course guides you through selecting a Shariah-compliant platform and making your first informed decision
- Begin your **15-20 minute weekly ritual** — Review, Adjust, Worship

**Ongoing: Your Akhirah Investment**
- Complete **Course 7: Zakat & Wealth Purification** — ensure every obligation is met with precision
- Increase your **Sadaqah capacity** — remember, the ultimate ROI is not portfolio returns but charitable giving that Allah multiplies
- Stay connected with the **TMI community** — share your progress, ask questions, support your brothers and sisters on the same path

---

## Part 7: Islamic Finance Guidance

${scores.knowledge_level < 50 ?
`**The Foundations You Need to Know:**

The prohibition of Riba (interest) is one of the most severe warnings in the entire Quran. Allah says: *"O you who believe, fear Allah and give up what remains of Riba, if you are true believers. And if you do not, then be warned of war from Allah and His Messenger."* (Quran 2:278-279). War — from Allah and His Messenger. No other sin carries this declaration except disbelief itself.

Shariah screening evaluates companies on two levels: what they do (business activity) and how they are financed (financial ratios). Companies involved in alcohol, gambling, tobacco, weapons, or adult entertainment are excluded. Financial ratios for debt, interest income, and non-compliant revenue are also measured against established thresholds.

Purification means that if a small portion of a screened company's income comes from non-compliant sources, you donate that percentage of your dividends to charity. This keeps your wealth clean. The TMI curriculum teaches you exactly how to calculate and execute this.` :
`**Advanced Frameworks for Your Level:**

Your knowledge level positions you to engage with more nuanced concepts. The TMI curriculum builds on this foundation with institutional-grade frameworks: AAOIFI standards for global Shariah compliance, the structural differences between asset-backed and asset-based Sukuk, the five weather regimes of the TMI Global Macro System, and sophisticated portfolio construction using the Amanah Command Center.

Course 3 will deepen your understanding of each asset class with the same analytical rigor used to manage institutional portfolios. Course 4 introduces the macro overlay — 34 economic indicators distilled into one actionable signal. These are not theoretical — they are the same frameworks used to manage $500M in Islamic assets, translated for your use.`}

---

## Part 8: Closing & Du'a

Dear ${userName}, every step you take toward purifying your wealth is an act of worship. Your portfolio will testify — either for you or against you. There is no neutral ground. And by completing this assessment, you have already chosen to prepare your testimony.

You are not alone on this path. The TMI community is a brotherhood and sisterhood of Muslims who have all made the same decision you just made: to stop guessing, to stop avoiding, and to start preparing their answer for the Day of Judgment.

Your Rizq is already written. What is NOT written is whether it will be pure or poisoned, whether it will testify for you or against you. That choice — that is yours. And you have already started making it.

اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ

*"O Allah, suffice me with what You have permitted instead of what You have forbidden, and enrich me by Your Grace so that I need none other than You."*

May Allah accept this effort from you, purify your wealth, multiply your Hasanat, and make you a pillar of strength for your family and the Ummah.

**Mehdi — Founder, The Muslim Investor**`;
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
      method,
      userName,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: "An error occurred. Please try again." }, { status: 500 });
  }
}