const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '91XXXXXXXXXX';
const wa = (phone: string, msg: string) => `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

export const newLeadNotification = (l: { name: string; phone: string; email: string }) =>
  wa(WA, `🔔 *New Lead!*\nName: ${l.name}\nPhone: ${l.phone}\nEmail: ${l.email}\nTime: ${new Date().toLocaleString('en-IN')}`);

export const newOrderNotification = (o: { order_number: string; customer_name: string; customer_phone: string; total: number; payment_method: string }) =>
  wa(WA, `🛒 *New Order!*\nOrder: ${o.order_number}\nCustomer: ${o.customer_name} — ${o.customer_phone}\nAmount: ₹${o.total}\nPayment: ${o.payment_method}\nManage: returnbox.growxlabs.tech/admin/orders`);

export const qrVerificationNeeded = (o: { order_number: string; customer_name: string; customer_phone: string; total: number }) =>
  wa(WA, `⚠️ *QR Verification Needed!*\nOrder: ${o.order_number}\nAmount: ₹${o.total}\nCustomer: ${o.customer_name} — ${o.customer_phone}\nVerify: returnbox.growxlabs.tech/admin/orders`);

export const lowStockAlert = (p: { name: string; stock_count: number }) =>
  wa(WA, `⚠️ *Low Stock!* ${p.name}: ${p.stock_count} units left`);

export const welcomeCustomer = (c: { name: string; phone: string }) =>
  wa(c.phone, `Hi ${c.name}! 🎀 Welcome to Return Box by Sana.\nYour 10% code: *WELCOME10*\nValid 24hrs.\nShop: returnbox.growxlabs.tech`);

export const orderReceived = (c: { name: string; phone: string; order_number: string }) =>
  wa(c.phone, `Hi ${c.name}! 🎁 Order *${c.order_number}* received! We'll confirm within 30 mins.`);

export const orderConfirmed = (c: { name: string; phone: string; order_number: string }) =>
  wa(c.phone, `Hi ${c.name}! ✅ Order *${c.order_number}* confirmed! Track: returnbox.growxlabs.tech/track?order=${c.order_number}`);

export const chatLink = (msg?: string) => wa(WA, msg || 'Hi! I have a question.');
export const customerWaLink = (phone: string, msg?: string) => wa(phone, msg || 'Hi from Return Box by Sana!');
