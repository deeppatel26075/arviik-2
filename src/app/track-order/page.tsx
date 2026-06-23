'use client';

import React, { useState } from 'react';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/order';
import { Package, Search, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setErrorMsg('Please provide both Order ID and Phone Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const found = await orderService.getOrderById(orderId.trim());
      if (found && found.customerPhone.trim() === phone.trim()) {
        setOrder(found);
      } else {
        setErrorMsg('No order found matching the provided details. Please check your credentials.');
      }
    } catch (e) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Confirmed', status: ['Pending', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'] },
    { label: 'Packed', status: ['Packed', 'Shipped', 'Out for delivery', 'Delivered'] },
    { label: 'Shipped', status: ['Shipped', 'Out for delivery', 'Delivered'] },
    { label: 'Out for delivery', status: ['Out for delivery', 'Delivered'] },
    { label: 'Delivered', status: ['Delivered'] }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 select-none font-sans space-y-10">
      <div className="text-center">
        <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
          Purchase Logistics
        </span>
        <h1 className="font-syne font-black text-3xl uppercase tracking-wider text-stone-900 mt-1">
          Track Your Fit
        </h1>
      </div>

      {/* Query Form */}
      <form onSubmit={handleTrack} className="bg-white border border-stone-200 p-6 rounded-sm shadow-2xs space-y-4 max-w-md mx-auto">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
            Order Reference ID
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. ORD-B2F3A9X"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-stone-900 rounded-sm uppercase font-semibold"
            />
            <Package className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-stone-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-stone-50 border border-stone-250 px-4 py-2.5 pl-10 text-xs focus:outline-none focus:border-stone-900 rounded-sm font-semibold"
            />
            <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-stone-400" />
          </div>
        </div>

        {errorMsg && (
          <p className="text-[10px] font-bold text-sale uppercase tracking-wider">
            ⚠️ {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stone-950 text-white font-syne font-black text-xs tracking-widest py-3 hover:bg-stone-900 transition-colors uppercase rounded-xs"
        >
          {loading ? 'LOCATING...' : 'TRACK SHIPMENT'}
        </button>
      </form>

      {/* Tracking Timeline Status */}
      {order && (
        <div className="bg-white border border-stone-250 p-6 rounded-sm shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="border-b border-stone-150 pb-4 flex justify-between items-center text-xs">
            <div>
              <span className="text-stone-450 font-bold uppercase tracking-wider block">Order Reference</span>
              <span className="font-extrabold text-stone-900 font-mono uppercase">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-450 font-bold uppercase tracking-wider block">Status</span>
              <span className="font-black text-secondary uppercase tracking-widest">{order.status}</span>
            </div>
          </div>

          {/* Graphical Pipeline timeline */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 md:px-4">
            {/* Timeline connectors line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -translate-y-1/2 hidden md:block z-0" />
            
            {steps.map((step, idx) => {
              const isPassed = step.status.includes(order.status);
              return (
                <div key={idx} className="flex md:flex-col items-center space-x-3.5 md:space-x-0 md:space-y-2 z-10 relative bg-white pr-4 md:pr-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isPassed ? 'bg-secondary border-secondary text-white shadow-xs' : 'bg-white border-stone-200 text-stone-300'
                  }`}>
                    <CheckCircle2 className="h-4.5 w-4.5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    isPassed ? 'text-stone-900' : 'text-stone-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Order Items list */}
          <div className="border-t border-stone-150 pt-6 space-y-4">
            <h3 className="font-syne font-black text-xs uppercase text-stone-900 tracking-wider">
              Package Contents
            </h3>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, index) => (
                <div key={index} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 aspect-3/4 bg-stone-50 border border-stone-100 rounded-sm overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <span className="font-bold text-stone-900 uppercase tracking-wide block">{item.name}</span>
                      <span className="text-[9px] text-stone-450 font-bold uppercase tracking-wider block">Size: {item.size} | Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="border-t border-stone-150 pt-4 flex justify-between items-center text-xs font-black text-stone-900 uppercase tracking-wider">
              <span>Total Paid:</span>
              <span className="text-secondary text-sm">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
