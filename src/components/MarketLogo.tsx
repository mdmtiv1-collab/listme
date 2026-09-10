'use client';

import React from 'react';

interface MarketLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export default function MarketLogo({ name, className = 'w-11 h-11' }: MarketLogoProps) {
  const n = (name || '').toLowerCase();

  // 1. Atacadão
  if (n.includes('atacadão') || n.includes('atacadao')) {
    return (
      <div className={`${className} bg-white rounded-xl flex flex-col items-center justify-center p-1 shadow-md border border-neutral-200 shrink-0 overflow-hidden`}>
        <svg viewBox="0 0 100 68" className="w-full h-auto" fill="none">
          <path d="M50 4 L18 64 H34 L43 46 H57 L66 64 H82 Z" fill="#F37021" />
          <polygon points="50,18 41,38 59,38" fill="#FFFFFF" />
          <rect x="25" y="42" width="50" height="7" rx="3.5" fill="#009639" />
        </svg>
        <span className="text-[7px] font-black tracking-wider text-[#F37021] font-sans uppercase mt-0.5 leading-none">
          ATACADÃO
        </span>
      </div>
    );
  }

  // 2. Carrefour
  if (n.includes('carrefour')) {
    return (
      <div className={`${className} bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md border border-neutral-200 shrink-0 overflow-hidden`}>
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
          <path d="M48 20 C28 20 18 36 18 50 C18 64 28 80 48 80 L52 70 C38 70 30 60 30 50 C30 40 38 30 52 30 Z" fill="#00387B" />
          <path d="M52 20 L82 50 L52 80 L62 50 Z" fill="#E21D24" />
        </svg>
      </div>
    );
  }

  // 3. Assaí
  if (n.includes('assaí') || n.includes('assai')) {
    return (
      <div className={`${className} bg-neutral-950 rounded-xl flex flex-col items-center justify-center p-1 shadow-md border border-white/20 shrink-0 overflow-hidden`}>
        <div className="flex items-end justify-center gap-0.5 mb-0.5">
          <div className="w-1 h-2 bg-[#FFB800] rounded-full" />
          <div className="w-1.5 h-3.5 bg-[#FF8C00] rounded-full" />
          <div className="w-1.5 h-4.5 bg-[#E52320] rounded-full" />
          <div className="w-1.5 h-3.5 bg-[#FF8C00] rounded-full" />
          <div className="w-1 h-2 bg-[#FFB800] rounded-full" />
        </div>
        <span className="text-[9px] font-black tracking-tight text-white font-sans uppercase leading-none">
          ASSAÍ
        </span>
      </div>
    );
  }

  // 4. Muffato
  if (n.includes('muffato') || n.includes('super muffato')) {
    return (
      <div className={`${className} bg-[#C8102E] rounded-xl flex flex-col items-center justify-center p-1 shadow-md border border-white/10 shrink-0 overflow-hidden`}>
        <span className="text-[12px] font-black text-white font-serif tracking-tighter leading-none">M</span>
        <span className="text-[6.5px] font-bold text-white font-sans uppercase tracking-widest mt-0.5 leading-none">MUFFATO</span>
      </div>
    );
  }

  // 5. Condor
  if (n.includes('condor')) {
    return (
      <div className={`${className} bg-[#004B87] rounded-xl flex flex-col items-center justify-center p-1 shadow-md border border-white/10 shrink-0 overflow-hidden`}>
        <span className="text-[11px] font-black text-white font-sans tracking-tight leading-none">CONDOR</span>
      </div>
    );
  }

  // Fallback
  return (
    <div className={`${className} bg-neutral-900 rounded-xl flex items-center justify-center text-[#84E000] font-bold text-xs shadow-md border border-white/10 shrink-0`}>
      {(name || 'LM').slice(0, 2).toUpperCase()}
    </div>
  );
}
