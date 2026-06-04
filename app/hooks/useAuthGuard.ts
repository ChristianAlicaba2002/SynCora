import { router, useRootNavigationState, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Auth middleware hook.
 * Only redirects when the token value itself changes (login / logout).
 * Does NOT re-run on tab switches — that would fight the tab navigator.
 */
export function useAuthGuard() {
  const token = useAuthStore((s) => s.token);
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Navigator not ready yet — wait
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (token && !inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!token && inAuthGroup) {
      router.replace("/");
    }
    
  }, [token, navigationState?.key]);
}
