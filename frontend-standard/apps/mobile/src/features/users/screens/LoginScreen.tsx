import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createDemoSession, setSession, setTokenPair } from '@agri/api-client';
import { roleLabels, type Role } from '@agri/contracts';
import { colors, radius } from '@agri/design-tokens';
import { env } from '../../../shared/config/env';
import { authApi, queryClient } from '../../../shared/api/runtime';
import { Button } from '../../../shared/ui/Button';
export function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function login() {
    setPending(true);
    setError('');
    try {
      const tokens = await authApi.login({ username: username.trim(), password });
      queryClient.clear();
      setTokenPair(tokens);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Đăng nhập thất bại.');
    } finally {
      setPending(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>RUỘNG LÚA VIỆT / MOBILE</Text>
        <Text style={styles.title}>Mùa vụ trong tầm tay.</Text>
        <Text style={styles.description}>Ứng dụng React Native riêng cho điện thoại.</Text>
        {env.dataSource === 'mock' ? (
          <>
            <Text style={styles.description}>Dữ liệu mẫu · Chọn vai trò để xem bộ khung.</Text>
            {(['FARMER', 'TRADER', 'ADMIN'] as Role[]).map((role) => (
              <Button
                key={role}
                title={roleLabels[role]}
                onPress={() => {
                  queryClient.clear();
                  setSession(createDemoSession(role));
                }}
              />
            ))}
          </>
        ) : (
          <>
            <Text>Tên đăng nhập</Text>
            <TextInput
              style={styles.input}
              accessibilityLabel="Tên đăng nhập"
              autoCapitalize="none"
              autoComplete="username"
              value={username}
              onChangeText={setUsername}
            />
            <Text>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              accessibilityLabel="Mật khẩu"
              secureTextEntry
              autoComplete="current-password"
              value={password}
              onChangeText={setPassword}
            />
            {!!error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            <Button
              title={pending ? 'Đang đăng nhập…' : 'Đăng nhập'}
              disabled={pending || !username.trim() || !password}
              onPress={() => void login()}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 24, paddingTop: 70, gap: 20 },
  kicker: { color: colors.brand700, fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { fontSize: 42, fontWeight: '700', color: colors.brand900 },
  description: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    padding: 14,
    backgroundColor: colors.card,
    fontSize: 16,
  },
  error: { color: colors.danger },
});
