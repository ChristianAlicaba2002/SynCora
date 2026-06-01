import { TabBarColors } from "@/constants/theme";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../../firebaseConfig";

export default function HomeTab() {
  const [email, setEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Only redirect once Firebase has confirmed there is no session
        setAuthReady(true);
        router.replace("/home");
        return;
      }
      setEmail(user.email ?? user.displayName ?? "Signed in");
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  // Don't render anything until Firebase resolves the auth state
  if (!authReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={TabBarColors.inactive} size="large" />
      </SafeAreaView>
    );
  }

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
      router.replace("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SynCora Dashboard</Text>
      <Text style={styles.subtitle}>Welcome, {email ?? "..."}</Text>

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
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
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
