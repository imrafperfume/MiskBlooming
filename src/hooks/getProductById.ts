import { gql } from "@apollo/client";
import { client } from "../lib/graphql-client";

export async function getProductById(fields: any) {
    console.log(fields)
    const selectFields = fields.join("\n");

    const GET_PRODUCT_BY_ID = gql`
        query GetProducts($id:String!) {
            product(id:$id) {
                ${selectFields}
            }
        }
    `;

    try {
        const { data } = await client.query({
            query: GET_PRODUCT_BY_ID,
            fetchPolicy: "cache-and-network" as any,
        });

        return data.products;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}
