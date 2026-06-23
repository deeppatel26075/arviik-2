'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, ArrowLeft, CreditCard, Tag, ShieldCheck, MapPin, Truck, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService } from '@/services/orderService';
import { analytics } from '@/lib/analytics';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const {
    cart,
    coupon,
    clearCart,
    getCartSubtotal,
    getDiscountAmount,
    getShippingFee,
    getCartTotal,
  } = useCart();

  // Step state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<any>(null);

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');

  // Trigger analytics checkout started on load
  useEffect(() => {
    if (cart.length > 0) {
      analytics.trackCheckoutStarted(cart.length, getCartTotal());
    }
  }, []);

  // Autofill logged-in user profile
  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setEmail(user?.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.shipping_address || '');
      setCity(profile.shipping_city || '');
      setState(profile.shipping_state || '');
      setPincode(profile.shipping_pincode || '');
    }
  }, [profile, user]);

  if (cart.length === 0 && !orderCompleted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 select-none">
        <p className="text-stone-400 text-sm font-bold uppercase tracking-widest">
          Your bag is empty. Add items to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block text-xs bg-stone-900 text-white font-bold uppercase tracking-widest px-8 py-3.5 hover:opacity-85 transition-opacity"
        >
          Explore Drops
        </Link>
      </div>
    );
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      setErrorMsg('Please complete all delivery fields.');
      return;
    }
    setErrorMsg(null);
    setCurrentStep(2);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // Place order via service layer
      const placedOrder = await orderService.placeOrder({
        customerId: email,
        customerName: name,
        customerPhone: phone,
        shippingAddress: {
          addressLine: address,
          city,
          state,
          zip: pincode
        },
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
          image: item.image
        })),
        subtotal: getCartSubtotal(),
        couponApplied: coupon?.code,
        discountAmount: getDiscountAmount(),
        shippingCharge: getShippingFee(),
        total: getCartTotal(),
        status: 'Pending',
        paymentMode: paymentMethod === 'cod' ? 'simulation' : 'live',
        paymentStatus: 'Paid'
      });

      // Confetti splash
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      // Track order completed
      analytics.trackOrderCompleted(placedOrder.id, placedOrder.total, placedOrder.items.length);

      setCompletedOrderDetails({
        orderId: placedOrder.id,
        email,
        total: placedOrder.total,
        phone
      });
      setOrderCompleted(true);
      clearCart();
    } catch (err: any) {
      console.error('Failed to commit order:', err);
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderCompleted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 select-none font-sans">
        <div className="h-16 w-16 bg-emerald-50 text-success rounded-full flex items-center justify-center mx-auto border border-success/10 shadow-xs">
          <Check className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <span className="text-[10px] text-success font-black uppercase tracking-[0.25em]">
            Order Confirmed
          </span>
          <h1 className="font-syne font-black text-2xl uppercase tracking-wider text-stone-900">
            Welcome to the crew
          </h1>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Order Reference: <strong className="font-mono text-stone-850 uppercase">{completedOrderDetails?.orderId}</strong>
            <br />
            Shipment tracking details sent to {completedOrderDetails?.email}.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="text-xs bg-stone-950 text-white font-syne font-black tracking-widest px-8 py-3.5 hover:bg-stone-900 transition-colors uppercase rounded-xs"
          >
            Continue Shopping
          </Link>
          
          <button
            onClick={() => {
              window.location.href = `/track-order?orderId=${completedOrderDetails?.orderId}&phone=${completedOrderDetails?.phone}`;
            }}
            className="text-xs border border-stone-300 text-stone-700 font-syne font-black tracking-widest px-8 py-3.5 hover:border-stone-950 transition-colors uppercase rounded-xs"
          >
            Track Order Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 select-none font-sans">
      {/* Return button */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (currentStep === 2) {
              setCurrentStep(1);
            } else {
              router.push('/shop');
            }
          }}
          className="inline-flex items-center space-x-1.5 text-xs text-stone-500 hover:text-stone-900 uppercase tracking-wider font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{currentStep === 2 ? 'Back to shipping' : 'Back to shop'}</span>
        </button>
      </div>

      {/* Multi-step Header */}
      <div className="flex justify-center items-center space-x-4 mb-10 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep === 1 ? 'bg-secondary text-white' : 'bg-success text-white'
          }`}>
            {currentStep === 2 ? <Check className="h-3.5 w-3.5" /> : '1'}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            currentStep === 1 ? 'text-stone-900' : 'text-stone-400'
          }`}>Delivery</span>
        </div>
        <div className="h-[1px] w-12 bg-stone-200" />
        <div className="flex items-center space-x-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            currentStep === 2 ? 'bg-secondary text-white' : 'bg-stone-100 text-stone-400 border border-stone-200'
          }`}>
            2
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            currentStep === 2 ? 'text-stone-900' : 'text-stone-400'
          }`}>Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left column: Step Forms */}
        <div className="lg:col-span-7">
          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3 flex items-center space-x-2">
                <MapPin className="h-4.5 w-4.5 text-stone-850" />
                <h2 className="font-syne font-black text-sm uppercase tracking-wider text-stone-900">
                  Step 1: Delivery Information
                </h2>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Karan Malhotra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="karan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment, suite, unit, building, street, etc."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-950 text-white font-syne font-black text-xs tracking-widest py-4 hover:bg-stone-900 transition-colors uppercase rounded-xs shadow-sm mt-4"
                >
                  NEXT: SELECT PAYMENT
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-stone-200 pb-3 flex items-center space-x-2">
                <Truck className="h-4.5 w-4.5 text-stone-850" />
                <h2 className="font-syne font-black text-sm uppercase tracking-wider text-stone-900">
                  Step 2: Acquisition Method
                </h2>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center justify-between p-4 border rounded-sm transition-all text-xs font-bold ${
                      paymentMethod === 'online'
                        ? 'border-stone-950 bg-stone-950 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <span className="uppercase tracking-wider">ONLINE ACQUISITION</span>
                    <CreditCard className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center justify-between p-4 border rounded-sm transition-all text-xs font-bold ${
                      paymentMethod === 'cod'
                        ? 'border-stone-950 bg-stone-950 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <span className="uppercase tracking-wider">CASH ON ARRIVAL (COD)</span>
                    <span className="text-[8px] font-black border border-current px-1.5 py-0.5 rounded-sm">COD</span>
                  </button>
                </div>

                <div className="bg-stone-50 border border-stone-200/50 p-4 rounded-sm flex items-start space-x-3 text-xs text-stone-600 font-light">
                  <ShieldCheck className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Orders are processed securely. Online transactions are simulated for instant credit approval, committing products to our inventory automatically.
                  </p>
                </div>

                {errorMsg && (
                  <p className="text-[10px] font-bold text-sale uppercase tracking-wider">
                    ⚠️ {errorMsg}
                  </p>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 border border-stone-900 text-stone-950 text-[10px] font-bold uppercase tracking-widest py-4 hover:bg-stone-50 rounded-xs"
                  >
                    CHANGE ADDRESS
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 bg-secondary text-white text-[10px] font-black uppercase tracking-widest py-4 hover:opacity-95 transition-opacity rounded-xs shadow-sm flex items-center justify-center space-x-1.5"
                  >
                    <span>{loading ? 'PROCESSING...' : `PLACE ORDER — ${formatPrice(getCartTotal())}`}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right column: Order Summary Panel */}
        <div className="lg:col-span-5 bg-white border border-stone-200/50 p-6 rounded-xs shadow-xs h-fit space-y-6">
          <div className="border-b border-stone-100 pb-3 flex items-center space-x-2">
            <ShoppingBag className="h-4.5 w-4.5 text-stone-800" />
            <h3 className="font-syne font-bold uppercase text-stone-900 text-sm tracking-wider">
              Order Summary
            </h3>
          </div>

          {/* Items Preview */}
          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto space-y-3 pr-2">
            {cart.map((item) => {
              const activePrice = item.discountPrice !== undefined && item.discountPrice > 0 
                ? item.discountPrice 
                : item.price;
              return (
                <div key={item.id} className="flex items-center space-x-3 pt-3 first:pt-0">
                  <div className="relative h-14 w-11 bg-stone-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-grow text-[11px] text-stone-600">
                    <p className="font-semibold text-stone-900 uppercase tracking-wide line-clamp-1">{item.name}</p>
                    <p className="uppercase tracking-widest text-[9px] mt-0.5 text-stone-400">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-900">
                    {formatPrice(activePrice * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-stone-100 pt-4 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">{formatPrice(getCartSubtotal())}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-success">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>Discount ({coupon.discountPercent}%)</span>
                </span>
                <span>-{formatPrice(getDiscountAmount())}</span>
              </div>
            )}
            <div className="flex justify-between pb-2">
              <span>Shipping</span>
              <span>
                {getShippingFee() === 0 ? 'FREE' : formatPrice(getShippingFee())}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-stone-150">
              <span className="font-syne font-bold uppercase text-stone-900 text-sm">Total Amount</span>
              <span className="font-syne font-extrabold text-stone-950 text-lg">
                {formatPrice(getCartTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
