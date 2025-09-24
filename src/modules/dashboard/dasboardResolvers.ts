import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";
import { redis } from "@/src/lib/redis"; // Redis client

export const DashboardResolvers = {
  Query: {
    dashboardMetrics: async (
      _: any,
      args: { timeRange?: number },
      context: { userId: string }
    ) => {
      const timeRange = args.timeRange || 7; // default last 7 days
      const { userId } = context;

      if (!userId) throw new Error("user ID not found");

      const userRole = await isAdmin(userId);
      if (userRole.role !== "ADMIN") throw new Error("Not authorized");

      const cacheKey = `dashboard:metrics:${timeRange}`;
      const cached = await redis.get(cacheKey);
      if (cached) return cached;

      try {
        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - timeRange);
        startDate.setHours(0, 0, 0, 0);

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(todayStart.getDate() - 1);

        // Parallel queries
        const [
          revenueAgg,
          revenueYesterdayAgg,
          totalOrders,
          ordersYesterday,
          totalCustomers,
          customersYesterday,
          activeProducts,
          productsYesterday,
          pendingOrders,
          lowStockItems,
          newReviews,
          completedToday,
          recentOrdersRaw,
          topProductStats,
        ] = await prisma.$transaction([
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { createdAt: { gte: startDate, lte: now } },
          }),
          prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
          }),
          prisma.order.count({
            where: { createdAt: { gte: startDate, lte: now } },
          }),
          prisma.order.count({
            where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
          }),
          prisma.user.count({ where: { role: { in: ["USER", "GUEST"] } } }),
          prisma.user.count({
            where: {
              role: "USER",
              createdAt: { gte: yesterdayStart, lt: todayStart },
            },
          }),
          prisma.product.count({ where: { status: "active" } }),
          prisma.product.count({
            where: {
              status: "active",
              createdAt: { gte: yesterdayStart, lt: todayStart },
            },
          }),
          prisma.order.count({ where: { status: "PENDING" } }),
          prisma.product.count({ where: { quantity: { lte: 10 } } }),
          prisma.review.count({ where: { createdAt: { gte: startDate } } }),
          prisma.order.count({
            where: { status: "DELIVERED", createdAt: { gte: todayStart } },
          }),
          prisma.order.findMany({
            where: { createdAt: { gte: startDate, lte: now } },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { user: true, items: { include: { product: true } } },
          }),
          prisma.orderItem.groupBy({
            by: ["productId"],
            _count: { id: true },
            _sum: { quantity: true },
            orderBy: { _count: { id: "desc" } },
            take: 5,
          }),
        ]);

        // Growth calculations
        const totalRevenue = revenueAgg._sum.totalAmount || 0;
        const revenueYesterday = revenueYesterdayAgg._sum.totalAmount || 0;
        const revenueGrowth =
          revenueYesterday > 0
            ? ((totalRevenue - revenueYesterday) / revenueYesterday) * 100
            : 0;
        const ordersGrowth =
          ordersYesterday > 0
            ? ((totalOrders - ordersYesterday) / ordersYesterday) * 100
            : 0;
        const customersGrowth =
          customersYesterday > 0
            ? ((totalCustomers - customersYesterday) / customersYesterday) * 100
            : 0;
        const productsGrowth =
          productsYesterday > 0
            ? ((activeProducts - productsYesterday) / productsYesterday) * 100
            : 0;

        // Recent Orders
        const recentOrders = recentOrdersRaw.map((o) => ({
          id: o.id,
          orderNumber: o.id,
          total: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt,
          customer: o.user
            ? { id: o.user.id, name: `${o.user.firstName} ${o.user.lastName}` }
            : { id: "unknown", name: "Unknown Customer" },
          items: o.items.map((i) => ({
            quantity: i.quantity,
            product: {
              id: i.product.id,
              name: i.product.name,
              price: i.product.price,
            },
          })),
        }));

        // Top Products with growth
        const productIds = topProductStats.map((p) => p.productId);
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
        });

        const topProducts = await Promise.all(
          topProductStats.map(async (p) => {
            const product = products.find((pr) => pr.id === p.productId)!;
            const currentRevenue =
              (p._sum?.quantity || 0) * (product?.price || 0);

            // Yesterday revenue for growth
            const yesterdayRevenueAgg = await prisma.orderItem.aggregate({
              _sum: { quantity: true },
              where: {
                productId: p.productId,
                order: { createdAt: { gte: yesterdayStart, lt: todayStart } },
              },
            });
            const yesterdayRevenue =
              (yesterdayRevenueAgg._sum.quantity || 0) * (product?.price || 0);
            const growthPercent =
              yesterdayRevenue > 0
                ? ((currentRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
                : 0;

            return {
              id: product.id,
              name: product.name,
              sales: (p._count as any).id || 0,
              revenue: currentRevenue,
              growthPercent: parseFloat(growthPercent.toFixed(1)),
            };
          })
        );

        const metrics = {
          totalRevenue,
          revenueGrowth: parseFloat(revenueGrowth.toFixed(1)),
          totalOrders,
          ordersGrowth: parseFloat(ordersGrowth.toFixed(1)),
          activeProducts,
          productsGrowth: parseFloat(productsGrowth.toFixed(1)),
          totalCustomers,
          customersGrowth: parseFloat(customersGrowth.toFixed(1)),
          pendingOrders,
          lowStockItems,
          newReviews,
          completedToday,
          recentOrders,
          topProducts,
        };

        // Cache for 30 sec
        await redis.set(cacheKey, JSON.stringify(metrics), { ex: 30 });

        return metrics;
      } catch (error: any) {
        console.error("Dashboard resolver error:", error);
        throw new Error("Failed to fetch dashboard data");
      }
    },
  },
};
