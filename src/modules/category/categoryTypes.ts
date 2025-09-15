export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}
