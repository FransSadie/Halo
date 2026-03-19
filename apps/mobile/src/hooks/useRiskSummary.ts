import { useMemo } from "react";
import type { ActivityEntry, RiskLevel } from "@senior-scam-safety/core";

export const useRiskSummary = (activity: ActivityEntry[]) =>
  useMemo(
    () =>
      activity.reduce<Record<RiskLevel, number>>(
        (summary, entry) => {
          summary[entry.outcome] += 1;
          return summary;
        },
        {
          likely_safe: 0,
          suspicious: 0,
          high_risk: 0,
        },
      ),
    [activity],
  );
