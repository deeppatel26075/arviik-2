export const analytics = {
  track(eventName: string, params: Record<string, any> = {}) {
    // Print logs to console to show analytics hooks executing in real-time
    console.log(`[ARVIIK-ANALYTICS] Event: "${eventName}"`, params);
    
    // Future integration hooks can be added here, for example:
    // if (typeof window !== 'undefined' && (window as any).fbq) {
    //   (window as any).fbq('track', eventName, params);
    // }
  },

  trackProductViewed(productId: string, name: string, price: number) {
    this.track('Product Viewed', { productId, name, price, currency: 'INR' });
  },

  trackAddToCart(productId: string, name: string, size: string, price: number) {
    this.track('Add To Cart', { productId, name, size, price, currency: 'INR' });
  },

  trackCheckoutStarted(cartItemsCount: number, cartTotal: number) {
    this.track('Checkout Started', { cartItemsCount, cartTotal, currency: 'INR' });
  },

  trackOrderCompleted(orderId: string, total: number, itemsCount: number) {
    this.track('Order Completed', { orderId, total, itemsCount, currency: 'INR' });
  },

  trackSearchQuery(query: string) {
    this.track('Search Query', { query });
  }
};
