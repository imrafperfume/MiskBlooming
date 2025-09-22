"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    __VAPID_PUBLIC_KEY?: string;
  }
}

// helper base64 -> Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function usePush() {
  useEffect(() => {
    const setup = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        // register service worker
        const reg = await navigator.serviceWorker.register("/sw.js");
        // request permission
        const perm = await Notification.requestPermission();
        if (perm !== "granted") return;

        // subscribe
        const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!vapidPublic) {
          console.warn("VAPID public key missing; skipping push subscription");
          return;
        }
        const sub =
          (await reg.pushManager.getSubscription()) ||
          (await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublic),
          }));

        // send to backend
        await fetch("/api/save-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sub),
        });
      } catch (err) {
        console.warn("Push setup failed:", err);
      }
    };

    setup();
  }, []);
}
