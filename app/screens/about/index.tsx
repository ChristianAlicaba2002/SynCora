import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { s } from "../../styles/about.styles";

const VERSION = "1.0.0";

const FEATURES = [
  {
    icon: "layers-outline",
    label: "Activities & Tasks",
    desc: "Organize work into activities and track tasks with priority and status.",
    accent: "#4A9FE8",
  },
  {
    icon: "people-outline",
    label: "Collaboration",
    desc: "Invite teammates, follow users, and stay in sync on shared work.",
    accent: "#32D74B",
  },
  {
    icon: "shield-checkmark-outline",
    label: "Secure Sign-In",
    desc: "Sign in with email and password or Google — your session stays on device.",
    accent: "#F5A623",
  },
  {
    icon: "phone-portrait-outline",
    label: "Mobile First",
    desc: "Built for iOS and Android — a focused experience wherever you work.",
    accent: "#9B59B6",
  },
] as const;

const TECH = [
  "React Native",
  "Expo SDK 54",
  "TypeScript",
  "Expo Router",
  "Supabase",
  ".NET",
] as const;

function GlassCard({
  children,
  borderColor,
  bgColor,
  blurTint,
}: {
  children: React.ReactNode;
  borderColor: string;
  bgColor: string;
  blurTint: "dark" | "light" | "default" | "prominent" | "regular";
}) {
  return (
    <View style={[s.card, { borderColor }]}>
      <BlurView intensity={16} tint={blurTint} style={StyleSheet.absoluteFill} />
      <View style={{ backgroundColor: bgColor }}>{children}</View>
    </View>
  );
}

function FeatureRow({
  icon,
  label,
  desc,
  accent,
  textPrimary,
  textSecondary,
  rowBorder,
  last,
}: {
  icon: string;
  label: string;
  desc: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  rowBorder: string;
  last?: boolean;
}) {
  return (
    <View style={[s.featureRow, !last && { ...s.featureRowBorder, borderBottomColor: rowBorder }]}>
      <View style={[s.featureIcon, { backgroundColor: `${accent}18`, borderColor: `${accent}33` }]}>
        <Ionicons name={icon as any} size={16} color={accent} />
      </View>
      <View style={s.featureBody}>
        <Text style={[s.featureLabel, { color: textPrimary }]}>{label}</Text>
        <Text style={[s.featureDesc, { color: textSecondary }]}>{desc}</Text>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  const t = useTheme();

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />
      <View style={[s.blob, s.blob3, { backgroundColor: t.blob3 }]} />

      <SafeAreaView style={s.safe} edges={["top"]}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <BlurView intensity={28} tint={t.blurTint} style={StyleSheet.absoluteFill} />
            <View style={[s.backBtnBorder, { borderColor: t.glassBorder }]} />
            <Ionicons name="chevron-back" size={20} color={t.textPrimary} />
          </TouchableOpacity>

          <BlurView intensity={20} tint={t.blurTint} style={[s.titlePill, { borderColor: t.glassBorder }]}>
            <Text style={[s.titlePillText, { color: t.textPrimary }]}>About</Text>
          </BlurView>

          <View style={s.topSpacer} />
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <GlassCard borderColor={t.glassBorder} bgColor={t.glassBg} blurTint={t.blurTint}>
            <View style={s.hero}>
              <LinearGradient
                colors={[`${t.tabActive}22`, "transparent"]}
                style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
              />
              <View style={[s.logoWrap, { borderColor: `${t.tabActive}44`, backgroundColor: `${t.tabActive}12` }]}>
                <Image source={require("../../../assets/images/synCora.png")} style={s.logo} />
              </View>
              <Text style={[s.appName, { color: t.textPrimary }]}>SynCora</Text>
              <Text style={[s.tagline, { color: t.textSecondary }]}>
                Your mobile workspace for activities, tasks, and team collaboration.
              </Text>
              <View style={s.versionBadge}>
                <Text style={s.versionText}>Version {VERSION}</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard borderColor={t.glassBorder} bgColor={t.glassBg} blurTint={t.blurTint}>
            <View style={s.cardInner}>
              <View style={s.cardHead}>
                <LinearGradient colors={["#4A9FE8", "#2170c4"]} style={s.cardAccent} />
                <Text style={[s.cardTitle, { color: t.sectionTitle }]}>What is SynCora?</Text>
              </View>
              <Text style={[s.bodyText, { color: t.textSecondary }]}>
                SynCora is a mobile task and activity manager that helps you organize work,
                set priorities, track progress, and collaborate with others — all from your phone.
              </Text>
            </View>
          </GlassCard>

          <GlassCard borderColor={t.glassBorder} bgColor={t.glassBg} blurTint={t.blurTint}>
            <View style={s.cardInner}>
              <View style={s.cardHead}>
                <LinearGradient colors={["#32D74B", "#1e9e35"]} style={s.cardAccent} />
                <Text style={[s.cardTitle, { color: t.sectionTitle }]}>Features</Text>
              </View>
              {FEATURES.map((item, i) => (
                <FeatureRow
                  key={item.label}
                  {...item}
                  textPrimary={t.textPrimary}
                  textSecondary={t.textSecondary}
                  rowBorder={t.rowBorder}
                  last={i === FEATURES.length - 1}
                />
              ))}
            </View>
          </GlassCard>

          <GlassCard borderColor={t.glassBorder} bgColor={t.glassBg} blurTint={t.blurTint}>
            <View style={s.cardInner}>
              <View style={s.cardHead}>
                <LinearGradient colors={["#F5A623", "#c47d10"]} style={s.cardAccent} />
                <Text style={[s.cardTitle, { color: t.sectionTitle }]}>Built With</Text>
              </View>
              <View style={s.techGrid}>
                {TECH.map((name) => (
                  <View
                    key={name}
                    style={[s.techChip, { borderColor: t.glassBorder, backgroundColor: `${t.tabActive}12` }]}
                  >
                    <Text style={[s.techChipText, { color: t.tabActive }]}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </GlassCard>

          <Text style={[s.footer, { color: t.footer }]}>© SynCora 2026 · Made with care</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
