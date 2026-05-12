"use client";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAppStore } from "@/store/useAppStore";

export function TopBar() {
  const { t } = useI18n();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        aria-label={sidebarOpen ? t.closeSidebar : t.openSidebar}
        title={sidebarOpen ? t.closeSidebar : t.openSidebar}
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <Link href="/search" className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input readOnly className="pl-9" placeholder={t.searchPlaceholder} />
      </Link>
      <LanguageSwitcher />
      <ThemeToggle />
      <div className="hidden text-right text-xs text-muted-foreground sm:block">
        <div>{t.timezoneDetected}</div>
        <div>{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
      </div>
    </header>
  );
}
