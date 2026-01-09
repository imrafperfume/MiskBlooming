import { prisma } from "@/src/lib/db";
import { isAdmin } from "@/src/lib/isAdmin";

export const membershipResolvers = {
  Query: {
    membershipCards: async (_: any, __: any, context: { userId: string }) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("Unauthorized");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        return await prisma.membershipCard.findMany({
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        });
      } catch (error: any) {
        console.error("Membership Cards Error:", error);
        throw new Error(error.message || "Failed to fetch membership cards");
      }
    },
    membershipCard: async (_: any, { id }: { id: string }, context: { userId: string }) => {
       try {
        if (!context.userId) throw new Error("Unauthorized");
         return await prisma.membershipCard.findUnique({
           where: { id },
           include: { user: true },
         });
       } catch (error) {
         throw new Error("Failed to fetch membership card");
       }
    },
      userMembershipCard: async (_: any, { userId }: { userId: string }, context: { userId: string }) => {
        try {
            if (!context.userId) throw new Error("Unauthorized");
             // Users can see their own card, Admins can see anyone's
            if (context.userId !== userId) {
                 const userRole = await isAdmin(context.userId);
                 if (userRole.role !== "ADMIN") throw new Error("Not authorized");
            }

            return await prisma.membershipCard.findUnique({
                where: { userId },
                include: { user: true },
            });
        } catch (error) {
            throw new Error("Failed to fetch user membership card");
        }
    }
  },
  Mutation: {
    createMembershipCard: async (
      _: any,
      { input }: { input: any },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("Unauthorized");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const user = await prisma.user.findUnique({
             where: { email: input.email }
        });

        if (!user) {
             throw new Error(`User with email ${input.email} not found`);
        }

        const existingCard = await prisma.membershipCard.findUnique({
            where: { userId: user.id }
        });
        
        if (existingCard) {
            throw new Error("User already has a membership card");
        }

        return await prisma.membershipCard.create({
          data: {
            cardNumber: input.cardNumber,
            cardHolderName: input.cardHolderName,
            expirationDate: new Date(input.expirationDate),
            membershipType: input.membershipType,
            user: {
                connect: { id: user.id }
            }
          },
          include: {
            user: true,
          },
        });
      } catch (error: any) {
        console.error(error);
        throw new Error(error.message || "Failed to create membership card");
      }
    },
    updateMembershipCard: async (
      _: any,
      { input }: { input: any },
      context: { userId: string }
    ) => {
      try {
        const { userId } = context;
        if (!userId) throw new Error("Unauthorized");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        const { id, ...data } = input;

        return await prisma.membershipCard.update({
          where: { id },
          data: {
            ...data,
            expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
          },
          include: {
            user: true,
          },
        });
      } catch (error) {
        throw new Error("Failed to update membership card");
      }
    },
    deleteMembershipCard: async (
      _: any,
      { id }: { id: string },
      context: { userId: string }
    ) => {
      // ... (existing delete implementation)
      try {
        const { userId } = context;
        if (!userId) throw new Error("Unauthorized");
        const userRole = await isAdmin(userId);
        if (userRole.role !== "ADMIN") throw new Error("Not authorized");

        return await prisma.membershipCard.delete({
          where: { id },
          include: { user: true },
        });
      } catch (error) {
        throw new Error("Failed to delete membership card");
      }
    },
    sendMembershipCard: async (
      _: any,
      { id }: { id: string },
      context: { userId: string }
    ) => {
        try {
            const { userId } = context;
            if (!userId) throw new Error("Unauthorized");
            const userRole = await isAdmin(userId);
            if (userRole.role !== "ADMIN") throw new Error("Not authorized");

            const card = await prisma.membershipCard.findUnique({
                where: { id },
                include: { user: true }
            });

            if (!card || !card.user) {
                throw new Error("Card or user not found");
            }

            const { sendMembershipCardEmail } = require("@/src/lib/email");
            await sendMembershipCardEmail(card, card.user);
            
            return true;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message || "Failed to send email");
        }
    }
  },
};
