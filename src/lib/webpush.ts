import webpush from "web-push";

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (!PUBLIC || !PRIVATE) {
  // In production you should fail fast — but during build we may not have envs.
  console.warn("VAPID keys not set - web-push disabled until env provided.");
} else {
  webpush.setVapidDetails(SUBJECT, PUBLIC, PRIVATE);
}

export function getWebPush() {
  if (!PUBLIC || !PRIVATE) {
    throw new Error(
      "VAPID keys not configured (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)."
    );
  }
  return webpush;
}
