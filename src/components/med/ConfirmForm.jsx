import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "@/components/ui/image";
import AllergyWarnings from "./AllergyWarnings";
import CategoryPicker from "./CategoryPicker";
import DuplicateWarnings from "./DuplicateWarnings";
import { useLang } from "@/lib/LanguageProvider";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function ConfirmForm({ data, imageUrl, onConfirm, onRescan, allergies, others }) {
  const { t, lang } = useLang();
  const FIELDS = [
    { key: "name", labelKey: "confirm.f.name", type: "text", required: true },
    { key: "generic_name", labelKey: "confirm.f.generic", type: "text" },
    { key: "dose", labelKey: "confirm.f.dose", type: "text" },
    { key: "form", labelKey: "confirm.f.form", type: "text" },
    { key: "frequency", labelKey: "confirm.f.frequency", type: "text" },
    { key: "route", labelKey: "confirm.f.route", type: "text" },
    { key: "quantity", labelKey: "confirm.f.quantity", type: "text" },
    { key: "purpose", labelKey: "confirm.f.purpose", type: "text" },
    { key: "storage", labelKey: "confirm.f.storage", type: "text" },
    { key: "manufacturer", labelKey: "confirm.f.manufacturer", type: "text" },
    { key: "expiration_date", labelKey: "confirm.f.expiration", type: "text" },
  ];
  const ARRAYS = [
    { key: "active_ingredients", labelKey: "confirm.f.active" },
    { key: "inactive_ingredients", labelKey: "confirm.f.inactive" },
    { key: "side_effects", labelKey: "confirm.f.sideEffects" },
    { key: "warnings", labelKey: "confirm.f.warnings" },
  ];

  const [form, setForm] = useState(() => {
    const f = { ...data };
    ARRAYS.forEach(({ key }) => {
      f[key] = Array.isArray(f[key]) ? f[key].join("\n") : f[key] || "";
    });
    return f;
  });

  const [translating, setTranslating] = useState(false);
  const prevLang = useRef(lang);

  // Re-translate the editable fields when the language changes while on this
  // page, so frequency, route, purpose, side effects, etc. follow the user's
  // selected language.
  useEffect(() => {
    if (prevLang.current === lang) return;
    prevLang.current = lang;
    const medObj = { ...form };
    ARRAYS.forEach(({ key }) => {
      medObj[key] = String(form[key] || "").split("\n").map((s) => s.trim()).filter(Boolean);
    });
    let cancelled = false;
    setTranslating(true);
    base44.functions.invoke("translateMedication", { medication: medObj, language: lang })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.result;
        if (data) {
          const next = { ...form, ...data };
          ARRAYS.forEach(({ key }) => {
            next[key] = Array.isArray(next[key]) ? next[key].join("\n") : next[key] || "";
          });
          setForm(next);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setTranslating(false); });
    return () => { cancelled = true; };
  }, [lang]);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const submit = (done = false) => {
    const out = { ...form };
    ARRAYS.forEach(({ key }) => {
      out[key] = String(out[key] || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    });
    onConfirm(out, done);
  };

  return (
    <div>
      <h2 className="font-heading text-2xl font-semibold tracking-tight">{t("confirm.title")}</h2>
      <p className="mt-1 text-sm text-stone-500">{t("confirm.desc")}</p>
      {translating && (
        <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("detail.translating")}
        </div>
      )}

      {imageUrl && (
        <Image src={imageUrl} className="mt-5 h-44 w-full rounded-2xl object-cover" fittingType="fill" />
      )}

      {allergies?.length > 0 && (
        <div className="mt-5">
          <AllergyWarnings
            med={{
              ...data,
              active_ingredients: form.active_ingredients ? form.active_ingredients.split("\n").map((s) => s.trim()).filter(Boolean) : [],
              inactive_ingredients: form.inactive_ingredients ? form.inactive_ingredients.split("\n").map((s) => s.trim()).filter(Boolean) : [],
            }}
            allergies={allergies}
          />
        </div>
      )}

      {others?.length > 0 && (
        <div className="mt-5">
          <DuplicateWarnings
            med={{ ...data, active_ingredients: form.active_ingredients ? form.active_ingredients.split("\n").map((s) => s.trim()).filter(Boolean) : [] }}
            others={others}
          />
        </div>
      )}

      <div className="mt-6">
        <CategoryPicker value={form.category || "prescription"} onChange={(v) => set("category", v)} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map(({ key, labelKey, type }) => (
          <div key={key} className={key === "purpose" ? "sm:col-span-2" : ""}>
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t(labelKey)}</Label>
            <Input value={form[key] || ""} type={type} onChange={(e) => set(key, e.target.value)} className="border-stone-200" />
          </div>
        ))}
        {ARRAYS.map(({ key, labelKey }) => (
          <div key={key} className="sm:col-span-2">
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{t(labelKey)}</Label>
            <Textarea
              value={form[key] || ""}
              onChange={(e) => set(key, e.target.value)}
              rows={3}
              className="resize-none border-stone-200"
            />
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <button onClick={onRescan} className="text-sm text-stone-500 hover:text-stone-800">
          {t("confirm.rescan")}
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => submit(false)}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {t("confirm.addAnother")}
          </button>
          <button
            onClick={() => submit(true)}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
          >
            {t("confirm.done")}
          </button>
        </div>
      </div>
    </div>
  );
}