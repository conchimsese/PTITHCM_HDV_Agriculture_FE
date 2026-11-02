import { View, Text, StyleSheet } from 'react-native';
import type { ListingFeedItem } from '@agri/contracts';
import { colors, radius } from '@agri/design-tokens';
export function ListingCard({ listing }: { listing: ListingFeedItem }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.seed}>{listing.seedType}</Text>
        <Text>{listing.distanceKm.toFixed(1)} km</Text>
      </View>
      <Text style={styles.title}>{listing.farmer.fullName}</Text>
      <Text style={styles.text}>
        Ruộng lúa · {listing.plotLat.toFixed(3)}, {listing.plotLng.toFixed(3)}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: 20,
    gap: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  seed: { color: colors.brand700, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: colors.ink },
  text: { fontSize: 15, color: colors.muted },
});
