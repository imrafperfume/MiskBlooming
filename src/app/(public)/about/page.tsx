
import { prisma } from "../../../lib/db";
export const dynamic = "force-dynamic";
import { Metadata } from "next";
import AboutClient from "./AboutClient";

interface StatItem {
  number: string;
  label: string;
}

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

export async function generateMetadata(): Promise<Metadata> {
  let content = null;
  try {
    content = await prisma.aboutPageContent.findFirst({
      where: { id: "ABOUT_PAGE" },
    });
  } catch (error) {
    console.warn("Failed to fetch about page content for metadata:", error);
  }

  const title = content?.heroTitle || "About Us";
  const description = content?.heroDesc || "Learn about Misk Blooming";

  return {
    title: `${title}`,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default async function AboutPage() {
  let content = null;
  try {
    content = await prisma.aboutPageContent.findFirst({
      where: { id: "ABOUT_PAGE" },
    });
  } catch (error) {
    console.error("Failed to fetch about page content:", error);
  }

  const stats = (content?.stats as unknown as StatItem[]) ?? [];
  const values = (content?.values as unknown as ValueItem[]) ?? [];
  const team = (content?.team as unknown as TeamMember[]) ?? [];

  // Construct a safe content object to pass
  const safeContent = {
    heroTitle: content?.heroTitle || "About Us",
    heroDesc: content?.heroDesc || "Welcome to Misk Blooming",
    heroImage: content?.heroImage || null,
    storyTitle: content?.storyTitle || "Our Story",
    storyDesc1: content?.storyDesc1 || "",
    storyDesc2: content?.storyDesc2 || "",
    storyImage: content?.storyImage || null,
  };

  return (
    <AboutClient
      content={safeContent}
      stats={stats}
      values={values}
      team={team}
    />
  );
}
