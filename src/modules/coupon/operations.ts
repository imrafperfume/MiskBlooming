import { gql } from "@apollo/client";

export const VALIDATE_COUPON = gql`
  query ValidateCoupon($code: String!, $orderAmount: Float!, $userId: String, $email: String) {
    validateCoupon(code: $code, orderAmount: $orderAmount, userId: $userId, email: $email) {
      isValid
      coupon {
        id
        code
        name
        description
        discountType
        discountValue
        minimumAmount
        maximumDiscount
        usageLimit
        usageCount
        userUsageLimit
        validFrom
        validUntil
        isActive
        applicableProducts
        applicableCategories
        applicableUsers
        newUsersOnly
      }
      discountAmount
      error
    }
  }
`;

export const GET_ALL_COUPONS = gql`
  query GetAllCoupons {
    allCoupons {
      id
      code
      name
      description
      discountType
      discountValue
      minimumAmount
      maximumDiscount
      usageLimit
      usageCount
      userUsageLimit
      validFrom
      validUntil
      isActive
      applicableProducts
      applicableCategories
      applicableUsers
      newUsersOnly
      createdAt
      updatedAt
      createdBy
    }
  }
`;

export const GET_COUPON_BY_ID = gql`
  query GetCouponById($id: ID!) {
    couponById(id: $id) {
      id
      code
      name
      description
      discountType
      discountValue
      minimumAmount
      maximumDiscount
      usageLimit
      usageCount
      userUsageLimit
      validFrom
      validUntil
      isActive
      applicableProducts
      applicableCategories
      applicableUsers
      newUsersOnly
      createdAt
      updatedAt
      createdBy
      usages {
        id
        orderId
        userId
        email
        discountAmount
        orderAmount
        usedAt
        order {
          id
          firstName
          lastName
          email
          totalAmount
          status
        }
      }
    }
  }
`;

export const GET_COUPON_STATS = gql`
  query GetCouponStats {
    couponStats {
      totalCoupons
      activeCoupons
      expiredCoupons
      totalUsage
      totalDiscountGiven
      topCoupons {
        code
        name
        usageCount
        totalDiscount
      }
    }
  }
`;

export const CREATE_COUPON = gql`
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      id
      code
      name
      description
      discountType
      discountValue
      minimumAmount
      maximumDiscount
      usageLimit
      userUsageLimit
      validFrom
      validUntil
      isActive
      applicableProducts
      applicableCategories
      applicableUsers
      newUsersOnly
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COUPON = gql`
  mutation UpdateCoupon($input: UpdateCouponInput!) {
    updateCoupon(input: $input) {
      id
      code
      name
      description
      discountType
      discountValue
      minimumAmount
      maximumDiscount
      usageLimit
      userUsageLimit
      validFrom
      validUntil
      isActive
      applicableProducts
      applicableCategories
      applicableUsers
      newUsersOnly
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COUPON = gql`
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id)
  }
`;

export const TOGGLE_COUPON_STATUS = gql`
  mutation ToggleCouponStatus($id: ID!) {
    toggleCouponStatus(id: $id) {
      id
      code
      name
      isActive
    }
  }
`;
