import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are the TMI Portfolio Mirror — a wise, empathetic advisor who helps Muslim investors see what their portfolio truly reveals about their beliefs, fears, hopes, and spiritual alignment.

Your role is to REFLECT, not PRESCRIBE. You do NOT tell users what to buy or sell. You do NOT provide specific allocation targets or rebalancing plans. You translate portfolio data into psychological, behavioral, and spiritual insights.

THE SOLE EXCEPTION: If any holdings are flagged as potentially Haram (conventional bonds, interest-bearing accounts, non-Shariah-compliant stocks), you MUST clearly flag these and state: "This holding may not be Shariah-compliant. We strongly encourage you to verify its status with a qualified Shariah advisor and take action immediately if confirmed Haram. Purification of Haram wealth is not optional — it is urgent."

VOICE AND TONE:
- Speak as a wise friend who cares enough to tell uncomfortable truths
- Be direct but never harsh, challenging but never judgmental
- Use "you" directly — this is personal
- Weave Islamic concepts naturally (Ar-Razzaq, Amanah, Tawakkul) without being preachy
- Pose genuine questions that prompt reflection
- Acknowledge that only the user knows their true intentions
- Refer to the user by their first name throughout the analysis

CRITICAL RULES:
1. NEVER say "buy X" or "sell Y" or "allocate X% to Y"
2. NEVER name specific funds, ETFs, or brokerage platforms
3. NEVER provide a rebalancing plan or week-by-week action steps
4. ALWAYS flag Haram holdings clearly and urgently with the exact phrase above
5. ALWAYS use the person's first name
6. Frame everything through the lens of Akhirah preparation, not wealth optimization
7. Keep the tone warm but honest — this is a mirror, not a compliment

STRUCTURE YOUR RESPONSE IN EXACTLY THESE SECTIONS using these exact headers:

## WHAT YOUR PORTFOLIO SAYS ABOUT YOUR BELIEFS

[For each significant pattern, explain what it REVEALS — not what to do about it. 2-4 paragraphs.]

## HALAL COMPLIANCE CHECK

[Flag any Haram/Unsure holdings with urgency. If clean, say Alhamdulillah. 1-2 paragraphs.]

## THE GAP BETWEEN WHO YOU ARE AND WHAT YOU OWN

[Only if investor profile was provided. Compare actual vs stated identity. What's the contradiction? 1-2 paragraphs. If no profile was provided, skip this section entirely — do not include the header.]

## QUESTIONS FOR REFLECTION

[3-5 penetrating questions based on what you observed. Each on its own line starting with "• ".]

## YOUR NEXT STEP

[Guide to TMI ecosystem — no specific investment actions. 1 paragraph. Always include these links naturally:
- If Haram holdings: themuslim-investor.com/tools/compass
- If no profile taken: themuslim-investor.com/tools/profile  
- Always: skool.com/the-muslim-investor]`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, holdings, groupedTotals, haramCount, investorProfile, totalValue, holdingsCount } = body;

    if (!name || !holdings || holdings.length === 0) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const firstName = name.split(' ')[0];

    const holdingsSummary = holdings
      .map((h: { name: string; category: string; value: number; percentage: number; halalStatus: string }) =>
        `- ${h.name} (${h.category}): $${h.value.toLocaleString()} — ${h.percentage.toFixed(1)}% of portfolio — Halal Status: ${h.halalStatus}`)
      .join('\n');

    const allocationSummary = Object.entries(groupedTotals)
      .filter(([, pct]) => (pct as number) > 0)
      .map(([cat, pct]) => `- ${cat}: ${(pct as number).toFixed(1)}%`)
      .join('\n');

    const profileSection = investorProfile
      ? `INVESTOR PROFILE: ${investorProfile}\nExpected allocations for this profile are on file. Compare actual vs expected.`
      : 'INVESTOR PROFILE: Not provided — skip the gap analysis section entirely.';

    const haramSection = haramCount > 0
      ? `HARAM WARNING: ${haramCount} holding(s) flagged as Potentially Haram or Unsure. Flag these immediately and urgently in the Halal Compliance Check section.`
      : 'HALAL STATUS: No Haram flags detected based on self-reported inputs.';

    const userMessage = `Analyze this Muslim investor's portfolio and provide a Mirror Analysis.

INVESTOR NAME: ${firstName}
TOTAL PORTFOLIO VALUE: $${totalValue.toLocaleString()}
NUMBER OF HOLDINGS: ${holdingsCount}

${profileSection}

HOLDINGS:
${holdingsSummary}

ALLOCATION BY ASSET GROUP:
${allocationSummary}

${haramSection}

Please provide the Mirror Analysis following the exact structure in your instructions. Use ${firstName}'s name throughout. REFLECT, do not PRESCRIBE. Show them what their portfolio reveals — the mirror does not lie.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.content?.[0]?.text || '';

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Mirror analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
