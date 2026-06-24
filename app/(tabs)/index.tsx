import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { TTask } from "../@types";
import { useAllTasks } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";

const IG_RING = ["#f09433", "#e6683c", "#dc2743", "#cc2366", "#bc1888"] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; gradient: [string, string, string] }> = {
  todo:        { label: "To Do",       color: "#4A9FE8", icon: "ellipse-outline",          gradient: ["#1a3a5c", "#0d2240", "#091830"] },
  in_progress: { label: "In Progress", color: "#F5A623", icon: "time-outline",             gradient: ["#4a3510", "#2d1f08", "#1c1305"] },
  done:        { label: "Done",        color: "#32D74B", icon: "checkmark-circle-outline", gradient: ["#0f3d1f", "#082010", "#041408"] },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  low:    { label: "Low priority",    color: "#32D74B", icon: "arrow-down-circle-outline" },
  medium: { label: "Medium priority", color: "#F5A623", icon: "remove-circle-outline" },
  high:   { label: "High priority",   color: "#FF453A", icon: "arrow-up-circle-outline" },
};

type TaskAuthor = {
  name: string;
  initials: string;
  imageUrl?: string;
};

function parseApiDate(iso?: string): Date | null {
  if (!iso?.trim()) return null;
  const trimmed = iso.trim();
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(trimmed);
  const normalized = hasTimezone ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function timeAgo(iso?: string) {
  const date = parseApiDate(iso);
  if (!date) return "Just now";
  const diff = Date.now() - date.getTime();
  if (diff < 0) return "Just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitialsFromName(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function getCreatorFullName(task: TTask): string | undefined {
  const raw = task as TTask & Record<string, unknown>;
  const name =
    task.createdFullName ??
    task.createdByFullName ??
    raw.createdFullName ??
    raw.CreatedFullName ??
    raw.createdByFullName ??
    raw.CreatedByFullName;
  if (typeof name === "string" && name.trim()) return name.trim();
  return undefined;
}

function getCreatorImageUrl(task: TTask): string | undefined {
  const raw = task as TTask & Record<string, unknown>;
  const nestedUser = raw.user as { imageUrl?: string; ImageUrl?: string } | undefined;
  const url =
    task.imageUrl ??
    raw.imageUrl ??
    raw.ImageUrl ??
    nestedUser?.imageUrl ??
    nestedUser?.ImageUrl;
  if (typeof url === "string" && url.trim()) return url.trim();
  return undefined;
}

function getCreatorUserId(task: TTask): string | undefined {
  const raw = task as TTask & Record<string, unknown>;
  const nestedUser = raw.user as { id?: string; Id?: string } | undefined;
  const id =
    task.userId ??
    raw.userId ??
    raw.UserId ??
    nestedUser?.id ??
    nestedUser?.Id;
  if (typeof id === "string" && id.trim()) return id.trim();
  return undefined;
}

function getTaskAuthor(task: TTask): TaskAuthor {
  const name = getCreatorFullName(task);
  const imageUrl = getCreatorImageUrl(task);
  const initials = name ? getInitialsFromName(name) || "?" : "SM";
  if (name) {
    return { name, initials, imageUrl };
  }
  return { name: "SynCora Member", initials, imageUrl };
}

function FeedPost({
  task,
  cardBg,
  borderColor,
  textPrimary,
  textSecondary,
  divider,
  liked,
  onToggleLike,
}: {
  task: TTask;
  cardBg: string;
  borderColor: string;
  textPrimary: string;
  textSecondary: string;
  divider: string;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const status   = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.todo;
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const author   = getTaskAuthor(task);
  const creatorUserId = getCreatorUserId(task);
  const postedAt = timeAgo(task.createdAt ?? task.updatedAt);

  return (
    <View style={[s.post, { backgroundColor: cardBg, borderColor }]}>
      {/* Post header */}
      <View style={s.postHeader}>
        <View style={s.postHeaderLeft}>
          <LinearGradient colors={IG_RING} style={s.postAvatarRing} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}>
            <View style={[s.postAvatarInner, { backgroundColor: cardBg }]}>
              {author.imageUrl ? (
                <Image source={{ uri: author.imageUrl }} style={s.postAvatarImage} />
              ) : (
                <LinearGradient colors={["#2a6fc4", "#4A9FE8"]} style={StyleSheet.absoluteFill}>
                  <View style={s.postAvatarInitialsWrap}>
                    <Text style={s.postAvatarText}>{author.initials}</Text>
                  </View>
                </LinearGradient>
              )}
            </View>
          </LinearGradient>
          <View>
            <TouchableOpacity
              onPress={() => creatorUserId && router.push(`/screens/user/${creatorUserId}` as any)}
              disabled={!creatorUserId}
              activeOpacity={0.7}
            >
              <Text style={[s.postAuthor, { color: textPrimary }]}>{author.name}</Text>
            </TouchableOpacity>
            <Text style={[s.postMeta, { color: textSecondary }]}>{postedAt} · posted a task</Text>
          </View>
        </View>
        <TouchableOpacity hitSlop={12} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={18} color={textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      <View style={s.postCaption}>
        <Text style={[s.postTitle, { color: textPrimary }]}>{task.title}</Text>
        {task.description ? (
          <Text style={[s.postBody, { color: textSecondary }]} numberOfLines={4}>
            {task.description}
          </Text>
        ) : null}
      </View>

      {/* Visual card (media-style block) */}
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => task.id && router.push(`/screens/task/${task.id}` as any)}
      >
        <LinearGradient
          colors={status.gradient}
          style={s.mediaBlock}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={s.mediaOverlay} />
          <View style={s.mediaTop}>
            <View style={[s.statusBadge, { backgroundColor: `${status.color}28`, borderColor: `${status.color}55` }]}>
              <Ionicons name={status.icon as any} size={13} color={status.color} />
              <Text style={[s.statusBadgeText, { color: status.color }]}>{status.label}</Text>
            </View>
            <View style={[s.priorityBadge, { backgroundColor: "rgba(0,0,0,0.35)" }]}>
              <Ionicons name={priority.icon as any} size={12} color={priority.color} />
              <Text style={[s.priorityBadgeText, { color: priority.color }]}>{priority.label}</Text>
            </View>
          </View>
          <View style={s.mediaCenter}>
            <Ionicons name="checkbox-outline" size={42} color="rgba(255,255,255,0.85)" />
            <Text style={s.mediaTitle} numberOfLines={2}>{task.title}</Text>
          </View>
          <View style={s.mediaFooter}>
            <Ionicons name="calendar-outline" size={13} color="rgba(255,255,255,0.7)" />
            <Text style={s.mediaDue}>
              Due {(parseApiDate(task.dueDate) ?? new Date(task.dueDate)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Actions */}
      <View style={s.actions}>
        <View style={s.actionsLeft}>
          <TouchableOpacity style={s.actionBtn} onPress={onToggleLike} activeOpacity={0.6}>
            <Ionicons name={liked ? "heart" : "heart-outline"} size={26} color={liked ? "#FF453A" : textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={s.actionBtn}
            onPress={() => task.id && router.push(`/screens/task/${task.id}` as any)}
            activeOpacity={0.6}
          >
            <Ionicons name="chatbubble-outline" size={24} color={textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={s.actionBtn} activeOpacity={0.6}>
            <Ionicons name="paper-plane-outline" size={24} color={textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.actionBtn} activeOpacity={0.6}>
          <Ionicons name="bookmark-outline" size={24} color={textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={s.likesRow}>
        <Text style={[s.likesText, { color: textPrimary }]}>
          {liked ? "You liked this task" : "Tap ♥ to react"}
        </Text>
      </View>

      <View style={[s.postDivider, { backgroundColor: divider }]} />
    </View>
  );
}

export default function HomeTab() {
  const t = useTheme();
  const { data: tasks, isLoading, isError, refetch, isRefetching } = useAllTasks();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const isDark = t.screen === "#050d1a";
  const feedBg = isDark ? "#000000" : "#f0f2f5";
  const cardBg = isDark ? "#121212" : "#ffffff";
  const borderColor = isDark ? "#262626" : "#e4e6eb";
  const divider = isDark ? "#262626" : "#e4e6eb";

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <View style={[s.screen, { backgroundColor: feedBg }]}>
        <SafeAreaView style={s.center} edges={["bottom"]}>
          <ActivityIndicator color="#4A9FE8" size="large" />
          <Text style={[s.stateText, { color: t.textSecondary }]}>Loading your feed…</Text>
        </SafeAreaView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[s.screen, { backgroundColor: feedBg }]}>
        <SafeAreaView style={s.center} edges={["bottom"]}>
          <Ionicons name="cloud-offline-outline" size={48} color={t.textMuted} />
          <Text style={[s.stateTitle, { color: t.textPrimary }]}>Couldn't refresh feed</Text>
          <Text style={[s.stateText, { color: t.textSecondary }]}>Check your connection and try again.</Text>
          <TouchableOpacity onPress={() => refetch()} style={s.retryBtn}>
            <Text style={s.retryText}>Try again</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: feedBg }]}>
      <SafeAreaView style={s.safe} edges={["bottom"]}>
        <FlatList
          data={tasks ?? []}
          keyExtractor={(item, index) => item.id ?? String(index)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#4A9FE8"
              colors={["#4A9FE8"]}
            />
          }
          ListEmptyComponent={
            <View style={[s.emptyWrap, { backgroundColor: cardBg, borderColor }]}>
              <Ionicons name="people-outline" size={40} color={t.textMuted} />
              <Text style={[s.stateTitle, { color: t.textPrimary }]}>Your feed is empty</Text>
              <Text style={[s.stateText, { color: t.textSecondary }]}>
                When teammates create tasks, they'll show up here like posts.
              </Text>
              <TouchableOpacity
                style={s.createBtn}
                onPress={() => router.push("/(tabs)/create" as any)}
                activeOpacity={0.85}
              >
                <Text style={s.createBtnText}>Create a task</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <FeedPost
              task={item}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={t.textPrimary}
              textSecondary={t.textSecondary}
              divider={divider}
              liked={likedIds.has(item.id ?? "")}
              onToggleLike={() => item.id && toggleLike(item.id)}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  listContent: { paddingBottom: 100 },

  post: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  postHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  postAvatarRing: { width: 40, height: 40, borderRadius: 20, padding: 2, alignItems: "center", justifyContent: "center" },
  postAvatarInner: { width: 36, height: 36, borderRadius: 18, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  postAvatarImage: { width: 36, height: 36 },
  postAvatarInitialsWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  postAvatarText: { color: "#fff", fontSize: 13, fontWeight: "800", letterSpacing: 0.5 },
  postAuthor: { fontSize: 14, fontWeight: "700" },
  postMeta: { fontSize: 12, marginTop: 1 },

  postCaption: { paddingHorizontal: 14, paddingBottom: 10, gap: 4 },
  createdBy: { fontSize: 13, lineHeight: 18 },
  createdByName: { fontWeight: "700" },
  postTitle: { fontSize: 15, fontWeight: "700", lineHeight: 20 },
  postBody: { fontSize: 14, lineHeight: 20 },

  mediaBlock: {
    marginHorizontal: 0,
    height: 280,
    justifyContent: "space-between",
    padding: 16,
  },
  mediaOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.15)" },
  mediaTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", zIndex: 1 },
  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1,
  },
  statusBadgeText: { fontSize: 12, fontWeight: "700" },
  priorityBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },
  priorityBadgeText: { fontSize: 11, fontWeight: "600" },
  mediaCenter: { alignItems: "center", justifyContent: "center", gap: 10, zIndex: 1 },
  mediaTitle: { color: "#fff", fontSize: 18, fontWeight: "800", textAlign: "center", paddingHorizontal: 24, lineHeight: 24 },
  mediaFooter: { flexDirection: "row", alignItems: "center", gap: 6, zIndex: 1 },
  mediaDue: { color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: "600" },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 2,
  },
  actionsLeft: { flexDirection: "row", alignItems: "center" },
  actionBtn: { padding: 8 },

  likesRow: { paddingHorizontal: 14, paddingBottom: 10 },
  likesText: { fontSize: 14, fontWeight: "600" },

  postDivider: { height: StyleSheet.hairlineWidth },

  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 32 },
  stateTitle: { fontSize: 18, fontWeight: "700", textAlign: "center" },
  stateText: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  retryBtn: { marginTop: 8, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, backgroundColor: "#4A9FE8" },
  retryText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyWrap: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
  },
  createBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "#4A9FE8",
  },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});
