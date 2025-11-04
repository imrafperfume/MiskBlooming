import { User } from "../hooks/useAuth";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  productId: string;
  user: User;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  featuredImage: number;
  images: { url: string; publicId?: string }[]; // better structure
  category: string;
  subcategory?: string;
  tags: string[];
  quantity: number; // stock quantity
  lowStockThreshold?: number;
  featured: boolean;
  careInstructions?: string[];
  deliveryInfo?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status?: "draft" | "active" | "archived";
  Review: Review[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number }[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  image: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttons: {
    text: string;
    link: string;
  };
  order: number;
  published: boolean;
}
