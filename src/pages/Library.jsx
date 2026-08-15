import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Medication } from "@/lib/localDb";
import { Input } from "@/components/ui/input";
import { Search, Pill, ShoppingCart, Leaf, Trash2 } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";

export default function Library() {
  const { t } = useLang();
  const [meds, setMeds] = useState(null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const load = async () => setMeds(await Medication.list("-created_date"));
  useEffect(() => { load(); }, []);

  const remove = async (id) => { await Medication.delete(id); load(); };

  const BADGE = {
    prescription: { cls: "bg-indigo-100 text-indigo-700", icon: Pill, label: t("table.catRx") },
    otc: { cls: "bg-amber-100 text-amber-700", icon: ShoppingCart, label: t("table.catOtc") },
    supplement: { cls: "bg-emerald-100 text-emerald-700", icon: Leaf, label: t("table.catSupp") },
  };

  const FILTERS = [
    { value: "all", label: t("library.filterAll") },
    { value: "prescription", label: t("library.filterRx") },
    { value: "otc", label: t("library.filterOtc") },
    { value: "supplement", label: t("library.filterSupp") },
  ];

  const filtered = (meds || []).filter((m) => {
    const matchesText = `${m.name} ${m.generic_name || ""}`.toLowerCase().includes(q.toLowerCase());
    const matchesCat = filter === "all" || (m.category || "prescription") === filter;
    return matchesText && matchesCat;
  });

  const counts = (meds || []).reduce((acc, m) => {
    const c = m.category || "prescription";
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">{t("library.title")}</h1>
      <p className="mt-1 text-sm text-stone-500">{t("library.desc")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === f.value ? "bg-stone-900 text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {f.label}
            {f.value !== "all" && counts[f.value] ? ` ${counts[f.value]}` : ""}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("library.search")}
          className="h-12 rounded-full border-stone-200 bg-white pl-11"
        />
      </div>

      {meds === null && <p className="mt-10 text-sm text-stone-400">{t("common.loading")}</p>}

      {meds !== null && filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Pill className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-4 text-sm text-stone-500">{t("library.empty")}</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm text-white">
            {t("library.scanNow")}
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">{t("library.colName")}</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">{t("library.colType")}</th>
                <th className="px-4 py-3 font-medium">{t("library.colDose")}</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">{t("library.colFreq")}</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">{t("library.colUsed")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-stone-100 hover:bg-stone-50/70">
                  <td className="px-4 py-3">
                    <Link to={`/medication?id=${m.id}`} className="font-medium text-stone-900 hover:underline">
                      {m.name}
                    </Link>
                    {m.generic_name && <div className="text-xs text-stone-400">{m.generic_name}</div>}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {(() => {
                      const cat = m.category || "prescription";
                      const b = BADGE[cat] || BADGE.prescription;
                      const Icon = b.icon;
                      return (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${b.cls}`}>
                          <Icon className="h-3 w-3" />
                          {b.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3 text-stone-600">{m.dose || "—"}</td>
                  <td className="hidden px-4 py-3 text-stone-600 sm:table-cell">{m.frequency || "—"}</td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-stone-600 md:table-cell">{m.purpose || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(m.id)} className="text-stone-300 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}