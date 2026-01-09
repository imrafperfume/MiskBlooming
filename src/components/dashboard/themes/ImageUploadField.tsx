import { CloudinaryFileUpload } from "@/src/components/ui/CloudinaryFileUpload";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadFieldProps {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder = "misk-blooming/content",
}: ImageUploadFieldProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      
      {value ? (
        <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border group">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <CloudinaryFileUpload
          onFilesUploaded={(files) => {
            if (files.length > 0) {
              onChange(files[0].url);
            }
          }}
          maxFiles={1}
          folder={folder}
          acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
        />
      )}
    </div>
  );
}
