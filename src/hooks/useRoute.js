import { useState, useEffect } from 'react';

// Simple hash-based routing hook. When the location hash changes, the hook
// updates the route state. Returns [route, navigate] tuple where navigate
// updates the hash.
export function useRoute() {
  const parse = () =>
    typeof window === "undefined"
      ? "home"
      : (window.location.hash.replace("#/", "").replace("#", "") || "home");
  const [route, setRoute] = useState(parse());
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return [
    route,
    (to) => {
      if (typeof window !== "undefined") window.location.hash = to ? `#/${to}` : "#/";
    },
  ];
}