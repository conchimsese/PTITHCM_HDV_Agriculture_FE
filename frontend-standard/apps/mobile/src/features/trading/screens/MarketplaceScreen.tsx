import { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { feedParamsSchema } from '@agri/contracts';
import { colors, radius } from '@agri/design-tokens';
import { useListingFeed } from '../hooks/useListingFeed';
import { ListingCard } from '../components/ListingCard';
import { Button } from '../../../shared/ui/Button';
import { env } from '../../../shared/config/env';
export function MarketplaceScreen() {
  const [params, setParams] = useState({ lat: 10.125, lng: 106.45, radius: 15, page: 0, size: 2 });
  const [lat, setLat] = useState('10.125');
  const [lng, setLng] = useState('106.45');
  const [radiusValue, setRadius] = useState('15');
  const [validation, setValidation] = useState('');
  const query = useListingFeed(params);
  function filter() {
    const parsed = feedParamsSchema.safeParse({
      ...params,
      lat: Number(lat),
      lng: Number(lng),
      radius: Number(radiusValue),
      page: 0,
    });
    if (!lat.trim() || !lng.trim() || !radiusValue.trim() || !parsed.success) {
      setValidation('Kiểm tra tọa độ và bán kính lớn hơn 0.');
      return;
    }
    setValidation('');
    setParams(parsed.data);
  }
  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
      data={query.data?.items ?? []}
      keyExtractor={(item) => item.listingId}
      renderItem={({ item }) => <ListingCard listing={item} />}
      refreshing={query.isRefetching}
      onRefresh={() => {
        void query.refetch();
      }}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Nguồn lúa gần bạn</Text>
          <Text style={styles.text}>
            {env.dataSource === 'mock'
              ? 'Dữ liệu mẫu · bán kính km'
              : 'Nguồn dữ liệu Gateway · đơn vị bán kính theo backend'}
          </Text>
          <Text>Vĩ độ</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="Vĩ độ"
            keyboardType="numbers-and-punctuation"
            value={lat}
            onChangeText={setLat}
          />
          <Text>Kinh độ</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="Kinh độ"
            keyboardType="numbers-and-punctuation"
            value={lng}
            onChangeText={setLng}
          />
          <Text>Bán kính</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="Bán kính"
            keyboardType="decimal-pad"
            value={radiusValue}
            onChangeText={setRadius}
          />
          <Button title="Áp dụng bộ lọc" onPress={filter} />
          {!!validation && <Text accessibilityRole="alert">{validation}</Text>}
          <Text style={styles.text}>
            Trang {params.page + 1} · {query.data?.totalElements ?? 0} bài đăng
          </Text>
        </View>
      }
      ListEmptyComponent={
        query.isPending ? (
          <ActivityIndicator accessibilityLabel="Đang tải nguồn hàng" color={colors.brand700} />
        ) : query.isError ? (
          <View style={styles.header}>
            <Text accessibilityRole="alert">{query.error.message}</Text>
            <Button
              title="Thử lại"
              onPress={() => {
                void query.refetch();
              }}
            />
          </View>
        ) : (
          <Text style={styles.text}>Chưa có nguồn hàng trong bán kính này.</Text>
        )
      }
      ListFooterComponent={
        query.isSuccess ? (
          <View style={styles.footer}>
            <Button
              title="Trang trước"
              disabled={params.page === 0}
              onPress={() => setParams({ ...params, page: params.page - 1 })}
            />
            <Button
              title="Trang sau"
              disabled={params.page + 1 >= query.data.totalPages}
              onPress={() => setParams({ ...params, page: params.page + 1 })}
            />
          </View>
        ) : undefined
      }
    />
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  header: { gap: 12, marginBottom: 10 },
  title: { fontSize: 30, fontWeight: '700', color: colors.brand900 },
  text: { fontSize: 15, color: colors.muted, lineHeight: 24 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.control,
    padding: 12,
    fontSize: 16,
  },
  footer: { gap: 12, paddingVertical: 16 },
});
