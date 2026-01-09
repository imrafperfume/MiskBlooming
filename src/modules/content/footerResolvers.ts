import { prisma } from "@/src/lib/db";

export const footerResolvers = {
  Query: {
    getFooterContent: async () => {
      let footer = await (prisma as any).footerContent.findFirst({
        where: { id: "FOOTER" },
      });

      if (!footer) {
        // Create default if not exists
        footer = await (prisma as any).footerContent.create({
          data: {
            id: "FOOTER",
            footerLinks: [
              {
                title: "Shop",
                links: [
                  { name: "Fresh Flowers", href: "/products?category=roses" },
                  { name: "Premium Chocolates", href: "/products?category=chocolates" },
                  { name: "Fresh Cakes", href: "/products?category=cakes" },
                  { name: "Gift Sets", href: "/products?category=gift-sets" },
                  { name: "Indoor Plants", href: "/products?category=plants" },
                ],
              },
              {
                title: "Occasions",
                links: [
                  { name: "Valentine's Day", href: "/occasions/valentines" },
                  { name: "Mother's Day", href: "/occasions/mothers-day" },
                  { name: "Birthdays", href: "/occasions/birthday" },
                  { name: "Anniversaries", href: "/occasions/anniversary" },
                  { name: "Congratulations", href: "/occasions/congratulations" },
                ],
              },
              {
                title: "Services",
                links: [
                  { name: "Same-Day Delivery", href: "/delivery" },
                  { name: "Custom Arrangements", href: "/custom" },
                  { name: "Corporate Orders", href: "/corporate" },
                  { name: "Subscription Service", href: "/subscription" },
                  { name: "Gift Cards", href: "/gift-cards" },
                ],
              },
              {
                title: "Support",
                links: [
                  { name: "Contact Us", href: "/contact" },
                  { name: "Track Order", href: "/track" },
                  { name: "Care Instructions", href: "/care" },
                  { name: "Return Policy", href: "/returns" },
                  { name: "FAQ", href: "/faq" },
                ],
              },
            ],
          },
        });
      }

      return footer;
    },
  },

  Mutation: {
    updateFooterContent: async (_: any, { input }: any) => {
      // Ensure it exists first (though getFooterContent usually handles init, direct mutation calls might need this)
      const existing = await (prisma as any).footerContent.findFirst({ where: { id: "FOOTER" } });
      
      if (!existing) {
         // Create with defaults merged with input
         return await (prisma as any).footerContent.create({
             data: {
                 id: "FOOTER",
                 ...input,
                 footerLinks: input.footerLinks || [], // Fallback if not provided in create
             }
         });
      }

      return await (prisma as any).footerContent.update({
        where: { id: "FOOTER" },
        data: {
            ...input,
            // Explicitly set Json if provided, otherwise standard update rules apply
        },
      });
    },
  },
};
