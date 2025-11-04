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
    ): HeroSlide!

    deleteHeroSlide(id: ID!): Boolean!
  }
`;
