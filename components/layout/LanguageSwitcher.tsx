"use client";
import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { localeLabels, locales, type Locale } from "@/lib/i18n/dictionaries";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="relative flex items-center gap-1 rounded-md border bg-card/60 px-2 py-1 text-xs text-muted-foreground" title={t.language}>
      <Languages aria-hidden="true" className="h-4 w-4" />
      <span className="sr-only">{t.language}</span>
      <select
        aria-label={t.language}
        className="cursor-pointer bg-transparent text-xs text-foreground outline-none"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
      >
        {locales.map((code) => (
          <option key={code} value={code} className="bg-background text-foreground">
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
