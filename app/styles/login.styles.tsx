import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    },
    safe: {
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      alignItems: "center",
      paddingHorizontal: 28,
      paddingTop: 48,
      paddingBottom: 24,
    },
    logo: {
      width: 200,
      height: 250,
      borderRadius: 28,
      marginBottom: 10,
    },
    subtitle: {
      color: Colors.secondary,
      fontSize: 16,
      textAlign: "center",
      lineHeight: 24,
      marginBottom: 36,
      fontWeight: "500",
    },
    input: {
      width: "100%",
      height: 52,
      borderRadius: 14,
      backgroundColor: Colors.bg_color,
      paddingHorizontal: 18,
      color: Colors.secondary,
      fontSize: 16,
      borderWidth: 2,
      borderColor: "transparent",
    },
    inputError: {
      borderColor: Colors.error,
    },
    errorMessage: {
      color: Colors.error,
      fontSize: 15,
      margin: 4
    },
    emailRow: {
      width: "100%",
      position: "relative",
      marginBottom: 10,
    },
    passwordRow: {
      width: "100%",
      position: "relative",
      marginBottom: 10,
    },
    passwordInput: {
      paddingRight: 52,
      marginBottom: 0,
    },
    eyeButton: {
      position: "absolute",
      right: 16,
      top: 14,
    },
    loginButton: {
      width: "100%",
      height: 52,
      borderRadius: 14,
      backgroundColor: Colors.secondary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "auto",
      marginTop: 8,
    },
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      color: Colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    createButton: {
      width: "100%",
      height: 52,
      borderRadius: 14,
      backgroundColor: Colors.bg_color,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 55,
      marginTop: 13,
    },
    createButtonText: {
      color: Colors.secondary,
      fontSize: 16,
      fontWeight: "600",
    },
    googleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 50,
    },
    googleIconWrap: {
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    googleImage: {
      width: 25,
      height: 25,
      borderRadius: 50
    },
    googleText: {
      color: Colors.secondary,
      fontSize: 17,
      fontWeight: "500",
    },

    footer: {
      color: Colors.secondary,
      fontSize: 13,
      marginTop: 10,
      textAlign: "center",
    },
    errorToastContainer: {
      position: "absolute",
      left: 28,
      right: 28,
      bottom: 24,
    },
    errorToast: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "rgba(255, 59, 48, 0.95)",
      borderRadius: 14,
      paddingVertical: 14,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
    errorToastText: {
      flex: 1,
      color: Colors.secondary,
      fontSize: 15,
      fontWeight: "600",
      lineHeight: 20,
    },
  });