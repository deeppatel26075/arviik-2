'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import HeroSlider from '@/components/Home/HeroSlider';
import RecentlyViewed from '@/components/Commerce/RecentlyViewed';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomeClientWrapperProps {
  products: any[];
  settings?: any;
}

export default function HomeClientWrapper({ products, settings }: HomeClientWrapperProps) {
  const [displayProducts, setDisplayProducts] = useState<any[]>(products);
  const [activeSettings, setActiveSettings] = useState<any>(settings || {});

  useEffect(() => {
    if (products && products.length > 0) {
      setDisplayProducts(products);
    }
  }, [products]);

  // Sync settings with localStorage fallback
  useEffect(() => {
    try {
      if (settings && Object.keys(settings).length > 0) {
        setActiveSettings(settings);
        localStorage.setItem('arviik_custom_settings', JSON.stringify(settings));
      } else {
        const storedSettings = localStorage.getItem('arviik_custom_settings');
        if (storedSettings) {
          setActiveSettings(JSON.parse(storedSettings));
        }
      }
    } catch (e) {
      console.error('Failed to load settings in homepage wrapper:', e);
    }
  }, [settings]);

  // Apply body-level background theme styles dynamically
  useEffect(() => {
    const bgConfig = activeSettings?.general_config || { bg_style: 'default', custom_bg_color: '#fafaf9', bg_image_url: '' };
    
    // Cache original body styles
    const originalBg = document.body.style.backgroundColor;
    const originalBgImg = document.body.style.backgroundImage;
    const originalBgSize = document.body.style.backgroundSize;
    const originalBgPos = document.body.style.backgroundPosition;
    const originalBgRepeat = document.body.style.backgroundRepeat;
    const originalBgAttachment = document.body.style.backgroundAttachment;
    const originalColor = document.body.style.color;

    // Apply settings
    if (bgConfig.bg_style === 'white') {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0c0c0b';
    } else if (bgConfig.bg_style === 'charcoal') {
      document.body.style.backgroundColor = '#0f0f0f';
      document.body.style.color = '#f5f5f4';
    } else if (bgConfig.bg_style === 'sepia') {
      document.body.style.backgroundColor = '#f4efe6';
      document.body.style.color = '#0c0c0b';
    } else if (bgConfig.bg_style === 'custom-color') {
      document.body.style.backgroundColor = bgConfig.custom_bg_color || '#fafaf9';
      
      const isDark = (hex: string) => {
        const c = (hex || '').replace('#', '');
        if (c.length !== 6) return false;
        const rgb = parseInt(c, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma < 135;
      };

      if (isDark(bgConfig.custom_bg_color)) {
        document.body.style.color = '#f5f5f4';
      } else {
        document.body.style.color = '#0c0c0b';
      }
    } else if (bgConfig.bg_style === 'custom-image' && bgConfig.bg_image_url) {
      document.body.style.backgroundImage = `url(${bgConfig.bg_image_url})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
    }

    // Reset styles on clean up
    return () => {
      document.body.style.backgroundColor = originalBg;
      document.body.style.backgroundImage = originalBgImg;
      document.body.style.backgroundSize = originalBgSize;
      document.body.style.backgroundPosition = originalBgPos;
      document.body.style.backgroundRepeat = originalBgRepeat;
      document.body.style.backgroundAttachment = originalBgAttachment;
      document.body.style.color = originalColor;
    };
  }, [activeSettings]);

  // Determine dynamic classes based on background theme config
  const bgStyleVal = activeSettings?.general_config?.bg_style || 'default';
  const customBgColorVal = activeSettings?.general_config?.custom_bg_color || '#fafaf9';
  
  const isDarkCustom = () => {
    if (bgStyleVal !== 'custom-color') return false;
    const c = (customBgColorVal || '').replace('#', '');
    if (c.length !== 6) return false;
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 135;
  };

  const isDarkTheme = bgStyleVal === 'charcoal' || isDarkCustom();
  
  const textClass = isDarkTheme ? 'text-white' : 'text-stone-900';
  const subTextClass = isDarkTheme ? 'text-stone-400' : 'text-stone-500';
  const cardBgClass = isDarkTheme ? 'bg-stone-900 border-stone-850 text-white' : 'bg-white border-stone-200 text-stone-900';
  const sectionBgClass = isDarkTheme ? 'bg-stone-900/40 border-y border-stone-850 py-20 select-none' : 'bg-stone-50 py-20 select-none border-y border-stone-150';

  // Filter products for homepage sections
  const bestsellers = displayProducts.filter(p => p.tags?.includes('BESTSELLER') || p.tags?.includes('TRENDING')).slice(0, 4);
  const newArrivals = displayProducts.filter(p => p.tags?.includes('NEW ARRIVAL')).slice(0, 4);
  const trendingNow = displayProducts.slice(2, 6); // Take middle slice for variety

  // If filtered lists are empty, fallback to slice of all products
  const renderBestsellers = bestsellers.length > 0 ? bestsellers : displayProducts.slice(0, 4);
  const renderNewArrivals = newArrivals.length > 0 ? newArrivals : displayProducts.slice(Math.max(0, displayProducts.length - 4));
  const renderTrending = trendingNow.length > 0 ? trendingNow : displayProducts.slice(0, 4);

  const categoriesList = [
    {
      name: 'Oversized Tees',
      img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600',
      href: '/shop'
    },
    {
      name: 'Graphic Prints',
      img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
      href: '/shop?category=Graphic+Prints'
    },
    {
      name: 'Minimalist Typo',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
      href: '/shop?category=Minimalist+Typo'
    }
  ];

  return (
    <div 
      className={`w-full space-y-0 ${isDarkTheme ? 'bg-stone-950 text-white' : bgStyleVal === 'sepia' ? 'bg-[#f4efe6]' : bgStyleVal === 'custom-color' ? '' : 'bg-white'}`}
      style={{ backgroundColor: bgStyleVal === 'custom-color' ? customBgColorVal : undefined }}
    >

      {/* 2. Hero Slider */}
      <HeroSlider />

      {/* 4. OUR BESTSELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 select-none">
        <div className="flex items-baseline justify-start select-none border-b border-stone-150/60 pb-3.5 mb-2">
          <h2 className={`font-syne font-black text-lg uppercase tracking-wider ${textClass}`}>
            T Shirt for Men
          </h2>
          <span className="text-xs text-stone-400 font-bold ml-2.5">
            90 items
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {renderBestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* SEE MORE BESTSELLERS Neon CTA Button */}
        <div className="pt-8 flex justify-center">
          <Link
            href="/shop?tag=BESTSELLER"
            className="w-full max-w-md text-center py-4 bg-accent border border-stone-950 text-stone-950 font-syne font-black text-xs tracking-[0.25em] uppercase rounded-sm shadow-retro-yellow active:scale-98 transition-transform"
          >
            SEE MORE BESTSELLERS
          </Link>
        </div>
      </section>

      {/* 11. Recently Viewed Slider */}
      <RecentlyViewed />
    </div>
  );
}
