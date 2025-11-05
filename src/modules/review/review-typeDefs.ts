import { gql } from "@apollo/client";

export const ReviewTypeDefs = gql`
  # type User {
  #   id: ID!
  #   name: String!
  #   email: String!
  #   emailVerified: String!
  # }
  type Review {
    id: ID!
    userId: String!
    productId: String!
    rating: Int!
    comment: String!
    createdAt: String
    updatedAt: String
    user: User!
  }

  input ReviewCreate {
    userId: String!
    productId: String!
    rating: Int!
    comment: String!
    slug: String!
  }

  type Query {
    reviews: [Review!]!
  }

  type Mutation {
    createReview(data: ReviewCreate!): Review!
  }
`;
