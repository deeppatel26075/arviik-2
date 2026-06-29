'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart, WishlistItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import ImageZoom from '@/components/ImageZoom';
import { Heart, ShoppingBag, Truck, Info, ChevronRight, HelpCircle, Award, RefreshCw, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import SizeGuide from '@/components/Product/SizeGuide';
import Review from '@/components/Product/Review';
import ProductRecommendation from '@/components/Product/ProductRecommendation';
import { trackRecentlyViewed } from '@/components/Commerce/RecentlyViewed';
import { analytics } from '@/lib/analytics';

interface ProductImage {
  image_url: string;
}

interface InventoryItem {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
}

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discount_price?: number;
    fabric: string;
    gsm: string;
    fit_type: string;
    wash_instructions: string;
    description: string;
    category?: { name: string };
    product_images?: ProductImage[];
    inventory?: InventoryItem[];
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL' | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeWarning, setSizeWarning] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 59, seconds: 11 });

  // Countdown timer hook
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 11, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const padZero = (num: number) => String(num).padStart(2, '0');

  const images = product.product_images || [];
  const primaryImage = images[activeImageIdx]?.image_url || '/placeholder-tee.jpg';

  // Pricing adapters
  const mrpVal = product.price || 1499;
  const priceVal = product.discount_price || 599;
  const discountVal = Math.round(((mrpVal - priceVal) / mrpVal) * 100);
  const bestPriceVal = Math.round(priceVal * 0.75);

  const isFavorited = isInWishlist(product.id);

  // Track product view and recently viewed on mount
  useEffect(() => {
    trackRecentlyViewed(product.slug);
    analytics.trackProductViewed(product.id, product.name, priceVal);
  }, [product]);

  const getStock = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    if (!product.inventory) return 10;
    const item = product.inventory.find(i => i.size === size);
    return item ? item.quantity : 0;
  };

  const activeSizeStock = selectedSize ? getStock(selectedSize) : 0;

  const handleWishlistClick = () => {
    const wishItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: mrpVal,
      discountPrice: priceVal,
      image: images[0]?.image_url || '/placeholder-tee.jpg',
      slug: product.slug,
    };
    toggleWishlist(wishItem);
  };

  const handleAddToCart = (redirectToCheck = false) => {
    if (!selectedSize) {
      setSizeWarning(true);
      return;
    }
    setSizeWarning(false);
    setAdding(true);

    const stockLimit = getStock(selectedSize);

    addToCart({
      productId: product.id,
      name: product.name,
      price: mrpVal,
      discountPrice: priceVal,
      image: images[0]?.image_url || '/placeholder-tee.jpg',
      slug: product.slug,
      size: selectedSize,
      quantity,
      maxStock: stockLimit || 10,
    });

    analytics.trackAddToCart(product.id, product.name, selectedSize, priceVal);

    setTimeout(() => {
      setAdding(false);
      if (redirectToCheck) {
        analytics.trackCheckoutStarted(1, priceVal);
        router.push('/checkout');
      } else {
        const event = new CustomEvent('open-cart');
        window.dispatchEvent(event);
      }
    }, 450);
  };

  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="select-none font-sans bg-white pb-32">
      {/* 1. Mobile top header banner & announcements */}
      <div className="md:hidden">
        <div className="bg-[#0d6efd] text-white text-[9.5px] font-black text-center py-2.5 uppercase tracking-widest">
          This Is ARVIIK's Official Website. Order Only Here!
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left Side: Product Images Carousel/Viewer */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            
            {/* Thumbnails list (Desktop - Left Side) */}
            <div className="hidden md:flex md:flex-col overflow-y-auto gap-3 flex-shrink-0 md:w-20">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative aspect-3/4 w-full bg-stone-100 flex-shrink-0 border transition-all ${
                    activeImageIdx === i ? 'border-stone-900 shadow-sm' : 'border-stone-200/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`${product.name} look ${i + 1}`}
                    className="object-cover w-full h-full absolute inset-0"
                  />
                </button>
              ))}
            </div>

            {/* Primary Slider Display */}
            <div className="flex-grow relative bg-white border border-stone-200/40 rounded-xl overflow-hidden shadow-2xs">
              {/* Image selector dots for mobile */}
              <div className="md:hidden relative aspect-[3/4] w-full">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Dots indicator at the bottom-center */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-1 bg-black/25 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-1.5 h-1.5 rotate-45 transition-all ${
                        activeImageIdx === i ? 'bg-white scale-110' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>

                {/* Best Seller Overlay */}
                <div className="absolute bottom-4 left-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xs">
                  Best Seller
                </div>
              </div>

              {/* Desktop Zoom View */}
              <div className="hidden md:block">
                <ImageZoom src={primaryImage} alt={product.name} />
              </div>
              
              {/* Wishlist Heart Toggle */}
              <button
                onClick={handleWishlistClick}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/95 backdrop-blur-xs text-stone-900 shadow-md hover:bg-white transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorited ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Right Side: Product Buy Details Panel */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6 lg:py-2">
            
            {/* Sale Ends Countdown Ticker */}
            <div className="bg-[#ebf4fc] text-[#0d6efd] text-[10px] font-black text-center py-2.5 uppercase tracking-wider flex items-center justify-center space-x-1 border border-[#dcecf9] rounded-lg">
              <span>SALE ENDS IN :</span>
              <span className="font-mono">{timeLeft.hours}h : {padZero(timeLeft.minutes)}m : {padZero(timeLeft.seconds)}s</span>
            </div>

            {/* Price & Rating Section */}
            <div className="space-y-2 border-b border-stone-150 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-stone-950">₹{priceVal}</span>
                  <span className="text-sm text-stone-400 line-through">₹{mrpVal}</span>
                  <span className="text-xs text-emerald-500 font-extrabold uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md">
                    {discountVal}% OFF
                  </span>
                </div>
                <div className="flex items-center space-x-1 bg-stone-50 border border-stone-200/60 px-2.5 py-1 rounded-md text-[10px] font-black text-stone-700">
                  <span className="text-amber-500 font-bold">★</span>
                  <span>4.5</span>
                  <span className="text-stone-300">|</span>
                  <span>324</span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider">Inclusive of all taxes</p>
            </div>

            {/* Product Title */}
            <div className="space-y-1">
              <h1 className="font-syne font-black text-xl md:text-2xl uppercase tracking-wider text-stone-950">
                {product.name}
              </h1>
            </div>

            {/* Social Bought Proof */}
            <div className="flex items-center space-x-2 text-[10px] font-bold text-[#5c3e9c] bg-[#f8f5fc] px-4 py-3 rounded-lg border border-[#eee6fc]">
              <Users className="h-4 w-4 text-[#5c3e9c] flex-shrink-0" />
              <span>245 people bought this in last 7 days</span>
            </div>

            {/* Best Offer Card */}
            <div className="border border-[#d2e5f5] rounded-xl p-4.5 bg-white relative">
              <span className="absolute -top-2.5 left-4 bg-white border border-[#0d6efd] text-[#0d6efd] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Best Offer
              </span>
              <div className="flex justify-between items-center mt-1">
                <div>
                  <div className="flex items-center space-x-1 text-xs font-black text-stone-900">
                    <span>Get at ₹{bestPriceVal}</span>
                    <Info className="h-3.5 w-3.5 text-stone-400" />
                  </div>
                  <p className="text-[10px] text-stone-500 font-semibold mt-0.5">
                    Buy 3 @ 1199 Oversized Printed T-Shirts
                  </p>
                </div>
                <button className="border border-stone-300 hover:border-stone-900 text-stone-700 hover:text-stone-900 text-[10px] font-bold py-1.5 px-3.5 rounded-lg flex items-center uppercase tracking-wider">
                  <span>Explore</span>
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>

            {/* Desktop-only Size selectors */}
            <div className="hidden md:block space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-stone-900">
                  Choose Size
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-purple-700 hover:text-purple-900 cursor-pointer underline tracking-wider font-semibold flex items-center space-x-1"
                >
                  <span>Fit Helper / Size Chart</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {sizes.map((size) => {
                  const stock = getStock(size);
                  const isAvailable = stock > 0;
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeWarning(false);
                      }}
                      className={`border font-semibold text-xs px-5 py-3 rounded-md flex items-center justify-center transition-colors uppercase ${
                        selectedSize === size
                          ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                          : !isAvailable
                          ? 'border-stone-100 text-stone-300 cursor-not-allowed line-through bg-stone-50/50'
                          : 'border-stone-250 text-stone-700 hover:border-stone-950'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {sizeWarning && (
                <p className="text-[11px] text-rose-500 font-bold uppercase tracking-wider">
                  Please select a size to proceed.
                </p>
              )}
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-4 pt-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={adding}
                className="flex-grow bg-white border border-stone-950 text-stone-950 text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-stone-950 hover:text-white transition-all duration-300 rounded-lg flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                <span>{adding ? 'RESERVING...' : 'ADD TO BAG'}</span>
              </button>
              
              <button
                onClick={() => handleAddToCart(true)}
                disabled={adding}
                className="flex-grow bg-stone-950 border border-stone-950 text-white text-[10px] font-bold uppercase tracking-widest py-4 hover:opacity-90 transition-all rounded-lg"
              >
                BUY IT NOW
              </button>
            </div>

            {/* Pincode and Delivery check box */}
            <div className="space-y-2 border-t border-stone-150 pt-5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-900">Delivery Details</h4>
              <div className="flex items-center border border-stone-200 rounded-lg px-3.5 py-2.5 bg-white">
                <MapPin className="h-4 w-4 text-stone-400 mr-2" />
                <input
                  type="text"
                  placeholder="Enter Pincode to estimate delivery"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-grow text-xs focus:outline-none placeholder-stone-400 font-semibold bg-transparent"
                />
                <button
                  onClick={() => {
                    if (pincode.length === 6) {
                      setPincodeMessage('Delivery in 3-5 days | COD Available');
                    } else {
                      setPincodeMessage('Enter valid 6-digit pincode');
                    }
                  }}
                  className="text-[10px] font-black text-[#0d6efd] uppercase tracking-wider ml-2"
                >
                  Check
                </button>
              </div>
              {pincodeMessage && (
                <p className="text-[10px] font-semibold text-stone-500 pl-1">
                  {pincodeMessage}
                </p>
              )}
            </div>

            {/* Key Highlights box */}
            <div className="space-y-3.5 border-t border-stone-150 pt-5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-900">Key Highlights</h4>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="border border-stone-150 rounded-xl p-3 bg-white flex flex-col items-center shadow-3xs">
                  <div className="relative w-full aspect-square bg-stone-50 rounded-lg overflow-hidden mb-2">
                    <img src={primaryImage} className="w-full h-full object-cover" alt="Graphic print zoom" />
                  </div>
                  <span className="text-[9px] font-bold text-stone-400 uppercase">Product Category</span>
                  <span className="text-[10px] font-black text-stone-850 uppercase text-center mt-0.5">Topwear</span>
                </div>
                <div className="border border-stone-150 rounded-xl p-3 bg-white flex flex-col items-center shadow-3xs">
                  <div className="relative w-full aspect-square bg-stone-50 rounded-lg overflow-hidden mb-2 flex items-center justify-center bg-stone-100/50">
                    <span className="text-3xl text-stone-400">🧵</span>
                  </div>
                  <span className="text-[9px] font-bold text-stone-400 uppercase">Product Type</span>
                  <span className="text-[10px] font-black text-stone-850 uppercase text-center mt-0.5">Oversized Tshirt</span>
                </div>
              </div>
            </div>

            {/* Product Specifications Grid */}
            <div className="space-y-3 border-t border-stone-150 pt-5">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-900">Product Specifications</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs font-semibold py-3 border-b border-stone-100">
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Fabric Weave</span>
                  <span className="text-stone-900 font-bold uppercase">{product.fabric || '100% Cotton'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Thread Spec</span>
                  <span className="text-stone-900 font-bold uppercase">{product.gsm || '240 GSM'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Fit Style</span>
                  <span className="text-stone-900 font-bold uppercase">{product.fit_type || 'Oversized Fit'}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Closure</span>
                  <span className="text-stone-900 font-bold uppercase">No Closure</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Length</span>
                  <span className="text-stone-900 font-bold uppercase">Regular</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[9px] uppercase tracking-wider">Wash Care</span>
                  <span className="text-stone-900 font-bold uppercase">{product.wash_instructions || 'Machine Wash Cold'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Recommendations block */}
        <ProductRecommendation currentProduct={product as any} />

        {/* Reviews */}
        <Review />
      </div>

      {/* Size chart modal */}
      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Mobile Sticky CTA Bottom Drawer (Fixed, height optimized) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 shadow-2xl z-50 px-4 pt-3.5 pb-6 flex flex-col space-y-3">
        {/* Product row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-12 bg-stone-100 rounded-lg overflow-hidden relative border border-stone-200">
              <img src={primaryImage} className="w-full h-full object-cover" alt="Selected model thumbnail" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-sm font-black text-stone-900">₹{priceVal}</span>
                <span className="text-[10px] text-stone-400 line-through">₹{mrpVal}</span>
                <span className="text-[10px] text-emerald-500 font-bold">{discountVal}% OFF</span>
              </div>
              <div className="text-[9px] font-bold text-[#0f8a5f] flex items-center space-x-1 mt-0.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#0f8a5f] text-white flex items-center justify-center text-[7px] font-black">✓</span>
                <span>Best price ₹{bestPriceVal}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSizeGuideOpen(true)}
            className="text-[10px] font-black text-purple-700 uppercase tracking-wider underline hover:text-purple-950"
          >
            Size Guide
          </button>
        </div>

        {/* Sizes selector buttons */}
        <div className="flex justify-between items-center space-x-2">
          {sizes.map((size) => {
            const stock = getStock(size);
            const isAvailable = stock > 0;
            return (
              <button
                key={size}
                disabled={!isAvailable}
                onClick={() => {
                  setSelectedSize(size);
                  setSizeWarning(false);
                }}
                className={`flex-1 border font-black text-xs py-2 rounded-lg flex items-center justify-center transition-all ${
                  selectedSize === size
                    ? 'bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-300/30'
                    : !isAvailable
                    ? 'border-stone-100 text-stone-300 cursor-not-allowed line-through bg-stone-50'
                    : 'border-stone-200 text-stone-700 bg-white hover:border-stone-900'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

        {/* Pincode descriptor and Green ADD TO CART CTA */}
        <div className="flex flex-col space-y-2">
          <div className="text-[10px] font-bold text-stone-500 flex items-center justify-center space-x-1">
            <MapPin className="h-3.5 w-3.5 text-stone-400" />
            <span className="underline">Enter pincode to check delivery date</span>
          </div>
          
          {sizeWarning && (
            <p className="text-[10px] text-center text-rose-500 font-bold uppercase tracking-wider">
              Please choose size before checking out
            </p>
          )}

          <button
            onClick={() => handleAddToCart(false)}
            disabled={adding}
            className="w-full bg-[#00ff66] text-stone-950 text-xs font-black uppercase tracking-widest py-3.5 shadow-md active:scale-98 transition-all rounded-xl flex items-center justify-center space-x-2"
            style={{ background: '#00ff66' }}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>{adding ? 'RESERVING...' : 'ADD TO CART'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
