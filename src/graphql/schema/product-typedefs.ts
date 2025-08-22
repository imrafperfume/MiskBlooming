import { gql } from "@apollo/client";

export const ProductTypeDefs = gql`
  enum ProductStatus {
    draft
    active
    archived
  }

  input ProductDimensionInput {
    weight: Float!
    length: Float!
    width: Float!
    height: Float!
  }

  type ProductDimension {
    weight: Float!
    length: Float!
    width: Float!
    height: Float!
  }

  type CloudinaryImage {
    publicId: String!
    url: String!
  }

  input CloudinaryImageInput {
    publicId: String!
    url: String!
  }

  type Product {
    id: String!
    createdAt: String!
    updatedAt: String!

    # Basic Information
    name: String!
    slug: String!
    description: String!
    shortDescription: String!
    category: String!
    subcategory: String!
    tags: [String!]!

    # Pricing
    price: Float!
    compareAtPrice: Float!
    costPerItem: Float!

    # Inventory
    sku: String
    barcode: String
    trackQuantity: Boolean!
    quantity: Int!
    lowStockThreshold: Int!

    # Shipping
    requiresShipping: Boolean!
    weight: Float
    dimensions: ProductDimension

    # Images
    images: [CloudinaryImage!]!
    featuredImage: Int!

    # SEO
    seoTitle: String!
    seoDescription: String!
    seoKeywords: [String!]!

    # Status
    status: ProductStatus!
    featured: Boolean!

    # Delivery
    deliveryZones: [String!]!
    deliveryTime: String!
    freeDeliveryThreshold: Float!

    # Product Features
    giftWrapping: Boolean!
    personalization: Boolean!
    careInstructions: String
    occasions: [String!]!
  }

  input ProductInput {
    # Basic Information
    name: String
    slug: String
    description: String
    shortDescription: String
    category: String
    subcategory: String
    tags: [String!]

    # Pricing
    price: Float
    compareAtPrice: Float
    costPerItem: Float

    # Inventory
    sku: String
    barcode: String
    trackQuantity: Boolean
    quantity: Int
    lowStockThreshold: Int

    # Shipping
    requiresShipping: Boolean
    weight: Float
    dimensions: ProductDimensionInput

    # Images
    images: [CloudinaryImageInput!]
    featuredImage: Int

    # SEO
    seoTitle: String
    seoDescription: String
    seoKeywords: [String!]

    # Status
    status: ProductStatus
    featured: Boolean

    # Delivery
    deliveryZones: [String!]
    deliveryTime: String
    freeDeliveryThreshold: Float

    # Product Features
    giftWrapping: Boolean
    personalization: Boolean
    careInstructions: String
    occasions: [String!]
  }

  type Query {
    products: [Product!]!
    productById(slug: String!): Product
  }

  type Mutation {
    createProduct(
      id: String!
      name: String!
      slug: String!
      description: String!
      shortDescription: String!
      category: String!
      subcategory: String!
      tags: [String!]!
      price: Float!
      compareAtPrice: Float!
      costPerItem: Float!
      sku: String
      barcode: String
      trackQuantity: Boolean!
      quantity: Int!
      lowStockThreshold: Int!
      images: [CloudinaryImageInput!]!
      requiresShipping: Boolean!
      dimensions: ProductDimensionInput
      featuredImage: Int!
      seoTitle: String!
      seoDescription: String!
      seoKeywords: [String!]!
      status: ProductStatus!
      featured: Boolean!
      deliveryZones: [String!]!
      deliveryTime: String!
      freeDeliveryThreshold: Float!
      giftWrapping: Boolean!
      personalization: Boolean!
      careInstructions: String
      occasions: [String!]!
    ): Product!

    updateProduct(slug: String!, data: ProductInput!): Product!
    deleteProduct(slug: String!): Product
  }
`;
