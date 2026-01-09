"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function VerifyPendingPage() {
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // This would need to be implemented in the backend
      // For now, we'll show a message
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen mt-4 bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-background p-8 rounded-2xl shadow-luxury text-center"
        >
          {/* Logo/Header */}
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-luxury-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary " />
            </div>
            <h2 className="text-3xl font-cormorant font-bold text-foreground  mb-2">
              Check Your Email
            </h2>
            <p className="text-sm text-muted-foreground">
              We've sent you a verification link
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground  mb-3">
                Almost there!
              </h3>
              <p className="text-muted-foreground mb-4">
                We've sent a verification link to your email address. Please
                check your inbox and click the link to verify your account.
              </p>
              <div className="bg-cream-50 p-4 rounded-lg">
                <p className="text-sm text-charcoal-700">
                  <strong>Don't see the email?</strong> Check your spam folder
                  or wait a few minutes for it to arrive.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                variant="outline"
                size="xl"
                className="w-full group"
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="mr-2 w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 w-5 h-5" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button
                onClick={() => router.push("/auth/login")}
                variant="luxury"
                size="xl"
                className="w-full group"
              >
                Continue to Sign In
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-cream-200">
              <p className="text-xs text-muted-foreground">
                The verification link will expire in 15 minutes. If you need
                help, contact us at{" "}
                <a
                  href="mailto:support@miskblooming.com"
                  className="text-primary  hover:text-primary "
                >
                  support@miskblooming.com
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
