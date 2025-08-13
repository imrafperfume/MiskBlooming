import { useQuery } from "@tanstack/react-query"
import type { Product } from "../types"
import productsData from "../data/products.json"

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      return productsData as Product[]
    },
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      const product = productsData.find((p) => p.id === id)
      return (product as Product) || null
    },
    enabled: !!id,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async (): Promise<Product[]> => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      return (productsData as Product[]).filter((product) => product.featured)
    },
  })
}
