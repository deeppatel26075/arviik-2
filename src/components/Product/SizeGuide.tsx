'use client';

import React, { useState } from 'react';
import { X, Ruler, HelpCircle } from 'lucide-react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuide({ isOpen, onClose }: SizeGuideProps) {
  const [height, setHeight] = useState<number>(175); // cm
  const [weight, setWeight] = useState<number>(70); // kg
  const [recommendedSize, setRecommendedSize] = useState<string>('M');

  if (!isOpen) return null;

  const calculateSize = (h: number, w: number) => {
    // Streetwear oversized fit logic
    if (h < 165 && w < 60) return 'S';
    if (h < 176 && w < 72) return 'M';
    if (h < 184 && w < 84) return 'L';
    if (h < 192 && w < 96) return 'XL';
    return 'XXL';
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const size = calculateSize(height, weight);
    setRecommendedSize(size);
  };

  const chartData = [
    { size: 'S', chest: '44"', length: '28.5"', shoulder: '21"' },
    { size: 'M', chest: '46"', length: '29.5"', shoulder: '22"' },
    { size: 'L', chest: '48"', length: '30.5"', shoulder: '23"' },
    { size: 'XL', chest: '50"', length: '31.5"', shoulder: '24"' },
    { size: 'XXL', chest: '52"', length: '32.5"', shoulder: '25"' }
  ];

  return (
    <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-55 flex items-center justify-center p-4 select-none">
      <div className="bg-white w-full max-w-xl rounded-sm p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-stone-150">
        
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2 border-b border-stone-100 pb-3 mb-6">
          <Ruler className="h-5 w-5 text-secondary" />
          <h3 className="font-syne font-black text-sm uppercase text-stone-900 tracking-wider">
            ARVIIK FIT GUIDE & RECOMMENDATION
          </h3>
        </div>

        {/* Recommender Form widget */}
        <div className="bg-stone-50 border border-stone-200/50 p-4.5 rounded-sm mb-6">
          <h4 className="font-syne font-bold text-[10px] uppercase text-stone-900 tracking-wider mb-3 flex items-center space-x-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-secondary" />
            <span>Size Recommendation Engine</span>
          </h4>
          <form onSubmit={handleCalculate} className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Height: {height} cm
              </label>
              <input
                type="range"
                min="150"
                max="210"
                value={height}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHeight(val);
                  setRecommendedSize(calculateSize(val, weight));
                }}
                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Weight: {weight} kg
              </label>
              <input
                type="range"
                min="40"
                max="120"
                value={weight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeight(val);
                  setRecommendedSize(calculateSize(height, val));
                }}
                className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>
          </form>
          
          <div className="mt-4 flex items-center justify-between bg-accent/15 border border-accent/40 py-2.5 px-4 rounded-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-800">
              Recommended Silhouette:
            </span>
            <span className="font-syne font-black text-sm text-success bg-white px-3 py-1 rounded-sm shadow-2xs border border-accent/20">
              Size {recommendedSize}
            </span>
          </div>
        </div>

        {/* Size Chart measurements table */}
        <div>
          <h4 className="font-syne font-bold text-[10px] uppercase text-stone-900 tracking-wider mb-3">
            Oversized Fit Chart (inches)
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100 text-stone-500 font-bold uppercase border-b border-stone-200">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Width</th>
                  <th className="py-2.5 px-3">Body Length</th>
                  <th className="py-2.5 px-3">Shoulder Width</th>
                </tr>
              </thead>
              <tbody className="text-stone-700 divide-y divide-stone-100">
                {chartData.map((row) => (
                  <tr key={row.size} className="hover:bg-stone-50/50">
                    <td className="py-2 px-3 font-extrabold text-stone-900">{row.size}</td>
                    <td className="py-2 px-3">{row.chest}</td>
                    <td className="py-2 px-3">{row.length}</td>
                    <td className="py-2 px-3">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit details details */}
        <div className="mt-6 border-t border-stone-100 pt-4 text-[10px] text-stone-500 font-bold uppercase tracking-wider text-center">
          <p>💡 Fit check: Model is 6ft tall, weight 74kg wearing Size L.</p>
          <p className="mt-1 text-secondary">Fits are cut extremely boxy/oversized. Take your normal size.</p>
        </div>

      </div>
    </div>
  );
}
