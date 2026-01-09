"use client"; 

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Separator } from "../../ui/separator";

const GET_FOOTER_CONTENT = gql`
  query GetFooterContent {
    getFooterContent {
      id
      brandDesc
      phone
      email
      address
      facebook
      instagram
      twitter
      newsletterTitle
      newsletterDesc
      copyrightText
      footerLinks {
        title
        links {
            name
            href
        }
      }
    }
  }
`;

const UPDATE_FOOTER_CONTENT = gql`
  mutation UpdateFooterContent($input: UpdateFooterContentInput!) {
    updateFooterContent(input: $input) {
      id
    }
  }
`;

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterFormValues {
  brandDesc: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  newsletterTitle: string;
  newsletterDesc: string;
  copyrightText: string;
  footerLinks: FooterSection[];
}

export function FooterSettingsForm() {
  const { data, loading, error } = useQuery(GET_FOOTER_CONTENT, {
      fetchPolicy: "network-only"
  });
  const [updateFooter, { loading: updating }] = useMutation(UPDATE_FOOTER_CONTENT);

  const form = useForm<FooterFormValues>({
    defaultValues: {
      brandDesc: "",
      phone: "",
      email: "",
      address: "",
      facebook: "",
      instagram: "",
      twitter: "",
      newsletterTitle: "",
      newsletterDesc: "",
      copyrightText: "",
      footerLinks: [],
    },
  });

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
      control: form.control,
      name: "footerLinks",
  });

  // Load data into form when fetched
  useEffect(() => {
    if (data?.getFooterContent) {
        // Strip __typename to avoid issues
        const { id, __typename, ...rest } = data.getFooterContent;
        const cleanLinks = rest.footerLinks?.map((section: any) => ({
            title: section.title,
            links: section.links.map((link: any) => ({ name: link.name, href: link.href }))
        })) || [];
        
        form.reset({
            ...rest,
            footerLinks: cleanLinks
        });
    }
  }, [data, form]);

  const onSubmit = async (values: any) => {
    try {
      await updateFooter({
        variables: {
          input: values,
        },
      });
      toast.success("Footer settings updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update footer settings");
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="text-red-500">Error loading settings: {error.message}</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Brand Information */}
        <Card>
            <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Customize the brand description shown in the footer.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="brandDesc"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Brand Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Enter brand description..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Manage contact details displayed in the footer.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                        <Input placeholder="+971..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                        <Input placeholder="info@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                        <Input placeholder="Dubai Marina..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
            <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
            </CardHeader>
             <CardContent className="grid gap-4 md:grid-cols-3">
                 <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://facebook.com/..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Instagram URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://instagram.com/..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Twitter/X URL</FormLabel>
                        <FormControl>
                        <Input placeholder="https://twitter.com/..." {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
        </Card>

         {/* Newsletter & Copyright */}
         <Card>
             <CardHeader>
                 <CardTitle>Newsletter & Copyright</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="newsletterTitle"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Newsletter Title</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="newsletterDesc"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Newsletter Description</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="copyrightText"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Copyright Text</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </CardContent>
         </Card>

        {/* Dynamic Link Sections */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Footer Navigation Links</CardTitle>
                    <CardDescription>Manage the columns and links in the footer.</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => appendSection({ title: "New Section", links: [] })}>
                    <Plus className="w-4 h-4 mr-2" /> Add Section
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                 {sectionFields.map((section, index) => (
                     <div key={section.id} className="p-4 border rounded-lg space-y-4 bg-muted/20">
                         <div className="flex items-end gap-4">
                            <FormField
                                control={form.control}
                                name={`footerLinks.${index}.title`}
                                render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Section Title</FormLabel>
                                    <FormControl>
                                    <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeSection(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                         </div>
                         
                         <Separator />
                         
                         {/* Nested Links Array */}
                         <LinksArray nestIndex={index} control={form.control} />
                     </div>
                 ))}
            </CardContent>
        </Card>

        <Button type="submit" disabled={updating} className="w-full md:w-auto">
          {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

// Sub-component for managing links within a section
function LinksArray({ nestIndex, control }: { nestIndex: number, control: any }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `footerLinks.${nestIndex}.links`
    });

    return (
        <div className="space-y-3 pl-4 border-l-2">
             <div className="flex justify-between items-center">
                 <h4 className="text-sm font-medium">Links</h4>
                 <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => append({ name: "", href: "" })}>
                    <Plus className="w-3 h-3 mr-1" /> Add Link
                 </Button>
             </div>
             {fields.map((item, k) => (
                 <div key={item.id} className="flex gap-2 items-start">
                      <FormField
                        control={control}
                        name={`footerLinks.${nestIndex}.links.${k}.name`}
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                            <Input placeholder="Link Name" className="h-8 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name={`footerLinks.${nestIndex}.links.${k}.href`}
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                            <Input placeholder="/url" className="h-8 text-sm" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => remove(k)}>
                        <Trash2 className="w-3 h-3" />
                    </Button>
                 </div>
             ))}
        </div>
    );
}
