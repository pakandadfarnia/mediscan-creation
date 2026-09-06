import React from "react";
import { AlertOctagon } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

// Big red warning for a conflict between an over-the-counter medicine and a
// prescription medicine. Shows why the pair is unsafe and, when the pharmacist
// check found one, a safer over-the-counter option to ask the doctor about.
// Receives one drug interaction item ({ otc_med, rx_med, description,
// otc_alternative }) as produced by the checkInteractions backend function.
export default function OtcAlternativeWarning({ item }) {
  const { t } = useLang();
  if (!item || !item.otc_med || !item.rx_med) return null;
  // Treat empty / "none" / "n/a" placeholders as "no real alternative".
  const alt = (item.otc_alternative || "").trim();
  const hasAlt = alt && !/^(none|n\/a|nil|-)$/i.test(alt);
  return (
    <div className="rounded-2xl border-2 border-red-600 bg-red-600 p-5 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <AlertOctagon className="h-9 w-9 shrink-0" />
        <div>
          <p className="text-base font-bold uppercase tracking-wide">{t("safety.otcRxTitle")}</p>
          <p className="mt-0.5 text-sm font-semibold">{item.otc_med} + {item.rx_med}</p>
        </div>
      </div>
      {item.description && <p className="mt-3 text-sm font-medium">{item.description}</p>}
      {hasAlt ? (
        <div className="mt-3 rounded-xl bg-white/15 p-3 text-sm">
          <p className="font-semibold">{t("safety.otcAltTitle")}</p>
          <p className="mt-0.5">{t("safety.otcAltMsg", { alt: alt })}</p>
        </div>
      ) : (
        <div className="mt-3 rounded-xl bg-white/15 p-3 text-sm font-medium">
          {t("safety.otcNoAlt", { otc: item.otc_med })}
        </div>
      )}
    </div>
  );
}