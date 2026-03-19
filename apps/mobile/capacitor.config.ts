import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.seniorscamsafety.app",
  appName: "Senior Scam Safety",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_name",
      iconColor: "#14532D",
    },
  },
};

export default config;
