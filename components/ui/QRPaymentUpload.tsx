'use client';
import { useState, useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface QRPaymentUploadProps {
  qrCodeUrl?: string;
  total: number;
  onScreenshotUploaded: (url: string) => void;
  onBillingUploaded?: (url: string) => void;
}

export default function QRPaymentUpload({ qrCodeUrl, total, onScreenshotUploaded, onBillingUploaded }: QRPaymentUploadProps) {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [billingUrl, setBillingUrl] = useState('');
  const [uploading, setUploading] = useState<'screenshot' | 'billing' | null>(null);

  const uploadFile = useCallback(async (file: File, type: 'screenshot' | 'billing') => {
    setUploading(type);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `payments/${type}`);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        if (type === 'screenshot') { setScreenshotUrl(data.url); onScreenshotUploaded(data.url); }
        else { setBillingUrl(data.url); onBillingUploaded?.(data.url); }
        toast.success(`${type === 'screenshot' ? 'Payment screenshot' : 'Billing details'} uploaded!`);
      }
    } catch { toast.error('Upload failed'); }
    setUploading(null);
  }, [onScreenshotUploaded, onBillingUploaded]);

  return (
    <div className="space-y-5">
      {/* QR Code Display */}
      <div className="text-center">
        <p className="font-sans text-sm text-[#8B5E5E] mb-3">Scan QR code and pay <span className="font-bold text-[#B76E79]">₹{total}</span></p>
        <div className="inline-block bg-white p-4 rounded-xl border border-[#F4B8C1]/30 shadow-sm">
          {qrCodeUrl ? (
            <Image src={qrCodeUrl} alt="UPI QR Code" width={200} height={200} className="rounded-lg" />
          ) : (
            <div className="w-[200px] h-[200px] bg-[#FFF8F0] rounded-lg flex items-center justify-center text-[#8B5E5E] font-sans text-sm">QR Code not set</div>
          )}
        </div>
      </div>

      {/* Screenshot Upload */}
      <div>
        <label className="font-sans text-sm font-medium text-[#3D1C1C] mb-2 block">Payment Screenshot *</label>
        {screenshotUrl ? (
          <div className="relative inline-block">
            <Image src={screenshotUrl} alt="Screenshot" width={120} height={120} className="rounded-lg border" />
            <button onClick={() => { setScreenshotUrl(''); onScreenshotUploaded(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#F4B8C1]/40 rounded-xl p-6 cursor-pointer hover:border-[#B76E79] hover:bg-[#FFF8F0] transition-colors">
            {uploading === 'screenshot' ? <Loader2 className="animate-spin text-[#B76E79]" /> : <Upload size={20} className="text-[#B76E79]" />}
            <span className="font-sans text-sm text-[#8B5E5E]">Upload payment screenshot</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'screenshot')} />
          </label>
        )}
      </div>

      {/* Billing Upload (optional) */}
      <div>
        <label className="font-sans text-sm font-medium text-[#3D1C1C] mb-2 block">Billing Details Photo <span className="text-[#8B5E5E]/50">(optional)</span></label>
        {billingUrl ? (
          <div className="relative inline-block">
            <Image src={billingUrl} alt="Billing" width={120} height={120} className="rounded-lg border" />
            <button onClick={() => { setBillingUrl(''); onBillingUploaded?.(''); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"><X size={14} /></button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#F4B8C1]/20 rounded-xl p-4 cursor-pointer hover:border-[#F4B8C1] transition-colors">
            {uploading === 'billing' ? <Loader2 className="animate-spin text-[#B76E79]" /> : <Upload size={16} className="text-[#8B5E5E]/40" />}
            <span className="font-sans text-xs text-[#8B5E5E]/60">Upload billing details</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0], 'billing')} />
          </label>
        )}
      </div>
    </div>
  );
}
