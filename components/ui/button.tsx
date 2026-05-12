import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "destructive"; size?: "default" | "sm" | "lg" | "icon"; asChild?: boolean }) {
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50", variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90", variant === "outline" && "border border-border bg-transparent hover:bg-secondary", variant === "ghost" && "hover:bg-secondary", variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90", size === "default" && "h-10 px-4 py-2", size === "sm" && "h-8 px-3", size === "lg" && "h-11 px-6", size === "icon" && "h-10 w-10", className)} {...props} />;
}
