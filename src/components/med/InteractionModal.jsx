import React from "react";
import { AlertOctagon } from "lucide-react";

// Prominent, non-silently-dismissable modal for a single OTC ↔ prescription
// interaction. Shows both medication names, the risk, and (when available)
// 1–3 safer OTC alternatives with reasons — or a "consult your physician"
// message when no safe alternative exists. The only way to close it is the
// "I understand" button (no X, no backdrop-click, no ESC dismissal).
const TONE = {
  danger: { border: "border-red-600", bg: "bg-red-50", title: "text-red-700", text: "text-red-800", icon: "text-red-600", btn: "bg-red-600 hover:bg-red-700" },
  caution: { border: "border-orange-500", bg: "bg-orange-50", title: "text-orange-700", text: "text-orange-800", icon: "text-orange-500", btn: "bg-orange-500 hover:bg-orange-600" },
};

export default function InteractionModal({ flag, onAcknowledge }) {
  if (!flag) return null;
  const tone = TONE[flag.severity] || TONE.danger;
  const hasAlt = Array.isArray(flag.alternatives) && flag.alternatives.length > 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className={`w-full max-w-lg rounded-2xl border-2 ${tone.border} ${tone.bg} p-6 shadow-2xl`}>
        <div className="flex items-center gap-3">
          <AlertOctagon className={`h-10 w-10 shrink-0 ${tone.icon}`} />
          <div>
            <p className={`text-lg font-bold ${tone.title}`}>Interaction warning</p>
            <p className={`text-sm font-semibold ${tone.title}`}>{flag.otc} + {flag.prescription}</p>
          </div>
        </div>

        <p className={`mt-4 text-sm ${tone.text}`}>{flag.risk}</p>

        {hasAlt ? (
          <div className="mt-4">
            <p className={`text-sm font-semibold ${tone.title}`}>Safer over-the-counter options:</p>
            <ul className="mt-2 space-y-2">
              {flag.alternatives.map((a, i) => (
                <li key={i} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
                  <p className="font-semibold text-emerald-800">{a.name}</p>
                  <p className="text-emerald-700">{a.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-100 p-3 text-sm font-medium text-red-800">
            There's no safe over-the-counter alternative for this combination. Please consult your physician or pharmacist before taking {flag.otc}.
          </div>
        )}

        <button
          onClick={onAcknowledge}
          className={`mt-6 w-full rounded-full px-5 py-3 text-sm font-semibold text-white ${tone.btn}`}
        >
          I understand
        </button>
      </div>
    </div>
  );
}