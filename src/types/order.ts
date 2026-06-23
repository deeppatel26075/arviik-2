export interface OrderItem {
  productId: string;
  name: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  addressLine: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  couponApplied?: string;
  discountAmount: number;
  shippingCharge: number;
  total: number;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Out for delivery' | 'Delivered' | 'Returned';
  paymentMode: 'simulation' | 'live';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  createdAt: string;
}
