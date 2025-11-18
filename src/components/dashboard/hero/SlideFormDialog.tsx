"use client";
import { uploadToCloudinary } from "@/src/lib/cloudinary";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

  /**Upload with Cloudinary function */
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("title")}
        className="w-full p-2 border rounded"
        placeholder="Title"
      />
      <input
        {...register("subtitle")}
        className="w-full p-2 border rounded"
        placeholder="Subtitle"
      />
      <textarea
        {...register("description")}
        className="w-full p-2 border rounded"
        placeholder="Description"
      />

      <div>
        <label className="block text-sm">Image</label>
        <input type="file" accept="image/*" onChange={onUpload} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-48 h-28 object-cover mt-2 rounded"
          />
        )}
        <input {...register("imageUrl")} type="hidden" />
      </div>
      <label className="block text-sm">Order (1 for first slide)</label>

      <input
        {...register("order")}
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Order (1 for first slide)"
      />

      {/* CTA Buttons */}
      <div>
        <div className="flex justify-between items-center">
          <h4 className="font-medium">CTA Buttons</h4>
          <button
            type="button"
            className="text-sm bg-primary  px-2 py-1 rounded"
            onClick={addButton}
          >
            + Add
          </button>
        </div>

        <div className="space-y-2 mt-2">
          {buttons.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={b.text}
                className="border p-2 rounded w-1/3"
                placeholder="Button text"
                onChange={(e) => updateButton(i, "text", e.target.value)}
              />
              <input
                value={b.link}
                className="border p-2 rounded w-2/3"
                placeholder="Button link"
                onChange={(e) => updateButton(i, "link", e.target.value)}
              />
              <button
                type="button"
                className="text-destructive"
                onClick={() => removeButton(i)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("published")} />
        <span className="text-sm">Published</span>
      </label>

      <button
        type="submit"
        className="bg-primary text-foreground px-4 py-2 rounded"
      >
        Save
      </button>
    </form>
  );
}
