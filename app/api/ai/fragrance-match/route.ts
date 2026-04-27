import { NextRequest, NextResponse } from 'next/server';
import { openrouter, AI_MODELS, isAIAvailable } from '@/lib/openrouter';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { mood, memory, space } = await req.json();

  const { data: products } = await supabaseAdmin.from('products').select('*').eq('is_active', true);
  if (!products?.length) return NextResponse.json({ product_name: 'Lotus Candle', match_reason: 'A timeless choice for any mood.', match_percentage: 85 });

  if (!isAIAvailable()) {
    const pick = products[Math.floor(Math.random() * products.length)];
    return NextResponse.json({
      product_name: pick.name, match_percentage: 88,
      match_reason: `The ${pick.fragrance || 'beautiful'} notes of ${pick.name} perfectly complement your preferences.`,
      secondary_reason: 'Another wonderful option from our collection.',
      product: pick, secondary_product: products.find(p => p.id !== pick.id) || null,
    });
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODELS.chat,
      messages: [{
        role: 'system',
        content: `You are a fragrance expert for Return Box by Sana. Based on the customer's mood, memory, and space preferences, recommend the best matching candle from our catalog.

Products: ${JSON.stringify(products.map(p => ({ id: p.id, name: p.name, fragrance: p.fragrance, description: p.short_description })))}

Customer answers: mood=${mood}, memory=${memory}, space=${space}

Return ONLY valid JSON:
{"product_id":"...","product_name":"...","match_reason":"2 sentences, poetic","match_percentage":75-99,"secondary_product_id":"...","secondary_reason":"1 sentence"}`
      }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (result) {
      const primary = products.find(p => p.id === result.product_id) || products[0];
      const secondary = products.find(p => p.id === result.secondary_product_id) || products.find(p => p.id !== primary.id);
      return NextResponse.json({ ...result, product: primary, secondary_product: secondary || null });
    }
  } catch { }

  const pick = products[0];
  return NextResponse.json({
    product_name: pick.name, match_percentage: 90,
    match_reason: 'This handcrafted piece resonates beautifully with your preferences.',
    secondary_reason: 'A wonderful alternative from our collection.',
    product: pick, secondary_product: products[1] || null,
  });
}
