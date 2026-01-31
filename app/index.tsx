import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAppStore } from "../src/store/useAppStore";
import { AnimatedSplash } from "../src/ui/components/AnimatedSplash";

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const user = useAppStore((state) => state.user);
  const initialized = useAppStore((state) => state.initialized);
  const init = useAppStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  if (showSplash) {
    return <AnimatedSplash onComplete={() => setShowSplash(false)} />;
  }

  if (!initialized) {
    return null;
  }

  if (!user) {
    return <Redirect href="/auth/sign-in" />;
  }

  return <Redirect href="/(tabs)" />;
}
