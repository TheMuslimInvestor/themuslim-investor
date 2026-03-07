// src/app/api/mirror/route.ts
// TMI Portfolio Mirror — API Route for Claude AI Analysis
// Uses Claude Opus for maximum analysis quality

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { systemPrompt, userPrompt } = body;

    if (!systemPrompt || !userPrompt) {
      return NextResponse.json({ error: 'Missing prompt data' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return NextResponse.json({ error: 'AI analysis failed', details: errorData }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content
      ?.filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n') || '';

    return NextResponse.json({ narrative: text });
  } catch (error) {
    console.error('Mirror API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Also handle the Google Sheets webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_MIRROR;

    if (!webhookUrl) {
      // Silently skip if not configured
      return NextResponse.json({ ok: true, skipped: true });
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).catch(() => {
      // Fire-and-forget — don't fail the user experience
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true }); // Never fail on webhook
  }
}
