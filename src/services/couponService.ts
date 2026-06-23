export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minimumOrder: number;
  description: string;
}

export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minimumOrder: 999,
    description: '10% OFF on orders above ₹999'
  },
  {
    code: 'BUY3',
    type: 'fixed',
    value: 300,
    minimumOrder: 1500,
    description: 'Flat ₹300 OFF on buying any 3 items (minimum cart value ₹1500)'
  },
  {
    code: 'FREESHIP',
    type: 'percentage',
    value: 0,
    minimumOrder: 1199,
    description: 'Free Delivery on orders above ₹1199'
  }
];

export const couponService = {
  validateCoupon(code: string, cartTotal: number): {
    isValid: boolean;
    discountAmount: number;
    message: string;
    coupon?: Coupon;
  } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find(c => c.code === cleanCode);

    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Invalid coupon code.'
      };
    }

    if (cartTotal < coupon.minimumOrder) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Min order value for this coupon is ₹${coupon.minimumOrder}.`
      };
    }

    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = Math.round(cartTotal * (coupon.value / 100));
    } else {
      discountAmount = coupon.value;
    }

    return {
      isValid: true,
      discountAmount,
      message: `Coupon "${coupon.code}" applied successfully!`,
      coupon
    };
  }
};
