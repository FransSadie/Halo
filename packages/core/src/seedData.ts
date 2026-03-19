import type { AppSeed } from "./types";

export const demoSeed: AppSeed = {
  user: {
    id: "user-1",
    firstName: "Martha",
    lastName: "Dlamini",
    phone: "+27 82 111 2222",
    email: "martha@example.com",
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  trustedContacts: [
    {
      id: "contact-1",
      name: "Lebo Dlamini",
      relation: "Daughter",
      phone: "+27 82 555 1000",
      email: "lebo@example.com",
      preferredContactMethod: "call",
      isPrimary: true,
    },
    {
      id: "contact-2",
      name: "Dr. Naidoo",
      relation: "Family friend",
      phone: "+27 82 555 2000",
      email: "naidoo@example.com",
      preferredContactMethod: "sms",
      isPrimary: false,
    },
  ],
  activity: [
    {
      id: "activity-1",
      createdAt: "2026-03-18T08:35:00.000Z",
      type: "text",
      label: "Text message about bank account",
      outcome: "high_risk",
      summary: "Asked for a one-time code and said it was urgent.",
    },
    {
      id: "activity-2",
      createdAt: "2026-03-17T15:00:00.000Z",
      type: "phone",
      label: "Unknown number from overseas",
      outcome: "suspicious",
      summary: "Unexpected caller asked for a return call.",
    },
    {
      id: "activity-3",
      createdAt: "2026-03-16T10:20:00.000Z",
      type: "screenshot",
      label: "Prize screenshot",
      outcome: "high_risk",
      summary: "Promised a reward after paying a small fee.",
    },
  ],
  reminders: [
    {
      id: "reminder-1",
      title: "Slow down",
      message: "Banks never ask for your OTP by text, call, or email.",
      cadence: "daily",
    },
    {
      id: "reminder-2",
      title: "Check first",
      message: "If a caller wants money or gift cards, hang up and check with family first.",
      cadence: "weekly",
    },
    {
      id: "reminder-3",
      title: "Protect your device",
      message: "Do not install remote access apps for strangers.",
      cadence: "weekly",
    },
  ],
  accessibility: {
    textScale: "standard",
    highContrast: false,
    simplifiedMode: false,
    readAloud: false,
    theme: "light",
  },
  scenarios: [
    {
      id: "scenario-1",
      title: "Fake bank alert",
      description: "Urgent text asking for a one-time code.",
      type: "text",
      content: "Urgent: your bank account will be locked today. Reply with your OTP immediately to secure it.",
    },
    {
      id: "scenario-2",
      title: "Unexpected caller",
      description: "Unknown number that says there is a legal issue.",
      type: "phone",
      content: "+1 999 123 4000",
    },
    {
      id: "scenario-3",
      title: "Prize screenshot",
      description: "Prize message asking for a gift card fee.",
      type: "screenshot",
      content: "Congratulations. You won a prize. Buy a gift card today to release your reward.",
    },
  ],
};
