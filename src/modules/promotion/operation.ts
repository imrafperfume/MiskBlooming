import { gql } from "@apollo/client";

export const GET_PROMOTIONS = gql`
  query GetPromotions {
    getPromotions {
      id
      name
      discountType
      discountValue
      startDate
      endDate
      isActive
      imageUrl
      scope
      promoCode
      status
      categories
      products
      createdAt
    }
  }
`;

export const GET_PROMOTION_BY_ID = gql`
  query GetPromotionById($id: ID!) {
    getPromotionById(id: $id) {
      id
      name
      discountType
      discountValue
      startDate
      endDate
      isActive
      imageUrl
      scope
      promoCode
      status
      categories
      products
      createdAt
    }
  }
`;
export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($input: CreatePromotionInput!) {
    createPromotion(input: $input) {
      id
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: ID!, $input: UpdatePromotionInput!) {
    updatePromotion(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: ID!) {
    deletePromotion(id: $id)
  }
`;
