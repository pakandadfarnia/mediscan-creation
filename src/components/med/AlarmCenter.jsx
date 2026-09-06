import React, { useEffect, useRef, useState } from "react";
import { Alarm, Medication, Member } from "@/lib/localDb";
import { useLang } from "@/lib/LanguageProvider";
import AlarmReminderModal from "./AlarmReminderModal";

// Mounted once in the app shell. Checks every 20 seconds whether any active
// alarm's time has been reached and, when it has, shows the reminder modal
// (plus a system notification when permission was granted). Snoozing re-shows
// the same reminder after 10 minutes.
export default function AlarmCenter() {
  const { t } = useLang();
  const [fired, setFired] = useState(null); // { alarm, med, memberName }
  const firedKeys = useRef(new Set()); // "alarmId|date" — once per day per alarm
  const snoozeTimer = useRef(null);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const alarms = await Alarm.filter({ active: true });
        const now = new Date();
        const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const day = now.toDateString();
        for (const a of alarms) {
          if (a.time !== hhmm) continue;
          const key = `${a.id}|${day}`;
          if (firedKeys.current.has(key)) continue;
          firedKeys.current.add(key);
          const med = await Medication.get(a.medication_id);
          if (!med || !alive) continue;
          const member = await Member.get(a.profile_id);
          setFired({ alarm: a, med, memberName: member?.name || "" });
          // Also raise a system notification so the reminder is seen when the
          // app is in a background tab.
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            const body = [med.dose, member?.name].filter(Boolean).join(" · ");
            new Notification(t("alarms.timeFor", { med: med.name }), { body, tag: a.id });
          }
        }
      } catch {
        // transient local DB hiccup — retried on the next tick
      }
    };
    tick();
    const iv = setInterval(tick, 20000);
    return () => {
      alive = false;
      clearInterval(iv);
      clearTimeout(snoozeTimer.current);
    };
  }, [t]);

  // Snooze: hide now, re-show the same reminder in 10 minutes.
  const snooze = () => {
    const p = fired;
    setFired(null);
    clearTimeout(snoozeTimer.current);
    snoozeTimer.current = setTimeout(() => setFired(p), 10 * 60 * 1000);
  };

  if (!fired) return null;
  return <AlarmReminderModal payload={fired} onTaken={() => setFired(null)} onSnooze={snooze} />;
}