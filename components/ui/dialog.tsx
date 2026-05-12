"use client";
import * as React from "react";
export function Dialog({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function DialogTrigger({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function DialogContent({ children }: { children: React.ReactNode }) { return <div className="rounded-lg border bg-card p-4">{children}</div>; }
export function DialogTitle({ children }: { children: React.ReactNode }) { return <h2 className="font-semibold">{children}</h2>; }
