import { Alert, ScrollView, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { modulesForRole, roleLabels } from '@agri/contracts';
import { colors } from '@agri/design-tokens';
import { useSession, logout } from '../features/users/hooks/useSession';
import { Button } from '../shared/ui/Button';
export function HomeScreen() {
  const session = useSession();
  if (!session) return null;
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>{session.isDemo ? 'DỮ LIỆU MẪU' : 'KẾT NỐI GATEWAY'}</Text>
      <Text style={styles.title}>Xin chào, {roleLabels[session.role].toLowerCase()}.</Text>
      <Text style={styles.text}>
        App mobile riêng. Mở Thị trường để xem luồng mẫu chạy được; các mục còn lại đang chờ triển
        khai.
      </Text>
      {modulesForRole(session.role)
        .filter((item) => item.id !== 'dashboard')
        .map((item) => (
          <Button
            key={item.id}
            title={item.label}
            onPress={() =>
              router.push({ pathname: '/feature/[moduleId]', params: { moduleId: item.id } })
            }
          />
        ))}
      <Button
        title="Đăng xuất"
        onPress={() => {
          void logout().catch(() =>
            Alert.alert('Phiên trên máy đã xóa', 'Máy chủ chưa xác nhận thu hồi token.'),
          );
        }}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: { padding: 24, gap: 16 },
  kicker: { color: colors.brand700, fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '700', color: colors.brand900 },
  text: { fontSize: 16, lineHeight: 25, color: colors.muted },
});
