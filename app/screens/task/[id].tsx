import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetTaskById } from "../../hooks/useTasks";
import { useTheme } from "../../hooks/useTheme";

const { width: SCREEN_W } = Dimensions.get("window");

const STATUS_CONFIG: Record<string, {
  label: string; color: string; dimColor: string;
  gradient: [string, string, string]; icon: string;
}> = {
  todo: {
    label: "To Do", color: "#4A9FE8", dimColor: "rgba(74,159,232,0.15)",
    gradient: ["#0d2240", "#091830", "#050d1a"], icon: "ellipse-outline",
  },
  in_progress: {
    label: "In Progress", color: "#F5A623", dimColor: "rgba(245,166,35,0.15)",
    gradient: ["#2d1f08", "#1c1305", "#050d1a"], icon: "time-outline",
  },
  done: {
    label: "Done", color: "#32D74B", dimColor: "rgba(50,215,75,0.15)",
    gradient: ["#082010", "#041408", "#050d1a"], icon: "checkmark-circle",
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  low:    { label: "Low",    color: "#32D74B", icon: "arrow-down-circle" },
  medium: { label: "Medium", color: "#F5A623", icon: "remove-circle" },
  high:   { label: "High",   color: "#FF453A", icon: "arrow-up-circle" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function getInitials(title: string) {
  return title.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const { data: task, isLoading, isError, refetch } = useGetTaskById(id);

  if (isLoading) {
    return (
      <LinearGradient colors={["#050d1a", "#0a1628", "#0d1f3c"]} style={s.screen}>
        <SafeAreaView style={s.center}>
          <View style={s.loaderRing}>
            <ActivityIndicator color="#4A9FE8" size="large" />
          </View>
          <Text style={s.loadingText}>Fetching task…</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (isError || !task) {
    return (
      <LinearGradient colors={["#050d1a", "#0a1628", "#0d1f3c"]} style={s.screen}>
        <SafeAreaView style={s.center}>
          <View style={s.errorRing}>
            <Ionicons name="alert-circle" size={40} color="#FF453A" />
          </View>
          <Text style={s.errorTitle}>Could not load task</Text>
          <Text style={s.errorSub}>Check your connection and try again.</Text>
          <TouchableOpacity onPress={() => refetch()} style={s.retryBtn} activeOpacity={0.8}>
            <Text style={s.retryText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backLinkText}>← Go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const status   = STATUS_CONFIG[task.status]   ?? STATUS_CONFIG.todo;
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const initials = getInitials(task.title);

  return (
    <View style={s.screen}>
      {/* Full-screen status gradient background */}
      <LinearGradient
        colors={status.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />

      {/* Glow orbs */}
      <View style={[s.orb, s.orb1, { backgroundColor: status.color }]} />
      <View style={[s.orb, s.orb2, { backgroundColor: priority.color }]} />
      <View style={[s.orb, s.orb3, { backgroundColor: status.color }]} />

      <SafeAreaView style={s.safe} edges={["top"]}>
        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={s.backBtn}
            activeOpacity={0.7}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          <BlurView intensity={20} tint="dark" style={s.topBarPill}>
            <Text style={s.topBarLabel}>Task Detail</Text>
          </BlurView>

          <TouchableOpacity
            onPress={() => router.push(`/screens/task/edit/${task.id}` as any)}
            style={s.editBtn}
            activeOpacity={0.7}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <Ionicons name="create-outline" size={18} color="#4A9FE8" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Avatar + title hero ── */}
          <View style={s.heroSection}>
            <View style={[s.avatar, { borderColor: status.color, shadowColor: status.color }]}>
              <LinearGradient
                colors={[status.color, `${status.color}88`]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <Text style={s.avatarText}>{initials}</Text>
            </View>

            <Text style={s.heroTitle}>{task.title}</Text>
            <Text style={s.heroSub}>Created {task.createdAt ? formatDateTime(task.createdAt) : "—"}</Text>

            {/* Status + priority chips */}
            <View style={s.chipRow}>
              <View style={[s.chip, { borderColor: status.color, backgroundColor: status.dimColor }]}>
                <Ionicons name={status.icon as any} size={14} color={status.color} />
                <Text style={[s.chipText, { color: status.color }]}>{status.label}</Text>
              </View>
              <View style={[s.chip, { borderColor: priority.color, backgroundColor: `${priority.color}18` }]}>
                <Ionicons name={priority.icon as any} size={14} color={priority.color} />
                <Text style={[s.chipText, { color: priority.color }]}>{priority.label} Priority</Text>
              </View>
            </View>
          </View>

          {/* ── Progress bar (visual only, based on status) ── */}
          <View style={[s.progressCard]}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.progressCardInner}>
              <View style={s.progressHeader}>
                <Text style={s.progressLabel}>Completion</Text>
                <Text style={[s.progressPct, { color: status.color }]}>
                  {task.status === "done" ? "100" : task.status === "in_progress" ? "50" : "0"}%
                </Text>
              </View>
              <View style={s.progressTrack}>
                <View
                  style={[
                    s.progressFill,
                    {
                      width: `${task.status === "done" ? 100 : task.status === "in_progress" ? 50 : 4}%`,
                      backgroundColor: status.color,
                      shadowColor: status.color,
                    },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* ── Description ── */}
          <View style={s.glassCard}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.glassCardInner}>
              <View style={s.glassCardHeader}>
                <LinearGradient colors={["#4A9FE8", "#2170c4"]} style={s.labelAccent} />
                <Text style={s.glassCardLabel}>DESCRIPTION</Text>
              </View>
              <Text style={s.descText}>{task.description}</Text>
            </View>
          </View>

          {/* ── Details grid ── */}
          <View style={s.gridRow}>
            <View style={[s.gridCard, s.gridCardHalf]}>
              <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={s.gridCardInner}>
                <View style={[s.gridIcon, { backgroundColor: "rgba(74,159,232,0.2)" }]}>
                  <Ionicons name="calendar" size={18} color="#4A9FE8" />
                </View>
                <Text style={s.gridLabel}>Due Date</Text>
                <Text style={s.gridValue} numberOfLines={2}>{formatDate(task.dueDate)}</Text>
              </View>
            </View>

            <View style={[s.gridCard, s.gridCardHalf]}>
              <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={s.gridCardInner}>
                <View style={[s.gridIcon, { backgroundColor: `${priority.color}22` }]}>
                  <Ionicons name={priority.icon as any} size={18} color={priority.color} />
                </View>
                <Text style={s.gridLabel}>Priority</Text>
                <Text style={[s.gridValue, { color: priority.color }]}>{priority.label}</Text>
              </View>
            </View>
          </View>

          {/* ── Metadata ── */}
          {(task.createdAt || task.updatedAt || task.id) && (
            <View style={s.glassCard}>
              <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={s.glassCardInner}>
                <View style={s.glassCardHeader}>
                  <LinearGradient colors={["#F5A623", "#c47d10"]} style={s.labelAccent} />
                  <Text style={s.glassCardLabel}>METADATA</Text>
                </View>

                {task.createdAt && (
                  <MetaRow icon="time-outline" accent="#32D74B" label="Created at" value={formatDateTime(task.createdAt)} />
                )}
                {task.updatedAt && (
                  <MetaRow icon="refresh-circle-outline" accent="#F5A623" label="Updated at" value={formatDateTime(task.updatedAt)} last={!task.id} />
                )}
                {task.id && (
                  <MetaRow icon="finger-print-outline" accent="rgba(255,255,255,0.4)" label="Task ID" value={task.id} mono last />
                )}
              </View>
            </View>
          )}

          {/* ── Bottom spacer ── */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MetaRow({ icon, accent, label, value, mono, last }: {
  icon: string; accent: string; label: string; value: string; mono?: boolean; last?: boolean;
}) {
  return (
    <View style={[s.metaRow, !last && s.metaRowBorder]}>
      <View style={[s.metaIcon, { backgroundColor: `${accent}20` }]}>
        <Ionicons name={icon as any} size={14} color={accent} />
      </View>
      <View style={s.metaText}>
        <Text style={s.metaLabel}>{label}</Text>
        <Text style={[s.metaValue, mono && s.mono]} numberOfLines={1} ellipsizeMode="middle">
          {value}
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#050d1a" },
  safe: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14, paddingHorizontal: 32 },

  // Loading / error
  loaderRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, borderColor: "rgba(74,159,232,0.3)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(74,159,232,0.08)" },
  loadingText: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
  errorRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,69,58,0.1)", borderWidth: 1, borderColor: "rgba(255,69,58,0.3)", alignItems: "center", justifyContent: "center" },
  errorTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  errorSub: { color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 20 },
  retryBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 24, backgroundColor: "#4A9FE8" },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  backLinkText: { color: "rgba(255,255,255,0.4)", fontSize: 14 },

  // Orbs
  orb: { position: "absolute", borderRadius: 999 },
  orb1: { width: 380, height: 380, top: -140, right: -120, opacity: 0.12 },
  orb2: { width: 280, height: 280, bottom: 60, left: -100, opacity: 0.1 },
  orb3: { width: 160, height: 160, top: 320, right: -30, opacity: 0.07 },

  // Top bar
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 14, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  editBtn: { width: 40, height: 40, borderRadius: 14, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(74,159,232,0.4)" },
  topBarPill: { overflow: "hidden", borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  topBarLabel: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },

  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40, gap: 14 },

  // Hero
  heroSection: { alignItems: "center", gap: 12, paddingTop: 8, paddingBottom: 4 },
  avatar: { width: 76, height: 76, borderRadius: 22, overflow: "hidden", borderWidth: 2, alignItems: "center", justifyContent: "center", shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 10 },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 1 },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "900", textAlign: "center", lineHeight: 30, letterSpacing: 0.2, paddingHorizontal: 8 },
  heroSub: { color: "rgba(255,255,255,0.4)", fontSize: 12 },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: "700" },

  // Progress
  progressCard: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  progressCardInner: { padding: 16, gap: 10 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" },
  progressPct: { fontSize: 22, fontWeight: "900" },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3, shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 4 },

  // Glass cards
  glassCard: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  glassCardInner: { padding: 16, gap: 12 },
  glassCardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  labelAccent: { width: 3, height: 16, borderRadius: 2 },
  glassCardLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "700", letterSpacing: 1.3, textTransform: "uppercase" },
  descText: { color: "rgba(255,255,255,0.88)", fontSize: 15, lineHeight: 24 },

  // Grid
  gridRow: { flexDirection: "row", gap: 12 },
  gridCard: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  gridCardHalf: { flex: 1 },
  gridCardInner: { padding: 14, gap: 8 },
  gridIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  gridLabel: { color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: "600", letterSpacing: 0.8, textTransform: "uppercase" },
  gridValue: { color: "#fff", fontSize: 14, fontWeight: "700", lineHeight: 18 },

  // Meta rows
  metaRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  metaRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.07)" },
  metaIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  metaText: { flex: 1, gap: 2 },
  metaLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.9 },
  metaValue: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "500" },
  mono: { fontVariant: ["tabular-nums"], fontSize: 11, color: "rgba(255,255,255,0.5)" },
});
