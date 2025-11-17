"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/graphql-client";
import ScrollToTopWrapper from "../components/layout/ScrollToTopWrapper";
import { ThemeProvider } from "../components/themeProvider";
import { useSystemTheme } from "../hooks/useSystemTheme";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <ScrollToTopWrapper>
          <InnerProvider>{children}</InnerProvider>
        </ScrollToTopWrapper>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </ApolloProvider>
  );
}

function InnerProvider({ children }: { children: React.ReactNode }) {
  // now useSystemTheme works safely
  const { theme } = useSystemTheme();
  console.log("🚀 ~ InnerProvider ~ theme:", theme);

  return (
    <ScrollToTopWrapper>
      <ThemeProvider attribute="class" forcedTheme={theme} enableSystem={false}>
        {children}
      </ThemeProvider>
    </ScrollToTopWrapper>
  );
}
