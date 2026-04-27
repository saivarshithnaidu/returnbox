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
  referred_by_code: string | null;
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

// ═══════════════════════════════════════════════
// NEW FEATURE TYPES
// ═══════════════════════════════════════════════

export interface Review {
  id: string;
  product_id: string;
  order_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  rating: number;
  review_text: string | null;
  review_image_url: string | null;
  is_approved: boolean;
  created_at: string;
  // Joined
  product?: Product;
}

export interface AbandonedCart {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  cart_items: OrderItem[];
  total: number;
  recovery_sent: boolean;
  recovered: boolean;
  created_at: string;
}

export interface BulkEnquiry {
  id: string;
  contact_name: string;
  whatsapp_number: string;
  email: string;
  occasion_type: string;
  event_date: string | null;
  quantity: number;
  budget_range: string;
  preferred_products: string[];
  color_preferences: string | null;
  personalization_notes: string | null;
  reference_images: string[];
  additional_notes: string | null;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'closed';
  quote_amount: number | null;
  admin_notes: string | null;
  created_at: string;
}

export interface Bundle {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  products: { product_id: string; quantity: number }[];
  original_price: number;
  bundle_price: number;
  savings_text: string | null;
  is_active: boolean;
  created_at: string;
  // Joined for display
  product_details?: Product[];
}

export interface ReturnRequest {
  id: string;
  order_id: string;
  order_number: string;
  issue_type: 'damaged' | 'wrong_item' | 'missing_item' | 'quality_issue' | 'other';
  description: string;
  photos: string[];
  preferred_resolution: 'replacement' | 'refund';
  status: 'new' | 'reviewing' | 'approved' | 'resolved' | 'rejected';
  action_notes: string | null;
  customer_name: string;
  customer_phone: string;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  email: string;
  discount_code: string | null;
  referral_code: string | null;
  total_orders: number;
  total_spent: number;
  is_vip: boolean;
  wishlist: string[];
  saved_addresses: DeliveryAddress[];
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  video_type: 'youtube' | 'upload' | null;
  tags: string[];
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
}

export interface ReferralCredit {
  id: string;
  referrer_phone: string;
  referred_order_id: string;
  referral_code: string;
  credit_amount: number;
  is_used: boolean;
  created_at: string;
}

export interface FestivalDate {
  name: string;
  date: string; // ISO date
  icon: string;
  suggested_discount: number;
  suggested_banner: string;
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
