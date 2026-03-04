import React from "react";
import { prisma } from "@/src/lib/db";
import LegalPageLayout from "@/src/components/LegalPageLayout";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.storeSettings.findFirst();
  return {
    title: `Shipping & Delivery | ${settings?.storeName || 'Misk Blooming'}`,
    description: "Shipping and delivery information for our products.",
  };
}

export default async function DeliveryInfoPage() {
  const settings = await prisma.storeSettings.findFirst();

  return (
    <LegalPageLayout
      title="Shipping & Delivery Information"
      lastUpdated={settings?.updatedAt ? new Date(settings.updatedAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : undefined}
      content={settings?.shippingPolicy || null}
      storeName={settings?.storeName}
      email={settings?.supportEmail}
      phone={settings?.phoneNumber}
      address={settings?.address}
    />
  );
}
