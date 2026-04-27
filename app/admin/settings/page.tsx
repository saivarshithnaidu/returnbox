'use client';
import { useState, useEffect } from 'react';
import { Save, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [qrUploading, setQrUploading] = useState(false);

  useEffect(() => { fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.settings || {})); }, []);

  const save = async () => {
    setLoading(true);
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings }) });
    toast.success('Settings saved!');
    setLoading(false);
  };

  const uploadQR = async (file: File) => {
    setQrUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('folder', 'settings');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) { setSettings(s => ({ ...s, qr_code_url: data.url })); toast.success('QR code uploaded!'); }
    setQrUploading(false);
  };

  const u = (k: string, v: string) => setSettings(s => ({ ...s, [k]: v }));
  const inputCls = "w-full px-4 py-3 rounded-xl bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-1 focus:ring-[#B76E79]";

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-serif text-2xl text-white">Site Settings</h1>

      {/* Announcement */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
        <h2 className="font-sans text-white font-medium">Announcement Bar</h2>
        <input className={inputCls} value={settings.announcement_text || ''} onChange={e => u('announcement_text', e.target.value)} placeholder="Announcement text" />
        <label className="flex items-center gap-2 font-sans text-sm text-[#8B5E5E] cursor-pointer">
          <input type="checkbox" checked={settings.announcement_active === 'true'} onChange={e => u('announcement_active', e.target.checked ? 'true' : 'false')} className="accent-[#B76E79]" /> Active
        </label>
      </div>

      {/* WhatsApp */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
        <h2 className="font-sans text-white font-medium">WhatsApp Number</h2>
        <input className={inputCls} value={settings.whatsapp_number || ''} onChange={e => u('whatsapp_number', e.target.value)} placeholder="91XXXXXXXXXX" />
      </div>

      {/* Delivery */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
        <h2 className="font-sans text-white font-medium">Delivery Settings</h2>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Min for Free Delivery (₹)</label><input type="number" className={inputCls} value={settings.min_free_delivery || ''} onChange={e => u('min_free_delivery', e.target.value)} /></div>
          <div><label className="font-sans text-xs text-[#8B5E5E] mb-1 block">Delivery Charge (₹)</label><input type="number" className={inputCls} value={settings.delivery_charge || ''} onChange={e => u('delivery_charge', e.target.value)} /></div>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
        <h2 className="font-sans text-white font-medium">UPI QR Code</h2>
        {settings.qr_code_url && (
          <div className="inline-block bg-white p-3 rounded-lg"><Image src={settings.qr_code_url} alt="QR" width={150} height={150} className="rounded" /></div>
        )}
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl p-4 cursor-pointer hover:border-[#B76E79] transition-colors">
          {qrUploading ? <Loader2 className="animate-spin text-[#B76E79]" size={16} /> : <Upload size={16} className="text-[#8B5E5E]" />}
          <span className="font-sans text-sm text-[#8B5E5E]">Upload new QR code</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadQR(e.target.files[0])} />
        </label>
      </div>

      {/* Social */}
      <div className="bg-[#1A1010] rounded-xl border border-white/5 p-5 space-y-3">
        <h2 className="font-sans text-white font-medium">Social Links</h2>
        <input className={inputCls} value={settings.instagram_url || ''} onChange={e => u('instagram_url', e.target.value)} placeholder="Instagram URL" />
        <input className={inputCls} value={settings.contact_email || ''} onChange={e => u('contact_email', e.target.value)} placeholder="Contact email" />
      </div>

      <button onClick={save} disabled={loading} className="bg-[#B76E79] text-white px-6 py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center gap-2 disabled:opacity-50">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save All Settings
      </button>
    </div>
  );
}
