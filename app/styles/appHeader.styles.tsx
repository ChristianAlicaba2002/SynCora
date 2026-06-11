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
    borderRadius: 50,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "cover",
    borderRadius: 50,
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
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  avatarImage: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
  },
  avatarInitials: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Search
  searchBarRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchBackBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  resultsPanel: {
    maxHeight: 320,
    borderTopWidth: StyleSheet.hairlineWidth,
    zIndex: 10,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  resultsHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  resultsList: {
    maxHeight: 280,
  },
  resultsState: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 20,
  },
  resultsStateText: {
    fontSize: 14,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  resultAvatarImage: {
    width: 40,
    height: 40,
  },
  resultInitials: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 40,
  },
  resultText: {
    flex: 1,
    gap: 2,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "700",
  },
  resultPreview: {
    fontSize: 12,
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
