import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Profile as ProfileEntity } from "@/lib/localDb";

// Tracks whether a user profile exists in the local DB, so the app can
// require one before anything else is usable.
const ProfileContext = createContext({ ready: false, hasProfile: false, refresh: () => {} });

export function ProfileProvider({ children }) {
  const [hasProfile, setHasProfile] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await ProfileEntity.list();
      setHasProfile(!!(list && list.length));
    } catch {
      setHasProfile(false);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ProfileContext.Provider value={{ ready, hasProfile, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileGate() {
  return useContext(ProfileContext);
}