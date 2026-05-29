import { TabBarColors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const tabBarStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 10,
    right: 12,
    bottom: 15,
    height: 70,
    borderRadius: 38,
    backgroundColor: TabBarColors.pill,
    borderTopWidth: 0,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 10,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: 38,
    backgroundColor: TabBarColors.pill,
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
    padding: 24,
    paddingBottom: 110,
  },
  title: {
    color: TabBarColors.inactive,
    fontSize: 24,
    fontWeight: "700",
  },
});
