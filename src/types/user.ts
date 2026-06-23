import { ShippingAddress } from './order';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name?: string;
  phone?: string;
  addresses?: ShippingAddress[];
}
