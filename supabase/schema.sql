-- ═══════════════════════════════════════════════
-- RETURN BOX BY SANA — Complete Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- LEADS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'website_popup',
  discount_code TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);

-- ─────────────────────────────────────────────
-- CATEGORIES TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_order ON categories(display_order);

-- ─────────────────────────────────────────────
-- PRODUCTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  stock_count INTEGER DEFAULT 0,
  is_in_stock BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  weight_grams INTEGER,
  burn_time_hours INTEGER,
  fragrance TEXT,
  dimensions TEXT,
  materials TEXT,
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  order_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_price ON products(price);

-- ─────────────────────────────────────────────
-- COUPONS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  minimum_order DECIMAL(10,2) DEFAULT 0,
  maximum_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);

-- ─────────────────────────────────────────────
-- ORDERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  delivery_address JSONB NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  coupon_code TEXT,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('razorpay', 'qr_upload')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'pending_verification', 'paid', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'new' CHECK (order_status IN ('new', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  payment_screenshot_url TEXT,
  billing_details_url TEXT,
  special_instructions TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment ON orders(payment_status);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ─────────────────────────────────────────────
-- SEASONAL OFFERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seasonal_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  banner_image_url TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2),
  applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'category', 'product')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  product_ids UUID[] DEFAULT '{}',
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  show_banner BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_offers_active ON seasonal_offers(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_offers_dates ON seasonal_offers(valid_from, valid_until);

-- ─────────────────────────────────────────────
-- SITE SETTINGS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default settings
INSERT INTO site_settings (key, value) VALUES
  ('announcement_text', 'Free delivery on orders above ₹499! 🎁'),
  ('announcement_active', 'true'),
  ('whatsapp_number', '91XXXXXXXXXX'),
  ('min_free_delivery', '499'),
  ('delivery_charge', '60'),
  ('instagram_url', 'https://instagram.com/returnboxbysana'),
  ('contact_email', 'hello@returnbox.growxlabs.tech'),
  ('qr_code_url', '')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- PAGE VISITS ANALYTICS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT,
  session_id TEXT,
  country TEXT,
  device TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visits_page ON page_visits(page);
CREATE INDEX idx_visits_date ON page_visits(visited_at DESC);
CREATE INDEX idx_visits_session ON page_visits(session_id);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasonal_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, products, offers, settings
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read offers" ON seasonal_offers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (TRUE);

-- Public insert for leads and page_visits
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public insert visits" ON page_visits FOR INSERT WITH CHECK (TRUE);

-- Public read coupons (for validation)
CREATE POLICY "Public read coupons" ON coupons FOR SELECT USING (is_active = TRUE);

-- Public insert orders
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (TRUE);
-- Public read own orders (by phone or order number)
CREATE POLICY "Public read own orders" ON orders FOR SELECT USING (TRUE);

-- Service role has full access (used by admin APIs via service key)
-- No additional policies needed — service key bypasses RLS

-- ─────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_orders_updated
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Increment product view count
CREATE OR REPLACE FUNCTION increment_view_count(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET view_count = view_count + 1 WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_code_input TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE code = coupon_code_input;
END;
$$ LANGUAGE plpgsql;
