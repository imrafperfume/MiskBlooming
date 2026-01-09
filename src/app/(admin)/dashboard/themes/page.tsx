"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Home, Image as ImageIcon, Info, Phone, Palette, PanelBottom } from "lucide-react";
import AboutSection from "@/src/components/dashboard/themes/AboutSection";
import ContactSection from "@/src/components/dashboard/themes/ContactSection";
import CollectionPage from "@/src/components/dashboard/themes/CollectionPage";
import HomeSection from "@/src/components/dashboard/themes/HomeSection";
import { FooterSettingsForm } from "@/src/components/dashboard/settings/FooterSettingsForm";

export default function ThemeManagement() {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home Page", icon: Home, component: <HomeSection /> },
    { id: "collection", label: "Collections", icon: ImageIcon, component: <CollectionPage /> },
    { id: "about", label: "About Page", icon: Info, component: <AboutSection /> },
    { id: "contact", label: "Contact Page", icon: Phone, component: <ContactSection /> },
    { id: "footer", label: "Footer", icon: PanelBottom, component: <FooterSettingsForm /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Theme Management</h1>
        <p className="text-muted-foreground">Customize the look and content of your storefront.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Tabs Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
           <div className="bg-card rounded-xl border border-border p-2 space-y-1 sticky top-6">
             {tabs.map((tab) => {
               const isActive = activeTab === tab.id;
               return (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                     isActive
                       ? "bg-primary/10 text-primary shadow-sm"
                       : "text-muted-foreground hover:bg-muted hover:text-foreground"
                   }`}
                 >
                   <tab.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                   {tab.label}
                   {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                   )}
                 </button>
               );
             })}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tabs.find((t) => t.id === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
