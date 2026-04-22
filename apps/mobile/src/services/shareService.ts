import type { TrustedContact } from "@senior-scam-safety/core";
import type { VerificationSession } from "@/hooks/safetyAppContextValue";

const buildShareText = (contact: TrustedContact, latestVerification: VerificationSession | null) => {
  const intro = `Hi ${contact.name}, I want help checking something that may be suspicious.`;

  if (!latestVerification) {
    return `${intro} Please call or message me when you can.`;
  }

  return [
    intro,
    `Item: ${latestVerification.request.sourceLabel}`,
    `Risk: ${latestVerification.result.riskLevel.replace("_", " ")}`,
    `Why: ${latestVerification.result.reasons.join(" ")}`,
    `Suggested next step: ${latestVerification.result.suggestedAction}`,
  ].join("\n");
};

export const shareService = {
  buildShareText,

  async shareToTrustedContact(contact: TrustedContact, latestVerification: VerificationSession | null) {
    const text = buildShareText(contact, latestVerification);

    if (navigator.share) {
      await navigator.share({
        title: "Senior Scam Safety",
        text,
      });
      return { mode: "native" as const, text };
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return { mode: "clipboard" as const, text };
    }

    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(text)}`;
    return { mode: "sms" as const, text };
  },
};
