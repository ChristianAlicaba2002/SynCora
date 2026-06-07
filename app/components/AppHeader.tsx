import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { s } from "../styles/appHeader.styles";

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const t = useTheme();

  return (
    <View style={[s.wrapper, { paddingTop: insets.top, borderBottomColor: t.headerBorder, backgroundColor: t.screen }]}>
      {/* Frosted background */}
      <BlurView intensity={28} tint={t.blurTint} style={StyleSheet.absoluteFill} />

      <LinearGradient
        colors={["rgba(74,159,232,0.5)", "rgba(74,159,232,0)", "rgba(74,159,232,0.2)"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={s.shimmerLine}
      />

      <View style={s.inner}>

        <View style={s.left}>
          <View style={[s.logoRing, { borderColor: "rgba(74,159,232,0.4)" }]}>
            <LinearGradient
              colors={["rgba(74,159,232,0.2)", "rgba(74,159,232,0.05)"]}
              style={StyleSheet.absoluteFill}
            />
            <Image
              source={require("../../assets/images/synCora.png")}
              style={s.logo}
            />
          </View>
          <View style={s.wordmark}>
            <Text style={[s.appName, { color: t.textPrimary }]}>SynCora</Text>
            <View style={s.tagRow}>
              <View style={s.tagDot} />
              <Text style={[s.tagline, { color: t.textSecondary }]}>Task Manager</Text>
            </View>
          </View>
        </View>

        <View style={s.right}>
          {/* Notification bell */}
          <TouchableOpacity activeOpacity={0.75} style={s.actionBtn}>
            <BlurView intensity={18} tint={t.blurTint} style={StyleSheet.absoluteFill} />
            <View style={[s.actionBorder, { borderColor: "rgba(255,255,255,0.12)" }]} />
            <Ionicons name="notifications-outline" size={20} color={t.headerIcon} />
            {/* Notification badge */}
            <View style={s.badge}>
              <LinearGradient colors={["#FF6B6B", "#FF453A"]} style={StyleSheet.absoluteFill} />
              <Text style={s.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* Avatar */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={s.avatarBtn}
            onPress={() => router.push("/screens/profile" as any)}
          >
            <LinearGradient
              colors={["#2a6fc4", "#4A9FE8"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <View style={[s.avatarBorder, { borderColor: "rgba(74,159,232,0.6)" }]} />
            <Ionicons name="person" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom border glow */}
      <LinearGradient
        colors={["transparent", "rgba(74,159,232,0.25)", "transparent"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={s.bottomGlow}
      />
    </View>
  );
}