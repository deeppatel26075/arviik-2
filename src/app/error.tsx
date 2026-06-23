'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Next.js Root Error Boundary triggered:', error);
  }, [error]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 select-none font-sans min-h-[60vh] space-y-6">
      <div className="text-6xl">💥</div>

      <div className="space-y-1">
        <span className="text-[10px] text-sale font-bold tracking-[0.3em] uppercase">
          Runtime Exception
        </span>
        <h1 className="font-syne font-black text-2xl uppercase tracking-wider text-stone-900 mt-1">
          Something went wrong
        </h1>
      </div>

      <p className="text-xs text-stone-500 max-w-sm font-light leading-relaxed">
        Our streetwear servers encountered a glitch. Press reload below to try refreshing the state, or return to the main shop.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          onClick={reset}
          className="font-syne font-black text-[11px] sm:text-xs tracking-[0.2em] bg-secondary text-white px-8 py-3.5 uppercase shadow-retro hover:opacity-90 active:scale-95 transition-all"
        >
          Retry Load
        </button>
        <Link
          href="/"
          className="font-syne font-black text-[11px] sm:text-xs tracking-[0.2em] bg-white border border-stone-950 text-stone-950 px-8 py-3.5 uppercase hover:bg-stone-50 active:scale-95 transition-all"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
}
