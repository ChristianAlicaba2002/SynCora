import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scheduleProfileUpdatedNotification } from "../hooks/useTaskNotification";
import { useCurrentUserData, useUpdateProfile } from "../hooks/useUsers";

type Gender = "Male" | "Female" | "Other" | "Prefer not to say";
const GENDER_OPTIONS: Gender[] = ["Male", "Female", "Other", "Prefer not to say"];

export default function EditProfileScreen() {
  const { data: user, isLoading } = useCurrentUserData();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [firstName,  setFirstName]  = useState("");
  const [lastName,   setLastName]   = useState("");
  const [middleName, setMiddleName] = useState("");
  const [bio,        setBio]        = useState("");
  const [gender,     setGender]     = useState<Gender>("Male");
  const [imageUrl,   setImageUrl]   = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setMiddleName(user.middleName ?? "");
      setBio(user.bio ?? "");
      setGender((user.gender as Gender) ?? "Male");
      setImageUrl(user.imageUrl ?? "");
    }
  }, [user]);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    updateProfile(
      {
        userId: user?.id ?? "",
        data: {
          firstName:  firstName.trim(),
          lastName:   lastName.trim(),
          middleName: middleName.trim(),
          bio:        bio.trim(),
          gender,
          imageUrl:   imageUrl.trim(),
        }
      },
      {
        onSuccess: () => {
          const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
          scheduleProfileUpdatedNotification(name || undefined);
          router.back();
        },
        onError: (err) => console.error("Update profile failed →", err),
      }
    );
  };

  function Field({
    label, value, onChangeText, placeholder, multiline, accent = "#4A9FE8",
  }: {
    label: string; value: string; onChangeText: (v: string) => void;
    placeholder: string; multiline?: boolean; accent?: string;
  }) {
    return (
      <View style={es.fieldWrap}>
        <View style={es.fieldLabelRow}>
          <View style={[es.fieldDot, { backgroundColor: accent }]} />
          <Text style={es.fieldLabel}>{label}</Text>
        </View>
        <View style={[es.inputWrap, { borderColor: `${accent}40` }]}>
          <BlurView intensity={14} tint="dark" style={StyleSheet.absoluteFill} />
          <TextInput
            style={[es.input, multiline && es.inputMulti]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.2)"
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            textAlignVertical={multiline ? "top" : "center"}
            editable={!isPending}
          />
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={es.screen}>
        <LinearGradient colors={["#050d1a", "#0a1628"]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={es.center}>
          <ActivityIndicator color="#4A9FE8" size="large" />
          <Text style={es.loadingText}>Loading…</Text>
        </SafeAreaView>
      </View>
    );
  }

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <View style={es.screen}>
      <LinearGradient colors={["#060e1f", "#050d1a"]} style={StyleSheet.absoluteFill} />
      <View style={[es.orb, es.orb1]} />
      <View style={[es.orb, es.orb2]} />

      <SafeAreaView style={es.safe} edges={["top"]}>
        {/* Top bar */}
        <View style={es.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={es.iconBtn} activeOpacity={0.7}>
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={es.iconBtnBorder} />
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          <BlurView intensity={20} tint="dark" style={es.titlePill}>
            <Ionicons name="create-outline" size={14} color="#4A9FE8" />
            <Text style={es.titleText}>Edit Profile</Text>
          </BlurView>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isPending}
            style={[es.saveBtn, isPending && { opacity: 0.6 }]}
            activeOpacity={0.8}
          >
            <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={es.saveBtnBorder} />
            {isPending
              ? <ActivityIndicator size="small" color="#4A9FE8" />
              : <Text style={es.saveBtnText}>Save</Text>
            }
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={es.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            contentContainerStyle={es.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar picker */}
            <View style={es.avatarPreview}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8} style={es.avatarTap}>
                <View style={es.avatarRing}>
                  <LinearGradient
                    colors={["#4A9FE8", "#2a6fc4"]}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  />
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={es.avatarImage} />
                  ) : (
                    <View style={es.avatarCore}>
                      <Text style={es.avatarInitials}>{initials}</Text>
                    </View>
                  )}
                </View>
                <View style={es.cameraBadge}>
                  <LinearGradient colors={["#4A9FE8", "#2a6fc4"]} style={StyleSheet.absoluteFill} />
                  <Ionicons name="camera" size={13} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={es.avatarHint}>Tap to change photo</Text>
            </View>

            {/* Personal info */}
            <View style={es.card}>
              <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={es.cardInner}>
                <View style={es.cardHead}>
                  <LinearGradient colors={["#4A9FE8", "#2170c4"]} style={es.cardAccent} />
                  <Text style={es.cardTitle}>PERSONAL INFO</Text>
                </View>
                <Field label="First Name"  value={firstName}  onChangeText={setFirstName}  placeholder="Enter first name"  accent="#4A9FE8" />
                <Field label="Middle Name" value={middleName} onChangeText={setMiddleName} placeholder="Enter middle name" accent="#9B59B6" />
                <Field label="Last Name"   value={lastName}   onChangeText={setLastName}   placeholder="Enter last name"   accent="#4A9FE8" />
              </View>
            </View>

            {/* Gender */}
            <View style={es.card}>
              <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={es.cardInner}>
                <View style={es.cardHead}>
                  <LinearGradient colors={["#F5A623", "#c47d10"]} style={es.cardAccent} />
                  <Text style={es.cardTitle}>GENDER</Text>
                </View>
                <View style={es.genderGrid}>
                  {GENDER_OPTIONS.map((g) => {
                    const active = gender === g;
                    return (
                      <TouchableOpacity
                        key={g}
                        onPress={() => setGender(g)}
                        activeOpacity={0.75}
                        style={[
                          es.genderChip,
                          active
                            ? { borderColor: "#F5A623", backgroundColor: "rgba(245,166,35,0.15)" }
                            : { borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(255,255,255,0.04)" },
                        ]}
                      >
                        <Text style={[
                          es.genderText,
                          { color: active ? "#F5A623" : "rgba(255,255,255,0.5)" },
                          active && { fontWeight: "700" },
                        ]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={es.card}>
              <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={es.cardInner}>
                <View style={es.cardHead}>
                  <LinearGradient colors={["#32D74B", "#1a9e30"]} style={es.cardAccent} />
                  <Text style={es.cardTitle}>BIO</Text>
                </View>
                <Field
                  label="About you"
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell others a bit about yourself…"
                  multiline
                  accent="#32D74B"
                />
              </View>
            </View>

            {/* Save button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isPending}
              style={[es.submitBtn, isPending && { opacity: 0.65 }]}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#2a6fc4", "#4A9FE8"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
              <View style={es.submitInner}>
                {isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={es.submitText}>Save Changes</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const es = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: "#050d1a" },
  safe:         { flex: 1 },
  flex:         { flex: 1 },
  center:       { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loadingText:  { color: "rgba(255,255,255,0.4)", fontSize: 14 },
  orb:          { position: "absolute", borderRadius: 999 },
  orb1:         { width: 340, height: 340, top: -120, right: -100, backgroundColor: "#4A9FE8", opacity: 0.06 },
  orb2:         { width: 260, height: 260, bottom: 40, left: -80,  backgroundColor: "#9B59B6", opacity: 0.05 },

  topBar:        { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10, paddingTop: 4 },
  iconBtn:       { width: 40, height: 40, borderRadius: 13, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  iconBtnBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 13, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  titlePill:     { flexDirection: "row", alignItems: "center", gap: 6, overflow: "hidden", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  titleText:     { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  saveBtn:       { overflow: "hidden", borderRadius: 13, paddingHorizontal: 16, paddingVertical: 10, minWidth: 60, alignItems: "center", justifyContent: "center" },
  saveBtnBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 13, borderWidth: 1, borderColor: "rgba(74,159,232,0.5)" },
  saveBtnText:   { color: "#4A9FE8", fontWeight: "700", fontSize: 14 },

  scroll: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 100, gap: 14 },

  avatarPreview: { alignItems: "center", gap: 8, paddingVertical: 4 },
  avatarTap:     { position: "relative" },
  avatarRing:    { width: 88, height: 88, borderRadius: 24, overflow: "hidden", alignItems: "center", justifyContent: "center" },
  avatarImage:   { width: 88, height: 88, borderRadius: 24 },
  avatarCore:    { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,24,40,0.65)", alignItems: "center", justifyContent: "center" },
  avatarInitials:{ color: "#fff", fontSize: 26, fontWeight: "900", letterSpacing: 1 },
  avatarHint:    { color: "rgba(255,255,255,0.3)", fontSize: 11 },
  cameraBadge:   { position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: 13, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#050d1a" },

  card:       { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.09)" },
  cardInner:  { padding: 16, gap: 14 },
  cardHead:   { flexDirection: "row", alignItems: "center", gap: 10 },
  cardAccent: { width: 3, height: 16, borderRadius: 2 },
  cardTitle:  { color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: "700", letterSpacing: 1.3, textTransform: "uppercase" },

  fieldWrap:     { gap: 6 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  fieldDot:      { width: 4, height: 4, borderRadius: 2 },
  fieldLabel:    { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 },
  inputWrap:     { borderRadius: 14, overflow: "hidden", borderWidth: 1 },
  input:         { color: "#fff", fontSize: 15, paddingHorizontal: 14, paddingVertical: 12 },
  inputMulti:    { minHeight: 90, paddingTop: 12 },

  genderGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  genderChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  genderText: { fontSize: 13, fontWeight: "500" },

  submitBtn:   { borderRadius: 16, overflow: "hidden", height: 54, marginTop: 4 },
  submitInner: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitText:  { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
});
