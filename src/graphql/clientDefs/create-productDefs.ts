import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $id: String!
    $name: String!
    $slug: String!
    $description: String!
    $shortDescription: String!
    $category: String!
    $subcategory: String!
    $tags: [String!]!
    $price: Float!
    $compareAtPrice: Float!
    $costPerItem: Float!
    $sku: String
    $barcode: String
    $trackQuantity: Boolean!
    $quantity: Int!
    $lowStockThreshold: Int!
    $requiresShipping: Boolean!
    $featuredImage: Int!
    $seoTitle: String!
    $seoDescription: String!
    $seoKeywords: [String!]!
    $status: ProductStatus!
    $featured: Boolean!
    $deliveryZones: [String!]!
    $deliveryTime: String!
    $freeDeliveryThreshold: Float!
    $giftWrapping: Boolean!
    $personalization: Boolean!
    $careInstructions: String
    $occasions: [String!]!
    $images: [CloudinaryImageInput!]!
    $dimensions: ProductDimensionInput
  ) {
    createProduct(
      id: $id
      name: $name
      slug: $slug
      description: $description
      shortDescription: $shortDescription
      category: $category
      subcategory: $subcategory
      tags: $tags
      price: $price
      compareAtPrice: $compareAtPrice
      costPerItem: $costPerItem
      sku: $sku
      barcode: $barcode
      trackQuantity: $trackQuantity
      quantity: $quantity
      lowStockThreshold: $lowStockThreshold
      requiresShipping: $requiresShipping
      featuredImage: $featuredImage
      seoTitle: $seoTitle
      seoDescription: $seoDescription
      seoKeywords: $seoKeywords
      status: $status
      featured: $featured
      deliveryZones: $deliveryZones
      deliveryTime: $deliveryTime
      freeDeliveryThreshold: $freeDeliveryThreshold
      giftWrapping: $giftWrapping
      personalization: $personalization
      careInstructions: $careInstructions
      occasions: $occasions
      images: $images
      dimensions: $dimensions
    ) {
      id
      name
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductById($slug: String!) {
    productById(slug: $slug) {
      id
      name
      slug
      description
      shortDescription
      category
      subcategory
      tags
      price
      compareAtPrice
      costPerItem
      sku
      barcode
      trackQuantity
      quantity
      lowStockThreshold
      requiresShipping
      dimensions {
        weight
        length
        width
        height
      }
      images {
        url
        publicId
      }
      featuredImage
      seoTitle
      seoDescription
      seoKeywords
      status
      featured
      deliveryZones
      deliveryTime
      freeDeliveryThreshold
      giftWrapping
      personalization
      careInstructions
      occasions
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($slug: String!, $data: ProductInput!) {
    updateProduct(slug: $slug, data: $data) {
      id
      name
      slug
      description
      shortDescription
      category
      subcategory
      tags
      price
      compareAtPrice
      costPerItem
      sku
      barcode
      trackQuantity
      quantity
      lowStockThreshold
      requiresShipping
      dimensions {
        weight
        length
        width
        height
      }
      images {
        url
        publicId
      }
      featuredImage
      seoTitle
      seoDescription
      seoKeywords
      status
      featured
      deliveryZones
      deliveryTime
      freeDeliveryThreshold
      giftWrapping
      personalization
      careInstructions
      occasions
    }
  }
`;
