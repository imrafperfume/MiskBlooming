"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Button from "@/src/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/request-password-reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                toast.error(errData.error || "Failed to send reset code");
                return;
            }

            setEmailSent(true);
            toast.success("Reset code sent! Check your email.");

            // Redirect to reset password page after 2 seconds
            setTimeout(() => {
                router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
            }, 2000);
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen mt-4 bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-background p-8 rounded-2xl shadow-luxury text-center"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-cormorant font-bold text-foreground mb-2">
                            Check Your Email
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            We've sent a 6-digit code to <strong>{getValues("email")}</strong>
                        </p>
                        <div className="bg-cream-50 p-4 rounded-lg">
                            <p className="text-sm text-charcoal-700">
                                The code will expire in <strong>15 minutes</strong>. If you don't see the email, check your spam folder.
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Redirecting to reset password page...
                        </p>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-4 bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-cormorant font-bold text-foreground">
                            Forgot Password?
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            No worries! Enter your email and we'll send you a reset code.
                        </p>
                    </div>

                    {/* Form */}
                    <motion.form
                        className="mt-8 space-y-6 bg-background p-8 rounded-2xl shadow-luxury"
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 ${errors.email ? "border-red-500" : "border-border"
                                        }`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            <p className="mt-1 text-sm text-red-600">
                                {(errors.email?.message as string) || ""}
                            </p>
                        </div>

                        {/* Submit button */}
                        <Button
                            type="submit"
                            variant="luxury"
                            size="xl"
                            className="w-full group"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mr-2" />
                                    Sending Code...
                                </div>
                            ) : (
                                <>
                                    Send Reset Code
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>

                        {/* Back to login */}
                        <div className="text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center text-sm text-primary hover:text-primary font-medium"
                            >
                                <ArrowLeft className="mr-2 w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
}
