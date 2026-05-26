import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  initializeAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBUjKedwY2twPtfZzF1jCAjD8UbRsvj4aU",
  authDomain: "synco-cb608.firebaseapp.com",
  projectId: "synco-cb608",
  storageBucket: "synco-cb608.firebasestorage.app",
  messagingSenderId: "847148423853",
  appId: "1:847148423853:web:743dad2a2412ec6e320424"
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function getFirebaseAuth() {
  if (Platform.OS === "web") {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

const auth = getFirebaseAuth();
const googleProvider = new GoogleAuthProvider();

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

// iOS OAuth client ID (type: iOS) — NOT the same as the Web client ID.
const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";

async function signInWithGoogle() {
  if (Platform.OS === "web") {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  }

  throw new Error(
    "Native Google sign-in must be started from the login screen"
  );
}

async function signInWithGoogleIdToken(idToken) {
  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

async function signInWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return result.user;
}

export {
  auth, GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID, googleProvider,
  signInWithEmail,
  signInWithGoogle,
  signInWithGoogleIdToken
};

