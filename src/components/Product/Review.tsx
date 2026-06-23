'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function Review() {
  const reviews = [
    {
      name: 'Rishi Patel',
      date: '23 Jun 2026',
      rating: 5,
      title: 'Amazing boxy silhouette!',
      text: 'The 240 GSM weight holds shape beautifully. Neck ribbing is tight and doesn\'t stretch out. This is the perfect oversized fit.',
      height: '178 cm',
      weight: '73 kg',
      size: 'L',
      fit: 'True to Size'
    },
    {
      name: 'Aditya Birla',
      date: '15 May 2026',
      rating: 4,
      title: 'Very comfortable heavyweight cotton',
      text: 'Exceeded expectation. Fabric feels very soft Supima. Fits extremely oversized, so size down if you want a classic fit.',
      height: '172 cm',
      weight: '68 kg',
      size: 'M',
      fit: 'Slightly Large'
    }
  ];

  return (
    <div className="border-t border-stone-150 pt-12 mt-12 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Rating Breakdown Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <h3 className="font-syne font-black text-sm uppercase text-stone-900 tracking-wider mb-2">
              Customer Feedback
            </h3>
            <div className="flex items-center space-x-2.5">
              <span className="text-3xl font-extrabold text-stone-950">4.7</span>
              <div className="space-y-0.5">
                <div className="flex items-center text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current text-current" />
                  ))}
                </div>
                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                  Based on 324 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
            {[
              { label: '5 Star', pct: 85 },
              { label: '4 Star', pct: 10 },
              { label: '3 Star', pct: 3 },
              { label: '2 Star', pct: 1 },
              { label: '1 Star', pct: 1 }
            ].map((bar, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <span className="w-10">{bar.label}</span>
                <div className="flex-grow h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${bar.pct}%` }} />
                </div>
                <span className="w-8 text-right">{bar.pct}%</span>
              </div>
            ))}
          </div>

          {/* Fit Metrics Slider */}
          <div className="border-t border-stone-100 pt-5 space-y-3.5 text-xs text-stone-500 font-bold uppercase tracking-wider">
            <span className="text-[10px] text-stone-400 block tracking-[0.2em]">Size and Fit Metrics</span>
            
            <div className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>Runs Small</span>
                <span className="text-stone-950 font-black">True to Size</span>
                <span>Runs Large</span>
              </div>
              <div className="relative w-full h-1 bg-stone-250 rounded-lg">
                <div className="absolute top-1/2 left-[58%] -translate-y-1/2 w-3.5 h-3.5 bg-secondary border-2 border-white rounded-full shadow-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Review list */}
        <div className="lg:col-span-8 space-y-8">
          <h4 className="font-syne font-black text-xs uppercase text-stone-900 tracking-wider border-b border-stone-100 pb-2.5">
            Verified Purchases
          </h4>
          <div className="space-y-6 divide-y divide-stone-100">
            {reviews.map((rev, idx) => (
              <div key={idx} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                <div className="flex items-center justify-between text-xs text-stone-400 font-bold uppercase tracking-wider">
                  <span className="text-stone-900">{rev.name}</span>
                  <span>{rev.date}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex text-secondary">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current text-current" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">{rev.title}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-light">{rev.text}</p>

                {/* Buyer metrics strip */}
                <div className="flex flex-wrap items-center gap-3.5 text-[9px] font-bold text-stone-500 uppercase tracking-widest bg-stone-50 p-2 rounded-xs border border-stone-100">
                  <span>Height: {rev.height}</span>
                  <span>|</span>
                  <span>Weight: {rev.weight}</span>
                  <span>|</span>
                  <span>Purchased: Size {rev.size}</span>
                  <span>|</span>
                  <span className="text-success">Fit: {rev.fit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
