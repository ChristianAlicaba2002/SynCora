import { TabBarColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 15,
    height: 68,
    borderRadius: 38,
    backgroundColor: "rgba(5,13,26,0.75)",
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 4,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: 38,
    backgroundColor: "rgba(5,13,26,0.75)",
    overflow: "hidden",
  },
  tabBarItem: {
    paddingHorizontal: 2,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    textAlign: "center",
  },
  plusTabWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: TabBarColors.inactive,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const tabScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TabBarColors.screen,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 110,
  },
  title: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 24,
    fontWeight: "700",
  },
});
