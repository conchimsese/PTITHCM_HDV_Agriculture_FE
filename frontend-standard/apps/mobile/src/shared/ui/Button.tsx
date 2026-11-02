import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '@agri/design-tokens';
export function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, (disabled || pressed) && styles.dim]}
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brand700,
    borderRadius: radius.control,
    padding: 14,
    minHeight: 48,
  },
  label: { color: colors.card, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  dim: { opacity: 0.5 },
});
