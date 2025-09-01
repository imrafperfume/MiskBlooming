import { useQueryClient } from "@tanstack/react-query";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchMe(): Promise<User> {
  const res = await fetch("/api/auth/me", {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Not authenticated");
    throw new Error(`Error ${res.status}`);
  }

  return res.json();
}

export function useAuth(options?: Partial<UseQueryOptions<User>>) {
  return useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// Logout =======================

export function useLogout(redirectTo: string = "/auth/login") {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async function logout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      // clear cache
      queryClient.removeQueries({ queryKey: ["auth", "me"] });

      // optional redirect
      return router.push(redirectTo);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
}
