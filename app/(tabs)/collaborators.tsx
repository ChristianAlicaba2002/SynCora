import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

export default function CollaboratorsTab() {
  const t = useTheme();
  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />
      <View style={s.center}>
        <View style={[s.iconBox, { backgroundColor: "rgba(74,159,232,0.12)", borderColor: "rgba(74,159,232,0.25)" }]}>
          <Ionicons name="heart-outline" size={28} color="#4A9FE8" />
        </View>
        <Text style={[s.title, { color: t.textPrimary }]}>Collaborators</Text>
        <Text style={[s.subtitle, { color: t.textSecondary }]}>Coming soon</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 110, gap: 10 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.15 },
  blob1: { width: 280, height: 280, top: -60, right: -60 },
  blob2: { width: 220, height: 220, bottom: 100, left: -40 },
  iconBox: { width: 56, height: 56, borderRadius: 16, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14 },
});
