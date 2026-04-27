'use client';
import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';

const SECTIONS = [
  { title: '1. Getting Started', items: [
    { q: 'How to log in', a: 'Navigate to /admin/login. Enter the admin password set in your environment variables. You will be redirected to the dashboard.' },
    { q: 'Dashboard overview', a: 'The dashboard shows today\'s orders, revenue, pending orders, leads, low stock alerts, and recent orders. Use the sidebar to navigate.' },
    { q: 'Understanding the sidebar', a: 'The sidebar contains all admin sections. Click items to navigate. On mobile, use the bottom navigation bar or tap "More" to see all options.' },
  ]},
  { title: '2. Managing Products', items: [
    { q: 'How to add a new product', a: '1. Go to Products > Add Product\n2. Fill in the product name, slug, and description\n3. Set the price and optionally a sale price\n4. Upload product images\n5. Set stock count and category\n6. Toggle "Featured" to show on homepage\n7. Click Save' },
    { q: 'How to edit product details', a: 'Go to Products > All Products. Click the edit icon on any product. Make your changes and click Save.' },
    { q: 'How to upload product images', a: 'In the product editor, click "Upload Images". Select images from your device. Images are uploaded to Supabase Storage automatically.' },
    { q: 'How to set prices and sale prices', a: 'In the product editor, set the regular price. If running a discount, set a lower sale price. The discount percentage badge will appear automatically on the product card.' },
    { q: 'How to manage stock count', a: 'In the product editor, update the stock count field. Products with 0 stock will show as "Out of Stock" on the website.' },
  ]},
  { title: '3. Managing Orders', items: [
    { q: 'How to view new orders', a: 'Go to Orders. New orders appear at the top with a "new" status badge. Yellow badges indicate pending orders.' },
    { q: 'Understanding order statuses', a: 'Orders flow: new → confirmed → processing → shipped → delivered. QR payment orders need payment verification first.' },
    { q: 'How to confirm a QR payment order', a: '1. Open the order\n2. View the payment screenshot uploaded by the customer\n3. Verify the amount matches\n4. Update payment status to "paid"\n5. Confirm the order' },
    { q: 'How to update order status', a: 'Click on an order. Use the status dropdown to change from new → confirmed → processing → shipped → delivered.' },
    { q: 'How to contact a customer', a: 'Click the WhatsApp or Call button on any order card. This opens WhatsApp or your phone dialer with the customer\'s number.' },
  ]},
  { title: '4. Leads Management', items: [
    { q: 'How to view leads from popup', a: 'Go to Leads. All leads from the website popup are listed with name, phone, email, and status.' },
    { q: 'How to contact a lead', a: 'Click the WhatsApp button next to any lead to open a chat with a pre-filled welcome message.' },
    { q: 'How to mark as converted', a: 'Use the status dropdown on each lead card to change from "new" to "contacted" or "converted".' },
  ]},
  { title: '5. Coupons and Offers', items: [
    { q: 'How to create a coupon code', a: '1. Go to Coupons\n2. Enter the code (e.g., WELCOME10)\n3. Choose type: percentage or fixed amount\n4. Set the discount value\n5. Optionally set minimum order and expiry\n6. Click Create' },
    { q: 'How to create a seasonal offer', a: 'Go to Offers. Create a new offer with a banner image, discount percentage, and date range. Toggle "Show Banner" to display on the website.' },
  ]},
  { title: '6. Blog and Content', items: [
    { q: 'How to write a blog post', a: '1. Go to Blog > New Post\n2. Enter the title (slug is auto-generated)\n3. Write your content (HTML supported)\n4. Add a cover image\n5. Select category and add tags\n6. Click Publish or Save Draft' },
    { q: 'How to embed a YouTube video', a: 'In the blog editor, paste the YouTube URL in the video URL field and select "YouTube" as the type. The video will embed automatically.' },
    { q: 'How to use AI Copywriter', a: 'In the product editor, click "Generate with AI" next to the description field. Enter a brief description of your product, select tone and occasion, then click Generate. Choose from 3 variations.' },
  ]},
  { title: '7. Settings', items: [
    { q: 'How to update the announcement bar', a: 'Go to Settings. Update the announcement text. Toggle active/inactive.' },
    { q: 'How to upload your UPI QR code', a: 'In Settings, upload your QR code image. This appears on the checkout page for QR payment.' },
    { q: 'How to change delivery charges', a: 'In Settings, update the delivery charge and free delivery minimum amount.' },
  ]},
  { title: '8. AI Tools', items: [
    { q: 'How to use AI Copywriter', a: 'When editing a product, click "Generate with AI". Describe your product briefly, select the occasion and tone. The AI will generate 3 description variations plus SEO meta and Instagram captions.' },
    { q: 'How to read Inventory Forecasts', a: 'The AI Production Planner on the dashboard shows: RED = critical (restock now), YELLOW = warning (plan production), GREEN = healthy stock.' },
  ]},
  { title: '9. Troubleshooting', items: [
    { q: 'Order not showing', a: 'Refresh the orders page. Check if the order was placed successfully. The customer should have received a confirmation.' },
    { q: 'Customer payment not received', a: '1. Check the payment screenshot on the order\n2. Verify the amount in your bank account\n3. If not received, contact customer via WhatsApp\n4. Mark as "pending" until verified' },
    { q: 'Image not uploading', a: 'Check your internet connection. Ensure the image is under 5MB. Try a different format (JPG/PNG). If issue persists, check Supabase Storage settings.' },
  ]},
];

export default function AdminDocsPage() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(SECTIONS[0]?.title || null);

  const filteredSections = SECTIONS.map(s => ({
    ...s,
    items: s.items.filter(i => !search || i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())),
  })).filter(s => s.items.length > 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <HelpCircle size={24} className="text-[#B76E79]" />
        <h1 className="font-serif text-2xl text-white">Help & Documentation</h1>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B5E5E]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documentation..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A1010] border border-white/10 font-sans text-sm text-white placeholder:text-[#8B5E5E]/60 focus:outline-none focus:ring-2 focus:ring-[#B76E79]/30" />
      </div>

      <div className="space-y-2">
        {filteredSections.map(section => (
          <div key={section.title} className="bg-[#1A1010] rounded-xl border border-white/5 overflow-hidden">
            <button onClick={() => setExpanded(expanded === section.title ? null : section.title)}
              className="w-full flex items-center justify-between p-4 font-sans text-white font-medium text-sm hover:bg-white/5 transition-colors">
              <span>{section.title}</span>
              {expanded === section.title ? <ChevronDown size={16} className="text-[#B76E79]" /> : <ChevronRight size={16} className="text-[#8B5E5E]" />}
            </button>
            {expanded === section.title && (
              <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                {section.items.map((item, i) => (
                  <div key={i} className="bg-[#0F0A0A] rounded-lg p-4">
                    <p className="font-sans text-sm text-[#B76E79] font-medium mb-2">{item.q}</p>
                    <p className="font-sans text-xs text-[#A0A0A0] whitespace-pre-line leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
