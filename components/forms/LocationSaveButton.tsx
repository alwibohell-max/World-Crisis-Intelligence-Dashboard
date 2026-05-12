"use client";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";
import type { SavedLocation, WeatherLocation } from "@/lib/types";
export function LocationSaveButton({ location }: { location: WeatherLocation }) { const add = useAppStore((s) => s.addLocation); return <Button size="sm" onClick={() => add({ id: location.id, name: location.name, type: "city", latitude: location.latitude, longitude: location.longitude, country: location.country, createdAt: new Date().toISOString() } satisfies SavedLocation)}>Save location</Button>; }
