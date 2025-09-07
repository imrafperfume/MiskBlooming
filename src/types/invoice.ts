export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  order: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    emirate: string;
    postalCode?: string;
    items: Array<{
      id: string;
      productId: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        description?: string;
        image?: string;
      };
    }>;
  };
  issueDate: string;
  dueDate?: string;
  status: InvoiceStatus;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceReport {
  id: string;
  invoiceId: string;
  reportType: ReportType;
  generatedAt: string;
  data: any;
  createdAt: string;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum ReportType {
  SALES_SUMMARY = 'SALES_SUMMARY',
  PAYMENT_ANALYSIS = 'PAYMENT_ANALYSIS',
  CUSTOMER_ANALYSIS = 'CUSTOMER_ANALYSIS',
  PRODUCT_PERFORMANCE = 'PRODUCT_PERFORMANCE',
  MONTHLY_REVENUE = 'MONTHLY_REVENUE',
  QUARTERLY_REPORT = 'QUARTERLY_REPORT',
  YEARLY_REPORT = 'YEARLY_REPORT'
}

export interface CreateInvoiceInput {
  orderId: string;
  dueDate?: string;
  discount?: number;
  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceInput {
  status?: InvoiceStatus;
  dueDate?: string;
  discount?: number;
  notes?: string;
  terms?: string;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  cancelled: number;
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
}

export interface ReportData {
  period: string;
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  customerStats: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
}
