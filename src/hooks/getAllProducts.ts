import { gql } from "@apollo/client";
import { client } from "../lib/graphql-client";

export async function getAllProducts(fields: any) {
    console.log(fields)
    const selectFields = fields.join("\n");
    console.log(selectFields)

    const GET_PRODUCTS = gql`
        query GetProducts {
            products {
                ${selectFields}
            }
        }
    `;

    try {
        const { data } = await client.query({
            query: GET_PRODUCTS,
            fetchPolicy: "cache-and-network" as any,
        });

        return data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}
