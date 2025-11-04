import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(), // default in-memory cache
});

export async function yogaFetch<T>(
  query: any,
  variables?: Record<string, any>
): Promise<T> {
  const res = await fetch(process.env.YOGA_ENDPOINT as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: {
      revalidate: 120,
      tags: ["sitemap"],
    },
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Yoga GraphQL Error: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
