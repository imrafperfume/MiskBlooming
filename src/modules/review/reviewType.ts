import { gql } from "@apollo/client";

export const GET_REVIEWS = gql`
  query GetReviews($id: String!) {
    reviews(id: $id) {
      id
      rating
      comment
      user {
        name
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
