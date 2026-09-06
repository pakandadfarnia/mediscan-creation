import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Check, Users } from "lucide-react";
import { useLang } from "@/lib/LanguageProvider";
import { useMember } from "@/lib/MemberContext";
import MemberAvatar from "@/components/med/MemberAvatar";

// Compact profile switcher shown in the app header: tap to switch the active
// household profile, or jump to the profiles management page.
export default function MemberSwitcher() {
  const { t } = useLang();
  const { members, activeMember, setActiveMember } = useMember();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close the dropdown when clicking anywhere outside it.
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!activeMember) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-stone-200 bg-white py-1 pl-1 pr-2.5 text-stone-700 transition hover:bg-stone-50"
      >
        <MemberAvatar member={activeMember} className="h-7 w-7 text-[10px]" />
        <span className="max-w-24 truncate text-sm font-medium">{activeMember.name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-60 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => { setActiveMember(m.id); setOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm ${
                m.id === activeMember.id ? "bg-primary/10 text-primary" : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <MemberAvatar member={m} className="h-7 w-7 text-[10px]" />
              <span className="truncate font-medium">{m.name}</span>
              {m.id === activeMember.id && <Check className="ml-auto h-4 w-4 shrink-0" />}
            </button>
          ))}
          <div className="my-1 border-t border-stone-100" />
          <Link
            to="/household"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm text-stone-600 hover:bg-stone-100"
          >
            <Users className="h-4 w-4" /> {t("members.manage")}
          </Link>
        </div>
      )}
    </div>
  );
}