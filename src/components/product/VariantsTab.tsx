import React, { useState } from "react";
import {
  Plus,
  X,
  Trash2,
  AlertCircle,
  Copy,
  Settings2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Wand2,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import {
  ProductFormData,
  ProductVariant,
  VariantOption,
} from "@/src/app/(admin)/dashboard/products/add/page";

interface VariantsTabProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors: Record<string, string>;
}

export default function VariantsTab({
  formData,
  handleInputChange,
  errors,
}: VariantsTabProps) {
  // Local state for Inputs
  const [newOptionName, setNewOptionName] = useState("");
  const [inputValue, setInputValue] = useState<Record<number, string>>({});

  // UI State
  const [expandedVariant, setExpandedVariant] = useState<string | null>(null);
  const [bulkPrice, setBulkPrice] = useState<string>("");
  const [bulkStock, setBulkStock] = useState<string>("");

  // Toggle Accordion
  const toggleVariant = (id: string) => {
    setExpandedVariant(expandedVariant === id ? null : id);
  };

  // --- 1. CORE LOGIC: Cartesian Product & Smart Merge ---
  const handleGenerateVariations = () => {
    const options = formData.variantOptions;
    const currentVariants = formData.variants;

    // A. Filter valid options
    const validOptions = options.filter(
      (opt) => opt.values && opt.values.length > 0
    );

    if (validOptions.length === 0) {
      // If no valid options, clear variants
      handleInputChange("variants", []);
      return;
    }

    // B. Cartesian Product Function
    const cartesian = (a: any[], b: any[]): any[] =>
      a.flatMap((d: any) =>
        b.map((e: any) => (Array.isArray(d) ? [...d, e] : [d, e]))
      );

    const valuesArrays = validOptions.map((opt) =>
      opt.values.map((val) => ({ name: opt.name, value: val }))
    );

    // Calculate all possible combinations
    let combinations: any[] = valuesArrays[0];
    if (valuesArrays.length > 1) {
      combinations = valuesArrays.reduce((a, b) => cartesian(a, b));
    }

    // Normalize
    const normalizedCombinations =
      validOptions.length === 1
        ? combinations.map((c: any) => [c])
        : combinations;

    // C. Map to Variant Objects with Smart Merge
    const newVariants = (normalizedCombinations as any[][]).map((combo) => {
      const variantOptions = combo.reduce((acc, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const title = combo.map((c) => c.value).join(" / ");

      // --- MATCHING LOGIC (Preserve Data) ---

      // 1. Exact Match
      let matched = currentVariants.find((v) => {
        const vKeys = Object.keys(v.options || {});
        const newKeys = Object.keys(variantOptions);
        if (vKeys.length !== newKeys.length) return false;
        return vKeys.every((k) => v.options[k] === variantOptions[k]);
      });

      // 2. Partial Match (e.g. You added "Color" to existing "Size")
      if (!matched) {
        matched = currentVariants.find((v) => {
          const vOptions = v.options || {};
          // Check if the OLD variant's keys are a subset of the NEW variant
          // and the values match.
          return Object.keys(vOptions).every(
            (key) => variantOptions[key] === vOptions[key]
          );
        });
      }

      if (matched) {
        // Inherit Price, Stock, ID (if exact), SKU (if exact)
        const isExact =
          Object.keys(matched.options || {}).length ===
          Object.keys(variantOptions).length;
        return {
          id: isExact
            ? matched.id
            : `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title,
          sku: isExact
            ? matched.sku
            : `${formData.sku || "SKU"}-${title
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase()}`,
          price: matched.price,
          stock: matched.stock,
          options: variantOptions,
        };
      }

      // 3. Brand New Variant
      return {
        id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title,
        sku: `${formData.sku || "SKU"}-${title
          .replace(/[^a-zA-Z0-9]/g, "")
          .toUpperCase()}`,
        price: formData.price || 0,
        stock: formData.quantity || 0,
        options: variantOptions,
      };
    });

    handleInputChange("variants", newVariants);
  };

  // --- 2. OPTION HANDLERS ---

  const addOption = () => {
    if (!newOptionName.trim()) return;
    const newOption: VariantOption = {
      id: `opt-${Date.now()}`,
      name: newOptionName.trim(),
      values: [],
    };
    handleInputChange("variantOptions", [
      ...formData.variantOptions,
      newOption,
    ]);
    setNewOptionName("");
  };

  const removeOption = (id: string) => {
    handleInputChange(
      "variantOptions",
      formData.variantOptions.filter((o) => o.id !== id)
    );
  };

  const addValueToOption = (idx: number) => {
    const val = inputValue[idx]?.trim();
    if (!val) return;

    const updated = [...formData.variantOptions];
    if (!updated[idx].values.includes(val)) {
      updated[idx].values.push(val);
      handleInputChange("variantOptions", updated);
    }
    setInputValue({ ...inputValue, [idx]: "" });
  };

  const removeValueFromOption = (idx: number, val: string) => {
    const updated = [...formData.variantOptions];
    updated[idx].values = updated[idx].values.filter((v) => v !== val);
    handleInputChange("variantOptions", updated);
  };

  // --- 3. VARIANT FIELD HANDLERS ---

  const updateVariantField = (
    index: number,
    field: keyof ProductVariant,
    value: any
  ) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange("variants", updated);
  };

  const removeVariant = (index: number) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    handleInputChange("variants", updated);
  };

  const clearAllVariants = () => {
    if (confirm("Are you sure? This will delete all generated variants.")) {
      handleInputChange("variants", []);
    }
  };

  const applyBulkAction = () => {
    const updated = formData.variants.map((v) => ({
      ...v,
      price: bulkPrice ? parseFloat(bulkPrice) : v.price,
      stock: bulkStock ? parseInt(bulkStock) : v.stock,
    }));
    handleInputChange("variants", updated);
  };

  return (
    <div className="space-y-8">
      {/* --- SECTION A: ATTRIBUTES (OPTIONS) --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Attributes
            </h2>
            <p className="text-sm text-muted-foreground">
              Define your options (Size, Color) here.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableVariants"
              className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
              checked={formData.hasVariants}
              onChange={(e) => {
                handleInputChange("hasVariants", e.target.checked);
                if (!e.target.checked) {
                  handleInputChange("variantOptions", []);
                  handleInputChange("variants", []);
                }
              }}
            />
            <label
              htmlFor="enableVariants"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Enable Variants
            </label>
          </div>
        </div>

        {formData.hasVariants && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-top-2">
            {/* Option List */}
            {formData.variantOptions.map((option, idx) => (
              <div
                key={option.id}
                className="bg-card border border-border rounded-md p-4 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Option Name Header */}
                  <div className="w-full md:w-1/4 flex flex-row md:flex-col justify-between items-start border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0 md:pr-4">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Attribute
                      </span>
                      <h4 className="font-medium text-foreground text-base mt-1">
                        {option.name}
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(option.id)}
                      className="text-destructive hover:bg-destructive/10 h-8 px-2"
                    >
                      <Trash2 size={14} className="mr-1" /> Remove
                    </Button>
                  </div>

                  {/* Values Input Area */}
                  <div className="w-full md:w-3/4 pl-0 md:pl-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                      Values
                    </span>
                    <div className="flex flex-wrap gap-2 items-center">
                      {option.values.map((val) => (
                        <span
                          key={val}
                          className="inline-flex items-center px-3 py-1.5 rounded text-sm bg-primary/10 text-primary border border-primary/20"
                        >
                          {val}
                          <button
                            onClick={() => removeValueFromOption(idx, val)}
                            className="ml-2 hover:text-foreground opacity-70 hover:opacity-100"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                      <div className="relative">
                        <Input
                          className="h-9 w-40 text-sm bg-background"
                          placeholder="Add value..."
                          value={inputValue[idx] || ""}
                          onChange={(e) =>
                            setInputValue({
                              ...inputValue,
                              [idx]: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addValueToOption(idx);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Option Box */}
            <div className="bg-muted/30 border border-dashed border-border rounded-md p-4 flex items-center gap-4">
              <Input
                className="max-w-xs bg-background"
                placeholder="New Attribute Name (e.g. Material)"
                value={newOptionName}
                onChange={(e) => setNewOptionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addOption();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                disabled={!newOptionName}
              >
                <Plus size={16} className="mr-2" /> Add Attribute
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* --- SECTION B: VARIATIONS (WOOCOMMERCE STYLE) --- */}
      {formData.hasVariants && (
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Variations
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage price and stock for each combination.
              </p>
            </div>

            {/* The "Magic" Generate Button */}
            <Button
              type="button"
              onClick={handleGenerateVariations}
              className="bg-primary text-primary-foreground shadow-md"
            >
              <Wand2 size={16} className="mr-2" />
              Generate Variations
            </Button>
          </div>

          {/* Bulk Actions Toolbar */}
          {formData.variants.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-muted p-2 rounded-md border border-border">
              <span className="text-sm font-medium text-muted-foreground px-2">
                Bulk:
              </span>
              <Input
                placeholder="Price"
                type="number"
                className="w-24 h-8 text-sm bg-background"
                value={bulkPrice}
                onChange={(e) => setBulkPrice(e.target.value)}
              />
              <Input
                placeholder="Stock"
                type="number"
                className="w-24 h-8 text-sm bg-background"
                value={bulkStock}
                onChange={(e) => setBulkStock(e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={applyBulkAction}
                className="h-8"
              >
                <Copy size={14} className="mr-2" /> Apply
              </Button>
              <div className="flex-grow"></div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearAllVariants}
                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Variations List (Accordion Style) */}
          <div className="space-y-2">
            {formData.variants.map((variant, index) => {
              const isExpanded = expandedVariant === variant.id;
              return (
                <div
                  key={variant.id}
                  className={`border border-border rounded-md bg-card transition-all duration-200 ${
                    isExpanded
                      ? "ring-1 ring-primary border-primary shadow-sm"
                      : "hover:border-primary/50"
                  }`}
                >
                  {/* Accordion Header */}
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer select-none bg-card hover:bg-muted/20"
                    onClick={() => toggleVariant(variant.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">
                        {isExpanded ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                      <span className="font-semibold text-sm md:text-base text-foreground">
                        {variant.title}
                      </span>
                      {!isExpanded && (
                        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground ml-2">
                          <span className="bg-muted px-2 py-0.5 rounded border border-border">
                            SKU: {variant.sku}
                          </span>
                          <span className="bg-muted px-2 py-0.5 rounded border border-border">
                            ${variant.price}
                          </span>
                          <span
                            className={`${
                              variant.stock > 0
                                ? "text-green-600 bg-green-50"
                                : "text-red-600 bg-red-50"
                            } px-2 py-0.5 rounded border border-border`}
                          >
                            Stock: {variant.stock}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVariant(variant.id);
                        }}
                      >
                        {isExpanded ? "Close" : "Edit"}
                      </button>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-destructive p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeVariant(index);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="p-4 border-t border-border bg-background/50 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          SKU
                        </label>
                        <Input
                          value={variant.sku}
                          onChange={(e) =>
                            updateVariantField(index, "sku", e.target.value)
                          }
                          className="h-9 bg-background uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Regular Price ($)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "price",
                              parseFloat(e.target.value)
                            )
                          }
                          className="h-9 bg-background"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Stock Quantity
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={variant.stock}
                          onChange={(e) =>
                            updateVariantField(
                              index,
                              "stock",
                              parseInt(e.target.value)
                            )
                          }
                          className="h-9 bg-background"
                        />
                      </div>

                      {/* Placeholder for future expansion (Weight, Dimensions, etc.) */}
                      <div className="md:col-span-3 pt-2">
                        <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <AlertCircle size={12} />
                          Additional fields (Sale Price, Image, Weight) can be
                          added here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {formData.variants.length === 0 && (
            <div className="text-center py-12 border border-dashed border-border rounded-lg bg-muted/10">
              <RefreshCw className="mx-auto h-8 w-8 text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-sm font-medium text-foreground">
                No variations yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add attributes above, then click "Generate Variations".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
