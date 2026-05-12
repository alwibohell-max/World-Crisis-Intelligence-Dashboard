import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = { title: "World Crisis Intelligence Dashboard", description: "Public no-key crisis intelligence dashboard for earthquakes, weather, countries, infrastructure, and economic signals." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning><body><Providers><AppShell>{children}</AppShell></Providers></body></html>; }
