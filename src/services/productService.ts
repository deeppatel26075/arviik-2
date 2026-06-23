import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { PRODUCTS } from '@/data/products';

// Helper to map DB row to Frontend Product model
const mapDbProductToProduct = (dbProd: any): Product => {
  const dbPrice = Number(dbProd.price);
  const dbDiscountPrice = dbProd.discount_price ? Number(dbProd.discount_price) : 0;
  
  const price = dbDiscountPrice > 0 ? dbDiscountPrice : dbPrice;
  const mrp = dbPrice;
  const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // Extract images
  const images = dbProd.product_images && dbProd.product_images.length > 0
    ? dbProd.product_images.map((img: any) => img.image_url)
    : ['/placeholder-tee.jpg'];

  // Extract sizes and stocks
  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = [];
  const stock: Record<'S' | 'M' | 'L' | 'XL' | 'XXL', number> = {
    S: 0, M: 0, L: 0, XL: 0, XXL: 0
  };

  if (dbProd.inventory && dbProd.inventory.length > 0) {
    dbProd.inventory.forEach((item: any) => {
      const sizeVal = item.size as 'S' | 'M' | 'L' | 'XL' | 'XXL';
      if (['S', 'M', 'L', 'XL', 'XXL'].includes(sizeVal)) {
        stock[sizeVal] = item.quantity || 0;
        if (item.quantity > 0) {
          sizes.push(sizeVal);
        }
      }
    });
  }

  // If no active inventory in DB, populate default mock inventory
  if (sizes.length === 0) {
    sizes.push('S', 'M', 'L', 'XL');
    stock.S = 10;
    stock.M = 10;
    stock.L = 5;
    stock.XL = 0;
  }

  return {
    id: dbProd.id,
    slug: dbProd.slug,
    name: dbProd.name,
    category: dbProd.category?.name || 'Oversized T-Shirts',
    price,
    mrp,
    discount,
    rating: dbProd.is_featured ? 4.7 : 4.5, // Dummy default matching screenshots
    reviews: dbProd.is_featured ? 230 : 120, // Dummy default matching screenshots
    images,
    colors: ['#09090b', '#f5f5dc'], // Fallback default swatches
    sizes,
    stock,
    tags: (() => {
      const tagsList: string[] = [];
      if (dbProd.is_featured) tagsList.push('BESTSELLER');
      const createdDate = dbProd.created_at ? new Date(dbProd.created_at) : null;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (createdDate && createdDate >= thirtyDaysAgo) {
        tagsList.push('NEW ARRIVAL');
      }
      return tagsList;
    })(),
    description: dbProd.description || '',
    fabric: dbProd.fabric || '100% Premium Cotton',
    gsm: dbProd.gsm || '240 GSM',
    fit_type: dbProd.fit_type || 'Oversized Fit',
    wash_instructions: dbProd.wash_instructions || 'Cold machine wash inside out.'
  };
};

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name), product_images(image_url), inventory(size, quantity)')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        return data.map(mapDbProductToProduct);
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase, using mock products fallback:', err);
    }
    return PRODUCTS;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(name), product_images(image_url), inventory(size, quantity)')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Allow single not found

      if (data) {
        return mapDbProductToProduct(data);
      }
    } catch (err) {
      console.warn(`Failed to fetch product by slug ${slug}, seeking mock fallback:`, err);
    }
    const fallback = PRODUCTS.find(p => p.slug === slug);
    return fallback || null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const all = await this.getAllProducts();
    return all.filter(p => p.tags.includes('BESTSELLER') || p.tags.includes('TRENDING'));
  },

  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    const all = await this.getAllProducts();
    return all.filter(p => p.category.toLowerCase().includes(categoryName.toLowerCase()));
  },

  async searchProducts(query: string): Promise<Product[]> {
    const all = await this.getAllProducts();
    if (!query) return all;
    const cleanQuery = query.toLowerCase();
    return all.filter(
      p => p.name.toLowerCase().includes(cleanQuery) || 
           p.description?.toLowerCase().includes(cleanQuery) ||
           p.category.toLowerCase().includes(cleanQuery)
    );
  }
};
