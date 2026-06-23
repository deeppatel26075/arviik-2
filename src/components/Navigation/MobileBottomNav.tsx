'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Home, Search, Flame, Heart, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart, wishlist } = useCart();

  // Hide on checkout and admin panels
  if (pathname?.startsWith('/checkout') || pathname?.startsWith('/admin')) {
    return null;
  }

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const triggerCartOpen = () => {
    const event = new CustomEvent('open-cart');
    window.dispatchEvent(event);
  };

  const triggerSearchOpen = () => {
    const event = new CustomEvent('open-search');
    window.dispatchEvent(event);
  };

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/'
    },
    {
      label: 'Search',
      icon: Search,
      onClick: triggerSearchOpen
    },
    {
      label: 'Drops',
      icon: Flame,
      href: '/shop'
    },
    {
      label: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      badge: wishlistCount
    },
    {
      label: 'Bag',
      icon: ShoppingBag,
      onClick: triggerCartOpen,
      badge: totalCartItems
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 z-45 py-2 px-3 shadow-lg select-none">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          const content = (
            <div className="flex flex-col items-center justify-center relative cursor-pointer py-1 px-3">
              <Icon className={`h-5 w-5 ${isActive ? 'text-secondary fill-secondary/10' : 'text-stone-600'}`} />
              <span className={`text-[9px] mt-1 font-bold ${isActive ? 'text-secondary' : 'text-stone-500'}`}>
                {item.label}
              </span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-0 right-2 bg-sale text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              )}
            </div>
          );

          if (item.href) {
            return (
              <Link key={index} href={item.href}>
                {content}
              </Link>
            );
          }

          return (
            <button key={index} onClick={item.onClick} className="focus:outline-none">
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
