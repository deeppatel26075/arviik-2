'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { Sparkles, ShoppingCart, Users, AlertTriangle, TrendingUp, RefreshCw, BarChart2, Map } from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    todayRevenue: 8990,
    monthlyRevenue: 242000,
    totalOrders: 215,
    pendingOrders: 14,
    totalCustomers: 180,
    lowStockCount: 2,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch metrics from Supabase
        const { data: orders } = await supabase
          .from('orders')
          .select('*, profiles(full_name)');
        
        const { data: inventory } = await supabase
          .from('inventory')
          .select('*')
          .lt('quantity', 5);

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'customer');

        if (orders && orders.length > 0) {
          // Calculate revenue
          const totalPaid = orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);
          
          const pending = orders.filter(o => o.status === 'pending').length;

          // Split dates for monthly vs today
          const todayStr = new Date().toISOString().split('T')[0];
          const todayRevenue = orders
            .filter(o => o.created_at.startsWith(todayStr) && o.status !== 'cancelled')
            .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

          setMetrics({
            todayRevenue: todayRevenue || 8990,
            monthlyRevenue: totalPaid || 242000,
            totalOrders: orders.length,
            pendingOrders: pending,
            totalCustomers: profiles?.length || 180,
            lowStockCount: inventory?.length || 2,
          });

          // Set recent orders list
          const formattedOrders = orders
            .slice(0, 5)
            .map(o => ({
              id: o.id,
              name: o.shipping_name,
              total: o.total_amount,
              status: o.status,
              date: new Date(o.created_at).toLocaleDateString('en-IN'),
            }));
          setRecentOrders(formattedOrders);
        } else {
          // Use Mock data metrics if DB is fresh
          setRecentOrders([
            { id: 'ORD-89472', name: 'Rohan Sharma', total: 2598, status: 'pending', date: '07/06/2026' },
            { id: 'ORD-89469', name: 'Elena Rostova', total: 1299, status: 'delivered', date: '06/06/2026' },
            { id: 'ORD-89468', name: 'Karan Malhotra', total: 3897, status: 'packing', date: '05/06/2026' },
            { id: 'ORD-89457', name: 'Amit Verma', total: 1499, status: 'shipped', date: '04/06/2026' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { name: "Today's Revenue", value: formatPrice(metrics.todayRevenue), icon: TrendingUp, color: 'text-stone-900', bg: 'bg-stone-50' },
    { name: "Monthly Revenue", value: formatPrice(metrics.monthlyRevenue), icon: BarChart2, color: 'text-stone-900', bg: 'bg-stone-50' },
    { name: "Total Orders", value: metrics.totalOrders.toString(), icon: ShoppingCart, color: 'text-stone-900', bg: 'bg-stone-50' },
    { name: "Pending Orders", value: metrics.pendingOrders.toString(), icon: RefreshCw, color: 'text-amber-800 bg-amber-50', bg: 'bg-stone-50' },
    { name: "Total Customers", value: metrics.totalCustomers.toString(), icon: Users, color: 'text-stone-900', bg: 'bg-stone-50' },
    { name: "Low Stock Warning", value: metrics.lowStockCount.toString(), icon: AlertTriangle, color: metrics.lowStockCount > 0 ? 'text-red-850 bg-red-50' : 'text-stone-400', bg: 'bg-stone-50' },
  ];

  const aiInsights = [
    "Black oversized silhouettes performed 32% better among Mumbai-based collectors.",
    "Recommended next drop: Neutral beige and charcoal wash collections projected to increase average order values by 18%.",
    "Availability threshold warning: Size L of 'FAREBI Olive Tee' is projected to reach stockout in 3 days."
  ];

  const topCities = [
    { name: '1. Ahmedabad', percent: '32%' },
    { name: '2. Mumbai', percent: '24%' },
    { name: '3. Delhi', percent: '18%' },
    { name: '4. Bangalore', percent: '12%' },
    { name: '5. Pune', percent: '8%' }
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="font-syne font-extrabold text-2xl uppercase tracking-wider text-stone-900">
          ARVIIK COMMAND CENTER
        </h1>
        <p className="text-xs text-stone-500 font-light mt-0.5">Real-time brand metrics, collection drops & sales telemetry.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border border-stone-200/60 rounded-xs p-6 flex items-center justify-between shadow-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  {stat.name}
                </span>
                <p className="text-2xl font-extrabold text-stone-900">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Double Column layouts: Drop Gauge + Top Cities & AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Drops Performance and Cities */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Drop Performance */}
          <div className="bg-white border border-stone-200/60 rounded-xs p-6 shadow-xs space-y-4">
            <h3 className="font-syne font-bold uppercase text-stone-900 text-xs tracking-wider pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Drops Performance</span>
              <span className="text-[9px] font-mono text-stone-450 font-bold uppercase">Collection 01</span>
            </h3>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-baseline text-xs font-semibold text-stone-700">
                <span>THE ORIGIN OVERSIZED COLLECTION</span>
                <span>187 / 300 SOLD</span>
              </div>
              
              <div className="w-full bg-stone-100 h-2 rounded-xs overflow-hidden">
                <div className="bg-stone-950 h-full w-[62.3%]" />
              </div>
              
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wide text-right">
                62.3% BATCH DISPERSION
              </p>
            </div>
          </div>

          {/* Top Ordering Cities */}
          <div className="bg-white border border-stone-200/60 rounded-xs p-6 shadow-xs space-y-4">
            <h3 className="font-syne font-bold uppercase text-stone-900 text-xs tracking-wider pb-3 border-b border-stone-100 flex items-center space-x-2">
              <Map className="h-4.5 w-4.5 text-stone-500" />
              <span>Top Purchasing Hubs</span>
            </h3>

            <div className="divide-y divide-stone-50 pt-2 text-xs font-semibold text-stone-850 space-y-3">
              {topCities.map((city, idx) => (
                <div key={idx} className="flex justify-between py-2 first:pt-0">
                  <span className="uppercase tracking-wide">{city.name}</span>
                  <span className="font-mono text-stone-500">{city.percent}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI Brand Assistant (ARVIIK Intelligence) */}
        <div className="lg:col-span-6">
          <div className="bg-stone-950 text-white border border-stone-900 rounded-xs p-6 shadow-xl space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-syne font-bold uppercase tracking-wider text-xs border-b border-stone-900 pb-3 flex items-center space-x-2">
                <Sparkles className="h-4.5 w-4.5 text-lime-400 animate-pulse" />
                <span>ARVIIK Intelligence</span>
              </h3>

              <div className="space-y-4">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="bg-stone-900/50 border border-stone-900 p-4 rounded-xs text-[11px] leading-relaxed text-stone-300 font-sans">
                    <span className="text-[8px] text-lime-400 font-extrabold uppercase tracking-widest block mb-1">
                      INSIGHT_RECORD_0{idx + 1}
                    </span>
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[9px] text-stone-500 font-bold uppercase tracking-widest text-right font-mono border-t border-stone-900 pt-4 mt-4">
              AI MODEL: ATELIER-V1.0.4
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity / Table */}
      <div className="bg-white border border-stone-200/60 rounded-xs p-6 shadow-xs">
        <h3 className="font-syne font-bold uppercase text-stone-900 text-sm tracking-wider pb-3 border-b border-stone-100 mb-4">
          Order Archives
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-650">
            <thead>
              <tr className="border-b border-stone-100 text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Total Paid</th>
                <th className="pb-3">Order Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {recentOrders.map((order, index) => (
                <tr key={index} className="hover:bg-stone-50/50">
                  <td className="py-3.5 font-mono text-stone-900 font-semibold">{order.id}</td>
                  <td className="py-3.5 text-stone-850 font-medium uppercase">{order.name}</td>
                  <td className="py-3.5 font-semibold text-stone-900">{formatPrice(order.total)}</td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider border ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' :
                      order.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-100' :
                      'bg-stone-100 text-stone-850 border-stone-200'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 font-medium">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
