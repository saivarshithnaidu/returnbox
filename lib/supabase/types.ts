// ═══════════════════════════════════════════════
// Database Types — mirrors Supabase schema
// ═══════════════════════════════════════════════

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  discount_code: string | null;
  status: 'new' | 'contacted' | 'converted' | 'dead';
  notes: string | null;
  contacted_at: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  images: string[];
  stock_count: number;
  is_in_stock: boolean;
  is_featured: boolean;
  is_active: boolean;
  weight_grams: number | null;
  burn_time_hours: number | null;
  fragrance: string | null;
  dimensions: string | null;
  materials: string | null;
  tags: string[];
  view_count: number;
  order_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  category?: Category;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimum_order: number;
  maximum_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  description: string | null;
  created_at: string;
}

export interface DeliveryAddress {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  sale_price?: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: DeliveryAddress;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  coupon_code: string | null;
  total: number;
  payment_method: 'razorpay' | 'qr_upload' | null;
  payment_status: 'pending' | 'pending_verification' | 'paid' | 'failed' | 'refunded';
  order_status: 'new' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_screenshot_url: string | null;
  billing_details_url: string | null;
  special_instructions: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeasonalOffer {
  id: string;
  title: string;
  description: string | null;
  banner_image_url: string | null;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | null;
  applies_to: 'all' | 'category' | 'product';
  category_id: string | null;
  product_ids: string[];
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  show_banner: boolean;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

export interface PageVisit {
  id: string;
  page: string;
  session_id: string;
  country: string | null;
  device: string | null;
  visited_at: string;
}

// Cart types (client-side only)
export interface CartItem {
  product_id: string;
  name: string;
  slug: string;
  price: number;
  sale_price?: number;
  quantity: number;
  image: string;
  stock_count: number;
}

export interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}
