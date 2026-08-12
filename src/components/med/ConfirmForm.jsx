import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image } from "@/components/ui/image";
import AllergyWarnings from "./AllergyWarnings";
import CategoryPicker from "./CategoryPicker";
import DuplicateWarnings from "./DuplicateWarnings";

const FIELDS = [
  { key: "name", label: "Medication name", type: "text", required: true },
  { key: "generic_name", label: "Generic name", type: "text" },
  { key: "dose", label: "Dose", type: "text" },
  { key: "form", label: "Form", type: "text" },
  { key: "frequency", label: "Frequency", type: "text" },
  { key: "route", label: "Route", type: "text" },
  { key: "quantity", label: "Quantity", type: "text" },
  { key: "purpose", label: "Used for", type: "text" },
  { key: "storage", label: "Storage", type: "text" },
  { key: "manufacturer", label: "Manufacturer", type: "text" },
  { key: "expiration_date", label: "Expiration date", type: "text" },
];

const ARRAYS = [
  { key: "active_ingredients", label: "Active ingredients (one per line — each component of a combo drug)" },
  { key: "inactive_ingredients", label: "Inactive ingredients (one per line)" },
  { key: "side_effects", label: "Side effects (one per line)" },
  { key: "warnings", label: "Warnings (one per line)" },
];

export default function ConfirmForm({ data, imageUrl, onConfirm, onRescan, allergies, others }) {
  const [form, setForm] = useState(() => {
    const f = { ...data };
    ARRAYS.forEach(({ key }) => {
      f[key] = Array.isArray(f[key]) ? f[key].join("\n") : f[key] || "";
    });
    return f;
  });

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
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Confirm the details</h2>
      <p className="mt-1 text-sm text-stone-500">
        Check the extracted information and fix anything that's wrong before adding the next medication.
      </p>

      {imageUrl && (
        <Image src={imageUrl} className="mt-5 h-44 w-full rounded-2xl object-cover" fittingType="fill" />
      )}

      {allergies?.length > 0 && (
        <div className="mt-5">
          <AllergyWarnings
            med={{ ...data, inactive_ingredients: form.inactive_ingredients ? form.inactive_ingredients.split("\n").map((s) => s.trim()).filter(Boolean) : [] }}
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
        {FIELDS.map(({ key, label, type }) => (
          <div key={key} className={key === "purpose" ? "sm:col-span-2" : ""}>
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{label}</Label>
            <Input value={form[key] || ""} type={type} onChange={(e) => set(key, e.target.value)} className="border-stone-200" />
          </div>
        ))}
        {ARRAYS.map(({ key, label }) => (
          <div key={key} className="sm:col-span-2">
            <Label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">{label}</Label>
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
          ← Rescan
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => submit(false)}
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Add another medication
          </button>
          <button
            onClick={() => submit(true)}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
          >
            Done — view table
          </button>
        </div>
      </div>
    </div>
  );
}