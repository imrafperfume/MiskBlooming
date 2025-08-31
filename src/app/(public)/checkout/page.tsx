"use client";

import { JSX, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Phone,
  User,
  Lock,
  Banknote,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { boolean, z } from "zod";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { useCartStore } from "../../../store/cartStore";
import { formatPrice } from "../../../lib/utils";
import { useAuth } from "@/src/hooks/useAuth";
import { useMutation } from "@apollo/client";
import { CREATE_ORDER } from "@/src/modules/order/operations";
import StripeSection from "@/src/components/StripeSection";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Shipping Address
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  emirate: z.string().min(2, "Emirate is required"),
  postalCode: z.string().optional(),

  // Payment Information
  paymentMethod: z.enum(["COD", "STRIPE"]),

  // Delivery Options
  deliveryType: z.enum(["STANDARD", "EXPRESS", "SCHEDULED"]),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  specialInstructions: z.string().optional(),
});
// .refine(
//   (data) => {
//     if (data.paymentMethod === "STRIPE") {
//       return data.cardNumber && data.expiryDate && data.cvv && data.cardName;
//     }
//     return true;
//   },
//   {
//     message: "Card details are required for card payment",
//     path: ["cardNumber"],
//   }
// );

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { data: user, isLoading } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const userId = user?.id;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !userId) {
      router.push("/auth/login");
    }
  }, [isLoading, userId]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryType: "STANDARD",
      paymentMethod: "COD",
    },
  });
  const [createOrder, { data, loading, error }] =
    useMutation<CheckoutFormData>(CREATE_ORDER);
  const deliveryType = watch("deliveryType");
  const paymentMethod = watch("paymentMethod");
  const subtotal = getTotalPrice();
  const deliveryFee =
    deliveryType === "EXPRESS"
      ? 50
      : deliveryType === "SCHEDULED"
      ? 25
      : subtotal > 500
      ? 0
      : 25;
  const tax = subtotal * 0.05; // 5% VAT
  const codFee = paymentMethod === "COD" ? 10 : 0; // Cash on delivery fee
  const total = subtotal + deliveryFee + tax + codFee;

  // const onSubmit = async (data: CheckoutFormData) => {
  //   setIsProcessing(true);
  //   const checkoutData = {
  //     ...data,
  //     userId: userId,
  //     items: items.map((item: any) => ({
  //       productId: item.product.id,
  //       quantity: item.quantity,
  //       price: item.product.price,
  //     })),
  //     totalAmount: total,
  //   };
  //   console.log("chekoutData", checkoutData);
  //   try {
  //     // Simulate payment processing
  //     // await new Promise((resolve) => setTimeout(resolve, 3000));
  //     const res = await createOrder({
  //       variables: {
  //         input: checkoutData,
  //       },
  //     });
  //     console.log("Order placed:", res);
  //     // clearCart();
  //     // Redirect to success page
  //     // window.location.href = "/checkout/success";
  //   } catch (error) {
  //     console.error("Checkout error:", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // Prepare checkout data
      const checkoutData = {
        ...data,
        userId: userId,
        items: items.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: total,
      };

      //  Create order in PENDING state via GraphQL
      const res = await createOrder({ variables: { input: checkoutData } });
      const order = (res as any)?.data?.createOrder;
      console.log("order", order.id);
      if (!order) throw new Error("Failed to create order");

      //  Handle COD
      if (data.paymentMethod === "COD") {
        // Order is already PAID in backend if needed
        window.location.href = "/checkout/success";
        return;
      }

      // 4️⃣ Handle STRIPE
      const piRes = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100), // minor units
          currency: "AED",
          orderId: order?.id,
          email: checkoutData.email,
          shipping: {
            name: `${checkoutData.firstName} ${checkoutData.lastName}`,
            phone: checkoutData.phone,
            address: {
              line1: checkoutData.address,
              city: checkoutData.city,
              state: checkoutData.emirate,
              postal_code: checkoutData.postalCode || undefined,
              country: "AE",
            },
          },
        }),
      });

      const { clientSecret } = await piRes.json();
      if (!clientSecret) throw new Error("Failed to create PaymentIntent");

      setClientSecret(clientSecret); // For Stripe Elements rendering
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, name: "Information", icon: User },
    { id: 2, name: "Shipping", icon: Truck },
    { id: 3, name: "Payment", icon: CreditCard },
  ];

  const emirates = [
    "Abu Dhabi",
    "Dubai",
    "Sharjah",
    "Ajman",
    "Umm Al Quwain",
    "Ras Al Khaimah",
    "Fujairah",
  ];

  const paymentMethods = [
    // Stripe Payment Element automatically shows Card + Apple Pay + Google Pay
    {
      id: "STRIPE",
      name: "Card / Apple Pay / Google Pay",
      description: "Secure one‑tap checkout via Stripe",
      icon: CreditCard,
      fee: 0,
      popular: true,
    },
    {
      id: "COD",
      name: "Cash on Delivery",
      description: "Pay when your flowers arrive",
      icon: Banknote,
      fee: 10,
      popular: false,
    },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-bold text-charcoal-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some luxury arrangements to proceed with checkout
          </p>
          <Link href="/products">
            <Button variant="luxury" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-cream-50 to-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <motion.div
          className="flex items-center mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/cart"
            className="flex items-center text-luxury-500 hover:text-luxury-600 transition-colors mr-4 lg:mr-6"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
            <span className="text-sm lg:text-base">Back to Cart</span>
          </Link>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-bold text-charcoal-900">
            Secure Checkout
          </h1>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-center space-x-4 lg:space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id
                      ? "bg-luxury-500 text-charcoal-900"
                      : "bg-cream-200 text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
                <span
                  className={`ml-2 lg:ml-3 font-medium text-sm lg:text-base ${
                    currentStep >= step.id
                      ? "text-charcoal-900"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 lg:w-16 h-0.5 ml-4 lg:ml-8 transition-all duration-300 ${
                      currentStep > step.id ? "bg-luxury-500" : "bg-cream-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2">
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 lg:space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Step 1: Personal Information */}
              {currentStep >= 1 && (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 lg:w-6 lg:h-6 text-luxury-500 mr-3" />
                    <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-charcoal-900">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    <Input
                      label="First Name"
                      {...register("firstName")}
                      error={errors.firstName?.message}
                    />
                    <Input
                      label="Last Name"
                      {...register("lastName")}
                      error={errors.lastName?.message}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                    <Input
                      label="Phone Number"
                      {...register("phone")}
                      placeholder="+971 50 123 4567"
                      error={errors.phone?.message}
                    />
                  </div>

                  {currentStep === 1 && (
                    <div className="mt-6 flex justify-end">
                      <Button
                        type="button"
                        variant="luxury"
                        onClick={() => setCurrentStep(2)}
                      >
                        Continue to Shipping
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Shipping Information */}
              {currentStep >= 2 && (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <Truck className="w-5 h-5 lg:w-6 lg:h-6 text-luxury-500 mr-3" />
                    <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-charcoal-900">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    <Input
                      label="Street Address"
                      {...register("address")}
                      error={errors.address?.message}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                      <Input
                        label="City"
                        {...register("city")}
                        error={errors.city?.message}
                      />
                      <div>
                        <label className="block text-sm font-medium text-charcoal-900 mb-2">
                          Emirate
                        </label>
                        <select
                          {...register("emirate")}
                          className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="">Select Emirate</option>
                          {emirates.map((emirate) => (
                            <option key={emirate} value={emirate}>
                              {emirate}
                            </option>
                          ))}
                        </select>
                        {errors.emirate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.emirate.message}
                          </p>
                        )}
                      </div>
                      <Input
                        label="Postal Code (Optional)"
                        {...register("postalCode")}
                      />
                    </div>

                    {/* Delivery Options */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-4">
                        Delivery Options
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-4 border-2 border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 hover:border-luxury-300 transition-all duration-300">
                          <input
                            type="radio"
                            value="STANDARD"
                            {...register("deliveryType")}
                            className="mr-3 text-luxury-500 focus:ring-luxury-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-charcoal-900">
                              Standard Delivery
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Next day delivery across UAE •{" "}
                              {subtotal > 500 ? "Free" : "AED 25"}
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border-2 border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 hover:border-luxury-300 transition-all duration-300">
                          <input
                            type="radio"
                            value="EXPRESS"
                            {...register("deliveryType")}
                            className="mr-3 text-luxury-500 focus:ring-luxury-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-charcoal-900 flex items-center">
                              Same Day Delivery
                              <span className="ml-2 px-2 py-1 bg-luxury-100 text-luxury-700 text-xs rounded-full">
                                Popular
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Fresh flowers delivered today in Dubai • AED 50
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center p-4 border-2 border-cream-300 rounded-xl cursor-pointer hover:bg-cream-50 hover:border-luxury-300 transition-all duration-300">
                          <input
                            type="radio"
                            value="SCHEDULED"
                            {...register("deliveryType")}
                            className="mr-3 text-luxury-500 focus:ring-luxury-500"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-charcoal-900">
                              Scheduled Delivery
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Perfect timing for special occasions • AED 25
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {deliveryType === "SCHEDULED" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 p-4 bg-cream-50 rounded-xl">
                        <Input
                          label="Preferred Date"
                          type="date"
                          {...register("deliveryDate")}
                        />
                        <div>
                          <label className="block text-sm font-medium text-charcoal-900 mb-2">
                            Preferred Time
                          </label>
                          <select
                            {...register("deliveryTime")}
                            className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                          >
                            <option value="">Select Time</option>
                            <option value="morning">
                              Morning (9AM - 12PM)
                            </option>
                            <option value="afternoon">
                              Afternoon (12PM - 5PM)
                            </option>
                            <option value="evening">Evening (5PM - 8PM)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-2">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        {...register("specialInstructions")}
                        rows={3}
                        className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent transition-all duration-300"
                        placeholder="Special delivery instructions, gift message, or occasion details..."
                      />
                    </div>
                  </div>

                  {currentStep === 2 && (
                    <div className="mt-6 flex sm:flex-row flex-col gap-4 sm:gap-0 justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back to Information
                      </Button>
                      <Button
                        type="button"
                        variant="luxury"
                        onClick={() => setCurrentStep(3)}
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep >= 3 && (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                  <div className="flex items-center mb-6">
                    <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-luxury-500 mr-3" />
                    <h2 className="font-cormorant text-xl lg:text-2xl font-bold text-charcoal-900">
                      Payment Method
                    </h2>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    {/* Payment Method Selection */}
                    <div>
                      <label className="block text-sm font-medium text-charcoal-900 mb-4">
                        Choose Payment Method
                      </label>
                      <div className="space-y-3 relative">
                        {paymentMethods.map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                              paymentMethod === method.id
                                ? "border-luxury-500 bg-luxury-50"
                                : "border-cream-300 hover:bg-cream-50 hover:border-luxury-300"
                            }`}
                          >
                            <input
                              type="radio"
                              value={method.id}
                              {...register("paymentMethod")}
                              className="mr-3 text-luxury-500 focus:ring-luxury-500"
                              onChange={() =>
                                setValue("paymentMethod", method.id as any)
                              }
                            />
                            <method.icon className="w-6 h-6 text-charcoal-700 mr-3" />
                            <div className="flex-1 ">
                              <div className="flex items-center">
                                <span className="font-medium text-charcoal-900 text-xs sm:text-base">
                                  {method.name}
                                </span>
                                {method.popular && (
                                  <span className="ml-2 px-2 py-1 sm:relative absolute top-1  right-1 bg-luxury-100 text-luxury-700 text-xs rounded-full">
                                    Popular
                                  </span>
                                )}
                                {method.fee > 0 && (
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    +{formatPrice(method.fee)}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {method.description}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Card Payment Details */}

                    {/* Cash on Delivery Info */}
                    {paymentMethod === "COD" && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Banknote className="w-5 h-5 text-amber-600 mr-2" />
                          <span className="font-medium text-amber-800 ">
                            Cash on Delivery
                          </span>
                        </div>
                        <p className="text-sm text-amber-700">
                          Pay with cash when your flowers are delivered. A
                          service fee of AED 10 applies. Please have the exact
                          amount ready for our delivery partner.
                        </p>
                      </div>
                    )}

                    {/* Digital Wallet Info */}
                    {paymentMethod === "STRIPE" && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Wallet className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium text-blue-800">
                            Digital Wallet
                          </span>
                        </div>
                        <p className="text-sm text-blue-700">
                          You'll be redirected to complete payment with your
                          preferred digital wallet. Secure and convenient
                          payment in one tap.
                        </p>
                      </div>
                    )}

                    {/* Security Features */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <Shield className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-green-800">
                          Secure Payment
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Your payment information is encrypted and secure. We
                        never store your card details. All transactions are
                        processed through secure payment gateways.
                      </p>
                    </div>
                  </div>

                  {/* <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="order-2 sm:order-1"
                    >
                      Back to Shipping
                    </Button>
                    <Button
                      type="submit"
                      variant="luxury"
                      size="lg"
                      disabled={isProcessing}
                      className="min-w-[200px] order-1 sm:order-2"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Complete Order • {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  </div> */}
                  {/* If STRIPE selected and clientSecret exists, show Payment Element instead of submit button */}
                  {paymentMethod === "STRIPE" && clientSecret ? (
                    <StripeSection
                      clientSecret={clientSecret}
                      amountLabel={formatPrice(total)}
                    />
                  ) : (
                    <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        className="order-2 sm:order-1"
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        type="submit"
                        variant="luxury"
                        size="lg"
                        disabled={isProcessing}
                        className="min-w-[200px] order-1 sm:order-2"
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <div className="w-5 h-5 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </div>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Order • {formatPrice(total)}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-cormorant text-xl font-bold text-charcoal-900 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center space-x-3"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product?.images[0].url || "/placeholder.svg"}
                        alt={item.product?.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-charcoal-900 sm:text-sm text-xs line-clamp-2">
                        {item.product.name}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-charcoal-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t border-cream-300 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>

                {codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">COD Fee</span>
                    <span className="font-medium">{formatPrice(codFee)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (5%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>

                <div className="border-t border-cream-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-charcoal-900">
                      Total
                    </span>
                    <span className="text-lg font-bold text-charcoal-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-cream-300">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Secure</p>
                  </div>
                  <div>
                    <Truck className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      Fast Delivery
                    </p>
                  </div>
                  <div>
                    <Phone className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">
                      24/7 Support
                    </p>
                  </div>
                </div>
              </div>

              {/* Satisfaction Guarantee */}
              <div className="mt-4 p-3 bg-luxury-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-luxury-600 mr-2" />
                  <span className="text-sm font-medium text-luxury-800">
                    100% Satisfaction Guarantee
                  </span>
                </div>
                <p className="text-xs text-luxury-700 mt-1">
                  Fresh flowers or your money back
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

//  <div>
//    {paymentMethod === "STRIPE" && (
//      <div className="space-y-4 p-4 bg-cream-50 rounded-xl">
//        <Input
//          label="Cardholder Name"
//          {...register("cardName")}
//          error={errors.cardName?.message}
//        />

//        <Input
//          label="Card Number"
//          {...register("cardNumber")}
//          placeholder="1234 5678 9012 3456"
//          error={errors.cardNumber?.message}
//        />

//        <div className="grid grid-cols-2 gap-4">
//          <Input
//            label="Expiry Date"
//            {...register("expiryDate")}
//            placeholder="MM/YY"
//            error={errors.expiryDate?.message}
//          />
//          <Input
//            label="CVV"
//            {...register("cvv")}
//            placeholder="123"
//            error={errors.cvv?.message}
//          />
//        </div>

//        {/* Accepted Cards */}
//        <div className="flex items-center space-x-3 pt-2">
//          <span className="text-sm text-muted-foreground">We accept:</span>
//          <div className="flex space-x-2">
//            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
//              VISA
//            </div>
//            <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
//              MC
//            </div>
//            <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
//              AMEX
//            </div>
//          </div>
//        </div>
//      </div>
//    )}
//  </div>;
