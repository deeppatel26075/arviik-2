'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoryStrip() {
  const items = [
    {
      label: 'NEW DROPS',
      gradient: 'from-blue-500 to-indigo-600',
      href: '/shop?tag=NEW+ARRIVAL',
      // Spotlight & Star SVG
      icon: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-none stroke-current stroke-1.5">
          <path d="M12 2v4M4.93 4.93l2.83 2.83M19.07 4.93l-2.83 2.83" />
          <path d="M12 6c-3.31 0-6 2.69-6 6 0 2.3 1.3 4.3 3.2 5.3L6 22h12l-3.2-4.7c1.9-1 3.2-3 3.2-5.3 0-3.31-2.69-6-6-6z" opacity="0.3" fill="white" />
          <polygon points="12,9 13.5,12 17,12.5 14.5,15 15,18.5 12,17 9,18.5 9.5,15 7,12.5 10.5,12" fill="#ffd200" stroke="#f59e0b" strokeWidth="1" />
        </svg>
      )
    },
    {
      label: 'OVERSIZED',
      gradient: 'from-red-500 to-rose-600',
      href: '/shop?category=Oversized+T-Shirts',
      // Bold T-Shirt SVG
      icon: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-white/10 stroke-current stroke-1.5">
          <path d="M9 20h6v-2h-6v2zm-4-9v7h2v-7H5zm14 0v7h2v-7h-2z" opacity="0.2" />
          <path d="M6 4l3 2c1.5-1 3.5-1.5 3-1.5s1.5.5 3 1.5l3-2 3 4.5-3 1.5v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-9L2 8.5 5 4z" />
        </svg>
      )
    },
    {
      label: 'T-SHIRTS',
      gradient: 'from-orange-500 to-amber-500',
      href: '/shop?category=Oversized+T-Shirts',
      // Classic T-Shirt SVG
      icon: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-white/15 stroke-current stroke-1.5">
          <path d="M18 4l-2 1.5c-1-1-2.5-1.5-4-1.5s-3 .5-4 1.5L6 4 2 7l3.5 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9L22 7l-4-3z" />
        </svg>
      )
    },
    {
      label: 'JOGGERS',
      gradient: 'from-teal-500 to-emerald-600',
      href: '/shop?category=Joggers',
      // Jogger pants SVG
      icon: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-none stroke-current stroke-1.5">
          <path d="M5 2h14v3H5V2z" opacity="0.3" fill="white" />
          <path d="M6 3.5l1 16.5a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-7.5h2v7.5a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5L18 3.5H6z" />
        </svg>
      )
    },
    {
      label: 'HOODIES',
      gradient: 'from-purple-500 to-indigo-500',
      href: '/shop?category=Hoodies',
      // Hoodie SVG
      icon: (
        <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-none stroke-current stroke-1.5">
          <path d="M12 2L4 7v10a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V7l-8-5z" opacity="0.2" fill="white" />
          <path d="M12 3L4.5 7.5v8.5c0 2 1.5 3.5 3.5 3.5h8c2 0 3.5-1.5 3.5-3.5V7.5L12 3z" />
          <path d="M8 20l2-4h4l2 4" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      )
    },
    {
      label: 'PLUS SIZE',
      gradient: 'from-pink-500 to-rose-500',
      href: '/shop?category=Plus+Size',
      // T-shirt with 5XL text SVG
      icon: (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="absolute inset-0 w-full h-full text-white fill-none stroke-current stroke-1.5 p-3">
            <path d="M18 4l-2 1.5c-1-1-2.5-1.5-4-1.5s-3 .5-4 1.5L6 4 2 7l3.5 2v10a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V9L22 7l-4-3z" />
          </svg>
          <span className="font-syne font-black text-[9px] text-white tracking-tighter mt-1 z-10">5XL</span>
        </div>
      )
    }
  ];

  return (
    <section className="w-full bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-stone-100 select-none">
      <div className="max-w-7xl mx-auto flex overflow-x-auto gap-5 pb-1 scrollbar-none">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center justify-center flex-shrink-0 w-[78px] sm:w-[90px] group transition-transform duration-250 hover:scale-102"
          >
            {/* Gradient Card Box */}
            <div className={`aspect-square w-14 sm:w-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md relative overflow-hidden group-hover:shadow-lg transition-shadow duration-300`}>
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              {item.icon}
            </div>

            {/* Label */}
            <span className="text-[9px] sm:text-[10px] text-stone-800 font-black tracking-wider text-center mt-2 group-hover:text-secondary transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
