import { router, useRootNavigationState, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

// Routes that are public (no token needed)
const PUBLIC_ROUTES = ["index", "register"];

export function useAuthGuard() {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || !hasHydrated) return;

    const firstSegment = segments[0] as string | undefined;

    // User is on a public route (login / register)
    const isOnPublicRoute =
      !firstSegment || PUBLIC_ROUTES.includes(firstSegment);

    if (!token && !isOnPublicRoute) {
      // Not logged in and trying to access a protected route → send to login
      router.replace("/");
    } else if (token && isOnPublicRoute) {
      // Logged in but on login/register → send to app
      router.replace("/(tabs)");
    }
    // Logged in and on any non-public route (tabs, screens/task, etc.) → let them be
  }, [token, hasHydrated, segments, navigationState?.key]);
}
