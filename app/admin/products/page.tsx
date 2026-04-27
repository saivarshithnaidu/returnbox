'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/supabase/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/admin/products').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  const toggle = async (id: string, field: string, value: boolean) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: value }) });
    if (res.ok) { toast.success('Updated'); fetchProducts(); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Deleted'); fetchProducts(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl text-white">Products</h1>
        <Link href="/admin/products/new" className="bg-[#B76E79] text-white px-4 py-2 rounded-lg font-sans text-sm font-medium hover:bg-[#9a5a65] transition-colors flex items-center gap-2"><Plus size={16} /> Add Product</Link>
      </div>

      <div className="bg-[#1A1010] rounded-xl border border-white/5 overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">
            {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Active', 'Actions'].map(h => <th key={h} className="text-left px-4 py-3 font-sans text-xs text-[#8B5E5E] font-medium uppercase tracking-wider">{h}</th>)}
          </tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3"><div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#0F0A0A]">{p.images?.[0] && <Image src={p.images[0]} alt="" fill className="object-cover" sizes="48px" />}</div></td>
                <td className="px-4 py-3 font-sans text-sm text-white font-medium max-w-[200px] truncate">{p.name}</td>
                <td className="px-4 py-3 font-sans text-xs text-[#8B5E5E]">{(p as any).category?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className="font-sans text-sm text-white">{formatPrice(p.price)}</span>
                  {p.sale_price && <span className="font-sans text-xs text-[#B76E79] ml-1">{formatPrice(p.sale_price)}</span>}
                </td>
                <td className="px-4 py-3"><span className={`font-sans text-sm font-medium ${p.stock_count < 5 ? 'text-red-400' : 'text-white'}`}>{p.stock_count}</span></td>
                <td className="px-4 py-3"><button onClick={() => toggle(p.id, 'is_featured', !p.is_featured)} className={p.is_featured ? 'text-yellow-400' : 'text-[#8B5E5E]/30'}><Star size={16} fill={p.is_featured ? 'currentColor' : 'none'} /></button></td>
                <td className="px-4 py-3"><button onClick={() => toggle(p.id, 'is_active', !p.is_active)}>{p.is_active ? <ToggleRight size={20} className="text-green-400" /> : <ToggleLeft size={20} className="text-[#8B5E5E]" />}</button></td>
                <td className="px-4 py-3 flex gap-1">
                  <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B5E5E] hover:text-blue-400"><Edit size={14} /></Link>
                  <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-[#8B5E5E] hover:text-red-400"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && products.length === 0 && <p className="text-center py-10 font-sans text-sm text-[#8B5E5E]">No products yet</p>}
      </div>
    </div>
  );
}
