import { useQuery } from "@tanstack/react-query";
import { Category } from "../types";

const GRAPHQL_ENDPOINT = "/api/graphql"; // change this to your actual endpoint

export const useCategories = (selectedFields: string[] = []) => {
  return useQuery<Category[]>({
    queryKey: ["categories", selectedFields],
    queryFn: async (): Promise<Category[]> => {
      const fields =
        selectedFields.length > 0
          ? selectedFields.join(" ")
          : `id name description imageUrl`;

      const query = `
        query GetCategories {
          categories {
            ${fields}
          }
        }
      `;

      const res = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();

      if (json.errors) {
        throw new Error(json.errors[0].message);
      }

      return json.data.categories;
    },
  });
};
