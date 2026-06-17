'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

export default function Journal() {
  const articles = [
    {
      title: 'THE PHILOSOPHY OF MINIMALISM IN STREET SILHOUETTES',
      category: 'DESIGN LOG',
      readTime: '4 MIN READ',
      date: '14 JUNE 2026',
      description: 'Why luxury streetwear demands volume, drops weight, and discards flashy colors. Inspecting the architecture of oversized boxy draping.',
      slug: 'philosophy-of-minimalism',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600'
    },
    {
      title: 'THE MAKING OF COLLECTION 001: FROM COTTON TO drape',
      category: 'CRAFT ARCHIVE',
      readTime: '6 MIN READ',
      date: '02 MAY 2026',
      description: 'Behind the scenes: selecting long-staple Supima cotton fibers, weaving 240 GSM heavy terry yarn, and engineering double-hems to maintain structure.',
      slug: 'making-of-collection-001',
      image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600'
    },
    {
      title: 'THE HOUSE OF ARVIIK: ESTABLISHING IDENTITY WITHOUT NOISE',
      category: 'MANIFESTO',
      readTime: '3 MIN READ',
      date: '10 APRIL 2026',
      description: 'Our core belief: apparel is an outward projection of internal identity. Why we build in limited quantities and offer no restocks.',
      slug: 'establishing-identity-without-noise',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 font-sans space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 text-center md:text-left">
        <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
          ARVIIK PUBLISHING
        </span>
        <h1 className="font-syne font-extrabold text-3xl uppercase tracking-wider text-stone-900 mt-1">
          Brand Journal
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1 max-w-md">Reflections on design, materials, manufacturing, and minimalist street culture.</p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((article, idx) => (
          <motion.article 
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="border border-stone-200/50 bg-white rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative aspect-16/10 bg-stone-100 border-b border-stone-100">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="object-cover w-full h-full hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Text Body */}
              <div className="p-5 space-y-4">
                <div className="flex justify-between text-[8px] text-stone-400 font-bold uppercase tracking-widest font-mono">
                  <span>{article.category}</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </span>
                </div>

                <h3 className="font-syne font-bold text-sm text-stone-900 uppercase tracking-wide line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-stone-500 text-[11px] leading-relaxed font-light line-clamp-3">
                  {article.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button 
                onClick={() => alert('This editorial journal entry is archived. Full reading access unlocks in winter MMXXVI.')}
                className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-900 hover:text-stone-500 transition-colors pt-2 border-t border-stone-50 w-full text-left sound-click"
              >
                <span>Read article</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
