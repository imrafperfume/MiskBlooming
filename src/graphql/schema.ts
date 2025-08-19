import { gql } from "graphql-tag"
import { resolvers as queryResolvers } from "./resolvers/query"
import { resolvers as mutationResolvers } from "./resolvers/mutation"



export const typeDefs = gql`
  enum ProductStatus {
    DRAFT
    ACTIVE
    ARCHIVED
  }

  type ProductDimension {
    length: Float!
    width: Float!
    height: Float!
  }

  type CloudinaryImage {
    publicId: String!
    url: String!
    width: Float!
    height: Float!
  }

  type Product {
    id: ID!
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

  type Query {
    products: [Product!]!
    product(slug: String!): Product
  }

  type Mutation {
    createProduct(
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
      requiresShipping: Boolean!
      weight: Float
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
  }
`



export const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
}