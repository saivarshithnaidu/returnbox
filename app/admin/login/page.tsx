'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('admin_token', data.token);
        toast.success('Welcome back!');
        router.push('/admin');
      } else {
        toast.error('Invalid password');
      }
    } catch { toast.error('Login failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#B76E79] mb-2">Return Box</h1>
          <p className="font-sans text-sm text-[#8B5E5E]">Admin Panel</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#1A1010] rounded-2xl p-8 border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-[#B76E79]/10 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={20} className="text-[#B76E79]" /></div>
          <input type="password" placeholder="Admin Password" required value={password} onChange={e => setPassword(e.target.value)} autoFocus
            className="w-full px-4 py-3 rounded-xl bg-[#0F0A0A] border border-white/10 text-white font-sans text-sm placeholder:text-[#8B5E5E]/50 focus:outline-none focus:ring-2 focus:ring-[#B76E79]" />
          <button type="submit" disabled={loading} className="w-full bg-[#B76E79] text-white py-3 rounded-xl font-sans font-semibold hover:bg-[#9a5a65] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null} Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
