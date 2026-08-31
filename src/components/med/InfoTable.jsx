import React from "react";
import { useLang } from "@/lib/LanguageProvider";

// Rows for the detail table: each entry is [i18n label key, medication field].
// Array fields are joined with " · "; empty values are skipped.
const ROWS = [
  ["table.name", "name"],
  ["table.generic", "generic_name"],
  ["table.active", "active_ingredients"],
  ["table.dose", "dose"],
  ["table.form", "form"],
  ["table.frequency", "frequency"],
  ["table.route", "route"],
  ["table.quantity", "quantity"],
  ["table.purpose", "purpose"],
  ["table.inactive", "inactive_ingredients"],
  ["table.storage", "storage"],
  ["table.manufacturer", "manufacturer"],
  ["table.expiration", "expiration_date"],
  ["table.sideEffects", "side_effects"],
  ["table.warnings", "warnings"],
  ["table.notes", "notes"],
];

// Renders a medication's full details as a two-column label/value table.
export default function InfoTable({ data }) {
  const { t } = useLang();
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <tbody>
          {ROWS.map(([labelKey, key]) => {
            const raw = data?.[key];
            const value = Array.isArray(raw) ? raw.join(" · ") : raw;
            if (!value) return null;
            return (
              <tr key={key} className="border-b border-stone-100 last:border-0">
                <th className="w-40 bg-stone-50/70 px-4 py-3 align-top text-xs font-medium uppercase tracking-wider text-stone-500">
                  {t(labelKey)}
                </th>
                <td className="px-4 py-3 align-top text-stone-800">{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}