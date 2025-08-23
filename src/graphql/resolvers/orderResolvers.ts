import { prisma } from "@/src/lib/db";

export interface OrderItemInput {
    productId: string;
    quantity: number;
    price: number;
}

export interface CreateOrderInput {
    userId: string;

    // Customer Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Shipping Address
    address: string;
    city: string;
    emirate: string;
    postalCode?: string;

    // Payment Info
    paymentMethod: "COD" | "STRIPE";
    stripePaymentId?: string; // Stripe intent/charge ID
    cardLast4?: string;       // Only for STRIPE

    // Delivery Options
    deliveryType: "STANDARD" | "EXPRESS" | "SCHEDULED";
    deliveryDate?: string;
    deliveryTime?: string;
    specialInstructions?: string;

    // Order Items
    items: OrderItemInput[];

    // Order Total
    totalAmount: number;
}



export const OrderResolvers = {
    Query: {

    },
    Mutation: {
        createOrder: async (_: any, { input }: { input: CreateOrderInput }) => {
            console.log(input)
            try {
                const order = await prisma.order.create({
                    data: {
                        ...input,
                        deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : null,
                        items: {
                            create: input.items.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price,
                            })),
                        },
                    },
                    include: {
                        items: true,
                    },
                });
                return order
            } catch (error) {
                console.error(error);
                throw new Error("Failed to create order");
            }
        }

    }
}