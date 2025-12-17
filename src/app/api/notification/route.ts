import { prisma } from "@/src/lib/db";

export async function GET(req: Request) {
  let lastId: string | null = null;
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(async () => {
        if (closed || req.signal.aborted) {
          clearInterval(interval);
          try {
            controller.close();
          } catch {}
          return;
        }

        try {
          const where = lastId ? { id: { gt: lastId } } : {};

          const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: "asc" },
          });

          for (const n of notifications) {
            if (req.signal.aborted || closed) break;

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(n)}\n\n`)
            );

            lastId = n.id;
          }
        } catch (err) {
          if (!req.signal.aborted) {
            console.error("SSE Error:", err);
          }
        }
      }, 2000);

      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
