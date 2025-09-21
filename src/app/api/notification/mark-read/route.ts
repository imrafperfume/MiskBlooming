import { prisma } from "@/src/lib/db";

export async function POST() {
  await prisma.notification.updateMany({
    where: { read: false },
    data: { read: true },
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
