'use client';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import LeadCapturePopup from '@/components/ui/LeadCapturePopup';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <Toaster position="top-center" toastOptions={{ style: { background: '#3D1C1C', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '14px', borderRadius: '12px' } }} />
        <main className="flex-1 w-full">{children}</main>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#3D1C1C', color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '14px', borderRadius: '12px' } }} />
      <AnnouncementBar />
      <Navbar />
      <LeadCapturePopup />
      <FloatingWhatsApp />
      <main className="flex-1 w-full overflow-hidden">{children}</main>
      <Footer />
    </>
  );
}
