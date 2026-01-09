import { prisma } from "@/src/lib/db";

export const notificationResolvers = {
  Query: {
    getNotifications: async (_: any, { limit = 10 }: { limit: number }) => {
      try {
        const items = await prisma.notification.findMany({
          orderBy: { createdAt: "desc" },
          take: limit,
        });

        const unreadCount = await prisma.notification.count({
          where: { read: false },
        });

        return {
          items: items.map((item) => ({
            ...item,
            createdAt: item.createdAt.toISOString(),
          })),
          unreadCount,
        };
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new Error("Failed to fetch notifications");
      }
    },
  },

  Mutation: {
    markNotificationAsRead: async (_: any, { id }: { id: string }) => {
      try {
        const notification = await prisma.notification.update({
          where: { id },
          data: { read: true },
        });
        return {
          ...notification,
          createdAt: notification.createdAt.toISOString(),
        };
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw new Error("Failed to mark notification as read");
      }
    },

    markAllNotificationsAsRead: async () => {
      try {
        await prisma.notification.updateMany({
          where: { read: false },
          data: { read: true },
        });
        return true;
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw new Error("Failed to mark all notifications as read");
      }
    },
  },
};
