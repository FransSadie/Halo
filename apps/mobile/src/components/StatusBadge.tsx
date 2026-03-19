import { Badge } from "@/components/ui/badge";
import { riskLabel, riskTone } from "@/lib/utils";

export const StatusBadge = ({ risk }: { risk: "likely_safe" | "suspicious" | "high_risk" }) => (
  <Badge className={`px-4 py-2 text-base ${riskTone(risk)}`} variant="outline">
    {riskLabel(risk)}
  </Badge>
);
