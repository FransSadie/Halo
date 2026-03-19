import { ShieldCheck, Users, Waypoints } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { Badge } from "@/components/ui/badge";

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <ScreenShell
      title="Pause before you respond."
      subtitle="This app helps you check messages, numbers, and screenshots before you act."
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <Badge variant="secondary" className="w-fit rounded-full">Made for simple checking</Badge>
          <CardTitle className="text-[1.8rem]">What this app does</CardTitle>
          <CardDescription className="text-[1.15rem]">
            It helps you slow down, spot warning signs, and call someone you trust before you take action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { icon: ShieldCheck, title: "Check a suspicious message", body: "Paste the words here and get a plain-language result." },
            { icon: Users, title: "Keep trusted people close", body: "Save family or caregivers so you can reach them quickly." },
            { icon: Waypoints, title: "Get one clear next step", body: "The app suggests what to do next without technical jargon." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 rounded-[28px] bg-muted p-5">
              <div className="rounded-full bg-white p-3 shadow-soft">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-[1.35rem] font-bold leading-8">{item.title}</h2>
                <p className="text-[1.1rem] leading-8 text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-transparent bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-[1.8rem]">Important</CardTitle>
          <CardDescription className="text-[1.15rem] leading-8 text-primary-foreground/90">
            This app cannot stop every scam. It is a safety companion that helps you pause, verify, and ask for support.
          </CardDescription>
        </CardHeader>
      </Card>

      <Button size="lg" onClick={() => navigate("/onboarding/contacts")}>Set up trusted contacts</Button>
    </ScreenShell>
  );
};
