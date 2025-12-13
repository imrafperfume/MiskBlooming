import { gql } from "@apollo/client";

export const HeroTypeDefs = gql`
  type HeroSlide {
    id: ID!
    title: String!
    subtitle: String
    description: String
    imageUrl: String!
    buttonText: String
    buttonLink: String
    order: Int!
    layoutStyle: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    heroSlides: [HeroSlide!]!
  }

  type Mutation {
    createHeroSlide(
      title: String!
      subtitle: String
      description: String
      imageUrl: String!
      buttonText: String
      buttonLink: String
      order: Int
      layoutStyle: String
    ): HeroSlide!

    updateHeroSlide(
      id: ID!
      title: String
      subtitle: String
      description: String
      imageUrl: String
      buttonText: String
      buttonLink: String
      order: Int
      layoutStyle: String
    ): HeroSlide!

    deleteHeroSlide(id: ID!): Boolean!
  }
`;
