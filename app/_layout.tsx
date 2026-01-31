import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/sign-in" options={{ headerShown: false }} />
        <Stack.Screen
          name="course/[courseId]"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="unit/[unitId]" options={{ headerShown: false }} />
        <Stack.Screen name="materials/add" options={{ headerShown: false }} />
        <Stack.Screen name="study/review" options={{ headerShown: false }} />
        <Stack.Screen name="study/result" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>
    </>
  );
}
