import { gql } from "@apollo/client";

export const GET_SYSTEM_SETTING = gql`
  query GetSystemSetting {
    getSystemSetting {
      theme
    }
  }
`;

export const UPDATE_SYSTEM_THEME = gql`
  mutation updateTheme($theme: String!) {
    updateSystemTheme(theme: $theme) {
      theme
    }
  }
`;
