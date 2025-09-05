# Checkout Components

This directory contains all the components for the checkout flow, organized for better maintainability and reusability.

## Components

### Core Components

- **CheckoutStep**: Base wrapper component for checkout steps with consistent styling and animations
- **CheckoutHeader**: Header with back navigation and page title
- **CheckoutProgress**: Progress indicator showing current step in checkout process

### Step Components

- **PersonalInformationStep**: Step 1 - Collects user's personal information
- **ShippingInformationStep**: Step 2 - Collects shipping address and delivery preferences
- **PaymentStep**: Step 3 - Handles payment method selection and processing

### Utility Components

- **OrderSummary**: Displays order details, pricing breakdown, and trust badges
- **EmptyCart**: Shows when cart is empty with call-to-action

## Features

### Performance Optimizations

- **Memoization**: Calculations are memoized to prevent unnecessary recalculations
- **Lazy Loading**: Stripe components are dynamically imported
- **Code Splitting**: Components are split for better bundle optimization

### Type Safety

- **Strong Typing**: All components use TypeScript with proper interfaces
- **Form Validation**: Zod schema validation for form data
- **Type Inference**: Proper type inference throughout the checkout flow

### User Experience

- **Progressive Disclosure**: Information is collected step by step
- **Visual Feedback**: Loading states, animations, and progress indicators
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first responsive design

## Usage

```tsx
import {
  CheckoutHeader,
  CheckoutProgress,
  PersonalInformationStep,
  ShippingInformationStep,
  PaymentStep,
  OrderSummary,
  EmptyCart,
} from "@/src/components/checkout";
```

## Architecture

The checkout flow follows a step-based architecture:

1. **Step Management**: Controlled by `useCheckout` hook
2. **Form Handling**: React Hook Form with Zod validation
3. **State Management**: Zustand for cart state
4. **Payment Processing**: Stripe integration with dynamic loading
5. **Error Handling**: Toast notifications and graceful error recovery

## Customization

All components accept props for customization:

- Styling can be overridden via className props
- Form behavior can be customized via form props
- Payment methods can be extended by modifying the payment methods array
