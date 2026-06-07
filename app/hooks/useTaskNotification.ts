import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

// Configure how notifications appear when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleTaskCreatedNotification(title: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Task Created",
        body: `"${title}" has been added to your tasks.`,
        sound: true,
      },
      trigger: null,
    });
  } catch (e) {
    console.warn("[notifications] Could not schedule:", e);
  }
}

export async function scheduleTaskUpdatedNotification(title: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✏️ Task Updated",
        body: `"${title}" has been updated successfully.`,
        sound: true,
      },
      trigger: null,
    });
  } catch (e) {
    console.warn("[notifications] Could not schedule:", e);
  }
}

export async function scheduleTaskDeletedNotification(title: string): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🗑️ Task Deleted",
        body: `"${title}" has been removed from your tasks.`,
        sound: true,
      },
      trigger: null,
    });
  } catch (e) {
    console.warn("[notifications] Could not schedule:", e);
  }
}

export function useNotificationSetup() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
}
