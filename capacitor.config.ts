import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.talaqee.app',
  appName: 'Talaqee',
  webDir: 'public',
  server: {
    url: 'http://182.16.255.93:8083',
    cleartext: true
  }
};

export default config;
