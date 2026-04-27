'use client';

import { useState } from 'react';
import { X, Camera, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReturnRequestFormProps {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  onClose: () => void;
}

const ISSUE_TYPES = [
  { value: 'damaged', label: 'Damaged Item' },
  { value: 'wrong_item', label: 'Wrong Item Received' },
  { value: 'missing_item', label: 'Missing Item' },
  { value: 'quality_issue', label: 'Quality Issue' },
  { value: 'other', label: 'Other' },
];

export default function ReturnRequestForm({ orderNumber, orderId, customerName, customerPhone, onClose }: ReturnRequestFormProps) {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [resolution, setResolution] = useState<'replacement' | 'refund'>('replacement');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'returns');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.url) setPhotos(prev => [...prev, data.url]);
      }
    } catch {
      toast.error('Photo upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueType) { toast.error('Please select an issue type'); return; }
    if (!description.trim()) { toast.error('Please describe the issue'); return; }
    if (photos.length === 0) { toast.error('Please upload at least one photo'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          order_number: orderNumber,
          issue_type: issueType,
          description,
          photos,
          preferred_resolution: resolution,
          customer_name: customerName,
          customer_phone: customerPhone,
        }),
      });
      if (res.ok) {
        toast.success('Return request submitted! We\'ll review within 24 hours.');
        onClose();
      } else {
        toast.error('Failed to submit request');
      }
    } catch {
      toast.error('Failed to submit request');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8B5E5E] hover:text-[#3D1C1C] transition-colors">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <AlertTriangle size={20} className="text-orange-500" />
          </div>
          <div>
            <h3 className="font-serif text-lg text-[#3D1C1C]">Report an Issue</h3>
            <p className="font-sans text-xs text-[#8B5E5E]">Order: {orderNumber}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Issue Type *</label>
            <select
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] appearance-none"
            >
              <option value="">Select issue type</option>
              {ISSUE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] resize-none"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Photos of Issue * (required)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {photos.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#F4B8C1]/30">
                  <img src={url} alt={`Issue ${i + 1}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#F4B8C1]/50 cursor-pointer hover:bg-[#FFF8F0] transition-colors">
              {uploading ? <Loader2 size={16} className="animate-spin text-[#B76E79]" /> : <Camera size={16} className="text-[#B76E79]" />}
              <span className="font-sans text-sm text-[#8B5E5E]">{uploading ? 'Uploading...' : 'Upload photos'}</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-2">Preferred Resolution</label>
            <div className="flex gap-3">
              {(['replacement', 'refund'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResolution(r)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-sans text-sm font-medium capitalize transition-all ${
                    resolution === r ? 'border-[#B76E79] bg-[#B76E79]/5 text-[#B76E79]' : 'border-[#F4B8C1]/30 text-[#8B5E5E]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#B76E79] text-white py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit Return Request
          </button>
        </form>
      </div>
    </div>
  );
}
