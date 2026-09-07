import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anavandi.travels',
  appName: 'Anavandi Travels',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      backgroundColor: '#C41E3A',
      showSpinner: true,
      spinnerColor: '#F5E6C8',
    },
  },
};

export default config;
