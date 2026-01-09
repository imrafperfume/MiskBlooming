import React from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  ProductFormData,
  // Ensure your VariantOption type has 'id' as optional (id?: string)
} from "@/src/app/(admin)/dashboard/products/add/page";

interface VariantsTabProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Record<string, string>;
}

export default function VariantsTab({
  formData,
  handleInputChange,
}: VariantsTabProps) {
  // Helper to find existing options in the array
  const getOptionValues = (name: "Size" | "Color") => {
    const option = formData.variantOptions.find((opt) => opt.name === name);
    return option ? option.values : [];
  };

  // Logic to add a specific value (e.g., adding "Small" to Size)
  const handleAddValue = (name: "Size" | "Color", value: string) => {
    if (!value.trim()) return;

    const newValues = [...getOptionValues(name)];
    // Prevent duplicates
    if (!newValues.includes(value.trim())) {
      newValues.push(value.trim());
      updateOption(name, newValues);
    }
  };

  // Logic to remove a value
  const handleRemoveValue = (name: "Size" | "Color", valIndex: number) => {
    const currentValues = getOptionValues(name);
    const newValues = currentValues.filter((_, i) => i !== valIndex);
    updateOption(name, newValues);
  };

  // Updates the formData.variantOptions array
  const updateOption = (name: "Size" | "Color", newValues: string[]) => {
    // Create a copy of the options array
    let updatedOptions = [...formData.variantOptions];

    // Check if this specific option (Size or Color) already exists in the form data
    const existingIndex = updatedOptions.findIndex((opt) => opt.name === name);

    if (existingIndex > -1) {
      // 1. UPDATE EXISTING:
      // We keep the existing object (preserving its database ID if it exists)
      // and only update the 'values' array.
      updatedOptions[existingIndex] = {
        ...updatedOptions[existingIndex],
        values: newValues,
      };
    } else {
      // 2. CREATE NEW:
      // We push a new object WITHOUT an ID.
      // Prisma will generate the unique ID when this is saved to the DB.
      updatedOptions.push({
        name: name,
        values: newValues,
        // id: undefined // Implicitly undefined, handled by backend/Prisma
      } as any);
      // 'as any' or correct type casting is used here depending on if your
      // strict Typescript setup requires 'id' to be present.
    }

    handleInputChange("variantOptions", updatedOptions);
  };

  const toggleVariants = () => {
    const newState = !formData.hasVariants;
    handleInputChange("hasVariants", newState);

    // If turning off, clear the options
    if (!newState) {
      handleInputChange("variantOptions", []);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-medium text-foreground">
            Product Options
          </h3>
          <p className="text-sm text-muted-foreground">
            Add available sizes and colors.
          </p>
        </div>
        <Button
          type="button"
          variant={formData.hasVariants ? "outline" : "default"}
          onClick={toggleVariants}
          className={
            !formData.hasVariants ? "bg-primary text-primary-foreground" : ""
          }
        >
          {formData.hasVariants ? (
            <>
              <Trash2 size={16} className="mr-2" /> Remove Options
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" /> Add Size & Color
            </>
          )}
        </Button>
      </div>

      {formData.hasVariants && (
        <div className="grid grid-cols-1 gap-6">
          {/* --- SIZE INPUT SECTION --- */}
          <AttributeInput
            label="Sizes"
            placeholder="Type size (e.g. S, M, L) and press Enter"
            values={getOptionValues("Size")}
            onAdd={(val) => handleAddValue("Size", val)}
            onRemove={(idx) => handleRemoveValue("Size", idx)}
          />

          {/* --- COLOR INPUT SECTION --- */}
          <AttributeInput
            label="Colors"
            placeholder="Type color (e.g. Red, Blue) and press Enter"
            values={getOptionValues("Color")}
            onAdd={(val) => handleAddValue("Color", val)}
            onRemove={(idx) => handleRemoveValue("Color", idx)}
          />
        </div>
      )}
    </div>
  );
}

// --- Sub-Component (unchanged logic) ---
function AttributeInput({
  label,
  placeholder,
  values,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onAdd: (val: string) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="bg-muted/20 p-5 rounded-lg border border-border">
      <label className="text-sm font-semibold text-foreground mb-3 block">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-2 p-3 bg-background border border-input rounded-md focus-within:ring-1 focus-within:ring-primary transition-all">
        {/* Render Tags */}
        {values.map((val, idx) => (
          <span
            key={idx}
            className="inline-flex items-center px-2.5 py-1 rounded-md text-sm bg-primary/10 text-primary font-medium border border-primary/20"
          >
            {val}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="ml-2 hover:text-destructive transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {/* Input Field */}
        <input
          className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-sm h-8 text-foreground placeholder:text-muted-foreground"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Press{" "}
        <kbd className="font-sans px-1 py-0.5 bg-muted border rounded text-xs">
          Enter
        </kbd>{" "}
        to add a {label.slice(0, -1).toLowerCase()}.
      </p>
    </div>
  );
}
