import { useQuery } from "@apollo/client";
import { GET_SYSTEM_SETTING } from "../modules/system/operation";

export function useSystemTheme() {
  const { data, loading } = useQuery(GET_SYSTEM_SETTING);
  return {
    theme: data?.getSystemSetting.theme || "light",
    loading,
  };
}
