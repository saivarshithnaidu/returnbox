'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Gift, Settings, BarChart3, LogOut, Menu, X, ChevronDown, FolderOpen } from 'lucide-react';

const NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', href: '/admin/products', icon: Package, sub: [{ name: 'All Products', href: '/admin/products' }, { name: 'Add Product', href: '/admin/products/new' }] },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Leads', href: '/admin/leads', icon: Users },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag },
  { name: 'Offers', href: '/admin/offers', icon: Gift },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && pathname !== '/admin/login') router.push('/admin/login');
    else setAuthed(true);
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return <div className="min-h-screen bg-[#0F0A0A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full" /></div>;

  const logout = () => { localStorage.removeItem('admin_token'); router.push('/admin/login'); };

  return (
    <div className="min-h-screen bg-[#0F0A0A] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-64'} bg-[#1A1010] border-r border-white/5 flex flex-col transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`p-5 border-b border-white/5 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <Link href="/admin" className="font-serif text-xl font-bold text-[#B76E79] whitespace-nowrap">Return Box <span className="text-xs font-sans text-[#8B5E5E] font-normal">Admin</span></Link>}
          <button onClick={() => setCollapsed(!collapsed)} className={`hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-[#8B5E5E] hover:text-[#B76E79] transition-colors ${collapsed ? '' : 'ml-2'}`}>
            <Menu size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const hasSub = item.sub && item.sub.length > 0;
            const isExpanded = expandedItem === item.name;
            return (
              <div key={item.name} className="relative group">
                <Link href={hasSub ? '#' : item.href} onClick={e => { if (hasSub) { e.preventDefault(); setExpandedItem(isExpanded ? null : item.name); } setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all ${isActive ? 'bg-[#B76E79]/10 text-[#B76E79]' : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'} ${collapsed ? 'justify-center px-0' : ''}`}>
                  <Icon size={20} className="shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {!collapsed && hasSub && <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#1A1010] border border-white/10 rounded text-xs text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
                {hasSub && isExpanded && !collapsed && (
                  <div className="ml-9 mt-1 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.sub.map(s => (
                      <Link key={s.href} href={s.href} onClick={() => setSidebarOpen(false)} className={`block px-3 py-2 rounded-lg font-sans text-xs transition-colors ${pathname === s.href ? 'text-[#B76E79]' : 'text-[#8B5E5E] hover:text-white'}`}>{s.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button onClick={logout} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-[#8B5E5E] hover:text-red-400 hover:bg-red-400/5 w-full transition-all ${collapsed ? 'justify-center px-0' : ''}`}>
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Mobile Menu Trigger (Subtle) */}
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-6 left-6 z-30 p-2 bg-[#1A1010] border border-white/10 rounded-lg text-[#B76E79] shadow-xl">
          <Menu size={20} />
        </button>

        {/* Top bar replacement (very subtle) */}
        <div className="flex justify-end p-6 pb-0">
          <Link href="/" target="_blank" className="font-sans text-[10px] tracking-widest uppercase font-bold text-[#8B5E5E] hover:text-[#B76E79] transition-colors flex items-center gap-2 group">
            <span className="w-4 h-[1px] bg-[#8B5E5E] group-hover:bg-[#B76E79] transition-colors" />
            View Store
          </Link>
        </div>

        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
