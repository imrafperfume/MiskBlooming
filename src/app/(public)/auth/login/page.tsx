"use client";

import { useEffect, useState } from "react";

// import { useSearchParams } from "next/navigation";
import LogingPage from "./LogingPage";
import { toast } from "sonner";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;
export default function LoginPage() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [csrf, setCsrf] = useState("");

  useEffect(() => {
    fetch("/api/auth/csrf", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCsrf(d));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrf,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Login failed");
      }

      const d = await res.json();
      console.log("Login success:", d);
      toast.success("Login Success");
      router.push("/");
      // window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <Suspense fallback={<>Loading....</>}>
    <LogingPage
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      register={register}
      errors={errors}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      isLoading={isLoading}
    />
    // </Suspense>
  );
}
