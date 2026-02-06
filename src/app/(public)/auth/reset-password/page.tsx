"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import Button from "@/src/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/src/components/ui/input-otp";

const resetPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    code: z.string().length(6, "Code must be 6 digits").regex(/^\d{6}$/, "Code must be numeric"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [code, setCode] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email") || "";

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: emailFromUrl,
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        try {
            // First verify the code
            const verifyRes = await fetch("/api/auth/verify-reset-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email, code: data.code }),
            });

            if (!verifyRes.ok) {
                const errData = await verifyRes.json().catch(() => ({}));
                toast.error(errData.error || "Invalid or expired code");
                return;
            }

            // Then reset the password
            const resetRes = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    code: data.code,
                    password: data.password,
                }),
            });

            if (!resetRes.ok) {
                const errData = await resetRes.json().catch(() => ({}));
                toast.error(errData.error || "Failed to reset password");
                return;
            }

            toast.success("Password reset successful! Please login.");
            router.push("/auth/login");
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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
                            Reset Your Password
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter the code from your email and create a new password
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
                        <div className="space-y-4">
                            {/* Email */}
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

                            {/* 6-Digit Code */}
                            <div>
                                <label
                                    htmlFor="code"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Verification Code
                                </label>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={code}
                                        onChange={(value) => {
                                            setCode(value);
                                            setValue("code", value);
                                        }}
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <p className="mt-1 text-sm text-red-600 text-center">
                                    {(errors.code?.message as string) || ""}
                                </p>
                            </div>

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    New Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 ${errors.password ? "border-red-500" : "border-border"
                                            }`}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                                        )}
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-red-600">
                                    {(errors.password?.message as string) || ""}
                                </p>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <input
                                        {...register("confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-300 ${errors.confirmPassword ? "border-red-500" : "border-border"
                                            }`}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                                        )}
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-red-600">
                                    {(errors.confirmPassword?.message as string) || ""}
                                </p>
                            </div>
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
                                    Resetting Password...
                                </div>
                            ) : (
                                <>
                                    Reset Password
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </Button>

                        {/* Back to login */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                Remember your password?{" "}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-primary hover:text-primary"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </motion.form>
                </motion.div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
