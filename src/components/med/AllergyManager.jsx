import React, { useEffect, useState } from "react";
import { Allergy } from "@/lib/localDb";
import { ShieldAlert, Trash2 } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";
import AllergyEntryForm from "@/components/med/AllergyEntryForm";

// Inline allergy manager — lets you add/remove allergies without leaving the
// page, so it works during first-run profile creation (when navigating to
// /allergies would be blocked by the profile gate).
export default function AllergyManager({ onChange }) {
  const { t } = useLang();
  const [list, setList] = useState(null);

  const SEV_STYLE = {
    mild: "bg-emerald-100 text-emerald-700",
    moderate: "bg-amber-100 text-amber-700",
    severe: "bg-red-100 text-red-700",
  };

  const load = async () => {
    const l = await Allergy.list();
    setList(l);
    onChange?.(l.length);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => { await Allergy.delete(id); load(); };

  return (
    <div className="mt-4 space-y-4">
      <AllergyEntryForm onAdded={load} buttonClass="bg-emerald-600" />

      {list === null && <p className="text-sm text-stone-400">{t("common.loading")}</p>}

      {list !== null && list.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center">
          <ShieldAlert className="mx-auto h-7 w-7 text-stone-300" />
          <p className="mt-3 text-sm text-stone-500">{t("allergies.empty")}</p>
        </div>
      )}

      {list && list.length > 0 && (
        <div className="space-y-2">
          {list.map((a) => (
            <div key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-stone-800">{a.name}</span>
                  {a.severity && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEV_STYLE[a.severity] || "bg-stone-100 text-stone-600"}`}>
                      {t(`allergies.sev${a.severity.charAt(0).toUpperCase()}${a.severity.slice(1)}`)}
                    </span>
                  )}
                </div>
                {a.reaction && (
                  <p className="mt-0.5 text-sm text-stone-500">
                    <span className="font-medium text-stone-400">{t("allergies.reaction")}:</span> {a.reaction}
                  </p>
                )}
              </div>
              <button onClick={() => remove(a.id)} className="shrink-0 rounded-full p-1 text-stone-300 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}