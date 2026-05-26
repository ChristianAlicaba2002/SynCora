import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  signInWithGoogle,
  signInWithGoogleIdToken,
} from "../../firebaseConfig";
import { getAuthErrorMessage } from "../utils/authErrors";

WebBrowser.maybeCompleteAuthSession();

type UseGoogleSignInOptions = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

export function useGoogleSignIn({ onSuccess, onError }: UseGoogleSignInOptions = {}) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID || GOOGLE_WEB_CLIENT_ID,
    },
    { scheme: "syncora" }
  );

  useEffect(() => {
    if (Platform.OS === "web" || response?.type !== "success") {
      return;
    }

    const idToken = response.params.id_token;
    if (!idToken) {
      onError?.("Google sign-in failed. No token received.");
      return;
    }

    setIsGoogleLoading(true);
    signInWithGoogleIdToken(idToken)
      .then(() => onSuccess?.())
      .catch((error) => onError?.(getAuthErrorMessage(error)))
      .finally(() => setIsGoogleLoading(false));
  }, [response, onSuccess, onError]);

  const handleGoogleSignIn = async () => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      onError?.(
        "Google sign-in is not configured. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env"
      );
      return;
    }

    if (Platform.OS === "ios" && !GOOGLE_IOS_CLIENT_ID) {
      onError?.(
        "iOS Google sign-in needs EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in .env (iOS OAuth client, not Web)."
      );
      return;
    }

    setIsGoogleLoading(true);

    try {
      if (Platform.OS === "web") {
        await signInWithGoogle();
        onSuccess?.();
        return;
      }

      const result = await promptAsync();
      if (result?.type === "cancel" || result?.type === "dismiss") {
        setIsGoogleLoading(false);
        return;
      }
      if (result?.type === "error") {
        onError?.(getAuthErrorMessage(result.error));
        setIsGoogleLoading(false);
      }
    } catch (error) {
      onError?.(getAuthErrorMessage(error));
      setIsGoogleLoading(false);
    } finally {
      if (Platform.OS === "web") {
        setIsGoogleLoading(false);
      }
    }
  };

  return {
    handleGoogleSignIn,
    isGoogleLoading,
    isGoogleReady: Platform.OS === "web" || !!request,
  };
}
