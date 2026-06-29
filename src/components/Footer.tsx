'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, Minus, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Accordion open states
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [customersOpen, setCustomersOpen] = useState(false);

  // Skip rendering Footer on Admin Panel routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#0da669] text-stone-900 pt-16 pb-12 select-none font-sans mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. Newsletter: JOIN OUR ARVIIK FAM */}
        <div className="text-center space-y-4">
          <h2 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-wider text-white">
            JOIN OUR ARVIIK FAM
          </h2>
          
          <div className="max-w-md mx-auto">
            {subscribed ? (
              <div className="bg-white/15 backdrop-blur-xs border border-white/20 py-3.5 px-6 rounded-full text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-white" />
                <span>WELCOME TO THE Drop LIST!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="bg-white rounded-full p-1.5 pl-5 flex items-center shadow-xs">
                <input
                  type="email"
                  placeholder="veirdo@yahoo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow text-xs focus:outline-none placeholder-stone-400 font-semibold bg-transparent text-stone-900"
                />
                <button
                  type="submit"
                  className="bg-[#a233b8] hover:bg-[#8e2aa2] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-md active:scale-98 transition-all"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 2. Spot Us On (Social Grid) */}
        <div className="max-w-md mx-auto space-y-3.5 pt-4">
          <h4 className="text-[10px] font-black tracking-widest text-stone-950 uppercase text-center sm:text-left">
            SPOT US ON
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              className="border border-stone-900/10 rounded-xl py-3 px-5 flex items-center justify-center space-x-2 text-stone-950 text-xs font-black uppercase hover:bg-white/10 transition-colors bg-white/5"
            >
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
              </svg>
              <span>INSTAGRAM</span>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              className="border border-stone-900/10 rounded-xl py-3 px-5 flex items-center justify-center space-x-2 text-stone-950 text-xs font-black uppercase hover:bg-white/10 transition-colors bg-white/5"
            >
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>LINKEDIN</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              className="border border-stone-900/10 rounded-xl py-3 px-5 flex items-center justify-center space-x-2 text-stone-950 text-xs font-black uppercase hover:bg-white/10 transition-colors bg-white/5"
            >
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span>TWITTER</span>
            </a>
            <a 
              href="https://whatsapp.com" 
              target="_blank" 
              className="border border-stone-900/10 rounded-xl py-3 px-5 flex items-center justify-center space-x-2 text-stone-950 text-xs font-black uppercase hover:bg-white/10 transition-colors bg-white/5"
            >
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966C16.69 1.975 14.218.95 11.59.951c-5.438 0-9.863 4.373-9.868 9.803-.001 1.77.463 3.5 1.34 5.016l-.988 3.606 3.693-.972zm11.564-7.608c-.29-.145-1.716-.848-1.98-.943-.264-.096-.456-.145-.648.145-.191.29-.741.943-.909 1.135-.168.191-.335.216-.625.072-.29-.145-1.222-.45-2.328-1.437-.86-.767-1.44-1.716-1.609-2.006-.168-.29-.018-.447.127-.591.13-.13.29-.335.434-.503.145-.168.192-.29.29-.481.096-.191.048-.36-.024-.503-.072-.145-.648-1.562-.888-2.14-.233-.56-.47-.482-.648-.492-.167-.008-.36-.01-.552-.01s-.504.072-.768.36c-.264.29-1.008.985-1.008 2.401 0 1.417 1.032 2.787 1.176 2.98.145.191 2.03 3.1 4.916 4.346.686.297 1.223.474 1.64.607.69.219 1.319.187 1.816.113.554-.082 1.716-.701 1.956-1.378.24-.677.24-1.258.168-1.378-.072-.119-.264-.215-.552-.36z"/>
              </svg>
              <span>WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* 3. Accordion Lists on Mobile / Grid on Desktop */}
        <div className="max-w-md mx-auto pt-6 divide-y divide-stone-950/10">
          
          {/* Categories Accordion */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="w-full flex justify-between items-center text-xs font-black text-stone-950 uppercase tracking-wider focus:outline-none"
            >
              <span>CATEGORIES</span>
              {categoriesOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
            </button>
            
            {categoriesOpen && (
              <div className="flex flex-col space-y-2 pt-4 text-xs font-bold text-stone-900 uppercase tracking-wider pl-1">
                <Link href="/shop?category=Oversized+T-Shirts" className="hover:opacity-85">OVERSIZED T-SHIRTS</Link>
                <Link href="/shop" className="hover:opacity-85">NEW ARRIVALS</Link>
                <Link href="/shop?tag=BESTSELLER" className="hover:opacity-85">BEST SELLERS</Link>
                <Link href="/shop?category=Classic+Fit" className="hover:opacity-85">CLASSIC FIT T-SHIRT</Link>
                <Link href="/shop?category=Cargos" className="hover:opacity-85">CARGOS</Link>
                <Link href="/shop?category=Winterwear" className="hover:opacity-85">WINTER-WEAR</Link>
              </div>
            )}
          </div>

          {/* Company Accordion */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setCompanyOpen(!companyOpen)}
              className="w-full flex justify-between items-center text-xs font-black text-stone-950 uppercase tracking-wider focus:outline-none"
            >
              <span>COMPANY</span>
              {companyOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
            </button>
            
            {companyOpen && (
              <div className="flex flex-col space-y-2 pt-4 text-xs font-bold text-stone-900 uppercase tracking-wider pl-1">
                <Link href="/journal" className="hover:opacity-85">ABOUT US</Link>
                <Link href="/#contact" className="hover:opacity-85">CONTACT US</Link>
                <Link href="/lookbook" className="hover:opacity-85">STORES</Link>
                <Link href="/private-access" className="hover:opacity-85">CAREERS</Link>
              </div>
            )}
          </div>

          {/* Customers Accordion */}
          <div className="py-4">
            <button
              type="button"
              onClick={() => setCustomersOpen(!customersOpen)}
              className="w-full flex justify-between items-center text-xs font-black text-stone-950 uppercase tracking-wider focus:outline-none"
            >
              <span>CUSTOMERS</span>
              {customersOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
            </button>
            
            {customersOpen && (
              <div className="flex flex-col space-y-2 pt-4 text-xs font-bold text-stone-900 uppercase tracking-wider pl-1">
                <Link href="/track-order" className="hover:opacity-85">TRACK ORDER</Link>
                <Link href="/#returns" className="hover:opacity-85">SHIPPING & RETURNS</Link>
                <Link href="/#size-guide" className="hover:opacity-85">SIZE GUIDE</Link>
                <Link href="/#faq" className="hover:opacity-85">FAQ</Link>
                <Link href="/admin" className="hover:opacity-85 text-stone-600">ADMIN DASHBOARD</Link>
              </div>
            )}
          </div>

        </div>

        {/* Footer Bottom copyright info */}
        <div className="max-w-md mx-auto pt-6 border-t border-stone-950/10 flex flex-col sm:flex-row items-center justify-between text-stone-900 text-[9px] tracking-widest font-black uppercase">
          <p>© {new Date().getFullYear()} ARVIIK CLOTHING. WEAR YOUR IDENTITY.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <span>Razorpay Payments Secure</span>
            <span>Made in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
