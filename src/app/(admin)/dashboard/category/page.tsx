"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react"; // Lucide icons

type Category = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
};

type SubCategory = {
  id: string;
  name: string;
  categoryId: string;
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const DEMO_CATEGORIES: Category[] = [
  {
    id: "cat1",
    name: "Electronics",
    description: "Devices, gadgets and more",
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=facearea&w=128&q=80",
  },
  {
    id: "cat2",
    name: "Fashion",
    description: "Clothing and accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=128&q=80",
  },
];

const DEMO_SUBCATEGORIES: SubCategory[] = [
  { id: "sub1", name: "Smartphones", categoryId: "cat1" },
  { id: "sub2", name: "Laptops", categoryId: "cat1" },
  { id: "sub3", name: "Men", categoryId: "cat2" },
  { id: "sub4", name: "Women", categoryId: "cat2" },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);

  // Category form state
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [catImageFile, setCatImageFile] = useState<File | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // Subcategory form state
  const [subName, setSubName] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);

  // Load demo data on mount
  useEffect(() => {
    setCategories(DEMO_CATEGORIES);
    setSubcategories(DEMO_SUBCATEGORIES);
  }, []);

  // Handle image file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCatImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCatImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add or edit category
  const handleSaveCategory = () => {
    if (!catName.trim()) return;
    if (editingCatId) {
      setCategories((cats) =>
        cats.map((c) =>
          c.id === editingCatId
            ? { ...c, name: catName, description: catDesc, imageUrl: catImage }
            : c
        )
      );
      setEditingCatId(null);
    } else {
      setCategories((cats) => [
        ...cats,
        {
          id: generateId(),
          name: catName,
          description: catDesc,
          imageUrl: catImage,
        },
      ]);
    }
    setCatName("");
    setCatDesc("");
    setCatImage("");
    setCatImageFile(null);
  };

  // Edit category
  const handleEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description || "");
    setCatImage(cat.imageUrl || "");
    setCatImageFile(null);
  };

  // Delete category and its subcategories
  const handleDeleteCategory = (id: string) => {
    setCategories((cats) => cats.filter((c) => c.id !== id));
    setSubcategories((subs) => subs.filter((s) => s.categoryId !== id));
  };

  // Add or edit subcategory
  const handleSaveSubCategory = () => {
    if (!subName.trim() || !subCatId) return;
    if (editingSubId) {
      setSubcategories((subs) =>
        subs.map((s) =>
          s.id === editingSubId
            ? { ...s, name: subName, categoryId: subCatId }
            : s
        )
      );
      setEditingSubId(null);
    } else {
      setSubcategories((subs) => [
        ...subs,
        { id: generateId(), name: subName, categoryId: subCatId },
      ]);
    }
    setSubName("");
    setSubCatId("");
  };

  // Edit subcategory
  const handleEditSubCategory = (sub: SubCategory) => {
    setEditingSubId(sub.id);
    setSubName(sub.name);
    setSubCatId(sub.categoryId);
  };

  // Delete subcategory
  const handleDeleteSubCategory = (id: string) => {
    setSubcategories((subs) => subs.filter((s) => s.id !== id));
  };

  // Custom color classes
  const primary = "bg-luxury-500";
  const borderPrimary = "border-luxury-500";
  const textPrimary = "text-luxury-500";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff]">
      {/* Sidebar */}
      <div className="w-72 bg-white/90 shadow-xl rounded-r-3xl p-6 flex flex-col gap-6 mt-8 ml-4">
        <h1 className="text-2xl font-bold mb-2 text-luxury-500">Categories</h1>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="flex items-center gap-3 group">
              {cat.imageUrl && (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-8 h-8 object-cover rounded-lg border"
                />
              )}
              <span className="font-medium text-gray-800">{cat.name}</span>
              <button
                className="ml-auto text-xs text-gray-400 group-hover:text-luxury-500"
                onClick={() => handleEditCategory(cat)}
                title="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                className="text-xs text-red-400 group-hover:text-red-600"
                onClick={() => handleDeleteCategory(cat.id)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-8 flex flex-col gap-6">
        {/* Category Form */}
        <div className="bg-white rounded-2xl shadow-md p-5 max-w-2xl mx-auto">
          <h2 className="font-semibold text-lg mb-3 text-luxury-500">
            {editingCatId ? "Edit Category" : "Add Category"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              className={`border ${borderPrimary} rounded-lg px-3 py-2 text-sm`}
              placeholder="Category name"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            <textarea
              className={`border ${borderPrimary} rounded-lg px-3 py-2 text-sm resize-none`}
              placeholder="Description"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              rows={1}
            />
            <div>
              <input
                id="catImage"
                type="file"
                accept="image/*"
                className={`border ${borderPrimary} rounded-lg px-3 py-2 w-full text-sm`}
                onChange={handleImageChange}
              />
              {catImage && (
                <img
                  src={catImage}
                  alt="Preview"
                  className="mt-1 rounded-lg w-12 h-12 object-cover border"
                />
              )}
            </div>
            <div className="flex gap-2">
              <button
                className={`${primary} text-white px-4 py-2 rounded-lg font-semibold shadow text-sm`}
                onClick={handleSaveCategory}
              >
                {editingCatId ? "Save" : "Add"}
              </button>
              {editingCatId && (
                <button
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
                  onClick={() => setEditingCatId(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
        {/* SubCategory Form */}
        <div className="bg-white rounded-2xl shadow-md p-5 max-w-2xl mx-auto">
          <h2 className="font-semibold text-lg mb-3 text-luxury-500">
            {editingSubId ? "Edit Subcategory" : "Add Subcategory"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className={`border ${borderPrimary} rounded-lg px-3 py-2 text-sm`}
              placeholder="Subcategory name"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
            />
            <select
              className={`border ${borderPrimary} rounded-lg px-3 py-2 text-sm`}
              value={subCatId}
              onChange={(e) => setSubCatId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                className={`${primary} text-white px-4 py-2 rounded-lg font-semibold shadow text-sm`}
                onClick={handleSaveSubCategory}
              >
                {editingSubId ? "Save" : "Add"}
              </button>
              {editingSubId && (
                <button
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
                  onClick={() => setEditingSubId(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-2 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3">
                {cat.imageUrl && (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                )}
                <div>
                  <div className="font-bold text-gray-900">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.description}</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-semibold text-sm mb-1 text-luxury-500">
                  Subcategories
                </div>
                <ul className="flex flex-wrap gap-2">
                  {subcategories
                    .filter((sub) => sub.categoryId === cat.id)
                    .map((sub) => (
                      <li
                        key={sub.id}
                        className="bg-[#f3f4f6] px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                      >
                        {sub.name}
                        <button
                          className="text-luxury-500 hover:underline"
                          onClick={() => handleEditSubCategory(sub)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="text-red-400 hover:text-red-600"
                          onClick={() => handleDeleteSubCategory(sub.id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
