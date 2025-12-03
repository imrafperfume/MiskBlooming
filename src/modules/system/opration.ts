import { gql } from "@apollo/client";

// 1. Query to fetch settings on page load
export const GET_STORE_SETTINGS = gql`
  query GetStoreSettings {
    getStoreSettings {
      id
      storeName
      description
      logoUrl

      # Contact
      supportEmail
      phoneNumber

      # Regional
      currency
      timezone
      address
      vatRate

      # Delivery Logic
      deliveryMethod
      deliveryFlatRate
      freeShippingThreshold
      codFee
      isExpressEnabled
      expressDeliveryFee
      isScheduledEnabled
      scheduledDeliveryFee
      # Granular Rates (Must request sub-fields)
      deliveryEmirates {
        abu_dhabi
        dubai
        sharjah
        ajman
        umm_al_quwain
        ras_al_khaimah
        fujairah
      }
    }
  }
`;

// 2. Mutation to save changes

export const CREATE_STORE = gql`
  mutation CreateStore($input: UpdateStoreSettingsInput!) {
    createStoreSettings(input: $input) {
      id
      storeName
      # ... request other fields you need back
    }
  }
`;

export const UPDATE_STORE_SETTINGS = gql`
  mutation UpdateStoreSettings($input: UpdateStoreSettingsInput!) {
    updateStoreSettings(input: $input) {
      id
      storeName
      logoUrl
      supportEmail
      phoneNumber
      currency
      timezone
      address
      vatRate
      deliveryMethod
      deliveryFlatRate
      freeShippingThreshold
      deliveryEmirates {
        abu_dhabi
        dubai
        sharjah
        ajman
        umm_al_quwain
        ras_al_khaimah
        fujairah
      }
    }
  }
`;
