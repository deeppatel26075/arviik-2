'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart, WishlistItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import ImageZoom from '@/components/ImageZoom';
import { Heart, ShoppingBag, Truck, Info, ChevronRight, HelpCircle, Award, RefreshCw } from 'lucide-react';
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
    <div className="space-y-12 select-none font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Product Images Viewer */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
          {/* Thumbnails list (Desktop - Left Side) */}
          <div className="order-2 md:order-1 flex md:flex-col overflow-x-auto md:overflow-x-visible gap-3 flex-shrink-0 md:w-20">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`relative aspect-3/4 w-16 md:w-full bg-stone-100 flex-shrink-0 border transition-all ${
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

          {/* Primary Zoom Display */}
          <div className="order-1 md:order-2 flex-grow relative bg-white border border-stone-200/40 rounded-xs shadow-xs">
            <ImageZoom src={primaryImage} alt={product.name} />
            
            {/* Wishlist Heart Toggle */}
            <button
              onClick={handleWishlistClick}
              className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/95 backdrop-blur-xs text-stone-900 shadow-md hover:bg-white transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorited ? 'fill-sale text-sale' : 'text-stone-700'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Side: Product Details buy panel */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6 lg:py-2">
          <div className="space-y-1">
            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.25em] block">
              ARVIIK STREETWEAR CO.
            </span>
            <h1 className="font-syne font-black text-2xl md:text-3xl uppercase tracking-wider text-stone-950">
              {product.name}
            </h1>
          </div>

          {/* Multi-Price Listing */}
          <div className="flex items-center space-x-3 pb-4 border-b border-stone-200/80">
            <span className="text-xl font-extrabold text-stone-950">
              {formatPrice(priceVal)}
            </span>
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(mrpVal)}
            </span>
            <span className="text-xs text-sale font-black uppercase">
              {discountVal}% OFF
            </span>
          </div>

          {/* Best Price capsule */}
          <div className="bg-emerald-50 border border-success/15 py-3 px-4 rounded-sm flex items-center space-x-2">
            <span className="bg-success text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-2xs">%</span>
            <div className="text-[10px] font-bold text-success uppercase tracking-wider">
              Best price with coupon code: <span className="font-black text-xs text-stone-900">{formatPrice(bestPriceVal)}</span>
            </div>
          </div>

          {/* Short info description */}
          <p className="text-xs text-stone-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Size selection row */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-900">
                Choose Size
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-secondary hover:text-stone-950 cursor-pointer underline tracking-wider font-semibold flex items-center space-x-1"
              >
                <HelpCircle className="h-3.5 w-3.5" />
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
                    className={`border font-semibold text-xs px-5 py-3 rounded-sm flex items-center justify-center transition-colors uppercase ${
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

            {/* Size alerts & stocks warnings */}
            {sizeWarning && (
              <p className="text-[11px] text-sale font-black uppercase tracking-wider">
                Please select a size to proceed.
              </p>
            )}

            {selectedSize && activeSizeStock > 0 && activeSizeStock <= 5 && (
              <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">
                Running Low! Only {activeSizeStock} left in stock.
              </p>
            )}
            
            {selectedSize && activeSizeStock === 0 && (
              <p className="text-[11px] text-sale font-bold uppercase tracking-wider">
                {selectedSize} is SOLD OUT.
              </p>
            )}
          </div>

          {/* D2C conversion card */}
          <div className="bg-stone-900 border border-stone-850 p-4.5 rounded-sm space-y-3.5 text-xs text-stone-300 font-sans tracking-wide">
            <span className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.25em] block border-b border-stone-800 pb-1.5 font-syne">
              PRODUCT SPECIFICATIONS
            </span>
            <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
              <div>Fabric Weave:</div>
              <div className="text-stone-200">{product.fabric}</div>
              <div>Thread Spec:</div>
              <div className="text-stone-200">{product.gsm}</div>
              <div>Cut Style:</div>
              <div className="text-stone-200">{product.fit_type}</div>
              <div>Wash Care:</div>
              <div className="text-stone-200">{product.wash_instructions}</div>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={() => handleAddToCart(false)}
              disabled={adding}
              className="flex-grow bg-white border border-stone-950 text-stone-950 text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-stone-950 hover:text-white transition-all duration-300 rounded-xs flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span>{adding ? 'RESERVING...' : 'ADD TO BAG'}</span>
            </button>
            
            <button
              onClick={() => handleAddToCart(true)}
              disabled={adding}
              className="flex-grow bg-secondary border border-secondary text-white text-[10px] font-bold uppercase tracking-widest py-4 hover:opacity-90 transition-all rounded-xs"
            >
              BUY IT NOW
            </button>
          </div>

          {/* Brand trust icons */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-stone-600 font-bold text-[9px] uppercase tracking-wider py-4 border-t border-stone-150">
            <div className="space-y-1">
              <Award className="h-4 w-4 text-accent mx-auto" />
              <p>Premium Cotton</p>
            </div>
            <div className="space-y-1">
              <RefreshCw className="h-4 w-4 text-accent mx-auto" />
              <p>7-Day Returns</p>
            </div>
            <div className="space-y-1">
              <Truck className="h-4 w-4 text-accent mx-auto" />
              <p>Free Delivery &gt; 999</p>
            </div>
          </div>

        </div>
      </div>

      {/* Dynamic Recommendation Engine Strip */}
      <ProductRecommendation currentProduct={product as any} />

      {/* Review list */}
      <Review />

      {/* Size recommendation guides modal */}
      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Mobile Sticky CTA footer (under 768px viewport) */}
      <div className="md:hidden fixed bottom-14 left-0 w-full bg-white border-t border-stone-200 py-2.5 px-4 z-40 flex space-x-3.5 shadow-2xl">
        <button
          onClick={() => handleAddToCart(false)}
          className="flex-1 bg-white border border-stone-950 text-stone-950 text-[10px] font-black uppercase tracking-widest py-3 rounded-xs"
        >
          ADD TO BAG
        </button>
        <button
          onClick={() => handleAddToCart(true)}
          className="flex-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xs"
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
}
