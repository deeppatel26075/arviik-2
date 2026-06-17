'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

export default function Lookbook() {
  const editorialShots = [
    {
      title: 'DROP 001: THE ORIGIN',
      location: 'Ahmedabad Industrial Zone',
      date: 'JUNE MMXXVI',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
      description: 'Slow shuffles, concrete frames, heavy terry. The genesis drop engineered for the builders who operate in quiet corners.'
    },
    {
      title: 'STREET TRANSIT SERIES',
      location: 'Midnight Streets, Mumbai',
      date: 'AUG MMXXVI',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800',
      description: 'Draped drop-shoulders moving through transit lines. Silence without noise, structured shapes that hold their form.'
    },
    {
      title: 'METROPOLIS ARCHIVE',
      location: 'Abandoned Wharf, Goa',
      date: 'OCT MMXXVI',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800',
      description: 'Heavyweight cotton silhouettes framed against raw rust and industrial decay. A study in minimal identity.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 font-sans space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 text-center md:text-left">
        <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
          ARVIIK Lookbook
        </span>
        <h1 className="font-syne font-extrabold text-3xl uppercase tracking-wider text-stone-900 mt-1">
          Editorial Drops
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1 max-w-md">Visual explorations of silhouettes, materials, and streetscapes.</p>
      </div>

      {/* Editorial Grid Layout */}
      <div className="space-y-20">
        {editorialShots.map((shot, idx) => (
          <div 
            key={idx} 
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              idx % 2 === 0 ? '' : 'lg:flex-row-reverse'
            }`}
          >
            {/* Visual block */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`lg:col-span-7 relative aspect-4/5 w-full bg-stone-100 border border-stone-200/50 overflow-hidden shadow-lg ${
                idx % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
              }`}
            >
              <img 
                src={shot.image} 
                alt={shot.title} 
                className="object-cover w-full h-full hover:scale-103 transition-transform duration-700 ease-out"
              />
            </motion.div>

            {/* Info details panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`lg:col-span-5 space-y-5 ${
                idx % 2 === 0 ? 'lg:order-2 lg:pl-10' : 'lg:order-1 lg:pr-10'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap gap-4 text-[9px] text-stone-400 font-bold uppercase tracking-widest font-mono">
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{shot.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{shot.date}</span>
                  </span>
                </div>
                
                <h2 className="font-syne font-extrabold text-2xl uppercase tracking-wider text-stone-900">
                  {shot.title}
                </h2>
              </div>

              <p className="text-stone-600 text-xs sm:text-sm tracking-wide leading-relaxed font-light font-sans">
                {shot.description}
              </p>

              <div className="pt-4">
                <Link 
                  href="/shop" 
                  className="inline-flex items-center space-x-2 border-b border-stone-900 pb-1 text-xs font-bold uppercase tracking-widest text-stone-900 hover:text-stone-600 hover:border-stone-400 transition-colors sound-click sound-hover"
                >
                  <span>Browse silhouettes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
