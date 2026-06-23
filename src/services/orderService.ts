import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from '@/types/order';

// Save order locally for demo fallback
const saveOrderLocally = (order: Order) => {
  try {
    const existing = localStorage.getItem('arviik_order_history');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(order);
    localStorage.setItem('arviik_order_history', JSON.stringify(list));
  } catch (e) {
    console.error('Failed to store order in local storage:', e);
  }
};

export const orderService = {
  async placeOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const id = 'ord-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const createdAt = new Date().toISOString();
    const order: Order = { ...orderData, id, createdAt };

    // Try committing to Supabase
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id || null;

      // 1. Insert into orders table
      const { data: dbOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          id,
          user_id: userId,
          status: 'pending',
          total_amount: order.total,
          shipping_name: order.customerName,
          shipping_email: order.customerId || 'guest@arviik.com',
          shipping_phone: order.customerPhone,
          shipping_address: order.shippingAddress.addressLine,
          shipping_city: order.shippingAddress.city,
          shipping_state: order.shippingAddress.state,
          shipping_pincode: order.shippingAddress.zip
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 2. Insert order items
      const itemsToInsert = order.items.map(item => ({
        order_id: id,
        product_id: item.productId.startsWith('prod-') ? null : item.productId, // Null if mock ID
        size: item.size,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsErr) throw itemsErr;

      // 3. Insert payment registration
      await supabase
        .from('payments')
        .insert({
          order_id: id,
          provider: order.paymentMode === 'simulation' ? 'simulation' : 'razorpay',
          transaction_id: 'txn-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          amount: order.total,
          status: 'completed'
        });

      console.log('Order successfully synced to Supabase database!');
    } catch (err) {
      console.warn('Supabase order commit failed, processing local simulation fallback:', err);
    }

    // Always log locally to guarantee visual tracking persistence in user dashboard
    saveOrderLocally(order);
    return order;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        // Map db format to Order format
        return {
          id: data.id,
          customerName: data.shipping_name,
          customerPhone: data.shipping_phone,
          shippingAddress: {
            addressLine: data.shipping_address,
            city: data.shipping_city,
            state: data.shipping_state,
            zip: data.shipping_pincode
          },
          items: data.order_items.map((item: any) => ({
            productId: item.product_id || 'prod-mock',
            name: 'Streetwear Graphic Item', // Default mapping name
            size: item.size as any,
            quantity: item.quantity,
            price: Number(item.price),
            image: '/placeholder-tee.jpg'
          })),
          subtotal: Number(data.total_amount),
          discountAmount: 0,
          shippingCharge: 0,
          total: Number(data.total_amount),
          status: this.mapDbStatusToOrder(data.status),
          paymentMode: 'simulation',
          paymentStatus: 'Paid',
          createdAt: data.created_at
        };
      }
    } catch (e) {
      console.warn('Supabase fetch failed for orderId, searching local history:', e);
    }

    // Fallback to local storage
    try {
      const local = localStorage.getItem('arviik_order_history');
      if (local) {
        const list = JSON.parse(local) as Order[];
        const found = list.find(o => o.id === orderId);
        if (found) return found;
      }
    } catch (err) {}

    return null;
  },

  async getOrdersByUserId(userIdOrEmail: string): Promise<Order[]> {
    const list: Order[] = [];
    
    // Attempt local storage fetch first for instant demo loading
    try {
      const local = localStorage.getItem('arviik_order_history');
      if (local) {
        const parsed = JSON.parse(local) as Order[];
        list.push(...parsed);
      }
    } catch (e) {}

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Map new records not already in the list
        data.forEach((row: any) => {
          if (!list.some(o => o.id === row.id)) {
            list.push({
              id: row.id,
              customerName: row.shipping_name,
              customerPhone: row.shipping_phone,
              shippingAddress: {
                addressLine: row.shipping_address,
                city: row.shipping_city,
                state: row.shipping_state,
                zip: row.shipping_pincode
              },
              items: row.order_items.map((item: any) => ({
                productId: item.product_id || 'prod-mock',
                name: 'Streetwear Oversized Item',
                size: item.size as any,
                quantity: item.quantity,
                price: Number(item.price),
                image: '/placeholder-tee.jpg'
              })),
              subtotal: Number(row.total_amount),
              discountAmount: 0,
              shippingCharge: 0,
              total: Number(row.total_amount),
              status: this.mapDbStatusToOrder(row.status),
              paymentMode: 'simulation',
              paymentStatus: 'Paid',
              createdAt: row.created_at
            });
          }
        });
      }
    } catch (err) {}

    return list;
  },

  mapDbStatusToOrder(status: string): Order['status'] {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Pending';
      case 'packing': return 'Packed';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Returned';
      default: return 'Pending';
    }
  }
};
