import type { RiskLevel, TrustedContact, VerificationRequest, VerificationResult } from "./types";

interface RuleMatch {
  matched: boolean;
  weight: number;
  reason: string;
}

const matchText = (content: string, patterns: RegExp[], weight: number, reason: string): RuleMatch => ({
  matched: patterns.some((pattern) => pattern.test(content)),
  weight,
  reason,
});

const normalize = (value: string) => value.trim().toLowerCase();
const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

interface EvaluationContext {
  trustedContacts?: TrustedContact[];
}

const createChecklist = (content: string, riskLevel: RiskLevel) => {
  const checks = ["Pause for a moment before you reply."];

  if (/otp|password|pin|verification code/i.test(content)) {
    checks.push("Do not share any code, password, or PIN.");
  }

  if (/gift card|crypto|bitcoin|wallet address|send money|payment/i.test(content)) {
    checks.push("Do not send money, gift cards, or crypto.");
  }

  if (/remote access|anydesk|teamviewer|screen share/i.test(content)) {
    checks.push("Do not install apps or allow remote access.");
  }

  if (riskLevel !== "likely_safe") {
    checks.push("Contact a trusted person before you act.");
  }

  return Array.from(new Set(checks));
};

export const evaluateVerification = (request: VerificationRequest, context: EvaluationContext = {}): VerificationResult => {
  const content = normalize(request.content);
  const trustedMatch =
    request.type === "phone"
      ? context.trustedContacts?.find((contact) => {
          const requestDigits = normalizePhone(request.content);
          const contactDigits = normalizePhone(contact.phone);
          return (
            requestDigits === contactDigits ||
            requestDigits.endsWith(contactDigits.replace(/^\+/, "")) ||
            contactDigits.endsWith(requestDigits.replace(/^\+/, ""))
          );
        })
      : undefined;

  if (trustedMatch) {
    return {
      riskLevel: "likely_safe",
      score: 0,
      reasons: [`This number matches your trusted contact ${trustedMatch.name}.`],
      explanation: "This number belongs to someone in your trusted contacts.",
      suggestedAction: "If the call still feels unusual, hang up and call the person back using the saved contact.",
      pauseChecklist: ["If anything feels unusual, call the contact back yourself using the saved number."],
      requiresReview: false,
      trustedMatchName: trustedMatch.name,
    };
  }

  const ruleMatches: RuleMatch[] = [
    matchText(content, [/urgent/i, /immediately/i, /act now/i, /today only/i, /final warning/i], 20, "The message uses urgency to push a quick decision."),
    matchText(content, [/keep this secret/i, /do not tell/i, /private matter/i], 20, "The message asks for secrecy, which is a common scam tactic."),
    matchText(content, [/otp/i, /one[- ]time password/i, /verification code/i, /password/i, /pin number/i], 30, "It asks for a password, PIN, or one-time code."),
    matchText(content, [/gift card/i, /itunes card/i, /steam card/i, /bitcoin/i, /crypto/i, /wallet address/i], 30, "It asks for gift cards or cryptocurrency."),
    matchText(content, [/remote access/i, /install anydesk/i, /teamviewer/i, /screen share/i, /let me log in/i], 35, "It asks for remote access to a device or account."),
    matchText(content, [/bank account/i, /confirm your account/i, /social security/i, /tax refund/i], 10, "It asks for sensitive personal or banking information."),
    matchText(content, [/unknown caller/i, /spoof/i, /international number/i], 10, "The phone number pattern looks unusual or untrusted."),
    matchText(content, [/bit\.ly/i, /tinyurl/i, /shorturl/i], 15, "It includes a shortened link, which can hide a dangerous destination."),
  ];

  const phoneIndicators = request.type === "phone"
    ? [
        matchText(content, [/^\+?\d{1,3}[\s-]?\d{7,}$/], 5, "The number format is valid, but not recognized."),
        matchText(content, [/0000/, /9999/, /1234/], 15, "The number contains a suspicious repeating pattern."),
        matchText(content, [/^\+(?!27)/], 10, "The number is from outside your local country code."),
        matchText(content, [/^\d{4,6}$/], 20, "Short-code numbers can be used for misleading premium or phishing messages."),
      ]
    : [];

  const matches = [...ruleMatches, ...phoneIndicators].filter((rule) => rule.matched);
  const score = matches.reduce((total, rule) => total + rule.weight, 0);

  let riskLevel: RiskLevel = "likely_safe";
  if (score >= 50) {
    riskLevel = "high_risk";
  } else if (score >= 20) {
    riskLevel = "suspicious";
  }

  if (request.type === "phone" && score === 0) {
    return {
      riskLevel: "suspicious",
      score: 20,
      reasons: ["This phone number is not known to your trusted list yet."],
      explanation: "We could not confirm this number. If you were not expecting the call, pause before calling back.",
      suggestedAction: "Ask a trusted person to help you verify the number before you respond.",
      pauseChecklist: ["Do not call back yet.", "Check with a trusted person first."],
      requiresReview: true,
    };
  }

  if (request.type === "screenshot" && score === 0) {
    return {
      riskLevel: "suspicious",
      score: 25,
      reasons: ["A screenshot should be reviewed carefully before taking action."],
      explanation: "Screenshots can hide pressure tactics. Read the message slowly and avoid tapping links right away.",
      suggestedAction: "Share the screenshot with a trusted person and do not send money, codes, or passwords yet.",
      pauseChecklist: ["Do not tap links in the screenshot.", "Show it to a trusted person before you respond."],
      requiresReview: true,
    };
  }

  const explanationByRisk: Record<RiskLevel, string> = {
    likely_safe: "This does not show strong scam signals, but it is still smart to slow down before acting.",
    suspicious: "This message shows warning signs that deserve caution.",
    high_risk: "This looks strongly like a scam or dangerous request.",
  };

  const suggestedActionByRisk: Record<RiskLevel, string> = {
    likely_safe: "Take your time. If money, passwords, or codes are involved, verify with the company directly.",
    suspicious: "Do not reply yet. Check with a trusted person or contact the company using an official number.",
    high_risk: "Stop and do not reply, click links, send money, share codes, or allow remote access. Contact a trusted person now.",
  };

  return {
    riskLevel,
    score,
    reasons: matches.map((rule) => rule.reason),
    explanation: explanationByRisk[riskLevel],
    suggestedAction: suggestedActionByRisk[riskLevel],
    pauseChecklist: createChecklist(content, riskLevel),
    requiresReview: riskLevel !== "likely_safe",
  };
};
