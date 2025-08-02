"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClientProvider } from "@/lib/tanstack-query";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      // enableSystem
      // disableTransitionOnChange
    >
      <QueryClientProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
