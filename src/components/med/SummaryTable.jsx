import React from "react";

const COLS = [
  { key: "name", label: "Medication" },
  { key: "category", label: "Type", badge: true },
  { key: "dose", label: "Dose" },
  { key: "frequency", label: "Frequency" },
  { key: "purpose", label: "Used for" },
  { key: "side_effects", label: "Side effects", array: true },
  { key: "warnings", label: "Warnings", array: true },
];

const BADGE = {
  prescription: "bg-indigo-100 text-indigo-700",
  otc: "bg-amber-100 text-amber-700",
  supplement: "bg-emerald-100 text-emerald-700",
};
const LABEL = { prescription: "Rx", otc: "OTC", supplement: "Supplement" };

export default function SummaryTable({ meds }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
          <tr>
            {COLS.map((c) => (
              <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {meds.map((m, i) => (
            <tr key={i} className="border-t border-stone-100 align-top">
              {COLS.map((c) => {
                const v = m[c.key];
                if (c.badge) {
                  const cat = v || "prescription";
                  return (
                    <td key={c.key} className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${BADGE[cat] || "bg-stone-100 text-stone-600"}`}>
                        {LABEL[cat] || cat}
                      </span>
                    </td>
                  );
                }
                const text = c.array
                  ? (Array.isArray(v) ? v : []).map((s) => `• ${s}`).join("\n")
                  : v || "—";
                return (
                  <td key={c.key} className="px-4 py-3 text-stone-700">
                    {c.array ? (
                      <pre className="whitespace-pre-wrap font-sans leading-snug">{text}</pre>
                    ) : (
                      <span className="font-medium text-stone-900">{text}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}