import React from "react";
import { AlertTriangle } from "lucide-react";
import { checkAllergies } from "@/../base44/shared/allergyCheck";
import { useLang } from "@/lib/LanguageProvider";

export default function AllergyWarnings({ med, allergies }) {
  const { t } = useLang();
  const matches = checkAllergies(med, allergies);
  if (!matches.length) return null;
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-center gap-2 text-red-700">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-semibold">{t("allergyWarn.title")}</span>
      </div>
      <p className="mt-1 text-sm text-red-700">{t("allergyWarn.desc")}</p>
      <ul className="mt-2 space-y-1 text-sm text-red-700">
        {matches.map((m, i) => (
          <li key={i} className="flex gap-2">
            <span className="font-medium">{m.allergen}</span>
            <span className="text-red-500">→</span>
            <span className="capitalize">{m.ingredient}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}