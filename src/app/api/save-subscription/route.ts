import { prisma } from "@/src/lib/db";

export async function POST(req: Request) {
  try {
    const sub = await req.json();

    // Basic validation
    if (!sub?.endpoint) {
      return new Response(JSON.stringify({ error: "Invalid subscription" }), {
        status: 400,
      });
    }

    await prisma.pushSubscription.upsert({
      where: { endpoint: sub.endpoint },
      update: { keys: sub.keys },
      create: { endpoint: sub.endpoint, keys: sub.keys },
    });

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (err) {
    console.error("save-subscription error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
