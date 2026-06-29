'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoryStrip() {
  const items = [
    {
      label: 'OVERSIZED TEES',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=300',
      href: '/shop?category=Oversized+T-Shirts'
    },
    {
      label: 'GRAPHIC TEES',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=300',
      href: '/shop?category=Graphic+Prints'
    },
    {
      label: 'HOODIES & SWEATSHIRTS',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=300',
      href: '/shop?category=Hoodies'
    },
    {
      label: 'JOGGERS & CARGOS',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=300',
      href: '/shop?category=Joggers'
    },
    {
      label: 'CO-ORD SETS',
      image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=300',
      href: '/shop?category=Co-ords'
    }
  ];

  return (
    <section className="w-full bg-white py-6 px-4 sm:px-6 lg:px-8 border-b border-stone-100 select-none">
      <div className="max-w-7xl mx-auto flex overflow-x-auto justify-start sm:justify-center gap-6 pb-2 scrollbar-none">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex flex-col items-center flex-shrink-0 w-24 sm:w-28 group"
          >
            {/* Circular Image container */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border border-stone-200/60 bg-stone-50 shadow-2xs group-hover:shadow-xs transition-shadow duration-300">
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>

            {/* Label */}
            <span className="text-[8px] sm:text-[9px] text-stone-500 font-bold uppercase tracking-widest text-center mt-2.5 group-hover:text-stone-900 transition-colors leading-tight">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
