import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Asset } from "expo-asset";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";
import AccessibilitySystem from "../components/ui/AccessibilitySystem";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Promise.all([
        Asset.fromModule(require("../assets/ui/LOGO.webp")).downloadAsync(),
        Asset.fromModule(require("../assets/ui/CLOUDS.webp")).downloadAsync(),
        Asset.fromModule(require("../assets/ui/TREE.webp")).downloadAsync(),
      ]);
      setReady(true);
      await SplashScreen.hideAsync();
    })();
  }, []);

  if (!ready) return null;

  return (
    <AccessibilityProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
      <AccessibilitySystem />
    </AccessibilityProvider>
  );
}

