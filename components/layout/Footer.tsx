import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1A0F0F] to-[#0D0A0A] border-t border-white/5 pt-16 pb-8 px-6 md:px-16 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-12">
        <div className="flex flex-col max-w-[280px] space-y-4">
          <Link href="/" className="font-serif text-3xl font-bold text-white tracking-wide">Return Box</Link>
          <p className="font-sans text-sm text-[#F4B8C1]">We Wrap Love</p>
          <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed">Handcrafted scented candles and return gifts designed to bring warmth and elegance into your spaces.</p>
        </div>
        <div className="flex flex-col space-y-3">
          <h4 className="font-sans text-white text-sm font-semibold tracking-wider uppercase mb-3">Explore</h4>
          {[['Home', '/'], ['Products', '/products'], ['Bulk Orders', '/bulk-orders'], ['Blog', '/blog'], ['Custom Orders', '/custom-orders'], ['Gallery', '/gallery'], ['About', '/about'], ['Contact', '/contact'], ['Track Order', '/track']].map(([name, href]) => (
            <Link key={name} href={href} className="font-sans text-[#A0A0A0] text-sm hover:text-[#F4B8C1] transition-colors">{name}</Link>
          ))}
        </div>
        <div className="flex flex-col space-y-3">
          <h4 className="font-sans text-white text-sm font-semibold tracking-wider uppercase mb-1">Discover</h4>
          <Link href="/find-your-scent" className="font-sans text-[#F4B8C1] text-sm hover:text-white transition-colors">✨ Find Your Scent</Link>
          <Link href="/wishlist" className="font-sans text-[#A0A0A0] text-sm hover:text-[#F4B8C1] transition-colors">My Wishlist</Link>
          <Link href="/blog" className="font-sans text-[#A0A0A0] text-sm hover:text-[#F4B8C1] transition-colors">Blog & Tips</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <h4 className="font-sans text-white text-sm font-semibold tracking-wider uppercase mb-1">Connect</h4>
          <a href="mailto:hello@returnbox.growxlabs.tech" className="font-sans text-sm text-[#A0A0A0] hover:text-[#F4B8C1] transition-colors">hello@returnbox.growxlabs.tech</a>
          <p className="font-sans text-sm text-[#A0A0A0]">Guntur, Andhra Pradesh</p>
          <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#B76E79] text-white text-xs px-5 py-2 rounded-full hover:bg-[#F4B8C1] transition-all font-medium mt-2 w-max">Chat on WhatsApp</a>
          <div className="flex items-center gap-3 mt-4">
            <a href="https://instagram.com/returnboxbysana" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all text-[#A0A0A0] hover:text-[#F4B8C1]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-[#A0A0A0]">© 2026 Return Box by Sana</div>
        <div className="text-xs text-[#A0A0A0]">Built with care by GrowX Labs</div>
      </div>
    </footer>
  );
}
