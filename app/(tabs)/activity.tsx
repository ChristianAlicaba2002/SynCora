import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TTask } from "../@types";
import { scheduleTaskDeletedNotification } from "../hooks/useTaskNotification";
import { useDeleteTask, useGetTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; gradient: [string, string] }> = {
  todo:        { label: "To Do",       color: "#4A9FE8", icon: "ellipse-outline",           gradient: ["#0d2240", "#091830"] },
  in_progress: { label: "In Progress", color: "#F5A623", icon: "time-outline",              gradient: ["#2d1f08", "#1c1305"] },
  done:        { label: "Done",        color: "#32D74B", icon: "checkmark-circle-outline",  gradient: ["#082010", "#041408"] },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  low:    { label: "Low",    color: "#32D74B", icon: "arrow-down-circle" },
  medium: { label: "Medium", color: "#F5A623", icon: "remove-circle" },
  high:   { label: "High",   color: "#FF453A", icon: "arrow-up-circle" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getInitials(title: string) {
  return title.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

type FilterStatus = "all" | "todo" | "in_progress" | "done";

const FILTERS: { value: FilterStatus; label: string; icon: string }[] = [
  { value: "all",         label: "All",         icon: "apps-outline" },
  { value: "todo",        label: "To Do",       icon: "ellipse-outline" },
  { value: "in_progress", label: "In Progress", icon: "time-outline" },
  { value: "done",        label: "Done",        icon: "checkmark-circle-outline" },
];

const FILTER_COLORS: Record<FilterStatus, string> = {
  all:         "#4A9FE8",
  todo:        "#4A9FE8",
  in_progress: "#F5A623",
  done:        "#32D74B",
};

function StatsBar({ tasks }: { tasks: TTask[] }) {
  const total      = tasks.length;
  const done       = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const todo       = tasks.filter((t) => t.status === "todo").length;
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <View style={st.statsWrap}>
      <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={st.statsInner}>
        {/* Progress ring placeholder — text ring */}
        <View style={st.ringWrap}>
          <View style={[st.ringOuter, { borderColor: "rgba(74,159,232,0.25)" }]}>
            <View style={[st.ringInner, { borderColor: "#4A9FE8" }]}>
              <Text style={st.ringPct}>{pct}%</Text>
              <Text style={st.ringLabel}>done</Text>
            </View>
          </View>
        </View>

        {/* Stat chips */}
        <View style={st.statsChips}>
          <StatChip value={total}      label="Total"       color="#fff" />
          <StatChip value={todo}       label="To Do"       color="#4A9FE8" />
          <StatChip value={inProgress} label="In Progress" color="#F5A623" />
          <StatChip value={done}       label="Done"        color="#32D74B" />
        </View>
      </View>

      {/* Progress bar */}
      <View style={st.barTrack}>
        <View style={[st.barFill, { width: `${pct}%`, shadowColor: "#32D74B" }]} />
      </View>
    </View>
  );
}

function StatChip({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <View style={st.chip}>
      <Text style={[st.chipValue, { color }]}>{value}</Text>
      <Text style={st.chipLabel}>{label}</Text>
    </View>
  );
}

// ── Task card ─────────────────────────────────────────────────────────────
function TaskCard({ task, onDelete }: { task: TTask; onDelete: (id: string, title: string) => void }) {
  const swipeRef = useRef<Swipeable>(null);
  const status   = STATUS_CONFIG[task.status]   ?? STATUS_CONFIG.todo;
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const initials = getInitials(task.title);

  const renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, -40, 0],
      outputRange: [1, 0.85, 0.7],
      extrapolate: "clamp",
    });
    return (
      <RectButton
        style={s.deleteAction}
        onPress={() => {
          swipeRef.current?.close();
          if (task.id) onDelete(task.id, task.title);
        }}
      >
        <LinearGradient
          colors={["#c0392b", "#FF453A"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
        <Animated.View style={[s.deleteInner, { transform: [{ scale }] }]}>
          <View style={s.deleteIconWrap}>
            <Ionicons name="trash" size={20} color="#fff" />
          </View>
          <Text style={s.deleteLabel}>Delete</Text>
        </Animated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      rightThreshold={40}
      activeOffsetX={[-10, 10]}
      failOffsetY={[-5, 5]}
    >
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => task.id && router.push(`/screens/task/${task.id}` as any)}
        style={s.cardWrap}
      >
        <View style={s.card}>
          <LinearGradient
            colors={["rgba(255,255,255,0.04)", "rgba(255,255,255,0.02)"]}
            style={StyleSheet.absoluteFill}
          />
          <BlurView intensity={14} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[s.cardLeftAccent, { backgroundColor: status.color }]} />

          <View style={s.cardBody}>
            <View style={[s.avatar, { shadowColor: status.color }]}>
              <LinearGradient
                colors={status.gradient}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
              <Text style={s.avatarText}>{initials}</Text>
            </View>

            <View style={s.cardContent}>
              <View style={s.cardTop}>
                <Text style={s.taskTitle} numberOfLines={1}>{task.title}</Text>
                <View style={[s.priorityDot, { backgroundColor: priority.color, shadowColor: priority.color }]} />
              </View>
              <Text style={s.taskDesc} numberOfLines={1}>{task.description}</Text>
              <View style={s.cardMeta}>
                <View style={[s.statusPill, { borderColor: `${status.color}60`, backgroundColor: `${status.color}18` }]}>
                  <Ionicons name={status.icon as any} size={11} color={status.color} />
                  <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
                <View style={s.metaRight}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(255,255,255,0.35)" />
                  <Text style={s.dateText}>{formatDate(task.dueDate)}</Text>
                </View>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.2)" style={{ alignSelf: "center" }} />
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────
export default function ActivityTab() {
  const t = useTheme();
  const { data: tasks, isLoading, isError, refetch } = useGetTasks();
  const { mutate: deleteTask } = useDeleteTask();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const handleDelete = (id: string, title: string) => {
    deleteTask(id, {
      onSuccess: () => scheduleTaskDeletedNotification(title),
    });
  };

  const filtered = (tasks ?? []).filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeColor = FILTER_COLORS[filter];

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      {/* Orbs */}
      <View style={[s.orb, s.orb1, { backgroundColor: "#4A9FE8" }]} />
      <View style={[s.orb, s.orb2, { backgroundColor: "#F5A623" }]} />

      <SafeAreaView style={s.safe} edges={["top"]}>

        {/* ── Search ── */}
        <View style={s.searchWrap}>
          <BlurView intensity={20} tint="dark" style={[StyleSheet.absoluteFill, { borderRadius: 16 }]} />
          <Ionicons name="search-outline" size={16} color="rgba(255,255,255,0.4)" style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.35)" />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Stats bar (only when loaded) ── */}
        {!isLoading && !isError && (tasks ?? []).length > 0 && (
          <View style={s.statsWrap}>
            <StatsBar tasks={tasks ?? []} />
          </View>
        )}

        {/* ── Filter pills ── */}
        <View style={s.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const fc = FILTER_COLORS[f.value];
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => setFilter(f.value)}
                activeOpacity={0.75}
                style={[
                  s.filterChip,
                  active
                    ? { borderColor: fc, backgroundColor: `${fc}20` }
                    : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.05)" },
                ]}
              >
                <Ionicons
                  name={f.icon as any}
                  size={12}
                  color={active ? fc : "rgba(255,255,255,0.4)"}
                />
                <Text style={[s.filterLabel, { color: active ? fc : "rgba(255,255,255,0.45)" }, active && { fontWeight: "700" }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Section header ── */}
        {!isLoading && !isError && filtered.length > 0 && (
          <View style={s.sectionHead}>
            <View style={[s.sectionAccent, { backgroundColor: activeColor }]} />
            <Text style={s.sectionTitle}>
              {filter === "all" ? "All Tasks" : FILTERS.find((f) => f.value === filter)?.label}
            </Text>
            <View style={[s.sectionCount, { backgroundColor: `${activeColor}20`, borderColor: `${activeColor}40` }]}>
              <Text style={[s.sectionCountText, { color: activeColor }]}>{filtered.length}</Text>
            </View>
          </View>
        )}

        {/* ── List / states ── */}
        {isLoading ? (
          <View style={s.center}>
            <View style={s.loaderRing}>
              <ActivityIndicator color="#4A9FE8" size="large" />
            </View>
            <Text style={s.stateText}>Loading tasks…</Text>
          </View>
        ) : isError ? (
          <View style={s.center}>
            <View style={s.errorIcon}>
              <Ionicons name="alert-circle" size={36} color="#FF453A" />
            </View>
            <Text style={s.stateTitle}>Failed to load</Text>
            <Text style={s.stateText}>Something went wrong.</Text>
            <TouchableOpacity onPress={() => refetch()} style={s.retryBtn}>
              <Text style={s.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.length === 0 ? (
          <View style={s.center}>
            <View style={s.emptyIcon}>
              <Ionicons name="checkmark-done-circle-outline" size={36} color="rgba(255,255,255,0.25)" />
            </View>
            <Text style={s.stateTitle}>{search ? "No results" : "No tasks yet"}</Text>
            <Text style={s.stateText}>
              {search ? `Nothing matched "${search}"` : "Create your first task to get started."}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => item.id ?? String(index)}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <TaskCard task={item} onDelete={handleDelete} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const st = StyleSheet.create({
  statsWrap: { marginHorizontal: 16, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)", marginBottom: 12 },
  statsInner: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10, gap: 14 },
  ringWrap: { alignItems: "center", justifyContent: "center" },
  ringOuter: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  ringInner: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  ringPct: { color: "#fff", fontSize: 14, fontWeight: "900" },
  ringLabel: { color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  statsChips: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  chip: { alignItems: "center", gap: 2 },
  chipValue: { fontSize: 18, fontWeight: "900" },
  chipLabel: { color: "rgba(255,255,255,0.4)", fontSize: 9, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4 },
  barTrack: { height: 3, backgroundColor: "rgba(255,255,255,0.06)", marginHorizontal: 14, marginBottom: 10, borderRadius: 2, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#32D74B", borderRadius: 2, shadowOpacity: 0.8, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 3 },
});

const s = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  orb: { position: "absolute", borderRadius: 999 },
  orb1: { width: 300, height: 300, top: -100, left: -80, opacity: 0.07 },
  orb2: { width: 240, height: 240, bottom: 80, right: -70, opacity: 0.06 },

  searchWrap: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginTop: -30, marginBottom: 12, borderRadius: 16, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", overflow: "hidden" },
  searchInput: { flex: 1, fontSize: 14, color: "#fff" },

  statsWrap: {},

  filterRow: { flexDirection: "row", paddingHorizontal: 16, gap: 7, marginBottom: 12 },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterLabel: { fontSize: 12, fontWeight: "500" },

  sectionHead: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 10, gap: 8 },
  sectionAccent: { width: 3, height: 16, borderRadius: 2 },
  sectionTitle: { color: "#fff", fontSize: 14, fontWeight: "700", flex: 1 },
  sectionCount: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, borderWidth: 1 },
  sectionCountText: { fontSize: 12, fontWeight: "700" },

  list: { paddingHorizontal: 16, paddingBottom: 120, gap: 10 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 32 },
  loaderRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: "rgba(74,159,232,0.3)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(74,159,232,0.07)" },
  errorIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,69,58,0.1)", borderWidth: 1, borderColor: "rgba(255,69,58,0.25)", alignItems: "center", justifyContent: "center" },
  emptyIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  stateTitle: { color: "#fff", fontSize: 17, fontWeight: "700" },
  stateText: { color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", lineHeight: 19 },
  retryBtn: { marginTop: 4, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 22, backgroundColor: "#4A9FE8" },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // Delete swipe action
  deleteAction: { width: 80, justifyContent: "center", alignItems: "center", overflow: "hidden", borderRadius: 18, marginLeft: 8 },
  deleteInner: { alignItems: "center", gap: 4 },
  deleteIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  deleteLabel: { color: "#fff", fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  cardWrap: {},
  card: { borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)" },
  cardLeftAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderTopLeftRadius: 18, borderBottomLeftRadius: 18 },
  cardBody: { flexDirection: "row", alignItems: "center", paddingLeft: 16, paddingRight: 12, paddingVertical: 13, gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 13, overflow: "hidden", alignItems: "center", justifyContent: "center", shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 4, flexShrink: 0 },
  avatarText: { color: "#fff", fontSize: 14, fontWeight: "900", letterSpacing: 0.5 },
  cardContent: { flex: 1, gap: 5 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  taskTitle: { color: "#fff", fontSize: 15, fontWeight: "700", flex: 1 },
  priorityDot: { width: 7, height: 7, borderRadius: 4, shadowOpacity: 0.9, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 3 },
  taskDesc: { color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 16 },
  cardMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: "700" },
  metaRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { color: "rgba(255,255,255,0.35)", fontSize: 11 },
});
