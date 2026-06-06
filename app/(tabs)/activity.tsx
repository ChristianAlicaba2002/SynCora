import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TTask } from "../@types";
import { useGetTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  todo:        { label: "To Do",       color: "#4A9FE8", icon: "ellipse-outline" },
  in_progress: { label: "In Progress", color: "#F5A623", icon: "time-outline" },
  done:        { label: "Done",        color: "#32D74B", icon: "checkmark-circle-outline" },
};

const PRIORITY_CONFIG: Record<string, { color: string; icon: string }> = {
  low:    { color: "#32D74B", icon: "arrow-down-outline" },
  medium: { color: "#F5A623", icon: "remove-outline" },
  high:   { color: "#FF453A", icon: "arrow-up-outline" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

type FilterStatus = "all" | "todo" | "in_progress" | "done";

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: "all",         label: "All" },
  { value: "todo",        label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done",        label: "Done" },
];

export default function ActivityTab() {
  const t = useTheme();
  const { data: tasks, isLoading, isError, refetch } = useGetTasks();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<FilterStatus>("all");

  const filtered = (tasks ?? []).filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function TaskCard({ task }: { task: TTask }) {
    const status   = STATUS_CONFIG[task.status]   ?? STATUS_CONFIG.todo;
    const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

    return (
      <View style={[s.card, { borderColor: t.glassBorder, backgroundColor: t.glassBg }]}>
        <BlurView intensity={16} tint={t.blurTint} style={StyleSheet.absoluteFill} />
        <View style={[s.cardShine, { backgroundColor: t.glassShine }]} />
        <View style={s.cardContent}>
          {/* Title + priority */}
          <View style={s.cardHeader}>
            <Text style={[s.taskTitle, { color: t.textPrimary }]} numberOfLines={1}>
              {task.title}
            </Text>
            <View style={[s.priorityBadge, { backgroundColor: `${priority.color}22`, borderColor: priority.color }]}>
              <Ionicons name={priority.icon as any} size={11} color={priority.color} />
              <Text style={[s.priorityText, { color: priority.color }]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[s.taskDesc, { color: t.textSecondary }]} numberOfLines={2}>
            {task.description}
          </Text>

          {/* Footer */}
          <View style={s.cardFooter}>
            <View style={[s.statusPill, { backgroundColor: `${status.color}22`, borderColor: status.color }]}>
              <Ionicons name={status.icon as any} size={12} color={status.color} />
              <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
            <View style={s.dateRow}>
              <Ionicons name="calendar-outline" size={12} color={t.textSecondary} />
              <Text style={[s.dateText, { color: t.textSecondary }]}>{formatDate(task.dueDate)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      {/* Blobs */}
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />

      <SafeAreaView style={s.safe} edges={["top"]}>
        {/* Search */}
        <View style={s.searchWrap}>
          <View style={[s.searchBar, { backgroundColor: t.searchBg, borderColor: t.searchBorder }]}>
            <Ionicons name="search-outline" size={16} color={t.searchPlaceholder} style={{ marginRight: 8 }} />
            <TextInput
              style={[s.searchInput, { color: t.searchText }]}
              placeholder="Search tasks..."
              placeholderTextColor={t.searchPlaceholder}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color={t.searchPlaceholder} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <View style={s.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                onPress={() => setFilter(f.value)}
                activeOpacity={0.7}
                style={[s.filterChip, { borderColor: t.glassBorder, backgroundColor: t.inputBg },
                  active && { borderColor: "#4A9FE8", backgroundColor: "rgba(74,159,232,0.15)" }]}
              >
                <Text style={[s.filterLabel, { color: active ? "#4A9FE8" : t.textSecondary },
                  active && { fontWeight: "700" }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List */}
        {isLoading ? (
          <View style={s.center}>
            <ActivityIndicator color="#4A9FE8" size="large" />
          </View>
        ) : isError ? (
          <View style={s.center}>
            <Ionicons name="alert-circle-outline" size={40} color="#FF453A" />
            <Text style={[s.emptyText, { color: t.textSecondary, marginTop: 8 }]}>
              Failed to load tasks
            </Text>
            <TouchableOpacity onPress={() => refetch()} style={s.retryBtn}>
              <Text style={{ color: "#4A9FE8", fontWeight: "600" }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filtered.length === 0 ? (
          <View style={s.center}>
            <Ionicons name="checkmark-done-outline" size={40} color={t.textSecondary} />
            <Text style={[s.emptyText, { color: t.textSecondary }]}>
              {search ? "No tasks match your search" : "No tasks yet"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={s.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <TaskCard task={item} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.18 },
  blob1: { width: 280, height: 280, top: -60, left: -60 },
  blob2: { width: 220, height: 220, bottom: 120, right: -40 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  searchBar: { flexDirection: "row", alignItems: "center", borderRadius: 24, paddingHorizontal: 14, height: 44, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  filterRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  filterLabel: { fontSize: 13, fontWeight: "500" },
  list: { paddingHorizontal: 16, paddingBottom: 120, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  emptyText: { fontSize: 15, textAlign: "center" },
  retryBtn: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#4A9FE8" },
  card: { borderRadius: 18, overflow: "hidden", borderWidth: 1 },
  cardShine: { position: "absolute", top: 0, left: 0, right: 0, height: 1 },
  cardContent: { padding: 14, gap: 8 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  taskTitle: { fontSize: 16, fontWeight: "700", flex: 1 },
  priorityBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  priorityText: { fontSize: 11, fontWeight: "600" },
  taskDesc: { fontSize: 13, lineHeight: 18 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: "600" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateText: { fontSize: 12 },
});
