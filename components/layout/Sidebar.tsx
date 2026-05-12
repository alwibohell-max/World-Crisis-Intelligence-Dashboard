"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, Clock, CloudSun, Coins, Earth, Globe2, Home, Info, Map, MapPin, Search, Settings, ShieldAlert, SplitSquareHorizontal, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

type NavHref = keyof ReturnType<typeof useI18n>["t"]["nav"];

const nav: ReadonlyArray<readonly [NavHref, LucideIcon]> = [
  ["/dashboard", Home],
  ["/map", Map],
  ["/earthquakes", ShieldAlert],
  ["/weather", CloudSun],
  ["/countries", Globe2],
  ["/locations", MapPin],
  ["/timeline", Clock],
  ["/compare", SplitSquareHorizontal],
  ["/osm-intel", Building2],
  ["/currency", Coins],
  ["/search", Search],
  ["/settings", Settings],
  ["/about", Info],
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const toggleSidebar = useAppStore((state) => state.toggleSidebar);

  if (!sidebarOpen) return null;

  return (
    <>
      <button
        type="button"
        aria-label={t.closeSidebar}
        onClick={toggleSidebar}
        className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
      />
      <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r bg-card/95 p-4 backdrop-blur lg:sticky lg:top-0 lg:z-10 lg:bg-card/60">
        <div className="mb-6 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-3">
            <div className="rounded-lg bg-primary p-2 text-primary-foreground">
              <Earth className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">{t.appName}</div>
              <div className="text-xs text-muted-foreground">{t.appTagline}</div>
            </div>
          </Link>
          <Button variant="ghost" size="icon" aria-label={t.closeSidebar} title={t.closeSidebar} onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="space-y-1">
          {nav.map(([href, Icon]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground",
                pathname === href && "bg-secondary text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.nav[href]}
            </Link>
          ))}
        </nav>
        <div className="mt-6 rounded-lg border p-3 text-xs text-muted-foreground">
          <div className="mb-1 flex items-center gap-2 font-medium text-cyan-200">
            <BarChart3 className="h-4 w-4" />
            {t.sourcesNoteTitle}
          </div>
          {t.sourcesNoteBody}
        </div>
      </aside>
    </>
  );
}
