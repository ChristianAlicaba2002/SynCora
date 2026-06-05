import { StyleSheet } from "react-native";

const GLASS_BG    = "rgba(255,255,255,0.06)";
const GLASS_BORDER = "rgba(255,255,255,0.13)";
const WHITE       = "#ffffff";
const WHITE_60    = "rgba(255,255,255,0.6)";
const ERROR       = "#FF453A";

export const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe:     { flex: 1 },
  flex:     { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: GLASS_BG,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    color: WHITE,
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    color: WHITE_60,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
    fontWeight: "500",
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
    marginBottom: 12,
  },
  inputError: {
    borderColor: ERROR,
  },
  passwordInput: {
    paddingRight: 52,
  },
  fieldRow: {
    width: "100%",
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  errorMessage: {
    color: ERROR,
    fontSize: 13,
    marginTop: -6,
    marginBottom: 10,
    marginLeft: 4,
  },

  genderButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: GLASS_BG,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: GLASS_BORDER,
  },
  genderText: {
    color: WHITE,
    fontSize: 16,
  },

  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  primaryButtonDisabled: { opacity: 0.65 },
  primaryButtonText: {
    color: "#1A4F7A",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12,
    textAlign: "center",
  },

  // Gender modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0d1f3c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: GLASS_BORDER,
    paddingBottom: 32,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GLASS_BORDER,
  },
  modalOptionText: {
    fontSize: 17,
    color: WHITE,
  },
});
