import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetTasks } from "../hooks/useTasks";
import { useCurrentUserData, useGetUserFollowersCount, useGetUserFollowingCount } from "../hooks/useUsers";
import { s } from "../styles/profile.styles";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
}
function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export default function ProfileScreen() {
  const { data: user, isLoading, isError, refetch } = useCurrentUserData();
  const { data: tasks } = useGetTasks();
  const { data: followersCount = 0, isLoading: followersLoading } = useGetUserFollowersCount(user?.id);
  const { data: followingCount = 0, isLoading: followingLoading } = useGetUserFollowingCount(user?.id);

  const total      = tasks?.length ?? 0;
  const done       = tasks?.filter((t) => t.status === "done").length ?? 0;
  const inProgress = tasks?.filter((t) => t.status === "in_progress").length ?? 0;
  const todo       = tasks?.filter((t) => t.status === "todo").length ?? 0;
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0;
  const initials   = getInitials(user?.firstName, user?.lastName);

  if (isLoading) {
    return (
      <View style={s.screen}>
        <LinearGradient colors={["#050d1a", "#0a1628"]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={s.center}>
          <View style={s.loaderRing}>
            <ActivityIndicator color="#4A9FE8" size="large" />
          </View>
          <Text style={s.loadingText}>Loading profile…</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={s.screen}>
        <LinearGradient colors={["#050d1a", "#0a1628"]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={s.center}>
          <View style={s.errorRing}>
            <Ionicons name="alert-circle" size={40} color="#FF453A" />
          </View>
          <Text style={s.errorTitle}>Could not load profile</Text>
          <TouchableOpacity onPress={() => refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.backLink}>← Go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
  const imageUrl = user.imageUrl?.trim();

  return (
    <View style={s.screen}>
      {/* ── Deep background ── */}
      <LinearGradient
        colors={["#060e1f", "#050d1a", "#050d1a"]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Ambient orbs ── */}
      <View style={[s.orb, s.orb1]} />
      <View style={[s.orb, s.orb2]} />
      <View style={[s.orb, s.orb3]} />

      <SafeAreaView style={s.safe} edges={["top"]}>

        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.backBtnBorder} />
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <BlurView intensity={20} tint="dark" style={s.titlePill}>
            <Text style={s.titlePillText}>My Profile</Text>
          </BlurView>
          <TouchableOpacity
            onPress={() => router.push("/screens/edit-profile" as any)}
            style={s.backBtn}
            activeOpacity={0.7}
          >
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={[s.backBtnBorder, { borderColor: "rgba(74,159,232,0.4)" }]} />
            <Ionicons name="create-outline" size={18} color="#4A9FE8" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── Hero banner ── */}
          <View style={s.heroBanner}>
            <LinearGradient
              colors={["#0d2240", "#091830", "#050d1a"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Decorative corner glow */}
            <View style={s.heroGlow} />

            <View style={s.heroContent}>
              {/* Avatar */}
              <View style={s.avatarContainer}>
                <View style={s.avatarRing1}>
                  <View style={s.avatarRing2}>
                    {imageUrl ? (
                      <Image source={{ uri: imageUrl }} style={s.avatarImage} />
                    ) : (
                      <>
                        <LinearGradient
                          colors={["#4A9FE8", "#2a6fc4"]}
                          style={StyleSheet.absoluteFill}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        />
                        <View style={s.avatarCore}>
                          <Text style={s.avatarText}>{initials || "?"}</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
                {/* Online dot */}
                <View style={s.onlineDot} />
              </View>

              {/* Identity */}
              <Text style={s.heroName}>{fullName}</Text>
              <Text style={s.heroEmail}>{user.email}</Text>

              <View style={s.followRow}>
                <View style={s.followStat}>
                  {followersLoading ? (
                    <ActivityIndicator size="small" color="#4A9FE8" />
                  ) : (
                    <Text style={s.followValue}>{followersCount}</Text>
                  )}
                  <Text style={s.followLabel}>Followers</Text>
                </View>
                <View style={s.followDivider} />
                <View style={s.followStat}>
                  {followingLoading ? (
                    <ActivityIndicator size="small" color="#4A9FE8" />
                  ) : (
                    <Text style={s.followValue}>{followingCount}</Text>
                  )}
                  <Text style={s.followLabel}>Following</Text>
                </View>
              </View>

              {/* Badges */}
              <View style={s.badgeRow}>
                {user.gender ? (
                  <View style={[s.badge, { borderColor: "rgba(74,159,232,0.4)", backgroundColor: "rgba(74,159,232,0.12)" }]}>
                    <Ionicons name="person-outline" size={11} color="#4A9FE8" />
                    <Text style={[s.badgeText, { color: "#4A9FE8" }]}>{user.gender}</Text>
                  </View>
                ) : null}
                <View style={[s.badge, { borderColor: "rgba(50,215,75,0.4)", backgroundColor: "rgba(50,215,75,0.1)" }]}>
                  <View style={s.activeDot} />
                  <Text style={[s.badgeText, { color: "#32D74B" }]}>Active</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Completion ring + stats ── */}
          <View style={s.metricsRow}>
            {/* Ring */}
            <View style={s.ringCard}>
              <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={s.ringOuter}>
                <View style={s.ringMiddle}>
                  <View style={s.ringInner}>
                    <Text style={s.ringPct}>{pct}%</Text>
                    <Text style={s.ringDone}>done</Text>
                  </View>
                </View>
              </View>
              <Text style={s.ringCardLabel}>Completion</Text>
            </View>

            {/* Stat grid */}
            <View style={s.statGrid}>
              {[
                { value: total,      label: "Total",    color: "#fff"     },
                { value: todo,       label: "To Do",    color: "#4A9FE8"  },
                { value: inProgress, label: "Active",   color: "#F5A623"  },
                { value: done,       label: "Done",     color: "#32D74B"  },
              ].map((item) => (
                <View key={item.label} style={[s.statCell, { borderColor: `${item.color}22` }]}>
                  <BlurView intensity={14} tint="dark" style={StyleSheet.absoluteFill} />
                  <Text style={[s.statValue, { color: item.color }]}>{item.value}</Text>
                  <Text style={s.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Bio ── */}
          {user.bio ? (
            <View style={s.card}>
              <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={s.cardInner}>
                <View style={s.cardHead}>
                  <LinearGradient colors={["#4A9FE8", "#2170c4"]} style={s.cardAccent} />
                  <Text style={s.cardTitle}>ABOUT</Text>
                </View>
                <Text style={s.bioText}>{user.bio}</Text>
              </View>
            </View>
          ) : null}

          {/* ── Info ── */}
          <View style={s.card}>
            <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.cardInner}>
              <View style={s.cardHead}>
                <LinearGradient colors={["#F5A623", "#c47d10"]} style={s.cardAccent} />
                <Text style={s.cardTitle}>DETAILS</Text>
              </View>

              <InfoRow icon="mail-outline"     label="Email"        value={user.email}              accent="#4A9FE8" />
              <InfoRow icon="person-outline"   label="Gender"       value={user.gender}             accent="#F5A623" />
              <InfoRow icon="calendar-outline" label="Joined"       value={formatDate(user.createdAt)} accent="#32D74B" />
              <InfoRow icon="refresh-outline"  label="Last updated" value={formatDate(user.updatedAt)} accent="#9B59B6" last />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({ icon, label, value, accent, last = false }: {
  icon: string; label: string; value: string; accent: string; last?: boolean;
}) {
  return (
    <View style={[s.infoRow, !last && s.infoRowBorder]}>
      <View style={[s.infoIconWrap, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon as any} size={14} color={accent} />
      </View>
      <View style={s.infoBody}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue} numberOfLines={1}>{value || "—"}</Text>
      </View>
    </View>
  );
}

