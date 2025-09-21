"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource("/api/notification/");

    eventSource.onmessage = (event) => {
      const data: Notification = JSON.parse(event.data);
      console.log("🚀 ~ useNotifications ~ data:", data);

      // Only trigger toast/audio if unread
      if (!data.read) {
        // Play audio
        const audio = new Audio("/bell.mp3");
        audio.play().catch(() => {});

        // Show toast via Sonner
        toast(`${data.message}`, {
          description: new Date(data.createdAt).toLocaleTimeString(),
        });
      }

      setNotifications((prev) => [data, ...prev]);
      if (!data.read) setUnreadCount((prev) => prev + 1);
    };

    return () => eventSource.close();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notification/mark-read", { method: "POST" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark notifications read:", err);
    }
  };

  return { notifications, unreadCount, markAllRead };
}
