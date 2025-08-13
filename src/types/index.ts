export interface Product {
  id: string
  name: string
  description: string
  longDescription: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  tags: string[]
  inStock: boolean
  featured: boolean
  rating: number
  reviewCount: number
  specifications?: Record<string, string>
  care_instructions?: string[]
  delivery_info?: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
}

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  monthlyRevenue: { month: string; revenue: number }[]
  topProducts: { name: string; sales: number }[]
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  content: string
  rating: number
  image: string
}

export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  cta: {
    text: string
    link: string
  }
}
