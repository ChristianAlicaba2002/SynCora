import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#050d1a" },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },

  loaderRing: {
    width: 80, height: 80, borderRadius: 40, borderWidth: 1,
    borderColor: "rgba(74,159,232,0.3)", alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(74,159,232,0.07)",
  },
  loadingText: { color: "rgba(255,255,255,0.4)", fontSize: 14 },
  errorRing: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,69,58,0.1)",
    borderWidth: 1, borderColor: "rgba(255,69,58,0.3)", alignItems: "center", justifyContent: "center",
  },
  errorTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  retryBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: "#4A9FE8" },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  backLink: { color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 8 },

  orb: { position: "absolute", borderRadius: 999 },
  orb1: { width: 380, height: 380, top: -140, right: -120, backgroundColor: "#4A9FE8", opacity: 0.06 },
  orb2: { width: 300, height: 300, bottom: 40, left: -100, backgroundColor: "#9B59B6", opacity: 0.05 },
  orb3: { width: 200, height: 200, top: 300, right: -40, backgroundColor: "#32D74B", opacity: 0.04 },

  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 13, overflow: "hidden",
    alignItems: "center", justifyContent: "center",
  },
  backBtnPlaceholder: { width: 40, height: 40 },
  backBtnBorder: {
    ...StyleSheet.absoluteFillObject, borderRadius: 13, borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  titlePill: {
    flexDirection: "row", alignItems: "center", gap: 6, overflow: "hidden",
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
  },
  titlePillText: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },

  scroll: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },

  heroBanner: {
    borderRadius: 24, overflow: "hidden", borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  heroGlow: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    top: -60, right: -40, backgroundColor: "#4A9FE8", opacity: 0.08,
  },
  heroContent: { padding: 24, alignItems: "center", gap: 10 },

  avatarContainer: { position: "relative", marginBottom: 4 },
  avatarRingGradient: {
    width: 108, height: 108, borderRadius: 34, padding: 3,
    alignItems: "center", justifyContent: "center",
  },
  avatarRingInner: {
    width: 102, height: 102, borderRadius: 32, overflow: "hidden",
    backgroundColor: "#050d1a", alignItems: "center", justifyContent: "center",
  },
  avatarCore: {
    flex: 1, width: "100%", alignItems: "center", justifyContent: "center",
  },
  avatarImage: { width: 102, height: 102, borderRadius: 32 },
  avatarText: { color: "#fff", fontSize: 30, fontWeight: "900", letterSpacing: 1 },
  memberDot: {
    position: "absolute", bottom: 4, right: 4, width: 14, height: 14,
    borderRadius: 7, backgroundColor: "#4A9FE8", borderWidth: 2, borderColor: "#050d1a",
  },

  heroName: { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", letterSpacing: 0.2 },
  heroEmail: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  badgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  badge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },

  followBtn: {
    marginTop: 4,
    minWidth: 120,
    height: 32,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  followBtnRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  followBtnOutline: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cancelBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF453A",
  },
  followBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  followBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  followBtnTextMuted: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  card: {
    borderRadius: 20, overflow: "hidden", borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  cardInner: { padding: 16, gap: 12 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardAccent: { width: 3, height: 16, borderRadius: 2 },
  cardTitle: {
    color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: "700",
    letterSpacing: 1.3, textTransform: "uppercase",
  },
  bioText: { color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 23 },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  infoRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.07)" },
  infoIconWrap: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  infoBody: { flex: 1, gap: 2 },
  infoLabel: { color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 },
  infoValue: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
