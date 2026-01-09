import { gql } from "graphql-tag";

export const membershipTypeDefs = gql`
  scalar DateTime

  enum MembershipType {
    Mmbebr
    VIP
    PREMIUM
    GOLD
    PLATINUM
  }

  type MembershipCard {
    id: ID!
    cardNumber: String!
    cardHolderName: String!
    expirationDate: DateTime!
    membershipType: MembershipType!
    user: User
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateMembershipCardInput {
    email: String!
    cardNumber: String!
    cardHolderName: String!
    expirationDate: DateTime!
    membershipType: MembershipType!
  }

  input UpdateMembershipCardInput {
    id: ID!
    cardNumber: String
    cardHolderName: String
    expirationDate: DateTime
    membershipType: MembershipType
  }

  extend type Query {
    membershipCards: [MembershipCard]
    membershipCard(id: ID!): MembershipCard
    userMembershipCard(userId: String!): MembershipCard
  }

  extend type Mutation {
    createMembershipCard(input: CreateMembershipCardInput!): MembershipCard
    updateMembershipCard(input: UpdateMembershipCardInput!): MembershipCard
    deleteMembershipCard(id: ID!): MembershipCard
    sendMembershipCard(id: ID!): Boolean
  }
`;
