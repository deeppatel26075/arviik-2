'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SoundPlayer } from '@/components/SoundExperience';
import { Check, X, ShieldAlert, Key, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PrivateAccess() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validCodes = ['AVK-ORIGIN', 'AVK-X7H92', 'AVK-STREET'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    // Simulate luxury verification delay
    setTimeout(() => {
      const formattedCode = code.trim().toUpperCase();
      if (validCodes.includes(formattedCode)) {
        SoundPlayer.playUnlock();
        setSuccess(true);
        localStorage.setItem('arviik_private_access', 'true');
        setTimeout(() => {
          router.push('/shop');
        }, 1500);
      } else {
        setError(true);
        setCode('');
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center p-6 select-none font-sans relative overflow-hidden">
      {/* Dynamic Background Noise/Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1600')] bg-cover bg-center opacity-10 mix-blend-color-dodge pointer-events-none" />
      <div className="absolute inset-0 bg-stone-950/80 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md bg-stone-900/40 border border-stone-850 backdrop-blur-md p-8 md:p-10 rounded-sm shadow-2xl text-center space-y-8"
      >
        <div className="space-y-2.5">
          <span className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.4em] block">
            ARVIIK LABS
          </span>
          <h1 className="font-syne font-extrabold text-3xl tracking-[0.2em] uppercase text-white">
            PRIVATE ACCESS
          </h1>
          <p className="text-[10px] text-stone-400 font-medium tracking-widest uppercase leading-relaxed max-w-xs mx-auto">
            This collection drop is locked behind private codes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.25em] pl-1">
              ENTER INVITATION CODE
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={loading || success}
                placeholder="AVK-XXXX-XXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-stone-950/70 border border-stone-800 focus:border-stone-500 text-stone-100 placeholder-stone-700 px-4 py-3 text-center tracking-[0.3em] font-mono text-xs focus:outline-none rounded-xs uppercase disabled:opacity-50 transition-colors"
              />
              <Key className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-stone-700" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success || !code.trim()}
            className="w-full bg-white hover:bg-stone-200 disabled:bg-stone-800 disabled:text-stone-600 disabled:border-stone-800 disabled:cursor-not-allowed border border-transparent text-stone-950 text-[10px] font-bold uppercase tracking-[0.3em] py-4 rounded-xs transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 sound-click sound-hover"
          >
            {loading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : success ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <span>ACCESS HOUSE →</span>
            )}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5"
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              <span>INVALID INVITATION CODE</span>
            </motion.p>
          )}

          {success && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5"
            >
              <Check className="h-4.5 w-4.5" />
              <span>ACCESS GRANTED. ENTERING HOUSE...</span>
            </motion.p>
          )}
        </AnimatePresence>

        <div className="pt-4 border-t border-stone-850 flex justify-between items-center text-[8px] font-bold text-stone-550 uppercase tracking-widest font-sans">
          <span>MMXXVI</span>
          <span>NO COMPROMISE</span>
        </div>
      </motion.div>
    </div>
  );
}
