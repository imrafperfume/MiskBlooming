"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown, Save, Loader2, AlertCircle } from "lucide-react";
import { Input } from "../../ui/Input";
import Button from "../../ui/Button";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_HOMPAGECONTENT,
  UPDATE_HOMEPAGECONTENT,
} from "@/src/modules/contentManagment/oparation";
import { toast } from "sonner";

// --- Types ---

type HomeContentFormData = {
  categoryTitle: string;
  categoryDesc: string;
  featureTitle: string;
  featureSubtitle: string;
  featureDesc: string;
  seasonTitle: string;
  seasonSubtitle: string;
  seasonDesc: string;
  excellenceTitle: string;
  excellenceSubtitle: string;
  testimonialTitle: string;
  testimonialDesc: string;
  newsletterTitle: string;
  newsletterDesc: string;
};

// Define expected return type from GraphQL
interface HomePageContentData {
  getHomePageContent: HomeContentFormData;
}

// --- Helper Components ---

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
}

const ContentSection = ({ title, children }: ContentSectionProps) => (
  <section className="p-4 border border-primary/20 rounded-md space-y-3 bg-card">
    <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  </section>
);

interface FormErrorProps {
  message?: string;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return <span className="text-xs text-destructive mt-1 ml-1">{message}</span>;
};

// --- Main Component ---

export default function HomeSection() {
  // 1. Data Fetching
  const { data, loading, error } = useQuery<HomePageContentData>(
    GET_HOMPAGECONTENT,
    {
      fetchPolicy: "network-only", // Ensure fresh data on mount
    }
  );

  const [updateHomePageContent, { loading: saving }] = useMutation(
    UPDATE_HOMEPAGECONTENT
  );

  // 2. Form Initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<HomeContentFormData>({
    mode: "onBlur",
  });

  // 3. Sync Data with Form
  useEffect(() => {
    if (data?.getHomePageContent) {
      reset(data.getHomePageContent);
    }
  }, [data, reset]);

  // 4. Submit Handler
  const onSubmit: SubmitHandler<HomeContentFormData> = async (formData) => {
    const promise = updateHomePageContent({
      variables: { input: formData },
    });

    toast.promise(promise, {
      loading: "Saving content configuration...",
      success: (res) => {
        // Optional: Update local cache or re-sync if needed
        reset(formData); // Reset dirty state with new values
        return "Home page content updated successfully!";
      },
      error: (err) => {
        console.error("Save Error:", err);
        return err.message || "Failed to save changes. Please try again.";
      },
    });
  };

  // 5. Loading & Error States
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-lg border border-red-100">
        <AlertCircle className="w-8 h-8 mb-2" />
        <p>Failed to load content data.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Home Page Content</h1>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue="home" // Open by default for better UX
        className="w-full bg-primary-foreground rounded-lg shadow-sm border border-primary/10 overflow-hidden"
      >
        <AccordionItem value="home" className="border-b-0">
          <AccordionHeader className="flex">
            <AccordionTrigger className="flex flex-1 items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group">
              <span className="text-lg font-semibold text-primary">
                Content Configuration
              </span>
              <ChevronDown className="w-5 h-5 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </AccordionTrigger>
          </AccordionHeader>

          <AccordionContent className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Category Section */}
              <ContentSection title="Category Section">
                <div className="space-y-1">
                  <Input
                    {...register("categoryTitle", {
                      required: "Title is required",
                    })}
                    placeholder="Category Title"
                    disabled={saving}
                    className="w-full"
                  />
                  <FormError message={errors.categoryTitle?.message} />
                </div>
                <div className="space-y-1">
                  <Input
                    {...register("categoryDesc", {
                      required: "Description is required",
                    })}
                    placeholder="Short Description"
                    disabled={saving}
                    className="w-full"
                  />
                  <FormError message={errors.categoryDesc?.message} />
                </div>
              </ContentSection>

              {/* Features Product Section */}
              <ContentSection title="Features Product Section">
                <Input
                  {...register("featureTitle")}
                  placeholder="Feature Title"
                  disabled={saving}
                />
                <Input
                  {...register("featureSubtitle")}
                  placeholder="Feature Subtitle"
                  disabled={saving}
                />
                <div className="md:col-span-2">
                  <Input
                    {...register("featureDesc")}
                    placeholder="Short Description"
                    className="w-full"
                    disabled={saving}
                  />
                </div>
              </ContentSection>

              {/* Season Section */}
              <ContentSection title="Season Section">
                <Input
                  {...register("seasonTitle")}
                  placeholder="Season Title"
                  disabled={saving}
                />
                <Input
                  {...register("seasonSubtitle")}
                  placeholder="Season Subtitle"
                  disabled={saving}
                />
                <div className="md:col-span-2">
                  <Input
                    {...register("seasonDesc")}
                    placeholder="Short Description"
                    className="w-full"
                    disabled={saving}
                  />
                </div>
              </ContentSection>

              {/* Excellence Section */}
              <ContentSection title="Excellence Section">
                <Input
                  {...register("excellenceTitle")}
                  placeholder="Excellence Title"
                  disabled={saving}
                />
                <Input
                  {...register("excellenceSubtitle")}
                  placeholder="Excellence Subtitle"
                  disabled={saving}
                />
              </ContentSection>

              {/* Testimonials Section */}
              <ContentSection title="Testimonials Section">
                <Input
                  {...register("testimonialTitle")}
                  placeholder="Testimonials Title"
                  disabled={saving}
                />
                <Input
                  {...register("testimonialDesc")}
                  placeholder="Short Description"
                  disabled={saving}
                />
              </ContentSection>

              {/* Newsletter Section */}
              <ContentSection title="Newsletter Section">
                <Input
                  {...register("newsletterTitle")}
                  placeholder="Newsletter Title"
                  disabled={saving}
                />
                <Input
                  {...register("newsletterDesc")}
                  placeholder="Short Description"
                  disabled={saving}
                />
              </ContentSection>

              {/* Action Area */}
              <div className="sticky bottom-0 bg-primary-foreground/95 backdrop-blur py-4 border-t border-primary/10 flex justify-end z-10">
                <Button
                  variant="luxury"
                  type="submit"
                  className="flex items-center gap-2 px-8"
                  disabled={saving || !isDirty}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
