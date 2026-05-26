import type { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(error: unknown): string {
  const code = (error as FirebaseError)?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    case "auth/network-request-failed":
      return "Network error. Check your connection";
    case "auth/popup-closed-by-user":
      return "Sign-in was cancelled";
    case "auth/email-already-in-use":
      return "An account with this email already exists";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/operation-not-allowed":
      return "Email sign-up is not enabled";
    default:
      return "Something went wrong. Please try again";
  }
}
