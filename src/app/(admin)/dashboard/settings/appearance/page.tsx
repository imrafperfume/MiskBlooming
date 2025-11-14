"use client";
import { useQuery, useMutation } from "@apollo/client";
import Button from "@/src/components/ui/Button";
import {
  GET_SYSTEM_SETTING,
  UPDATE_SYSTEM_THEME,
} from "@/src/modules/system/operation";
import { toast } from "sonner";

export default function ThemeManagement() {
  const { data, loading } = useQuery(GET_SYSTEM_SETTING);
  const [updateSystemTheme] = useMutation(UPDATE_SYSTEM_THEME, {
    refetchQueries: [{ query: GET_SYSTEM_SETTING }],
  });

  if (loading) return <div>Loading...</div>;
  const currentTheme = data?.getSystemSetting.theme;
  console.log("🚀 ~ ThemeManagement ~ currentTheme:", currentTheme);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    updateSystemTheme({ variables: { theme: newTheme } });

    toast.success("Theme Update Successfull");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">System Theme</h2>
      <p className="mb-4">Current theme: {currentTheme}</p>
      <Button onClick={toggleTheme}>
        Switch to {currentTheme === "light" ? "Dark Luxury" : "White Regular"}
      </Button>
    </div>
  );
}
