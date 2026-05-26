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
      color: "#FFFFFF",
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
      backgroundColor: "rgba(255,255,255,0.22)",
      paddingHorizontal: 18,
      color: "#FFFFFF",
      fontSize: 16,
      borderWidth: 2,
      borderColor: "transparent",
    },
    inputError: {
      borderColor: "#FF3B30",
    },
    errorMessage: {
      color: "red",
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
      backgroundColor: "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "auto",
      marginTop: 8,
    },
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      color: "#3B8FD9",
      fontSize: 16,
      fontWeight: "600",
    },
    createButton: {
      width: "100%",
      height: 52,
      borderRadius: 14,
      backgroundColor: "rgba(208, 208, 208, 0.22)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 55,
      marginTop: 13,
    },
    createButtonText: {
      color: "rgba(243, 243, 243, 1)",
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
      color: "#FFFFFF",
      fontSize: 17,
      fontWeight: "500",
    },

    footer: {
      color: "rgba(255,255,255,0.95)",
      fontSize: 13,
      marginTop: 10,
      textAlign: "center",
    },
  });