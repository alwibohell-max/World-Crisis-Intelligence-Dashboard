"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (theme === "system" ? resolvedTheme : theme) ?? "dark";
  const next = current === "dark" ? "light" : "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t.toggleTheme}
      title={t.toggleTheme}
      onClick={() => setTheme(next)}
    >
      {mounted && current === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
