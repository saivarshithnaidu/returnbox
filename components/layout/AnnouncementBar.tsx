'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AnnouncementBar() {
  const [text, setText] = useState('Free delivery on orders above ₹499! 🎁');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.settings?.announcement_active === 'true' && d.settings?.announcement_text) {
        setText(d.settings.announcement_text);
      } else if (d.settings?.announcement_active === 'false') {
        setVisible(false);
      }
    }).catch(() => {});
  }, []);

  if (!visible) return null;
  return (
    <div className="bg-[#B76E79] text-white text-center py-2 px-4 text-sm font-sans tracking-wide relative z-20 flex items-center justify-center">
      <span>{text}</span>
      <button onClick={() => setVisible(false)} className="absolute right-3 text-white/60 hover:text-white"><X size={14} /></button>
    </div>
  );
}
