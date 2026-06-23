export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviews: number;
  images: string[];
  colors: string[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[];
  stock: Record<'S' | 'M' | 'L' | 'XL' | 'XXL', number>;
  tags: string[];
  description?: string;
  fabric?: string;
  gsm?: string;
  fit_type?: string;
  wash_instructions?: string;
}
