// ============================================================================
// TMI INVESTOR PROFILE — DATA MODULE
// All questions, profiles, allocations, and scoring logic
// ============================================================================

export const PROFILES = {
  foundation_builder: { name: "THE FOUNDATION BUILDER", emoji: "🛠️", desc: "You're at the beginning of your halal investing journey — and that's exactly where every great investor starts." },
  tactical_trader: { name: "THE TACTICAL TRADER", emoji: "⚡", desc: "You're decisive, knowledgeable, and drawn to action — a trader who moves with purpose." },
  purposeful_builder: { name: "THE PURPOSEFUL BUILDER", emoji: "🎯", desc: "Your faith is the compass of your finances — every investment is an act of worship." },
  practical_provider: { name: "THE PRACTICAL PROVIDER", emoji: "👨‍👩‍👧‍👦", desc: "Family is your priority, and your investments reflect that sacred responsibility." },
  fortress_builder: { name: "THE FORTRESS BUILDER", emoji: "🏰", desc: "You value security above all — protecting what Allah has entrusted to you." },
  steady_steward: { name: "THE STEADY STEWARD", emoji: "🌱", desc: "You're balanced, patient, and consistent — the qualities of a wise steward of wealth." },
  growth_seeker: { name: "THE GROWTH SEEKER", emoji: "📈", desc: "You're ambitious and forward-looking — ready to grow your halal wealth aggressively." },
};

export const ALLOCATIONS = {
  foundation_builder: {
    allocation: { "Money Market": 40, "Sukuk/Fixed Income": 30, "Equity": 20, "Gold": 10 },
    rationale: "Your recommended allocation prioritizes capital preservation and stability — 40% in money market instruments provides a safe foundation as you learn, 30% in Sukuk for steady income with low volatility, 20% in equity for measured growth exposure, and 10% in gold as an inflation hedge and store of value. This allocation reflects where you are right now: at the beginning. And that is exactly where every wise investor starts. As you progress through the TMI curriculum and your knowledge grows, this allocation will evolve with you.",
  },
  tactical_trader: {
    allocation: { "Equity": 60, "Emerging Markets": 20, "Gold": 10, "Money Market": 10 },
    rationale: "Your recommended allocation is built for someone who moves with purpose — 60% in equity for strong growth potential, 20% in emerging markets for higher-reward exposure, 10% in gold as a tactical hedge, and 10% in money market for dry powder when opportunities arise. This allocation channels your decisive nature into a structured framework — preventing impulsive moves while keeping you active and engaged. Your knowledge level supports this more aggressive positioning, but the TMI curriculum will sharpen your edge even further.",
  },
  purposeful_builder: {
    allocation: { "Equity": 50, "Sukuk/Fixed Income": 25, "Real Estate": 15, "Money Market": 10 },
    rationale: "Your recommended allocation balances growth with intention — 50% in equity for long-term halal wealth building, 25% in Sukuk for stable income that anchors your portfolio, 15% in real estate for tangible asset diversification, and 10% in money market for liquidity and flexibility. Every asset class in this allocation serves a purpose — just like every financial decision you make serves your Akhirah. This is not a portfolio. It is a system for stewarding the Amanah.",
  },
  practical_provider: {
    allocation: { "Equity": 40, "Sukuk/Fixed Income": 30, "Real Estate": 15, "Money Market": 15 },
    rationale: "Your recommended allocation is built around your family's needs — 40% in equity for growth that compounds over your family's timeline, 30% in Sukuk for reliable income and stability, 15% in real estate for long-term family wealth preservation, and 15% in money market for the emergency reserves that every provider must maintain. This allocation reflects your sacred responsibility: protecting and growing what Allah has entrusted to you for the benefit of those who depend on you.",
  },
  fortress_builder: {
    allocation: { "Sukuk/Fixed Income": 40, "Money Market": 30, "Gold": 15, "Equity": 15 },
    rationale: "Your recommended allocation prioritizes protection above all — 40% in Sukuk for capital preservation and steady returns, 30% in money market for maximum liquidity and safety, 15% in gold as a time-tested store of value, and 15% in equity for essential growth exposure. This is the allocation of a steward who understands that protecting the Amanah is itself an act of worship. Preservation is not cowardice — it is wisdom. The Prophet ﷺ tied his camel before placing his trust in Allah.",
  },
  steady_steward: {
    allocation: { "Equity": 55, "Sukuk/Fixed Income": 25, "Real Estate": 10, "Gold": 10 },
    rationale: "Your recommended allocation balances growth with stability — 55% in equity for long-term halal wealth building, 25% in Sukuk for steady income and portfolio stability, 10% in real estate for tangible asset diversification, and 10% in gold as an inflation hedge and store of value. This allocation reflects your balanced nature, your patience, and your preference for steady compounding over aggressive speculation. It is designed to grow your wealth while letting you sleep peacefully at night — knowing every asset class is Shariah-compliant.",
  },
  growth_seeker: {
    allocation: { "Equity": 70, "Emerging Markets": 15, "Gold": 10, "Money Market": 5 },
    rationale: "Your recommended allocation is built for ambitious, forward-looking growth — 70% in equity for maximum long-term appreciation, 15% in emerging markets for high-growth exposure, 10% in gold as a portfolio stabilizer, and 5% in money market for minimal liquidity needs. Your higher risk tolerance and longer time horizon support this aggressive positioning. But remember: ambition without knowledge is speculation. The TMI curriculum ensures your growth is grounded in understanding, not hope.",
  },
};

export const SCORE_MAP: Record<string, number> = {
  strongly_agree: 1.0, agree: 0.75, neutral: 0.5, disagree: 0.25, strongly_disagree: 0.0,
  very_conservative: 0.1, conservative: 0.3, moderate: 0.5, aggressive: 0.75, very_aggressive: 0.95,
  none: 0.1, beginner: 0.3, intermediate: 0.5, advanced: 0.75, expert: 0.95,
  "18_25": 0.9, "26_35": 0.75, "36_45": 0.5, "46_55": 0.35, "56_65": 0.2, "65_plus": 0.1,
  less_than_1_year: 0.1, "1_3_years": 0.3, "3_5_years": 0.5, "5_10_years": 0.75, "10_plus_years": 0.95,
  very_unstable: 0.1, unstable: 0.3, stable: 0.5, very_stable: 0.75, extremely_stable: 0.95,
};

export const SECTIONS = [
  { id: 1, name: "Identity & Values", description: "Your spiritual foundation and purpose" },
  { id: 2, name: "Goals & Strategy", description: "Your financial situation and objectives" },
  { id: 3, name: "Risk & Returns", description: "How you handle uncertainty and volatility" },
  { id: 4, name: "Knowledge & Growth", description: "Your familiarity with Islamic finance" },
  { id: 5, name: "Behavioral & Emotional", description: "Your decision-making style and mindset" },
];

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  section: number;
  type: "text" | "single";
  question: string;
  placeholder?: string;
  required?: boolean;
  options?: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  { id: "q1", section: 1, type: "text", question: "What is your name?", placeholder: "Enter your name", required: true },
  { id: "q2", section: 1, type: "single", question: "What is your age range?", options: [
    { value: "18_25", label: "18-25 years" }, { value: "26_35", label: "26-35 years" }, { value: "36_45", label: "36-45 years" },
    { value: "46_55", label: "46-55 years" }, { value: "56_65", label: "56-65 years" }, { value: "65_plus", label: "65+ years" },
  ]},
  { id: "q3", section: 1, type: "text", question: "What is your current profession or occupation?", placeholder: "e.g., Software Engineer, Teacher, Business Owner", required: true },
  { id: "q4", section: 1, type: "single", question: "What is your approximate annual household income?", options: [
    { value: "under_25k", label: "Under $25,000" }, { value: "25k_50k", label: "$25,000 – $50,000" }, { value: "50k_75k", label: "$50,000 – $75,000" },
    { value: "75k_100k", label: "$75,000 – $100,000" }, { value: "100k_150k", label: "$100,000 – $150,000" },
    { value: "150k_250k", label: "$150,000 – $250,000" }, { value: "250k_plus", label: "$250,000+" },
  ]},
  { id: "q5", section: 1, type: "single", question: "How important is it that your investments align with Islamic principles?", options: [
    { value: "strongly_agree", label: "Essential — I will only invest in fully Shariah-compliant options" },
    { value: "agree", label: "Very important — I strongly prefer halal investments" },
    { value: "neutral", label: "Moderately important — I try to avoid clearly haram investments" },
    { value: "disagree", label: "Somewhat important — I consider it but it's not my main priority" },
  ]},
  { id: "q6", section: 1, type: "single", question: "When you think about building wealth, what motivates you most?", options: [
    { value: "strongly_agree", label: "Preparing for the Akhirah by using wealth for good deeds" },
    { value: "agree", label: "Providing security and opportunities for my family" },
    { value: "neutral", label: "Achieving financial freedom and independence" },
    { value: "disagree", label: "Building a legacy or leaving an inheritance" },
    { value: "strongly_disagree", label: "Enjoying life's comforts and experiences" },
  ]},
  { id: "q7", section: 1, type: "single", question: "How do you view the relationship between your faith and your finances?", options: [
    { value: "strongly_agree", label: "Completely integrated — my faith guides every financial decision" },
    { value: "agree", label: "Closely connected — I regularly consider Islamic principles" },
    { value: "neutral", label: "Somewhat connected — I try to keep them aligned when convenient" },
    { value: "disagree", label: "Separately managed — I handle finances differently from religious matters" },
  ]},
  { id: "q8", section: 2, type: "single", question: "What is your primary investment goal?", options: [
    { value: "retirement", label: "Retirement savings" }, { value: "major_purchase", label: "Major purchase (home, car, Hajj)" },
    { value: "education", label: "Children's education" }, { value: "wealth_building", label: "General wealth building" },
    { value: "passive_income", label: "Generating passive income" },
  ]},
  { id: "q9", section: 2, type: "single", question: "How important is supporting the Muslim community through your investments?", options: [
    { value: "strongly_agree", label: "Very important — I actively seek investments that benefit the Ummah" },
    { value: "agree", label: "Important — I prefer investments that align with community values" },
    { value: "neutral", label: "Nice to have — but not a primary consideration" },
    { value: "disagree", label: "Not a significant factor in my decisions" },
  ]},
  { id: "q10", section: 2, type: "single", question: "What is your investment time horizon?", options: [
    { value: "less_than_1_year", label: "Less than 1 year — I may need funds soon" },
    { value: "1_3_years", label: "1-3 years — Short-term goals" }, { value: "3_5_years", label: "3-5 years — Medium-term planning" },
    { value: "5_10_years", label: "5-10 years — Long-term growth" }, { value: "10_plus_years", label: "10+ years — Very long-term/retirement" },
  ]},
  { id: "q11", section: 2, type: "single", question: "What percentage of your monthly income can you consistently invest?", options: [
    { value: "strongly_disagree", label: "Less than 5% — I'm focused on expenses right now" },
    { value: "disagree", label: "5-10% — I save what I can after necessities" },
    { value: "neutral", label: "10-20% — I have a regular savings habit" },
    { value: "agree", label: "20-30% — I prioritize investing significantly" },
    { value: "strongly_agree", label: "30%+ — I maximize investment contributions" },
  ]},
  { id: "q12", section: 2, type: "single", question: "How do you typically make financial decisions?", options: [
    { value: "very_conservative", label: "Very cautiously — I research extensively and often delay" },
    { value: "conservative", label: "Carefully — I take my time and consult others" },
    { value: "moderate", label: "Balanced — I analyze but don't overthink" },
    { value: "aggressive", label: "Decisively — I trust my judgment and act quickly" },
  ]},
  { id: "q13", section: 2, type: "single", question: "How do you balance personal goals versus family financial obligations?", options: [
    { value: "strongly_agree", label: "Family first — Their needs always come before mine" },
    { value: "agree", label: "Family priority — But I maintain some personal goals" },
    { value: "neutral", label: "Balanced — I try to address both equally" },
    { value: "disagree", label: "Personal focus — I invest for myself primarily" },
  ]},
  { id: "q14", section: 2, type: "single", question: "What drives your financial decisions most?", options: [
    { value: "strongly_agree", label: "Security — Protecting what I have" },
    { value: "agree", label: "Stability — Steady, predictable growth" },
    { value: "neutral", label: "Opportunity — Balanced risk and reward" },
    { value: "disagree", label: "Growth — Maximizing returns over time" },
    { value: "strongly_disagree", label: "Excitement — Finding the best opportunities" },
  ]},
  { id: "q15", section: 2, type: "single", question: "How important is having quick access to your invested money (liquidity)?", options: [
    { value: "strongly_agree", label: "Very important — I need to access funds quickly" },
    { value: "agree", label: "Important — I prefer some liquidity for emergencies" },
    { value: "neutral", label: "Moderate — I'm okay with some investments being locked" },
    { value: "disagree", label: "Not very — I can keep most money invested long-term" },
  ]},
  { id: "q16", section: 3, type: "single", question: "How would you describe your overall risk tolerance?", options: [
    { value: "very_conservative", label: "Very Conservative — I avoid risk at all costs" },
    { value: "conservative", label: "Conservative — I prefer stability over high returns" },
    { value: "moderate", label: "Moderate — I accept some risk for better returns" },
    { value: "aggressive", label: "Aggressive — I'm comfortable with significant volatility" },
    { value: "very_aggressive", label: "Very Aggressive — I seek maximum returns regardless" },
  ]},
  { id: "q17", section: 3, type: "single", question: "If your portfolio lost 20% of its value in one month, what would you do?", options: [
    { value: "very_conservative", label: "Sell everything — I can't handle such losses" },
    { value: "conservative", label: "Sell some — Reduce my exposure" },
    { value: "moderate", label: "Hold steady — Wait for recovery" },
    { value: "aggressive", label: "Buy more — Great opportunity at lower prices" },
  ]},
  { id: "q18", section: 3, type: "single", question: "How comfortable are you with daily price fluctuations?", options: [
    { value: "very_conservative", label: "Very uncomfortable — I check prices constantly and worry" },
    { value: "conservative", label: "Somewhat uncomfortable — Fluctuations make me uneasy" },
    { value: "moderate", label: "Neutral — I accept them as part of investing" },
    { value: "aggressive", label: "Comfortable — I understand markets move up and down" },
    { value: "very_aggressive", label: "Very comfortable — I rarely check short-term prices" },
  ]},
  { id: "q19", section: 3, type: "single", question: "When evaluating an investment, what do you focus on most?", options: [
    { value: "very_conservative", label: "Safety — Is my principal protected?" },
    { value: "conservative", label: "Income — Will it generate steady returns?" },
    { value: "moderate", label: "Balance — Good mix of safety and growth" },
    { value: "aggressive", label: "Growth — What's the upside potential?" },
    { value: "very_aggressive", label: "Opportunity — What's the maximum possible return?" },
  ]},
  { id: "q20", section: 3, type: "single", question: "What types of investments are you most drawn to?", options: [
    { value: "very_conservative", label: "Cash equivalents and savings accounts" },
    { value: "conservative", label: "Sukuk and fixed income investments" },
    { value: "moderate", label: "Balanced mix of stocks and Sukuk" },
    { value: "aggressive", label: "Primarily stocks and equity funds" },
    { value: "very_aggressive", label: "Growth stocks, emerging markets, alternatives" },
  ]},
  { id: "q21", section: 3, type: "single", question: "What annual return expectation do you have?", options: [
    { value: "very_conservative", label: "2-4% — Keeping pace with inflation" },
    { value: "conservative", label: "4-6% — Modest, steady growth" },
    { value: "moderate", label: "6-8% — Market-average returns" },
    { value: "aggressive", label: "8-12% — Above-average returns" },
    { value: "very_aggressive", label: "12%+ — Aiming for high growth" },
  ]},
  { id: "q22", section: 3, type: "single", question: "How stable is your current employment/income?", options: [
    { value: "very_unstable", label: "Very unstable — Income is highly unpredictable" },
    { value: "unstable", label: "Somewhat unstable — Some uncertainty exists" },
    { value: "stable", label: "Stable — Reasonably secure income" },
    { value: "very_stable", label: "Very stable — Highly secure employment" },
    { value: "extremely_stable", label: "Extremely stable — Multiple income sources" },
  ]},
  { id: "q23", section: 3, type: "single", question: "How do you handle income fluctuations?", options: [
    { value: "very_conservative", label: "Struggle significantly — We live paycheck to paycheck" },
    { value: "conservative", label: "Manage carefully — We budget strictly" },
    { value: "moderate", label: "Handle reasonably — We have some buffer" },
    { value: "aggressive", label: "Handle well — We have months of emergency funds" },
    { value: "very_aggressive", label: "No concern — We have substantial reserves" },
  ]},
  { id: "q24", section: 4, type: "single", question: "How would you rate your understanding of Islamic finance?", options: [
    { value: "none", label: "Beginner — I'm just starting to learn" },
    { value: "beginner", label: "Basic — I understand core prohibitions (Riba, etc.)" },
    { value: "intermediate", label: "Intermediate — I understand Sukuk, screening, purification" },
    { value: "advanced", label: "Advanced — I understand complex structures" },
    { value: "expert", label: "Expert — Professional-level knowledge" },
  ]},
  { id: "q25", section: 4, type: "single", question: "How do you prefer to improve your investment knowledge?", options: [
    { value: "strongly_agree", label: "Structured courses — Comprehensive learning" },
    { value: "agree", label: "Self-study — I research on my own" },
    { value: "neutral", label: "Guidance — I prefer advisors" },
    { value: "disagree", label: "Experience — I learn by doing" },
    { value: "strongly_disagree", label: "Minimal — I prefer hands-off investing" },
  ]},
  { id: "q26", section: 4, type: "single", question: "Do you have industry expertise that influences your investments?", options: [
    { value: "strongly_agree", label: "Yes — I invest in areas I know professionally" },
    { value: "agree", label: "Somewhat — My job gives me insight" },
    { value: "neutral", label: "No — No particular industry expertise" },
    { value: "disagree", label: "I prefer to diversify outside my industry" },
  ]},
  { id: "q27", section: 4, type: "single", question: "How confident are you in assessing investment risks?", options: [
    { value: "very_conservative", label: "Not confident — I need significant guidance" },
    { value: "conservative", label: "Somewhat — I understand basics" },
    { value: "moderate", label: "Moderately — I can evaluate common investments" },
    { value: "aggressive", label: "Confident — I can analyze most opportunities" },
    { value: "very_aggressive", label: "Very confident — Strong analytical skills" },
  ]},
  { id: "q28", section: 4, type: "single", question: "If considering a career change, how would it affect investing?", options: [
    { value: "very_conservative", label: "Stop investing until stable" },
    { value: "conservative", label: "Significantly reduce investments" },
    { value: "moderate", label: "Be more conservative temporarily" },
    { value: "aggressive", label: "Maintain current approach" },
    { value: "very_aggressive", label: "Might invest more aggressively" },
  ]},
  { id: "q29", section: 4, type: "single", question: "What lessons have you learned from past investments?", options: [
    { value: "none", label: "No prior investment experience" },
    { value: "conservative", label: "Learned to be more careful" },
    { value: "moderate", label: "Learned importance of diversification" },
    { value: "aggressive", label: "Learned to stay calm during volatility" },
    { value: "very_aggressive", label: "Learned to trust my analysis" },
  ]},
  { id: "q30", section: 5, type: "single", question: "How would you describe your emotional relationship with money?", options: [
    { value: "very_conservative", label: "Anxious — Money matters stress me out" },
    { value: "conservative", label: "Cautious — Careful but sometimes worry" },
    { value: "moderate", label: "Neutral — Practical relationship with money" },
    { value: "aggressive", label: "Positive — Confident about money matters" },
    { value: "very_aggressive", label: "Optimistic — Money is a tool for opportunities" },
  ]},
  { id: "q31", section: 5, type: "single", question: "How do investment losses affect your wellbeing?", options: [
    { value: "very_conservative", label: "Significantly — I lose sleep and feel anxious" },
    { value: "conservative", label: "Noticeably — They bother me for a while" },
    { value: "moderate", label: "Moderately — Disappointed but recover quickly" },
    { value: "aggressive", label: "Slightly — I accept them as part of investing" },
    { value: "very_aggressive", label: "Minimally — Learning opportunities" },
  ]},
  { id: "q32", section: 5, type: "single", question: "Do you rely more on logic or emotion for financial decisions?", options: [
    { value: "very_conservative", label: "Mostly emotion — Feelings guide me" },
    { value: "conservative", label: "More emotion — But I try to be logical" },
    { value: "moderate", label: "Balanced — Both equally" },
    { value: "aggressive", label: "More logic — But trust instincts too" },
    { value: "very_aggressive", label: "Mostly logic — Data and facts" },
  ]},
  { id: "q33", section: 5, type: "single", question: "How does your faith influence your relationship with money?", options: [
    { value: "strongly_agree", label: "Completely — Wealth is an Amanah from Allah" },
    { value: "agree", label: "Significantly — I consider Islamic teachings regularly" },
    { value: "neutral", label: "Somewhat — I try to keep things halal" },
    { value: "disagree", label: "Occasionally — Faith is separate from finances" },
  ]},
  { id: "q34", section: 5, type: "single", question: "How do you maintain balance during market volatility?", options: [
    { value: "very_conservative", label: "I struggle — Volatility really affects me" },
    { value: "conservative", label: "I cope — Takes effort to stay calm" },
    { value: "moderate", label: "I manage — Remind myself of long-term goals" },
    { value: "aggressive", label: "I'm steady — Trust my strategy" },
    { value: "very_aggressive", label: "I thrive — Volatility is opportunity" },
  ]},
  { id: "q35", section: 5, type: "single", question: "What is your vision for your wealth 20 years from now?", options: [
    { value: "strongly_agree", label: "Ongoing charity (Sadaqah Jariyah) for the Ummah" },
    { value: "agree", label: "Financial security for my family for generations" },
    { value: "neutral", label: "Comfortable retirement and freedom from worry" },
    { value: "disagree", label: "Significant wealth and complete freedom" },
    { value: "strongly_disagree", label: "I focus on the present more than the future" },
  ]},
];

// --- SCORING ENGINE ---
export function getScore(answer: string | number): number {
  if (typeof answer === "number") return Math.min(1, Math.max(0, answer));
  const key = String(answer).toLowerCase().replace(/[\s-]/g, "_");
  return SCORE_MAP[key] ?? 0.5;
}

export function calculateScores(answers: Record<string, string>): Record<string, number> {
  const scores: Record<string, number[]> = {
    spiritual_focus: [], risk_tolerance: [], knowledge_level: [], time_horizon: [], financial_stability: []
  };
  Object.entries(answers).forEach(([qId, answer]) => {
    const s = getScore(answer);
    const q = qId.toLowerCase();
    if (["5", "6", "7", "8", "9", "33", "35"].some(x => q.includes(x))) scores.spiritual_focus.push(s);
    if (["16", "17", "18", "19", "20", "21", "30", "31", "34"].some(x => q.includes(x))) scores.risk_tolerance.push(s);
    if (["24", "25", "26", "27", "29"].some(x => q.includes(x))) scores.knowledge_level.push(s);
    if (["2", "10", "13"].some(x => q.includes(x))) scores.time_horizon.push(s);
    if (["4", "11", "15", "22", "23"].some(x => q.includes(x))) scores.financial_stability.push(s);
  });
  const result: Record<string, number> = {};
  for (const [dim, vals] of Object.entries(scores)) {
    result[dim] = vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) : 50;
  }
  return result;
}

export function determineProfile(scores: Record<string, number>): string {
  // ============================================================================
  // TMI PROFILE DETERMINATION — Risk Tolerance is the PRIMARY driver
  // 
  // Logic: A person with low risk tolerance should NEVER get a high-equity
  // allocation, regardless of other scores. Risk tolerance determines the
  // range; other dimensions adjust within that range.
  //
  // Profiles ordered by equity exposure:
  //   fortress_builder:    15% equity (Sukuk 40%, MM 30%, Gold 15%, Eq 15%)
  //   foundation_builder:  20% equity (MM 40%, Sukuk 30%, Eq 20%, Gold 10%)
  //   practical_provider:  40% equity (Eq 40%, Sukuk 30%, RE 15%, MM 15%)
  //   purposeful_builder:  50% equity (Eq 50%, Sukuk 25%, RE 15%, MM 10%)
  //   steady_steward:      55% equity (Eq 55%, Sukuk 25%, RE 10%, Gold 10%)
  //   tactical_trader:     60% equity + 20% EM (Eq 60%, EM 20%, Gold 10%, MM 10%)
  //   growth_seeker:       70% equity + 15% EM (Eq 70%, EM 15%, Gold 10%, MM 5%)
  // ============================================================================

  const rt = scores.risk_tolerance ?? 50;   // Risk Tolerance (primary driver)
  const sf = scores.spiritual_focus ?? 50;  // Spiritual Focus
  const kl = scores.knowledge_level ?? 50;  // Knowledge Level
  const th = scores.time_horizon ?? 50;     // Time Horizon
  const fs = scores.financial_stability ?? 50; // Financial Stability

  // Composite of secondary factors (used within risk bands)
  const secondary = (kl + th + fs) / 3;

  // ── VERY CONSERVATIVE (Risk Tolerance ≤ 25) ──
  // These investors cannot stomach volatility. Protect first.
  if (rt <= 25) {
    return "fortress_builder";
  }

  // ── CONSERVATIVE (Risk Tolerance 26–40) ──
  // Low risk tolerance, but some capacity depending on knowledge/stability.
  if (rt <= 40) {
    // If knowledge and stability are also low → start at the beginning
    if (secondary < 55) return "foundation_builder";
    // If they have decent stability/knowledge → can handle a moderate allocation
    return "practical_provider";
  }

  // ── MODERATE (Risk Tolerance 41–60) ──
  // The middle ground — differentiated by spiritual focus and secondary factors.
  if (rt <= 60) {
    // Faith-driven investors with strong spiritual focus
    if (sf >= 60) return "purposeful_builder";
    // Lower secondary = more conservative moderate
    if (secondary < 50) return "practical_provider";
    // Standard moderate
    return "steady_steward";
  }

  // ── AGGRESSIVE (Risk Tolerance 61–80) ──
  // Active, knowledgeable investors who accept volatility.
  if (rt <= 80) {
    // Need sufficient knowledge to handle active trading
    if (kl >= 50) return "tactical_trader";
    // High risk tolerance but low knowledge → moderate is safer
    return "steady_steward";
  }

  // ── VERY AGGRESSIVE (Risk Tolerance > 80) ──
  // Maximum growth, long horizon, high conviction.
  if (kl >= 50 && th >= 50) return "growth_seeker";
  // Very aggressive but lacks knowledge or short horizon → cap at tactical
  return "tactical_trader";
}