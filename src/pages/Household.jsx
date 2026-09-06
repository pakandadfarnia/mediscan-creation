import React, { useState } from "react";
import { Member, Medication, Allergy, Alarm } from "@/lib/localDb";
import { useLang } from "@/lib/LanguageProvider";
import { useMember } from "@/lib/MemberContext";
import MemberAvatar from "@/components/med/MemberAvatar";
import ConfirmDeleteDialog from "@/components/med/ConfirmDeleteDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Pencil, Trash2, Check, Loader2 } from "lucide-react";

const AGES = [
  { v: "child", key: "members.child" },
  { v: "adult", key: "members.adult" },
  { v: "senior", key: "members.senior" },
];
const AGE_KEY = { child: "members.child", adult: "members.adult", senior: "members.senior" };

// Household profiles page: create, edit, switch between and delete the
// profiles under this account. Medications, allergies and alarms are all
// scoped per profile. Deleting a profile removes its data after confirmation.
export default function Household() {
  const { t } = useLang();
  const { members, activeMember, setActiveMember, reload } = useMember();
  // null = form closed; otherwise { id: null | existing, name, age_group }
  const [form, setForm] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!members) return <p className="text-sm text-stone-400">{t("common.loading")}</p>;

  const openAdd = () => setForm({ id: null, name: "", age_group: "adult" });
  const openEdit = (m) => setForm({ id: m.id, name: m.name || "", age_group: m.age_group || "adult" });

  // Create a new profile or save changes to an existing one.
  const save = async () => {
    if (!form || !form.name.trim() || busy) return;
    setBusy(true);
    if (form.id) {
      await Member.update(form.id, { name: form.name.trim(), age_group: form.age_group });
    } else {
      await Member.create({ name: form.name.trim(), age_group: form.age_group, color: members.length % 6 });
    }
    setForm(null);
    await reload();
    setBusy(false);
  };

  // Delete a profile and all of its data (alarms, medications, allergies).
  const removeConfirmed = async () => {
    const id = confirmId;
    setConfirmId(null);
    const meds = await Medication.filter({ profile_id: id });
    for (const m of meds) {
      for (const a of await Alarm.filter({ medication_id: m.id })) await Alarm.delete(a.id);
      await Medication.delete(m.id);
    }
    for (const a of await Allergy.filter({ profile_id: id })) await Allergy.delete(a.id);
    for (const a of await Alarm.filter({ profile_id: id })) await Alarm.delete(a.id);
    await Member.delete(id);
    // If the active profile was deleted, fall back to the first remaining one.
    if (activeMember?.id === id) {
      const rest = await Member.list("created_date");
      if (rest[0]) setActiveMember(rest[0].id);
    }
    await reload();
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("members.title")}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("members.desc")}</p>

      <div className="mt-6 space-y-2">
        {members.map((m) => (
          <div
            key={m.id}
            className={`flex items-center gap-3 rounded-2xl border p-3 ${
              m.id === activeMember?.id ? "border-primary bg-primary/5" : "border-stone-200 bg-white"
            }`}
          >
            <button onClick={() => setActiveMember(m.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
              <MemberAvatar member={m} className="h-10 w-10 text-sm" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-medium text-stone-800">
                  <span className="truncate">{m.name}</span>
                  {m.id === activeMember?.id && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {t("members.active")}
                    </span>
                  )}
                </p>
                <p className="text-xs text-stone-500">{t(AGE_KEY[m.age_group] || "members.adult")}</p>
              </div>
            </button>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => openEdit(m)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                title={t("members.edit")}
              >
                <Pencil className="h-4 w-4" />
              </button>
              {/* The last remaining profile can't be deleted. */}
              {members.length > 1 && (
                <button
                  onClick={() => setConfirmId(m.id)}
                  className="rounded-full p-1.5 text-stone-300 hover:bg-red-50 hover:text-red-500"
                  title={t("members.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {form ? (
        <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4">
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.name")}</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("members.namePh")}
                className="border-stone-200"
                autoFocus
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("members.ageGroup")}</Label>
              <div className="flex flex-wrap gap-2">
                {AGES.map((a) => (
                  <button
                    key={a.v}
                    type="button"
                    onClick={() => setForm({ ...form, age_group: a.v })}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      form.age_group === a.v ? "bg-primary text-white" : "border border-stone-300 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {t(a.key)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={save}
                disabled={busy || !form.name.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} {t("members.save")}
              </button>
              <button
                onClick={() => setForm(null)}
                className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                {t("confirmDelete.cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={openAdd}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" /> {t("members.add")}
        </button>
      )}

      <p className="mt-4 text-xs text-stone-400">{t("members.activeHint")}</p>

      <ConfirmDeleteDialog open={!!confirmId} onConfirm={removeConfirmed} onCancel={() => setConfirmId(null)} />
    </div>
  );
}