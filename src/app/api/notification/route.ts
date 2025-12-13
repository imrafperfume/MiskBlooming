import { prisma } from "@/src/lib/db";

export async function GET(req: Request) {
  let lastId: string | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      const interval = setInterval(async () => {
        // Stop if client disconnected
        if (req.signal.aborted) {
          clearInterval(interval);
          try {
            controller.close();
          } catch {}
          return;
        }

        try {
          // Safe lastId handling
          const where = lastId ? { id: { gt: lastId } } : {};
          const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: "asc" },
          });

          // Send each notification to client
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
          // Optional: send error to client
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                error: "Failed to fetch notifications",
              })}\n\n`
            )
          );
        }
      }, 2000);

      // Clean up on abort
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
