export type RiskLevel = "likely_safe" | "suspicious" | "high_risk";

export type VerificationType = "text" | "phone" | "screenshot";

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface AccessibilitySettings {
  textScale: "standard" | "large" | "extra_large";
  highContrast: boolean;
  simplifiedMode: boolean;
  readAloud: boolean;
  theme: "light" | "dark";
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  preferredContactMethod: "call" | "sms" | "whatsapp";
  isPrimary: boolean;
}

export interface VerificationRequest {
  id: string;
  createdAt: string;
  type: VerificationType;
  sourceLabel: string;
  content: string;
  screenshotName?: string;
  extractedText?: string;
}

export interface VerificationResult {
  riskLevel: RiskLevel;
  score: number;
  reasons: string[];
  explanation: string;
  suggestedAction: string;
  pauseChecklist: string[];
  requiresReview: boolean;
  trustedMatchName?: string;
}

export interface ActivityEntry {
  id: string;
  createdAt: string;
  type: VerificationType;
  label: string;
  outcome: RiskLevel;
  summary: string;
}

export interface SafetyReminder {
  id: string;
  title: string;
  message: string;
  cadence: "daily" | "weekly" | "monthly";
}

export interface VerificationScenario {
  id: string;
  title: string;
  description: string;
  type: VerificationType;
  content: string;
}

export interface AppSeed {
  user: User;
  trustedContacts: TrustedContact[];
  activity: ActivityEntry[];
  reminders: SafetyReminder[];
  scenarios: VerificationScenario[];
  accessibility: AccessibilitySettings;
}
