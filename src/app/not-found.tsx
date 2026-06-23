'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 select-none font-sans min-h-[60vh] space-y-5">
      <div className="text-6xl">👕</div>
      
      <div className="space-y-1">
        <span className="text-[10px] text-sale font-bold tracking-[0.3em] uppercase">
          Error 404
        </span>
        <h1 className="font-syne font-black text-2xl uppercase tracking-wider text-stone-900 mt-1">
          Oops, this fit disappeared
        </h1>
      </div>

      <p className="text-xs text-stone-500 max-w-xs font-light leading-relaxed">
        The streetwear page or grail you are looking for has sold out, changed direction, or doesn't exist.
      </p>

      <div className="pt-4">
        <Link
          href="/shop"
          className="font-syne font-black text-[11px] sm:text-xs tracking-[0.2em] bg-primary text-white px-8 py-3.5 uppercase shadow-retro hover:bg-stone-900 active:scale-95 transition-all"
        >
          Explore New Drops
        </Link>
      </div>
    </div>
  );
}
