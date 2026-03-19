import { demoSeed, type ActivityEntry, type TrustedContact, type User } from "@senior-scam-safety/core";
import { hasSupabaseConfig } from "./supabaseClient";
import { storage } from "./storage";

const STORAGE_KEY = "senior-scam-safety-state";

export interface AppStateSnapshot {
  user: User;
  trustedContacts: TrustedContact[];
  activity: ActivityEntry[];
  onboardingComplete: boolean;
}

const fallbackState: AppStateSnapshot = {
  user: demoSeed.user,
  trustedContacts: demoSeed.trustedContacts,
  activity: demoSeed.activity,
  onboardingComplete: false,
};

export const appRepository = {
  loadState() {
    return storage.get<AppStateSnapshot>(STORAGE_KEY, fallbackState);
  },

  saveState(state: AppStateSnapshot) {
    storage.set(STORAGE_KEY, state);
  },

  async syncTrustedContacts(contacts: TrustedContact[]) {
    if (!hasSupabaseConfig) {
      return { mode: "mock" as const, saved: contacts.length };
    }

    // Future production sync attaches here once auth and Supabase tables are enabled.
    return { mode: "supabase" as const, saved: contacts.length };
  },
};
