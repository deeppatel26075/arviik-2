'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  id: number;
  image: string;
  sub: string;
  title: string;
  btnText: string;
  btnColor: string;
  href: string;
}

export default function HeroSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600',
      sub: 'END OF SEASON SALE',
      title: 'UP TO 70% OFF',
      btnText: 'SHOP NOW',
      btnColor: 'bg-sale text-white hover:bg-red-600',
      href: '/shop'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1600',
      sub: 'NEW GRAIL ARRIVALS',
      title: 'STREET LEGACY drop',
      btnText: 'ENTER DROP',
      btnColor: 'bg-accent text-primary hover:opacity-90',
      href: '/shop?tag=NEW+ARRIVAL'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600',
      sub: 'HEAVYWEIGHT FRENCH TERRY',
      title: 'PREMIUM 240 GSM TEES',
      btnText: 'EXPLORE FITS',
      btnColor: 'bg-primary text-white hover:bg-stone-900 border border-white/20',
      href: '/shop?category=Oversized+T-Shirts'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[65vh] sm:h-[80vh] bg-stone-950 overflow-hidden select-none">
      {/* Slides view wrapper */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="w-full h-full relative"
          >
            {/* Background image */}
            <img
              src={slides[currentIdx].image}
              alt="Streetwear Banner"
              className="object-cover w-full h-full opacity-40 absolute inset-0"
            />
            {/* Dark tint gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

            {/* Slide content overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-center p-4">
              <div className="max-w-3xl space-y-4">
                {/* Slogan */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-syne font-black text-xs sm:text-sm tracking-[0.35em] text-accent uppercase"
                >
                  {slides[currentIdx].sub}
                </motion.p>

                {/* Big Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="font-syne font-black text-4xl sm:text-6xl lg:text-7xl leading-none text-white uppercase tracking-wider text-shadow-retro"
                >
                  {slides[currentIdx].title}
                </motion.h1>

                {/* Button CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="pt-6"
                >
                  <Link
                    href={slides[currentIdx].href}
                    className={`inline-block font-syne font-black text-[11px] sm:text-xs tracking-[0.2em] px-8 py-3.5 rounded-full uppercase shadow-lg transform transition-transform active:scale-95 ${slides[currentIdx].btnColor}`}
                  >
                    {slides[currentIdx].btnText}
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Diamond Indicators */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center items-center space-x-3.5 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`w-2.5 h-2.5 transform rotate-45 transition-all duration-300 border border-white/60 focus:outline-none ${
              currentIdx === idx ? 'bg-accent border-accent scale-120' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
