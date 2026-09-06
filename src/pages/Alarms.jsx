import React, { useEffect, useState } from "react";
import { Alarm, Medication } from "@/lib/localDb";
import { useLang } from "@/lib/LanguageProvider";
import { useMember } from "@/lib/MemberContext";
import { Switch } from "@/components/ui/switch";
import ConfirmDeleteDialog from "@/components/med/ConfirmDeleteDialog";
import { AlarmClock, Trash2, BellRing } from "lucide-react";

// Alarms page: every reminder for the active profile's medications, sorted by
// time of day. Each alarm toggles on/off independently — turning one off only
// stops its future reminders; the medication itself is never touched.
export default function Alarms() {
  const { t } = useLang();
  const { activeMember } = useMember();
  const [alarms, setAlarms] = useState(null);
  const [meds, setMeds] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [permission, setPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  const load = async () => {
    if (!activeMember) return;
    setAlarms(await Alarm.filter({ profile_id: activeMember.id }));
    setMeds(await Medication.filter({ profile_id: activeMember.id }));
  };
  useEffect(() => { load(); }, [activeMember?.id]);

  const medById = Object.fromEntries(meds.map((m) => [m.id, m]));
  const sorted = (alarms || []).slice().sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  // Flip a single alarm on/off.
  const toggle = async (a) => {
    await Alarm.update(a.id, { active: !a.active });
    load();
  };

  // Remove a single alarm (after confirmation). The medication is untouched.
  const remove = async (id) => {
    await Alarm.delete(id);
    setConfirmId(null);
    load();
  };

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    setPermission(await Notification.requestPermission());
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("alarms.title")}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("alarms.desc")}</p>

      {permission === "default" && (
        <button
          onClick={enableNotifications}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <BellRing className="h-4 w-4" /> {t("alarms.enableNotifications")}
        </button>
      )}

      {alarms === null && <p className="mt-8 text-sm text-stone-400">{t("common.loading")}</p>}

      {alarms !== null && alarms.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <AlarmClock className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-4 text-sm text-stone-500">{t("alarms.empty")}</p>
        </div>
      )}

      {alarms !== null && sorted.length > 0 && (
        <div className="mt-6 space-y-2">
          {sorted.map((a) => {
            const med = medById[a.medication_id];
            return (
              <div
                key={a.id}
                className={`flex items-center gap-3 rounded-2xl border border-stone-200 p-3 ${a.active ? "bg-white" : "bg-stone-50 opacity-75"}`}
              >
                <div className="flex h-10 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                  {(a.time || "--:--").slice(0, 5)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-stone-800">{med ? med.name : "—"}</p>
                  <p className="truncate text-xs text-stone-500">
                    {[med?.dose, med?.frequency].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Switch checked={!!a.active} onCheckedChange={() => toggle(a)} />
                <button
                  onClick={() => setConfirmId(a.id)}
                  className="shrink-0 rounded-full p-1 text-stone-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!confirmId}
        onConfirm={() => confirmId && remove(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}