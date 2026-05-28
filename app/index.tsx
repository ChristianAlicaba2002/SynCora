import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, signInWithEmail } from "../firebaseConfig";
import { useGoogleSignIn } from "./hooks/useGoogleSignIn";
import { useLoginStore } from "./store/loginStore";
import { styles } from "./styles/login.styles";
import { getAuthErrorMessage } from "./utils/authErrors";

export default function Index() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isError,
    setIsError,
    emailErrorMessage,
    setEmailErrorMessage,
    passwordErrorMessage,
    setPasswordErrorMessage,
    isLoading,
    setIsLoading,
  } = useLoginStore();

  const [refreshing, setRefreshing] = useState(false);

  const showAuthError = (message: string) => {
    setIsError(true);
    setEmailErrorMessage(message);
    setPasswordErrorMessage(message);
  };

  const { handleGoogleSignIn, isGoogleLoading, isGoogleReady } = useGoogleSignIn({
    onSuccess: () => router.replace("/home"),
    onError: showAuthError,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/home");
      }
    });

    return unsubscribe;
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setIsError(false);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSubmit = async () => {
    setIsError(false);
    setEmailErrorMessage("");
    setPasswordErrorMessage("");

    let hasError = false;

    if (!email.trim()) {
      hasError = true;
      setEmailErrorMessage("Email is required");
    }

    if (!password) {
      hasError = true;
      setPasswordErrorMessage("Password is required");
    }

    if (hasError) {
      setIsError(true);
      return;
    }

    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      router.replace("/home");
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setIsError(true);
      setEmailErrorMessage(message);
      setPasswordErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitting = isLoading || isGoogleLoading;

  return (
    <LinearGradient
      colors={Colors.gradient as [string, string, string]}
      locations={[0, 0.45, 1]}
      style={styles.gradient}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Image
              source={require("../assets/images/synCora.png")}
              style={styles.logo}
            />

            <Text style={styles.subtitle}>
              Sign in to access your SynCora dashboard.
            </Text>

            <View style={styles.emailRow}>
              <TextInput
                style={[styles.input, isError && emailErrorMessage ? styles.inputError : null]}
                placeholder="Email"
                placeholderTextColor={Colors.secondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="username"
                editable={!isSubmitting}
              />
              <Text style={styles.errorMessage}>{isError && emailErrorMessage}</Text>
            </View>

            <View style={styles.passwordRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  isError && passwordErrorMessage ? styles.inputError : null,
                ]}
                placeholder="Password"
                placeholderTextColor={Colors.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="password"
                editable={!isSubmitting}
              />
              <Text style={styles.errorMessage}>{isError && passwordErrorMessage}</Text>
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={12}
                disabled={isSubmitting}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color={Colors.secondary}
                />
              </Pressable>
            </View>

            <Pressable
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isLoading ? (
                <ActivityIndicator color="#3B8FD9" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable
              style={styles.createButton}
              onPress={() => router.push("/register")}
              disabled={isSubmitting}
            >
              <Text style={styles.createButtonText}>Create new account ?</Text>
            </Pressable>

            <Pressable
              style={[styles.googleRow, isGoogleLoading && styles.loginButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isSubmitting || !isGoogleReady}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <View style={styles.googleIconWrap}>
                    <Image
                      source={require("../assets/images/google_transparent.jpg")}
                      style={styles.googleImage}
                    />
                  </View>
                  <Text style={styles.googleText}>Sign in with Google</Text>
                </>
              )}
            </Pressable>
            <Text style={styles.footer}>© All right reserved 2026</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
