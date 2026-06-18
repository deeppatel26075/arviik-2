'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Heart, User, Menu, X, Search, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundPlayer } from '@/components/SoundExperience';
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();
  const { user, profile } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSoundEnabled(localStorage.getItem('arviik_sound_enabled') !== 'false');
    }
  }, []);

  // Detect scroll to add shadow/border
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [shippingThreshold, setShippingThreshold] = useState(1500);

  // Load dynamic shipping config threshold
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const local = localStorage.getItem('arviik_custom_settings');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.general_config?.shipping_threshold !== undefined) {
            setShippingThreshold(Number(parsed.general_config.shipping_threshold));
          }
        }
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'general_config')
          .single();
        if (data && data.value?.shipping_threshold !== undefined) {
          setShippingThreshold(Number(data.value.shipping_threshold));
        }
      } catch (e) {}
    };
    loadConfig();
  }, []);

  // Skip rendering Navbar on Admin Panel routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const triggerCartOpen = () => {
    // Dispatch custom event to open the CartDrawer
    const event = new CustomEvent('open-cart');
    window.dispatchEvent(event);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        {/* Promotional Scrolling Marquee Banner */}
        <div className="bg-stone-950 text-lime-400 py-2 overflow-hidden border-b border-stone-900/10 text-[9px] font-bold uppercase tracking-[0.2em] select-none">
          <div className="whitespace-nowrap flex animate-marquee">
            <span className="flex-shrink-0">⚡ BUY ANY 3 T-SHIRTS AT ₹1199 — USE CODE: B31199 &nbsp;&nbsp;&nbsp;&nbsp; ⚡ FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹{shippingThreshold} &nbsp;&nbsp;&nbsp;&nbsp; ⚡ 10% OFF ON ALL PREPAID ORDERS &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="flex-shrink-0">⚡ BUY ANY 3 T-SHIRTS AT ₹1199 — USE CODE: B31199 &nbsp;&nbsp;&nbsp;&nbsp; ⚡ FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹{shippingThreshold} &nbsp;&nbsp;&nbsp;&nbsp; ⚡ 10% OFF ON ALL PREPAID ORDERS &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="flex-shrink-0">⚡ BUY ANY 3 T-SHIRTS AT ₹1199 — USE CODE: B31199 &nbsp;&nbsp;&nbsp;&nbsp; ⚡ FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹{shippingThreshold} &nbsp;&nbsp;&nbsp;&nbsp; ⚡ 10% OFF ON ALL PREPAID ORDERS &nbsp;&nbsp;&nbsp;&nbsp;</span>
            <span className="flex-shrink-0">⚡ BUY ANY 3 T-SHIRTS AT ₹1199 — USE CODE: B31199 &nbsp;&nbsp;&nbsp;&nbsp; ⚡ FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹{shippingThreshold} &nbsp;&nbsp;&nbsp;&nbsp; ⚡ 10% OFF ON ALL PREPAID ORDERS &nbsp;&nbsp;&nbsp;&nbsp;</span>
          </div>
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}>
          <div className="flex items-center justify-between">
            {/* Mobile Menu Trigger */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-stone-900 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Left Nav (Desktop) */}
            <nav className="hidden lg:flex space-x-8 text-xs font-semibold tracking-widest uppercase select-none">
              <Link href="/shop" className="text-stone-900 hover:text-stone-500 transition-colors sound-hover sound-click">
                DROPS
              </Link>
              <Link href="/lookbook" className="text-stone-900 hover:text-stone-500 transition-colors sound-hover sound-click">
                LOOKBOOK
              </Link>
              <Link href="/journal" className="text-stone-900 hover:text-stone-500 transition-colors sound-hover sound-click">
                JOURNAL
              </Link>
              <Link href="/#story" className="text-stone-900 hover:text-stone-500 transition-colors sound-hover sound-click">
                THE HOUSE
              </Link>
            </nav>

            {/* Center Logo */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className="font-syne font-extrabold text-2xl sm:text-3xl tracking-[0.25em] text-stone-900 transition-opacity hover:opacity-85 sound-click sound-hover"
              >
                ARVIIK
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Sound Toggle switch */}
              <button
                onClick={() => {
                  const current = localStorage.getItem('arviik_sound_enabled') !== 'false';
                  localStorage.setItem('arviik_sound_enabled', (!current).toString());
                  setSoundEnabled(!current);
                  SoundPlayer.playTick();
                }}
                className="text-stone-900 hover:opacity-70 transition-opacity flex items-center sound-click"
                title="Toggle Sound Experience"
              >
                {soundEnabled ? <Volume2 className="h-5 w-5 text-lime-600" /> : <VolumeX className="h-5 w-5 text-stone-400" />}
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="text-stone-900 hover:opacity-70 transition-opacity sound-click"
              >
                <Search className="h-5 w-5" />
              </button>

              <Link
                href="/profile"
                className="text-stone-900 hover:opacity-70 transition-opacity relative sound-click"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href={user ? '/profile' : '/login'}
                className="text-stone-900 hover:opacity-70 transition-opacity sound-click"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={triggerCartOpen}
                className="text-stone-900 hover:opacity-70 transition-opacity relative sound-click"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content down when Navbar is transparent but page loads */}
      <div className="h-28 w-full" />

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-28 left-0 w-full bg-stone-50 border-b border-stone-200 z-30 lg:hidden shadow-lg font-sans"
          >
            <div className="px-6 py-8 flex flex-col space-y-6 text-sm font-semibold tracking-widest uppercase text-stone-950">
              <Link href="/shop" onClick={() => setIsOpen(false)} className="hover:text-stone-500 sound-click">
                DROPS
              </Link>
              <Link href="/lookbook" onClick={() => setIsOpen(false)} className="hover:text-stone-500 sound-click">
                LOOKBOOK
              </Link>
              <Link href="/journal" onClick={() => setIsOpen(false)} className="hover:text-stone-500 sound-click">
                JOURNAL
              </Link>
              <Link href="/#story" onClick={() => setIsOpen(false)} className="hover:text-stone-500 sound-click">
                THE HOUSE
              </Link>
              {profile?.role === 'admin' && (
                <Link href="/admin" onClick={() => setIsOpen(false)} className="text-accent hover:opacity-80 sound-click">
                  ADMIN COMMAND CENTER
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="bg-white w-full max-w-xl p-6 shadow-2xl rounded-sm border border-stone-100"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                <h3 className="font-syne font-bold uppercase text-stone-900 tracking-wider text-sm">
                  Search ARVIIK
                </h3>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-stone-500 hover:text-stone-900"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
                    setSearchOpen(false);
                  }
                }}
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for printed oversized t-shirts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-stone-900"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-900"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
