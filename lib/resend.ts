import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'orders@returnboxbysana.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://returnbox.growxlabs.tech';

// ─────────────────────────────────────────────
// Send order confirmation to customer
// ─────────────────────────────────────────────
export async function sendOrderConfirmation(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  delivery_charge: number;
  discount_amount: number;
  total: number;
  delivery_address: { address_line1: string; city: string; state: string; pincode: string };
}) {
  const itemRows = order.items
    .map(i => `<tr><td style="padding:8px;border-bottom:1px solid #f0e0e3;">${i.name}</td><td style="padding:8px;border-bottom:1px solid #f0e0e3;text-align:center;">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #f0e0e3;text-align:right;">₹${i.price}</td></tr>`)
    .join('');

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Order ${order.order_number} Confirmed — Return Box by Sana`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF8F0;padding:40px 30px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#B76E79;font-size:28px;margin:0;">Return Box by Sana</h1>
          <p style="color:#8B5E5E;font-size:14px;">We Wrap Love</p>
        </div>
        <div style="background:white;border-radius:12px;padding:30px;border:1px solid #F4B8C1;">
          <h2 style="color:#3D1C1C;margin-top:0;">Thank you, ${order.customer_name}! 🎀</h2>
          <p style="color:#8B5E5E;">Your order has been received and is being prepared with love.</p>
          <div style="background:#FFF8F0;border-radius:8px;padding:15px;margin:20px 0;">
            <p style="margin:0;font-weight:bold;color:#3D1C1C;">Order #${order.order_number}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <thead><tr style="background:#FFF8F0;"><th style="padding:10px;text-align:left;color:#3D1C1C;">Item</th><th style="padding:10px;text-align:center;color:#3D1C1C;">Qty</th><th style="padding:10px;text-align:right;color:#3D1C1C;">Price</th></tr></thead>
            <tbody>${itemRows}</tbody>
          </table>
          <div style="border-top:2px solid #F4B8C1;padding-top:15px;margin-top:10px;">
            <div style="display:flex;justify-content:space-between;color:#8B5E5E;margin:5px 0;"><span>Subtotal</span><span>₹${order.subtotal}</span></div>
            <div style="display:flex;justify-content:space-between;color:#8B5E5E;margin:5px 0;"><span>Delivery</span><span>${order.delivery_charge === 0 ? 'FREE' : '₹' + order.delivery_charge}</span></div>
            ${order.discount_amount > 0 ? `<div style="display:flex;justify-content:space-between;color:#B76E79;margin:5px 0;"><span>Discount</span><span>-₹${order.discount_amount}</span></div>` : ''}
            <div style="display:flex;justify-content:space-between;font-weight:bold;color:#3D1C1C;font-size:18px;margin-top:10px;"><span>Total</span><span>₹${order.total}</span></div>
          </div>
          <div style="background:#FFF8F0;border-radius:8px;padding:15px;margin-top:20px;">
            <p style="margin:0 0 5px;font-weight:bold;color:#3D1C1C;">Delivery Address</p>
            <p style="margin:0;color:#8B5E5E;">${order.delivery_address.address_line1}, ${order.delivery_address.city}, ${order.delivery_address.state} - ${order.delivery_address.pincode}</p>
          </div>
          <p style="color:#8B5E5E;margin-top:20px;">📦 Estimated delivery: 3-5 business days</p>
          <a href="${SITE_URL}/track?order=${order.order_number}" style="display:inline-block;background:#B76E79;color:white;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;margin-top:15px;">Track Your Order</a>
        </div>
        <p style="text-align:center;color:#8B5E5E;font-size:12px;margin-top:30px;">Questions? WhatsApp us or reply to this email.</p>
      </div>
    `,
  });
}

// ─────────────────────────────────────────────
// Send order notification to admin (Sana)
// ─────────────────────────────────────────────
export async function sendOrderNotificationToAdmin(order: {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  payment_method: string;
  payment_status: string;
  delivery_address: { address_line1: string; city: string; state: string; pincode: string };
  special_instructions?: string;
}) {
  const adminEmail = process.env.EMAIL_FROM || 'hello@returnbox.growxlabs.tech';
  
  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: `🔔 New Order ${order.order_number} — ₹${order.total}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#fff;border:2px solid #B76E79;border-radius:12px;">
        <h2 style="color:#B76E79;margin-top:0;">New Order Received! 🎉</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Order</td><td style="padding:8px;">${order.order_number}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Customer</td><td style="padding:8px;">${order.customer_name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Phone</td><td style="padding:8px;"><a href="tel:${order.customer_phone}">${order.customer_phone}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Email</td><td style="padding:8px;">${order.customer_email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Total</td><td style="padding:8px;font-weight:bold;color:#B76E79;">₹${order.total}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Payment</td><td style="padding:8px;">${order.payment_method} (${order.payment_status})</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Address</td><td style="padding:8px;">${order.delivery_address.address_line1}, ${order.delivery_address.city} - ${order.delivery_address.pincode}</td></tr>
          ${order.special_instructions ? `<tr><td style="padding:8px;font-weight:bold;color:#3D1C1C;">Instructions</td><td style="padding:8px;">${order.special_instructions}</td></tr>` : ''}
        </table>
        <h3 style="color:#3D1C1C;margin-top:20px;">Items:</h3>
        <ul>${order.items.map(i => `<li>${i.name} x${i.quantity} — ₹${i.price}</li>`).join('')}</ul>
        <a href="${SITE_URL}/admin/orders" style="display:inline-block;background:#B76E79;color:white;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;margin-top:15px;">Manage in Admin Panel</a>
      </div>
    `,
  });
}

// ─────────────────────────────────────────────
// Send status update to customer
// ─────────────────────────────────────────────
export async function sendStatusUpdate(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  order_status: string;
}) {
  const statusMessages: Record<string, string> = {
    confirmed: 'Your order has been confirmed! We are preparing it with love.',
    processing: 'Your order is being carefully prepared and packaged.',
    shipped: 'Your order has been shipped! It\'s on its way to you.',
    delivered: 'Your order has been delivered! We hope you love it. 💕',
    cancelled: 'Your order has been cancelled. If you have questions, please contact us.',
  };

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Order ${order.order_number} — ${order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF8F0;padding:40px 30px;border-radius:16px;">
        <h1 style="color:#B76E79;text-align:center;">Return Box by Sana</h1>
        <div style="background:white;border-radius:12px;padding:30px;border:1px solid #F4B8C1;text-align:center;">
          <h2 style="color:#3D1C1C;">Hi ${order.customer_name}!</h2>
          <p style="color:#8B5E5E;font-size:16px;">${statusMessages[order.order_status] || 'Your order status has been updated.'}</p>
          <div style="background:#FFF8F0;border-radius:8px;padding:15px;margin:20px 0;">
            <p style="margin:0;color:#3D1C1C;"><strong>Order:</strong> ${order.order_number}</p>
            <p style="margin:5px 0 0;color:#B76E79;font-weight:bold;font-size:18px;">Status: ${order.order_status.toUpperCase()}</p>
          </div>
          <a href="${SITE_URL}/track?order=${order.order_number}" style="display:inline-block;background:#B76E79;color:white;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;">Track Your Order</a>
        </div>
      </div>
    `,
  });
}

// ─────────────────────────────────────────────
// Send welcome email to new lead
// ─────────────────────────────────────────────
export async function sendWelcomeEmail(lead: {
  name: string;
  email: string;
  discount_code: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: lead.email,
    subject: 'Welcome! Your 10% Discount Code Inside 🎁 — Return Box by Sana',
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFF8F0;padding:40px 30px;border-radius:16px;">
        <h1 style="color:#B76E79;text-align:center;">Welcome to Return Box! 🎀</h1>
        <div style="background:white;border-radius:12px;padding:30px;border:1px solid #F4B8C1;text-align:center;">
          <h2 style="color:#3D1C1C;margin-top:0;">Hi ${lead.name}!</h2>
          <p style="color:#8B5E5E;">Thank you for joining our community of gifting enthusiasts. Here's your exclusive discount code:</p>
          <div style="background:linear-gradient(135deg,#B76E79,#F4B8C1);border-radius:12px;padding:25px;margin:25px 0;">
            <p style="margin:0;color:white;font-size:14px;">YOUR DISCOUNT CODE</p>
            <p style="margin:5px 0 0;color:white;font-size:32px;font-weight:bold;letter-spacing:4px;">${lead.discount_code}</p>
            <p style="margin:10px 0 0;color:white;font-size:13px;">Valid for 24 hours • 10% off your first order</p>
          </div>
          <a href="${SITE_URL}/products" style="display:inline-block;background:#3D1C1C;color:white;padding:14px 40px;border-radius:25px;text-decoration:none;font-weight:bold;font-size:16px;">Shop Now →</a>
          <p style="color:#8B5E5E;margin-top:25px;font-size:13px;">Follow us on <a href="https://instagram.com/returnboxbysana" style="color:#B76E79;">Instagram</a> for more inspiration!</p>
        </div>
      </div>
    `,
  });
}
