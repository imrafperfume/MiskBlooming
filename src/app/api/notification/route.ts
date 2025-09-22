import { prisma } from "@/src/lib/db";

export async function GET(req: Request) {
  let lastId: string | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        // stop if client disconnected
        if (req.signal.aborted) {
          clearInterval(interval);
          try {
            controller.close();
          } catch {}
          return;
        }

        try {
          const notifications = await prisma.notification.findMany({
            where: { id: { gt: lastId || "" } },
            orderBy: { createdAt: "asc" },
          });

          for (const n of notifications) {
            if (req.signal.aborted) break;
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({
                  id: n.id,
                  type: n.type,
                  message: n.message,
                  read: n.read,
                  createdAt: n.createdAt,
                  orderId: n.orderId,
                })}\n\n`
              )
            );
            lastId = n.id;
          }
        } catch (err) {
          console.error("SSE Error:", err);
        }
      }, 2000);

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
