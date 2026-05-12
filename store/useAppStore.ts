"use client";
import { create } from "zustand";
import type { SavedLocation, SearchResult } from "@/lib/types";
import { loadLocal, saveLocal } from "@/lib/storage/local";

type Units = { temperature: "c" | "f"; distance: "km" | "mi"; time: "local" | "utc" };
interface AppState {
  sidebarOpen: boolean;
  savedLocations: SavedLocation[];
  recentSearches: SearchResult[];
  units: Units;
  theme: "dark" | "light" | "system";
  mapLayer: string;
  thresholds: { high: number; critical: number };
  hydrate: () => void;
  toggleSidebar: () => void;
  addLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
  addSearch: (result: SearchResult) => void;
  setUnits: (units: Units) => void;
  setTheme: (theme: AppState["theme"]) => void;
  clearAll: () => void;
}

const defaults = { units: { temperature: "c", distance: "km", time: "local" } as Units, theme: "dark" as const, mapLayer: "earthquakes", thresholds: { high: 71, critical: 91 } };

export const useAppStore = create<AppState>((set, get) => ({
  sidebarOpen: true,
  savedLocations: [],
  recentSearches: [],
  ...defaults,
  hydrate: () => set({ savedLocations: loadLocal("wcid.locations", []), recentSearches: loadLocal("wcid.searches", []), units: loadLocal("wcid.units", defaults.units), theme: loadLocal("wcid.theme", defaults.theme), mapLayer: loadLocal("wcid.mapLayer", defaults.mapLayer), thresholds: loadLocal("wcid.thresholds", defaults.thresholds) }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addLocation: (location) => { const savedLocations = [location, ...get().savedLocations.filter((item) => item.id !== location.id)].slice(0, 20); saveLocal("wcid.locations", savedLocations); set({ savedLocations }); },
  removeLocation: (id) => { const savedLocations = get().savedLocations.filter((item) => item.id !== id); saveLocal("wcid.locations", savedLocations); set({ savedLocations }); },
  addSearch: (result) => { const recentSearches = [result, ...get().recentSearches.filter((item) => item.id !== result.id)].slice(0, 12); saveLocal("wcid.searches", recentSearches); set({ recentSearches }); },
  setUnits: (units) => { saveLocal("wcid.units", units); set({ units }); },
  setTheme: (theme) => { saveLocal("wcid.theme", theme); set({ theme }); },
  clearAll: () => { ["wcid.locations", "wcid.searches", "wcid.units", "wcid.theme", "wcid.mapLayer", "wcid.thresholds"].forEach((key) => localStorage.removeItem(key)); set({ savedLocations: [], recentSearches: [], ...defaults }); },
}));
