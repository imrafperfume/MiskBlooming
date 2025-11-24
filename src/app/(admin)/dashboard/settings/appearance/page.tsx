"use client";

import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  Palette,
  Check,
  Loader2,
  AlertCircle,
  LayoutTemplate,
  BoxSelect,
  Maximize,
} from "lucide-react";
import {
  GET_SYSTEM_SETTING,
  UPDATE_SYSTEM_LAYOUT,
  UPDATE_SYSTEM_THEME,
} from "@/src/modules/system/operation";

// --- Types & Constants ---

const THEME_OPTIONS = {
  LIGHT: "light",
  DARK: "dark",
} as const;

const LAYOUT_OPTIONS = {
  FULLSCREEN: "fullscreen",
  BOXED: "boxed",
} as const;

interface SystemSetting {
  id: string;
  theme: (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];
  layoutStyle: (typeof LAYOUT_OPTIONS)[keyof typeof LAYOUT_OPTIONS];
}

interface GetSystemSettingData {
  getSystemSetting: SystemSetting;
}

export default function ThemeManagement() {
  // 1. Fetch current settings
  const { data, loading, error } = useQuery<GetSystemSettingData>(
    GET_SYSTEM_SETTING,
    {
      fetchPolicy: "cache-and-network", // Ensure fresh data on mount
    }
  );

  // 2. Define Theme Mutation
  const [updateSystemTheme, { loading: updatingTheme }] = useMutation(
    UPDATE_SYSTEM_THEME,
    {
      refetchQueries: [{ query: GET_SYSTEM_SETTING }],
      onCompleted: () => toast.success("Theme updated successfully"),
      onError: (err) => toast.error(err.message || "Failed to update theme"),
    }
  );

  // 3. Define Layout Mutation
  const [updateSystemLayout, { loading: updatingLayout }] = useMutation(
    UPDATE_SYSTEM_LAYOUT,
    {
      refetchQueries: [{ query: GET_SYSTEM_SETTING }],
      onCompleted: () => toast.success("Layout updated successfully"),
      onError: (err) => toast.error(err.message || "Failed to update layout"),
    }
  );

  // 4. Derive current state with fallbacks
  const currentTheme = data?.getSystemSetting?.theme || THEME_OPTIONS.LIGHT;
  const currentLayout =
    data?.getSystemSetting?.layoutStyle || LAYOUT_OPTIONS.FULLSCREEN;

  // 5. Handlers
  const handleThemeUpdate = async (value: string) => {
    if (currentTheme === value || updatingTheme) return;
    await updateSystemTheme({ variables: { theme: value } });
  };

  const handleLayoutUpdate = async (value: string) => {
    if (currentLayout === value || updatingLayout) return;
    await updateSystemLayout({ variables: { layoutStyle: value } });
  };

  // --- Loading State ---
  if (loading) {
    return <ThemeSettingsSkeleton />;
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <div>
          <h3 className="font-medium">Error loading settings</h3>
          <p className="text-sm opacity-90">
            {error.message || "Please try refreshing the page."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 pb-10">
      {/* ---------------- THEME SECTION ---------------- */}
      <section aria-labelledby="theme-heading">
        <div className="mb-5">
          <h2
            id="theme-heading"
            className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <Palette className="w-5 h-5 text-primary" />
            Color Theme
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Choose the color scheme for the admin dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <OptionCard
            title="Light Mode"
            description="Clean and crisp. Best for bright environments."
            isActive={currentTheme === THEME_OPTIONS.LIGHT}
            onClick={() => handleThemeUpdate(THEME_OPTIONS.LIGHT)}
            isUpdating={updatingTheme}
            icon={<Sun className="w-5 h-5" />}
          >
            {/* UI Preview: Light */}
            <div className="w-full h-24 rounded-lg bg-[#f3f4f6] border border-gray-200 p-2 overflow-hidden relative select-none">
              <div className="flex gap-2 mb-2 h-full">
                <div className="w-1/4 h-full bg-white rounded-sm shadow-sm border border-gray-100" />
                <div className="w-3/4 h-full space-y-1.5">
                  <div className="h-2 w-full bg-white rounded-sm shadow-sm" />
                  <div className="h-full w-full bg-white rounded-sm shadow-sm" />
                </div>
              </div>
            </div>
          </OptionCard>

          <OptionCard
            title="Dark Luxury"
            description="High contrast for focus and reduced eye strain."
            isActive={currentTheme === THEME_OPTIONS.DARK}
            onClick={() => handleThemeUpdate(THEME_OPTIONS.DARK)}
            isUpdating={updatingTheme}
            icon={<Moon className="w-5 h-5" />}
          >
            {/* UI Preview: Dark */}
            <div className="w-full h-24 rounded-lg bg-[#0f172a] border border-gray-800 p-2 overflow-hidden relative select-none">
              <div className="flex gap-2 mb-2 h-full">
                <div className="w-1/4 h-full bg-[#1e293b] rounded-sm border border-gray-700/50" />
                <div className="w-3/4 h-full space-y-1.5">
                  <div className="h-2 w-full bg-[#1e293b] rounded-sm" />
                  <div className="h-full w-full bg-[#1e293b] rounded-sm border border-gray-700/50" />
                </div>
              </div>
            </div>
          </OptionCard>
        </div>
      </section>

      <div className="h-px bg-border/60" role="separator" />

      {/* ---------------- LAYOUT SECTION ---------------- */}
      <section aria-labelledby="layout-heading">
        <div className="mb-5">
          <h2
            id="layout-heading"
            className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <LayoutTemplate className="w-5 h-5 text-primary" />
            Layout Strategy
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Define how content is constrained on large screens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <OptionCard
            title="Fullscreen Fluid"
            description="Content spans the entire width of the browser window."
            isActive={currentLayout === LAYOUT_OPTIONS.FULLSCREEN}
            onClick={() => handleLayoutUpdate(LAYOUT_OPTIONS.FULLSCREEN)}
            isUpdating={updatingLayout}
            icon={<Maximize className="w-5 h-5" />}
          >
            {/* UI Preview: Fullscreen */}
            <div className="w-full h-24 rounded-lg bg-muted/40 border border-border overflow-hidden relative select-none flex flex-col">
              <div className="h-3 w-full bg-background border-b border-border" />
              <div className="flex flex-1">
                <div className="w-10 border-r border-border bg-background" />
                <div className="flex-1 bg-muted/20 p-2">
                  <div className="w-full h-2 rounded bg-primary/20 mb-1"></div>
                  <div className="w-2/3 h-2 rounded bg-primary/10"></div>
                </div>
              </div>
            </div>
          </OptionCard>

          <OptionCard
            title="Boxed Container"
            description="Content is centered with maximum width (1440px)."
            isActive={currentLayout === LAYOUT_OPTIONS.BOXED}
            onClick={() => handleLayoutUpdate(LAYOUT_OPTIONS.BOXED)}
            isUpdating={updatingLayout}
            icon={<BoxSelect className="w-5 h-5" />}
          >
            {/* UI Preview: Boxed */}
            <div className="w-full h-24 rounded-lg bg-muted border border-border overflow-hidden relative select-none flex items-center justify-center p-2">
              <div className="h-full w-3/4 bg-background border border-border shadow-sm rounded-sm flex flex-col">
                <div className="h-3 w-full border-b border-border bg-muted/10" />
                <div className="flex flex-1">
                  <div className="w-6 border-r border-border" />
                  <div className="flex-1 p-1.5">
                    <div className="w-full h-1.5 rounded bg-primary/20 mb-1"></div>
                    <div className="w-1/2 h-1.5 rounded bg-primary/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </OptionCard>
        </div>
      </section>
    </div>
  );
}

// --- Sub-Components ---

function ThemeSettingsSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {[1, 2].map((section) => (
        <div key={section} className="space-y-5">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-[200px] bg-muted animate-pulse rounded-xl border border-border" />
            <div className="h-[200px] bg-muted animate-pulse rounded-xl border border-border" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface OptionCardProps {
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
  isUpdating: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function OptionCard({
  title,
  description,
  isActive,
  onClick,
  isUpdating,
  icon,
  children,
}: OptionCardProps) {
  // Logic to show loading only if THIS specific card triggered the update
  // or if global update is happening and this card is being selected.
  // For simplicity in this context, we show spinner on the active card if updating.
  const showLoading = isUpdating && isActive;

  return (
    <div
      onClick={isUpdating ? undefined : onClick}
      className={`
        relative group cursor-pointer rounded-xl border-2 transition-all duration-200 ease-in-out select-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
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
        if (!isUpdating && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Active Checkmark Badge */}
      {isActive && !showLoading && (
        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-1 shadow-sm ring-4 ring-background z-10 animate-in zoom-in duration-200">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Loading Overlay */}
      {showLoading && (
        <div className="absolute top-2 right-2 z-20">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
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
            className={`p-2 rounded-full shrink-0 transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {icon}
          </div>
          <div>
            <h3
              className={`font-semibold text-base transition-colors ${
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
