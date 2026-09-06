import React, { useState } from "react";
import { Allergy } from "@/lib/localDb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

// Shared form for adding an allergy with the reaction it causes and its
// severity. Used by both the Allergies page and the inline Profile manager.
export default function AllergyEntryForm({ onAdded, buttonClass = "bg-primary", profileId }) {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [cat, setCat] = useState("food");
  const [reaction, setReaction] = useState("");
  const [severity, setSeverity] = useState("mild");

  const CATS = [
    { v: "food", label: t("allergies.catFood") },
    { v: "chemical", label: t("allergies.catChemical") },
    { v: "other", label: t("allergies.catOther") },
  ];
  const SEVS = [
    { v: "mild", label: t("allergies.sevMild") },
    { v: "moderate", label: t("allergies.sevModerate") },
    { v: "severe", label: t("allergies.sevSevere") },
  ];

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await Allergy.create({
      name: name.trim(),
      category: cat,
      reaction: reaction.trim(),
      severity,
      profile_id: profileId,
    });
    setName("");
    setReaction("");
    setSeverity("mild");
    onAdded?.();
  };

  return (
    <form onSubmit={add} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("allergies.placeholder")}
            className="h-12 border-stone-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATS.map((c) => (
            <button
              type="button"
              key={c.v}
              onClick={() => setCat(c.v)}
              className={`rounded-full px-4 py-2.5 text-sm transition-colors ${
                cat === c.v ? "bg-primary text-white" : "border border-stone-300 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium uppercase tracking-wider text-stone-500">
            {t("allergies.reaction")}
          </Label>
          <Input
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            placeholder={t("allergies.reactionPlaceholder")}
            className="h-11 border-stone-200"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium uppercase tracking-wider text-stone-500">
            {t("allergies.severity")}
          </Label>
          <div className="flex gap-2">
            {SEVS.map((s) => (
              <button
                type="button"
                key={s.v}
                onClick={() => setSeverity(s.v)}
                className={`flex-1 rounded-full px-3 py-2.5 text-sm transition-colors ${
                  severity === s.v
                    ? s.v === "severe"
                      ? "bg-red-600 text-white"
                      : s.v === "moderate"
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    : "border border-stone-300 text-stone-600 hover:bg-stone-100"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button type="submit" className={`h-12 rounded-full px-6 hover:opacity-90 ${buttonClass}`}>
        <Plus className="mr-1 h-4 w-4" /> {t("common.add")}
      </Button>
    </form>
  );
}