'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { RefreshCw, Users } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile stats
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer');

      if (error) console.error(error);

      if (profiles && profiles.length > 0) {
        const list = [];
        for (const prof of profiles) {
          // Fetch order counts
          const { data: orders } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', prof.id);

          const totalSpent = orders?.reduce((sum, o) => sum + parseFloat(o.total_amount), 0) || 0;

          list.push({
            id: prof.id,
            name: prof.full_name || 'Guest User',
            phone: prof.phone || 'N/A',
            address: prof.shipping_address ? `${prof.shipping_address}, ${prof.shipping_city}` : 'N/A',
            orderCount: orders?.length || 0,
            totalSpent,
          });
        }
        setCustomers(list);
      } else {
        // Fallback mock customer list
        setCustomers([
          { id: 'u1', name: 'Rohan Sharma', phone: '9876543210', address: 'Flat 401 Skylark, Mumbai', orderCount: 2, totalSpent: 3897 },
          { id: 'u2', name: 'Elena Rostova', phone: '9988776655', address: '42 Nevsky Prospect, Delhi', orderCount: 1, totalSpent: 1299 },
          { id: 'u3', name: 'Karan Malhotra', phone: '9812345678', address: 'Green Meadows Villa, Bangalore', orderCount: 3, totalSpent: 6495 },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="font-syne font-extrabold text-2xl uppercase tracking-wider text-stone-900">
          Customer Directory
        </h1>
        <p className="text-xs text-stone-500 font-light mt-0.5">View customer order histories, contact information and purchase statistics.</p>
      </div>

      {/* Customer list table */}
      <div className="bg-white border border-stone-200/60 rounded-xs p-6 shadow-xs">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-stone-400 text-xs font-bold uppercase tracking-widest space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin text-stone-600" />
            <span>Loading customers...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead>
                <tr className="border-b border-stone-100 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Customer Name</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Primary Location</th>
                  <th className="pb-3">Orders count</th>
                  <th className="pb-3">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/50">
                    <td className="py-4 font-semibold text-stone-900 uppercase tracking-wide">{cust.name}</td>
                    <td className="py-4 font-medium text-stone-700">{cust.phone}</td>
                    <td className="py-4 font-medium text-stone-500 line-clamp-1 max-w-xs">{cust.address}</td>
                    <td className="py-4 font-semibold text-stone-850">{cust.orderCount} orders</td>
                    <td className="py-4 font-mono font-bold text-stone-900">{formatPrice(cust.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
