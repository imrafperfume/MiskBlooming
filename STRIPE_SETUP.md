# Stripe Payment Integration Setup

## 🚀 Quick Setup Guide

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_... for production

# Webhook Secret (Get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# Your domain
NEXT_PUBLIC_URL=http://localhost:3000 # or your production domain
```

### 2. Stripe Dashboard Configuration

1. **Create Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: Copy from [API Keys page](https://dashboard.stripe.com/apikeys)
3. **Set up Webhooks**:
   - Go to [Webhooks page](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://yourdomain.com/api/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret

### 3. Test Cards

Use these test card numbers:

```
# Successful Payment
4242 4242 4242 4242

# Declined Payment
4000 0000 0000 0002

# Requires Authentication
4000 0025 0000 3155

# Use any future expiry date (e.g., 12/34) and any 3-digit CVC
```

### 4. Production Checklist

- [ ] Replace test keys with live keys
- [ ] Update webhook URL to production domain
- [ ] Test with real card (small amount)
- [ ] Verify webhook events are received
- [ ] Check order status updates in database

## 🔧 How It Works

1. **Order Creation**: Order created with PENDING status
2. **Payment Intent**: Stripe PaymentIntent created with order metadata
3. **Payment Processing**: Stripe processes the payment
4. **Webhook**: Stripe sends webhook to update order status
5. **Order Update**: Order marked as PAID/FAILED in database

## 🛠️ Troubleshooting

### Payment Form Not Showing

- Check browser console for errors
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Ensure clientSecret is received from API

### Webhook Not Working

- Check webhook URL is accessible
- Verify webhook secret matches
- Check Stripe dashboard for webhook delivery attempts

### Payment Failing

- Check Stripe dashboard for payment attempts
- Verify card details are correct
- Check for any validation errors

## 📞 Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Status](https://status.stripe.com)
