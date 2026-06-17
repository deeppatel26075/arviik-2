'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, Trash2, Tag, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    cart,
    coupon,
    couponError,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
    getDiscountAmount,
    getShippingFee,
    getCartTotal,
  } = useCart();

  // Listen to open-cart events
  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener('open-cart', handleOpenCart);
    return () => window.removeEventListener('open-cart', handleOpenCart);
  }, []);

  // Update coupon error states
  useEffect(() => {
    if (couponError) {
      setCouponMsg({ type: 'error', text: couponError });
    }
  }, [couponError]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoadingCoupon(true);
    setCouponMsg(null);
    const success = await applyCoupon(couponCode);
    setLoadingCoupon(false);

    if (success) {
      setCouponMsg({ type: 'success', text: 'Coupon applied successfully!' });
      setCouponCode('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMsg(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-stone-950/45 backdrop-blur-xs z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-50 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-white">
              <div className="flex items-center space-x-2">
                <span className="font-syne font-bold uppercase tracking-wider text-stone-900 text-sm">
                  YOUR BAG
                </span>
                <span className="bg-stone-100 text-stone-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-500 hover:text-stone-900 transition-colors sound-click"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-12">
                  <p className="text-stone-400 text-sm font-semibold uppercase tracking-widest">
                    Your bag is empty
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="text-xs bg-stone-900 text-white font-bold uppercase tracking-widest px-6 py-3 hover:opacity-85 transition-opacity sound-hover sound-click"
                  >
                    SHOP DROPS
                  </Link>
                </div>
              ) : (
                cart.map((item) => {
                  const activePrice =
                    item.discountPrice !== undefined && item.discountPrice > 0
                      ? item.discountPrice
                      : item.price;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 pb-4 border-b border-stone-200/60 bg-white p-3 rounded-xs shadow-xs"
                    >
                      {/* Product Image */}
                      <div className="relative h-20 w-16 bg-stone-100 flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder-tee.jpg'}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Detail Info */}
                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between">
                          <Link
                            href={`/shop/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-semibold text-xs tracking-wider uppercase text-stone-900 hover:text-stone-500 line-clamp-1 sound-hover sound-click"
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs font-semibold text-stone-900">
                            {formatPrice(activePrice * item.quantity)}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest font-medium">
                          Size: {item.size}
                        </p>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-stone-200 rounded-sm">
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                              className="px-2 py-1 text-stone-600 hover:text-stone-900 sound-click"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-semibold px-2">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                              className="px-2 py-1 text-stone-600 hover:text-stone-900 sound-click"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.productId, item.size)}
                            className="text-stone-400 hover:text-red-700 transition-colors sound-click"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Calculator / Summary */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-stone-200 px-6 py-5 space-y-4">
                {/* Coupon area */}
                <div className="space-y-2">
                  {coupon ? (
                    <div className="flex items-center justify-between bg-stone-50 border border-stone-200/80 px-3 py-2 rounded-sm">
                      <div className="flex items-center space-x-2 text-xs font-medium text-emerald-800">
                        <Tag className="h-4 w-4" />
                        <span>Code: {coupon.code} ({coupon.discountPercent}% OFF)</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-[10px] text-red-700 font-bold uppercase tracking-wider hover:opacity-85 sound-click"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex">
                      <input
                        type="text"
                        placeholder="COUPON CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-grow bg-stone-50 border border-stone-200 px-3 py-2 text-xs focus:outline-none focus:border-stone-900 rounded-l-sm"
                      />
                      <button
                        type="submit"
                        disabled={loadingCoupon}
                        className="bg-stone-900 text-white text-[10px] font-bold uppercase px-4 hover:opacity-90 rounded-r-sm sound-click"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponMsg && (
                    <p
                      className={`text-[10px] font-medium ${
                        couponMsg.type === 'success' ? 'text-emerald-800' : 'text-red-700'
                      }`}
                    >
                      {couponMsg.text}
                    </p>
                  )}
                </div>

                {/* Subtotals list */}
                <div className="space-y-1.5 text-xs text-stone-600 border-b border-stone-100 pb-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatPrice(getCartSubtotal())}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({coupon.discountPercent}%)</span>
                      <span>-{formatPrice(getDiscountAmount())}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {getShippingFee() === 0 ? 'FREE' : formatPrice(getShippingFee())}
                    </span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-syne font-bold uppercase text-stone-900 text-sm">Total</span>
                  <span className="font-syne font-extrabold text-stone-900 text-lg">
                    {formatPrice(getCartTotal())}
                  </span>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-stone-950 text-white text-xs font-bold text-center uppercase tracking-widest py-4 hover:opacity-90 transition-opacity rounded-xs shadow-sm sound-hover sound-click"
                >
                  PROCEED TO ACQUISITION
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
