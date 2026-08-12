import React from "react";
import { Pill, ShoppingCart, Leaf } from "lucide-react";
import { Label } from "@/components/ui/label";

const OPTIONS = [
  { value: "prescription", label: "Prescription", icon: Pill, hint: "Dispensed by a pharmacy with an Rx", tone: "indigo" },
  { value: "otc", label: "Over-the-counter", icon: ShoppingCart, hint: "Bought off the shelf — pain relief, cold, allergy", tone: "amber" },
  { value: "supplement", label: "Supplement / Herbal", icon: Leaf, hint: "Vitamins, minerals, herbal remedies", tone: "emerald" },
];

const TONE = {
  indigo: { on: "border-indigo-500 bg-indigo-50 text-indigo-700", dot: "bg-indigo-500", idle: "border-stone-200 hover:border-stone-300" },
  amber: { on: "border-amber-500 bg-amber-50 text-amber-700", dot: "bg-amber-500", idle: "border-stone-200 hover:border-stone-300" },
  emerald: { on: "border-emerald-500 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", idle: "border-stone-200 hover:border-stone-300" },
};

export default function CategoryPicker({ value, onChange }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <Label className="text-xs font-medium uppercase tracking-wider text-stone-500">Type</Label>
        <span className="text-[11px] text-stone-400">Log OTC & supplements the same way as prescriptions</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          const tone = TONE[opt.tone];
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${active ? tone.on : tone.idle}`}
            >
              <Icon className={`mt-0.5 h-5 w-5 ${active ? "" : "text-stone-400"}`} />
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {opt.label}
                  {active && <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />}
                </div>
                <p className={`mt-0.5 text-xs leading-snug ${active ? "opacity-80" : "text-stone-400"}`}>{opt.hint}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}