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

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 select-none">
        <div className="text-center">
          <span className={`text-[10px] ${subTextClass} font-bold tracking-[0.3em] uppercase`}>
            Fresh From Drop
          </span>
          <h2 className={`font-syne font-black text-2xl uppercase tracking-wider ${textClass} mt-1`}>
            New Arrivals
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {renderNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. OVERSIZED COLLECTION promo banner */}
      <section className="w-full bg-stone-950 text-white py-20 px-4 relative overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600"
          alt="ARVIIK Promo Look"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto space-y-5">
          <span className="text-[10px] text-accent font-bold tracking-[0.4em] uppercase">
            Heavyweight Drop Series
          </span>
          <h2 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-wider leading-none">
            ENGINEERED OVERSIZED FITS
          </h2>
          <p className="text-xs sm:text-sm font-light text-stone-300 max-w-md tracking-wider leading-relaxed">
            Custom-woven 240 GSM Terry cotton designed to hold shape and survive washes. Drop shoulder loose cut silhouette for absolute streetwear comfort.
          </p>
          <div className="pt-2">
            <Link
              href="/shop?category=Oversized+T-Shirts"
              className="inline-flex items-center space-x-2 bg-white text-stone-950 font-syne font-black text-[10px] sm:text-xs tracking-[0.2em] px-8 py-3.5 rounded-full uppercase hover:bg-stone-200 transition-colors"
            >
              <span>SHOP COLLECTION</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Veirdo-Style Banner Grid (2 columns on desktop, 1 on mobile) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Epic Thread */}
          <Link
            href="/shop?category=Graphic+Prints"
            className="group relative aspect-[16/10] sm:aspect-[21/10] w-full rounded-sm overflow-hidden border border-stone-200/40 flex items-center p-6 sm:p-10 shadow-xs hover:shadow-md transition-all duration-300 bg-stone-950 text-white"
          >
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800"
              alt="Epic Thread Collection"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
            <div className="relative z-10 space-y-2 max-w-xs sm:max-w-sm">
              <span className="text-[9px] text-[#ffd200] font-black tracking-[0.25em] uppercase">
                EPIC THREAD SERIES
              </span>
              <h3 className="font-syne font-black text-xl sm:text-3xl leading-none uppercase tracking-wider">
                BUY 2 FOR ₹999
              </h3>
              <p className="text-[10px] text-stone-300 font-medium leading-relaxed tracking-wider hidden sm:block">
                Premium high-density prints crafted from 240 GSM Terry cotton. Unmatched street aesthetics.
              </p>
              <div className="pt-1.5">
                <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-white text-stone-950 px-4 py-2 rounded-full group-hover:bg-[#ffd200] transition-colors">
                  Shop Now
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Supreme Edition */}
          <Link
            href="/shop?category=Minimalist+Typo"
            className="group relative aspect-[16/10] sm:aspect-[21/10] w-full rounded-sm overflow-hidden border border-stone-200/40 flex items-center p-6 sm:p-10 shadow-xs hover:shadow-md transition-all duration-300 bg-stone-900 text-white"
          >
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800"
              alt="Supreme Edition"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
            <div className="relative z-10 space-y-2 max-w-xs sm:max-w-sm">
              <span className="text-[9px] text-[#c4f135] font-black tracking-[0.25em] uppercase">
                SUPREME EDITION
              </span>
              <h3 className="font-syne font-black text-xl sm:text-3xl leading-none uppercase tracking-wider">
                FLAT 50% OFF
              </h3>
              <p className="text-[10px] text-stone-300 font-medium leading-relaxed tracking-wider hidden sm:block">
                Clean architectural structures. Minimalist typography and puff print drops.
              </p>
              <div className="pt-1.5">
                <span className="inline-block text-[9px] font-black uppercase tracking-widest bg-white text-stone-950 px-4 py-2 rounded-full group-hover:bg-[#c4f135] transition-colors">
                  View Collection
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 7. SHOP BY CATEGORY section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10 select-none">
        <div className="text-center">
          <span className={`text-[10px] ${subTextClass} font-bold tracking-[0.3em] uppercase`}>
            Narrow Your Fit
          </span>
          <h2 className={`font-syne font-black text-2xl uppercase tracking-wider ${textClass} mt-1`}>
            Shop By Category
          </h2>
        </div>

        {/* Visual Category Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoriesList.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="relative aspect-video sm:aspect-square w-full rounded-sm overflow-hidden border border-stone-200 group flex items-end p-6 shadow-2xs hover:shadow-md transition-shadow duration-300"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="relative z-10 w-full flex justify-between items-center text-white">
                <span className="font-syne font-black text-base uppercase tracking-wider">
                  {cat.name}
                </span>
                <span className="text-[9px] font-bold tracking-widest bg-white/10 backdrop-blur-xs border border-white/20 px-3 py-1.5 rounded-full">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. TRENDING NOW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 select-none">
        <div className="text-center">
          <span className={`text-[10px] ${subTextClass} font-bold tracking-[0.3em] uppercase`}>
            Street Grails
          </span>
          <h2 className={`font-syne font-black text-2xl uppercase tracking-wider ${textClass} mt-1`}>
            Trending Now
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {renderTrending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>      {/* 9. CUSTOMER REVIEWS */}
      <section className={sectionBgClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <span className={`text-[10px] ${subTextClass} font-bold tracking-[0.3em] uppercase`}>
              What The Crew Says
            </span>
            <h2 className={`font-syne font-black text-2xl uppercase tracking-wider ${textClass} mt-1`}>
              Community Reviews
            </h2>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Karan Malhotra',
                city: 'Mumbai',
                text: 'The print quality is unmatched. Most oversized tees lose shape around the neck after three washes, but ARVIIK feels as heavy and boxy as day one.',
                stars: 5,
              },
              {
                name: 'Elena Rostova',
                city: 'Delhi',
                text: 'Bought the Polarize Vintage Cream tee. Absolutely in love with the cotton fabric weight. Shipping was fast, and the size guide recommendation was spot on.',
                stars: 5,
              },
              {
                name: 'Rohan Sharma',
                city: 'Bangalore',
                text: 'Super premium packaging. Fits extremely oversized, giving that authentic street look. Buy 3 deal is really value for money!',
                stars: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className={`${cardBgClass} p-6 rounded-sm shadow-2xs flex flex-col space-y-4`}
              >
                <div className="flex items-center text-amber-500">
                  {[...Array(review.stars)].map((_, starIdx) => (
                    <Star key={starIdx} className="h-4 w-4 fill-current text-current" />
                  ))}
                </div>
                <p className={`text-xs ${isDarkTheme ? 'text-stone-300' : 'text-stone-600'} leading-relaxed italic font-light`}>
                  "{review.text}"
                </p>
                <div className={`pt-2.5 border-t ${isDarkTheme ? 'border-stone-800' : 'border-stone-100'} flex justify-between items-center text-[9px] font-bold ${subTextClass} uppercase tracking-widest`}>
                  <span>{review.name}</span>
                  <span>{review.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* 10. INSTAGRAM LOOKS */}
      <section className="py-20 space-y-10 select-none">
        <div className="text-center">
          <span className={`text-[10px] ${subTextClass} font-bold tracking-[0.3em] uppercase`}>
            #ARVIIKCREW
          </span>
          <h2 className={`font-syne font-black text-2xl uppercase tracking-wider ${textClass} mt-1`}>
            Instagram Looks
          </h2>
        </div>

        {/* Grid of gallery pictures */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600',
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600',
            'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600'
          ].map((src, i) => (
            <div key={i} className="relative aspect-square w-full group overflow-hidden bg-stone-100">
              <img
                src={src}
                alt={`Instagram look ${i + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold tracking-widest uppercase border border-white px-3 py-1.5 rounded-sm">
                  View Look
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Recently Viewed Slider */}
      <RecentlyViewed />
    </div>
  );
}
