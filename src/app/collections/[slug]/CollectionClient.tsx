'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount_price?: number;
  fabric: string;
  gsm: string;
  fit_type: string;
  description: string;
  category?: { name: string };
  product_images?: { image_url: string }[];
  tags?: string[];
}

interface CollectionClientProps {
  initialProducts: Product[];
  collectionTitle: string;
  slug: string;
  settings: any;
}

export default function CollectionClient({
  initialProducts,
  collectionTitle,
  slug,
  settings,
}: CollectionClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

  // Filter States
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [selectedFit, setSelectedFit] = useState<string>('');
  const [priceSort, setPriceSort] = useState<string>(''); // 'low-high' | 'high-low' | ''

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const isDarkTheme = settings?.theme === 'dark';

  const colorsList = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Olive', hex: '#556B2F' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Grey', hex: '#808080' }
  ];

  const priceRanges = [
    { value: 'under-599', label: 'Under ₹599' },
    { value: '599-999', label: '₹599 - ₹999' },
    { value: '1000-1499', label: '₹1000 - ₹1499' },
    { value: 'over-1500', label: 'Over ₹1500' }
  ];

  const fits = ['Oversized Fit', 'Regular Fit'];
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Map Collection Banners
  let bannerUrl = 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1600'; // Default
  if (slug === 'epic-thread' || slug === 'graphic-prints' || slug === 'graphic-tees') {
    bannerUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600'; // Epic illustration
  } else if (slug === 'supreme-edition' || slug === 'minimalist-typo' || slug === 'minimalist-tees') {
    bannerUrl = 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=1600'; // Supreme panther style
  } else if (slug === 'oversized' || slug === 'oversized-t-shirts') {
    bannerUrl = 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600';
  } else if (slug === 'plus-size') {
    bannerUrl = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600';
  }

  // Filter effect hook
  useEffect(() => {
    let result = [...initialProducts];

    // Size Filter
    if (selectedSize) {
      result = result.filter((p: any) => {
        if (!p.inventory) return true;
        const sizeItem = p.inventory.find(
          (inv: any) => inv.size.toUpperCase() === selectedSize.toUpperCase()
        );
        return sizeItem && sizeItem.quantity > 0;
      });
    }

    // Color Filter
    if (selectedColor) {
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(selectedColor.toLowerCase());
        const descMatch = p.description?.toLowerCase().includes(selectedColor.toLowerCase());
        return nameMatch || descMatch;
      });
    }

    // Price Range Filter
    if (priceRange) {
      result = result.filter((p) => {
        const itemPrice = p.discount_price || p.price;
        if (priceRange === 'under-599') return itemPrice < 599;
        if (priceRange === '599-999') return itemPrice >= 599 && itemPrice <= 999;
        if (priceRange === '1000-1499') return itemPrice >= 1000 && itemPrice <= 1499;
        if (priceRange === 'over-1500') return itemPrice > 1500;
        return true;
      });
    }

    // Fit Filter
    if (selectedFit) {
      result = result.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(selectedFit.toLowerCase());
        const descMatch = p.description?.toLowerCase().includes(selectedFit.toLowerCase());
        return nameMatch || descMatch;
      });
    }

    // Price Sorting
    if (priceSort === 'low-high') {
      result.sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;
        return priceA - priceB;
      });
    } else if (priceSort === 'high-low') {
      result.sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;
        return priceB - priceA;
      });
    }

    setFilteredProducts(result);
  }, [selectedSize, selectedColor, priceRange, selectedFit, priceSort, initialProducts]);

  const clearFilters = () => {
    setSelectedSize('');
    setSelectedColor('');
    setPriceRange('');
    setSelectedFit('');
    setPriceSort('');
  };

  return (
    <div className={`w-full ${isDarkTheme ? 'bg-stone-950 text-white' : 'bg-white text-stone-900'} select-none pb-24`}>
      
      {/* 1. Collection Banner Image */}
      <div className="w-full relative aspect-[21/9] sm:aspect-[21/7] overflow-hidden bg-stone-900">
        <img
          src={bannerUrl}
          alt={collectionTitle}
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Absolute Banner Title overlay */}
        <div className="absolute bottom-6 left-6 sm:left-12">
          <span className="text-[10px] text-emerald-400 font-black tracking-[0.3em] uppercase block mb-1">
            ARVIIK DROP
          </span>
          <h1 className="font-syne font-black text-2xl sm:text-4xl uppercase tracking-wider text-white">
            {collectionTitle}
          </h1>
        </div>
      </div>

      {/* 2. Collection Header & Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-baseline justify-start border-b border-stone-150 pb-3 mb-6">
          <h2 className="font-syne font-black text-lg uppercase tracking-wider">
            {collectionTitle}
          </h2>
          <span className="text-xs text-stone-400 font-bold ml-2.5">
            {filteredProducts.length} items
          </span>
        </div>

        {/* 3. Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border border-dashed border-stone-200 rounded-xl text-center space-y-3.5">
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
              No items match this selection
            </p>
            <button 
              onClick={clearFilters}
              className="bg-stone-950 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </div>

      {/* 4. Mobile Floating Bottom Pill Filter Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-950 text-white border border-stone-800 px-6 py-3.5 rounded-full shadow-2xl z-40 flex items-center justify-between space-x-6 text-[10px] font-black tracking-widest uppercase font-syne select-none">
        <button 
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center space-x-2"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" />
          <span>Filters</span>
        </button>
        <span className="text-stone-700 font-normal">|</span>
        <button 
          onClick={() => setMobileSortOpen(true)}
          className="flex items-center space-x-2"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
          <span>Sort By</span>
        </button>
      </div>

      {/* 5. Mobile Sort Options Drawer */}
      <AnimatePresence>
        {mobileSortOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSortOpen(false)}
              className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={`fixed bottom-0 left-0 w-full ${isDarkTheme ? 'bg-stone-900 text-stone-300' : 'bg-white text-stone-850'} rounded-t-xl shadow-2xl z-50 flex flex-col pb-6`}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-stone-200">
                <span className="font-syne font-black uppercase tracking-wider text-[10px] text-stone-900">
                  Sort By
                </span>
                <button onClick={() => setMobileSortOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 py-3 flex flex-col space-y-1 text-xs font-semibold uppercase tracking-wider">
                {[
                  { value: '', label: 'Featured' },
                  { value: 'low-high', label: 'Price: Low to High' },
                  { value: 'high-low', label: 'Price: High to Low' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setPriceSort(opt.value);
                      setMobileSortOpen(false);
                    }}
                    className={`text-left py-3.5 border-b border-stone-100 last:border-b-0 ${
                      priceSort === opt.value ? 'text-purple-700 font-black' : 'text-stone-605'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed top-0 left-0 h-full w-full max-w-xs ${isDarkTheme ? 'bg-stone-900 text-stone-300' : 'bg-stone-50 text-stone-850'} shadow-2xl z-50 flex flex-col`}
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-stone-200 bg-white">
                <span className="font-syne font-black uppercase tracking-wider text-xs text-stone-900">
                  Filters
                </span>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8">
                {/* Sizes */}
                <div className="space-y-3">
                  <h3 className="font-syne font-bold uppercase text-xs tracking-wider border-b border-stone-200 pb-2">
                    Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`border font-semibold text-xs w-9 h-9 rounded-sm flex items-center justify-center transition-colors uppercase ${
                          selectedSize === size
                            ? 'bg-stone-950 text-white border-stone-950'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-3">
                  <h3 className="font-syne font-bold uppercase text-xs tracking-wider border-b border-stone-200 pb-2">
                    Colors
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {colorsList.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(selectedColor === color.name ? '' : color.name)}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform ${
                          selectedColor === color.name
                            ? 'border-stone-950 ring-2 ring-stone-950/30'
                            : 'border-stone-250/60'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColor === color.name && (
                          <span className={`w-1.5 h-1.5 rounded-full ${color.name === 'White' ? 'bg-stone-950' : 'bg-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h3 className="font-syne font-bold uppercase text-xs tracking-wider border-b border-stone-200 pb-2">
                    Price Range
                  </h3>
                  <div className="flex flex-col space-y-2 text-xs">
                    {priceRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => {
                          setPriceRange(priceRange === range.value ? '' : range.value);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left py-1 uppercase tracking-wider ${
                          priceRange === range.value ? 'font-black text-purple-700' : 'text-stone-500 font-medium'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fit */}
                <div className="space-y-3">
                  <h3 className="font-syne font-bold uppercase text-xs tracking-wider border-b border-stone-200 pb-2">
                    Fit
                  </h3>
                  <div className="flex flex-col space-y-2 text-xs">
                    {fits.map((fit) => (
                      <button
                        key={fit}
                        onClick={() => {
                          setSelectedFit(selectedFit === fit ? '' : fit);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left py-1 uppercase tracking-wider ${
                          selectedFit === fit ? 'font-black text-purple-700' : 'text-stone-500 font-medium'
                        }`}
                      >
                        {fit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {(selectedSize || selectedColor || priceRange || selectedFit || priceSort) && (
                  <button
                    onClick={() => {
                      clearFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className="w-full text-[10px] font-bold uppercase tracking-widest py-3 rounded-lg bg-stone-100 text-stone-850 hover:bg-stone-200"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
