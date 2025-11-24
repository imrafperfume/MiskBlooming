import { gql } from "@apollo/client";

export const SystemTypeDefs = gql`
  type SystemSetting {
    id: ID!
    theme: String!
    layoutStyle: String!
    updatedAt: String!
  }

  type Query {
    getSystemSetting: SystemSetting!
  }

  type Mutation {
    updateSystemTheme(theme: String!): SystemSetting!
  }
`;
