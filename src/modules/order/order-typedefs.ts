import { gql } from "@apollo/client";

export const OrderTypeDefs = gql`
  enum PaymentMethod {
    STRIPE
    COD
  }

  enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
  }

  enum DeliveryType {
    STANDARD
    EXPRESS
    SCHEDULED
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  input OrderItemInput {
    productId: String!
    quantity: Int!
    price: Float!
  }

  input CreateOrderInput {
    userId: String
    isGuest: Boolean
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    city: String!
    emirate: String!
    postalCode: String

    paymentMethod: PaymentMethod!
    stripePaymentId: String
    cardLast4: String

    deliveryType: DeliveryType!
    deliveryDate: String
    deliveryTime: String
    codFee: Float
    deliveryCost: Float
    vatAmount: Float
    discount: Float
    specialInstructions: String

    items: [OrderItemInput!]!
    couponCode: String
    totalAmount: Float!
  }

  type Order {
    id: ID!
    userId: String
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    address: String!
    city: String!
    emirate: String!
    postalCode: String

    paymentMethod: PaymentMethod!
    paymentStatus: PaymentStatus
    stripePaymentId: String
    cardLast4: String

    deliveryType: DeliveryType!
    deliveryDate: String
    deliveryTime: String
    codFee: Float
    deliveryCost: Float
    vatAmount: Float
    discount: Float
    specialInstructions: String

    status: OrderStatus
    totalAmount: Float!
    createdAt: String
    updatedAt: String

    items: [OrderItem!]!
    couponUsage: CouponUsage
  }

  type OrderItem {
    id: String!
    productId: String!
    quantity: Int!
    price: Float!
    product: Product!
  }
  type OrderStats {
    totalOrders: Int!
    pending: Int!
    processing: Int!
    cancelled: Int!
    shipped: Int!
    delivered: Int!
    revenue: Float!
  }

  type Query {
    allOrders: [Order!]!
    orderStats: OrderStats!
    orderById(id: ID!): Order
    ordersByUser(userId: String!): [Order!]!
  }

  type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(id: ID!, input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
  }
`;
