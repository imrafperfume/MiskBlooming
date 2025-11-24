"use client";

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_SYSTEM_SETTING,
  UPDATE_SYSTEM_THEME,
} from "@/src/modules/system/operation";
import { toast } from "sonner";
import { Sun, Moon, Palette, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/src/lib/utils"; // Assuming you have a standard cn utility, or remove if not.

export default function ThemeManagement() {
  const { data, loading, error } = useQuery(GET_SYSTEM_SETTING);

  const [updateSystemTheme, { loading: updating }] = useMutation(
    UPDATE_SYSTEM_THEME,
    {
      refetchQueries: [{ query: GET_SYSTEM_SETTING }],
      onCompleted: () => {
        toast.success("System theme updated successfully");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to update theme");
      },
    }
  );

  const currentTheme = data?.getSystemSetting?.theme || "light";

  const handleThemeChange = (newTheme: string) => {
    if (currentTheme === newTheme) return;
    updateSystemTheme({ variables: { theme: newTheme } });
  };

  // --- Loading State (Skeleton) ---
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-40 bg-muted animate-pulse rounded-xl border border-border" />
          <div className="h-40 bg-muted animate-pulse rounded-xl border border-border" />
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <div>
          <h3 className="font-medium">Error loading settings</h3>
          <p className="text-sm opacity-90">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Palette className="w-6 h-6 text-primary" />
          Appearance
        </h2>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Customize how the admin dashboard looks and feels.
        </p>
      </div>

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Light Mode Card */}
        <ThemeCard
          title="Light Mode"
          description="Clean and crisp. Best for bright environments."
          isActive={currentTheme === "light"}
          onClick={() => handleThemeChange("light")}
          isUpdating={updating && currentTheme !== "light"} // Show spinner if we are switching TO this
          icon={<Sun className="w-5 h-5" />}
        >
          {/* Mini UI Preview for Light Mode */}
          <div className="w-full h-24 rounded-lg bg-[#f3f4f6] border border-gray-200 p-2 overflow-hidden relative select-none">
            <div className="flex gap-2 mb-2">
              <div className="w-1/4 h-full bg-white rounded-sm shadow-sm border border-gray-100/50" />
              <div className="w-3/4 h-full space-y-1.5">
                <div className="h-2 w-full bg-white rounded-sm shadow-sm" />
                <div className="h-8 w-full bg-white rounded-sm shadow-sm" />
                <div className="h-8 w-full bg-white rounded-sm shadow-sm" />
              </div>
            </div>
          </div>
        </ThemeCard>

        {/* Dark Mode Card */}
        <ThemeCard
          title="Dark Luxury"
          description="Easy on the eyes. High contrast for focus."
          isActive={currentTheme === "dark"}
          onClick={() => handleThemeChange("dark")}
          isUpdating={updating && currentTheme !== "dark"}
          icon={<Moon className="w-5 h-5" />}
        >
          {/* Mini UI Preview for Dark Mode */}
          <div className="w-full h-24 rounded-lg bg-[#0f172a] border border-gray-800 p-2 overflow-hidden relative select-none">
            <div className="flex gap-2 mb-2">
              <div className="w-1/4 h-full bg-[#1e293b] rounded-sm border border-gray-700/50" />
              <div className="w-3/4 h-full space-y-1.5">
                <div className="h-2 w-full bg-[#1e293b] rounded-sm" />
                <div className="h-8 w-full bg-[#1e293b] rounded-sm border border-gray-700/50" />
                <div className="h-8 w-full bg-[#1e293b] rounded-sm border border-gray-700/50" />
              </div>
            </div>
          </div>
        </ThemeCard>
      </div>
    </div>
  );
}

// --- Reusable Card Component ---

interface ThemeCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  isUpdating: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ThemeCard({
  title,
  description,
  isActive,
  onClick,
  isUpdating,
  icon,
  children,
}: ThemeCardProps) {
  return (
    <div
      onClick={isUpdating ? undefined : onClick}
      className={`
        relative group cursor-pointer rounded-xl border-2 transition-all duration-200 ease-in-out
        ${
          isActive
            ? "border-primary bg-primary/5 shadow-md"
            : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
        }
        ${isUpdating ? "opacity-70 cursor-wait" : ""}
      `}
      role="radio"
      aria-checked={isActive}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Active Checkmark Badge */}
      {isActive && (
        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-sm ring-4 ring-background z-10 animate-in zoom-in duration-200">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 rounded-xl backdrop-blur-[1px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      <div className="p-5">
        {/* The Mini UI Preview */}
        <div className="mb-4 shadow-sm transition-transform group-hover:scale-[1.02] duration-300">
          {children}
        </div>

        {/* Content Info */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {icon}
          </div>
          <div>
            <h3
              className={`font-semibold text-base ${
                isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
