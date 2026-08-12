import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ShieldAlert } from "lucide-react";

const CATS = [
  { v: "food", label: "Food" },
  { v: "chemical", label: "Chemical" },
  { v: "other", label: "Other" },
];

export default function Allergies() {
  const [list, setList] = useState(null);
  const [name, setName] = useState("");
  const [cat, setCat] = useState("food");

  const load = async () => setList(await base44.entities.Allergy.list());
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await base44.entities.Allergy.create({ name: name.trim(), category: cat });
    setName("");
    load();
  };

  const remove = async (id) => { await base44.entities.Allergy.delete(id); load(); };

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Your allergies</h1>
      <p className="mt-1 text-sm text-stone-500">
        Add the food or chemical ingredients you're allergic to. Every medication you scan is cross-checked against this list.
      </p>

      <form onSubmit={add} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lactose, Yellow No. 5, Gluten"
            className="h-12 border-stone-200"
          />
        </div>
        <div className="flex gap-2">
          {CATS.map((c) => (
            <button
              type="button"
              key={c.v}
              onClick={() => setCat(c.v)}
              className={`rounded-full px-4 py-2.5 text-sm transition-colors ${
                cat === c.v ? "bg-stone-900 text-white" : "border border-stone-300 text-stone-600 hover:bg-stone-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <Button type="submit" className="h-12 rounded-full bg-emerald-600 px-6 hover:bg-emerald-700">
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </form>

      {list === null && <p className="mt-8 text-sm text-stone-400">Loading…</p>}

      {list !== null && list.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-4 text-sm text-stone-500">No allergies recorded yet.</p>
        </div>
      )}

      {list && list.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {list.map((a) => (
            <span key={a.id} className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white py-2 pl-4 pr-2 text-sm">
              <span className="text-stone-700">{a.name}</span>
              <span className="text-xs text-stone-400">{a.category}</span>
              <button onClick={() => remove(a.id)} className="rounded-full p-1 text-stone-300 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}