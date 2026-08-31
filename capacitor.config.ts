import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.talaqee.app',
  appName: 'Talaqee',
  webDir: 'public',
  server: {
    url: 'https://app.talaqee.com/',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 100,
      launchAutoHide: true,
      launchFadeOutDuration: 200,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    GoogleAuth: {
      scopes: ["profile", "email"],
      serverClientId: "799984616839-2ur3dn8u55rbdsibesfe9td9pf92du6u.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    },
  }
};

export default config;
