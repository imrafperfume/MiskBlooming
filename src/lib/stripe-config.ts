/**
 * Stripe Configuration for Production
 *
 * This file contains all Stripe-related configuration and constants
 * for the Misk Blooming application.
 */

// Stripe API Configuration
export const STRIPE_CONFIG = {
  // API Version - Use the latest stable version
  API_VERSION: "2025-07-30.basil" as const,

  // Currency Configuration
  CURRENCY: "AED" as const,
  COUNTRY: "AE" as const,

  // Payment Method Types
  PAYMENT_METHOD_TYPES: ["card", "apple_pay", "google_pay"] as const,

  // Amount Limits (in fils - AED minor units)
  MIN_AMOUNT: 100, // 1 AED
  MAX_AMOUNT: 10000000, // 100,000 AED

  // Rate Limiting
  RATE_LIMIT: {
    PAYMENT_INTENT: {
      MAX_REQUESTS: 10,
      WINDOW: "1 m" as const,
    },
    WEBHOOK: {
      MAX_REQUESTS: 100,
      WINDOW: "1 m" as const,
    },
  },

  // Statement Descriptor (appears on customer's card statement)
  STATEMENT_DESCRIPTOR: "MISK BLOOMING",

  // Webhook Events to Handle
  WEBHOOK_EVENTS: [
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "payment_intent.requires_action",
  ] as const,
} as const;

// Stripe Appearance Configuration
export const STRIPE_APPEARANCE = {
  theme: "stripe" as const,
  variables: {
    color: "#d4af37", // luxury gold
    colorBackground: "#fdf5e6", // cream background
    colorText: "#2c2c2c", // charcoal text
    colorDanger: "#dc2626", // red for errors
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "4px",
    borderRadius: "8px",
  },
  rules: {
    ".Input": {
      backgroundColor: "#fdf5e6",
      border: "1px solid #e5d5b8",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "16px",
      transition: "all 0.2s ease",
    },
    ".Input:focus": {
      borderColor: "#d4af37",
      boxShadow: "0 0 0 2px rgba(212, 175, 55, 0.2)",
    },
    ".Label": {
      color: "#2c2c2c",
      fontWeight: "500",
      marginBottom: "8px",
    },
    ".Tab": {
      backgroundColor: "#fdf5e6",
      border: "1px solid #e5d5b8",
      borderRadius: "8px",
      padding: "12px 16px",
    },
    ".Tab--selected": {
      backgroundColor: "#d4af37",
      color: "#2c2c2c",
      borderColor: "#d4af37",
    },
  },
} as const;

// Error Messages
export const STRIPE_ERROR_MESSAGES = {
  CARD_ERROR: "Card error occurred. Please check your card details.",
  RATE_LIMIT_ERROR: "Too many requests. Please try again later.",
  INVALID_REQUEST_ERROR: "Invalid request. Please check your payment details.",
  API_ERROR: "Payment service temporarily unavailable. Please try again.",
  GENERIC_ERROR: "Payment initialization failed. Please try again.",
  MISSING_SIGNATURE: "Missing signature header",
  INVALID_SIGNATURE: "Invalid signature",
  WEBHOOK_SECRET_MISSING: "Webhook secret not configured",
  WEBHOOK_HANDLER_FAILED: "Webhook handler failed",
} as const;

// Validation Schemas
export const STRIPE_VALIDATION = {
  AMOUNT_RANGE: {
    MIN: STRIPE_CONFIG.MIN_AMOUNT,
    MAX: STRIPE_CONFIG.MAX_AMOUNT,
  },
  CURRENCY_REGEX: /^[A-Z]{3}$/,
  ORDER_ID_REGEX: /^[a-zA-Z0-9-_]+$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Environment Variables Validation
export function validateStripeEnvironment() {
  const requiredEnvVars = [
    "STRIPE_SECRET_KEY",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Stripe environment variables: ${missingVars.join(", ")}`
    );
  }

  return true;
}

// Utility Functions
export function formatAmountForStripe(amount: number): number {
  // Convert AED to fils (minor units)
  return Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number): number {
  // Convert fils to AED
  return amount / 100;
}

export function isValidAmount(amount: number): boolean {
  return (
    amount >= STRIPE_CONFIG.MIN_AMOUNT && amount <= STRIPE_CONFIG.MAX_AMOUNT
  );
}

export function getStripeErrorMessage(error: any): string {
  if (error.type === "StripeCardError") {
    return STRIPE_ERROR_MESSAGES.CARD_ERROR;
  }

  if (error.type === "StripeRateLimitError") {
    return STRIPE_ERROR_MESSAGES.RATE_LIMIT_ERROR;
  }

  if (error.type === "StripeInvalidRequestError") {
    return STRIPE_ERROR_MESSAGES.INVALID_REQUEST_ERROR;
  }

  if (error.type === "StripeAPIError") {
    return STRIPE_ERROR_MESSAGES.API_ERROR;
  }

  return STRIPE_ERROR_MESSAGES.GENERIC_ERROR;
}
