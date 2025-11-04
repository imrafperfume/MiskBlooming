import { gql } from "@apollo/client";

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      imageUrl
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      imageUrl
    }
  }
`;
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CreateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
    }
  }
`;
export const CREATE_SUB_CATEGORY = gql`
  mutation CreateSubCategory($input: CreateSubcategoryInput!) {
    createSubCategory(input: $input) {
      id
    }
  }
`;

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories {
    subcategories {
      id
      name
      categoryId
    }
  }
`;

export const UPDATE_SUB_CATEGORY = gql`
  mutation UpdateSubCategory($id: ID!, $input: CreateSubcategoryInput!) {
    updateSubCategory(id: $id, input: $input) {
      id
    }
  }
`;

export const DELETE_SUB_CATEGORY = gql`
  mutation DeleteSubCategory($id: ID!) {
    deleteSubCategory(id: $id)
  }
`;
export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
