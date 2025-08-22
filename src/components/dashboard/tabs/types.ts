import { ProductFormData } from "@/src/app/(admin)/dashboard/products/add/page";
import { getResponsiveImageUrls } from "@/src/lib/cloudinary";

type CloudinaryFile = {
    url: string;
    publicId: string;
};
export interface TabProps {
    formData: ProductFormData;
    handleInputChange: (field: keyof ProductFormData, value: any) => void;
    errors?: Record<string, string>;
    categories?: { value: string; label: string; subcategories?: string[] }[];
    selectedCategory?: { value: string; label: string; subcategories: string[] };
    removeTag?: (tag: string) => void;
    newTag?: string;
    setNewTag?: (tag: string) => void;
    addTag?: () => void;
    handleDimensionChange?: (
        dimension: "weight" | "length" | "width" | "height",
        value: number
    ) => void;
    handleImagesUploaded?: (newImages: CloudinaryFile[]) => void | undefined
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
