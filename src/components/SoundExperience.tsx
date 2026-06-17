'use client';

import React from 'react';

// Web Audio API Synthesizer Class for luxury micro-sounds
export class SoundPlayer {
  private static ctx: AudioContext | null = null;

  private static getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    // Resume context if suspended (browser security autoplays)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Soft high-frequency watch mechanical tick
  static playTick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (localStorage.getItem('arviik_sound_enabled') === 'false') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Audio context failed or blocked by autoplay
    }
  }

  // Soft click snap for hovering menus
  static playHover() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (localStorage.getItem('arviik_sound_enabled') === 'false') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Chime slider for vault unlocks
  static playUnlock() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (localStorage.getItem('arviik_sound_enabled') === 'false') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.22);
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch (e) {}
  }
}

export default function SoundExperience() {
  React.useEffect(() => {
    // Set sound on by default if not set
    if (typeof window !== 'undefined' && localStorage.getItem('arviik_sound_enabled') === null) {
      localStorage.setItem('arviik_sound_enabled', 'true');
    }

    // Capture global hover sound triggers for elements with class "sound-hover"
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.classList.contains('sound-hover') || target.closest('.sound-hover'))) {
        SoundPlayer.playHover();
      }
    };

    // Capture global click sound triggers for elements with class "sound-click"
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.classList.contains('sound-click') || target.closest('.sound-click'))) {
        SoundPlayer.playTick();
      }
    };

    document.addEventListener('mouseover', handleGlobalMouseOver);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('mouseover', handleGlobalMouseOver);
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
}
