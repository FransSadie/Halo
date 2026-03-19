import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { StatusBadge } from "@/components/StatusBadge";
import { useSafetyApp } from "@/hooks/useSafetyApp";

const resultIcon = {
  likely_safe: CheckCircle2,
  suspicious: AlertTriangle,
  high_risk: ShieldAlert,
};

export const ResultScreen = () => {
  const navigate = useNavigate();
  const { latestVerification } = useSafetyApp();

  if (!latestVerification) {
    return (
      <ScreenShell title="No result yet" subtitle="Check a message, number, or screenshot first.">
        <Button onClick={() => navigate("/home")}>Go to home</Button>
      </ScreenShell>
    );
  }

  const Icon = resultIcon[latestVerification.result.riskLevel];

  return (
    <ScreenShell title="Your result" subtitle="Use this result as a calm next step, not as a guarantee.">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-muted p-4">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-3">
              <StatusBadge risk={latestVerification.result.riskLevel} />
              <CardDescription className="text-[1.1rem]">{latestVerification.request.sourceLabel}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <CardTitle className="text-[1.8rem] leading-tight">{latestVerification.result.explanation}</CardTitle>
          <p className="text-[1.15rem] leading-9 text-muted-foreground">{latestVerification.result.suggestedAction}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Why we flagged it</CardTitle>
          <CardDescription className="text-[1.1rem]">These are the main warning signs the app noticed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestVerification.result.reasons.map((reason) => (
            <div key={reason} className="rounded-[24px] bg-muted px-5 py-4 text-[1.1rem] leading-8">
              {reason}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button size="lg" onClick={() => navigate("/contacts")}>Share with a trusted person</Button>
      <Button size="lg" variant="outline" onClick={() => navigate("/home")}>
        Back to home
      </Button>
    </ScreenShell>
  );
};
