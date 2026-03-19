import { useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import { notificationService } from "@/services/notificationService";
import { hasSupabaseConfig } from "@/services/supabaseClient";

export const SettingsScreen = () => {
  const { reminders } = useSafetyApp();
  const [status, setStatus] = useState<string>("Notifications are not scheduled yet.");

  const enableReminders = async () => {
    const permission = await notificationService.requestPermission();

    if (permission.display !== "granted") {
      setStatus("Notification permission was not granted on this device.");
      return;
    }

    const success = await notificationService.scheduleReminderExamples(reminders);
    setStatus(success ? "Three demo reminders were scheduled." : "Local reminders could not be scheduled in the browser.");
  };

  return (
    <ScreenShell title="Settings" subtitle="Simple controls for reminders, data mode, and future account options.">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Reminder examples</CardTitle>
          <CardDescription className="text-[1.1rem]">Banks never ask for your OTP. Do not install remote access apps for strangers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button size="lg" onClick={enableReminders}>Schedule demo reminders</Button>
          <p className="text-[1rem] leading-7 text-muted-foreground">{status}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data mode</CardTitle>
          <CardDescription className="text-[1.1rem]">
            {hasSupabaseConfig ? "Supabase is configured for auth and cloud sync." : "Running in local demo mode with storage in this browser."}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Future device protection</CardTitle>
          <CardDescription className="text-[1.1rem]">
            Android call screening and iOS message filtering can attach through Capacitor plugins and native modules later.
          </CardDescription>
        </CardHeader>
      </Card>
    </ScreenShell>
  );
};
