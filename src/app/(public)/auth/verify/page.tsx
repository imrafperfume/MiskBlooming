"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "../../../../components/ui/button";

function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      setMessage(
        "Invalid verification link. Please check your email and try again."
      );
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setVerificationStatus("success");
          setMessage(
            "Your email has been successfully verified! You can now sign in to your account."
          );
        } else {
          setVerificationStatus("error");
          setMessage(
            "Verification failed. The link may have expired or already been used. Please request a new verification email."
          );
        }
      } catch (error) {
        setVerificationStatus("error");
        setMessage(
          "An error occurred during verification. Please try again later."
        );
      }
    };

    verifyEmail();
  }, [token]);

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
            <h2 className="text-3xl font-cormorant font-bold text-foreground  mb-2">
              Email Verification
            </h2>
            <p className="text-sm text-muted-foreground">
              Verifying your email address
            </p>
          </div>

          {/* Status Icon and Message */}
          <div className="space-y-6">
            {verificationStatus === "loading" && (
              <>
                <div className="w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-luxury-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground  mb-2">
                    Verifying your email...
                  </h3>
                  <p className="text-muted-foreground">
                    Please wait while we verify your email address.
                  </p>
                </div>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <div className="w-16 h-16 mx-auto">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground  mb-2">
                    Email Verified Successfully!
                  </h3>
                  <p className="text-muted-foreground mb-6">{message}</p>
                  <Button
                    onClick={() => router.push("/auth/login")}
                    variant="luxury"
                    size="xl"
                    className="w-full group"
                  >
                    Sign In to Your Account
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <div className="w-16 h-16 mx-auto">
                  <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground  mb-2">
                    Verification Failed
                  </h3>
                  <p className="text-muted-foreground mb-6">{message}</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/auth/register")}
                      variant="luxury"
                      size="xl"
                      className="w-full group"
                    >
                      Register Again
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      onClick={() => router.push("/auth/login")}
                      variant="outline"
                      size="xl"
                      className="w-full"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-cream-200">
            <p className="text-xs text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@miskblooming.com"
                className="text-primary  hover:text-primary "
              >
                support@miskblooming.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyWrapper() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
