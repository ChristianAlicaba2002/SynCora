import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { TUsers } from "../@types";
import { useTheme } from "../hooks/useTheme";
import { useCurrentUserData, useSearchUser } from "../hooks/useUsers";
import { s } from "../styles/appHeader.styles";

function getUserDisplayName(user: TUsers) {
  const raw = user as TUsers & Record<string, unknown>;
  const fromParts = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ");
  const fullName = raw.fullName ?? raw.FullName;
  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();
  return fromParts || "Unknown User";
}

function getUserInitials(user: TUsers) {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

function UserSearchRow({ user, onPress }: { user: TUsers; onPress: () => void }) {
  const t = useTheme();
  const name = getUserDisplayName(user);
  const imageUrl = user.imageUrl?.trim();
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || getUserInitials(user);

  return (
    <TouchableOpacity style={s.resultRow} onPress={onPress} activeOpacity={0.7}>
      <View style={s.resultAvatar}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={s.resultAvatarImage} />
        ) : (
          <LinearGradient colors={["#2a6fc4", "#4A9FE8"]} style={StyleSheet.absoluteFill}>
            <Text style={s.resultInitials}>{initials}</Text>
          </LinearGradient>
        )}
      </View>
      <View style={s.resultText}>
        <Text style={[s.resultName, { color: t.textPrimary }]} numberOfLines={1}>{name}</Text>
        <Text style={[s.resultPreview, { color: t.textSecondary }]} numberOfLines={1}>
          {user.email || "Tap to view profile"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={t.chevron} />
    </TouchableOpacity>
  );
}

export default function AppHeader() {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUserData();
  const inputRef = useRef<TextInput>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const { data: results, isLoading, isFetching } = useSearchUser(debouncedQuery);

  const imageUrl = user?.imageUrl?.trim();
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const openSearch = () => {
    setSearchOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setDebouncedQuery("");
    Keyboard.dismiss();
  };

  const showResults = searchOpen && debouncedQuery.trim().length >= 2;
  const showTypeHint = searchOpen && searchQuery.trim().length > 0 && searchQuery.trim().length < 2;
  const searching = showResults && (isLoading || isFetching);

  const openUserProfile = (item: TUsers) => {
    queryClient.setQueryData(["user", item.id], item);
    closeSearch();
    router.push(`/screens/user/${item.id}` as any);
  };

  return (
    <View style={[s.wrapper, { paddingTop: insets.top, borderBottomColor: t.headerBorder, backgroundColor: t.screen }]}>
      <BlurView intensity={28} tint={t.blurTint} style={StyleSheet.absoluteFill} />

      <LinearGradient
        colors={["rgba(74,159,232,0.5)", "rgba(74,159,232,0)", "rgba(74,159,232,0.2)"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={s.shimmerLine}
      />

      {searchOpen ? (
        <View style={s.searchBarRow}>
          <TouchableOpacity onPress={closeSearch} style={s.searchBackBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={t.headerIcon} />
          </TouchableOpacity>
          <View style={[s.searchInputWrap, { backgroundColor: t.searchBg, borderColor: t.searchBorder }]}>
            <Ionicons name="search-outline" size={16} color={t.textMuted} />
            <TextInput
              ref={inputRef}
              style={[s.searchInput, { color: t.searchText }]}
              placeholder="Search users…"
              placeholderTextColor={t.searchPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={t.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={s.inner}>
          <View style={s.left}>
            <View style={[s.logoRing, { borderColor: "rgba(74,159,232,0.4)" }]}>
              <LinearGradient
                colors={["rgba(74,159,232,0.2)", "rgba(74,159,232,0.05)"]}
                style={StyleSheet.absoluteFill}
              />
              <Image source={require("../../assets/images/synCora.png")} style={s.logo} />
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
            <TouchableOpacity activeOpacity={0.75} style={s.actionBtn} onPress={openSearch}>
              <BlurView intensity={18} tint={t.blurTint} style={StyleSheet.absoluteFill} />
              <View style={[s.actionBorder, { borderColor: "rgba(255,255,255,0.12)" }]} />
              <Ionicons name="search-outline" size={20} color={t.headerIcon} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.75} style={s.actionBtn}>
              <BlurView intensity={18} tint={t.blurTint} style={StyleSheet.absoluteFill} />
              <View style={[s.actionBorder, { borderColor: "rgba(255,255,255,0.12)" }]} />
              <Ionicons name="notifications-outline" size={20} color={t.headerIcon} />
              <View style={s.badge}>
                <LinearGradient colors={["#FF6B6B", "#FF453A"]} style={StyleSheet.absoluteFill} />
                <Text style={s.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              style={s.avatarBtn}
              onPress={() => router.push("/screens/profile" as any)}
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={s.avatarImage} />
              ) : (
                <LinearGradient
                  colors={["#2a6fc4", "#4A9FE8"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                />
              )}
              <View style={[s.avatarBorder, { borderColor: "rgba(74,159,232,0.6)" }]} />
              {!imageUrl && (
                initials
                  ? <Text style={s.avatarInitials}>{initials}</Text>
                  : <Ionicons name="person" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showTypeHint && (
        <View style={[s.resultsPanel, { backgroundColor: t.screen, borderColor: t.headerBorder }]}>
          <View style={s.resultsState}>
            <Ionicons name="keypad-outline" size={18} color={t.textMuted} />
            <Text style={[s.resultsStateText, { color: t.textSecondary }]}>Type at least 2 characters</Text>
          </View>
        </View>
      )}

      {showResults && (
        <View style={[s.resultsPanel, { backgroundColor: t.screen, borderColor: t.headerBorder }]}>
          <View style={[s.resultsHeader, { borderBottomColor: t.headerBorder }]}>
            <Text style={[s.resultsHeaderText, { color: t.textSecondary }]}>People</Text>
            {!searching && (
              <Text style={[s.resultsCount, { color: t.textMuted }]}>
                {(results ?? []).length} found
              </Text>
            )}
          </View>
          {searching ? (
            <View style={s.resultsState}>
              <ActivityIndicator color="#4A9FE8" size="small" />
              <Text style={[s.resultsStateText, { color: t.textSecondary }]}>Searching…</Text>
            </View>
          ) : (results ?? []).length === 0 ? (
            <View style={s.resultsState}>
              <Ionicons name="person-outline" size={22} color={t.textMuted} />
              <Text style={[s.resultsStateText, { color: t.textSecondary }]}>No users found</Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              style={s.resultsList}
              renderItem={({ item }) => (
                <UserSearchRow user={item} onPress={() => openUserProfile(item)} />
              )}
            />
          )}
        </View>
      )}

      <LinearGradient
        colors={["transparent", "rgba(74,159,232,0.25)", "transparent"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={s.bottomGlow}
      />
    </View>
  );
}
