import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import AppHeader from "../components/AppHeader";
import { useTheme } from "../hooks/useTheme";
import { tabBarStyles } from "../styles/tabs.styles";

function PlusTabButton({
  onPress,
  onLongPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
  testID,
}: BottomTabBarButtonProps) {
  const t = useTheme();
  const isSelected = accessibilityState?.selected ?? false;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={({ pressed }) => [tabBarStyles.plusTabWrapper, pressed && { opacity: 0.88 }]}
    >
      <View style={[tabBarStyles.plusCircle, { borderColor: isSelected ? t.tabActive : t.tabInactive }]}>
        <Ionicons name="add" size={28} color={isSelected ? t.tabActive : t.tabInactive} />
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: t.tabActive,
        tabBarInactiveTintColor: t.tabInactive,
        tabBarShowLabel: true,
        tabBarLabelStyle: tabBarStyles.tabBarLabel,
        tabBarStyle: [tabBarStyles.tabBar, { backgroundColor: t.tabBar, borderColor: t.tabBarBorder }],
        tabBarBackground: () => <View style={[tabBarStyles.tabBarBackground, { backgroundColor: t.tabBar }]} />,
        tabBarItemStyle: { justifyContent: "center", alignItems: "center", paddingVertical: 0 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Feed", tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", tabBarIcon: ({ color }) => <Ionicons name="pulse-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="create" options={{ title: "", tabBarLabel: () => null, tabBarIcon: () => null, tabBarButton: (props) => <PlusTabButton {...props} />, header: () => null }} />
      <Tabs.Screen name="collaborators" options={{ title: "Collaborators", tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: "Menu", tabBarIcon: ({ color }) => <Ionicons name="menu-outline" size={24} color={color} /> }} />
    </Tabs>
  );
}
