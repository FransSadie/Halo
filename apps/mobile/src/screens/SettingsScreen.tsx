import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import { notificationService } from "@/services/notificationService";
import { hasSupabaseConfig } from "@/services/supabaseClient";

export const SettingsScreen = () => {
  const navigate = useNavigate();
  const { reminders, accessibility, updateAccessibility, authStatus, authEmail, signOut } = useSafetyApp();
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
          <CardTitle>Accessibility</CardTitle>
          <CardDescription className="text-[1.1rem]">Make the app easier to read, hear, and use slowly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              size="sm"
              variant={accessibility.theme === "light" ? "default" : "outline"}
              onClick={() => void updateAccessibility({ theme: "light" })}
            >
              Light mode
            </Button>
            <Button
              size="sm"
              variant={accessibility.theme === "dark" ? "default" : "outline"}
              onClick={() => void updateAccessibility({ theme: "dark" })}
            >
              Dark mode
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["standard", "Standard"],
              ["large", "Large"],
              ["extra_large", "Extra large"],
            ].map(([value, label]) => (
              <Button
                key={value}
                size="sm"
                variant={accessibility.textScale === value ? "default" : "outline"}
                onClick={() => void updateAccessibility({ textScale: value as typeof accessibility.textScale })}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button size="sm" variant={accessibility.highContrast ? "default" : "outline"} onClick={() => void updateAccessibility({ highContrast: !accessibility.highContrast })}>
            {accessibility.highContrast ? "High contrast on" : "Turn on high contrast"}
          </Button>
          <Button size="sm" variant={accessibility.simplifiedMode ? "default" : "outline"} onClick={() => void updateAccessibility({ simplifiedMode: !accessibility.simplifiedMode })}>
            {accessibility.simplifiedMode ? "Simple wording on" : "Use simpler wording"}
          </Button>
          <Button size="sm" variant={accessibility.readAloud ? "default" : "outline"} onClick={() => void updateAccessibility({ readAloud: !accessibility.readAloud })}>
            {accessibility.readAloud ? "Read aloud on" : "Turn on read aloud"}
          </Button>
        </CardContent>
      </Card>

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
          <CardTitle>Account and data</CardTitle>
          <CardDescription className="text-[1.1rem]">
            {hasSupabaseConfig
              ? authStatus === "signed_in"
                ? `Signed in as ${authEmail || "your account"}. Contacts and checks can sync to Supabase.`
                : "Supabase is configured. Sign in to sync contacts and checks across devices."
              : "Running in local demo mode with storage in this browser."}
          </CardDescription>
        </CardHeader>
        {hasSupabaseConfig ? (
          <CardContent className="space-y-3">
            {authStatus === "signed_in" ? (
              <Button size="lg" variant="outline" onClick={() => void signOut()}>
                Sign out
              </Button>
            ) : (
              <Button size="lg" variant="outline" onClick={() => navigate("/signin")}>
                Sign in
              </Button>
            )}
          </CardContent>
        ) : null}
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
