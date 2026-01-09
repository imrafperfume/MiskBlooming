import { gql } from "graphql-tag";

export const footerTypeDefs = gql`
  type FooterLinkResult {
    name: String
    href: String
  }

  type FooterSectionResult {
    title: String
    links: [FooterLinkResult]
  }

  type FooterContent {
    id: String
    brandDesc: String
    phone: String
    email: String
    address: String
    facebook: String
    instagram: String
    twitter: String
    newsletterTitle: String
    newsletterDesc: String
    copyrightText: String
    footerLinks: [FooterSectionResult]
  }

  input FooterLinkInput {
    name: String!
    href: String!
  }

  input FooterSectionInput {
    title: String!
    links: [FooterLinkInput]!
  }

  input UpdateFooterContentInput {
    brandDesc: String
    phone: String
    email: String
    address: String
    facebook: String
    instagram: String
    twitter: String
    newsletterTitle: String
    newsletterDesc: String
    copyrightText: String
    footerLinks: [FooterSectionInput]
  }

  extend type Query {
    getFooterContent: FooterContent
  }

  extend type Mutation {
    updateFooterContent(input: UpdateFooterContentInput!): FooterContent
  }
`;
