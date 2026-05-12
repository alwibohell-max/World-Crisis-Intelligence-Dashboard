"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { dictionaries, locales, type Dictionary, type Locale } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "wcid.locale";

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLocale(stored)) {
        setLocaleState(stored);
        return;
      }
      const navLocale = window.navigator.language.split("-")[0];
      if (isLocale(navLocale)) setLocaleState(navLocale);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => ({ locale, t: dictionaries[locale], setLocale }), [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
