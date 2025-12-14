import { gql } from "@apollo/client";

export type HomeContentFormData = {
  categoryTitle: string;
  categoryDesc: string;
  featureTitle: string;
  featureSubtitle: string;
  featureDesc: string;
  seasonTitle: string;
  seasonSubtitle: string;
  seasonDesc: string;
  excellenceTitle: string;
  excellenceSubtitle: string;
  testimonialTitle: string;
  testimonialDesc: string;
  newsletterTitle: string;
  newsletterDesc: string;
};

export const ManagementTypeDefs = gql`
  type HomePageContent {
    id: ID!
    categoryTitle: String!
    categoryDesc: String!
    featureTitle: String!
    featureSubtitle: String!
    featureDesc: String!
    seasonTitle: String!
    seasonSubtitle: String!
    seasonDesc: String!
    excellenceTitle: String!
    excellenceSubtitle: String!
    testimonialTitle: String!
    testimonialDesc: String!
    newsletterTitle: String!
    newsletterDesc: String!
  }

  input HomePageContentInput {
    categoryTitle: String!
    categoryDesc: String!
    featureTitle: String!
    featureSubtitle: String!
    featureDesc: String!
    seasonTitle: String!
    seasonSubtitle: String!
    seasonDesc: String!
    excellenceTitle: String!
    excellenceSubtitle: String!
    testimonialTitle: String!
    testimonialDesc: String!
    newsletterTitle: String!
    newsletterDesc: String!
  }
  type Query {
    getHomePageContent: HomePageContent!
  }
  type Mutation {
    updateHomePageContent(input: HomePageContentInput!): HomePageContent!
  }
`;
