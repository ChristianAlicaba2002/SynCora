import { TabBarColors } from "@/constants/theme";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

export default function HomeTab() {
  const { clearToken } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Clear the JWT — the auth guard will redirect to / automatically
      clearToken();
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SynCora Dashboard</Text>

      <Pressable
        style={[styles.button, isSigningOut && styles.buttonDisabled]}
        onPress={handleSignOut}
        disabled={isSigningOut}
      >
        {isSigningOut ? (
          <ActivityIndicator color={TabBarColors.active} />
        ) : (
          <Text style={styles.buttonText}>Sign out</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TabBarColors.screen,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 110,
  },
  title: {
    color: TabBarColors.inactive,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 32,
  },
  button: {
    backgroundColor: TabBarColors.inactive,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 160,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: TabBarColors.active,
    fontSize: 16,
    fontWeight: "600",
  },
});
