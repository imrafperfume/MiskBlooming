import { gql } from "@apollo/client";

export const USER_UPDATE = gql`
  mutation UpdateUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $email: String
    $phoneNumber: String
    $address: String
  ) {
    updateUser(
      id: $id
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
      address: $address
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      address
    }
  }
`;
