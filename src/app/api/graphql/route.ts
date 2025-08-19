import { getSessionUserId } from "@/src/lib/session"
import { createYoga } from "graphql-yoga"


const yoga = createYoga({
    schema: {},
    context: async ({ request }) => {
        const userId = await getSessionUserId();

        return userId
    }
})

export const GET = yoga
export const POST = yoga