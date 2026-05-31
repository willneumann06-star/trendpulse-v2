import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabaseServer';

const MAX_MONTHLY = 10;

export async function POST(request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch profile and check usage
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('generations_used, usage_reset_at')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: 'Could not load profile' }, { status: 500 });
  }

  // Reset counter if past the reset date
  const now = new Date();
  const resetAt = new Date(profile.usage_reset_at);
  let generationsUsed = profile.generations_used;

  if (now >= resetAt) {
    const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    await supabase
      .from('profiles')
      .update({ generations_used: 0, usage_reset_at: nextReset.toISOString() })
      .eq('id', user.id);
    generationsUsed = 0;
  }

  if (generationsUsed >= MAX_MONTHLY) {
    return NextResponse.json(
      { error: 'limit_reached', used: generationsUsed, max: MAX_MONTHLY },
      { status: 429 }
    );
  }

  const { niche, trend } = await request.json();

  if (!niche || !trend) {
    return NextResponse.json({ error: 'Missing niche or trend' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const prompt = `You are a world-class social media content strategist. An influencer in the "${niche}" niche wants to create content around this trending topic:

Trend: "${trend.title}"
Description: ${trend.desc}
Category: ${trend.category}
Heat Score: ${trend.heat}/100

Generate exactly 4 unique, creative, and highly actionable post ideas tailored to the "${niche}" niche and this trend.

Return ONLY a valid JSON array with exactly 4 objects. Each object must have these exact fields:
- "platform": best platform (Instagram, TikTok, YouTube, Twitter/X, or LinkedIn)
- "format": specific content format (e.g. Reel, Carousel, Thread, Short, Tutorial, etc.)
- "hook": a punchy opening hook under 12 words that stops the scroll
- "concept": 2-3 sentences explaining the full content idea
- "hashtags": array of exactly 5 relevant hashtags (include the # symbol)

Return ONLY the JSON array. No explanation, no markdown, no code fences.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || `Claude API error ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const raw = data.content[0].text.trim();

    let ideas;
    try {
      ideas = JSON.parse(raw);
    } catch {
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Could not parse Claude response');
      ideas = JSON.parse(match[0]);
    }

    if (!Array.isArray(ideas) || ideas.length === 0) {
      throw new Error('Unexpected response format from Claude');
    }

    // Increment usage counter
    await supabase
      .from('profiles')
      .update({ generations_used: generationsUsed + 1 })
      .eq('id', user.id);

    return NextResponse.json({
      ideas: ideas.slice(0, 4),
      used: generationsUsed + 1,
      max: MAX_MONTHLY,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
