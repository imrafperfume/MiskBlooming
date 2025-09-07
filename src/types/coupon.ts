export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableProducts: string[];
  applicableCategories: string[];
  applicableUsers: string[];
  newUsersOnly: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  orderId: string;
  userId?: string;
  email?: string;
  discountAmount: number;
  orderAmount: number;
  usedAt: string;
  coupon: Coupon;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  error?: string;
}

export interface CreateCouponInput {
  code: string;
  name: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  discountValue: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  userUsageLimit?: number;
  validFrom: string; // ISO DateTime string
  validUntil: string; // ISO DateTime string
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableUsers?: string[];
  newUsersOnly?: boolean;
}

export interface UpdateCouponInput {
  id: string;
  name?: string;
  description?: string;
  discountValue?: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  userUsageLimit?: number;
  validFrom?: string; // ISO DateTime string
  validUntil?: string; // ISO DateTime string
  isActive?: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  applicableUsers?: string[];
  newUsersOnly?: boolean;
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsage: number;
  totalDiscountGiven: number;
  topCoupons: {
    code: string;
    name: string;
    usageCount: number;
    totalDiscount: number;
  }[];
}
