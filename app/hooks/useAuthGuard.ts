import { router, useRootNavigationState, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Auth middleware hook.
 * - Waits for Zustand persist hydration before making any routing decision.
 * - Redirects to /(tabs) when a token exists and the user is on a public screen.
 * - Redirects to / when no token and the user is inside the tabs group.
 * - Segments are kept in a ref so tab-switching never re-triggers the guard.
 */
export function useAuthGuard() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // Always keep segments ref current without adding it to effect deps
  const segmentsRef = useRef(segments);
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  useEffect(() => {
    // Wait for navigation to be ready and store to be hydrated
    if (!navigationState?.key || !hasHydrated) return;

    const inTabsGroup = segmentsRef.current[0] === "(tabs)";

    if (token && !inTabsGroup) {
      router.replace("/(tabs)");
    } else if (!token && inTabsGroup) {
      router.replace("/");
    }
    // Only re-run when token or hydration status changes — NOT on segment changes
  }, [token, hasHydrated, navigationState?.key]);
}
