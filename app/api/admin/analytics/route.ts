import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

    // Today's orders + revenue
    const { data: todayOrders } = await supabaseAdmin.from('orders').select('total, order_status').gte('created_at', today);
    const todayRevenue = todayOrders?.filter(o => o.order_status !== 'cancelled').reduce((s, o) => s + Number(o.total), 0) || 0;
    const pendingOrders = todayOrders?.filter(o => o.order_status === 'new').length || 0;

    // Weekly leads
    const { count: weekLeads } = await supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo);

    // Visits
    const { count: todayVisits } = await supabaseAdmin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', today);
    const { count: weekVisits } = await supabaseAdmin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', weekAgo);
    const { count: monthVisits } = await supabaseAdmin.from('page_visits').select('*', { count: 'exact', head: true }).gte('visited_at', monthAgo);

    // Revenue by day (last 7 days)
    const { data: recentOrders } = await supabaseAdmin.from('orders').select('total, created_at, order_status').gte('created_at', weekAgo).neq('order_status', 'cancelled');
    const revenueByDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      revenueByDay[d.toISOString().split('T')[0]] = 0;
    }
    recentOrders?.forEach(o => {
      const day = o.created_at.split('T')[0];
      if (revenueByDay[day] !== undefined) revenueByDay[day] += Number(o.total);
    });

    // Top products
    const { data: topProducts } = await supabaseAdmin.from('products').select('name, order_count, view_count').order('order_count', { ascending: false }).limit(5);

    // Low stock
    const { data: lowStock } = await supabaseAdmin.from('products').select('id, name, stock_count').lt('stock_count', 5).eq('is_active', true);

    // Device breakdown
    const { data: devices } = await supabaseAdmin.from('page_visits').select('device').gte('visited_at', weekAgo);
    const deviceBreakdown = { mobile: 0, desktop: 0 };
    devices?.forEach(d => { if (d.device === 'mobile') deviceBreakdown.mobile++; else deviceBreakdown.desktop++; });

    return NextResponse.json({
      todayOrders: todayOrders?.length || 0,
      todayRevenue,
      pendingOrders,
      weekLeads: weekLeads || 0,
      todayVisits: todayVisits || 0,
      weekVisits: weekVisits || 0,
      monthVisits: monthVisits || 0,
      revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({ date, revenue })),
      topProducts: topProducts || [],
      lowStock: lowStock || [],
      deviceBreakdown,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
