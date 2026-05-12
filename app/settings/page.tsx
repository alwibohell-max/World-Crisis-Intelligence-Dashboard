"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { localeLabels, locales, type Locale } from "@/lib/i18n/dictionaries";
import { useAppStore } from "@/store/useAppStore";

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const clear = useAppStore((s) => s.clearAll);
  const units = useAppStore((s) => s.units);
  const setUnits = useAppStore((s) => s.setUnits);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t.settings.title}</h1>

      <section className="rounded-lg border p-4">
        <h2 className="font-semibold">{t.settings.theme}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
            {t.settings.themeDark}
          </Button>
          <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
            {t.settings.themeLight}
          </Button>
          <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")}>
            {t.settings.themeSystem}
          </Button>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-semibold">{t.settings.language}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {locales.map((code) => (
            <Button
              key={code}
              variant={locale === code ? "default" : "outline"}
              onClick={() => setLocale(code as Locale)}
            >
              {localeLabels[code]}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-semibold">{t.settings.units}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant={units.temperature === "c" ? "default" : "outline"} onClick={() => setUnits({ ...units, temperature: "c" })}>
            {t.settings.unitsCelsius}
          </Button>
          <Button variant={units.temperature === "f" ? "default" : "outline"} onClick={() => setUnits({ ...units, temperature: "f" })}>
            {t.settings.unitsFahrenheit}
          </Button>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="font-semibold">{t.settings.storage}</h2>
        <Button variant="destructive" className="mt-3" onClick={clear}>
          {t.settings.clearStorage}
        </Button>
      </section>
    </div>
  );
}
