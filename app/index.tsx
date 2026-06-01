import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
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
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebaseConfig";
import { useGoogleSignIn } from "./hooks/useGoogleSignIn";
import { useLoginUser } from "./hooks/useUserAuth";
import { useLoginStore } from "./store/loginStore";
import { styles } from "./styles/login.styles";

const TOAST_ENTER_MS = 250;
const TOAST_VISIBLE_MS = 1500;
const TOAST_EXIT_MS = 250;
const TOAST_SLIDE_OFFSET = 32;

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
    errorMessage,
    setErrorMessage,
    emailErrorMessage,
    setEmailErrorMessage,
    passwordErrorMessage,
    setPasswordErrorMessage,
    isLoading,
    setIsLoading,
  } = useLoginStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const { mutate: loginUser } = useLoginUser();
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(TOAST_SLIDE_OFFSET);

  const dismissToast = useCallback(() => {
    setShowErrorToast(false);
    setErrorMessage("");
  }, [setErrorMessage]);

  const toastAnimatedStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  useEffect(() => {
    if (!errorMessage) {
      setShowErrorToast(false);
      toastOpacity.value = 0;
      toastTranslateY.value = TOAST_SLIDE_OFFSET;
      return;
    }

    setShowErrorToast(true);
    toastOpacity.value = 0;
    toastTranslateY.value = TOAST_SLIDE_OFFSET;

    toastOpacity.value = withTiming(1, {
      duration: TOAST_ENTER_MS,
      easing: Easing.out(Easing.cubic),
    });
    toastTranslateY.value = withTiming(0, {
      duration: TOAST_ENTER_MS,
      easing: Easing.out(Easing.cubic),
    });

    const hideTimer = setTimeout(() => {
      toastOpacity.value = withTiming(
        0,
        { duration: TOAST_EXIT_MS, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(dismissToast)();
        }
      );
      toastTranslateY.value = withTiming(TOAST_SLIDE_OFFSET, {
        duration: TOAST_EXIT_MS,
        easing: Easing.in(Easing.cubic),
      });
    }, TOAST_ENTER_MS + TOAST_VISIBLE_MS);

    return () => clearTimeout(hideTimer);
  }, [errorMessage, dismissToast, toastOpacity, toastTranslateY]);

  const showAuthError = (message: string) => {
    setIsError(true);
    setEmailErrorMessage(message);
    setPasswordErrorMessage(message);
  };

  const { handleGoogleSignIn, isGoogleLoading, isGoogleReady } = useGoogleSignIn({
    onSuccess: () => router.replace("/(tabs)"),
    onError: showAuthError,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/(tabs)");
      }
      // If no user, stay on the login screen — no redirect needed
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
    setErrorMessage("");
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

    loginUser(
      { email, password },
      {
        onSuccess: () => {
          setIsLoading(false);
          router.replace("/home");
        },
        onError: (error: unknown) => {
          setIsLoading(false);
          const apiMessage =
            error &&
            typeof error === "object" &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response &&
            error.response.data &&
            typeof error.response.data === "object" &&
            "message" in error.response.data &&
            typeof error.response.data.message === "string"
              ? error.response.data.message
              : null;
          setErrorMessage(apiMessage ?? "Login failed. Please try again.");
        },
      }
    );
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

          {showErrorToast && errorMessage ? (
            <Animated.View
              style={[styles.errorToastContainer, toastAnimatedStyle]}
              pointerEvents="none"
            >
              <View style={styles.errorToast}>
                <Ionicons
                  name="alert-circle"
                  size={22}
                  color={Colors.secondary}
                />
                <Text style={styles.errorToastText}>{errorMessage}</Text>
              </View>
            </Animated.View>
          ) : null}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
