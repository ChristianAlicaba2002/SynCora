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
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/task/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="screens/task/edit/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="screens/profile" options={{ headerShown: false }} />
      <Stack.Screen name="screens/edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="screens/user/[id]" options={{ headerShown: false }} />
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
