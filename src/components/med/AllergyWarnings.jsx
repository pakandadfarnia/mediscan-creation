import React from "react";
import { AlertTriangle, Ban } from "lucide-react";
import { checkAllergies } from "@/../base44/shared/allergyCheck";
import { useLang } from "@/lib/LanguageProvider";

const SEV_LABEL = { mild: "allergies.sevMild", moderate: "allergies.sevModerate", severe: "allergies.sevSevere" };

export default function AllergyWarnings({ med, allergies }) {
  const { t } = useLang();
  const matches = checkAllergies(med, allergies);
  if (!matches.length) return null;
  return (
    <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-4">
      <div className="flex items-center gap-2 text-red-800">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">{t("allergyWarn.title")}</span>
      </div>
      <p className="mt-1 text-sm text-red-700">{t("allergyWarn.desc")}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-red-700">
        {matches.map((m, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{m.allergen}</span>
            <span className="text-red-400">→</span>
            <span className="capitalize">{m.ingredient}</span>
            {m.source === "active" && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                {t("allergyWarn.active")}
              </span>
            )}
            {m.severity && (
              <span className="rounded-full bg-red-200 px-2 py-0.5 text-[11px] font-medium text-red-800">
                {t(SEV_LABEL[m.severity] || "allergies.sevMild")}
              </span>
            )}
            {m.reaction && (
              <span className="text-red-600">— {m.reaction}</span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-start gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-semibold text-white">
        <Ban className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{t("allergyWarn.doNotUse")}</span>
      </div>
    </div>
  );
}