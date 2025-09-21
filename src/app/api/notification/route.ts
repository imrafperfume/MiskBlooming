import { prisma } from "@/src/lib/db";

export async function GET(req: Request) {
  let lastId: string | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        if (req.signal.aborted) {
          clearInterval(interval);
          controller.close();
          return;
        }

        try {
          const notifications = await prisma.notification.findMany({
            where: { id: { gt: lastId || "" } },
            orderBy: { createdAt: "asc" },
          });

          for (const n of notifications) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({
                  id: n.id,
                  type: n.type,
                  message: n.message,
                  read: n.read,
                  createdAt: n.createdAt,
                })}\n\n`
              )
            );
            lastId = n.id;
          }
        } catch (err) {
          console.error("SSE Error:", err);
        }
      }, 2000);

      // cleanup on abort
      req.signal.addEventListener("abort", () => clearInterval(interval));
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
