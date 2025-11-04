import { ProductFormData } from "@/src/app/(admin)/dashboard/products/add/page";
import { getResponsiveImageUrls } from "@/src/lib/cloudinary";

type CloudinaryFile = {
  url: string;
  publicId: string;
};
type SubCategory = {
  id: string;
  name: string;
};
export interface TabProps {
  formData: ProductFormData;
  handleInputChange: (field: keyof ProductFormData, value: any) => void;
  errors?: Record<string, string>;
  categories?: {
    id: string;
    name: string;
    description?: string;
    subcategories?: SubCategory[];
  }[];
  selectedCategory?: {
    id: string;
    name: string;
    desription?: string | undefined;
    subcategories?: string[] | undefined;
  };
  removeTag?: (tag: string) => void;
  newTag?: string;
  setNewTag?: (tag: string) => void;
  addTag?: () => void;
  handleDimensionChange?: (
    dimension: "weight" | "length" | "width" | "height",
    value: number
  ) => void;
  handleImagesUploaded?: (newImages: CloudinaryFile[]) => void | undefined;
  removeKeyword?: (keyword: string) => void;
  newKeyword?: string;
  addKeyword?: () => void;
  setNewKeyword?: (keyword: string) => void;
  deliveryTimes?: { value: string; label: string }[];
  deliveryZones?: string[];
  toggleDeliveryZone?: (zone: string) => void;
  occasionsList?: string[];
  toggleOccasion?: (occasion: string) => void;
}
