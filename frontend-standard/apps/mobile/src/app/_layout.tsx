import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@agri/design-tokens';
import { queryClient } from '../shared/api/runtime';
import { useSession } from '../features/users/hooks/useSession';

export default function RootLayout() {
  const session = useSession();
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(protected)" />
          </Stack.Protected>
          <Stack.Protected guard={!session}>
            <Stack.Screen name="login" />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
