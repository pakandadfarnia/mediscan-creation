import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Search, Pill, Trash2 } from "lucide-react";

export default function Library() {
  const [meds, setMeds] = useState(null);
  const [q, setQ] = useState("");

  const load = async () => setMeds(await base44.entities.Medication.list("-created_date"));
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    await base44.entities.Medication.delete(id);
    load();
  };

  const filtered = (meds || []).filter((m) =>
    `${m.name} ${m.generic_name || ""}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Your medications</h1>
      <p className="mt-1 text-sm text-stone-500">Everything you've scanned, in one table.</p>

      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name"
          className="h-12 rounded-full border-stone-200 bg-white pl-11"
        />
      </div>

      {meds === null && <p className="mt-10 text-sm text-stone-400">Loading…</p>}

      {meds !== null && filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Pill className="mx-auto h-8 w-8 text-stone-300" />
          <p className="mt-4 text-sm text-stone-500">Nothing here yet — scan your first medication.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm text-white">
            Scan now
          </Link>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Dose</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Frequency</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Used for</th>
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