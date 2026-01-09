import { gql } from "@apollo/client";

export const GET_ACTIVE_PROMOTIONS = gql`
  query GetActivePromotions {
    getPromotions {
      id
      name
      discountType
      discountValue
      startDate
      endDate
      isActive
      imageUrl
      promoCode
      status
    }
  }
`;
