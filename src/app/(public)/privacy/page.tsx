import React from "react";
import { prisma } from "@/src/lib/db";
import LegalPageLayout from "@/src/components/LegalPageLayout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findFirst();
  return {
    title: `Privacy Policy | ${settings?.storeName || 'Misk Blooming'}`,
    description: "Privacy policy detailing how we collect, use, and protect user data.",
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await prisma.storeSettings.findFirst();

  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated={settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
      content={settings?.privacyPolicy || null}
      storeName={settings?.storeName}
      email={settings?.supportEmail}
      phone={settings?.phoneNumber}
      address={settings?.address}
    />
  );
}
