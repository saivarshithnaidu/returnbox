import { v4 as uuidv4 } from 'uuid';

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const prefix = 'RB';
  const datePart = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${datePart}${random}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = sessionStorage.getItem('rb_session_id');
  if (!sid) { sid = uuidv4(); sessionStorage.setItem('rb_session_id', sid); }
  return sid;
}

export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
