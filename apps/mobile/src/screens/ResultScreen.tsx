import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShieldAlert, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { StatusBadge } from "@/components/StatusBadge";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import type { VerificationSession } from "@/hooks/safetyAppContextValue";
import { speechService } from "@/services/speechService";

const resultIcon = {
  likely_safe: CheckCircle2,
  suspicious: AlertTriangle,
  high_risk: ShieldAlert,
};

const ReviewChecklist = ({
  items,
  onReadyChange,
}: {
  items: string[];
  onReadyChange: (ready: boolean) => void;
}) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const reviewReady = useMemo(
    () => items.every((item) => checked[item]),
    [checked, items],
  );

  useEffect(() => {
    onReadyChange(reviewReady);
  }, [onReadyChange, reviewReady]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Before you act</CardTitle>
        <CardDescription className="text-[1.1rem]">
          Review these steps slowly. This helps reduce pressure before you reply or send anything.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setChecked((current) => {
                const next = { ...current, [item]: !current[item] };
                const ready = items.every((checkItem) => next[checkItem]);
                onReadyChange(ready);
                return next;
              })
            }
            className={`flex w-full items-center gap-4 rounded-[24px] border px-4 py-4 text-left text-[1.1rem] leading-8 ${
              checked[item] ? "border-emerald-400/40 bg-emerald-500/10" : "border-border bg-muted"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg font-bold ${
                checked[item] ? "border-emerald-500 bg-emerald-500 text-emerald-950" : "border-border bg-card text-muted-foreground"
              }`}
            >
              {checked[item] ? "X" : ""}
            </span>
            <span>{item}</span>
          </button>
        ))}
        {!reviewReady ? (
          <p className="text-[1rem] leading-7 text-muted-foreground">Complete the checklist first, then contact someone you trust.</p>
        ) : null}
      </CardContent>
    </Card>
  );
};

const ResultContent = ({
  latestVerification,
  onShare,
  onHome,
}: {
  latestVerification: VerificationSession;
  onShare: () => void;
  onHome: () => void;
}) => {
  const Icon = resultIcon[latestVerification.result.riskLevel];
  const [reviewReady, setReviewReady] = useState(!latestVerification.result.requiresReview);

  return (
    <>
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
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="secondary"
              fullWidth={false}
              onClick={() => speechService.speak(`${latestVerification.result.explanation}. ${latestVerification.result.suggestedAction}`)}
            >
              <Volume2 className="h-5 w-5" />
              Read aloud
            </Button>
            <Button size="sm" variant="outline" fullWidth={false} onClick={() => speechService.stop()}>
              <VolumeX className="h-5 w-5" />
              Stop
            </Button>
          </div>
        </CardContent>
      </Card>

      {latestVerification.result.requiresReview ? (
        <ReviewChecklist key={latestVerification.request.id} items={latestVerification.result.pauseChecklist} onReadyChange={setReviewReady} />
      ) : null}

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

      <Button size="lg" onClick={onShare} disabled={latestVerification.result.requiresReview && !reviewReady}>
        Share with a trusted person
      </Button>
      <Button size="lg" variant="outline" onClick={onHome}>
        Back to home
      </Button>
    </>
  );
};

export const ResultScreen = () => {
  const navigate = useNavigate();
  const { latestVerification, accessibility } = useSafetyApp();

  useEffect(() => {
    if (accessibility.readAloud && latestVerification) {
      speechService.speak(`${latestVerification.result.explanation}. ${latestVerification.result.suggestedAction}`);
    }

    return () => {
      speechService.stop();
    };
  }, [accessibility.readAloud, latestVerification]);

  if (!latestVerification) {
    return (
      <ScreenShell title="No result yet" subtitle="Check a message, number, or screenshot first.">
        <Button onClick={() => navigate("/home")}>Go to home</Button>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Your result" subtitle="Use this result as a calm next step, not as a guarantee.">
      <ResultContent
        key={latestVerification.request.id}
        latestVerification={latestVerification}
        onShare={() => navigate("/contacts")}
        onHome={() => navigate("/home")}
      />
    </ScreenShell>
  );
};
