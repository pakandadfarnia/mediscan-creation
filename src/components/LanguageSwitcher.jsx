import React from "react";
import { Globe } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";
import { LANGS } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <label className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5">
      <Globe className="h-4 w-4 text-stone-500" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Language"
        className="bg-transparent text-sm text-stone-700 focus:outline-none cursor-pointer"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>{l.name}</option>
        ))}
      </select>
    </label>
  );
}