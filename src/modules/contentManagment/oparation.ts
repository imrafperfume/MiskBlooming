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
    }
  }
`;

export const UPDATE_HOMEPAGECONTENT = gql`
  mutation UpdateHomePageContent($input: HomePageContentInput!) {
    updateHomePageContent(input: $input) {
      id
    }
  }
`;
