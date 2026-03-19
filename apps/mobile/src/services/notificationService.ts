import { LocalNotifications } from "@capacitor/local-notifications";
import type { SafetyReminder } from "@senior-scam-safety/core";

const buildBody = (reminder: SafetyReminder) => `${reminder.title}: ${reminder.message}`;

export const notificationService = {
  async requestPermission() {
    try {
      return await LocalNotifications.requestPermissions();
    } catch {
      return { display: "denied" as const };
    }
  },

  async scheduleReminderExamples(reminders: SafetyReminder[]) {
    try {
      await LocalNotifications.schedule({
        notifications: reminders.slice(0, 3).map((reminder, index) => ({
          id: index + 1,
          title: "Senior Scam Safety",
          body: buildBody(reminder),
          schedule: { at: new Date(Date.now() + (index + 1) * 60_000) },
        })),
      });
      return true;
    } catch {
      return false;
    }
  },
};

// Native reminder integrations can later be extended here for Android background jobs
// and iOS notification categories without changing screen components.
