import { gql } from "@apollo/client";

export const GET_HOMPAGECONTENT = gql`
  query GetHomePageContent {
    getHomePageContent {
      id
      categoryTitle
      categoryDesc
      featureTitle
      featureSubtitle
      featureDesc
      seasonTitle
      seasonSubtitle
      seasonDesc
      excellenceTitle
      excellenceSubtitle
      testimonialTitle
      testimonialDesc
      newsletterTitle
      newsletterDesc
      heroSlides
      stats
      testimonials
    }
  }
`;

export const UPDATE_HOMEPAGECONTENT = gql`
  mutation UpdateHomePageContent($input: HomePageContentInput!) {
    updateHomePageContent(input: $input) {
      id
      heroSlides
      stats
      testimonials
    }
  }
`;
export const GET_COLLECTIONCONTENT = gql`
  query GetCollectionContent {
    getCollectionContent {
      id
      collectionTitle
      collectionDesc
    }
  }
`;

export const UPDATE_COLLECTIONCONTENT = gql`
  mutation UpdateCollectionContent($input: CollectionInput!) {
    updateCollectionContent(input: $input) {
      id
    }
  }
`;

export const GET_ABOUTCONTENT = gql`
  query GetAboutPageContent {
    getAboutPageContent {
      id
      heroTitle
      heroDesc
      heroImage
      storyTitle
      storyDesc1
      storyDesc2
      storyImage
      stats
      values
      team
    }
  }
`;

export const UPDATE_ABOUTCONTENT = gql`
  mutation UpdateAboutPageContent($input: AboutPageInput!) {
    updateAboutPageContent(input: $input) {
      id
      heroTitle
      heroDesc
      heroImage
      storyTitle
      storyDesc1
      storyDesc2
      storyImage
      stats
      values
      team
    }
  }
`;

export const GET_CONTACTCONTENT = gql`
  query GetContactPageContent {
    getContactPageContent {
      id
      heroTitle
      heroDesc
      heroImage
      contactInfo
    }
  }
`;

export const UPDATE_CONTACTCONTENT = gql`
  mutation UpdateContactPageContent($input: ContactPageInput!) {
    updateContactPageContent(input: $input) {
      id
      heroTitle
      heroDesc
      heroImage
      contactInfo
    }
  }
`;
