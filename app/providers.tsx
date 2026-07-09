"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppSplash } from "@/components/shared/AppSplash";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <AppSplash />
      {children}
    </QueryClientProvider>
  );
}
