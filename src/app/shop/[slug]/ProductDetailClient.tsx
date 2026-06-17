'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart, WishlistItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import ImageZoom from '@/components/ImageZoom';
import { Heart, ShoppingBag, Truck, Info, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'wash'>('details');

  const images = product.product_images || [];
  const primaryImage = images[activeImageIdx]?.image_url || '/placeholder-tee.jpg';

  const activePrice = product.discount_price && product.discount_price > 0 
    ? product.discount_price 
    : product.price;
  
  const isDiscounted = product.discount_price !== undefined && product.discount_price !== null && product.discount_price > 0;
  const isFavorited = isInWishlist(product.id);

  // Parse inventory
  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const getStock = (size: 'S' | 'M' | 'L' | 'XL' | 'XXL') => {
    if (!product.inventory) return 10; // Default fallback
    const item = product.inventory.find(i => i.size === size);
    return item ? item.quantity : 0;
  };

  const activeSizeStock = selectedSize ? getStock(selectedSize) : 0;

  const handleWishlistClick = () => {
    const wishItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discount_price,
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
      price: product.price,
      discountPrice: product.discount_price,
      image: images[0]?.image_url || '/placeholder-tee.jpg',
      slug: product.slug,
      size: selectedSize,
      quantity,
      maxStock: stockLimit || 10,
    });

    setTimeout(() => {
      setAdding(false);
      if (redirectToCheck) {
        router.push('/checkout');
      } else {
        // Trigger Cart Drawer
        const event = new CustomEvent('open-cart');
        window.dispatchEvent(event);
      }
    }, 450);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      
      {/* 1. Left Side: Product Images Viewer */}
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
              {img.image_url.startsWith('data:') ? (
                <img
                  src={img.image_url}
                  alt={`${product.name} look ${i + 1}`}
                  className="object-cover w-full h-full absolute inset-0"
                />
              ) : (
                <Image
                  src={img.image_url}
                  alt={`${product.name} look ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
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
                isFavorited ? 'fill-accent text-accent' : 'text-stone-700'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Right Side: Product Buy panel */}
      <div className="lg:col-span-5 flex flex-col justify-start space-y-6 lg:py-2">
        <div className="space-y-1.5">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.25em]">
            {product.category?.name || 'Streetwear'}
          </span>
          <h1 className="font-syne font-extrabold text-2xl md:text-3xl uppercase tracking-wider text-stone-950">
            {product.name}
          </h1>
        </div>

        {/* Pricing */}
        <div className="flex items-center space-x-3 pb-4 border-b border-stone-200/80">
          <span className="text-xl font-extrabold text-stone-950">
            {formatPrice(activePrice)}
          </span>
          {isDiscounted && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Short info description */}
        <p className="text-xs text-stone-600 leading-relaxed font-light">
          {product.description}
        </p>

        {/* Size Selection */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-stone-900">
              Select Size
            </span>
            <span className="text-stone-400 hover:text-stone-900 cursor-pointer underline tracking-wider font-semibold">
              Size Guide
            </span>
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
                      : 'border-stone-200 text-stone-700 hover:border-stone-950'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* Size alerts & stock information */}
          {sizeWarning && (
            <p className="text-[11px] text-red-700 font-bold uppercase tracking-wider">
              Please choose a size to continue.
            </p>
          )}

          {selectedSize && activeSizeStock > 0 && activeSizeStock <= 5 && (
            <p className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">
              Running Low! Only {activeSizeStock} left in stock.
            </p>
          )}
        </div>

        {/* Quantity selector */}
        {selectedSize && activeSizeStock > 0 && (
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Quantity
            </span>
            <div className="flex items-center border border-stone-200 rounded-sm w-fit bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-stone-600 hover:text-stone-900"
              >
                -
              </button>
              <span className="text-xs font-semibold px-4">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(activeSizeStock, quantity + 1))}
                className="px-3 py-2 text-stone-600 hover:text-stone-900"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Product Identity System */}
        <div className="bg-stone-900 border border-stone-850 p-4.5 rounded-sm space-y-3.5 text-xs text-stone-300 font-sans tracking-wide">
          <span className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.25em] block border-b border-stone-800 pb-1.5 font-syne">
            HOUSE IDENTITY RECORD
          </span>
          <div className="grid grid-cols-2 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <div>Piece Ref:</div>
            <div className="text-white font-mono">AVK/{product.slug.substring(0, 3).toUpperCase()}-{product.id.substring(0, 4).toUpperCase()}</div>
            <div>Identity:</div>
            <div className="text-stone-200">{product.category?.name || 'MINIMAL OVERSIZED'}</div>
            <div>Fabric Specs:</div>
            <div className="text-stone-200">{product.gsm} | {product.fabric}</div>
            <div>Provenance:</div>
            <div className="text-stone-200">Ahmedabad, India</div>
            <div>Release Series:</div>
            <div className="text-stone-200">Collection 01</div>
            <div>Scarcity Status:</div>
            <div className="text-lime-400 font-extrabold">{sizes.reduce((sum, sz) => sum + getStock(sz), 0) || 117} / 300 remaining</div>
          </div>
          <p className="text-[9px] text-amber-500 font-semibold uppercase tracking-widest pt-1.5 border-t border-stone-800">
            No restocks. No compromise.
          </p>
        </div>

        {/* Checkout CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => handleAddToCart(false)}
            disabled={adding}
            className="flex-grow bg-white border border-stone-950 text-stone-950 text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-stone-950 hover:text-white transition-all duration-300 rounded-xs flex items-center justify-center space-x-2 sound-click sound-hover"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>{adding ? 'RESERVING...' : 'RESERVE PIECE'}</span>
          </button>
          
          <button
            onClick={() => handleAddToCart(true)}
            disabled={adding}
            className="flex-grow bg-stone-950 border border-stone-950 text-white text-[10px] font-bold uppercase tracking-widest py-4 hover:opacity-90 transition-all rounded-xs sound-click sound-hover"
          >
            ACQUIRE PIECE
          </button>
        </div>

        {/* THE CRAFT CARD */}
        <div className="bg-stone-50 border border-stone-200/60 p-4.5 rounded-sm space-y-4 shadow-xs">
          <h3 className="font-syne font-bold uppercase text-stone-900 text-[9px] tracking-[0.2em] border-b border-stone-150 pb-2">
            THE CRAFT & MANUFACTURING
          </h3>
          <div className="grid grid-cols-4 gap-2.5 text-center font-sans">
            <div className="space-y-1">
              <p className="font-syne font-bold text-stone-900 text-xs sm:text-sm">240g</p>
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-wider">GSM Supima</p>
            </div>
            <div className="space-y-1">
              <p className="font-syne font-bold text-stone-900 text-xs sm:text-sm">14h</p>
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-wider">Manufacturing</p>
            </div>
            <div className="space-y-1">
              <p className="font-syne font-bold text-stone-900 text-xs sm:text-sm">7x</p>
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-wider">Quality checks</p>
            </div>
            <div className="space-y-1">
              <p className="font-syne font-bold text-stone-900 text-xs sm:text-sm">100%</p>
              <p className="text-[8px] text-stone-500 font-bold uppercase tracking-wider">Hand finished</p>
            </div>
          </div>
        </div>

        {/* Details accordion sheets */}
        <div className="border-t border-stone-200 mt-6 pt-4 space-y-3">
          {/* Tab switches */}
          <div className="flex space-x-6 border-b border-stone-100 pb-2 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('details')}
              className={`${activeTab === 'details' ? 'text-stone-900 border-b border-stone-900 pb-2.5' : 'text-stone-400'}`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`${activeTab === 'specs' ? 'text-stone-900 border-b border-stone-900 pb-2.5' : 'text-stone-400'}`}
            >
              Fabric Specs
            </button>
            <button
              onClick={() => setActiveTab('wash')}
              className={`${activeTab === 'wash' ? 'text-stone-900 border-b border-stone-900 pb-2.5' : 'text-stone-400'}`}
            >
              Wash Care
            </button>
          </div>

          <div className="py-2 text-[11px] sm:text-xs text-stone-600 leading-relaxed font-light">
            {activeTab === 'details' && (
              <p>
                ARVIIK street fit features dropped shoulders, a tighter collar lock, and structured length that sits perfectly on trousers or cargo pants. Handcrafted details. Double stitch hemline.
              </p>
            )}

            {activeTab === 'specs' && (
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong className="font-semibold">Fabric:</strong> {product.fabric}</li>
                <li><strong className="font-semibold">Weight:</strong> {product.gsm}</li>
                <li><strong className="font-semibold">Fit Silhouette:</strong> {product.fit_type}</li>
              </ul>
            )}

            {activeTab === 'wash' && (
              <p>{product.wash_instructions}</p>
            )}
          </div>
        </div>

        {/* Quality Badges */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-stone-400" />
            <span>Free Delivery &gt; ₹1500</span>
          </div>
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-stone-400" />
            <span>Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}
