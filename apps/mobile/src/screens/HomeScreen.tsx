import { Bell, Camera, MessageSquareText, Phone, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { StatusBadge } from "@/components/StatusBadge";
import { useRiskSummary } from "@/hooks/useRiskSummary";
import { useSafetyApp } from "@/hooks/useSafetyApp";

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, reminders, activity, authStatus, authMode, accessibility } = useSafetyApp();
  const summary = useRiskSummary(activity);
  const subtitle = accessibility.simplifiedMode
    ? "If something feels strange, check it here before you do anything."
    : "Take a breath. If something feels rushed or strange, check it here before you act.";

  return (
    <ScreenShell
      title={`Hello, ${user.firstName}`}
      subtitle={subtitle}
    >
      {authStatus !== "signed_in" ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Sync across devices</CardTitle>
            <CardDescription className="text-[1.1rem]">
              You are using {authMode === "demo" ? "demo mode" : "a local session"}. Sign in if you want cloud backup for contacts and checks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" variant="outline" onClick={() => navigate("/signin")}>
              Sign in safely
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        <Button className="justify-start" size="lg" onClick={() => navigate("/check/text")}>
          <MessageSquareText className="h-7 w-7 shrink-0" />
          <div>
            <div>Check a message</div>
            <div className="text-base font-medium text-primary-foreground/85">Paste a text, email, or chat</div>
          </div>
        </Button>
        <Button className="justify-start" size="lg" variant="secondary" onClick={() => navigate("/check/phone")}>
          <Phone className="h-7 w-7 shrink-0" />
          <div>
            <div>Check a phone number</div>
            <div className="text-base font-medium text-secondary-foreground/80">Useful for unknown callers</div>
          </div>
        </Button>
        <Button className="justify-start" size="lg" variant="secondary" onClick={() => navigate("/check/screenshot")}>
          <Camera className="h-7 w-7 shrink-0" />
          <div>
            <div>Check a screenshot</div>
            <div className="text-base font-medium text-secondary-foreground/80">Describe what the picture says</div>
          </div>
        </Button>
        <Button className="justify-start" size="lg" variant="outline" onClick={() => navigate("/contacts")}>
          <Users className="h-7 w-7 shrink-0" />
          <div>
            <div>Contact a trusted person</div>
            <div className="text-base font-medium text-muted-foreground">Reach family or caregivers quickly</div>
          </div>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Safety reminder</CardTitle>
              <CardDescription className="mt-2 text-[1.15rem]">{reminders[0]?.message}</CardDescription>
            </div>
            <div className="rounded-full bg-accent p-3">
              <Bell className="h-7 w-7 text-primary" />
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent checks</CardTitle>
          <CardDescription className="text-[1.1rem]">A quick summary of what the app has flagged lately.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[24px] bg-muted px-4 py-4">
              <StatusBadge risk="likely_safe" />
              <span className="text-[1.2rem] font-bold">{summary.likely_safe}</span>
            </div>
            <div className="flex items-center justify-between rounded-[24px] bg-muted px-4 py-4">
              <StatusBadge risk="suspicious" />
              <span className="text-[1.2rem] font-bold">{summary.suspicious}</span>
            </div>
            <div className="flex items-center justify-between rounded-[24px] bg-muted px-4 py-4">
              <StatusBadge risk="high_risk" />
              <span className="text-[1.2rem] font-bold">{summary.high_risk}</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/activity")}>
            View activity log
          </Button>
        </CardContent>
      </Card>
    </ScreenShell>
  );
};
