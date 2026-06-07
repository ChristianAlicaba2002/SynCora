import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
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
import { scheduleTaskCreatedNotification } from "../hooks/useTaskNotification";
import { useCreateTask } from "../hooks/useTasks";
import { useTheme } from "../hooks/useTheme";
import {
  Priority,
  Status,
  useCreateStore,
} from "../store/createStore";

const STATUS_OPTIONS: { value: Status; label: string; color: string; icon: string }[] = [
  { value: "todo",        label: "To Do",       color: "#4A9FE8", icon: "ellipse-outline" },
  { value: "in_progress", label: "In Progress", color: "#F5A623", icon: "time-outline" },
  { value: "done",        label: "Done",        color: "#32D74B", icon: "checkmark-circle-outline" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string; icon: string }[] = [
  { value: "low",    label: "Low",    color: "#32D74B", icon: "arrow-down-outline" },
  { value: "medium", label: "Medium", color: "#F5A623", icon: "remove-outline" },
  { value: "high",   label: "High",   color: "#FF453A", icon: "arrow-up-outline" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function addDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
const DATE_PRESETS = [
  { label: "Today",    iso: addDays(0) },
  { label: "Tomorrow", iso: addDays(1) },
  { label: "+3 days",  iso: addDays(3) },
  { label: "+1 week",  iso: addDays(7) },
];

// ── Success Toast ────────────────────────────────────────────────────────
function useSuccessToast() {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;
  const scale     = useRef(new Animated.Value(0.88)).current;

  const show = () => {
    opacity.setValue(0);
    translateY.setValue(24);
    scale.setValue(0.88);

    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1,    duration: 320, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0,    duration: 320, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
      Animated.timing(scale,      { toValue: 1,    duration: 320, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity,    { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          Animated.timing(translateY, { toValue: 16, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          Animated.timing(scale,      { toValue: 0.9, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        ]).start();
      }, 2200);
    });
  };

  const animStyle = { opacity, transform: [{ translateY }, { scale }] };
  return { show, animStyle };
}

// ── Screen ────────────────────────────────────────────────────────────────
export default function CreateTab() {
  const t = useTheme();
  const { mutate: createTask, isPending } = useCreateTask();
  const { show: showToast, animStyle: toastStyle } = useSuccessToast();

  const {
    title, description, status, priority, dueDate,
    titleError, descriptionError,
    setTitle, setDescription, setStatus, setPriority, setDueDate,
    setTitleError, setDescriptionError,
    reset,
  } = useCreateStore();

  function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
    return (
      <View style={[s.glassCard, { borderColor: t.glassBorder, backgroundColor: t.glassBg }, style]}>
        <BlurView intensity={18} tint={t.blurTint} style={StyleSheet.absoluteFill} />
        <View style={[s.glassShine, { backgroundColor: t.glassShine }]} />
        <View style={s.glassContent}>{children}</View>
      </View>
    );
  }

  function ChipGroup<T extends string>({ options, selected, onSelect }: {
    options: { value: T; label: string; color: string; icon: string }[];
    selected: T;
    onSelect: (v: T) => void;
  }) {
    return (
      <View style={s.chipRow}>
        {options.map((o) => {
          const active = selected === o.value;
          return (
            <TouchableOpacity
              key={o.value}
              onPress={() => onSelect(o.value)}
              activeOpacity={0.7}
              style={[s.chip, { borderColor: t.glassBorder, backgroundColor: t.inputBg },
                active && { borderColor: o.color, backgroundColor: `${o.color}22` }]}
            >
              <Ionicons name={o.icon as any} size={13} color={active ? o.color : t.textSecondary} />
              <Text style={[s.chipLabel, { color: active ? o.color : t.textSecondary }, active && { fontWeight: "700" }]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const validate = () => {
    let valid = true;
    if (!title.trim()) { setTitleError("Title is required"); valid = false; }
    else setTitleError("");
    if (!description.trim()) { setDescriptionError("Description is required"); valid = false; }
    else setDescriptionError("");
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { title: title.trim(), description: description.trim(), status, priority, dueDate };
    createTask(payload, {
      onSuccess: () => {
        reset();
        showToast();
        scheduleTaskCreatedNotification(payload.title);
      },
      onError: (err) => console.error("Create task failed →", err),
    });
  };

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      <View style={[s.blob, s.blob1, { backgroundColor: t.blob1 }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: t.blob2 }]} />
      <View style={[s.blob, s.blob3, { backgroundColor: t.blob3 }]} />

      <SafeAreaView style={s.safe} edges={["top"]}>
        <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            {/* Header */}
            <View style={s.pageHeader}>
              <GlassCard style={s.pageIconCard}>
                <Ionicons name="create-outline" size={22} color={t.textPrimary} />
              </GlassCard>
              <View>
                <Text style={[s.pageTitle, { color: t.textPrimary }]}>New Task</Text>
                <Text style={[s.pageSubtitle, { color: t.textSecondary }]}>Fill in the details below</Text>
              </View>
            </View>

            {/* Title */}
            <GlassCard>
              <Text style={[s.fieldLabel, { color: t.textSecondary }]}>TITLE</Text>
              <TextInput
                style={[s.input, { backgroundColor: t.inputBg, borderColor: titleError ? "#FF453A" : t.inputBorder, color: t.inputText }]}
                placeholder="What needs to be done?"
                placeholderTextColor={t.placeholder}
                value={title}
                onChangeText={(v) => { setTitle(v); setTitleError(""); }}
                editable={!isPending}
              />
              {titleError ? <Text style={s.errorText}>{titleError}</Text> : null}
            </GlassCard>

            {/* Description */}
            <GlassCard>
              <Text style={[s.fieldLabel, { color: t.textSecondary }]}>DESCRIPTION</Text>
              <TextInput
                style={[s.input, s.textArea, { backgroundColor: t.inputBg, borderColor: descriptionError ? "#FF453A" : t.inputBorder, color: t.inputText }]}
                placeholder="Add some details…"
                placeholderTextColor={t.placeholder}
                value={description}
                onChangeText={(v) => { setDescription(v); setDescriptionError(""); }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isPending}
              />
              {descriptionError ? <Text style={s.errorText}>{descriptionError}</Text> : null}
            </GlassCard>

            {/* Status */}
            <GlassCard>
              <Text style={[s.fieldLabel, { color: t.textSecondary }]}>STATUS</Text>
              <ChipGroup options={STATUS_OPTIONS} selected={status} onSelect={setStatus} />
            </GlassCard>

            {/* Priority */}
            <GlassCard>
              <Text style={[s.fieldLabel, { color: t.textSecondary }]}>PRIORITY</Text>
              <ChipGroup options={PRIORITY_OPTIONS} selected={priority} onSelect={setPriority} />
            </GlassCard>

            {/* Due Date */}
            <GlassCard>
              <Text style={[s.fieldLabel, { color: t.textSecondary }]}>DUE DATE</Text>
              <View style={s.chipRow}>
                {DATE_PRESETS.map((p) => {
                  const active = new Date(dueDate).toDateString() === new Date(p.iso).toDateString();
                  return (
                    <TouchableOpacity
                      key={p.label}
                      onPress={() => setDueDate(p.iso)}
                      activeOpacity={0.7}
                      style={[s.chip, { borderColor: t.glassBorder, backgroundColor: t.inputBg },
                        active && { borderColor: "#4A9FE8", backgroundColor: "rgba(74,159,232,0.15)" }]}
                    >
                      <Text style={[s.chipLabel, { color: active ? "#4A9FE8" : t.textSecondary }, active && { fontWeight: "700" }]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={[s.dateRow, { backgroundColor: "rgba(74,159,232,0.1)", borderColor: "rgba(74,159,232,0.25)" }]}>
                <Ionicons name="time-outline" size={15} color="#4A9FE8" />
                <Text style={[s.dateText, { color: t.textPrimary }]}>{formatDate(dueDate)}</Text>
              </View>
            </GlassCard>

            {/* Submit */}
            <TouchableOpacity
              style={[s.submitBtn, { borderColor: "rgba(255,255,255,0.4)", backgroundColor: t.submitBg }, isPending && { opacity: 0.65 }]}
              onPress={handleSubmit}
              disabled={isPending}
              activeOpacity={0.85}
            >
              <View style={[s.submitShine, { backgroundColor: t.glassShine }]} />
              <View style={s.submitInner}>
                {isPending ? (
                  <ActivityIndicator color={t.submitText} />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color={t.submitText} />
                    <Text style={[s.submitText, { color: t.submitText }]}>Create Task</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* ── Success Toast (rendered outside ScrollView so it floats) ── */}
      <Animated.View style={[s.toast, toastStyle]} pointerEvents="none">
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={s.toastInner}>
          <View style={s.toastIconWrap}>
            <Ionicons name="checkmark-circle" size={22} color="#32D74B" />
          </View>
          <View style={s.toastTextWrap}>
            <Text style={s.toastTitle}>Task Created!</Text>
            <Text style={s.toastSub}>Your task was added successfully.</Text>
          </View>
        </View>
        <View style={s.toastGlow} />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 18, paddingTop: 16, paddingBottom: 120, gap: 12 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.18 },
  blob1: { width: 320, height: 320, top: -80, left: -80 },
  blob2: { width: 260, height: 260, top: 200, right: -60 },
  blob3: { width: 200, height: 200, bottom: 100, left: 40 },
  glassCard: { borderRadius: 18, overflow: "hidden", borderWidth: 1 },
  glassShine: { position: "absolute", top: 0, left: 0, right: 0, height: 1 },
  glassContent: { padding: 16, gap: 10 },
  pageHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 4 },
  pageIconCard: { width: 48, height: 48 },
  pageTitle: { fontSize: 24, fontWeight: "800", letterSpacing: 0.3 },
  pageSubtitle: { fontSize: 13, marginTop: 1 },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, borderWidth: 1 },
  textArea: { minHeight: 90, paddingTop: 11 },
  errorText: { color: "#FF453A", fontSize: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipLabel: { fontSize: 13, fontWeight: "500" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, alignSelf: "flex-start" },
  dateText: { fontSize: 14, fontWeight: "600" },
  submitBtn: { borderRadius: 16, overflow: "hidden", borderWidth: 1, height: 54, marginTop: 4 },
  submitShine: { position: "absolute", top: 0, left: 0, right: 0, height: 1 },
  submitInner: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },

  // Toast
  toast: {
    position: "absolute",
    bottom: 110,
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(50,215,75,0.35)",
  },
  toastInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toastIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(50,215,75,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  toastTextWrap: { flex: 1, gap: 2 },
  toastTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  toastSub: { color: "rgba(255,255,255,0.55)", fontSize: 12 },
  toastGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#32D74B",
    shadowColor: "#32D74B",
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
