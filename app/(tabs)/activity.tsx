import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/activity.styles";

const FRIENDS = [
  { id: "1", src: null },
  { id: "2", src: null },
  { id: "3", src: null },
  { id: "4", src: null },
];

export default function ActivityTab() {
  const [search, setSearch] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>("3");

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Image
            source={require("../../assets/images/synCora.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.headerRight}>
          <View style={styles.bellWrapper}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>10</Text>
            </View>
          </View>

          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={20} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={16}
            color="rgba(0,0,0,0.35)"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor="rgba(0,0,0,0.35)"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          horizontal
          data={FRIENDS}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          style={styles.friendsRow}
          contentContainerStyle={styles.friendsRowContent}
          renderItem={({ item: friend }) => {
            const isSelected = selectedFriend === friend.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedFriend(friend.id)}
                style={[
                  styles.friendAvatarWrapper,
                  isSelected && styles.friendAvatarSelected,
                ]}
                activeOpacity={0.8}
              >
                {friend.src ? (
                  <Image
                    source={{ uri: friend.src }}
                    style={styles.friendAvatar}
                  />
                ) : (
                  <View style={styles.friendAvatarPlaceholder}>
                    <Ionicons name="person" size={28} color="#aac8e8" />
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />


        <View style={[styles.card, styles.cardWide]} />

        {/* Row 2 — three cards */}
        <View style={styles.cardRow}>
          <View style={[styles.card, styles.cardThird]} />
          <View style={[styles.card, styles.cardThird]} />
          <View style={[styles.card, styles.cardThirdNarrow]} />
        </View>

        <View style={styles.cardRow}>
          <View style={[styles.card, styles.cardNarrow]} />
          <View style={[styles.card, styles.cardThird]} />
          <View style={[styles.card, styles.cardThird]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
