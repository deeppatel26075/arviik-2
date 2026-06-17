'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

interface HomeClientWrapperProps {
  products: any[];
  settings?: any;
}

export default function HomeClientWrapper({ products, settings }: HomeClientWrapperProps) {
  const [displayProducts, setDisplayProducts] = React.useState<any[]>(products);
  const [activeSettings, setActiveSettings] = React.useState<any>(settings || {});
  
  // Preloader & Countdown states
  const [siteLoading, setSiteLoading] = React.useState(true);
  const [preloaderStep, setPreloaderStep] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Cinematic preloader effect (runs on every mount for demo visibility)
  React.useEffect(() => {
    const timers = [
      setTimeout(() => setPreloaderStep(1), 800),
      setTimeout(() => setPreloaderStep(2), 1800),
      setTimeout(() => {
        setSiteLoading(false);
      }, 2600)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Guarantee video autoplay works in React
  React.useEffect(() => {
    if (!siteLoading && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(err => {
        console.warn('Autoplay gesture blocked by browser:', err);
      });
    }
  }, [siteLoading]);

  // Drop countdown effect
  React.useEffect(() => {
    const targetDateStr = activeSettings?.general_config?.next_drop_date || '2026-06-25T18:00:00';
    
    const updateCountdown = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0')
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeSettings?.general_config?.next_drop_date]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('arviik_custom_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        const hasOldMocks = parsed.some((p: any) => p.name === 'ARCHIVE-01 GRAPHIC TEE' || p.name === 'ESSENTIALS LOGO TEE');
        if (hasOldMocks) {
          localStorage.setItem('arviik_custom_products', JSON.stringify(products));
          setDisplayProducts(products);
        } else if (parsed && parsed.length > 0) {
          setDisplayProducts(parsed.filter((p: any) => !p.is_hidden));
        }
      } else {
        localStorage.setItem('arviik_custom_products', JSON.stringify(products));
      }
    } catch (e) {
      console.error('Failed to load custom products:', e);
    }
  }, [products]);

  React.useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('arviik_custom_settings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setActiveSettings({
          ...parsed,
          ...settings // Server settings take precedence
        });
      } else if (settings && Object.keys(settings).length > 0) {
        localStorage.setItem('arviik_custom_settings', JSON.stringify(settings));
        setActiveSettings(settings);
      } else {
        const defaultSettings = {
          hero_config: {
            title: 'WEAR YOUR IDENTITY',
            slogan: 'Heavyweight fabrics. Bold printed oversized silhouettes. Premium local craftsmanship.',
            image_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600'
          },
          story_config: {
            title: 'Engineered Streetwear',
            desc: 'At ARVIIK, we believe clothing is more than fabric—it is an outward projection of internal identity. Our oversized fits are engineered from custom-woven 240 GSM ring-spun cotton, creating a structure that holds its shape wash after wash.',
            image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'
          },
          general_config: { bg_style: 'default', custom_bg_color: '#fafaf9', bg_image_url: '' },
          gallery_config: {
            img1: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
            img2: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
            img3: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
            img4: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600',
            img5: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600',
            img6: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600'
          }
        };
        localStorage.setItem('arviik_custom_settings', JSON.stringify(defaultSettings));
        setActiveSettings(defaultSettings);
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }, [settings]);

  // Extract section configurations
  const heroConfig = activeSettings?.hero_config || {
    title: 'WEAR YOUR IDENTITY',
    slogan: 'Heavyweight fabrics. Bold printed oversized silhouettes. Premium local craftsmanship.',
    image_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1600'
  };

  const storyConfig = activeSettings?.story_config || {
    title: 'Engineered Streetwear',
    desc: 'At ARVIIK, we believe clothing is more than fabric—it is an outward projection of internal identity.',
    image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'
  };

  const bgConfig = activeSettings?.general_config || {
    bg_style: 'default',
    custom_bg_color: '#fafaf9',
    bg_image_url: ''
  };

  const galleryConfig = activeSettings?.gallery_config || {};

  const galleryImages = [
    galleryConfig.img1 || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
    galleryConfig.img2 || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
    galleryConfig.img3 || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
    galleryConfig.img4 || 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600',
    galleryConfig.img5 || 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600',
    galleryConfig.img6 || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600'
  ];

  // Determine dynamic background styling to apply to page wrapper
  let wrapperStyle: React.CSSProperties = {};
  let textModeClass = 'text-stone-900';
  let cardBgClass = 'bg-white border-stone-200/50';
  let mutedTextClass = 'text-stone-500';
  let sectionBorderClass = 'border-stone-200';
  let reviewBgClass = 'bg-stone-50';

  if (bgConfig.bg_style === 'white') {
    wrapperStyle = { backgroundColor: '#ffffff' };
  } else if (bgConfig.bg_style === 'charcoal') {
    wrapperStyle = { backgroundColor: '#0f0f0f', color: '#f5f5f4' };
    textModeClass = 'text-stone-100';
    cardBgClass = 'bg-stone-900 border-stone-850';
    mutedTextClass = 'text-stone-400';
    sectionBorderClass = 'border-stone-800';
    reviewBgClass = 'bg-stone-900/40';
  } else if (bgConfig.bg_style === 'sepia') {
    wrapperStyle = { backgroundColor: '#f4efe6' };
    textModeClass = 'text-stone-900';
    cardBgClass = 'bg-[#fcfaf7] border-stone-200';
    mutedTextClass = 'text-stone-600';
    sectionBorderClass = 'border-stone-200';
    reviewBgClass = 'bg-[#ebe5d8]';
  } else if (bgConfig.bg_style === 'custom-color') {
    wrapperStyle = { backgroundColor: bgConfig.custom_bg_color || '#fafaf9' };
    
    // Check luminance of custom hex code to set readable contrast
    const isDark = (hex: string) => {
      const c = (hex || '').replace('#', '');
      if (c.length !== 6) return false;
      const rgb = parseInt(c, 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luma < 135;
    };

    if (isDark(bgConfig.custom_bg_color)) {
      wrapperStyle.color = '#f5f5f4';
      textModeClass = 'text-stone-100';
      cardBgClass = 'bg-black/15 border-white/5';
      mutedTextClass = 'text-stone-400';
      sectionBorderClass = 'border-white/10';
      reviewBgClass = 'bg-black/10';
    }
  } else if (bgConfig.bg_style === 'custom-image' && bgConfig.bg_image_url) {
    wrapperStyle = {
      backgroundImage: `url(${bgConfig.bg_image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    };
  }

  // Animation variants
  const fadeIn: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  if (siteLoading) {
    return (
      <div className="fixed inset-0 bg-stone-950 z-50 flex items-center justify-center text-white">
        <AnimatePresence mode="wait">
          {preloaderStep === 0 && (
            <motion.div
              key="step-a"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-syne font-extrabold text-5xl sm:text-7xl tracking-[0.2em] uppercase"
            >
              A
            </motion.div>
          )}
          {preloaderStep === 1 && (
            <motion.div
              key="step-arviik"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-syne font-extrabold text-4xl sm:text-6xl tracking-[0.25em] uppercase text-white"
            >
              ARVIIK
            </motion.div>
          )}
          {preloaderStep === 2 && (
            <motion.div
              key="step-est"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-[10px] sm:text-xs tracking-[0.5em] uppercase text-stone-400"
            >
              EST. MMXXVI
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="w-full transition-all duration-300" style={wrapperStyle}>
      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] w-full flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Loop video background with image fallback base layer */}
        <div className="absolute inset-0 z-0">
          {/* Base Image Layer */}
          {heroConfig.image_url?.startsWith('data:') ? (
            <img
              src={heroConfig.image_url}
              alt="ARVIIK Streetwear Hero Fallback"
              className="object-cover w-full h-full opacity-40 absolute inset-0"
            />
          ) : (
            <Image
              src={heroConfig.image_url || '/products/mard-paisa-maroon.jpg'}
              alt="ARVIIK Streetwear Hero Fallback"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40 absolute inset-0"
            />
          )}

          {/* Absolute Video Overlay Layer */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full opacity-35 absolute inset-0"
          >
            <source
              src={heroConfig.video_url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-stone-950/45 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 space-y-6 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-syne font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-[0.2em] uppercase leading-none"
          >
            {heroConfig.title === 'WEAR YOUR IDENTITY' ? 'ARVIIK' : heroConfig.title}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-[11px] sm:text-xs font-bold tracking-[0.5em] uppercase text-stone-300"
          >
            {heroConfig.title === 'WEAR YOUR IDENTITY' ? 'THE ORIGIN COLLECTION' : ''}
          </motion.p>

          <div className="h-[1px] w-12 bg-white/20 mx-auto my-6" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xs sm:text-sm tracking-[0.4em] text-stone-300 max-w-lg mx-auto leading-relaxed font-sans font-light uppercase"
          >
            {heroConfig.title === 'WEAR YOUR IDENTITY' ? 'SILENCE. DISCIPLINE. IDENTITY.' : heroConfig.slogan}
          </motion.p>
          
          {heroConfig.title === 'WEAR YOUR IDENTITY' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.0 }}
              className="text-[10px] sm:text-xs tracking-[0.3em] text-stone-400 font-mono"
            >
              MMXXVI
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="pt-8"
          >
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 text-white font-bold uppercase text-[11px] tracking-[0.3em] border-b border-white pb-1.5 hover:text-stone-300 hover:border-stone-300 transition-all duration-300 sound-hover sound-click"
            >
              <span>ENTER COLLECTION</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. NEW DROPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        
        {/* Countdown Timer Widget */}
        <div className={`border ${bgConfig.bg_style === 'charcoal' ? 'border-stone-850 bg-stone-900/40' : 'border-stone-200 bg-stone-50/60'} p-6 sm:p-10 mb-16 text-center max-w-2xl mx-auto rounded-sm shadow-2xs`}>
          <p className="text-[10px] text-stone-400 font-bold tracking-[0.4em] uppercase mb-2">COLLECTION 002</p>
          <h3 className={`font-syne font-extrabold text-sm sm:text-base uppercase tracking-[0.25em] ${textModeClass} mb-6`}>
            ACCESS OPENS IN
          </h3>
          <div className="flex justify-center items-center space-x-4 sm:space-x-8 font-mono text-xl sm:text-3xl font-light">
            <div className="flex flex-col items-center">
              <span className={`font-syne font-extrabold ${bgConfig.bg_style === 'charcoal' ? 'text-lime-400' : 'text-stone-900'}`}>[{timeLeft.days}]</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1.5">DAYS</span>
            </div>
            <span className="text-stone-300 text-lg sm:text-2xl">|</span>
            <div className="flex flex-col items-center">
              <span className={`font-syne font-extrabold ${bgConfig.bg_style === 'charcoal' ? 'text-lime-400' : 'text-stone-900'}`}>[{timeLeft.hours}]</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1.5">HOURS</span>
            </div>
            <span className="text-stone-300 text-lg sm:text-2xl">|</span>
            <div className="flex flex-col items-center">
              <span className={`font-syne font-extrabold ${bgConfig.bg_style === 'charcoal' ? 'text-lime-400' : 'text-stone-900'}`}>[{timeLeft.minutes}]</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1.5">MINUTES</span>
            </div>
            <span className="text-stone-300 text-lg sm:text-2xl">|</span>
            <div className="flex flex-col items-center">
              <span className={`font-syne font-extrabold ${bgConfig.bg_style === 'charcoal' ? 'text-lime-400' : 'text-stone-900'}`}>[{timeLeft.seconds}]</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1.5">SECONDS</span>
            </div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className={`flex flex-col sm:flex-row sm:items-end justify-between border-b ${sectionBorderClass} pb-5`}
        >
          <div>
            <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
              Summer Release 01
            </span>
            <h2 className={`font-syne font-extrabold text-2xl sm:text-3xl uppercase tracking-wider ${textModeClass} mt-1`}>
              New Drops
            </h2>
          </div>
          <Link
            href="/shop"
            className={`inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest ${
              bgConfig.bg_style === 'charcoal' ? 'text-white hover:text-stone-300' : 'text-stone-900 hover:opacity-75'
            } transition-colors mt-4 sm:mt-0 sound-hover sound-click`}
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Product Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8"
        >
          {displayProducts.slice(0, 4).map((product) => (
            <motion.div key={product.id} variants={fadeIn}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. THE HOUSE OF ARVIIK (EDITORIAL TIMELINE DECK) */}
      <section id="story" className="bg-stone-950 text-white py-24 border-t border-stone-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-lime-400 font-bold tracking-[0.4em] uppercase">
              Brand Chronicle
            </span>
            <h2 className="font-syne font-extrabold text-3xl sm:text-5xl uppercase tracking-[0.15em] text-white">
              THE HOUSE OF ARVIIK
            </h2>
            <div className="h-[1px] w-20 bg-lime-400/40 mx-auto mt-4" />
          </div>

          {/* Timeline Deck */}
          <div className="relative border-l border-stone-800 ml-4 md:ml-12 space-y-12 py-4">
            {[
              {
                chapter: 'CHAPTER I',
                title: 'THE DISCIPLINE OF SILENCE',
                year: 'MMXXV',
                desc: 'ARVIIK was conceived in silence. A quiet response to the noise of fast fashion, built on the foundations of architectural geometry and raw, structural discipline.'
              },
              {
                chapter: 'CHAPTER II',
                title: 'THE WEAVE OF HEAVYWEIGHTS',
                year: 'MMXXVI',
                desc: 'We custom-engineered our first signature 240 GSM French Terry cotton. Every thread spun, dyed, and boxy-finished to hold shape wash after wash.'
              },
              {
                chapter: 'CHAPTER III',
                title: 'THE ORIGIN RELEASE',
                year: 'MMXXVI',
                desc: 'Our initial drops debuted under exclusive invitation-only code locks. Reasserting that digital luxury is not about mass reach, but curated belonging.'
              },
              {
                chapter: 'CHAPTER IV',
                title: 'THE ATELIER VISION',
                year: 'MMXXVII & BEYOND',
                desc: 'Merging physical craftsmanship with the digital vault. Introducing Web Audio soundscapes, AI styling simulators, and cryptographic Authenticity Passports.'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative pl-8 sm:pl-12 group"
              >
                {/* Bullet */}
                <div className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-stone-950 border border-lime-400 group-hover:bg-lime-400 transition-colors duration-300" />

                {/* Content Card */}
                <div className="bg-stone-900/40 border border-stone-900/60 p-6 sm:p-8 rounded-xs hover:border-stone-800 transition-colors duration-300 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <span className="text-[9px] text-lime-400 font-bold tracking-[0.25em] font-mono">
                      {step.chapter}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono tracking-widest bg-stone-950 px-2 py-0.5 rounded-sm">
                      {step.year}
                    </span>
                  </div>
                  <h3 className="font-syne font-bold text-md sm:text-lg uppercase tracking-wider text-white">
                    {step.title}
                  </h3>
                  <p className="text-stone-400 text-xs sm:text-sm leading-relaxed font-sans font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CUSTOMER REVIEWS */}
      <section className={`${reviewBgClass} py-20 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-1">
            <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
              Verifiable Feedback
            </span>
            <h2 className={`font-syne font-extrabold text-2xl uppercase tracking-wider ${textModeClass}`}>
              Community Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Karan Malhotra',
                city: 'Mumbai',
                text: 'The print quality is unmatched. Most oversized tees lose shape around the neck after three washes, but ARVIIK feels as heavy and boxy as day one.',
                stars: 5,
              },
              {
                name: 'Elena Rostova',
                city: 'Delhi',
                text: 'Bought the Archive-01 tee. Absolutely in love with the French Terry fabric weight. Shipping was fast, and the size chart is completely accurate.',
                stars: 5,
              },
              {
                name: 'Rohan Sharma',
                city: 'Bangalore',
                text: 'Super premium packaging and the customer service helped me switch size from XL to L because the fit is extremely oversized. Recommended!',
                stars: 5,
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`${cardBgClass} p-6 rounded-xs border shadow-xs flex flex-col space-y-4`}
              >
                <div className={`flex items-center ${bgConfig.bg_style === 'charcoal' ? 'text-amber-400' : 'text-stone-900'}`}>
                  {[...Array(review.stars)].map((_, starIdx) => (
                    <Star key={starIdx} className="h-4 w-4 fill-current text-current" />
                  ))}
                </div>
                <p className={`text-xs ${bgConfig.bg_style === 'charcoal' ? 'text-stone-300' : 'text-stone-650'} leading-relaxed italic font-sans`}>
                  "{review.text}"
                </p>
                <div className={`pt-2 border-t ${sectionBorderClass} flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-widest font-sans`}>
                  <span>{review.name}</span>
                  <span>{review.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INSTAGRAM GALLERY */}
      <section className="py-20 space-y-10">
        <div className="text-center space-y-1">
          <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
            #ARVIIKLAB
          </span>
          <h2 className={`font-syne font-extrabold text-2xl uppercase tracking-wider ${textModeClass}`}>
            Instagram Gallery
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {galleryImages.map((src, i) => (
            <div key={i} className="relative aspect-square w-full group overflow-hidden bg-stone-150">
              {src.startsWith('data:') ? (
                <img
                  src={src}
                  alt={`Instagram look ${i + 1}`}
                  className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                />
              ) : (
                <Image
                  src={src}
                  alt={`Instagram look ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold tracking-widest uppercase border border-white px-3 py-1.5 rounded-sm">
                  View Look
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
