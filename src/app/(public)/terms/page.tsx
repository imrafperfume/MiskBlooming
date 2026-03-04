import React from "react";
import { prisma } from "@/src/lib/db";
import LegalPageLayout from "@/src/components/LegalPageLayout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findFirst();
  return {
    title: `Terms & Conditions | ${settings?.storeName || 'Misk Blooming'}`,
    description: "Terms of Service outlining rules, responsibilities, and acceptable usage of our website.",
  };
}

export default async function TermsPage() {
  const settings = await prisma.storeSettings.findFirst();

  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated={settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
      content={settings?.termsConditions || null}
      storeName={settings?.storeName}
      email={settings?.supportEmail}
      phone={settings?.phoneNumber}
      address={settings?.address}
    />
  );
}
