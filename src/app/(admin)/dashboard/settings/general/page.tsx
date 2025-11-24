"use client";

import React from "react";
import { Upload, Globe, Store, Mail, MapPin, Save } from "lucide-react";

export default function General() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            General Settings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your store details and regional preferences.
          </p>
        </div>
        <div className="hidden sm:block">
          <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Form Section: Store Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <Store className="w-4 h-4 text-primary" />
            Store Profile
          </h3>
          <p className="text-sm text-muted-foreground">
            This will be displayed on your invoices and public storefront.
          </p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="Acme Corp"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. My Awesome Store"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Store Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg border border-dashed border-muted-foreground/50 flex items-center justify-center bg-muted/20">
                <Store className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </button>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 512x512px. Max 2MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Description
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Brief description of your store..."
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Form Section: Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Contact Information
          </h3>
          <p className="text-sm text-muted-foreground">
            How customers can reach you.
          </p>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Support Email
            </label>
            <input
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="support@example.com"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Phone Number
            </label>
            <input
              type="tel"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border my-6" />

      {/* Form Section: Regional */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            Regional Settings
          </h3>
          <p className="text-sm text-muted-foreground">
            Currency, timezone and address.
          </p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Currency
              </label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Timezone
              </label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <option>UTC (GMT+0)</option>
                <option>EST (GMT-5)</option>
                <option>PST (GMT-8)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none">
              Store Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="123 Commerce St, Suite 100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Save Button */}
      <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 h-12 rounded-xl text-base font-medium transition-colors">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
