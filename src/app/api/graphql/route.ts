import { getSessionUserId } from "@/src/lib/session"
import { createSchema, createYoga } from "graphql-yoga"
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { ProductResolvers } from "@/src/graphql/resolvers/productResolvers";
import { ProductTypeDefs } from "@/src/graphql/schema/product-typedefs";
import { IResolvers } from "@graphql-tools/utils";
import { YogaInitialContext } from "graphql-yoga";
const typeDefs = mergeTypeDefs([
    `
    type Query {
      _empty: String
    }
    type Mutation {
      _empty: String
    }
  `,
    ProductTypeDefs,
]);

// const resolvers = mergeResolvers([ProductResolvers]);

interface ContextType {
    userId: string | null;
}

const resolvers = mergeResolvers([ProductResolvers]) as IResolvers<any, ContextType & YogaInitialContext>;

const schema = createSchema<ContextType>({
    typeDefs,
    resolvers,
});

const yoga = createYoga<ContextType>({
    schema,
    context: async ({ request }) => {
        console.log("Context called");

        try {
            const userId = await getSessionUserId();
            console.log("yoga ID", userId);
            return { userId };
        } catch (error: any) {
            console.error(error);
            throw new Error("Internal Server Error");
        }
    },
    graphiql: true,
});

export const GET = yoga;
export const POST = yoga;
