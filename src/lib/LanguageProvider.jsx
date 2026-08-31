import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile as ProfileEntity } from "@/lib/localDb";
import { LANGS, translate, isRTL } from "@/lib/i18n";

// Context that holds the active language + text-size and exposes the `t`
// translation function. Wraps the whole app so any component can read/switch
// the language and render localized strings.
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Read the last-used language/text-size from localStorage so the choice
  // survives reloads before the profile loads.
  const [lang, setLangState] = useState(() => localStorage.getItem("medilens_lang") || "en");
  const [textSize, setTextSizeState] = useState(() => localStorage.getItem("medilens_textsize") || "normal");

  // Once the user is authenticated, load their saved language preference from
  // the profile (if any) and apply it.
  useEffect(() => {
    ProfileEntity.list()
      .then((list) => {
        const p = list && list[0];
        if (p && p.language) {
          setLangState(p.language);
          localStorage.setItem("medilens_lang", p.language);
        }
      })
      .catch(() => {});
  }, []);

  // Reflect the active language on the <html> element: set lang and switch
  // direction to RTL for Arabic/Farsi.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
  }, [lang]);

  // Scale the whole UI for users who need larger text (Tailwind uses rem units,
  // so changing the root font-size scales everything consistently).
  useEffect(() => {
    const sizes = { normal: "", large: "18px", xlarge: "20.5px" };
    document.documentElement.style.fontSize = sizes[textSize] || "";
  }, [textSize]);

  // Change the language: update state, persist locally, and also save it to the
  // user's profile so it carries across devices.
  const setLang = (next) => {
    setLangState(next);
    localStorage.setItem("medilens_lang", next);
    ProfileEntity.list()
      .then((list) => {
        const p = list && list[0];
        if (p) ProfileEntity.update(p.id, { language: next });
        else ProfileEntity.create({ language: next });
      })
      .catch(() => {});
  };

  // Change the text size and persist it locally.
  const setTextSize = (next) => {
    setTextSizeState(next);
    localStorage.setItem("medilens_textsize", next);
  };

  // `t(key, vars)` translates a key into the active language; `tFor(l)` returns
  // a translator bound to a specific language (used for the English PDF export).
  const t = (key, vars) => translate(lang, key, vars);
  const tFor = (l) => (key, vars) => translate(l, key, vars);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tFor, languages: LANGS, textSize, setTextSize }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to access the language context. Falls back to English defaults when
// used outside the provider (e.g. during early render).
export function useLang() {
  const ctx = useContext(LanguageContext);
  return ctx || { lang: "en", setLang: () => {}, t: (k) => k, tFor: () => (k) => k, languages: LANGS, textSize: "normal", setTextSize: () => {} };
}