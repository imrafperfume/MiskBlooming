import { gql } from "@apollo/client";

export const SubscribeTypeDefs = gql`
  type Subscribe {
    id: ID!
    email: String!
  }

  input SubscribeInput {
    email: String!
  }

  type Query {
    getSubscriber: Subscribe
  }
  type Mutation {
    createSubscriber(input: SubscribeInput!): Subscribe!
    updateSubscriber(input: SubscribeInput!): Subscribe!
  }
`;
