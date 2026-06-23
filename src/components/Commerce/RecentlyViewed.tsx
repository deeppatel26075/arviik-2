'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { PRODUCTS } from '@/data/products';

const LOCAL_STORAGE_KEY = 'arviik_recently_viewed';

// Helper to push to history
export const trackRecentlyViewed = (slug: string) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    let list: string[] = existing ? JSON.parse(existing) : [];
    
    // Filter duplicates and push to top
    list = list.filter(item => item !== slug);
    list.unshift(slug);
    
    // Cap at 4 items
    list = list.slice(0, 4);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to log recently viewed item:', e);
  }
};

export default function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const slugs = JSON.parse(stored) as string[];
        // Filter matching products
        const matched = slugs
          .map(slug => PRODUCTS.find(p => p.slug === slug))
          .filter((p): p is Product => !!p);
        setItems(matched);
      }
    } catch (e) {}
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="w-full py-16 border-t border-stone-100 select-none bg-stone-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center md:text-left">
          <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
            Your Shopping History
          </span>
          <h2 className="font-syne font-black text-xl uppercase tracking-wider text-stone-900 mt-1">
            Recently Viewed Fits
          </h2>
        </div>

        {/* Horizontal grid list */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map(product => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
