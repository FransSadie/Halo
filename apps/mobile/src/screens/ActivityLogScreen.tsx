import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card";
import { ScreenShell } from "@/components/ScreenShell";
import { StatusBadge } from "@/components/StatusBadge";
import { useSafetyApp } from "@/hooks/useSafetyApp";
import { formatDateTime } from "@/lib/utils";

export const ActivityLogScreen = () => {
  const { activity } = useSafetyApp();

  return (
    <ScreenShell title="Activity log" subtitle="A calm history of recent checks. This view avoids technical wording.">
      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription className="text-[1.1rem]">Each check is saved with a simple label and time.</CardDescription>
        </CardHeader>
      </Card>

      {activity.map((entry) => (
        <Card key={entry.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-[1.35rem]">{entry.label}</CardTitle>
                <CardDescription className="mt-2 text-[1rem]">{formatDateTime(entry.createdAt)}</CardDescription>
              </div>
              <StatusBadge risk={entry.outcome} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[1.1rem] leading-8 text-muted-foreground">{entry.summary}</p>
          </CardContent>
        </Card>
      ))}
    </ScreenShell>
  );
};
