import { gql } from "@apollo/client";

export const InvoiceTypeDefs = gql`
  enum InvoiceStatus {
    DRAFT
    SENT
    PAID
    OVERDUE
    CANCELLED
  }

  enum ReportType {
    SALES_SUMMARY
    PAYMENT_ANALYSIS
    CUSTOMER_ANALYSIS
    PRODUCT_PERFORMANCE
    MONTHLY_REVENUE
    QUARTERLY_REPORT
    YEARLY_REPORT
  }

  input CreateInvoiceInput {
    orderId: String!
    dueDate: String
    discount: Float
    notes: String
    terms: String
  }

  input UpdateInvoiceInput {
    status: InvoiceStatus
    dueDate: String
    discount: Float
    notes: String
    terms: String
  }

  input CreatePaymentInput {
    invoiceId: String!
    amount: Float!
    paymentMethod: String!
    reference: String
    notes: String
  }

  input ReportFilterInput {
    startDate: String
    endDate: String
    status: InvoiceStatus
    paymentStatus: PaymentStatus
  }

  type Invoice {
    id: ID!
    invoiceNumber: String!
    orderId: String!
    order: Order!
    issueDate: String!
    dueDate: String
    status: InvoiceStatus!
    subtotal: Float!
    taxRate: Float!
    taxAmount: Float!
    discount: Float!
    totalAmount: Float!
    paymentStatus: PaymentStatus!
    paidAt: String
    paymentMethod: String
    notes: String
    terms: String
    createdAt: String!
    updatedAt: String!
    payments: [Payment!]!
  }

  type Payment {
    id: ID!
    invoiceId: String!
    amount: Float!
    paymentDate: String!
    paymentMethod: String!
    reference: String
    notes: String
    createdAt: String!
  }

  type InvoiceReport {
    id: ID!
    invoiceId: String!
    reportType: ReportType!
    generatedAt: String!
    data: JSON!
    createdAt: String!
  }

  type InvoiceStats {
    totalInvoices: Int!
    draft: Int!
    sent: Int!
    paid: Int!
    overdue: Int!
    cancelled: Int!
    totalRevenue: Float!
    pendingAmount: Float!
    overdueAmount: Float!
  }

  type ReportData {
    period: String!
    totalRevenue: Float!
    totalInvoices: Int!
    paidInvoices: Int!
    pendingInvoices: Int!
    averageOrderValue: Float!
    topProducts: [ProductPerformance!]!
    customerStats: CustomerStats!
    paymentMethods: [PaymentMethodStats!]!
  }

  type ProductPerformance {
    productId: String!
    productName: String!
    quantity: Int!
    revenue: Float!
  }

  type CustomerStats {
    totalCustomers: Int!
    newCustomers: Int!
    returningCustomers: Int!
  }

  type PaymentMethodStats {
    method: String!
    count: Int!
    amount: Float!
  }

  type Query {
    allInvoices: [Invoice!]!
    invoiceById(id: ID!): Invoice
    invoiceByNumber(invoiceNumber: String!): Invoice
    invoiceStats: InvoiceStats!
    generateReport(reportType: ReportType!, filter: ReportFilterInput): ReportData!
    invoiceReports: [InvoiceReport!]!
  }

  type Mutation {
    createInvoice(input: CreateInvoiceInput!): Invoice!
    updateInvoice(id: ID!, input: UpdateInvoiceInput!): Invoice!
    deleteInvoice(id: ID!): Boolean!
    sendInvoice(id: ID!): Invoice!
    markInvoicePaid(id: ID!): Invoice!
    createPayment(input: CreatePaymentInput!): Payment!
    generateInvoicePDF(id: ID!): String! # Returns PDF URL
    generateReportPDF(reportType: ReportType!, filter: ReportFilterInput): String! # Returns PDF URL
  }
`;
