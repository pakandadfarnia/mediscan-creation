import React, { createContext, useContext, useEffect, useState } from "react";
import { Member, Medication, Allergy } from "@/lib/localDb";

const MemberCtx = createContext(null);
const ACTIVE_KEY = "mediscan_active_member";

// Provides the household profiles (members) and the currently active one.
// Medications, allergies and alarms are each scoped to a profile via
// `profile_id`. On first run a default profile is created and any existing
// records are backfilled to it, so nothing is lost.
export function MemberProvider({ children }) {
  const [members, setMembers] = useState(null);
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY));

  useEffect(() => {
    let alive = true;
    (async () => {
      let list = await Member.list("created_date");
      if (!list.length) {
        // First run: create the default profile and scope existing records.
        const me = await Member.create({ name: "Me", age_group: "adult", color: 0 });
        for (const m of await Medication.list()) {
          if (!m.profile_id) await Medication.update(m.id, { profile_id: me.id });
        }
        for (const a of await Allergy.list()) {
          if (!a.profile_id) await Allergy.update(a.id, { profile_id: me.id });
        }
        list = [me];
      }
      if (alive) setMembers(list);
    })().catch(() => { if (alive) setMembers([]); });
    return () => { alive = false; };
  }, []);

  const activeMember = members?.find((m) => m.id === activeId) || members?.[0] || null;

  // Switch the active profile (persisted so it survives reloads).
  const setActiveMember = (id) => {
    setActiveId(id);
    localStorage.setItem(ACTIVE_KEY, id);
  };

  // Re-read the member list after a create/update/delete.
  const reload = async () => setMembers(await Member.list("created_date"));

  return (
    <MemberCtx.Provider value={{ members, activeMember, setActiveMember, reload }}>
      {children}
    </MemberCtx.Provider>
  );
}

export function useMember() {
  return useContext(MemberCtx);
}