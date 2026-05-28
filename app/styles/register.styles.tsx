import { StyleSheet } from "react-native";
import { Colors, ModalColors } from "../../constants/theme";

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
  content: {
    flex: 1,
    paddingHorizontal: 28,
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
    backgroundColor: Colors.bg_color,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: {
    color: "#1A4F7A",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
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
    marginBottom: 14,
  },
  inputError: {
    borderColor: Colors.error,
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
    color: Colors.error,
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 4,
  },
  genderButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.bg_color,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  genderText: {
    color: Colors.secondary,
    fontSize: 16,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 13,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: ModalColors.overlay,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: ModalColors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ModalColors.border,
  },
  modalOptionText: {
    fontSize: 17,
    color: ModalColors.text,
  },
});
