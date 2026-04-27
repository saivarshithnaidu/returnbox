// Festival calendar for gifting reminders — hard-coded dates for current year
export interface FestivalInfo {
  name: string;
  month: number; // 0-indexed
  day: number;
  icon: string;
  suggestedDiscount: number;
  suggestedBanner: string;
}

// These are approximate dates; adjust yearly
export const FESTIVALS: FestivalInfo[] = [
  { name: 'Valentine\'s Day', month: 1, day: 14, icon: '💝', suggestedDiscount: 15, suggestedBanner: 'Spread love with handmade candles this Valentine\'s! 💕' },
  { name: 'Holi', month: 2, day: 14, icon: '🎨', suggestedDiscount: 10, suggestedBanner: 'Add color to your celebrations with our festive collection! 🌈' },
  { name: 'Ugadi', month: 2, day: 30, icon: '🌺', suggestedDiscount: 15, suggestedBanner: 'New beginnings deserve beautiful gifts! 🌺' },
  { name: 'Mother\'s Day', month: 4, day: 11, icon: '💐', suggestedDiscount: 20, suggestedBanner: 'Gift her something she\'ll treasure — handmade with love! 💐' },
  { name: 'Eid', month: 5, day: 17, icon: '🌙', suggestedDiscount: 15, suggestedBanner: 'Eid Mubarak! Gift premium candles and hampers! 🌙' },
  { name: 'Raksha Bandhan', month: 7, day: 9, icon: '🪢', suggestedDiscount: 15, suggestedBanner: 'Celebrate the bond with handcrafted gifts! 🪢' },
  { name: 'Dussehra', month: 9, day: 2, icon: '🏹', suggestedDiscount: 15, suggestedBanner: 'Victory celebrations call for special gifts! 🏹' },
  { name: 'Diwali', month: 9, day: 20, icon: '🪔', suggestedDiscount: 25, suggestedBanner: 'Light up Diwali with our exclusive candle collection! 🪔' },
  { name: 'Christmas', month: 11, day: 25, icon: '🎄', suggestedDiscount: 20, suggestedBanner: 'Merry gifting! Premium hampers & candles for Christmas! 🎄' },
  { name: 'New Year', month: 0, day: 1, icon: '🎆', suggestedDiscount: 15, suggestedBanner: 'Start the new year with warmth and elegance! 🎆' },
];

export function getUpcomingFestivals(daysAhead: number = 30): (FestivalInfo & { daysUntil: number; date: Date })[] {
  const now = new Date();
  const year = now.getFullYear();
  
  return FESTIVALS
    .map(f => {
      let festDate = new Date(year, f.month, f.day);
      // If the festival has already passed this year, check next year
      if (festDate < now) {
        festDate = new Date(year + 1, f.month, f.day);
      }
      const diffMs = festDate.getTime() - now.getTime();
      const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return { ...f, daysUntil, date: festDate };
    })
    .filter(f => f.daysUntil <= daysAhead && f.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}
