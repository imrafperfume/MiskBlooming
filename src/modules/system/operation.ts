import { gql } from "@apollo/client";

export const GET_SYSTEM_SETTING = gql`
  query GetSystemSetting {
    getSystemSetting {
      theme
      layoutStyle
    }
  }
`;

export const UPDATE_SYSTEM_THEME = gql`
  mutation updateTheme($theme: String!, $layoutStyle: String!) {
    updateSystemTheme(theme: $theme, layoutStyle: $layoutStyle) {
      theme
      layoutStyle
    }
  }
`;
