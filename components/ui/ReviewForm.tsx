'use client';

import { useState } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

interface ReviewFormProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function ReviewForm({ productId, productName, onClose, onSubmitted }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'reviews');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch {
      toast.error('Image upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Please enter your name'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name,
          rating,
          review_text: text || null,
          review_image_url: imageUrl || null,
        }),
      });
      if (res.ok) {
        toast.success('Review submitted! It will appear after approval.');
        onSubmitted();
      } else {
        toast.error('Failed to submit review');
      }
    } catch {
      toast.error('Failed to submit review');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8B5E5E] hover:text-[#3D1C1C] transition-colors">
          <X size={20} />
        </button>

        <h3 className="font-serif text-xl text-[#3D1C1C] mb-1">Write a Review</h3>
        <p className="font-sans text-sm text-[#8B5E5E] mb-6">{productName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Your Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1]"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-2">Rating *</label>
            <StarRating rating={rating} interactive size={28} onChange={setRating} />
          </div>

          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Your Review</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#F4B8C1]/30 bg-white font-sans text-sm text-[#3D1C1C] placeholder:text-[#8B5E5E]/40 focus:outline-none focus:ring-2 focus:ring-[#F4B8C1] resize-none"
            />
          </div>

          <div>
            <label className="font-sans text-xs font-medium text-[#3D1C1C] block mb-1.5">Add a Photo (optional)</label>
            {imageUrl ? (
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#F4B8C1]/30">
                <img src={imageUrl} alt="Review" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setImageUrl('')} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#F4B8C1]/50 cursor-pointer hover:bg-[#FFF8F0] transition-colors">
                {uploading ? <Loader2 size={16} className="animate-spin text-[#B76E79]" /> : <Camera size={16} className="text-[#B76E79]" />}
                <span className="font-sans text-sm text-[#8B5E5E]">{uploading ? 'Uploading...' : 'Upload photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#B76E79] text-white py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
