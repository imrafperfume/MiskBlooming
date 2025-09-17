import { gql } from "@apollo/client";

export const CategoryTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    imageUrl: String
    subcategories: [Subcategory!]!
    createdAt: String!
    updatedAt: String!
  }
  type Subcategory {
    id: ID!
    name: String!
    categoryId: ID!
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  input CreateCategoryInput {
    id: ID
    name: String!
    description: String
    imageUrl: String
    subcategories: [CreateSubcategoryInput!]
  }
  input CreateSubcategoryInput {
    id: ID
    name: String!
    categoryId: ID!
    category: CreateCategoryInput
  }

  type Query {
    categories: [Category!]!
    category(id: ID!): Category
    subcategories: [Subcategory!]!
    subcategory(id: ID!): Subcategory
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: CreateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    createSubCategory(input: CreateSubcategoryInput!): Subcategory!
    updateSubCategory(id: ID!, input: CreateSubcategoryInput!): Subcategory!
    deleteSubCategory(id: ID!): Boolean!
  }
`;
