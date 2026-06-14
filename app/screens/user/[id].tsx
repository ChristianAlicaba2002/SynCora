import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useAcceptFollowRequest,
  useCancelFollowRequest,
  useCurrentUserData,
  useFollowStatus,
  useGetUserById,
  useSendFollowRequest,
  useUnfollow,
} from "../../hooks/useUsers";
import { s } from "../../styles/userProfile.styles";

function parseApiDate(iso?: string): Date | null {
  if (!iso?.trim()) return null;
  const trimmed = iso.trim();
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(trimmed);
  const normalized = hasTimezone ? trimmed : `${trimmed}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(iso?: string) {
  const date = parseApiDate(iso);
  if (!date) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function getFullName(user: { firstName?: string; middleName?: string; lastName?: string }) {
  return [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

function InfoRow({
  icon, label, value, accent, last = false,
}: {
  icon: string; label: string; value: string; accent: string; last?: boolean;
}) {
  return (
    <View style={[s.infoRow, !last && s.infoRowBorder]}>
      <View style={[s.infoIconWrap, { backgroundColor: `${accent}18` }]}>
        <Ionicons name={icon as any} size={14} color={accent} />
      </View>
      <View style={s.infoBody}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue} numberOfLines={2}>{value || "—"}</Text>
      </View>
    </View>
  );
}

function FollowButton({
  userId,
  initialFollowing,
  initialRequested,
  initialIncoming,
}: {
  userId: string;
  initialFollowing?: boolean;
  initialRequested?: boolean;
  initialIncoming?: boolean;
}) {
  const { data: followStatus, isLoading: statusLoading } = useFollowStatus(userId);
  const { mutate: sendRequest, isPending: sending } = useSendFollowRequest();
  const { mutate: acceptRequest, isPending: accepting } = useAcceptFollowRequest();
  const { mutate: cancelRequest, isPending: cancelling } = useCancelFollowRequest();
  const { mutate: unfollow, isPending: unfollowing } = useUnfollow();

  const isFollowing = followStatus?.isFollowing ?? initialFollowing ?? false;
  const isRequested = followStatus?.isRequested ?? initialRequested ?? false;
  const hasIncoming = followStatus?.hasIncomingRequest ?? initialIncoming ?? false;
  const isPending = sending || accepting || cancelling || unfollowing;

  const handleSend = () => {
    if (!isPending) sendRequest(userId);
  };

  const handleCancel = () => {
    if (!isPending) cancelRequest(userId);
  };

  const handleAccept = () => {
    if (!isPending) acceptRequest(userId);
  };

  const hasInitial =
    initialFollowing !== undefined ||
    initialRequested !== undefined ||
    initialIncoming !== undefined;

  if (statusLoading && !hasInitial) {
    return (
      <View style={[s.followBtn, s.followBtnOutline]}>
        <ActivityIndicator size="small" color="#4A9FE8" />
      </View>
    );
  }

  if (hasIncoming) {
    return (
      <View style={s.followBtnRow}>
        {/* Accept button */}
        <TouchableOpacity onPress={handleAccept} activeOpacity={0.85} disabled={isPending}>
          <LinearGradient
            colors={["#32D74B", "#1a9e30"]}
            style={s.followBtn}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={s.followBtnInner}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#fff" />
                <Text style={s.followBtnText}>Accept</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
        {/* Cancel button */}
        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={0.85}
          disabled={isPending}
          style={[s.followBtn, s.cancelBtnOutline]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#FF453A" />
          ) : (
            <View style={s.followBtnInner}>
              <Ionicons name="close-circle-outline" size={14} color="#FF453A" />
              <Text style={[s.followBtnText, { color: "#FF453A" }]}>Cancel</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (isFollowing) {
    // Show "Followed" label and an "Unfollow" button
    return (
      <View style={s.followBtnRow}>
        {/* Followed label */}
        <View style={[s.followBtn, s.followBtnOutline]}>
          <View style={s.followBtnInner}>
            <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={s.followBtnTextMuted}>Followed</Text>
          </View>
        </View>
        {/* Unfollow button */}
        <TouchableOpacity
          onPress={() => unfollow(userId)}
          activeOpacity={0.85}
          disabled={isPending}
          style={[s.followBtn, s.cancelBtnOutline]}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#FF453A" />
          ) : (
            <View style={s.followBtnInner}>
              <Ionicons name="person-remove-outline" size={14} color="#FF453A" />
              <Text style={[s.followBtnText, { color: "#FF453A" }]}>Unfollow</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (isRequested) {
    return (
      <TouchableOpacity
        style={[s.followBtn, s.followBtnOutline, { borderColor: "rgba(245,166,35,0.45)" }]}
        onPress={handleCancel}
        activeOpacity={0.8}
        disabled={isPending}
      >
        <View style={s.followBtnInner}>
          {isPending ? (
            <ActivityIndicator size="small" color="#F5A623" />
          ) : (
            <>
              <Ionicons name="time-outline" size={14} color="#F5A623" />
              <Text style={[s.followBtnTextMuted, { color: "#F5A623" }]}>Follow Request</Text>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handleSend} activeOpacity={0.85} disabled={isPending}>
      <LinearGradient
        colors={["#2a6fc4", "#4A9FE8"]}
        style={s.followBtn}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <View style={s.followBtnInner}>
            <Ionicons name="person-add-outline" size={14} color="#fff" />
            <Text style={s.followBtnText}>Follow</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function UserProfileScreen() {
  const { id, query } = useLocalSearchParams<{ id?: string; query?: string }>();
  const userId = id ?? query ?? "";
  const { data: currentUser } = useCurrentUserData();
  const { data: user, isLoading, isError, refetch } = useGetUserById(userId);

  if (isLoading && !user) {
    return (
      <View style={s.screen}>
        <LinearGradient colors={["#050d1a", "#0a1628"]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={s.center}>
          <View style={s.loaderRing}>
            <ActivityIndicator color="#4A9FE8" size="large" />
          </View>
          <Text style={s.loadingText}>Loading member…</Text>
        </SafeAreaView>
      </View>
    );
  }

  if ((isError && !user) || !user) {
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

  const fullName = getFullName(user);
  const imageUrl = user.imageUrl?.trim();
  const initials = getInitials(user.firstName, user.lastName);
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <View style={s.screen}>
      <LinearGradient colors={["#060e1f", "#050d1a", "#050d1a"]} style={StyleSheet.absoluteFill} />
      <View style={[s.orb, s.orb1]} />
      <View style={[s.orb, s.orb2]} />
      <View style={[s.orb, s.orb3]} />

      <SafeAreaView style={s.safe} edges={["top"]}>
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.backBtnBorder} />
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <BlurView intensity={20} tint="dark" style={s.titlePill}>
            <Ionicons name="person-outline" size={14} color="#4A9FE8" />
            <Text style={s.titlePillText}>Member Profile</Text>
          </BlurView>
          <View style={s.backBtnPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          <View style={s.heroBanner}>
            <LinearGradient
              colors={["#0d2240", "#091830", "#050d1a"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.heroGlow} />

            <View style={s.heroContent}>
              <View style={s.avatarContainer}>
                <LinearGradient
                  colors={["#f09433", "#e6683c", "#dc2743", "#cc2366", "#bc1888"]}
                  style={s.avatarRingGradient}
                  start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }}
                >
                  <View style={s.avatarRingInner}>
                    {imageUrl ? (
                      <Image source={{ uri: imageUrl }} style={s.avatarImage} />
                    ) : (
                      <LinearGradient colors={["#2a6fc4", "#4A9FE8"]} style={StyleSheet.absoluteFill}>
                        <View style={s.avatarCore}>
                          <Text style={s.avatarText}>{initials}</Text>
                        </View>
                      </LinearGradient>
                    )}
                  </View>
                </LinearGradient>
                <View style={s.memberDot} />
              </View>

              <Text style={s.heroName}>{fullName}</Text>
              <Text style={s.heroEmail}>{user.email}</Text>

              <View style={s.badgeRow}>
                {user.gender ? (
                  <View style={[s.badge, { borderColor: "rgba(74,159,232,0.4)", backgroundColor: "rgba(74,159,232,0.12)" }]}>
                    <Ionicons name="person-outline" size={11} color="#4A9FE8" />
                    <Text style={[s.badgeText, { color: "#4A9FE8" }]}>{user.gender}</Text>
                  </View>
                ) : null}
                <View style={[s.badge, { borderColor: "rgba(155,89,182,0.4)", backgroundColor: "rgba(155,89,182,0.12)" }]}>
                  <Ionicons name="people-outline" size={11} color="#9B59B6" />
                  <Text style={[s.badgeText, { color: "#9B59B6" }]}>SynCora Member</Text>
                </View>
              </View>

              {!isOwnProfile && (
                <FollowButton
                  userId={user.id}
                  initialFollowing={user.isFollowing}
                  initialRequested={user.isRequested}
                  initialIncoming={user.hasIncomingRequest}
                />
              )}
            </View>
          </View>

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

          <View style={s.card}>
            <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={s.cardInner}>
              <View style={s.cardHead}>
                <LinearGradient colors={["#F5A623", "#c47d10"]} style={s.cardAccent} />
                <Text style={s.cardTitle}>DETAILS</Text>
              </View>
              <InfoRow icon="mail-outline" label="Email" value={user.email} accent="#4A9FE8" />
              <InfoRow icon="person-outline" label="Full name" value={fullName} accent="#9B59B6" />
              <InfoRow icon="male-female-outline" label="Gender" value={user.gender} accent="#F5A623" />
              <InfoRow icon="calendar-outline" label="Joined" value={formatDate(user.createdAt)} accent="#32D74B" />
              <InfoRow icon="refresh-outline" label="Last updated" value={formatDate(user.updatedAt)} accent="#4A9FE8" last />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
