import { prisma } from "@/src/lib/db";
import { getWebPush } from "./webpush";

type PushPayload = { title: string; body: string; url?: string; data?: any };

export async function sendPushToAll(payload: PushPayload) {
  let webpush;
  try {
    webpush = getWebPush();
  } catch (err) {
    console.warn("WebPush not configured, skipping push sends.", err);
    return;
  }

  const subs = await prisma.pushSubscription.findMany();
  if (subs.length === 0) return;

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: sub.keys as any,
          },
          JSON.stringify(payload)
        );
      } catch (err: any) {
        // If subscription is gone/invalid, remove it
        const status = err?.statusCode || err?.status;
        console.warn("Push send error", status, err?.message || err);
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    })
  );
}
