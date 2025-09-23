"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};
type SubCategory = { id: string; name: string; categoryId: string };

export default function CategoryPage() {
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  // Fetch categories
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES);
  const { data: subData, refetch: refetchSubcategories } =
    useQuery(GET_SUBCATEGORIES);

  const categories: Category[] = data?.categories ?? [];
  console.log("🚀 ~ CategoryPage ~ categories:", categories);
  const subcategories = subData?.subcategories ?? [];

  // Create category mutation
  const [createCategory, { loading: createLoading }] =
    useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [createSubCategory] = useMutation(CREATE_SUB_CATEGORY);
  const [updateSubCategory] = useMutation(UPDATE_SUB_CATEGORY);
  const [deleteSubCategory] = useMutation(DELETE_SUB_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const handleSaveCategory = async () => {
    console.log("catImage", catImage);
    console.log("Editing", editingCatId);

    if (!catName.trim()) return;
    if (editingCatId) {
      toast.loading("Updating category...");
      try {
        // TODO: implement updateCategory mutation
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
        toast.dismiss();
        await refetch();
        setCatName("");
        setCatDesc("");
        // setCatImage("");
        setEditingCatId(null);
      } catch (error) {
        toast.error("Failed to update category");
        toast.dismiss();
        console.error("Update category failed:", error);
      }
    } else {
      try {
        toast.loading("Creating category...");
        await createCategory({
          variables: {
            input: {
              name: catName,
              description: catDesc,
              imageUrl: catImage,
            },
          },
        });
        toast.success("Category created");
        toast.dismiss();
        await refetch();
        setCatName("");
        setCatDesc("");
        // setCatImage("");
      } catch (err) {
        console.error("Create category failed:", err);
        toast.error("Failed to create category");
        toast.dismiss();
      }
    }
  };

  const handleEditCategory = (cat: Category) => {
    console.log("cat", cat);
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description || "");
    setCatImage(cat.imageUrl || "");
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      toast.loading("Deleting category...");
      await deleteCategory({
        variables: { id },
      });
      toast.success("Category deleted");
      toast.dismiss();
      await refetch();
    } catch (error) {
      toast.error("Failed to delete category");
      toast.dismiss();
      console.error("Failed to delete category:", error);
    }
  };

  const handleSaveSubCategory = async () => {
    if (!subName.trim() || !subCatId) return;

    try {
      if (editingSubId) {
        toast.loading("Updating subcategory...");
        // TODO: implement updateSubCategory mutation if your backend supports it
        await updateSubCategory({
          variables: {
            id: editingSubId,
            input: {
              id: editingSubId,
              name: subName,
              categoryId: subCatId,
            },
          },
        });
        toast.success("Subcategory updated");
        toast.dismiss();
        // Update local state
        setEditingSubId(null);
      } else {
        toast.loading("Creating subcategory...");
        await createSubCategory({
          variables: {
            input: {
              name: subName,
              categoryId: subCatId,
            },
          },
        });
        toast.success("Subcategory created");
        toast.dismiss();
      }

      // Optionally refetch subcategories from server if needed
      await refetchSubcategories();

      setSubName("");
      setSubCatId("");
    } catch (error) {
      toast.error("Failed to save subcategory");
      toast.dismiss();
      console.error("Failed to save subcategory:", error);
    }
  };
  const handleEditSubCategory = (sub: SubCategory) => {
    setEditingSubId(sub.id);
    setSubName(sub.name);
    setSubCatId(sub.categoryId);
  };

  const handleDeleteSubCategory = async (id: string) => {
    try {
      toast.loading("Deleting subcategory...");
      await deleteSubCategory({
        variables: { id },
      });
      toast.success("Subcategory deleted");
      toast.dismiss();
      await refetchSubcategories();
    } catch (error) {
      toast.error("Failed to delete subcategory");
      toast.dismiss();
      console.error("Failed to delete subcategory:", error);
    }
  };

  const handleFilesUploaded = (
    files: { url: string; publicId: string; optimizedUrls: any }[]
  ) => {
    setCatImage(files[0].url);
  };
  console.log(catImage);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-luxury-50 gap-6">
      {/* Sidebar */}
      <aside className="md:w-[400px] w-full bg-white/90 backdrop-blur-md sm:shadow rounded-2xl sm:p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-luxury-500">Categories</h1>
        <ul className="space-y-2 overflow-y-auto max-h-[50vh]">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center gap-3 group bg-white sm:p-2 rounded-lg sm:shadow-sm hover:shadow transition"
              >
                {cat.imageUrl && (
                  <Image
                    src={cat?.imageUrl}
                    alt={cat.name}
                    width={10}
                    height={10}
                    className="w-10 h-10 object-cover  rounded-lg border"
                  />
                )}
                <span className="font-medium text-gray-800">{cat.name}</span>
                <div className="ml-auto flex gap-3 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    title="Edit"
                    className="text-luxury-500 hover:text-luxury-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="Delete"
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
              {loading ? "Loading..." : "No categories available."}
            </p>
          )}
        </ul>
      </aside>

      {/* Main content */}
      <main className="w-full flex flex-col gap-6">
        {/* Category Form */}
        <section className="bg-white rounded-xl sm:shadow sm:p-6 max-w-3xl mx-auto flex flex-col gap-4">
          <h2 className="font-semibold text-lg text-luxury-500">
            {editingCatId ? "Edit Category" : "Add Category"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <input
              className="border border-luxury-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-400"
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            <textarea
              className="border border-luxury-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-luxury-400"
              placeholder="Description max 3 words"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              rows={1}
            />
            <div className="w-full object-cover rounded-lg">
              <CloudinaryFileUpload
                onFilesUploaded={handleFilesUploaded}
                maxFiles={1}
                maxFileSize={10}
                folder="category_images"
                tags={["category"]}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={"luxury"}
                size={"sm"}
                className="bg-luxury-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-luxury-700 transition"
                onClick={handleSaveCategory}
                disabled={createLoading}
              >
                {editingCatId ? "Update" : "Add"}
              </Button>
              {editingCatId && (
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg"
                  onClick={() => setEditingCatId(null)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Subcategory Form */}
        <section className="bg-white rounded-xl sm:shadow sm:p-6 sm:max-w-3xl sm:mx-auto flex flex-col gap-4">
          <h2 className="font-semibold text-lg text-luxury-500">
            {editingSubId ? "Edit Subcategory" : "Add Subcategory"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              className="border border-luxury-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-400"
              placeholder="Subcategory name"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
            />
            <select
              className="border border-luxury-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-luxury-400"
              value={subCatId}
              onChange={(e) => setSubCatId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Button
                variant={"luxury"}
                size={"sm"}
                className="bg-luxury-500 text-white sm:px-4 py-2 rounded-lg font-semibold sm:shadow hover:bg-luxury-700 transition"
                onClick={handleSaveSubCategory}
              >
                {editingSubId ? "Save" : "Add"}
              </Button>
              {editingSubId && (
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg"
                  onClick={() => setEditingSubId(null)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Category Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl sm:shadow sm:p-4 flex flex-col gap-3 hover:shadow-xl transform hover:scale-105 transition"
            >
              <div className="flex items-center gap-3">
                {cat.imageUrl && (
                  <Image
                    width={14}
                    height={14}
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                )}
                <div>
                  <div className="font-bold text-gray-900">{cat.name}</div>
                  <div className="text-sm text-gray-500">{cat.description}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {subcategories
                  .filter(
                    (sub: { id: string; name: string; categoryId: string }) =>
                      sub.categoryId === cat.id
                  )
                  .map(
                    (sub: { id: string; name: string; categoryId: string }) => (
                      <span
                        key={sub.id}
                        className="bg-luxury-50 text-luxury-500 px-2 py-1 rounded-full text-xs flex items-center gap-2"
                      >
                        {sub.name}
                        <button
                          onClick={() => handleEditSubCategory(sub)}
                          title="Edit"
                          className="hover:text-luxury-600"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteSubCategory(sub.id)}
                          title="Delete"
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    )
                  )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
