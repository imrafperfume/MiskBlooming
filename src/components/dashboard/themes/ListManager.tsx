"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, X, Save, Image as ImageIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ImageUploadField } from "./ImageUploadField";
import { motion, AnimatePresence } from "framer-motion";

export type FieldType = "text" | "textarea" | "image";

export interface ListFieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
}

interface ListManagerProps {
  title: string;
  items: any[];
  onUpdate: (newItems: any[]) => void;
  fields: ListFieldDef[];
  description?: string;
  renderItemPreview?: (item: any) => React.ReactNode;
}

export function ListManager({
  title,
  items = [],
  onUpdate,
  fields,
  description,
  renderItemPreview,
}: ListManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  const resetForm = () => {
    setFormData({});
    setIsAdding(false);
    setEditingIndex(null);
  };

  const handleStartAdd = () => {
    setFormData({});
    setIsAdding(true);
    setEditingIndex(null);
  };

  const handleStartEdit = (index: number, item: any) => {
    setFormData({ ...item });
    setEditingIndex(index);
    setIsAdding(false);
  };

  const handleSave = () => {
    if (editingIndex !== null) {
      // Edit existing
      const newItems = [...items];
      newItems[editingIndex] = formData;
      onUpdate(newItems);
    } else {
      // Add new
      onUpdate([...items, formData]);
    }
    resetForm();
  };

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const newItems = items.filter((_, i) => i !== index);
      onUpdate(newItems);
    }
  };

  const updateField = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 border border-border rounded-xl p-4 bg-card/50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {!isAdding && editingIndex === null && (
          <Button
            onClick={handleStartAdd}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        )}
      </div>

      {/* Form Area */}
      <AnimatePresence>
        {(isAdding || editingIndex !== null) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border pt-4 mt-4 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  {field.type === "image" ? (
                    <ImageUploadField
                      label={field.label}
                      value={formData[field.name]}
                      onChange={(url) => updateField(field.name, url)}
                      folder="misk-blooming/content"
                    />
                  ) : field.type === "textarea" ? (
                    <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase text-muted-foreground">
                            {field.label}
                        </label>
                        <textarea
                        value={formData[field.name] || ""}
                        onChange={(e) => updateField(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                  ) : (
                    <Input
                      label={field.label}
                      value={formData[field.name] || ""}
                      onChange={(e) => updateField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={resetForm} variant="ghost" size="sm">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="luxury" size="sm">
                {editingIndex !== null ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List Area */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border border-border">
            No items yet. Click add to start.
          </div>
        ) : (
          items.map((item, index) => (
            <motion.div
              layout
              key={index}
              className={`p-3 rounded-lg border border-border bg-background flex items-start gap-3 group transition-all ${
                editingIndex === index ? "ring-2 ring-primary border-transparent" : "hover:border-primary/50"
              }`}
            >
              <div className="flex-1 min-w-0">
                {renderItemPreview ? (
                  renderItemPreview(item)
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Default preview tries to find an image and a title-like field */}
                    {Object.values(item).some(
                      (v) => typeof v === "string" && (v.startsWith("http") || v.startsWith("/"))
                    ) && (
                      <div className="w-10 h-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
                         {/* Simple img tag for preview if field name known, else generic icon */}
                         <ImageIcon className="w-full h-full p-2 text-muted-foreground" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="font-medium truncate">
                        {item.title || item.name || item.label || Object.values(item)[0] || "Item"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description || item.role || item.details?.join(", ") || ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartEdit(index, item)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(index)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
