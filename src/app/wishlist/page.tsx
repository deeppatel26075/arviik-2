'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/UI/EmptyState';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none font-sans space-y-10 min-h-[60vh]">
      <div className="border-b border-stone-200 pb-5">
        <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
          Your Collection
        </span>
        <h1 className="font-syne font-black text-3xl uppercase tracking-wider text-stone-900 mt-1">
          Saved Grails
        </h1>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          title="Your Wishlist is Empty 😢"
          subtitle="You haven't saved any street fits yet. Browse the collection and tap the heart icon to save your favorites."
          btnText="Explore Drops"
          btnHref="/shop"
          icon={<Heart className="h-10 w-10 text-stone-300 stroke-1" />}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            // Re-adapt wishlist items to match ProductCard parameters
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                slug: item.slug,
                price: item.price,
                discount_price: item.discountPrice,
                product_images: [{ image_url: item.image }]
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
