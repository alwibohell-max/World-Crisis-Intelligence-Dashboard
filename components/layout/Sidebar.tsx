"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Building2, Clock, CloudSun, Coins, Earth, Globe2, Home, Info, Map, MapPin, Search, Settings, ShieldAlert, SplitSquareHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  ["/dashboard", "Overview", Home], ["/map", "Global Map", Map], ["/earthquakes", "Earthquakes", ShieldAlert], ["/weather", "Weather", CloudSun], ["/countries", "Countries", Globe2], ["/locations", "Saved Locations", MapPin], ["/timeline", "Timeline", Clock], ["/compare", "Compare", SplitSquareHorizontal], ["/osm-intel", "OSM Intel", Building2], ["/currency", "Currency", Coins], ["/search", "Search", Search], ["/settings", "Settings", Settings], ["/about", "About", Info],
] as const;
export function Sidebar() { const pathname = usePathname(); return <aside className="hidden h-screen w-72 shrink-0 border-r bg-card/60 p-4 lg:block"><Link href="/dashboard" className="mb-6 flex items-center gap-3 rounded-lg px-2 py-3"><div className="rounded-lg bg-primary p-2 text-primary-foreground"><Earth className="h-5 w-5" /></div><div><div className="font-semibold">World Crisis Intel</div><div className="text-xs text-muted-foreground">Command dashboard</div></div></Link><nav className="space-y-1">{nav.map(([href, label, Icon]) => <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground", pathname === href && "bg-secondary text-foreground")}><Icon className="h-4 w-4" />{label}</Link>)}</nav><div className="mt-6 rounded-lg border p-3 text-xs text-muted-foreground"><div className="mb-1 flex items-center gap-2 font-medium text-cyan-200"><BarChart3 className="h-4 w-4" />Public sources only</div>No API keys, paid feeds, OAuth, or registration required.</div></aside>; }
