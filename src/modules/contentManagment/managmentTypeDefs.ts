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

  # //collection content type defs
  type Collection {
    id: ID!
    collectionTitle: String!
    collectionDesc: String!
  }
  input CollectionInput {
    collectionTitle: String!
    collectionDesc: String!
  }

  type Query {
    getHomePageContent: HomePageContent!
    getCollectionContent: Collection!
  }
  type Mutation {
    updateHomePageContent(input: HomePageContentInput!): HomePageContent!
    updateCollectionContent(input: CollectionInput!): Collection!
  }
`;
