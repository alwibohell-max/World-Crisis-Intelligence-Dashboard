"use client";
import * as React from "react";
export function Tabs({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function TabsList({ children }: { children: React.ReactNode }) { return <div className="flex gap-2">{children}</div>; }
export function TabsTrigger(props: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button className="rounded border px-3 py-1 text-sm" {...props} />; }
export function TabsContent({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
