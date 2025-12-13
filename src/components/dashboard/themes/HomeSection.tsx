"use client";

import React from "react";
import { useForm } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { ChevronDown, Save } from "lucide-react";
import { Input } from "../../ui/Input";
import Button from "../../ui/Button";

// Define the form data structure for type safety
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

export default function HomeSection() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HomeContentFormData>();

  const onSubmit = (data: HomeContentFormData) => {
    // Simulate API call
    console.log("Form Data Saved:", data);
    // Add your update logic here
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Home Page Content</h1>
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full bg-primary-foreground rounded-lg shadow-sm border border-primary/10 overflow-hidden"
      >
        <AccordionItem value="home" className="border-b-0">
          <AccordionHeader className="flex">
            <AccordionTrigger className="flex flex-1 items-center justify-between px-6 py-4 hover:bg-primary/5 transition-colors group">
              <span className="text-lg font-semibold text-primary">
                Content Management
              </span>
              <ChevronDown className="w-5 h-5 text-primary transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </AccordionTrigger>
          </AccordionHeader>

          <AccordionContent className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Category Section */}
              <section className="p-4 border border-primary/20 rounded-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
                  Category Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <Input
                      {...register("categoryTitle", { required: true })}
                      placeholder="Category Title"
                      className="w-full"
                    />
                    {errors.categoryTitle && (
                      <span className="text-xs text-red-500">Required</span>
                    )}
                  </div>
                  <Input
                    {...register("categoryDesc")}
                    placeholder="Short Description"
                    className="w-full"
                  />
                </div>
              </section>

              {/* Features Product Section */}
              <section className="p-4 border border-primary/20 rounded-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
                  Features Product Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    {...register("featureTitle")}
                    placeholder="Feature Title"
                  />
                  <Input
                    {...register("featureSubtitle")}
                    placeholder="Feature Subtitle"
                  />
                  <Input
                    {...register("featureDesc")}
                    placeholder="Short Description"
                    className="md:col-span-2"
                  />
                </div>
              </section>

              {/* Season Section */}
              <section className="p-4 border border-primary/20 rounded-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
                  Season Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    {...register("seasonTitle")}
                    placeholder="Season Title"
                  />
                  <Input
                    {...register("seasonSubtitle")}
                    placeholder="Season Subtitle"
                  />
                  <Input
                    {...register("seasonDesc")}
                    placeholder="Short Description"
                    className="md:col-span-2"
                  />
                </div>
              </section>

              {/* Excellence Section */}
              <section className="p-4 border border-primary/20 rounded-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
                  Excellence Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    {...register("excellenceTitle")}
                    placeholder="Excellence Title"
                  />
                  <Input
                    {...register("excellenceSubtitle")}
                    placeholder="Excellence Subtitle"
                  />
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="p-4 border border-primary/20 rounded-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
                  Testimonials Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    {...register("testimonialTitle")}
                    placeholder="Testimonials Title"
                  />
                  <Input
                    {...register("testimonialDesc")}
                    placeholder="Short Description"
                  />
                </div>
              </section>

              {/* Newsletter Section */}
              <section className="p-4 border border-primary/20 rounded-md space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-primary opacity-80 border-b border-primary/10 pb-2">
                  Newsletter Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    {...register("newsletterTitle")}
                    placeholder="Newsletter Title"
                  />
                  <Input
                    {...register("newsletterDesc")}
                    placeholder="Short Description"
                  />
                </div>
              </section>

              {/* Action Area */}
              <div className="flex justify-end pt-4 border-t border-primary/10">
                <Button
                  variant="luxury"
                  type="submit"
                  className="flex items-center gap-2 px-8"
                  disabled={isSubmitting}
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
