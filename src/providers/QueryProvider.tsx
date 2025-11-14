"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/graphql-client";
import ScrollToTopWrapper from "../components/layout/ScrollToTopWrapper";
import { ThemeProvider } from "../components/themeProvider";

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
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </ScrollToTopWrapper>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </ApolloProvider>
  );
}
