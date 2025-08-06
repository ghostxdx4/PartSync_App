// app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      {/* Screens */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)/hardwareInput" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)/RecommendationScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)/aboutScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(screens)/AdministrationScreen" options={{ headerShown: false }} />

      {/* Modals */}
      <Stack.Screen
        name="(modals)/settingsModal"
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="(modals)/AdminLoginModal"
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack>
  );
}
