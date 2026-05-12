"use client";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function TopBar() { return <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur"><Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button><Link href="/search" className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input readOnly className="pl-9" placeholder="Global command search — press Ctrl/Cmd + K" /></Link><div className="hidden text-right text-xs text-muted-foreground sm:block"><div>Timezone detected</div><div>{Intl.DateTimeFormat().resolvedOptions().timeZone}</div></div></header>; }
