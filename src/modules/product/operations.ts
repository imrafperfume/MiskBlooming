import { gql } from "@apollo/client";

// --------------------
// CREATE PRODUCT
// --------------------
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: ProductInput!) {
    createProduct(data: $data) {
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

// --------------------
// GET PRODUCT BY SLUG
// --------------------
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
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
      hasVariants
      variantOptions {
        id
        name
        values
      }
    }
  }
`;

// --------------------
// UPDATE PRODUCT
// --------------------
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

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      images {
        url
      }
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_SITEMAP = `
  query GetProducts {
    products(where: {}) {
      id
      slug
      updatedAt
    }
  }
`;
