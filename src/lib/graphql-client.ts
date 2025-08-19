import { ApolloClient, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(), // default in-memory cache
})

// const { data } = await client.query({
//     query: GET_PRODUCTS,
//     fetchPolicy: "cache-and-network",
// })