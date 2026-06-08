import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import { useCurrentUserData } from "../hooks/useUsers";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { s } from "../styles/menu.styles";

type MenuRow = {
  icon: string;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  badge?: string;
};

export default function MenuTab() {
  const t = useTheme();
  const { data: user } = useCurrentUserData();
  const { clearToken } = useAuthStore();
  const { isDark, setDark } = useThemeStore();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const imageUrl = user?.imageUrl?.trim();
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Your Name";
  const email = user?.email ?? "you@syncora.app";
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          setIsSigningOut(true);
          await clearToken();
          // Small delay to let Zustand state propagate before navigating
          setTimeout(() => router.replace("/"), 50);
        },
      },
    ]);
  };

  // ── sub-components that need theme ───────────────────────────────────────
  function GlassSection({ children }: { children: React.ReactNode }) {
    return (
      <View style={[s.section, { borderColor: t.glassBorder }]}>
        <BlurView intensity={16} tint={t.blurTint} style={StyleSheet.absoluteFill} />
        <View style={[s.sectionShine, { backgroundColor: t.glassShine }]} />
        <View style={{ backgroundColor: t.glassBg }}>{children}</View>
      </View>
    );
  }

  function Row({ item, isLast }: { item: MenuRow; isLast: boolean }) {
    return (
      <TouchableOpacity
        onPress={item.onPress}
        activeOpacity={item.toggle ? 1 : 0.65}
        style={[s.row, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: t.rowBorder }]}
        disabled={!item.onPress && !item.toggle}
      >
        <View style={[s.rowIcon, item.danger ? s.rowIconDanger : { backgroundColor: "rgba(74,159,232,0.1)", borderColor: "rgba(74,159,232,0.2)" }]}>
          <Ionicons name={item.icon as any} size={18} color={item.danger ? "#FF453A" : "#4A9FE8"} />
        </View>
        <View style={s.rowText}>
          <Text style={[s.rowLabel, { color: item.danger ? "#FF453A" : t.textPrimary }]}>{item.label}</Text>
          {item.sublabel ? <Text style={[s.rowSublabel, { color: t.textSecondary }]}>{item.sublabel}</Text> : null}
        </View>
        {item.badge ? (
          <View style={s.badge}><Text style={s.badgeText}>{item.badge}</Text></View>
        ) : null}
        {item.toggle ? (
          <Switch
            value={item.toggleValue}
            onValueChange={item.onToggle}
            trackColor={{ false: t.glassBorder, true: "#4A9FE8" }}
            thumbColor="#ffffff"
          />
        ) : !item.danger ? (
          <Ionicons name="chevron-forward" size={16} color={t.chevron} />
        ) : null}
      </TouchableOpacity>
    );
  }

  const sections: { title: string; rows: MenuRow[] }[] = [
    {
      title: "Account",
      rows: [
        { icon: "person-circle-outline", label: "Profile", sublabel: "Edit your name, photo & bio", onPress: () => router.push("/screens/profile" as any) },
        { icon: "shield-checkmark-outline", label: "Privacy & Security", sublabel: "Password, 2FA, sessions", onPress: () => {} },
        { icon: "mail-outline", label: "Email & Notifications", sublabel: "Manage your contact info", onPress: () => {}, badge: "2" },
      ],
    },
    {
      title: "Preferences",
      rows: [
        { icon: "notifications-outline", label: "Push Notifications", toggle: true, toggleValue: notifications, onToggle: setNotifications },
        { icon: "moon-outline", label: "Dark Mode", toggle: true, toggleValue: isDark, onToggle: setDark },
        { icon: "language-outline", label: "Language", sublabel: "English", onPress: () => {} },
      ],
    },
    {
      title: "Workspace",
      rows: [
        { icon: "people-outline", label: "Team Members", sublabel: "Manage collaborators", onPress: () => {} },
        { icon: "git-branch-outline", label: "Integrations", sublabel: "Connect apps & services", onPress: () => {}, badge: "New" },
        { icon: "cloud-upload-outline", label: "Storage & Backup", sublabel: "Manage your data", onPress: () => {} },
      ],
    },
    {
      title: "Support",
      rows: [
        { icon: "help-circle-outline", label: "Help & FAQ", onPress: () => {} },
        { icon: "chatbubble-ellipses-outline", label: "Send Feedback", onPress: () => {} },
        { icon: "information-circle-outline", label: "About SynCora", sublabel: "v1.0.0", onPress: () => {} },
      ],
    },
  ];

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />
      <View style={[s.blob, s.blob3, { backgroundColor: t.blob3 }]} />

      <SafeAreaView style={s.safe} edges={["bottom"]}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* Profile banner */}
          <TouchableOpacity activeOpacity={0.75}  onPress={() => router.push("/screens/profile" as any)}>
          <View style={[s.profileBanner, { borderColor: t.glassBorder }]}>
            <BlurView intensity={16} tint={t.blurTint} style={StyleSheet.absoluteFill} />
            <View style={[s.sectionShine, { backgroundColor: t.glassShine }]} />
            <View style={[s.profileInner, { backgroundColor: t.glassBg }]}>
              <View style={[s.avatar, { borderColor: t.glassBorder }]}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={s.avatarImage} />
                ) : initials ? (
                  <>
                    <LinearGradient
                      colors={["#2a6fc4", "#4A9FE8"]}
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    />
                    <Text style={s.avatarInitials}>{initials}</Text>
                  </>
                ) : (
                  <Ionicons name="person" size={30} color={t.textSecondary} />
                )}
              </View>
              <View style={s.profileText}>
                <Text style={[s.profileName, { color: t.textPrimary }]}>{fullName}</Text>
                <Text style={[s.profileEmail, { color: t.textSecondary }]}>{email}</Text>
              </View>
              <TouchableOpacity
                style={s.editBtn}
                activeOpacity={0.7}
                onPress={() => router.push("/screens/edit-profile" as any)}
              >
                <Ionicons name="pencil-outline" size={16} color="#4A9FE8" />
              </TouchableOpacity>
            </View>
          </View>
          </TouchableOpacity>

          {/* Sections */}
          {sections.map((sec) => (
            <View key={sec.title}>
              <Text style={[s.sectionTitle, { color: t.sectionTitle }]}>{sec.title}</Text>
              <GlassSection>
                {sec.rows.map((row, i) => (
                  <Row key={row.label} item={row} isLast={i === sec.rows.length - 1} />
                ))}
              </GlassSection>
            </View>
          ))}

          {/* Sign out */}
          <GlassSection>
            <TouchableOpacity style={s.row} onPress={handleSignOut} activeOpacity={0.65} disabled={isSigningOut}>
              <View style={[s.rowIcon, s.rowIconDanger]}>
                {isSigningOut
                  ? <ActivityIndicator size="small" color="#FF453A" />
                  : <Ionicons name="log-out-outline" size={18} color="#FF453A" />}
              </View>
              <View style={s.rowText}>
                <Text style={[s.rowLabel, { color: "#FF453A" }]}>Sign out</Text>
              </View>
            </TouchableOpacity>
          </GlassSection>

          <Text style={[s.footer, { color: t.footer }]}>© SynCora 2026 · v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

