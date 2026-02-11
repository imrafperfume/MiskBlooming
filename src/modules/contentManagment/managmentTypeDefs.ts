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
  heroSlides?: any;
  stats?: any;
  testimonials?: any;
};

export const ManagementTypeDefs = gql`
  scalar JSON

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
    heroSlides: JSON
    stats: JSON
    testimonials: JSON
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
    heroSlides: JSON
    stats: JSON
    testimonials: JSON
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
    updateAboutPageContent(input: AboutPageInput!): AboutPageContent!
    updateContactPageContent(input: ContactPageInput!): ContactPageContent!
  }

  type AboutPageContent {
    id: ID!
    heroTitle: String!
    heroDesc: String!
    heroImage: String
    storyTitle: String!
    storyDesc1: String!
    storyDesc2: String!
    storyImage: String
    stats: JSON!
    values: JSON!
    team: JSON!
  }

  input AboutPageInput {
    heroTitle: String!
    heroDesc: String!
    heroImage: String
    storyTitle: String!
    storyDesc1: String!
    storyDesc2: String!
    storyImage: String
    stats: JSON!
    values: JSON!
    team: JSON!
  }

  type ContactPageContent {
    id: ID!
    heroTitle: String!
    heroDesc: String!
    heroImage: String
    mapEmbedUrl: String
    contactInfo: JSON!
  }

  input ContactPageInput {
    heroTitle: String!
    heroDesc: String!
    heroImage: String
    mapEmbedUrl: String
    contactInfo: JSON!
  }

  extend type Query {
    getAboutPageContent: AboutPageContent!
    getContactPageContent: ContactPageContent!
  }
`;
