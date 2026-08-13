import React, { createContext, useContext, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { LANGS, translate, isRTL } from "@/lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem("medilens_lang") || "en");
  const [textSize, setTextSizeState] = useState(() => localStorage.getItem("medilens_textsize") || "normal");

  // Load the user's saved language preference once they're authenticated.
  useEffect(() => {
    base44.entities.Profile.list()
      .then((list) => {
        const p = list && list[0];
        if (p && p.language) {
          setLangState(p.language);
          localStorage.setItem("medilens_lang", p.language);
        }
      })
      .catch(() => {});
  }, []);

  // Reflect the active language on the document (RTL for Arabic).
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL(lang) ? "rtl" : "ltr";
  }, [lang]);

  // Scale the whole UI for users who need larger text (Tailwind uses rem units).
  useEffect(() => {
    const sizes = { normal: "", large: "18px", xlarge: "20.5px" };
    document.documentElement.style.fontSize = sizes[textSize] || "";
  }, [textSize]);

  const setLang = (next) => {
    setLangState(next);
    localStorage.setItem("medilens_lang", next);
    // Persist to the user's profile so it survives devices.
    base44.entities.Profile.list()
      .then((list) => {
        const p = list && list[0];
        if (p) base44.entities.Profile.update(p.id, { language: next });
      })
      .catch(() => {});
  };

  const setTextSize = (next) => {
    setTextSizeState(next);
    localStorage.setItem("medilens_textsize", next);
  };

  const t = (key, vars) => translate(lang, key, vars);
  const tFor = (l) => (key, vars) => translate(l, key, vars);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tFor, languages: LANGS, textSize, setTextSize }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  return ctx || { lang: "en", setLang: () => {}, t: (k) => k, tFor: () => (k) => k, languages: LANGS, textSize: "normal", setTextSize: () => {} };
}