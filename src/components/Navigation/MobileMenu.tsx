'use client';

import React from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function MobileMenu({ isOpen, onClose, isAdmin }: MobileMenuProps) {
  if (!isOpen) return null;

  const links = [
    { label: 'CENTRE STAGE', href: '/shop?tag=BESTSELLER', hasArrow: false },
    { label: 'EPIC THREAD COLLECTION', href: '/shop?category=Graphic+Prints', hasArrow: false },
    { label: 'SUPREME EDITION', href: '/shop?category=Minimalist+Typo', hasArrow: false },
    { label: 'ARVIIK PREMIUM BUY 3 & GET 15% OFF', href: '/shop', hasArrow: true },
    { label: 'PLUS SIZE', href: '/shop?category=Plus+Size', hasArrow: true },
    { label: 'TOP WEAR', href: '/shop?category=Oversized+T-Shirts', hasArrow: true },
    { label: 'BOTTOM WEAR', href: '/shop?category=Joggers', hasArrow: true },
    { label: 'END OF SEASON SALE', href: '/shop?tag=SALE', hasArrow: false },
    { label: 'ALL PRODUCTS', href: '/shop', hasArrow: true }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs z-50 flex justify-start lg:hidden"
    >
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when tapping menu content
        className="w-full max-w-[290px] sm:max-w-xs bg-[#f0f7fd] h-full shadow-2xl flex flex-col p-4 overflow-y-auto"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#d2e5f5] mb-4">
          <span className="font-syne font-black text-sm tracking-[0.2em] uppercase text-stone-900 leading-none">
            ARVIIK
          </span>
          <button 
            onClick={onClose} 
            className="p-1 text-stone-500 hover:text-stone-950 focus:outline-none transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Links Card */}
        <div className="bg-white border border-[#d2e5f5] rounded-xl overflow-hidden shadow-2xs mb-4">
          {links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={onClose}
              className="flex items-center justify-between py-3.5 px-4 border-b border-[#e9f2fa] last:border-b-0 text-stone-750 hover:bg-[#f0f7fd]/40 transition-colors group"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest leading-none text-stone-800 group-hover:text-stone-950 transition-colors">
                {link.label}
              </span>
              {link.hasArrow && (
                <ArrowRight className="h-3.5 w-3.5 text-stone-400 group-hover:text-stone-950 transition-colors" />
              )}
            </Link>
          ))}
        </div>

        {/* My Account Card */}
        <div className="bg-white border border-[#d2e5f5] rounded-xl overflow-hidden shadow-2xs mb-4">
          {/* Header Title */}
          <div className="py-3.5 px-4 text-center border-b border-[#e9f2fa] bg-[#fafbfc]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">
              MY ACCOUNT
            </span>
          </div>

          {/* Grid: Support & Orders */}
          <div className="grid grid-cols-2 border-b border-[#e9f2fa]">
            {/* Support via WhatsApp */}
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-3 border-r border-[#e9f2fa] text-stone-800 hover:bg-[#f0f7fd]/40 transition-colors"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest">SUPPORT</span>
              <svg className="w-3.5 h-3.5 text-emerald-500 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.99L2 22l5.233-1.371a9.947 9.947 0 004.779 1.22c5.507 0 9.99-4.479 9.991-9.986.002-2.67-1.037-5.18-2.93-7.073A9.907 9.907 0 0012.012 2zm5.72 14.127c-.247.697-1.428 1.369-1.964 1.462-.486.084-1.12.155-3.037-.643-2.451-1.021-4.032-3.518-4.154-3.682-.123-.163-.997-1.325-.997-2.528 0-1.203.629-1.796.852-2.04.223-.245.486-.307.649-.307.162 0 .324.002.464.009.148.007.348-.056.545.422.203.49.697 1.696.757 1.82.062.122.102.266.02.429-.082.163-.122.266-.245.409-.122.143-.257.32-.367.429-.122.123-.25.257-.107.502.143.245.637 1.047 1.365 1.696.938.837 1.729 1.096 1.974 1.218.245.122.388.102.532-.061.143-.163.613-.715.776-.96.164-.245.327-.204.551-.122.224.082 1.424.672 1.669.795.245.123.408.184.469.286.061.102.061.593-.186 1.29z"/>
              </svg>
            </a>

            {/* My Orders */}
            <Link
              href="/profile?tab=orders"
              onClick={onClose}
              className="flex items-center justify-center py-3 text-stone-800 hover:bg-[#f0f7fd]/40 transition-colors text-[9px] font-bold uppercase tracking-widest"
            >
              MY ORDERS
            </Link>
          </div>

          {/* Full-width Return / Exchange */}
          <Link
            href="/track-order"
            onClick={onClose}
            className="flex items-center justify-center py-3.5 text-stone-800 hover:bg-[#f0f7fd]/40 transition-colors text-[9px] font-bold uppercase tracking-widest"
          >
            RETURN/EXCHANGE
          </Link>
        </div>

        {/* Admin Link if applicable */}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="bg-rose-50 border border-rose-100 rounded-xl py-3 px-4 flex items-center justify-between text-rose-800 hover:bg-rose-100/50 transition-colors mb-4"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">
              ADMIN DASHBOARD
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-rose-500" />
          </Link>
        )}

        {/* Footer brand info */}
        <div className="mt-auto pt-6 text-[9px] text-stone-400 font-bold uppercase tracking-widest text-center">
          <p>© ARVIIK CLOTHING CO.</p>
          <p className="mt-1 text-[8px] opacity-75">WEAR YOUR IDENTITY</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
