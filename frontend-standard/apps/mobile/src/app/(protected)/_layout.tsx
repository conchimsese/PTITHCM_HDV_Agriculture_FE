import { Stack } from 'expo-router';
import { colors } from '@agri/design-tokens';
export default function ProtectedLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerTintColor: colors.brand900,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Ruộng Lúa Việt' }} />
      <Stack.Screen name="feature/[moduleId]" options={{ title: 'Chức năng' }} />
    </Stack>
  );
}
