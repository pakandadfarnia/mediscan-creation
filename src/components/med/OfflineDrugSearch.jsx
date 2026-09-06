import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Pill, ShoppingCart, Leaf, Search, BookOpen } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";
import { searchDrugs, drugCount } from "@/lib/drugDatabase";

// Per-category badge styling (color + icon), matching the library cards.
const BADGE = {
  prescription: { cls: "bg-indigo-100 text-indigo-700", icon: Pill },
  otc: { cls: "bg-amber-100 text-amber-700", icon: ShoppingCart },
  supplement: { cls: "bg-emerald-100 text-emerald-700", icon: Leaf },
};
const CAT_LABEL = {
  prescription: "cat.rx",
  otc: "cat.otc",
  supplement: "cat.supp",
};

// Offline drug guide: search the bundled medication database by name and pick
// a match to prefill the confirm form — works with no internet connection.
export default function OfflineDrugSearch({ onSelect }) {
  const { t } = useLang();
  const [q, setQ] = useState("");
  const results = searchDrugs(q, 8);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
        <BookOpen className="h-4 w-4 text-stone-400" />
        {t("offline.count", { n: drugCount })}
      </div>
      <div className="relative mt-3">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("offline.searchPlaceholder")}
          className="border-stone-200 pl-10"
          autoFocus
        />
      </div>

      {q.trim().length >= 2 && results.length === 0 && (
        <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
          {t("offline.noResults")}
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-3 space-y-2">
          {results.map((d) => {
            const b = BADGE[d.category] || BADGE.prescription;
            const Icon = b.icon;
            return (
              <li key={d.name}>
                <button
                  onClick={() => onSelect(d)}
                  className="w-full rounded-xl border border-stone-200 bg-white p-3 text-left transition hover:border-primary hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900">{d.name}</p>
                      <p className="truncate text-xs text-stone-500">
                        {d.generic_name} — {d.dose} · {d.form}
                      </p>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${b.cls}`}>
                      <Icon className="h-3 w-3" /> {t(CAT_LABEL[d.category])}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}