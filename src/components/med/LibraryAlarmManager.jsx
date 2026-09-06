import React, { useState } from "react";
import { Alarm } from "@/lib/localDb";
import { AlarmClock, Plus, X, Loader2 } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

// Inline reminder-time editor shown on each library card. Lets the user add,
// edit and remove alarm times for an already-saved medication — the same
// capability as the add-medication flow, but available any time afterwards.
// Every change is persisted immediately to the Alarm store.
export default function LibraryAlarmManager({ medId, profileId, alarms, onChange }) {
  const { t } = useLang();
  const [busy, setBusy] = useState(false);

  // Persist a new 08:00 reminder for this medication, then refresh.
  const add = async () => {
    setBusy(true);
    try {
      await Alarm.create({ medication_id: medId, profile_id: profileId, time: "08:00", active: true });
      await onChange();
    } finally { setBusy(false); }
  };

  // Update an existing reminder's time.
  const updateTime = async (id, time) => {
    await Alarm.update(id, { time });
    await onChange();
  };

  // Remove a reminder.
  const remove = async (id) => {
    await Alarm.delete(id);
    await onChange();
  };

  const list = alarms || [];

  return (
    <div className="mt-4 border-t border-stone-100 pt-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
        <AlarmClock className="h-4 w-4" /> {t("confirm.f.alarmTimes")}
      </div>

      {list.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {list.map((a) => (
            <div key={a.id} className="flex items-center gap-1 rounded-full border border-stone-200 bg-white pl-3 pr-1">
              <input
                type="time"
                value={a.time || ""}
                onChange={(e) => updateTime(a.id, e.target.value)}
                className="bg-transparent py-1.5 text-sm text-stone-700 focus:outline-none"
              />
              <button
                onClick={() => remove(a.id)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-red-500"
                title={t("confirmDelete.remove")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={add}
        disabled={busy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/20 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {t("confirm.addTime")}
      </button>
    </div>
  );
}