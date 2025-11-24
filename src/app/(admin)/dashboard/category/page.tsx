"use client";

import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Layers,
  Plus,
  GitBranch,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { CloudinaryFileUpload } from "@/src/components/ui/CloudinaryFileUpload";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CATEGORY,
  CREATE_SUB_CATEGORY,
  DELETE_CATEGORY,
  DELETE_SUB_CATEGORY,
  GET_CATEGORIES,
  GET_SUBCATEGORIES,
  UPDATE_CATEGORY,
  UPDATE_SUB_CATEGORY,
} from "@/src/modules/category/categoryTypes";
import { toast } from "sonner";
import Image from "next/image";
import Button from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

// --- Types ---
type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};
type SubCategory = { id: string; name: string; categoryId: string };

export default function CategoryPage() {
  // --- State ---
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  // --- Data Fetching ---
  const { data, loading, refetch } = useQuery(GET_CATEGORIES);
  const { data: subData, refetch: refetchSubcategories } =
    useQuery(GET_SUBCATEGORIES);

  const categories: Category[] = data?.categories ?? [];
  const subcategories: SubCategory[] = subData?.subcategories ?? [];

  // --- Mutations ---
  const [createCategory, { loading: createLoading }] =
    useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updateLoading }] =
    useMutation(UPDATE_CATEGORY);
  const [createSubCategory, { loading: createSubLoading }] =
    useMutation(CREATE_SUB_CATEGORY);
  const [updateSubCategory, { loading: updateSubLoading }] =
    useMutation(UPDATE_SUB_CATEGORY);
  const [deleteSubCategory] = useMutation(DELETE_SUB_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const isSavingCat = createLoading || updateLoading;
  const isSavingSub = createSubLoading || updateSubLoading;

  // --- Handlers ---
  const handleSaveCategory = async () => {
    if (!catName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (editingCatId) {
        toast.loading("Updating category...");
        await updateCategory({
          variables: {
            id: editingCatId,
            input: {
              id: editingCatId,
              name: catName,
              description: catDesc,
              imageUrl: catImage,
            },
          },
        });
        toast.success("Category updated");
        setEditingCatId(null);
      } else {
        toast.loading("Creating category...");
        await createCategory({
          variables: {
            input: { name: catName, description: catDesc, imageUrl: catImage },
          },
        });
        toast.success("Category created");
      }

      toast.dismiss();
      await refetch();
      // Reset form
      setCatName("");
      setCatDesc("");
      setCatImage("");
    } catch (error) {
      toast.dismiss();
      toast.error("Operation failed");
      console.error(error);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description || "");
    setCatImage(cat.imageUrl || "");
    // Scroll to top on mobile to see form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will delete the category.")) return;
    try {
      await deleteCategory({ variables: { id } });
      toast.success("Category deleted");
      await refetch();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleSaveSubCategory = async () => {
    if (!subName.trim() || !subCatId) {
      toast.error("Name and Parent Category are required");
      return;
    }

    try {
      if (editingSubId) {
        toast.loading("Updating subcategory...");
        await updateSubCategory({
          variables: {
            id: editingSubId,
            input: { id: editingSubId, name: subName, categoryId: subCatId },
          },
        });
        toast.success("Subcategory updated");
        setEditingSubId(null);
      } else {
        toast.loading("Creating subcategory...");
        await createSubCategory({
          variables: {
            input: { name: subName, categoryId: subCatId },
          },
        });
        toast.success("Subcategory created");
      }

      toast.dismiss();
      await refetchSubcategories();
      setSubName("");
      // Keep the category selected for easier bulk addition, or reset if preferred
      // setSubCatId("");
    } catch (error) {
      toast.dismiss();
      toast.error("Operation failed");
      console.error(error);
    }
  };

  const handleEditSubCategory = (sub: SubCategory) => {
    setEditingSubId(sub.id);
    setSubName(sub.name);
    setSubCatId(sub.categoryId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm("Delete this subcategory?")) return;
    try {
      await deleteSubCategory({ variables: { id } });
      toast.success("Deleted");
      await refetchSubcategories();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleFilesUploaded = (files: { url: string }[]) => {
    setCatImage(files[0].url);
  };

  // --- Reset Handlers ---
  const resetCatForm = () => {
    setEditingCatId(null);
    setCatName("");
    setCatDesc("");
    setCatImage("");
  };

  const resetSubForm = () => {
    setEditingSubId(null);
    setSubName("");
    setSubCatId("");
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Taxonomy
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your product categories and sub-levels structure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: FORMS (Sticky on desktop) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            {/* Category Form Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/40 flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <Layers size={18} />
                </div>
                <h2 className="font-semibold text-foreground">
                  {editingCatId ? "Edit Category" : "New Category"}
                </h2>
                {editingCatId && (
                  <button
                    onClick={resetCatForm}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    placeholder="e.g. Living Room"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Short description..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Cover Image
                  </label>
                  {catImage ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border group">
                      <Image
                        src={catImage}
                        alt="preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setCatImage("")}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <CloudinaryFileUpload
                      onFilesUploaded={handleFilesUploaded}
                      maxFiles={1}
                      folder="category_images"
                      tags={["category"]}
                    />
                  )}
                </div>

                <Button
                  onClick={handleSaveCategory}
                  disabled={isSavingCat}
                  className="w-full"
                  variant="luxury"
                >
                  {isSavingCat
                    ? "Saving..."
                    : editingCatId
                    ? "Update Category"
                    : "Create Category"}
                </Button>
              </div>
            </div>

            {/* Subcategory Form Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/40 flex items-center gap-2">
                <div className="p-2 bg-indigo-500/10 rounded-md text-indigo-600 dark:text-indigo-400">
                  <GitBranch size={18} />
                </div>
                <h2 className="font-semibold text-foreground">
                  {editingSubId ? "Edit Subcategory" : "New Subcategory"}
                </h2>
                {editingSubId && (
                  <button
                    onClick={resetSubForm}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Parent Category
                  </label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={subCatId}
                    onChange={(e) => setSubCatId(e.target.value)}
                  >
                    <option value="">Select a Category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    placeholder="e.g. Sofas"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="bg-background"
                  />
                </div>

                <Button
                  onClick={handleSaveSubCategory}
                  disabled={isSavingSub}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  variant="luxury"
                >
                  {isSavingSub
                    ? "Saving..."
                    : editingSubId
                    ? "Update Subcategory"
                    : "Add Subcategory"}
                </Button>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: LIST GRID */}
          <main className="lg:col-span-8 space-y-6">
            {/* Stats or Search could go here */}

            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground animate-pulse">
                  Loading categories...
                </p>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
                <Layers className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Categories Yet</h3>
                <p className="text-muted-foreground">
                  Start by adding a category on the left.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Card Header / Image */}
                    <div className="relative h-32 bg-muted flex items-center justify-center overflow-hidden">
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <ImageIcon className="text-muted-foreground/30 w-12 h-12" />
                      )}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-lg p-1 backdrop-blur-sm">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-1.5 text-white hover:text-primary transition-colors"
                          title="Edit Category"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-white hover:text-red-400 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-foreground">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1 mb-4">
                          {cat.description}
                        </p>
                      )}

                      <div className="border-t border-border pt-4 mt-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          Subcategories
                        </h4>

                        <div className="flex flex-wrap gap-2">
                          {subcategories
                            .filter((sub) => sub.categoryId === cat.id)
                            .map((sub) => (
                              <div
                                key={sub.id}
                                className="inline-flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border px-3 py-1.5 rounded-full text-sm text-foreground transition-colors group/sub"
                              >
                                <span>{sub.name}</span>
                                <div className="flex items-center border-l border-border pl-2 ml-1 space-x-1 opacity-50 group-hover/sub:opacity-100">
                                  <button
                                    onClick={() => handleEditSubCategory(sub)}
                                    className="hover:text-primary"
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteSubCategory(sub.id)
                                    }
                                    className="hover:text-destructive"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}

                          {/* Quick Add Sub Button */}
                          <button
                            onClick={() => {
                              setSubCatId(cat.id);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              if (subName) setSubName("");
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                            title="Add subcategory to this group"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {subcategories.filter((s) => s.categoryId === cat.id)
                          .length === 0 && (
                          <p className="text-xs text-muted-foreground/50 italic">
                            No subcategories yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
