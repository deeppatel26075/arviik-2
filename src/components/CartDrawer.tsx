'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, Trash2, Tag, Percent, MapPin, ChevronDown, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState('');

  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 56, seconds: 59 });

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
          return { hours: 11, minutes: 56, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const padZero = (num: number) => String(num).padStart(2, '0');

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

  // Calculations
  const subtotal = getCartSubtotal();
  const totalMrp = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = totalMrp - subtotal;
  
  // Progress calculations
  const freeShippingThreshold = 799;
  const discount10Threshold = 3999;
  const discount15Threshold = 5999;

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const is10Percent = subtotal >= discount10Threshold;
  const is15Percent = subtotal >= discount15Threshold;

  const shippingDiff = freeShippingThreshold - subtotal;

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-50 shadow-2xl z-50 flex flex-col font-sans select-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4.5 border-b border-stone-200 bg-white">
              <span className="font-syne font-black uppercase tracking-wider text-stone-950 text-sm">
                MY CART ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-700 hover:text-stone-950 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Countdown timer bar */}
            <div className="bg-[#eafbf4] text-[#0ea869] text-[9.5px] font-black text-center py-2.5 uppercase tracking-wider flex items-center justify-center space-x-1 border-b border-[#d8f5e9]">
              <span>SALE ENDS IN :</span>
              <span className="font-mono">{timeLeft.hours}h : {padZero(timeLeft.minutes)}m : {padZero(timeLeft.seconds)}s</span>
            </div>

            {/* Scrollable Container */}
            <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4">
              
              {/* Pincode checker bar */}
              <div className="bg-white border border-stone-200 rounded-lg px-3.5 py-3 flex items-center shadow-2xs">
                <MapPin className="h-4 w-4 text-stone-400 mr-2" />
                <input
                  type="text"
                  placeholder="Enter Pincode to check delivery date"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-grow text-xs focus:outline-none placeholder-stone-400 font-semibold bg-transparent"
                />
                <button
                  onClick={() => {
                    if (pincode.length === 6) {
                      setPincodeMessage('Delivery in 3-5 days | COD Available');
                    } else {
                      setPincodeMessage('Enter 6-digit code');
                    }
                  }}
                  className="text-[10px] font-black text-[#0d6efd] uppercase tracking-wider ml-2"
                >
                  Check
                </button>
              </div>
              {pincodeMessage && (
                <p className="text-[10px] font-semibold text-stone-500 mt-1 pl-1">
                  {pincodeMessage}
                </p>
              )}

              {/* Free shipping/discount progression widget */}
              <div className="bg-[#f7f5fe] border border-[#e3dcfb] rounded-xl p-4.5 space-y-3.5">
                <p className="text-[11px] font-bold text-purple-800">
                  {shippingDiff > 0 ? (
                    <>Shop for <span className="font-black">₹{shippingDiff}</span> more to get <span className="uppercase font-black text-purple-900">Free Shipping</span></>
                  ) : (
                    <span className="text-[#0f8a5f] font-black uppercase">🎉 You unlocked FREE SHIPPING!</span>
                  )}
                </p>
                
                {/* Timeline bar */}
                <div className="relative flex items-center justify-between text-[8px] font-black text-stone-400 uppercase tracking-wider pt-2">
                  <div className="absolute top-[17px] left-0 w-full h-[3px] bg-stone-200 -z-10 rounded-full">
                    <div 
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${Math.min((subtotal / 5999) * 100, 100)}%` }}
                    />
                  </div>

                  {/* Free shipping point */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className={isFreeShipping ? 'text-purple-700 font-bold' : ''}>Free Shipping</span>
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center bg-white ${isFreeShipping ? 'border-purple-600' : 'border-stone-300'}`}>
                      {isFreeShipping && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </div>
                    <span className="font-mono text-[9px] mt-0.5">₹799</span>
                  </div>

                  {/* 10% off point */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className={is10Percent ? 'text-purple-700 font-bold' : ''}>10% OFF</span>
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center bg-white ${is10Percent ? 'border-purple-600' : 'border-stone-300'}`}>
                      {is10Percent && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </div>
                    <span className="font-mono text-[9px] mt-0.5">₹3999</span>
                  </div>

                  {/* 15% off point */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className={is15Percent ? 'text-purple-700 font-bold' : ''}>15% OFF</span>
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center bg-white ${is15Percent ? 'border-purple-600' : 'border-stone-300'}`}>
                      {is15Percent && <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </div>
                    <span className="font-mono text-[9px] mt-0.5">₹5999</span>
                  </div>
                </div>

                <div className="border-t border-[#e9e4fc] pt-3.5 flex justify-between items-center text-[10px] font-bold text-purple-700">
                  <span className="uppercase tracking-wide">View/Apply More Coupons & Gift Cards</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Cart Items Loop */}
              {cart.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center space-y-3 pt-6">
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                    Your cart is empty
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[10px] bg-stone-950 text-white font-bold uppercase tracking-widest px-6 py-2.5 rounded-lg"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const activePrice = item.discountPrice || item.price;
                  const discountPercent = Math.round(((item.price - activePrice) / item.price) * 100);
                  
                  return (
                    <div 
                      key={`${item.productId}-${item.size}`}
                      className="border border-[#ebdffc] rounded-xl p-4.5 bg-white space-y-3.5 relative shadow-3xs"
                    >
                      {/* Bundle Offer Ticker */}
                      <div className="flex justify-between items-center border-b border-[#f3eefe] pb-2 text-[10px] font-bold text-purple-700 uppercase tracking-wide">
                        <span>Buy 3 @ 1199 Oversized T-Shirts available</span>
                        <button className="text-purple-900 font-extrabold uppercase hover:underline">Add Items</button>
                      </div>

                      <div className="flex items-start space-x-4">
                        {/* Thumbnail image */}
                        <div className="w-16 h-20 bg-stone-50 rounded-lg overflow-hidden flex-shrink-0 relative border border-stone-150">
                          <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                        </div>

                        {/* Middle info */}
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-[11px] text-stone-900 uppercase tracking-wider line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-stone-400 font-semibold mt-0.5">
                                Details - {item.size}, Printed Style
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.productId, item.size)}
                              className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Pricing Row */}
                          <div className="flex items-baseline space-x-1.5 pt-1">
                            <span className="text-sm font-black text-stone-900">₹{activePrice}</span>
                            <span className="text-[10px] text-stone-400 line-through">₹{item.price}</span>
                            <span className="text-[10px] text-emerald-500 font-bold">{discountPercent}% OFF</span>
                          </div>

                          {/* Dropdown-styled Selectors for size & qty */}
                          <div className="flex items-center space-x-2 pt-2">
                            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-[10px] font-black text-stone-700">
                              <span>SIZE: {item.size}</span>
                              <ChevronDown className="h-3 w-3 ml-1 text-stone-400" />
                            </div>
                            <div className="flex items-center bg-stone-50 border border-stone-200 rounded-md px-2 py-1 text-[10px] font-black text-stone-700">
                              <button 
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                className="px-1 font-bold text-stone-500 hover:text-stone-950"
                              >
                                -
                              </button>
                              <span className="px-1.5 font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                className="px-1 font-bold text-stone-500 hover:text-stone-950"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Check delivery location link */}
                          <p className="text-[9px] text-purple-700 font-bold uppercase tracking-wider underline pt-2 cursor-pointer">
                            Check Delivery Date
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Total Calculation summary box */}
              {cart.length > 0 && (
                <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-3">
                  <div className="flex justify-between items-center text-xs font-black text-stone-950 uppercase tracking-wider">
                    <span>Total</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-[10px] text-stone-400 line-through font-semibold">₹{totalMrp}</span>
                      <span>₹{subtotal}</span>
                      <ChevronDown className="h-3.5 w-3.5 ml-1 text-stone-500 inline" />
                    </div>
                  </div>
                  <p className="text-[9px] text-stone-400 font-semibold">(Incl. of all taxes)</p>

                  <div className="bg-[#eefcf4] text-[#0f8a5f] text-[9.5px] font-black py-2.5 px-3 rounded-lg flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0f8a5f]" />
                    <span>Yayyy! You get FREE delivery on this order</span>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-2.5 text-center text-stone-500 font-bold text-[8.5px] uppercase tracking-wider">
                <div className="bg-white border border-stone-150 p-2.5 rounded-xl space-y-1">
                  <div className="w-5 h-5 bg-[#ebfbf3] text-[#0ea869] rounded-full flex items-center justify-center mx-auto text-[9.5px]">₹</div>
                  <p>CASH ON DELIVERY</p>
                </div>
                <div className="bg-white border border-stone-150 p-2.5 rounded-xl space-y-1">
                  <div className="w-5 h-5 bg-[#ebfbf3] text-[#0ea869] rounded-full flex items-center justify-center mx-auto text-[9.5px]">🚚</div>
                  <p>FREE SHIPPING</p>
                </div>
                <div className="bg-white border border-stone-150 p-2.5 rounded-xl space-y-1">
                  <div className="w-5 h-5 bg-[#ebfbf3] text-[#0ea869] rounded-full flex items-center justify-center mx-auto text-[9.5px]">🔄</div>
                  <p>EASY RETURNS</p>
                </div>
              </div>

            </div>

            {/* Bottom Checkout CTA card */}
            {cart.length > 0 && (
              <div className="bg-white border-t border-stone-200 px-5 pt-3.5 pb-6.5 space-y-3.5 shadow-xl">
                {/* Savings bar */}
                <div className="bg-[#eefcf4] text-[#0f8a5f] text-[9.5px] font-black py-2 px-3 rounded-md flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#0f8a5f]" />
                  <span>You saved ₹{totalSavings} on this order</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Subtotal</span>
                    <span className="text-base font-black text-stone-950">₹{subtotal}</span>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#00ff66] text-stone-950 text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-md active:scale-98 transition-all hover:opacity-95"
                    style={{ background: '#00ff66' }}
                  >
                    PROCEED TO BUY
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
