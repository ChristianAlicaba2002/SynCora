import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthGuard } from "./hooks/useAuthGuard";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const loadToken = useAuthStore((s) => s.loadToken);
  useAuthGuard();

  // Load the token from SecureStore once on mount
  useEffect(() => {
    loadToken();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
