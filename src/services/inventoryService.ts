import { Product } from '@/types/product';

export const inventoryService = {
  getStockCount(product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL'): number {
    if (!product.stock) return 10; // Default fallback stock
    return product.stock[size] !== undefined ? product.stock[size] : 0;
  },

  getStockStatus(product: Product, size: 'S' | 'M' | 'L' | 'XL' | 'XXL'): {
    status: 'available' | 'low-stock' | 'sold-out';
    label: string;
    count: number;
  } {
    const count = this.getStockCount(product, size);
    if (count === 0) {
      return {
        status: 'sold-out',
        label: `${size} SOLD OUT`,
        count
      };
    } else if (count > 0 && count <= 5) {
      return {
        status: 'low-stock',
        label: `Only ${count} left 🔥`,
        count
      };
    } else {
      return {
        status: 'available',
        label: `${size} Available`,
        count
      };
    }
  }
};
