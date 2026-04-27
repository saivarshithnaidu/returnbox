'use client';
import { CheckCircle2, Package, Truck, MapPin, Ban } from 'lucide-react';

const STEPS = [
  { key: 'new', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
];

export default function OrderTimeline({ status, updatedAt }: { status: string; updatedAt?: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
        <Ban className="text-red-500" size={24} />
        <div>
          <p className="font-sans font-semibold text-red-700">Order Cancelled</p>
          {updatedAt && <p className="font-sans text-xs text-red-500">{new Date(updatedAt).toLocaleDateString('en-IN')}</p>}
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex(s => s.key === status);

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const current = i === currentIndex;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-[#B76E79] text-white' : 'bg-[#F4B8C1]/20 text-[#8B5E5E]/40'} ${current ? 'ring-2 ring-[#B76E79]/30 ring-offset-2' : ''}`}>
                {done ? <CheckCircle2 size={16} /> : <Icon size={16} />}
              </div>
              {i < STEPS.length - 1 && <div className={`w-0.5 h-8 ${done ? 'bg-[#B76E79]' : 'bg-[#F4B8C1]/20'}`} />}
            </div>
            <div className="pt-1">
              <p className={`font-sans text-sm ${done ? 'font-semibold text-[#3D1C1C]' : 'text-[#8B5E5E]/50'}`}>{step.label}</p>
              {current && updatedAt && <p className="font-sans text-xs text-[#B76E79]">{new Date(updatedAt).toLocaleString('en-IN')}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
