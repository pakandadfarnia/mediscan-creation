import React, { useEffect, useState } from "react";
import { Profile as ProfileEntity, Allergy } from "@/lib/localDb";
import AllergyManager from "@/components/med/AllergyManager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/LanguageProvider";
import { useProfileGate } from "@/lib/ProfileContext";
import { LANGS } from "@/lib/i18n";
import { ShieldAlert, Loader2, Check, AlertTriangle } from "lucide-react";

const SEXES = ["male", "female", "other"];

export default function Profile() {
  const { t, lang, setLang, textSize, setTextSize } = useLang();
  const { refresh } = useProfileGate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", sex: "", date_of_birth: "", height: "", weight: "", language: "en" });
  const [allergyCount, setAllergyCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAllergies, setShowAllergies] = useState(false);

  useEffect(() => {
    ProfileEntity.list().then((list) => {
      const p = list && list[0];
      setProfile(p || {});
      setForm({
        name: p?.name || "",
        sex: p?.sex || "",
        date_of_birth: p?.date_of_birth || "",
        height: p?.height || "",
        weight: p?.weight || "",
        language: p?.language || "en",
      });
    }).catch(() => setProfile({}));
    Allergy.list().then((l) => setAllergyCount(l.length)).catch(() => {});
  }, []);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      if (profile?.id) {
        await ProfileEntity.update(profile.id, form);
      } else {
        const created = await ProfileEntity.create(form);
        setProfile(created);
      }
      setLang(form.language);
      setSaved(true);
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <p className="text-sm text-stone-400">{t("common.loading")}</p>;

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("profile.title")}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("profile.desc")}</p>

      {profile && !profile.id && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <span className="block font-medium">{t("profile.welcome")}</span>
            {t("profile.requiredNotice")}
          </span>
        </div>
      )}

      <form onSubmit={save} className="mt-6 max-w-xl space-y-5">
        <div>
          <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.name")}</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="border-stone-200" />
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.sex")}</Label>
          <div className="flex flex-wrap gap-2">
            {SEXES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => set("sex", s)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  form.sex === s ? "bg-stone-900 text-white" : "border border-stone-300 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {t(s === "male" ? "profile.sexMale" : s === "female" ? "profile.sexFemale" : "profile.sexOther")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.dob")}</Label>
            <Input type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} className="border-stone-200" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.height")}</Label>
            <Input value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="170 cm" className="border-stone-200" />
          </div>
          <div>
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.weight")}</Label>
            <Input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="70 kg" className="border-stone-200" />
          </div>
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.language")}</Label>
          <select
            value={form.language}
            onChange={(e) => set("language", e.target.value)}
            className="h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 text-sm focus:outline-none"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-stone-400">{t("profile.langHint")}</p>
        </div>

        <div>
          <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t("profile.textSize")}</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "normal", label: t("a11y.normal") },
              { v: "large", label: t("a11y.large") },
              { v: "xlarge", label: t("a11y.xlarge") },
            ].map((o) => (
              <button
                key={o.v}
                type="button"
                onClick={() => setTextSize(o.v)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  textSize === o.v ? "bg-stone-900 text-white" : "border border-stone-300 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-stone-400">{t("profile.textSizeHint")}</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={saving || !form.name.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            {t("profile.save")}
          </button>
          {saved && <span className="text-sm text-emerald-600">{t("profile.saved")}</span>}
        </div>
      </form>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-stone-500" />
            <span className="text-sm font-semibold text-stone-800">{t("profile.allergies")}</span>
            <span className="text-xs text-stone-400">{t("profile.allergiesCount", { n: allergyCount })}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAllergies((v) => !v)}
            className="text-sm font-medium text-emerald-700 hover:underline"
          >
            {t("profile.manage")}
          </button>
        </div>
        {showAllergies && <AllergyManager onChange={(n) => setAllergyCount(n)} />}
      </div>
    </div>
  );
}