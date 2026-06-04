import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";

const FRIENDS = [
  { id: "1", src: null },
  { id: "2", src: null },
  { id: "3", src: null },
  { id: "4", src: null },
];

export default function ActivityTab() {
  const t = useTheme();
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>("3");

  return (
    <View style={{ flex: 1, backgroundColor: t.screen }}>
      {/* blobs */}
      <View style={{ position: "absolute", width: 280, height: 280, borderRadius: 999, backgroundColor: t.blob1, opacity: 0.18, top: -60, left: -60 }} />
      <View style={{ position: "absolute", width: 220, height: 220, borderRadius: 999, backgroundColor: t.blob2, opacity: 0.15, bottom: 120, right: -40 }} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 110, gap: 12 }} showsVerticalScrollIndicator={false}>

        {/* Search */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: t.searchBg, borderRadius: 24, paddingHorizontal: 14, height: 44, borderWidth: 1, borderColor: t.searchBorder }}>
          <Ionicons name="search-outline" size={16} color={t.searchPlaceholder} style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 14, color: t.searchText }}
            placeholder="Search friends..."
            placeholderTextColor={t.searchPlaceholder}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Friends row */}
        <FlatList
          horizontal
          data={FRIENDS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 10, paddingVertical: 4 }}
          renderItem={({ item: friend }) => {
            const isSelected = selectedFriend === friend.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedFriend(friend.id)}
                style={{
                  width: 62, height: 62, borderRadius: isSelected ? 14 : 31,
                  borderWidth: 2,
                  borderColor: isSelected ? "#4A9FE8" : "transparent",
                  overflow: "hidden",
                }}
                activeOpacity={0.8}
              >
                {friend.src ? (
                  <Image source={{ uri: friend.src }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <View style={{ flex: 1, backgroundColor: t.glassBg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: t.glassBorder }}>
                    <Ionicons name="person" size={28} color={t.textSecondary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />

        {/* Wide card */}
        <View style={{ height: 130, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />

        {/* Row 2 */}
        <View style={{ flexDirection: "row", gap: 10, height: 110 }}>
          <View style={{ flex: 1, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />
          <View style={{ flex: 1, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />
          <View style={{ width: 50, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />
        </View>

        {/* Row 3 */}
        <View style={{ flexDirection: "row", gap: 10, height: 110 }}>
          <View style={{ width: 50, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />
          <View style={{ flex: 1, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />
          <View style={{ flex: 1, backgroundColor: t.glassBg, borderRadius: 16, borderWidth: 1, borderColor: t.glassBorder }} />
        </View>
      </ScrollView>
    </View>
  );
}
