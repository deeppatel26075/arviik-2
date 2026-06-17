'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductImage {
  image_url: string;
}

interface InventoryItem {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  category?: { name: string };
  product_images?: ProductImage[];
  inventory?: InventoryItem[];
  is_featured?: boolean;
}

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  settings?: any;
}

export default function ShopClient({ initialProducts, categories, settings }: ShopClientProps) {
  const searchParams = useSearchParams();

  // Search parameters parsing
  const initialSearch = searchParams?.get('search') || '';
  const initialFilter = searchParams?.get('filter') || '';
  const initialCat = searchParams?.get('category') || '';

  // Filter States
  const [localProducts, setLocalProducts] = useState<Product[]>(initialProducts);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);
  const [activeSettings, setActiveSettings] = useState<any>(settings || {});
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [priceSort, setPriceSort] = useState<string>(''); // 'low-high' | 'high-low' | ''
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination count state
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync settings with localStorage fallback
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('arviik_custom_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setActiveSettings({
          ...parsed,
          ...settings
        });
      } else if (settings && Object.keys(settings).length > 0) {
        localStorage.setItem('arviik_custom_settings', JSON.stringify(settings));
        setActiveSettings(settings);
      }
    } catch (e) {
      console.error('Failed to load settings in shop client:', e);
    }
  }, [settings]);

  // Sync categories with localStorage fallback
  useEffect(() => {
    try {
      const storedCats = localStorage.getItem('arviik_custom_categories');
      if (storedCats) {
        setLocalCategories(JSON.parse(storedCats));
      } else {
        setLocalCategories(categories);
      }
    } catch (e) {
      console.error('Failed to load local categories:', e);
    }
  }, [categories]);

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

  // Sync products with localStorage cache
  useEffect(() => {
    try {
      const stored = localStorage.getItem('arviik_custom_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasOldMocks = parsed.some((p: any) => p.name === 'ARCHIVE-01 GRAPHIC TEE' || p.name === 'ESSENTIALS LOGO TEE');
        if (hasOldMocks) {
          localStorage.setItem('arviik_custom_products', JSON.stringify(initialProducts));
          setLocalProducts(initialProducts);
        } else if (parsed && parsed.length > 0) {
          setLocalProducts(parsed.filter((p: any) => !p.is_hidden));
        }
      }
    } catch (e) {
      console.error('Failed to load custom products in shop:', e);
    }
  }, [initialProducts]);

  // Reset pagination count when filter parameters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedCategory, selectedSize, priceSort]);

  // Apply filters whenever states change
  useEffect(() => {
    let filtered = [...localProducts];

    // 1. Search Query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // 2. Featured filter
    if (initialFilter === 'featured') {
      filtered = filtered.filter((p) => p.is_featured);
    }

    // 3. Category Filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) =>
          p.category?.name.toLowerCase() === selectedCategory.toLowerCase() ||
          p.category?.name.toLowerCase().replace(' ', '-') === selectedCategory.toLowerCase()
      );
    }

    // 4. Size Filter
    if (selectedSize) {
      filtered = filtered.filter((p) => {
        if (!p.inventory) return true;
        const sizeItem = p.inventory.find(
          (inv) => inv.size.toUpperCase() === selectedSize.toUpperCase()
        );
        return sizeItem && sizeItem.quantity > 0;
      });
    }

    // 5. Price Sorting
    if (priceSort === 'low-high') {
      filtered.sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;
        return priceA - priceB;
      });
    } else if (priceSort === 'high-low') {
      filtered.sort((a, b) => {
        const priceA = a.discount_price || a.price;
        const priceB = b.discount_price || b.price;
        return priceB - priceA;
      });
    }

    setProducts(filtered);
  }, [searchQuery, selectedCategory, selectedSize, priceSort, localProducts, initialFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSize('');
    setPriceSort('');
  };

  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Paginated product subsets
  const displayedProducts = products.slice(0, visibleCount);
  const hasMore = products.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  // Contrast adjustments for dynamic background styles
  const bgStyleVal = activeSettings?.general_config?.bg_style || 'default';
  const customBgColorVal = activeSettings?.general_config?.custom_bg_color || '#fafaf9';
  
  let textClass = 'text-stone-900';
  let titleTextClass = 'text-stone-900';
  let sidebarHeaderClass = 'text-stone-900 border-stone-100';
  let borderBottomClass = 'border-stone-250';

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

  if (isDarkTheme) {
    textClass = 'text-stone-300';
    titleTextClass = 'text-white';
    sidebarHeaderClass = 'text-white border-stone-800';
    borderBottomClass = 'border-stone-800';
  }

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Header Banner */}
      <div className={`border-b ${borderBottomClass} pb-6`}>
        <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
          ARVIIK Catalog
        </span>
        <h1 className={`font-syne font-extrabold text-3xl uppercase tracking-wider ${titleTextClass} mt-1`}>
          Streetwear Drops
        </h1>
      </div>

      {/* 2. Controls / Search bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${borderBottomClass} pb-5`}>
        
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${isDarkTheme ? 'bg-stone-900 border-stone-800 text-white placeholder-stone-500 focus:border-stone-400' : 'bg-stone-50 border-stone-200 focus:border-stone-900'} px-4 py-2.5 pl-10 text-xs focus:outline-none rounded-sm`}
          />
          <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-stone-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-900"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Desktop Sorting & Filter buttons */}
        <div className="flex items-center space-x-4 justify-between md:justify-end">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={`lg:hidden inline-flex items-center space-x-1.5 border px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm ${
              isDarkTheme ? 'border-stone-800 text-stone-200 hover:bg-stone-900' : 'border-stone-200 text-stone-850 hover:bg-stone-50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-stone-400" />
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className={`${isDarkTheme ? 'bg-stone-900 border-stone-800 text-white' : 'bg-stone-50 border-stone-200'} text-xs font-semibold px-3 py-2.5 focus:outline-none rounded-sm`}
            >
              <option value="">Sort Price</option>
              <option value="low-high">Low to High</option>
              <option value="high-low">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Grid & Filters Column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Left Column: Filters (Desktop) */}
        <div className="hidden lg:block space-y-8">
          
          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className={`font-syne font-bold uppercase text-xs tracking-wider border-b ${sidebarHeaderClass} pb-2`}>
              Categories
            </h3>
            <div className="flex flex-col space-y-2 text-xs">
              <button
                onClick={() => setSelectedCategory('')}
                className={`text-left py-1 hover:opacity-80 transition-opacity uppercase tracking-wider ${
                  !selectedCategory 
                    ? `font-bold ${isDarkTheme ? 'text-white' : 'text-stone-950'}` 
                    : `${isDarkTheme ? 'text-stone-450' : 'text-stone-500'} font-medium`
                }`}
              >
                All Categories
              </button>
              {localCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`text-left py-1 hover:opacity-80 transition-opacity uppercase tracking-wider ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? `font-bold ${isDarkTheme ? 'text-white' : 'text-stone-950'}`
                      : `${isDarkTheme ? 'text-stone-455' : 'text-stone-500'} font-medium`
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-3">
            <h3 className={`font-syne font-bold uppercase text-xs tracking-wider border-b ${sidebarHeaderClass} pb-2`}>
              Sizes
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`border font-semibold text-xs w-9 h-9 rounded-sm flex items-center justify-center transition-colors uppercase ${
                    selectedSize === size
                      ? `${isDarkTheme ? 'bg-white text-stone-950 border-white' : 'bg-stone-950 text-white border-stone-950'} shadow-sm`
                      : `${isDarkTheme ? 'border-stone-800 text-stone-300 hover:border-stone-500' : 'border-stone-200 text-stone-700 hover:border-stone-900'}`
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          {(selectedCategory || selectedSize || searchQuery || priceSort) && (
            <button
              onClick={clearFilters}
              className={`w-full text-[10px] font-bold uppercase tracking-widest py-3 rounded-xs transition-colors ${
                isDarkTheme ? 'bg-stone-900 hover:bg-stone-850 text-white border border-stone-800' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Right Column: Products Grid */}
        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className={`h-64 flex flex-col items-center justify-center text-center space-y-3 border border-dashed ${isDarkTheme ? 'border-stone-800' : 'border-stone-200'} rounded-sm`}>
              <p className="text-stone-400 text-sm font-semibold uppercase tracking-widest">
                No items match your criteria
              </p>
              <button
                onClick={clearFilters}
                className="text-xs bg-stone-900 text-white font-bold uppercase tracking-widest px-6 py-2.5 hover:opacity-85 transition-opacity"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6"
              >
                <AnimatePresence>
                  {displayedProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Show More Pagination CTA */}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleLoadMore}
                    className={`px-8 py-4 text-xs font-bold uppercase tracking-widest border transition-all duration-300 rounded-sm shadow-xs ${
                      isDarkTheme 
                        ? 'border-stone-800 bg-stone-900 text-white hover:bg-stone-850 hover:border-stone-400' 
                        : 'border-stone-950 bg-stone-950 text-white hover:bg-stone-900 hover:opacity-90'
                    }`}
                  >
                    Load More Drops
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs z-50 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`fixed top-0 left-0 h-full w-full max-w-xs ${isDarkTheme ? 'bg-stone-900 text-stone-300' : 'bg-stone-50 text-stone-800'} shadow-2xl z-50 flex flex-col lg:hidden`}
            >
              <div className={`flex justify-between items-center px-6 py-5 border-b ${isDarkTheme ? 'border-stone-800 bg-stone-950' : 'border-stone-200 bg-white'}`}>
                <span className={`font-syne font-bold uppercase tracking-wider text-sm ${isDarkTheme ? 'text-white' : 'text-stone-900'}`}>
                  Filters
                </span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-stone-500 hover:text-stone-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto px-6 py-6 space-y-8">
                {/* Categories */}
                <div className="space-y-3">
                  <h3 className={`font-syne font-bold uppercase text-xs tracking-wider border-b ${sidebarHeaderClass} pb-2`}>
                    Categories
                  </h3>
                  <div className="flex flex-col space-y-2 text-xs">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setMobileFiltersOpen(false);
                      }}
                      className={`text-left py-1 uppercase tracking-wider ${
                        !selectedCategory 
                          ? `font-bold ${isDarkTheme ? 'text-white' : 'text-stone-950'}` 
                          : `${isDarkTheme ? 'text-stone-400' : 'text-stone-500'} font-medium`
                      }`}
                    >
                      All Categories
                    </button>
                    {localCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left py-1 uppercase tracking-wider ${
                          selectedCategory.toLowerCase() === cat.name.toLowerCase()
                            ? `font-bold ${isDarkTheme ? 'text-white' : 'text-stone-950'}`
                            : `${isDarkTheme ? 'text-stone-400' : 'text-stone-500'} font-medium`
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-3">
                  <h3 className={`font-syne font-bold uppercase text-xs tracking-wider border-b ${sidebarHeaderClass} pb-2`}>
                    Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`border font-semibold text-xs w-9 h-9 rounded-sm flex items-center justify-center transition-colors uppercase ${
                          selectedSize === size
                            ? `${isDarkTheme ? 'bg-white text-stone-950' : 'bg-stone-950 text-white'} border-stone-950`
                            : `${isDarkTheme ? 'border-stone-800 text-stone-300' : 'border-stone-200 text-stone-700'}`
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear */}
                {(selectedCategory || selectedSize || searchQuery || priceSort) && (
                  <button
                    onClick={() => {
                      clearFilters();
                      setMobileFiltersOpen(false);
                    }}
                    className={`w-full text-[10px] font-bold uppercase tracking-widest py-3 rounded-xs ${
                      isDarkTheme ? 'bg-stone-950 text-white hover:bg-stone-900 border border-stone-850' : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                    }`}
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
