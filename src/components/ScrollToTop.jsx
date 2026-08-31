import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Extracts the element id from a URL hash (e.g. "#section" → "section"),
// tolerating percent-encoded characters.
const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

// Scrolls to the top on every route change (so new pages start at the top),
// or to a hash target if one is present. Skips browser back/forward (POP) so
// the browser's own scroll restoration is preserved.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Don't interfere with back/forward navigation.
    if (navigationType === "POP") return;

    // If there's a hash, smooth-scroll to that element (after a tiny delay so
    // the target has rendered).
    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => window.clearTimeout(timer);
    }

    // Otherwise jump to the top of the page.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, navigationType]);

  return null;
}