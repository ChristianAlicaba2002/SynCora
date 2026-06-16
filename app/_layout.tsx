import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAuthGuard } from "./hooks/useAuthGuard";
import { useNotificationSetup } from "./hooks/useTaskNotification";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

function RootLayoutNav() {
  const loadToken = useAuthStore((s) => s.loadToken);
  useAuthGuard();
  useNotificationSetup();

  // Load the token from SecureStore once on mount
  useEffect(() => {
    loadToken();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="screens/task/[id]" />
      <Stack.Screen name="screens/task/edit/[id]" />
      <Stack.Screen name="screens/profile" />
      <Stack.Screen name="screens/edit-profile" />
      <Stack.Screen name="screens/user/[id]" />
      <Stack.Screen name="screens/about/index" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootLayoutNav />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
