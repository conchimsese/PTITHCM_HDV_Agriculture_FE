import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { modulesForRole } from '@agri/contracts';
import { useSession } from '../../../features/users/hooks/useSession';
import { MarketplaceScreen } from '../../../features/trading/screens/MarketplaceScreen';
import { FeaturePlaceholder } from '../../../shared/ui/FeaturePlaceholder';
export default function FeatureRoute() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const session = useSession();
  const module = session && modulesForRole(session.role).find((item) => item.id === moduleId);
  if (!module) return <Text>Không tìm thấy màn hình hoặc chưa có quyền xem.</Text>;
  return (
    <>
      <Stack.Screen options={{ title: module.label }} />
      {module.id === 'marketplace' ? (
        <MarketplaceScreen />
      ) : (
        <FeaturePlaceholder label={module.label} owner={module.owner} />
      )}
    </>
  );
}
