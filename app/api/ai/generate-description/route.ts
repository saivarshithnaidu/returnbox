import { NextRequest, NextResponse } from 'next/server';
import { openrouter, AI_MODELS, isAIAvailable } from '@/lib/openrouter';

export async function POST(req: NextRequest) {
  const { brief, occasion, tone } = await req.json();
  if (!brief) return NextResponse.json({ error: 'Brief required' }, { status: 400 });

  if (!isAIAvailable()) {
    return NextResponse.json({
      variations: [
        `Handcrafted with love, this ${brief} brings warmth and elegance to any space. Each piece is poured with care, creating a unique sensory experience that transforms your moments into memories.`,
        `Discover the beauty of artisan craftsmanship with this exquisite ${brief}. A perfect blend of fragrance and form, designed to elevate your gifting experience.`,
        `Born from passion and tradition, this ${brief} embodies the spirit of handmade luxury. Light it up and let the gentle glow create an atmosphere of serenity.`,
      ],
      short_description: `Premium handcrafted ${brief} by Return Box.`,
      seo_description: `Shop premium handmade ${brief} from Return Box by Sana. Handcrafted candles and gifts from Guntur.`,
      instagram_captions: ['✨ Handmade magic ✨', '🕯️ Crafted with love', '🎁 The perfect gift'],
    });
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODELS.copywriting,
      messages: [{
        role: 'system',
        content: `You are a luxury product copywriter for Return Box by Sana — a premium handmade candles brand from India.

Write a beautiful product description that:
- Opens with a sensory, evocative sentence
- Describes the experience not just the product
- Mentions the handmade craftsmanship
- Is 80-120 words
- Ends with a subtle emotional hook
- Feels warm, feminine, and premium

${occasion ? `Target occasion: ${occasion}` : ''}
${tone ? `Tone: ${tone}` : ''}

Return ONLY valid JSON:
{"variations":["desc1","desc2","desc3"],"short_description":"30 words for cards","seo_description":"155 chars max","instagram_captions":["cap1","cap2","cap3"]}`
      }, {
        role: 'user',
        content: `Product: ${brief}`
      }],
      max_tokens: 800,
      temperature: 0.8,
    });

    const text = response.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch { }

  return NextResponse.json({
    variations: [`A beautifully handcrafted ${brief}, made with love and care in our Guntur studio.`],
    short_description: `Premium handmade ${brief}.`,
    seo_description: `Shop ${brief} from Return Box by Sana.`,
    instagram_captions: ['✨ New arrival!'],
  });
}
