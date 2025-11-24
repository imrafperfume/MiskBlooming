"use client";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { X, Plus, Upload, Image as ImageIcon } from "lucide-react"; // Optional: assuming you might have lucide-react, if not, text fallback is provided below

type SlideFormProps = {
  slide?: any;
  onSaved?: () => void;
};

export default function SlideFormDialog({ slide, onSaved }: SlideFormProps) {
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      order: 1,
      buttons: [],
      alignment: "center",
      published: false,
    },
  });

  const [preview, setPreview] = useState<string>("");
  const [buttons, setButtons] = useState<any[]>([]);

  useEffect(() => {
    if (slide) {
      reset(slide);
      setPreview(slide.imageUrl);
      setButtons(slide.buttons ?? []);
    }
  }, [slide, reset]);

  function addButton() {
    setButtons((prev) => [...prev, { text: "", link: "" }]);
  }

  function updateButton(i: number, field: string, value: string) {
    const cloned = [...buttons];
    cloned[i] = { ...cloned[i], [field]: value };
    setButtons(cloned);
  }

  function removeButton(i: number) {
    setButtons(buttons.filter((_, idx) => idx !== i));
  }

  /** Upload with Cloudinary function */
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading image...");

      const result = await uploadToCloudinary(file, {
        folder: "misk/hero", // optional
        tags: ["hero", "slider"],
      });

      setPreview(result.secure_url);
      setValue("imageUrl", result.secure_url);
      toast.success("Image uploaded ");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Upload failed ");
    } finally {
      toast.dismiss();
    }
  }

  async function onSubmit(values: any) {
    const payload = { ...values, buttons };

    const method = slide?.id ? "PUT" : "POST";
    const url = slide?.id ? `/api/hero-slides/${slide.id}` : `/api/hero-slides`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    toast.success(slide ? "Slide Updated " : "Slide Created ");
    onSaved?.();
  }

  // Shared input class styles
  const inputStyles =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const labelStyles =
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 py-2">
      {/* Header Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelStyles}>Title</label>
          <input
            {...register("title")}
            className={inputStyles}
            placeholder="Enter slide title"
          />
        </div>
        <div className="space-y-1">
          <label className={labelStyles}>Subtitle</label>
          <input
            {...register("subtitle")}
            className={inputStyles}
            placeholder="Enter slide subtitle"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelStyles}>Description</label>
        <textarea
          {...register("description")}
          className={`${inputStyles} min-h-[80px] py-3`}
          placeholder="Enter detailed description..."
        />
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2 rounded-lg border border-border p-4 bg-muted/30">
        <label className={labelStyles}>Background Image</label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {preview ? (
            <div className="relative shrink-0">
              <img
                src={preview}
                alt="preview"
                className="h-24 w-40 object-cover rounded-md border border-border shadow-sm"
              />
            </div>
          ) : (
            <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-muted">
              <span className="text-xs text-muted-foreground">No image</span>
            </div>
          )}

          <div className="w-full">
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="mt-1 text-[0.8rem] text-muted-foreground">
              Recommended size: 1920x1080px.
            </p>
          </div>
        </div>
        <input {...register("imageUrl")} type="hidden" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelStyles}>Order Priority</label>
          <input
            {...register("order")}
            type="number"
            className={inputStyles}
            placeholder="1"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center space-x-2 pt-6">
          <input
            type="checkbox"
            id="published"
            {...register("published")}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="published"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Publish to live site
          </label>
        </div>
      </div>

      {/* CTA Buttons Section */}
      <div className="space-y-3 rounded-lg border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold leading-none">
              Call to Actions
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Add buttons to your slide.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
            onClick={addButton}
          >
            + Add Button
          </button>
        </div>

        {buttons.length === 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground border border-dashed rounded-md">
            No buttons added yet.
          </div>
        )}

        <div className="space-y-3 mt-2">
          {buttons.map((b, i) => (
            <div
              key={i}
              className="flex gap-2 items-center animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="grid grid-cols-2 gap-2 w-full">
                <input
                  value={b.text}
                  className={inputStyles}
                  placeholder="Label (e.g., Learn More)"
                  onChange={(e) => updateButton(i, "text", e.target.value)}
                />
                <input
                  value={b.link}
                  className={inputStyles}
                  placeholder="URL (e.g., /products)"
                  onChange={(e) => updateButton(i, "link", e.target.value)}
                />
              </div>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => removeButton(i)}
                title="Remove button"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
