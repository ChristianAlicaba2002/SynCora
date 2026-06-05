import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const t = useTheme();

  return (
    <View style={[s.wrapper, { paddingTop: insets.top, backgroundColor: t.headerBg, borderBottomColor: t.headerBorder }]}>
      <BlurView intensity={20} tint={t.blurTint} style={StyleSheet.absoluteFill} />
      <View style={[s.shine, { backgroundColor: t.glassShine }]} />

      <View style={s.inner}>
        <View style={[s.logoBox, { backgroundColor: t.glassBg, borderColor: t.glassBorder }]}>
          <Image source={require("../../assets/images/synCora.png")} style={s.logo} />
        </View>

        <View style={s.right}>
          <View style={s.bellWrapper}>
            <Ionicons name="notifications-outline" size={24} color={t.headerIcon} />
            <View style={s.badge}>
              <Text style={s.badgeText}>10</Text>
            </View>
          </View>
          <View style={[s.avatarCircle, { backgroundColor: t.glassBg, borderColor: t.glassBorder }]}>
            <Ionicons name="person-outline" size={18} color={t.headerIcon} />
          </View>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: { overflow: "hidden", borderBottomWidth: 1 },
  shine: { position: "absolute", bottom: 0, left: 0, right: 0, height: StyleSheet.hairlineWidth },
  inner: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 10 },
  logoBox: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logo: { width: 44, height: 44, resizeMode: "cover" },
  right: { flexDirection: "row", alignItems: "center", gap: 14 },
  bellWrapper: { position: "relative" },
  badge: { position: "absolute", top: -4, right: -6, backgroundColor: "#FF453A", borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  badgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
});
