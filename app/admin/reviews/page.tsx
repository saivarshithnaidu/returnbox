'use client';
import { useState, useEffect } from 'react';
import { Star, Check, X, Loader2, Eye } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import { timeAgo } from '@/lib/utils';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  const load = () => {
    fetch('/api/admin/reviews').then(r => r.json()).then(d => setReviews(d.reviews || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleApprove = async (id: string, approve: boolean) => {
    await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_approved: approve }) });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = reviews.filter(r => tab === 'pending' ? !r.is_approved : r.is_approved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-white">Reviews</h1>
        <div className="flex gap-2">
          {(['pending', 'approved'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl font-sans text-sm capitalize ${tab === t ? 'bg-[#B76E79] text-white' : 'bg-white/5 text-[#8B5E5E]'}`}>{t} ({reviews.filter(r => t === 'pending' ? !r.is_approved : r.is_approved).length})</button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-10"><Loader2 className="animate-spin text-[#B76E79] mx-auto" size={24} /></div>}

      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-[#1A1010] rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-sans text-white font-medium">{r.customer_name}</p>
                <p className="font-sans text-xs text-[#8B5E5E]">{r.product?.name || 'Product'} · {timeAgo(r.created_at)}</p>
              </div>
              <StarRating rating={r.rating} size={14} />
            </div>
            {r.review_text && <p className="font-sans text-sm text-[#A0A0A0] mb-3">{r.review_text}</p>}
            {r.review_image_url && <img src={r.review_image_url} alt="Review" className="w-20 h-20 rounded-lg object-cover mb-3" />}
            <div className="flex gap-2">
              {!r.is_approved && (
                <button onClick={() => handleApprove(r.id, true)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg font-sans text-xs hover:bg-green-500/20 transition-colors"><Check size={12} /> Approve</button>
              )}
              {r.is_approved && (
                <button onClick={() => handleApprove(r.id, false)} className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-lg font-sans text-xs hover:bg-yellow-500/20 transition-colors">Unapprove</button>
              )}
              <button onClick={() => handleDelete(r.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg font-sans text-xs hover:bg-red-500/20 transition-colors"><X size={12} /> Delete</button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <p className="text-center py-10 font-sans text-[#8B5E5E]">No {tab} reviews</p>}
      </div>
    </div>
  );
}
