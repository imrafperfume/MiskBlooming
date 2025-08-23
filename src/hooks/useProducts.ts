import { useQuery } from "@tanstack/react-query";
import type { Product } from "../types";

export function useProducts(selectedFields: string[] = []) {
  return useQuery({
    queryKey: ["products", selectedFields],
    queryFn: async (): Promise<Product[]> => {
      // Default fields if nothing selected
      const fields = selectedFields.length
        ? selectedFields.join("\n")
        : `
          id
          name
          slug
          price
          featured
          images { url }
        `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetProducts {
              products {
                ${fields}
              }
            }
          `,
        }),
      });

      const { data, errors } = await res.json();
      if (errors) throw new Error(errors[0].message);

      return data.products as Product[];
    },
  });
}

export function useProduct(slug: string, selectedFields: string[] = []) {
  return useQuery({
    queryKey: ["product", slug, selectedFields],
    queryFn: async (): Promise<Product | null> => {
      if (!slug) return null;

      const fields = selectedFields.length
        ? selectedFields.join("\n")
        : `
          id
          name
          slug
          description
          price
          compareAtPrice
          category
          images { url }
          featured
        `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetProduct($slug: String!) {
              productById(slug: $slug) {
                ${fields}
              }
            }
          `,
          variables: { slug },
        }),
      });

      const { data, errors } = await res.json();
      if (errors) throw new Error(errors[0].message);

      return data?.productById || null;
    },
    enabled: !!slug,
  });
}
export function useFeaturedProducts(selectedFields: string[] = []) {
  return useQuery({
    queryKey: ["featured-products", selectedFields],
    queryFn: async (): Promise<Product[]> => {
      const fields = selectedFields.length
        ? selectedFields.join("\n")
        : `
          id
          name
          slug
          price
          compareAtPrice
          category
          images { url  }
          featured
        `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query FeaturedProducts {
              products(where: { featured: true }) {
                ${fields}
              }
            }
          `,
        }),
      });

      const { data, errors } = await res.json();
      if (errors) throw new Error(errors[0].message);

      return data.products as Product[];
    },
  });
}

