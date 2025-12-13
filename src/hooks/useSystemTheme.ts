import { useQuery } from "@apollo/client";
import { GET_SYSTEM_SETTING } from "../modules/theme/operation";

export function useSystemTheme() {
  const { data, loading } = useQuery(GET_SYSTEM_SETTING);
  const theme = data?.getSystemSetting.theme;
  return {
    theme: theme,
    loading,
  };
}
