import { gql } from "@apollo/client";

export const settingTypeDefs = gql`
  enum DeliveryMethod {
    flat
    emirate
  }

  # 3. The "Json" field broken down into a concrete Type
  # This ensures you get autocomplete for specific emirates on the frontend
  type DeliveryEmirates {
    abu_dhabi: Float!
    dubai: Float!
    sharjah: Float!
    ajman: Float!
    umm_al_quwain: Float!
    ras_al_khaimah: Float!
    fujairah: Float!
  }

  # 4. The Main Store Settings Type
  type StoreSettings {
    id: ID!
    createdAt: String!
    updatedAt: String!

    # Profile
    storeName: String!
    description: String
    logoUrl: String

    # Contact
    supportEmail: String!
    phoneNumber: String!

    # Regional
    currency: String!
    timezone: String!
    address: String!

    # Financials (Mapped Decimal to Float for GraphQL)
    # Note: For strict financial precision, consider using a custom 'Decimal' scalar
    vatRate: Float!

    # Delivery Logic
    deliveryMethod: DeliveryMethod!
    deliveryFlatRate: Float!
    freeShippingThreshold: Float # Nullable because it might be disabled
    # Granular Rates (The JSON field)
    deliveryEmirates: DeliveryEmirates!
    codFee: Float!

    isExpressEnabled: Boolean!
    expressDeliveryFee: Float!

    isScheduledEnabled: Boolean!
    scheduledDeliveryFee: Float!
  }

  # 5. Inputs (For Mutations)

  input DeliveryEmiratesInput {
    abu_dhabi: Float!
    dubai: Float!
    sharjah: Float!
    ajman: Float!
    umm_al_quwain: Float!
    ras_al_khaimah: Float!
    fujairah: Float!
  }

  input UpdateStoreSettingsInput {
    storeName: String
    description: String
    logoUrl: String
    supportEmail: String
    phoneNumber: String
    currency: String
    timezone: String
    address: String
    vatRate: Float
    deliveryMethod: DeliveryMethod
    deliveryFlatRate: Float
    freeShippingThreshold: Float
    deliveryEmirates: DeliveryEmiratesInput
    codFee: Float
    isExpressEnabled: Boolean
    expressDeliveryFee: Float
    isScheduledEnabled: Boolean
    scheduledDeliveryFee: Float
  }

  # 6. Operations
  type Query {
    # Assuming you fetch the single store settings (perhaps based on context/auth)
    getStoreSettings: StoreSettings
  }

  type Mutation {
    createStoreSettings(input: UpdateStoreSettingsInput!): StoreSettings!
    updateStoreSettings(input: UpdateStoreSettingsInput!): StoreSettings!
  }
`;
