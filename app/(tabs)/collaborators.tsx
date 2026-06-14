import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { useGetUserFollowRequest } from "../hooks/useUsers";

function formatDate(iso: string) {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "";

  const dateStr = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return `${dateStr} • ${timeStr}`;
}

export default function CollaboratorsTab() {
  const t = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { data, isLoading, refetch } = useGetUserFollowRequest();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refetch collaborators:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const hasData = data && data.length > 0;

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#4A9FE8" />
          <Text style={[s.subtitle, { color: t.textSecondary }]}>Loading collaborators...</Text>
        </View>
      ) : (
        <FlatList
          data={data || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={hasData ? s.list : [s.list, { flexGrow: 1, justifyContent: "center" }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#4A9FE8"
              colors={["#4A9FE8"]}
            />
          }
          ListEmptyComponent={
            <View style={s.center}>
              <View style={[s.emptyIconContainer, { backgroundColor: t.glassBg, borderColor: t.glassBorder }]}>
                <Ionicons name="people-outline" size={36} color={t.textSecondary} />
              </View>
              <Text style={[s.emptyTitle, { color: t.textPrimary }]}>No Collaborators Yet</Text>
              <Text style={[s.emptySubtitle, { color: t.textSecondary }]}>
                Sent or received follow requests will appear here once active.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isPending = item.status.toLowerCase() === "pending";
            return (
              <View style={s.cardWrapper}>
                <BlurView intensity={20} tint={t.blurTint} style={StyleSheet.absoluteFill} />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setUserId(item.senderId);
                    router.push(`/screens/user/${item.senderId}` as any);
                  }}
                  style={s.card}
                >
                  <LinearGradient
                    colors={isPending ? ["#32D74B", "#4A9FE8"] : ["#4A9FE8", "#9B59B6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={s.avatarRing}
                  >
                    <View style={[s.avatarRingInner, { backgroundColor: t.screen }]}>
                      {item.sender.imageUrl ? (
                        <Image source={{ uri: item.sender.imageUrl }} style={s.avatar} />
                      ) : (
                        <View style={[s.avatar, { backgroundColor: t.glassBg, alignItems: "center", justifyContent: "center" }]}>
                          <Ionicons name="person" size={24} color={t.textSecondary} />
                        </View>
                      )}
                    </View>
                  </LinearGradient>

                  <View style={s.info}>
                    <Text style={[s.name, { color: t.textPrimary }]} numberOfLines={1}>
                      {item.sender.firstName} {item.sender.lastName}
                    </Text>

                    {isPending ? (
                      <View style={[s.statusBadge, { backgroundColor: "rgba(74, 159, 232, 0.12)", borderColor: "rgba(74, 159, 232, 0.25)" }]}>
                        <Ionicons name="person-add-outline" size={10} color="#4A9FE8" />
                        <Text style={s.statusBadgeText}>Follow Request</Text>
                      </View>
                    ) : (
                      <View style={[s.statusBadge, { backgroundColor: "rgba(50, 215, 75, 0.12)", borderColor: "rgba(50, 215, 75, 0.25)" }]}>
                        <Ionicons name="checkmark-circle-outline" size={10} color="#32D74B" />
                        <Text style={[s.statusBadgeText, { color: "#32D74B" }]}>Connected</Text>
                      </View>
                    )}

                    <View style={s.dateTimeRow}>
                      <Ionicons name="calendar-outline" size={12} color={t.textMuted} />
                      <Text style={[s.dateTimeText, { color: t.textSecondary }]}>
                        {formatDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>

                  <View style={[s.actionButton, { backgroundColor: t.glassBg, borderColor: t.glassBorder }]}>
                    <Ionicons name="chevron-forward" size={16} color={t.chevron} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.15 },
  blob1: { width: 280, height: 280, top: -60, right: -60 },
  blob2: { width: 220, height: 220, bottom: 100, left: -40 },
  subtitle: { fontSize: 15, textAlign: "center", marginTop: 8, fontWeight: "500" },
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },

  cardWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarRingInner: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  info: { flex: 1, gap: 4, justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "700", letterSpacing: 0.1 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4A9FE8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  dateTimeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 18,
  },
});
