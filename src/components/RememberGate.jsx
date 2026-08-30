import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Welcome from "@/pages/Welcome";
import { getRemember, setRemember } from "@/lib/rememberAccount";

// Sits inside the protected route. Signed-in users see the Welcome screen
// first unless they've chosen "remember my account" — in which case they go
// straight into the app.
export default function RememberGate() {
  const [remember, setRememberState] = useState(getRemember());

  if (remember) return <Outlet />;

  const handleContinue = (persist) => {
    if (persist) setRemember(true);
    setRememberState(true);
  };

  return <Welcome mode="authed" onContinue={handleContinue} />;
}