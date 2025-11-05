import { gql } from "@apollo/client";

export const GET_REVIEWS = gql`
  query GetReviews {
    reviews {
      id
      rating
      comment
      user {
        firstName
        lastName
        emailVerified
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($data: ReviewCreate!) {
    createReview(data: $data) {
      id
    }
  }
`;
