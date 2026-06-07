import { Dimensions, StyleSheet } from "react-native";

const { width: SCREEN_W } = Dimensions.get("window");

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#050d1a" },
  safe:   { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },

  // States
  loaderRing:  { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: "rgba(74,159,232,0.3)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(74,159,232,0.07)" },
  loadingText: { color: "rgba(255,255,255,0.4)", fontSize: 14 },
  errorRing:   { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,69,58,0.1)", borderWidth: 1, borderColor: "rgba(255,69,58,0.3)", alignItems: "center", justifyContent: "center" },
  errorTitle:  { color: "#fff", fontSize: 20, fontWeight: "700" },
  retryBtn:    { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: "#4A9FE8" },
  retryText:   { color: "#fff", fontWeight: "700", fontSize: 15 },
  backLink:    { color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 8 },

  // Orbs
  orb:  { position: "absolute", borderRadius: 999 },
  orb1: { width: 380, height: 380, top: -140, right: -120, backgroundColor: "#4A9FE8", opacity: 0.06 },
  orb2: { width: 300, height: 300, bottom: 40,  left: -100,  backgroundColor: "#9B59B6", opacity: 0.05 },
  orb3: { width: 200, height: 200, top: 300,   right: -40,  backgroundColor: "#32D74B", opacity: 0.04 },

  // Top bar
  topBar:       { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn:      { width: 40, height: 40, borderRadius: 13, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  backBtnBorder:{ ...StyleSheet.absoluteFillObject, borderRadius: 13, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  titlePill:    { overflow: "hidden", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  titlePillText:{ color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },

  scroll: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },

  // Hero banner
  heroBanner:  { borderRadius: 24, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)" },
  heroGlow:    { position: "absolute", width: 200, height: 200, borderRadius: 100, top: -60, right: -40, backgroundColor: "#4A9FE8", opacity: 0.08 },
  heroContent: { padding: 24, alignItems: "center", gap: 10 },

  // Avatar
  avatarContainer: { position: "relative", marginBottom: 4 },
  avatarRing1:     { width: 100, height: 100, borderRadius: 30, borderWidth: 1, borderColor: "rgba(74,159,232,0.2)", alignItems: "center", justifyContent: "center", padding: 4 },
  avatarRing2:     { width: 90, height: 90, borderRadius: 26, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  avatarCore:      { width: 90, height: 90, borderRadius: 26, backgroundColor: "rgba(10,24,40,0.7)", alignItems: "center", justifyContent: "center", position: "absolute" },
  avatarText:      { color: "#fff", fontSize: 28, fontWeight: "900", letterSpacing: 1 },
  onlineDot:       { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: "#32D74B", borderWidth: 2, borderColor: "#050d1a" },

  heroName:  { color: "#fff", fontSize: 22, fontWeight: "900", textAlign: "center", letterSpacing: 0.2 },
  heroEmail: { color: "rgba(255,255,255,0.4)", fontSize: 13 },
  badgeRow:  { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  badge:     { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#32D74B" },

  // Metrics
  metricsRow: { flexDirection: "row", gap: 12 },
  ringCard:   { width: 110, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)", alignItems: "center", justifyContent: "center", paddingVertical: 16, gap: 8 },
  ringOuter:  { width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: "rgba(74,159,232,0.2)", alignItems: "center", justifyContent: "center" },
  ringMiddle: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: "rgba(74,159,232,0.5)", alignItems: "center", justifyContent: "center" },
  ringInner:  { alignItems: "center" },
  ringPct:    { color: "#4A9FE8", fontSize: 16, fontWeight: "900" },
  ringDone:   { color: "rgba(255,255,255,0.35)", fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.6 },
  ringCardLabel: { color: "rgba(255,255,255,0.35)", fontSize: 9, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 },

  statGrid:  { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statCell:  { width: (SCREEN_W - 32 - 110 - 12 - 8) / 2, borderRadius: 14, overflow: "hidden", borderWidth: 1, alignItems: "center", paddingVertical: 10, gap: 3 },
  statValue: { fontSize: 20, fontWeight: "900" },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },

  // Cards
  card:      { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)" },
  cardInner: { padding: 16, gap: 12 },
  cardHead:  { flexDirection: "row", alignItems: "center", gap: 10 },
  cardAccent:{ width: 3, height: 16, borderRadius: 2 },
  cardTitle: { color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: "700", letterSpacing: 1.3, textTransform: "uppercase" },
  bioText:   { color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 23 },

  // Info rows
  infoRow:       { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  infoRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.07)" },
  infoIconWrap:  { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  infoBody:      { flex: 1, gap: 2 },
  infoLabel:     { color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.9 },
  infoValue:     { color: "rgba(255,255,255,0.85)", fontSize: 14, fontWeight: "500" },
});
