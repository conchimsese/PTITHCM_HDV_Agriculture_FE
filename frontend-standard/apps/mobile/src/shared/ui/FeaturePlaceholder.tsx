import { ScrollView, Text, StyleSheet } from 'react-native';
import { colors } from '@agri/design-tokens';
export function FeaturePlaceholder({ label, owner }: { label: string; owner: string }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>CHƯA TRIỂN KHAI</Text>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.text}>Backend owner: {owner}.</Text>
      <Text style={styles.text}>
        Đây là màn hình bàn giao. Đọc docs/04_MODULES_VA_CHIA_VIEC.md, tạo components và hooks trong
        feature tương ứng; DTO/API đặt ở packages dùng chung.
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  content: { padding: 24, gap: 16 },
  kicker: { color: colors.brand700, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700', color: colors.ink },
  text: { fontSize: 16, lineHeight: 25, color: colors.muted },
});
