"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 300000, gcTime: 1800000, retry: 1 } } }));
  const hydrate = useAppStore((state) => state.hydrate);
  useEffect(() => hydrate(), [hydrate]);
  return <QueryClientProvider client={client}><ThemeProvider attribute="class" defaultTheme="dark" enableSystem>{children}</ThemeProvider></QueryClientProvider>;
}
