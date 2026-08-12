import React from "react";

const ROWS = [
  ["Medication", "name"],
  ["Generic name", "generic_name"],
  ["Dose", "dose"],
  ["Form", "form"],
  ["Frequency", "frequency"],
  ["Route", "route"],
  ["Quantity", "quantity"],
  ["Used for", "purpose"],
  ["Storage", "storage"],
  ["Manufacturer", "manufacturer"],
  ["Expiration", "expiration_date"],
  ["Side effects", "side_effects"],
  ["Warnings", "warnings"],
  ["Notes", "notes"],
];

export default function InfoTable({ data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <tbody>
          {ROWS.map(([label, key]) => {
            const raw = data?.[key];
            const value = Array.isArray(raw) ? raw.join(" · ") : raw;
            if (!value) return null;
            return (
              <tr key={key} className="border-b border-stone-100 last:border-0">
                <th className="w-40 bg-stone-50/70 px-4 py-3 align-top text-xs font-medium uppercase tracking-wider text-stone-500">
                  {label}
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