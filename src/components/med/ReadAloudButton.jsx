import React, { useEffect, useState } from "react";
import { Volume2, Square } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

const VOICE_LANG = { en: "en-US", es: "es-ES", fr: "fr-FR", zh: "zh-CN", pt: "pt-BR", ar: "ar-SA" };

// Reads the provided text aloud using the browser's built-in speech synthesis.
// No backend, no cost — works offline and picks a voice matching the app language.
export default function ReadAloudButton({ text, label }) {
  const { t, lang } = useLang();
  const [speaking, setSpeaking] = useState(false);

  const stop = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => () => stop(), []);

  const toggle = () => {
    if (!window.speechSynthesis || !text) return;
    if (speaking) {
      stop();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE_LANG[lang] || "en-US";
    const voices = window.speechSynthesis.getVoices?.() || [];
    const match = voices.find((v) => v.lang?.toLowerCase().startsWith(lang));
    if (match) u.voice = match;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
    >
      {speaking ? <Square className="h-4 w-4 text-red-500" /> : <Volume2 className="h-4 w-4" />}
      {speaking ? t("a11y.stop") : label || t("a11y.readAloud")}
    </button>
  );
}