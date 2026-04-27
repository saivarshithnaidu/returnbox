import { NextRequest, NextResponse } from 'next/server';
import { openrouter, AI_MODELS, isAIAvailable } from '@/lib/openrouter';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Fetch products for context
  const { data: products } = await supabaseAdmin.from('products').select('id, name, slug, price, sale_price, images, short_description, fragrance, is_in_stock').eq('is_active', true);

  if (!isAIAvailable()) {
    return NextResponse.json({
      message: "I'd love to help you find the perfect gift! Browse our collection at /products or contact us on WhatsApp for personalized recommendations. 🎁",
      products: (products || []).slice(0, 3),
    });
  }

  const systemPrompt = `You are the Gift Genius for Return Box by Sana — a premium handmade candles and gifts brand from Guntur, India.

Our product catalog:
${JSON.stringify(products?.map(p => ({ name: p.name, price: p.price, sale_price: p.sale_price, fragrance: p.fragrance, description: p.short_description })), null, 2)}

Your job:
1. Understand the gifting occasion
2. Understand the recipient's personality
3. Understand the budget
4. Recommend 1-3 specific products from our catalog explaining WHY each one fits
5. Mention the price
6. End with a warm CTA to add to cart

Rules:
- Only recommend products from our catalog
- Be warm, feminine, and enthusiastic
- Keep responses under 150 words
- Use 1-2 emojis naturally
- If budget is lower than our products, suggest our most affordable option kindly`;

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODELS.chat,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 300,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || "I'd love to help! Could you tell me more about the occasion?";

    // Find recommended products from the response
    const recommended = (products || []).filter(p => content.toLowerCase().includes(p.name.toLowerCase())).slice(0, 3);

    return NextResponse.json({ message: content, products: recommended });
  } catch {
    return NextResponse.json({
      message: "I'm having a moment! Meanwhile, check our bestsellers or chat with Sana on WhatsApp. 🕯️",
      products: (products || []).slice(0, 2),
    });
  }
}
