'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut, Package, Heart, MapPin, User, Check, RefreshCw } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const { wishlist, toggleWishlist } = useCart();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'address'>('orders');

  // Address edit state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Sync profile details to states
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.shipping_address || '');
      setCity(profile.shipping_city || '');
      setState(profile.shipping_state || '');
      setPincode(profile.shipping_pincode || '');
    }
  }, [profile]);

  // Fetch orders from Supabase
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;
      try {
        setLoadingOrders(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*, products(name, slug, product_images(image_url)))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching orders:', error);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center space-x-2 text-stone-600 text-xs uppercase tracking-widest font-bold">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading Account...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          shipping_address: address,
          shipping_city: city,
          shipping_state: state,
          shipping_pincode: pincode,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setSaveSuccess(true);
      await refreshProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save address details:', err);
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-50 text-emerald-800 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-800 border-red-100';
      case 'shipped': return 'bg-blue-50 text-blue-800 border-blue-100';
      default: return 'bg-stone-100 text-stone-800 border-stone-200/50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Header Profile Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200 pb-6 mb-10 gap-4">
        <div>
          <span className="text-[10px] text-stone-400 font-bold tracking-[0.25em] uppercase">
            User Workspace
          </span>
          <h1 className="font-syne font-extrabold text-2xl uppercase tracking-wider text-stone-900 mt-1">
            My Account
          </h1>
          <p className="text-xs text-stone-500 font-light mt-0.5">Welcome, {profile?.full_name || user.email}</p>
        </div>

        <button
          onClick={() => signOut().then(() => router.push('/login'))}
          className="inline-flex items-center space-x-1.5 border border-stone-200 hover:border-stone-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:text-stone-950 transition-colors w-fit rounded-sm shadow-xs"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation columns */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-stone-200 lg:pr-6 pb-4 lg:pb-0 gap-4 text-xs font-bold uppercase tracking-widest text-stone-500">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 text-left py-2 hover:text-stone-950 ${
              activeTab === 'orders' ? 'text-stone-900 font-bold border-b-2 border-stone-900 lg:border-b-0 lg:border-r-2 lg:border-stone-950 lg:pr-4' : ''
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center space-x-2 text-left py-2 hover:text-stone-950 ${
              activeTab === 'wishlist' ? 'text-stone-900 font-bold border-b-2 border-stone-900 lg:border-b-0 lg:border-r-2 lg:border-stone-950 lg:pr-4' : ''
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`flex items-center space-x-2 text-left py-2 hover:text-stone-950 ${
              activeTab === 'address' ? 'text-stone-900 font-bold border-b-2 border-stone-900 lg:border-b-0 lg:border-r-2 lg:border-stone-950 lg:pr-4' : ''
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Addresses</span>
          </button>

          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center space-x-2 text-left py-2 text-accent hover:opacity-80 mt-auto"
            >
              <User className="h-4 w-4" />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Details Container */}
        <div className="lg:col-span-9">
          
          {/* 1. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-syne font-bold uppercase text-stone-900 text-sm tracking-wider pb-3 border-b border-stone-100">
                Order History
              </h3>
              
              {loadingOrders ? (
                <p className="text-xs text-stone-400 font-light">Checking server for orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-sm">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest mb-3">No orders found</p>
                  <Link
                    href="/shop"
                    className="inline-block text-xs bg-stone-900 text-white font-bold uppercase tracking-widest px-6 py-2.5 hover:opacity-85 transition-opacity"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-stone-200/60 rounded-xs bg-white shadow-xs p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-stone-100 pb-3 gap-2">
                        <div className="text-[10px] sm:text-xs font-bold text-stone-900">
                          <span>Order Reference: </span>
                          <span className="font-mono text-stone-700">{order.id}</span>
                        </div>
                        <div className="flex space-x-2 text-[10px] font-bold uppercase tracking-wider">
                          <span className={`px-2.5 py-1 rounded-sm border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="divide-y divide-stone-100">
                        {order.order_items?.map((item: any, itemIdx: number) => {
                          const pImg = item.products?.product_images?.[0]?.image_url || '/placeholder-tee.jpg';
                          return (
                            <div key={itemIdx} className="flex items-center space-x-3 py-3 first:pt-0">
                              <div className="relative h-12 w-9 bg-stone-100 flex-shrink-0">
                                <Image
                                  src={pImg}
                                  alt={item.products?.name || 'Streetwear Tee'}
                                  fill
                                  sizes="50px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-grow text-[11px] text-stone-600">
                                <p className="font-semibold text-stone-950 uppercase tracking-wide">
                                  {item.products?.name || 'Streetwear T-Shirt'}
                                </p>
                                <p className="uppercase tracking-widest text-[9px] mt-0.5 text-stone-400">
                                  Size: {item.size} | Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="text-[11px] font-semibold text-stone-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-baseline pt-2 border-t border-stone-100 text-xs">
                        <span className="text-stone-400 font-semibold uppercase tracking-wider">Total amount</span>
                        <span className="font-bold text-stone-950">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="font-syne font-bold uppercase text-stone-900 text-sm tracking-wider pb-3 border-b border-stone-100">
                My Favorites
              </h3>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-stone-200 rounded-sm">
                  <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest">
                    Your wishlist is empty
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="border border-stone-200/50 bg-white rounded-xs overflow-hidden shadow-xs relative flex flex-col"
                    >
                      <Link href={`/shop/${item.slug}`} className="relative aspect-3/4 bg-stone-100 block">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/shop/${item.slug}`}
                            className="font-syne font-bold text-xs uppercase tracking-wider text-stone-900 block line-clamp-1 hover:opacity-85"
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs font-semibold text-stone-950 mt-1 block">
                            {formatPrice(item.discountPrice || item.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleWishlist(item)}
                          className="mt-3 w-full bg-stone-50 border border-stone-200 text-stone-700 hover:text-red-700 hover:border-red-200 text-[10px] font-bold uppercase py-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Addresses Tab */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <h3 className="font-syne font-bold uppercase text-stone-900 text-sm tracking-wider pb-3 border-b border-stone-100">
                Default Address
              </h3>

              {saveSuccess && (
                <p className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold p-3 border border-emerald-100 rounded-xs flex items-center space-x-1.5 uppercase tracking-wider">
                  <Check className="h-4 w-4" />
                  <span>Address details updated successfully!</span>
                </p>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Karan Malhotra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    Full Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apartment, building, street, etc."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Maharashtra"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Pincode
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs focus:outline-none focus:border-stone-900 rounded-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-stone-950 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3.5 hover:opacity-90 transition-opacity rounded-xs shadow-sm"
                >
                  {saving ? 'Saving...' : 'Update Details'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
