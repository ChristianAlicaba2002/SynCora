import { TabBarColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

const CARD_BG = "rgba(255,255,255,0.28)";
const CARD_RADIUS = 16;

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: TabBarColors.screen,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.25)",
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#3B8FD9",
    alignItems: "center",
    justifyContent: "center",
  },
   logo: {
      width: 80,
      height: 50,
      borderRadius: 28,
      marginBottom: 10,
      marginTop: 10,
    },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  bellWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#E53935",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 110,
    gap: 12,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  friendsRow: {
    flexGrow: 0,
  },
  friendsRowContent: {
    gap: 10,
    paddingVertical: 4,
  },
  friendAvatarWrapper: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
  },
  friendAvatarSelected: {
    borderColor: "#7B5EA7",
    borderRadius: 14, 
  },
  friendAvatar: {
    width: "100%",
    height: "100%",
  },
  friendAvatarPlaceholder: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: CARD_RADIUS,
  },
  cardWide: {
    height: 130,
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
    height: 110,
  },
  cardThird: {
    flex: 1,
  },
  cardThirdNarrow: {
    width: 50,
  },
  cardNarrow: {
    width: 50,
  },
});
