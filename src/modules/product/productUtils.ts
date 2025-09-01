// lib/db.ts
export async function getProductBySlug(slug: string) {
  const query = `
    query ProductBySlug($slug: String!) {
      productBySlug(slug: $slug) {
        id
        name
        slug
        category
        shortDescription
        description
        images {
          url
        }
        tags
      }
    }
  `;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/graphql` as string,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { slug },
      }),
      // Next.js cache control (optional)
      next: { revalidate: 60 },
    }
  );

  const json = await res.json();

  return json.data?.productBySlug || null;
}
