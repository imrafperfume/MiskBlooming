
import { prisma } from "@/src/lib/db";
import { Metadata } from "next";
import ContactClient from "./ContactClient";

interface ContactInfoItem {
  title: string;
  details: string[];
  description: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.contactPageContent.findFirst({
    where: { id: "CONTACT_PAGE" },
  });

  const title = content?.heroTitle || "Contact Us";
  const description = content?.heroDesc || "Get in touch with Misk Blooming";

  return {
    title: `${title}`,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default async function ContactPage() {
  const content = await prisma.contactPageContent.findFirst({
    where: { id: "CONTACT_PAGE" },
  });

  // Safe parsing of contactInfo
  const contactInfo = (content?.contactInfo as unknown as ContactInfoItem[]) ?? [];

  const safeContent = {
    heroTitle: content?.heroTitle || "Contact Us",
    heroDesc: content?.heroDesc || "We'd love to hear from you.",
    heroImage: content?.heroImage || null,
    mapEmbedUrl: (content as any)?.mapEmbedUrl || null,
  };

  return (
    <ContactClient
      content={safeContent}
      contactInfo={contactInfo}
    />
  );
}
