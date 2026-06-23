import { supabase } from '@/lib/supabase';
import { PRODUCTS } from '@/data/products';
import ShopClient from '@/app/shop/ShopClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  
  let dbProducts = [];
  let dbCategories = [];
  let dbSettings: any[] = [];

  try {
    // 1. Fetch categories
    const { data: catData } = await supabase
      .from('categories')
      .select('*');
    if (catData) dbCategories = catData;

    // 2. Fetch products
    const { data: prodData } = await supabase
      .from('products')
      .select('*, category:categories(name), product_images(image_url), inventory(size, quantity)')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });
    
    if (prodData && prodData.length > 0) {
      dbProducts = prodData.map(prod => ({
        ...prod,
        category: prod.category ? { name: (prod.category as any).name } : undefined,
        product_images: prod.product_images || [],
        inventory: prod.inventory || []
      }));
    }

    // 3. Fetch settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*');
    if (settingsData) dbSettings = settingsData;

  } catch (err) {
    console.error('Error fetching collection data, utilizing fallbacks:', err);
  }

  const allProducts = dbProducts.length > 0 ? dbProducts : PRODUCTS;
  const finalCategories = dbCategories.length > 0 ? dbCategories : [
    { id: 'cat-001', name: 'Oversized T-Shirts', slug: 'oversized-t-shirts' },
    { id: 'cat-002', name: 'Hoodies', slug: 'hoodies' },
    { id: 'cat-003', name: 'Joggers', slug: 'joggers' }
  ];

  const settingsMap = dbSettings.reduce((acc: any, item: any) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  // Pre-filter products based on slug
  let filteredProducts = [...allProducts];
  let collectionTitle = 'Streetwear Drop';

  if (slug === 'oversized' || slug === 'oversized-t-shirts') {
    filteredProducts = allProducts.filter(
      p => p.category?.toLowerCase() === 'oversized t-shirts' || 
           p.category?.name?.toLowerCase() === 'oversized t-shirts'
    );
    collectionTitle = 'Oversized Collection';
  } else if (slug === 'joggers') {
    filteredProducts = allProducts.filter(
      p => p.category?.toLowerCase() === 'joggers' || 
           p.category?.name?.toLowerCase() === 'joggers'
    );
    collectionTitle = 'Joggers Collection';
  } else if (slug === 'hoodies') {
    filteredProducts = allProducts.filter(
      p => p.category?.toLowerCase() === 'hoodies' || 
           p.category?.name?.toLowerCase() === 'hoodies'
    );
    collectionTitle = 'Hoodies Collection';
  } else if (slug === 'bestsellers') {
    filteredProducts = allProducts.filter(p => p.tags?.includes('BESTSELLER'));
    collectionTitle = 'Bestsellers';
  } else if (slug === 'new-drops') {
    filteredProducts = allProducts.filter(p => p.tags?.includes('NEW ARRIVAL'));
    collectionTitle = 'New Drops';
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-stone-200 pb-5 mb-8">
        <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase">
          ARVIIK Collections
        </span>
        <h1 className="font-syne font-black text-3xl uppercase tracking-wider text-stone-900 mt-1">
          {collectionTitle}
        </h1>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-20 text-xs font-bold uppercase tracking-widest text-stone-400">
          Loading collection...
        </div>
      }>
        <ShopClient 
          initialProducts={filteredProducts as any} 
          categories={finalCategories as any} 
          settings={settingsMap}
        />
      </Suspense>
    </div>
  );
}
