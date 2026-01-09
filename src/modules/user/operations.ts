import { gql } from "@apollo/client";

export const GET_ADMIN_USERS = gql`
  query GetAdminUsers {
    adminUsers {
      id
      firstName
      lastName
      email
      phoneNumber
      createdAt
      role
      stats {
        totalOrders
        totalSpent
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      firstName
      lastName
      email
      role
      createdAt
      status
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: Role!) {
    updateUserRole(id: $id, role: $role) {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
