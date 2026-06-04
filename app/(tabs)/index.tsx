import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function HomeTab() {
  const t = useTheme();
  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />
      <View style={s.center}>
        <View style={[s.iconBox, { backgroundColor: "rgba(74,159,232,0.12)", borderColor: "rgba(74,159,232,0.25)" }]}>
          <Ionicons name="home-outline" size={32} color="#4A9FE8" />
        </View>
        <Text style={[s.title, { color: t.textPrimary }]}>Feed</Text>
        <Text style={[s.subtitle, { color: t.textSecondary }]}>Your activity feed will appear here.</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 110, gap: 10 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.18 },
  blob1: { width: 320, height: 320, top: -80, left: -80 },
  blob2: { width: 240, height: 240, bottom: 80, right: -60 },
  iconBox: { width: 64, height: 64, borderRadius: 18, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14, textAlign: "center", paddingHorizontal: 40 },
});
