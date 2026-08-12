import React from "react";

const COLS = [
  { key: "name", label: "Medication" },
  { key: "dose", label: "Dose" },
  { key: "frequency", label: "Frequency" },
  { key: "purpose", label: "Used for" },
  { key: "side_effects", label: "Side effects", array: true },
  { key: "warnings", label: "Warnings", array: true },
];

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