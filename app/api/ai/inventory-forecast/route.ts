import { NextRequest, NextResponse } from 'next/server';
import { openrouter, AI_MODELS, isAIAvailable } from '@/lib/openrouter';
import { supabaseAdmin } from '@/lib/supabase/server';
import { getUpcomingFestivals } from '@/lib/festivals';

export async function POST() {
  // Fetch products with stock
  const { data: products } = await supabaseAdmin.from('products').select('id, name, stock_count, order_count').eq('is_active', true);
  if (!products?.length) return NextResponse.json({ forecasts: [] });

  // Fetch orders from last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: orders } = await supabaseAdmin.from('orders').select('items, created_at').gte('created_at', thirtyDaysAgo);

  // Calculate sales per product
  const salesMap: Record<string, number> = {};
  (orders || []).forEach(o => {
    (o.items as any[]).forEach(item => {
      salesMap[item.product_id] = (salesMap[item.product_id] || 0) + item.quantity;
    });
  });

  const festivals = getUpcomingFestivals(30);

  if (!isAIAvailable()) {
    // Manual forecasting
    return NextResponse.json({
      forecasts: products.map(p => {
        const sales30 = salesMap[p.id] || 0;
        const dailyRate = sales30 / 30;
        const daysLeft = dailyRate > 0 ? Math.floor(p.stock_count / dailyRate) : 999;
        const urgency = daysLeft <= 5 ? 'critical' : daysLeft <= 14 ? 'warning' : 'ok';
        return {
          product_name: p.name, current_stock: p.stock_count, days_until_stockout: daysLeft,
          festival_impact: festivals.length > 0 ? `${festivals[0].name} in ${festivals[0].daysUntil} days` : 'None upcoming',
          units_to_produce: Math.max(0, Math.ceil(dailyRate * 30) - p.stock_count),
          urgency, reason: urgency === 'critical' ? 'Restock immediately!' : urgency === 'warning' ? 'Start production this week' : 'Stock levels healthy',
        };
      }),
    });
  }

  try {
    const response = await openrouter.chat.completions.create({
      model: AI_MODELS.forecasting,
      messages: [{
        role: 'system',
        content: `You are an inventory analyst for a handmade candle business in India. Analyze and return JSON array.

Sales data last 30 days: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stock_count, sold_30d: salesMap[p.id] || 0 })))}
Upcoming festivals: ${JSON.stringify(festivals.map(f => ({ name: f.name, days: f.daysUntil })))}

Return ONLY a JSON array:
[{"product_name":"...","current_stock":0,"days_until_stockout":0,"festival_impact":"...","units_to_produce":0,"urgency":"critical|warning|ok","reason":"..."}]`
      }],
      max_tokens: 500,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) return NextResponse.json({ forecasts: JSON.parse(jsonMatch[0]) });
  } catch { }

  return NextResponse.json({ forecasts: [] });
}
