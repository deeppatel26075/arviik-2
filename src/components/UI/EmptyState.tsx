'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  btnText?: string;
  btnHref?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  subtitle,
  btnText = 'Start Exploring',
  btnHref = '/shop',
  icon
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-stone-200/50 bg-stone-50/50 rounded-sm my-6 select-none max-w-lg mx-auto">
      {/* Icon Area */}
      {icon ? (
        <div className="text-stone-400 mb-4">{icon}</div>
      ) : (
        <div className="text-4xl mb-4">👕</div>
      )}

      {/* Text Area */}
      <h3 className="font-syne font-black text-sm uppercase text-stone-900 tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-xs text-stone-500 max-w-xs mb-6 font-light leading-relaxed">
        {subtitle}
      </p>

      {/* Button Action */}
      <Link
        href={btnHref}
        className="font-syne font-black text-[10px] sm:text-xs tracking-[0.2em] bg-primary text-white px-6 py-3 uppercase shadow-retro hover:bg-stone-900 active:scale-95 transition-all"
      >
        {btnText}
      </Link>
    </div>
  );
}
