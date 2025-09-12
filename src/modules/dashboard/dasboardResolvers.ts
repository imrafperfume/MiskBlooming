import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";

export const DashboardResolvers = {
  Query: {
    dashboardMetrics: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("user ID not found");

        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        // Date ranges
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(todayStart.getDate() - 1);

        // Total Revenue
        const revenueCurrentAgg = await prisma.order.aggregate({
          _sum: { totalAmount: true },
        });
        const revenueYesterdayAgg = await prisma.order.aggregate({
          _sum: { totalAmount: true },
          where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
        });

        const totalRevenue = revenueCurrentAgg._sum.totalAmount || 0;
        const revenueYesterday = revenueYesterdayAgg._sum.totalAmount || 0;
        const revenueGrowth =
          revenueYesterday > 0
            ? ((totalRevenue - revenueYesterday) / revenueYesterday) * 100
            : 0;

        // Orders
        const totalOrders = await prisma.order.count();
        const ordersYesterday = await prisma.order.count({
          where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
        });
        const ordersGrowth =
          ordersYesterday > 0
            ? ((totalOrders - ordersYesterday) / ordersYesterday) * 100
            : 0;

        // Customers
        const totalCustomers = await prisma.user.count({
          where: {
            role: {
              in: ["USER", "GUEST"],
            },
          },
        });
        const customersYesterday = await prisma.user.count({
          where: {
            role: "USER",
            createdAt: { gte: yesterdayStart, lt: todayStart },
          },
        });
        const customersGrowth =
          customersYesterday > 0
            ? ((totalCustomers - customersYesterday) / customersYesterday) * 100
            : 0;

        // Active Products
        const activeProducts = await prisma.product.count({
          where: { status: "active" },
        });
        const productsYesterday = await prisma.product.count({
          where: {
            status: "active",
            createdAt: { gte: yesterdayStart, lt: todayStart },
          },
        });
        const productsGrowth =
          productsYesterday > 0
            ? ((activeProducts - productsYesterday) / productsYesterday) * 100
            : 0;

        // Pending Orders
        const pendingOrders = await prisma.order.count({
          where: { status: "PENDING" },
        });

        // Low Stock Items
        const lowStockItems = await prisma.product.count({
          where: { quantity: { lte: 10 } },
        });

        // New Reviews
        const newReviews = await prisma.review.count({
          where: { createdAt: { gte: todayStart } },
        });

        // Completed Today
        const completedToday = await prisma.order.count({
          where: { status: "DELIVERED", createdAt: { gte: todayStart } },
        });

        // Recent Orders
        const recentOrdersRaw = await prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: true, items: { include: { product: true } } },
        });

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

        // Top Products
        const topProductStats = await prisma.orderItem.groupBy({
          by: ["productId"],
          _count: { id: true },
          _sum: { quantity: true },
          orderBy: { _count: { id: "desc" } },
          take: 5,
        });

        const topProducts = await Promise.all(
          topProductStats.map(async (p) => {
            const product = await prisma.product.findUnique({
              where: { id: p.productId },
            });

            const yesterdayRevenueAgg = await prisma.orderItem.aggregate({
              _sum: { quantity: true },
              where: {
                productId: p.productId,
                order: { createdAt: { gte: yesterdayStart, lt: todayStart } },
              },
            });
            const yesterdayRevenue =
              (yesterdayRevenueAgg._sum.quantity || 0) * (product?.price || 0);
            const currentRevenue =
              (p._sum.quantity || 0) * (product?.price || 0);

            const growthPercent =
              yesterdayRevenue > 0
                ? ((currentRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
                : 0;

            return {
              id: product!.id,
              name: product!.name,
              sales: p._count.id,
              revenue: currentRevenue,
              growthPercent: parseFloat(growthPercent.toFixed(1)),
            };
          })
        );

        return {
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
      } catch (error: any) {
        console.error("Dashboard resolver error:", error);
        throw new Error("Failed to fetch dashboard data");
      }
    },
  },
};
