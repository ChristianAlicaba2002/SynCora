import { StyleSheet } from "react-native";

const GLASS_BG     = "rgba(255,255,255,0.06)";
const GLASS_BORDER = "rgba(255,255,255,0.13)";
const WHITE        = "#ffffff";
const WHITE_60     = "rgba(255,255,255,0.6)";
const ERROR        = "#FF453A";

export const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },
  flex:     { flex: 1 },

  scroll: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },

  logo: {
    width: 180,
    height: 220,
    borderRadius: 24,
    marginBottom: 12,
  },
  subtitle: {
    color: WHITE_60,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    fontWeight: "500",
  },

  emailRow: {
    width: "100%",
    marginBottom: 10,
  },
  passwordRow: {
    width: "100%",
    position: "relative",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: GLASS_BG,
    paddingHorizontal: 18,
    color: WHITE,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: GLASS_BORDER,
  },
  inputError: {
    borderColor: ERROR,
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  errorMessage: {
    color: ERROR,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },

  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    gap: 12,
    alignItems: "center",
  },

  loginButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  loginButtonDisabled: { opacity: 0.65 },
  loginButtonText: {
    color: "#1A4F7A",
    fontSize: 16,
    fontWeight: "700",
  },

  createButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: GLASS_BG,
    borderWidth: 1.5,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    color: "rgba(255,255,255,0.3)",
    fontSize: 12,
    textAlign: "center",
  },

  // Error toast
  errorToastContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,
  },
  errorToast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,69,58,0.92)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,69,58,0.5)",
  },
  errorToastText: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
