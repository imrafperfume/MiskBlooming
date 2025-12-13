import HomeSection from "@/src/components/dashboard/themes/HomeSection";
import React from "react";

export default function ThemeManagment() {
  return (
    <div className="text-foreground">
      <div>
        <h1 className="text-display-md text-foreground">Theme Managment</h1>
        <p className="text-primary">Manage your page content here</p>
      </div>
      <div className="mt-10 space-y-6">
        <HomeSection />
      </div>
    </div>
  );
}
