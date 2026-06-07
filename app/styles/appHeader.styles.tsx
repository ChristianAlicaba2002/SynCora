import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  shimmerLine: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 1,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  // Left
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoRing: {
    width: 40,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
  wordmark: {
    gap: 1,
  },
  appName: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  tagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#4A9FE8",
  },
  tagline: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Right
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "800",
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 13,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 13,
    borderWidth: 1.5,
  },

  // Bottom glow
  bottomGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});
