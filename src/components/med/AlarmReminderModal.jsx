import React from "react";
import { AlarmClock } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

// Full-screen reminder shown when an alarm fires: the medication name and
// dose, with "Mark as taken" and "Snooze" actions.
export default function AlarmReminderModal({ payload, onTaken, onSnooze }) {
  const { t } = useLang();
  const { med, memberName } = payload;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <AlarmClock className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400">{t("alarms.reminder")}</p>
            <p className="truncate font-heading text-lg font-semibold text-stone-900">{med.name}</p>
          </div>
        </div>
        <p className="mt-3 text-sm text-stone-600">
          {med.dose && (
            <>
              <span className="font-medium">{t("table.dose")}:</span> {med.dose}
            </>
          )}
          {med.dose && memberName && <span className="text-stone-400"> · </span>}
          {memberName && <span className="text-stone-500">{memberName}</span>}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            onClick={onTaken}
            className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            {t("alarms.markTaken")}
          </button>
          <button
            onClick={onSnooze}
            className="flex-1 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
          >
            {t("alarms.snooze")}
          </button>
        </div>
      </div>
    </div>
  );
}