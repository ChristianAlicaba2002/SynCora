import { scheduleTaskUpdatedNotification } from "@/app/hooks/useTaskNotification";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
import { useGetTaskById, useUpdateTask } from "../../../hooks/useTasks";
import { useTheme } from "../../../hooks/useTheme";

type Status   = "todo" | "in_progress" | "done";
type Priority = "low" | "medium" | "high";

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
function addDays(base: Date, n: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const { data: task, isLoading } = useGetTaskById(id);
  const { mutate: updateTask, isPending } = useUpdateTask();

  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [status,      setStatus]      = useState<Status>("todo");
  const [priority,    setPriority]    = useState<Priority>("medium");
  const [dueDate,     setDueDate]     = useState(new Date().toISOString());
  const [titleError,  setTitleError]  = useState("");
  const [descError,   setDescError]   = useState("");

  // Pre-fill form once task loads
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus((task.status as Status) ?? "todo");
      setPriority((task.priority as Priority) ?? "medium");
      setDueDate(task.dueDate);
    }
  }, [task]);

  const datePresets = [
    { label: "Today",    iso: addDays(new Date(), 0) },
    { label: "Tomorrow", iso: addDays(new Date(), 1) },
    { label: "+3 days",  iso: addDays(new Date(), 3) },
    { label: "+1 week",  iso: addDays(new Date(), 7) },
  ];

  const validate = () => {
    let valid = true;
    if (!title.trim())       { setTitleError("Title is required"); valid = false; } else setTitleError("");
    if (!description.trim()) { setDescError("Description is required"); valid = false; } else setDescError("");
    return valid;
  };

  const handleSave = () => {
    if (!validate() || !id) return;
    updateTask(
      { id, data: { title: title.trim(), description: description.trim(), status, priority, dueDate } },
      {
        onSuccess: () => {
          scheduleTaskUpdatedNotification(title.trim());
          router.back();
        },
        onError: (err) => console.error("Update task failed →", err),
      }
    );
  };

  function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
    return (
      <View style={[s.glassCard, { borderColor: t.glassBorder, backgroundColor: t.glassBg }, style]}>
        <BlurView intensity={18} tint={t.blurTint} style={StyleSheet.absoluteFill} />
        <View style={[s.glassShine, { backgroundColor: t.glassShine }]} />
        <View style={s.glassContent}>{children}</View>
      </View>
    );
  }

  function ChipGroup<T extends string>({
    options, selected, onSelect,
  }: {
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
              style={[
                s.chip,
                { borderColor: t.glassBorder, backgroundColor: t.inputBg },
                active && { borderColor: o.color, backgroundColor: `${o.color}22` },
              ]}
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

  if (isLoading) {
    return (
      <LinearGradient colors={["#050d1a", "#0a1628", "#0d1f3c"]} style={s.screen}>
        <SafeAreaView style={s.center}>
          <View style={s.loaderRing}>
            <ActivityIndicator color="#4A9FE8" size="large" />
          </View>
          <Text style={s.loadingText}>Loading task…</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <View style={[s.screen, { backgroundColor: t.screen }]}>
      {/* Blobs */}
      <View style={[s.blob, s.blob1, { backgroundColor: "#4A9FE8" }]} />
      <View style={[s.blob, s.blob2, { backgroundColor: "#F5A623" }]} />
      <View style={[s.blob, s.blob3, { backgroundColor: t.blob3 }]} />

      <SafeAreaView style={s.safe} edges={["top"]}>
        {/* Header */}
        <View style={s.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          <BlurView intensity={20} tint="dark" style={s.topBarPill}>
            <Ionicons name="create-outline" size={14} color="#4A9FE8" />
            <Text style={s.topBarLabel}>Edit Task</Text>
          </BlurView>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isPending}
            style={[s.saveBtn, isPending && { opacity: 0.6 }]}
            activeOpacity={0.8}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            {isPending
              ? <ActivityIndicator size="small" color="#4A9FE8" />
              : <Text style={s.saveBtnText}>Save</Text>
            }
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <GlassCard>
              <Text style={[s.fieldLabel, { color: t.textSecondary }]}>TITLE</Text>
              <TextInput
                style={[s.input, { backgroundColor: t.inputBg, borderColor: titleError ? "#FF453A" : t.inputBorder, color: t.inputText }]}
                placeholder="Task title"
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
                style={[s.input, s.textArea, { backgroundColor: t.inputBg, borderColor: descError ? "#FF453A" : t.inputBorder, color: t.inputText }]}
                placeholder="Task description"
                placeholderTextColor={t.placeholder}
                value={description}
                onChangeText={(v) => { setDescription(v); setDescError(""); }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isPending}
              />
              {descError ? <Text style={s.errorText}>{descError}</Text> : null}
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
                {datePresets.map((p) => {
                  const active = new Date(dueDate).toDateString() === new Date(p.iso).toDateString();
                  return (
                    <TouchableOpacity
                      key={p.label}
                      onPress={() => setDueDate(p.iso)}
                      activeOpacity={0.7}
                      style={[
                        s.chip,
                        { borderColor: t.glassBorder, backgroundColor: t.inputBg },
                        active && { borderColor: "#4A9FE8", backgroundColor: "rgba(74,159,232,0.15)" },
                      ]}
                    >
                      <Text style={[s.chipLabel, { color: active ? "#4A9FE8" : t.textSecondary }, active && { fontWeight: "700" }]}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={s.dateDisplay}>
                <Ionicons name="time-outline" size={15} color="#4A9FE8" />
                <Text style={[s.dateText, { color: t.textPrimary }]}>{formatDate(dueDate)}</Text>
              </View>
            </GlassCard>

            {/* Bottom save button */}
            <TouchableOpacity
              style={[s.submitBtn, isPending && { opacity: 0.65 }]}
              onPress={handleSave}
              disabled={isPending}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#2a6fc4", "#4A9FE8"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              />
              <View style={s.submitInner}>
                {isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={s.submitText}>Save Changes</Text>
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

const s = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  loaderRing: { width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: "rgba(74,159,232,0.3)", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(74,159,232,0.08)" },
  loadingText: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
  blob: { position: "absolute", borderRadius: 999, opacity: 0.12 },
  blob1: { width: 320, height: 320, top: -80, left: -80 },
  blob2: { width: 260, height: 260, top: 200, right: -60 },
  blob3: { width: 200, height: 200, bottom: 100, left: 40 },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10, paddingTop: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 14, overflow: "hidden", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  topBarPill: { flexDirection: "row", alignItems: "center", gap: 6, overflow: "hidden", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  topBarLabel: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  saveBtn: { overflow: "hidden", borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(74,159,232,0.5)", minWidth: 60, alignItems: "center", justifyContent: "center" },
  saveBtnText: { color: "#4A9FE8", fontWeight: "700", fontSize: 14 },
  scroll: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120, gap: 12 },
  glassCard: { borderRadius: 18, overflow: "hidden", borderWidth: 1 },
  glassShine: { position: "absolute", top: 0, left: 0, right: 0, height: 1 },
  glassContent: { padding: 16, gap: 10 },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" },
  input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, borderWidth: 1 },
  textArea: { minHeight: 90, paddingTop: 11 },
  errorText: { color: "#FF453A", fontSize: 12 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  chipLabel: { fontSize: 13, fontWeight: "500" },
  dateDisplay: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "rgba(74,159,232,0.25)", backgroundColor: "rgba(74,159,232,0.1)", alignSelf: "flex-start" },
  dateText: { fontSize: 14, fontWeight: "600" },
  submitBtn: { borderRadius: 16, overflow: "hidden", height: 54, marginTop: 4 },
  submitInner: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { fontSize: 16, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
});
