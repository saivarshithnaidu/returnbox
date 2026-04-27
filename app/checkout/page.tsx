'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';
import QRPaymentUpload from '@/components/ui/QRPaymentUpload';
import { Loader2, CreditCard, QrCode, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

declare global { interface Window { Razorpay: any; } }

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getDeliveryCharge, getDiscount, getTotal, coupon, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'qr_upload'>('razorpay');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [billingUrl, setBillingUrl] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address_line1: '', address_line2: '', city: '', state: '', pincode: '', landmark: '', instructions: '' });

  const subtotal = getSubtotal();
  const delivery = getDeliveryCharge();
  const discount = getDiscount();
  const total = getTotal();

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.settings?.qr_code_url) setQrCodeUrl(d.settings.qr_code_url);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (paymentMethod === 'razorpay') {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => { document.body.removeChild(script); };
    }
  }, [paymentMethod]);

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 flex flex-col items-center justify-center px-6">
        <p className="font-serif text-2xl text-[#3D1C1C] mb-4">Your cart is empty</p>
        <Link href="/products" className="text-[#B76E79] font-sans hover:underline">Browse Products →</Link>
      </div>
    );
  }

  const createOrder = async (pm: 'razorpay' | 'qr_upload', rpOrderId?: string, rpPaymentId?: string) => {
    const orderItems = items.map(i => ({ product_id: i.product_id, name: i.name, price: i.sale_price && i.sale_price < i.price ? i.sale_price : i.price, quantity: i.quantity, image: i.image }));
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: form.name, customer_phone: form.phone, customer_email: form.email,
        delivery_address: { address_line1: form.address_line1, address_line2: form.address_line2, city: form.city, state: form.state, pincode: form.pincode, landmark: form.landmark },
        items: orderItems, subtotal, delivery_charge: delivery, discount_amount: discount, coupon_code: coupon?.code, total, payment_method: pm,
        razorpay_order_id: rpOrderId, razorpay_payment_id: rpPaymentId,
        payment_screenshot_url: screenshotUrl || undefined, billing_details_url: billingUrl || undefined,
        special_instructions: form.instructions || undefined,
      }),
    });
    return res.json();
  };

  const handleRazorpay = async () => {
    setLoading(true);
    try {
      const rpRes = await fetch('/api/razorpay/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total }) });
      const rpData = await rpRes.json();
      if (!rpData.order_id) throw new Error('Failed to create payment');

      const options = {
        key: rpData.key, amount: rpData.amount, currency: rpData.currency, name: 'Return Box by Sana', description: 'Your Order', image: '/favicon.ico',
        order_id: rpData.order_id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#B76E79' },
        handler: async (response: any) => {
          await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response) });
          const orderRes = await createOrder('razorpay', rpData.order_id, response.razorpay_payment_id);
          if (orderRes.order) { setOrderNumber(orderRes.order.order_number); clearCart(); setStep(3); toast.success('Payment successful!'); }
        },
      };
      new window.Razorpay(options).open();
    } catch { toast.error('Payment failed. Please try again.'); }
    setLoading(false);
  };

  const handleQRSubmit = async () => {
    if (!screenshotUrl) { toast.error('Please upload payment screenshot'); return; }
    setLoading(true);
    try {
      const orderRes = await createOrder('qr_upload');
      if (orderRes.order) { setOrderNumber(orderRes.order.order_number); clearCart(); setStep(3); toast.success('Order placed! Payment verification in progress.'); }
    } catch { toast.error('Failed to place order'); }
    setLoading(false);
  };

  // Step 3: Confirmation
  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 flex flex-col items-center justify-center px-6 text-center">
        <CheckCircle size={64} className="text-green-500 mb-6" />
        <h1 className="font-serif text-3xl text-[#3D1C1C] mb-2">Order Placed Successfully!</h1>
        <p className="font-sans text-lg text-[#B76E79] font-bold mb-4">{orderNumber}</p>
        <p className="font-sans text-[#8B5E5E] mb-8 max-w-md">Thank you! You will receive a confirmation email shortly. You can track your order anytime.</p>
        <div className="flex gap-4">
          <Link href={`/track?order=${orderNumber}`} className="bg-[#B76E79] text-white px-6 py-3 rounded-full font-sans font-medium hover:bg-[#9a5a65] transition-colors">Track Order</Link>
          <Link href="/products" className="border-2 border-[#B76E79] text-[#B76E79] px-6 py-3 rounded-full font-sans font-medium hover:bg-[#B76E79] hover:text-white transition-colors">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]";

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-32 pb-20 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm font-bold ${step >= s ? 'bg-[#B76E79] text-white' : 'bg-[#F4B8C1]/20 text-[#8B5E5E]'}`}>{s}</div>
              <span className="font-sans text-sm text-[#3D1C1C] hidden sm:inline">{s === 1 ? 'Details' : 'Payment'}</span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[#B76E79]' : 'bg-[#F4B8C1]/30'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 1 && (
              <div className="bg-white rounded-2xl p-6 border border-[#F4B8C1]/15 space-y-4">
                <h2 className="font-serif text-xl text-[#3D1C1C]">Delivery Details</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Full Name *" required value={form.name} onChange={e => u('name', e.target.value)} />
                  <input className={inputCls} placeholder="Phone Number *" type="tel" required value={form.phone} onChange={e => u('phone', e.target.value)} />
                </div>
                <input className={inputCls} placeholder="Email Address *" type="email" required value={form.email} onChange={e => u('email', e.target.value)} />
                <input className={inputCls} placeholder="Address Line 1 *" required value={form.address_line1} onChange={e => u('address_line1', e.target.value)} />
                <input className={inputCls} placeholder="Address Line 2" value={form.address_line2} onChange={e => u('address_line2', e.target.value)} />
                <div className="grid grid-cols-3 gap-3">
                  <input className={inputCls} placeholder="City *" required value={form.city} onChange={e => u('city', e.target.value)} />
                  <input className={inputCls} placeholder="State *" required value={form.state} onChange={e => u('state', e.target.value)} />
                  <input className={inputCls} placeholder="Pincode *" required value={form.pincode} onChange={e => u('pincode', e.target.value)} />
                </div>
                <input className={inputCls} placeholder="Landmark (optional)" value={form.landmark} onChange={e => u('landmark', e.target.value)} />
                <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Special instructions (optional)" value={form.instructions} onChange={e => u('instructions', e.target.value)} />
                <button onClick={() => { if (!form.name || !form.phone || !form.email || !form.address_line1 || !form.city || !form.state || !form.pincode) { toast.error('Please fill all required fields'); return; } setStep(2); }}
                  className="w-full bg-[#B76E79] text-white py-3.5 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors">Continue to Payment</button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 border border-[#F4B8C1]/15 space-y-6">
                <h2 className="font-serif text-xl text-[#3D1C1C]">Payment Method</h2>
                <div className="flex gap-3">
                  <button onClick={() => setPaymentMethod('razorpay')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-sans text-sm font-medium transition-all ${paymentMethod === 'razorpay' ? 'border-[#B76E79] bg-[#B76E79]/5 text-[#B76E79]' : 'border-[#F4B8C1]/30 text-[#8B5E5E]'}`}>
                    <CreditCard size={18} /> Pay Online
                  </button>
                  <button onClick={() => setPaymentMethod('qr_upload')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-sans text-sm font-medium transition-all ${paymentMethod === 'qr_upload' ? 'border-[#B76E79] bg-[#B76E79]/5 text-[#B76E79]' : 'border-[#F4B8C1]/30 text-[#8B5E5E]'}`}>
                    <QrCode size={18} /> Pay via QR
                  </button>
                </div>

                {paymentMethod === 'razorpay' ? (
                  <button onClick={handleRazorpay} disabled={loading} className="w-full bg-[#B76E79] text-white py-3.5 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />} Pay {formatPrice(total)}
                  </button>
                ) : (
                  <>
                    <QRPaymentUpload qrCodeUrl={qrCodeUrl} total={total} onScreenshotUploaded={setScreenshotUrl} onBillingUploaded={setBillingUrl} />
                    <button onClick={handleQRSubmit} disabled={loading || !screenshotUrl} className="w-full bg-[#3D1C1C] text-white py-3.5 rounded-xl font-sans font-semibold hover:bg-[#2D1515] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                      {loading ? <Loader2 size={18} className="animate-spin" /> : null} I Have Paid — Place Order
                    </button>
                  </>
                )}
                <button onClick={() => setStep(1)} className="text-[#8B5E5E] font-sans text-sm hover:text-[#B76E79] transition-colors">← Back to details</button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#F4B8C1]/15 h-fit sticky top-28 space-y-3">
            <h3 className="font-serif text-lg text-[#3D1C1C]">Order Summary</h3>
            {items.map(i => (
              <div key={i.product_id} className="flex justify-between font-sans text-sm text-[#8B5E5E]">
                <span>{i.name} ×{i.quantity}</span>
                <span>{formatPrice((i.sale_price && i.sale_price < i.price ? i.sale_price : i.price) * i.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-[#F4B8C1]/20 pt-3 space-y-1.5 text-sm font-sans">
              <div className="flex justify-between text-[#8B5E5E]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-[#8B5E5E]"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
              {discount > 0 && <div className="flex justify-between text-[#B76E79]"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between font-bold text-[#3D1C1C] text-lg pt-2 border-t border-[#F4B8C1]/20"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
