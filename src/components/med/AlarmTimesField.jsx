import React from "react";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

// One or more daily reminder times for the medication being added (e.g.
// 08:00 and 20:00). The chosen times travel with the medication and become
// individual alarms when it is saved to the library.
export default function AlarmTimesField({ value, onChange }) {
  const { t } = useLang();
  const times = Array.isArray(value) ? value : [];

  return (
    <div className="sm:col-span-2">
      <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">
        {t("confirm.f.alarmTimes")}
      </Label>
      {times.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {times.map((tm, i) => (
            <div key={i} className="flex items-center gap-1 rounded-full border border-stone-200 bg-white pl-3 pr-1">
              <input
                type="time"
                value={tm}
                onChange={(e) => onChange(times.map((x, idx) => (idx === i ? e.target.value : x)))}
                className="bg-transparent py-1.5 text-sm text-stone-700 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => onChange(times.filter((_, idx) => idx !== i))}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => onChange([...times, "08:00"])}
        className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus className="h-4 w-4" /> {t("confirm.addTime")}
      </button>
    </div>
  );
}