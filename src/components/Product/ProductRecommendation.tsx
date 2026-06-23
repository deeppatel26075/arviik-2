'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';
import { productService } from '@/services/productService';

interface ProductRecommendationProps {
  currentProduct: Product;
}

export default function ProductRecommendation({ currentProduct }: ProductRecommendationProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const all = await productService.getAllProducts();
        
        // Filter out current product, match by category or price similarity
        const filtered = all
          .filter(p => p.id !== currentProduct.id)
          .filter(p => p.category === currentProduct.category || p.tags.some(t => currentProduct.tags.includes(t)))
          .slice(0, 4);

        // Fallback: just take any 4 other products if category match is low
        if (filtered.length < 2) {
          const fallback = all.filter(p => p.id !== currentProduct.id).slice(0, 4);
          setRecommendations(fallback);
        } else {
          setRecommendations(filtered);
        }
      } catch (e) {
        console.error('Failed to resolve recommendations:', e);
      }
    };
    fetchRecommendations();
  }, [currentProduct]);

  if (recommendations.length === 0) return null;

  return (
    <section className="w-full py-12 border-t border-stone-150 select-none">
      <div className="space-y-8">
        <div>
          <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
            Curated Styles
          </span>
          <h2 className="font-syne font-black text-xl uppercase tracking-wider text-stone-900 mt-1">
            You May Also Like
          </h2>
        </div>

        {/* 4 column product card list */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommendations.map(product => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
